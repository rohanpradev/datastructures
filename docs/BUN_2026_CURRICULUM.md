# Bun 1.3.14 Learning Curriculum

This track maps the current Bun documentation and release line to runnable
backend, tooling, testing, and system-design practice. The repository pins
`bun@1.3.14`, the latest published release as of this review on July 14, 2026.

Read [BUN_RUNTIME_GUIDE.md](../src/node-concepts/bun-runtime/BUN_RUNTIME_GUIDE.md)
for step-by-step examples and use this document as the coverage and interview
question map.

## Why The Current Release Matters

The recent Bun line adds several capabilities worth learning instead of
treating Bun only as a faster script runner:

- Bun 1.3 established the unified `Bun.SQL` API, native Redis, package catalogs,
  frontend development, and security improvements.
- 1.3.6-1.3.8 added `Bun.Archive`, JSONC/JSON5/JSONL, richer profiling output,
  and native Markdown.
- 1.3.10-1.3.12 added browser-target standalone HTML, a native REPL, cron,
  WebView, and continued Markdown/runtime improvements.
- 1.3.13 added test file isolation, worker-process parallelism, sharding,
  changed-file selection, and lower-memory installs.
- 1.3.14 added `Bun.Image`, isolated-install global-store improvements, and
  experimental HTTP/2 and HTTP/3 client/server work.

Release features still need production judgment. Experimental protocols,
runtime-specific APIs, and OS-level scheduling require compatibility tests and
an exit plan before they become architectural dependencies.

