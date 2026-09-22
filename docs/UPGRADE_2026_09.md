# September 2026 maintenance update

Package metadata was checked against the live npm registry on September 22,
2026. CI uses the same Bun version as `packageManager`.

| Component | Version |
|---|---|
| Bun runtime and types | 1.4.2 |
| TypeScript | 7.0.2 |
| Biome | 2.5.14 |
| LangChain core | 1.2.12 |
| LangGraph | 1.4.17 |
| LangGraph checkpoint | 1.1.5 |
| MCP server | 2.0.0 |
| AI SDK | 7.0.109 |
| Scalar API reference | 1.70.0 |
| Zod | 4.6.5 |
| Drizzle ORM and Kit | 1.0.0-rc.4 |

Drizzle follows the official `rc` channel for v1, with ORM and Kit pinned
together. The npm `latest` tags still refer to pre-v1 stable releases. The
commit-specific `rc5` builds were not selected. Existing v1 migration files
and local databases remain compatible with this matched RC pair.

LangChain core and checkpoint are now explicit dependencies because the
source imports them directly. This removes reliance on transitive hoisting.

Scalar's dependency tree pins an older AI SDK provider utility. A version-scoped
override changes only `@ai-sdk/provider-utils@4.0.5` to the patched `4.0.33`,
addressing [GHSA-866g-f22w-33x8](https://github.com/advisories/GHSA-866g-f22w-33x8).
AI SDK 7 keeps its separate 5.x utility. Remove the override when Scalar's
upstream dependencies incorporate the patch. Dependency overrides do not
rebuild Scalar's precompiled browser bundle; this is a dependency-tree fix.
[Bun documents version-scoped overrides](https://bun.sh/docs/pm/overrides).
They require the current lockfile format, so use the pinned runtime.

Scalar 1.70.0 also brings `@scalar/json-magic@0.14.0`, which pins
`undici@7.24.4`. A second version-scoped override selects `7.29.0`, addressing
the audit's twelve advisories, including
[response desynchronization](https://github.com/advisories/GHSA-8xcm-r25x-g524)
and [cache directive disclosure](https://github.com/advisories/GHSA-4cwx-7wf7-3272).
The AI SDK already resolves to `7.29.0`. Remove this override when Scalar's
dependency stops pinning the vulnerable version. As above, an override changes
installed dependencies and does not rebuild a precompiled browser bundle.

The normal 24-hour minimum release age remains configured. The initial update
used `bun install --minimum-release-age 0` to include the explicitly requested
latest releases; ordinary installs should use `bun install --frozen-lockfile`.
The September 22 refresh used the same one-time option for newly published
LangGraph, Scalar and AI SDK versions; the normal age policy remains enabled.

## September 22 interview additions

- `SingleFlight`: concurrent request coalescing and rejection cleanup.
- `FencedRegister`: expired ownership, monotonic tokens and stale-write rejection.
- `TransactionalOutbox`: real SQLite rollback, persistent pending events and
  publish/ack duplicate-delivery behavior.
- `shortestSubarrayAtLeastK`: prefix sums and monotonic deque with signed input.
- `maxScheduledProfit`: weighted scheduling with DP and binary search.

All five participate in focused practice discovery. The
[interview refresh guide](./INTERVIEW_UPGRADE_2026_09.md) supplies worked traces,
six architecture prompts, capacity calculations and a two-week practice route.

## Correctness and functionality

- Bounded streaming JSON parsing rejects oversized bodies before buffering
  the whole request and handles UTF-8 sequences split across chunks.
- Tutor concurrency admission prevents overlapping turns from sharing stale
  history or racing checkpoint state. It covers REST and MCP in one process.
- Model selection honors the configured default and validates explicit IDs
  at the input boundary. Token usage aggregates all agent steps.
- Conversation browsing adds bounded pagination and deterministic ordering;
  run lookup exposes persisted status and metrics scoped to its parent thread.
- Scalar's unversioned asset revalidates after upgrades instead of being
  cached as immutable for a year.
- HTTP idle time accommodates the agent budget, and shutdown drains active
  requests before closing SQLite.
- Promise queues reject non-integer, non-finite, and unsafe concurrency values.
- Retry budgets and backoff values are validated. `signal` cancels delays
  and stops future attempts; `maxDelayMs` caps linear backoff at 30 seconds
  by default. Pass the same signal into the underlying operation to cancel it.

API details and concurrency limits are in
[the tutor guide](./TYPESCRIPT_AI_TUTOR.md). Runtime exercises live in
[the Node/Bun guide](../src/node-concepts/README.md).

## Verification

September 22 results on Windows with Bun 1.4.2:

- `bun run check`: lint, typecheck, local documentation links and all **2,483**
  tests passed. Biome reported nine informational suggestions, no errors.
- `bun run practice:audit`: **297** targets cover **302/302** eligible test blocks.
- `bun run practice:validate`: all **297** generated targets passed stub and
  reference validation, including the five new exercises.
- `bun audit`: no vulnerabilities found across **341** checked packages.
- `bun outdated`: no outdated direct dependencies reported under the configured
  release policy; direct release tags were also checked against the registry.
- `bun install --frozen-lockfile`: passed without lockfile changes.

Linux CI was not run locally. The existing CI matrix covers Linux and Windows.

```bash
bun install --frozen-lockfile
bun run check
bun run test:ai
bun audit
bun outdated
```

The test suite uses a fake tutor model or stubs the SDK generation boundary;
it does not issue paid provider calls. It exercises real SQLite migrations,
checkpoints, REST handlers, MCP exchanges, and the installed Scalar asset.
