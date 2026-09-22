# AI Engineering Executable Problems

These five exercises turn the August 2026 research backlog into small TypeScript
contracts that run locally with Bun. They are reference implementations, not a
claim that process-local memory is a production database or policy system.

Use the structure in [Learner Note Standards](./LEARNER_NOTE_STANDARDS.md) when
recording what failed, which invariant fixed it, and when to revisit it.

Run the complete exercise suite:

```bash
bun run test:ai-exercises
```

## 1. Audit And Repair An AI-Generated Change

Files: `src/ai/exercises/pr-repair.ts` and the `AI-generated pull request
repair` tests.

Beginner explanation: an AI-generated implementation can look plausible while
breaking a caller-owned array, admitting invalid data, mishandling duplicate
revisions, and claiming the wrong complexity. Convert review expectations into
contract probes so the review is repeatable.

Contract:

- Return only validated changes.
- Return at most one entry per path: its greatest revision.
- Order by descending risk, then path for deterministic ties.
- Never mutate caller input.
- Reject an invalid limit.

Dry run: revisions 1 and 2 of `api.ts` collapse to revision 2; a failed
`database.ts` change is removed; valid unique paths are sorted without calling
`sort()` on the input.

The audit reports the proposed fixture's hidden correctness regression, missing
duplicate-path edge case, input mutation, and misleading `O(n)` explanation.
The repaired selector uses `O(n + u log u)` time and `O(u)` auxiliary space for
`n` changes and `u` unique valid paths.

Failure prompts:

- What if two records claim the same path and revision but have different data?
- Should failed validation exclude a change or block the entire deployment?
- Is the comparator stable and deterministic across runtimes?

Production upgrade: run property-based and mutation tests against the contract,
attach findings to exact diff lines, and require a human owner for decisions
that cannot be proved mechanically.

## 2. Stateless Least-Privilege Tool Endpoint

File: `src/ai/exercises/stateless-tool-endpoint.ts`.

Beginner explanation: stateless means the request does not depend on a server
session. Authentication, authorization, schema validation, tool execution, and
idempotency are explicit dependencies or request data, so another instance can
serve the next request.

Request order is security-sensitive:

1. Parse a Bearer credential and authenticate a principal.
2. Validate the selected tool's input schema.
3. Check the exact permission required by that tool.
4. Scope the idempotency key to the authenticated principal and hash the
   validated payload.
5. Execute once, persist the result envelope, and audit every response or
   replay.

Invariant: an invalid, unauthorized, or payload-mismatched request never
executes the tool. The same principal, key, and validated payload replays the
recorded result; another principal has a separate scope.

The boundary is `O(1)` expected time and space per process-local receipt lookup,
excluding authentication and tool execution. Edge cases include a malformed
Bearer header, empty fields, an unsupported tool, a key reused for different
input, an in-flight duplicate, and execution failure.

Production upgrade: replace the in-memory receipt repository with an atomic SQL
or Redis claim, store request hashes and status codes durably, expire records by
policy, export structured audit events, rotate credentials, and enforce rate,
tenant, network, and data-classification controls outside the handler.

## 3. Resumable Agent Checkpoints With Fencing And Approval

File: `src/ai/exercises/agent-checkpoint-store.ts`.

Beginner explanation: a worker receives a time-bounded lease receipt. A later
worker may resume the last saved checkpoint after timeout. The old receipt must
then be rejected or the old worker could overwrite newer progress.

State flow:

```text
ready -> running -> completed
           |
           +-> lease expires -> running with a new receipt
           |
           +-> high-risk action -> awaiting approval -> ready
```

Invariant: only the current unexpired receipt can save or complete a run. A
high-risk approval is tied to the exact action and consumed once.

Dry run: worker A saves step 1 and times out; worker B acquires a new receipt
and resumes step 1; A's late save is fenced out. Worker B requests a production
deployment, loses its lease while approval is pending, and resumes only after a
reviewer approves that exact deployment.

Map operations are `O(1)` expected time. Each checkpoint read or write uses
`O(s)` time and space to clone state of size `s`. Test lease-boundary times,
duplicate run IDs, stale receipts, stale approval IDs, altered actions, and
repeated approval use.

Production upgrade: persist checkpoints and monotonic fencing tokens in a
transactional store, use a durable approval ledger with authenticated approver
identity, record state transitions, encrypt sensitive state, add retention, and
make side-effect consumers reject stale fencing tokens too.

## 4. Authorization-First Retrieval

File: `src/ai/exercises/acl-retrieval.ts`.

Beginner explanation: retrieval ranking must never inspect documents that the
principal cannot read. Filtering results after ranking can leak titles, scores,
timing, embeddings, or cross-tenant content.

Invariant: tenant and principal ACL checks happen before the ranker callback.
Returned text is a typed `untrusted-retrieved-text` value with
`treatAsInstructions: false`; retrieved prose never becomes a trusted system
instruction merely because it scored highly.

Dry run: Alice searches three documents. Only the document in Alice's tenant
whose ACL names Alice reaches the scorer. A cross-tenant secret and Bob's
same-tenant document are invisible to both ranking and output.

Complexity is `O(d * a + v log v)`, where `d` is document count, `a` is average
ACL length, and `v` is visible document count. Auxiliary space is `O(v)`.
Exercise empty queries, invalid limits, zero/non-finite scores, deterministic
ties, long ACLs, prompt-injection text, and a principal removed during a query.

Production upgrade: push tenant and ACL predicates into the database or vector
query, use authorization snapshots or policy versions, prevent embedding and
cache side channels, re-check access before response delivery, and log denied
resource IDs without logging sensitive document text.

## 5. Multi-Signal AI Evaluation Harness

File: `src/ai/exercises/evaluation-harness.ts`.

Beginner explanation: one attractive response is a demo, not an evaluation.
The harness requires multiple uniquely named scenarios and reports task
success, unsafe tool calls, latency, cost, rollback, and human corrections.

For every case it measures elapsed time around the runner and records:

- whether the task succeeded;
- every tool call and whether policy authorized it;
- model/tool cost in USD;
- whether the result required rollback;
- how many human corrections were needed;
- runner errors as failed case results rather than an aborted report.

The summary includes success, rollback, correction, and unsafe-tool-call rates,
total/average cost, average latency, and nearest-rank p95 latency. Aggregation is
`O(c log c)` time because percentile calculation sorts `c` latency values and
uses `O(c)` space.

Edge cases include duplicate case IDs, fewer than two cases, runner exceptions,
no tool calls, floating-point cost totals, and invalid negative/non-finite
telemetry.

Production upgrade: persist versioned datasets and traces, separate development
and holdout sets, add task-specific rubrics and calibrated human review, report
confidence intervals and slices, track model/prompt/tool versions, and gate
deployment on safety and rollback thresholds rather than a single blended
score.

## Review Cadence

- Day 0: make each focused test pass from a stub without reading the reference.
- Day 1: explain the invariant and one failure mode aloud.
- Day 3: add one adversarial test to each exercise.
- Day 7: replace one process-local dependency with a durable interface design.
- Day 14: run a mock review and defend the security and observability tradeoffs.

Record weak spots in your learner notes and revisit failures before adding new
scenarios.