Official release reference: [Bun blog](https://bun.com/blog).

## Coverage Matrix

| Capability | Learn | Repository lab | Production question |
| --- | --- | --- | --- |
| Runtime and TypeScript | direct TS execution, module resolution, environment, Node compatibility | `tsconfig.json`, concept tests | Which static checks still run separately? |
| Files and binary data | lazy `Bun.file`, `Bun.write`, streams, MIME, Blob/typed arrays | `file-system.ts` | Can the path or payload exhaust memory/disk? |
| Glob and tooling | scan, match, stable output | file lab, docs validator | How are ignores and symlinks handled? |
| HTTP server | routes, params, methods, errors, lifecycle, metrics | `server.ts` | What owns TLS, graceful drain, timeouts, limits? |
| WebSocket | upgrade, shared handlers, pub/sub, backpressure | `pub-sub.ts` | What happens across instances and to slow clients? |
| Image | metadata, resize, encode, worker isolation | `image-processing.ts` | What are pixel, format, CPU, path, and timeout limits? |
| Security | password hashing, crypto hash, cookies, CSRF, secrets | `security.ts`, `modern-apis.ts` | What is the threat model and key/secret lifecycle? |
| SQL and SQLite | pooling, tagged templates, transactions, local state | `sqlite.ts`, SQL notes | What is source of truth, retry, migration, pool policy? |
| Redis | cache, counters, pub/sub, distributed primitives | guide discussion | What happens on eviction, reconnect, failover, hot keys? |
| JSON5/JSONL | human config, streaming records, partial parse semantics | `modern-apis.ts` | Where is runtime validation and malformed-input policy? |
| Markdown | HTML/ANSI/custom/React rendering | `modern-apis.ts` | Is input trusted, sanitized, and URL-filtered? |
| Archive | in-memory/write/extract/filter tar data | `modern-apis.ts` | Are paths trusted; should extraction be sandboxed? |
| Cron | preview, in-process job, OS registration | `modern-apis.ts` | Who prevents overlap/duplicates and owns retry/history? |
| Shell and spawn | escaped shell interpolation vs direct argv/process control | shell/process labs | Which input chooses executable, env, path, or permissions? |
| Package manager | lockfile, workspaces, isolated linker, minimum age, audit | `bunfig.toml` | How are lifecycle scripts, provenance, and scanners controlled? |
| Test runner | mocks, fake time, snapshots, coverage, randomization, isolation, parallel/shard/changed | package scripts and tests | Which state leaks across files and how is CI partitioned? |
| Bundler/compile | plugins, bytecode, metafile, standalone executables/HTML | guided extension | What remains dynamic and platform-specific? |
| Diagnostics | debugger, CPU/heap profiles, async stacks | guided extension | Can an incident be reproduced with symbols and context? |

## Four-Stage Track

### Stage 1: Runtime Fluency

Study:

- `Bun.file`, `Bun.write`, `Bun.Glob`;
- `Bun.env`, `Bun.sleep`, `Bun.randomUUIDv7`;
- event loop, Promise combinators, cancellation, and bounded concurrency;
- TypeScript execution versus type checking;
- Node compatibility and when a Node-specific package still makes sense.

Exit test: build a CLI that reads validated input, scans files, produces stable
output, handles cancellation, and passes `bun run typecheck`.

### Stage 2: Backend APIs

Study:

- `Bun.serve` routing, errors, lifecycle, TLS placement, metrics;
- WebSocket shared handlers, topic pub/sub, limits, drain/backpressure;
- cookies, passwords, hashing, CSRF, and local secret storage boundaries;
- SQLite for local durable state; `Bun.SQL` and Redis for shared production
  state;
- process and worker isolation for CPU/external work.

Exit test: explain why an in-memory cache, limiter, pub/sub channel, or session
store stops being correct after the second process starts.

### Stage 3: Data And Content Pipelines

Study:

- strict validation around JSON5 and JSONL;
- partial chunks and streaming buffer ownership;
- Markdown raw HTML and URL safety;
- archive filtering versus filesystem extraction;
- image pixel/format/resource limits;
- S3/object-storage streams and range requests.

Run:

```bash
bun test src/node-concepts/test/bun-runtime.test.ts -t "Modern Bun API Patterns"
```

Exit test: trace an untrusted upload/import from bytes to validation, storage,
transformation, response, deletion, and audit.

### Stage 4: Production Tooling

Study:

- lockfile and frozen installs;
- lifecycle-script trust and minimum release age;
- isolated linker/global store and monorepo catalogs;
- `bun test --randomize`, `--rerun-each`, `--isolate`, `--parallel`, `--shard`,
  and `--changed`;
- coverage thresholds, JUnit output, snapshots, mocks, and fake time;
- standalone compile targets, bytecode/metafile analysis, CPU/heap profiles;
- graceful process/server/worker shutdown.

Useful commands:

```bash
bun run docs:check
bun run test:changed
bun run test:isolated
bun run test:parallel
bun test --shard=1/2
bun test --shard=2/2
bun run test:concepts:smoke
```

Do not add retries to make deterministic failing tests green. Use retry and
rerun features to classify external/transient failures and expose flakiness;
then remove shared state or nondeterminism.

## API Decision Guide

### Bun Shell Or Bun.spawn?

Use Bun Shell for readable cross-platform automation where escaped template
interpolation is useful. Use `Bun.spawn` for an explicit command array, streams,
exit status, cancellation, signals, and resource usage. In both cases, validate
which executable, path, environment name, and permission the caller can choose.

### bun:sqlite Or Bun.SQL?

Use `bun:sqlite` for embedded/local-first tools, teaching, tests, and one-host
state. Use `Bun.SQL` for shared PostgreSQL/MySQL/SQLite access with async pooling
and production connectivity. Neither API decides migrations, isolation level,
retry safety, indexes, backups, or ownership for you.

### In-Process Cron Or Durable Scheduler?

`Bun.cron(schedule, callback)` shares process state and does not survive process
exit. OS-level registration survives the calling process but still lacks a
distributed workflow engine's lease, history, retry, backfill, and multi-step
state. Use the smallest tool whose failure semantics meet the job's contract.

### Markdown Renderer Or Sanitizer?

`Bun.markdown` parses and renders Markdown. Parser flags can disable raw HTML and
filter dangerous tags, but public content may still need a dedicated sanitizer,
URL protocol policy, CSP, and safe link handling. Parsing is not authorization.

### JSONL.parse Or parseChunk?

Use `parse` for convenient whole inputs when partial-result semantics are
acceptable. Use `parseChunk` when stream boundaries, consumed offsets, syntax
errors, and incomplete tails must be explicit. Always validate each parsed
`unknown` value against the domain schema.

## Important Bun Questions

### Runtime And Compatibility

1. Why can Bun execute TypeScript without proving it type-correct?
2. Which `tsconfig` options align Bun's bundler-style module resolution?
3. How does JavaScriptCore affect compatibility assumptions made for V8?
4. When should a backend retain Node LTS instead of moving to Bun?
5. What belongs in a compatibility test matrix for native addons and frameworks?

### HTTP, WebSocket, And Concurrency

6. Why does one shared server WebSocket handler reduce per-connection overhead?
7. How do `pendingRequests`, `pendingWebSockets`, and subscriber counts help but
   fall short of complete observability?
8. Why does async I/O not protect the server from CPU-bound JavaScript?
9. When should work use a Worker, subprocess, external queue, or separate service?
10. How do backpressure and a `drain` callback change WebSocket send behavior?
11. How do you stop accepting traffic and drain in-flight work during deploy?
12. What is the risk of enabling experimental HTTP/2 or HTTP/3 in a critical path?

### Data And Security

13. Why is `Bun.file()` called lazy?
14. When does reading `.text()` or `.bytes()` become a memory-risk decision?
15. Why is `Bun.password` appropriate for passwords but `Bun.hash` is not?
16. What does a CSRF token protect, and what does it not protect?
17. Why is local `Bun.secrets` not a production deployment secret manager?
18. How do tagged SQL templates prevent value injection, and why are dynamic
    table/column identifiers still dangerous?
19. When must Redis increment-plus-expiry be atomic?
20. Why is Redis pub/sub insufficient for durable work delivery?
21. What can go wrong when extracting an untrusted archive?
22. Why should JSON5/JSONL results remain `unknown` until validated?
23. Does disabling raw Markdown HTML fully sanitize public content?

### Testing And Tooling

24. What state does `--isolate` protect between test files?
25. How does `--parallel` differ from `test.concurrent`?
26. When should CI use `--shard`, and how is shard balance measured?
27. How does `--changed` choose focused tests, and why is a full gate still needed?
28. How do randomized order and a recorded seed expose hidden coupling?
29. When are snapshots helpful, and when do they hide weak assertions?
30. What does coverage miss about behavior, concurrency, and failure paths?
31. Why are lifecycle scripts a supply-chain trust boundary?
32. What does `minimumReleaseAge` reduce, and which supply-chain risks remain?
33. What changes when the isolated linker/global store is used in a monorepo?
34. What must be verified in a cross-compiled standalone executable?

### Scheduling And Operations

35. Why can an in-process cron job run twice after a multi-instance deployment?
36. What does UTC scheduling avoid and what product-time-zone work remains?
37. How do idempotency, leases, fencing, and misfire policy affect scheduled jobs?
38. Which CPU, heap, async-stack, and request signals would you capture in an
    incident?
39. How are subprocesses, workers, prepared statements, timers, sockets, and
    servers cleaned up on success, error, timeout, and shutdown?
40. Which Bun-native convenience would you deliberately avoid coupling to, and
    why?

## Extension Labs

Add these only after the current focused tests are mastered:

1. Stream a large JSONL file in chunks with a retained remainder and record
   number/byte limits.
2. Build an upload route that validates content type, byte count, image pixels,
   and timeout before object storage.
3. Add cache-aside single-flight behavior and simulate a cache outage against a
   bounded database pool.
4. Add SQL/Redis integration tests behind explicit environment flags so default
   CI remains self-contained.
5. Build and inspect a standalone executable on every target OS in CI.
6. Split the full test suite into measured shards and keep duration balanced.
7. Add CPU/heap profile runbooks for an intentionally blocking/leaking lab.

## Official References

- [Bun documentation](https://bun.com/docs)
- [Bun 1.3.14 release](https://bun.com/blog/bun-v1.3.14)
- [HTTP server](https://bun.com/docs/runtime/http/server)
- [WebSockets](https://bun.com/docs/runtime/http/websockets)
- [File I/O](https://bun.com/docs/runtime/file-io)
- [Image](https://bun.com/docs/runtime/image)
- [SQL](https://bun.com/docs/runtime/sql)
- [Redis](https://bun.com/docs/runtime/redis)
- [JSONL](https://bun.com/docs/runtime/jsonl)
- [Markdown](https://bun.com/docs/runtime/markdown)
- [Archive](https://bun.com/docs/runtime/archive)
- [Cron](https://bun.com/docs/runtime/cron)
- [CSRF](https://bun.com/docs/runtime/csrf)
- [Secrets](https://bun.com/docs/runtime/secrets)
- [Test runner](https://bun.com/docs/test)
- [Test configuration](https://bun.com/docs/test/configuration)
- [Package manager security scanner API](https://bun.com/docs/pm/security-scanner-api)
- [Isolated installs](https://bun.com/docs/pm/isolated-installs)
- [Single-file executables](https://bun.com/docs/bundler/executables)
