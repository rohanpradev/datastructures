# TypeScript AI Tutor

This repository includes a local-first, durable TypeScript engineering tutor built with Bun, AI SDK 7, LangGraph, Drizzle ORM 1.0 RC, Scalar, and MCP v2.

The design intentionally separates durable workflow state from the model's bounded tool loop and exposes four deliberately distinct orchestration modes:

```text
JSON API ─┐                       ┌─ Graph API workflow
          ├─> TutorOrchestrator ──┼─ Functional API entrypoint + tasks
MCP v2  ──┘                       ├─ bounded supervisor -> one specialist
                                 └─ stateful handoff -> active specialist
                                              │
                                      AI SDK ToolLoopAgent
                                              │
                                Drizzle messages, runs, checkpoints
```

The outer LangGraph owns workflow order, checkpoints, retries, and thread identity. The inner AI SDK agent owns only model/tool iteration. This prevents a model loop from becoming the persistence or transport layer.

## Quick start

1. Install dependencies and copy the environment template:

   ```bash
   bun install
   cp .env.example .env
   ```

2. Set `AI_GATEWAY_API_KEY`. `AI_MODEL` is a provider-neutral AI Gateway model ID in `provider/model` format. The default is `openai/gpt-5.5`; a DeepSeek model can be selected through the same setting without changing the graph.

3. Generate a migration after schema changes, migrate, and start the service:

   ```bash
   bun run db:generate
   bun run db:migrate
   bun run ai:dev
   ```

4. Open `http://127.0.0.1:3001/docs` for the self-hosted Scalar reference. The OpenAPI 3.1 document is available at `http://127.0.0.1:3001/openapi.json`.

The service deliberately binds to loopback. Put authentication, authorization, request limits, and TLS at a trusted gateway before exposing it beyond the local machine.

## Interfaces

| Interface | Endpoint | Purpose |
|---|---|---|
| Health | `GET /health` | Runtime status and component generations |
| Tutor | `POST /v1/tutor/runs` | Run and persist one selected orchestration turn |
| Orchestration | `GET /v1/orchestration/patterns` | Inspect modes, tradeoffs, and specialist profiles |
| Thread | `GET /v1/threads/{threadId}` | Read persisted UI message parts |
| Conversations | `GET /v1/threads?limit=20&offset=0` | Browse saved conversations, newest activity first |
| Run status | `GET /v1/threads/{threadId}/runs/{runId}` | Inspect persisted status, timings, and aggregate token usage |
| Resources | `POST /v1/resources/search` | Deterministic trusted-source search |
| OpenAPI | `GET /openapi.json` | OpenAPI 3.1 source |
| Scalar | `GET /docs` | Interactive API reference |
| MCP | `POST /mcp` | MCP v2 Streamable HTTP exchange |

Example tutor request:

```bash
curl -X POST http://127.0.0.1:3001/v1/tutor/runs \
  -H "content-type: application/json" \
  -d '{"prompt":"Explain when to use a discriminated union instead of a class hierarchy."}'
```

Pass the returned `threadId` in a later request to continue the durable conversation. Set `orchestration` to `workflow` (default), `functional`, `supervisor`, or `swarm`:

```json
{
  "orchestration": "supervisor",
  "prompt": "Design a durable LangGraph agent with bounded MCP tools"
}
```

The response records the selected mode, specialist, routing reason, and any handoff source so orchestration is observable rather than hidden in a prompt.

Conversation pages return `{ threads, nextOffset }`. The default page size is
20, the maximum is 100, and `nextOffset: null` marks the final page. Follow
`nextOffset` to continue browsing. Activity can reorder offset pages, so restart
from zero to refresh the list while other conversations are running.

Requests for the same thread share one active-run guard across REST, MCP, and
all orchestration modes. A concurrent REST request receives `409 thread_busy`;
retry after the active turn finishes. Separate threads can run concurrently.
This guard is scoped to one server process; multi-process hosting needs a
shared lease or transaction-backed admission mechanism. Calling the graph
classes directly bypasses the transport orchestrator's guard.

JSON requests are limited to 64 KiB while streaming, including requests without
`Content-Length`. Invalid JSON/UTF-8 returns 400, oversized bodies return 413,
and invalid models or prompts return 422. Malformed path UUIDs return 400.
The configured default model remains fixed for the lifetime of the registry.
Run usage totals include every model step, and run-status responses redact
provider error details. Run IDs are returned when a synchronous request completes;
the status endpoint supports later inspection, not asynchronous submission.

The server allows 120 seconds of idle time to accommodate the agent's
90-second budget and drains HTTP requests before closing MCP and SQLite.

## Orchestration policy

- `workflow` uses the explicit `StateGraph`: `retrieve_context -> route_specialist -> generate_answer -> persist_turn`. It is the default because most requests do not benefit from multi-agent overhead.
- `functional` uses a real LangGraph `entrypoint` and replayable `task` units for preparation, retrieval, model generation, and persistence. External calls and side effects live inside tasks so durable replay does not repeat completed work.
- `supervisor` uses a bounded, deterministic router to select exactly one typed specialist. It does not add a second LLM call merely to route a request.
- `swarm` uses the same specialist registry but persists `activeSpecialist` in the graph checkpoint. A later turn either stays with that specialist or records a stateful handoff.

The specialist contexts are `typescript-language`, `runtime-platform`, `ai-architecture`, `testing-quality`, and `generalist`. They share the same provider-neutral AI SDK model boundary, read-only tools, persistence, and safety limits.

The project does not install `@langchain/langgraph-swarm` today. Its current TypeScript package documentation says it supports the older prebuilt `createReactAgent` and has not been tested with LangChain's newer `createAgent`. The local handoff implementation follows the documented state-machine pattern without coupling this service to that compatibility gap. Likewise, a custom bounded supervisor is a better fit than adding `@langchain/langgraph-supervisor` plus another provider abstraction solely for deterministic routing.

## MCP v2 surface

The MCP server uses `@modelcontextprotocol/server` 2.x and the 2026-07-28 per-request Streamable HTTP design. A fresh server instance is constructed per exchange. The endpoint supports current clients and the SDK's stateless compatibility path for 2025-era clients.

It exposes:

- `ask_typescript_tutor`: runs and persists the shared graph.
- `search_typescript_resources`: deterministic, read-only resource lookup.
- `typescript://resources/catalog`: the complete curated catalog.
- `typescript://orchestration/patterns`: modes, tradeoffs, and specialist profiles.
- `review-typescript` and `explain-typescript`: reusable typed prompts.

The MCP boundary validates Host and Origin with the SDK's official helpers. Tool annotations describe read-only, destructive, idempotent, and open-world behavior. There are no shell, arbitrary network, or unrestricted file-system tools.

## Persistence and Drizzle policy

All application reads and writes use Drizzle's typed query builder. This includes tutor threads, UI-message parts, run telemetry, checkpoints, pending writes, conflict handling, filtering, and transactions.

There are two intentionally lower-level database operations:

- Drizzle Kit owns versioned SQL migration files.
- `bun:sqlite` applies connection-only pragmas for foreign keys, busy timeout, and WAL mode.

No application data path contains a hand-written raw SQL query. `src/ai/sqlite-checkpoint.ts` implements LangGraph's checkpointer contract directly over Drizzle tables, including composite keys and pending writes. Its plain JSON serializer is restricted to service-owned JSON state and does not revive arbitrary constructors.

The project pins both `drizzle-orm` and `drizzle-kit` to `1.0.0-rc.4`, as requested, so their migration and runtime behavior stay aligned.

## File map

| File | Responsibility |
|---|---|
| `src/ai/api.ts` | Web-standard JSON, Scalar, OpenAPI, and MCP routing |
| `src/ai/json.ts` | Bounded JSON parsing and safe error responses |
| `src/ai/model.ts` | AI SDK 7 bounded `ToolLoopAgent` and model boundary |
| `src/ai/orchestration.ts` | Mode catalog, specialist registry, deterministic routing, and runner dispatch |
| `src/ai/persistence.ts` | Typed Drizzle repository and migration bootstrap |
| `src/ai/registry.ts` | Model validation and curated authoritative resources |
| `src/ai/schema.ts` | Drizzle tables, indexes, constraints, and inferred types |
| `src/ai/sqlite-checkpoint.ts` | Drizzle-backed LangGraph checkpointer |
| `src/ai/state.ts` | Zod request, response, resource, metrics, and graph state schemas |
| `src/ai/graphs/typescript-tutor.ts` | Explicit durable graph and service facade |
| `src/ai/graphs/functional-tutor.ts` | LangGraph Functional API entrypoint and replayable tasks |
| `src/ai/mcp.ts` | MCP v2 tools, resources, prompts, transport, and validation |
| `src/ai/openapi.ts` | OpenAPI 3.1 and Scalar HTML configuration |
| `src/ai/server.ts` | Composition root and graceful shutdown |

The file is named `persistence.ts` (correct spelling) rather than the requested `persistance.ts` typo.

## Guardrails and operational limits

- Zod validates every public request and every AI/MCP tool input.
- Request bodies are capped at 64 KiB and prompts at 16,000 characters.
- Agent runs stop after eight steps and apply total, per-step, and per-tool timeouts.
- Model output is capped, retries are bounded, and tools have stable ordering for provider caching.
- Only curated resource URLs may be cited through tools; tools cannot browse arbitrary URLs.
- Checkpoint runs use explicit `thread_id` and graph recursion limits.
- Completed messages are appended idempotently by run ID inside a typed transaction.
- Unknown internal errors are logged server-side without returning their details to clients.
- SQLite uses foreign keys, a busy timeout, and WAL for file-backed databases.

For a public deployment, add authenticated principals, per-principal thread authorization, rate limiting, structured OpenTelemetry export, a production database/checkpointer, encrypted secrets, and retention controls. The loopback service does not pretend those external controls already exist.

## Research and design references

The implementation follows current primary documentation and borrows architectural ideas—not copied code—from several production TypeScript harnesses:

- [AI SDK 7 announcement](https://vercel.com/changelog/ai-sdk-7), [agent guide](https://ai-sdk.dev/docs/agents/building-agents), and [tool guide](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling)
- [LangGraph Graph API](https://docs.langchain.com/oss/javascript/langgraph/graph-api), [Functional API](https://docs.langchain.com/oss/javascript/langgraph/functional-api), [persistence guide](https://docs.langchain.com/oss/javascript/langgraph/persistence), and [workflow/agent patterns](https://docs.langchain.com/oss/javascript/langgraph/workflows-agents)
- [LangChain multi-agent overview](https://docs.langchain.com/oss/javascript/langchain/multi-agent), [subagents](https://docs.langchain.com/oss/javascript/langchain/multi-agent/subagents), [handoffs](https://docs.langchain.com/oss/javascript/langchain/multi-agent/handoffs), [router](https://docs.langchain.com/oss/javascript/langchain/multi-agent/router), and [custom workflows](https://docs.langchain.com/oss/javascript/langchain/multi-agent/custom-workflow)
- [LangGraph Supervisor](https://github.com/langchain-ai/langgraph-supervisor-js) and [LangGraph Swarm](https://www.npmjs.com/package/@langchain/langgraph-swarm) were evaluated as reference implementations; the service keeps its provider-neutral bounded router and stateful handoffs for the compatibility reasons above
- [Drizzle with Bun SQLite](https://orm.drizzle.team/docs/get-started/bun-sqlite-new) and [Drizzle Kit overview](https://orm.drizzle.team/docs/kit-overview)
- [MCP TypeScript SDK v2](https://ts.sdk.modelcontextprotocol.io/v2/) and [2026-07-28 Streamable HTTP specification](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports#streamable-http)
- [Scalar API Reference](https://github.com/scalar/scalar/tree/main/packages/api-reference)
- [Vercel AI SDK](https://github.com/vercel/ai) for provider-neutral typed boundaries and bounded tools
- [Deep Agents JS](https://github.com/langchain-ai/deepagentsjs) for LangGraph-native planning/context separation and tool-boundary security
- [OpenAI Agents SDK for JavaScript](https://github.com/openai/openai-agents-js) for explicit orchestration, guardrails, approvals, and tracing boundaries
- [Awesome DeepSeek Agent](https://github.com/deepseek-ai/awesome-deepseek-agent) for the official DeepSeek agent ecosystem catalog

DeepSeek-Coder itself is primarily model-serving and evaluation code, so it is not used as an application harness. The provider-neutral registry makes a current DeepSeek model a configuration choice rather than an architectural dependency.

## Verification

Run focused and repository-wide checks:

```bash
bun test src/ai/test/ai-service.spec.ts
bun run typecheck
bun run lint
bun run docs:check
bun test
```

The focused suite uses an in-memory migrated SQLite database and a fake model. It verifies deterministic retrieval, Graph and Functional API execution, supervisor routing, persisted handoffs, typed persistence, checkpoint hydration, run metrics, JSON/OpenAPI/Scalar routes, input rejection, and MCP negotiation without spending model tokens.
