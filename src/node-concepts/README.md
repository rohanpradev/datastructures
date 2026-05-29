# Node, Bun, Async, and Backend System Design Guide

This folder teaches interview-grade JavaScript runtime concepts with runnable Bun/TypeScript examples and tests. Read one topic, inspect the implementation, then run the focused test file.

## Topic Index

| Topic | File | Why it matters in interviews |
| --- | --- | --- |
| Event loop ordering | `basics/event-loop.ts` | Explains sync work, microtasks, timers, and why CPU work blocks requests |
| Promises | `basics/promise.ts`, `basics/promise-types.ts` | Covers `all`, `allSettled`, `race`, `any`, chaining, and error recovery |
| Async generators | `basics/generator-function.ts` | Shows cancellable step-by-step workflows |
| Concurrency queue | `async/concurrent-operations.ts` | Handles bounded parallelism, backpressure, and result/error collection |
| Circuit breaker | `async/circuit-breaker.ts` | Prevents cascading failure when dependencies are slow or down |
| Timeout, retry, abort | `async/resilience.ts` | Builds safe dependency calls with cancellation and retry boundaries |
| WebSocket pub/sub | `async/pub-sub.ts` | Teaches real-time fanout, channel subscription, and in-memory limits |
| Bun server and workers | `server.ts`, `worker/worker.ts` | Separates fast I/O routes from CPU-heavy work |
| Bun runtime APIs | `bun-runtime/` | Covers file I/O, globbing, password hashing, cookies, and Bun Shell |
| Bun SQLite | `bun-runtime/sqlite.ts` | Uses in-memory SQL, strict parameters, and transactions without an external service |
| Rate limiters | `system-design/rate-limiter.ts` | Models token bucket and sliding window throttling |
| LRU cache | `system-design/lru-cache.ts` | Models hot-data caching and eviction |
| ID generation | `system-design/id-generation.ts` | Covers Base62 public IDs and Snowflake-style distributed IDs |
| Consistent hashing | `system-design/consistent-hash.ts` | Maps keys to nodes while minimizing remaps on node changes |
| Bloom filter | `system-design/bloom-filter.ts` | Trades small false-positive risk for fast negative membership checks |

## How To Study A Topic

1. Read the topic guide.
   - Bun runtime: [BUN_RUNTIME_GUIDE.md](./bun-runtime/BUN_RUNTIME_GUIDE.md)
   - System design: [SYSTEM_DESIGN_NODE_GUIDE.md](./system-design/SYSTEM_DESIGN_NODE_GUIDE.md)

2. Open the implementation file and read the JSDoc before the code.

3. Run the focused tests:

```bash
bun test src/node-concepts/test/bun-runtime.test.ts
bun test src/node-concepts/test/sqlite.test.ts
bun test src/node-concepts/test/system-design.test.ts
bun test src/node-concepts/test/resilience.test.ts
```

4. Explain the trade-off out loud.
   Examples: in-memory vs distributed, blocking vs worker, retry vs circuit breaker, cryptographic hash vs password hash.

5. Rebuild the same idea under `practice/` without looking at the implementation.

## Bun Concepts Added From Official Docs

The `bun-runtime/` folder follows the current Bun docs for:

- `Bun.file()` and `Bun.write()` for optimized file I/O.
- `Bun.Glob` for native glob scanning and matching.
- `Bun.password` for salted password hashing and verification.
- `Bun.CryptoHasher` for cryptographic content hashes.
- `Bun.hash` for fast non-security fingerprints.
- `Bun.Cookie` and `Bun.CookieMap` for cookie creation and parsing.
- Bun Shell (`$`) for cross-platform scripting with escaped interpolation.
- `bun:sqlite` for local SQL with in-memory databases, prepared statements, strict named parameters, and transactions.
- `Bun.env`, `Bun.sleep()`, and `Bun.randomUUIDv7()` where the Bun runtime has a direct built-in primitive.

Official references are linked in [BUN_RUNTIME_GUIDE.md](./bun-runtime/BUN_RUNTIME_GUIDE.md).

## Resource Lifecycle Checklist

Use this checklist for every backend example and test:

- Clear or race timers so losing timeouts do not stay alive.
- Remove `AbortSignal` and WebSocket event listeners after success, failure, or timeout.
- Terminate workers after result, error, or timeout.
- Close Bun servers in test teardown with `server.stop(true)`.
- Finalize short-lived SQLite prepared statements and close databases in `finally`.
- Evict stale keys from in-memory maps used by rate limiters, caches, sessions, and pub/sub.
- Prefer Bun's single shared WebSocket handler object over per-socket listeners on the server side.

## Interview Talking Points

- JavaScript has one main execution thread per isolate. Async I/O does not make CPU-bound code non-blocking.
- Promises start when created. Use task factories when you need a scheduler.
- Retries help transient failures. Circuit breakers protect the system when failure is persistent.
- In-memory pub/sub, caches, and rate limiters work for one process. Redis or another shared service is needed across multiple instances.
- Use `Bun.password` for passwords, `Bun.CryptoHasher` for integrity, and `Bun.hash` only for non-security fingerprints.
- `Bun.file()` is lazy. Reading starts when you call a method like `.text()` or `.json()`.
- `Bun.write()` can copy a `BunFile` directly, which keeps file-copying code simple.
- `bun:sqlite` is a strong fit for local-first tooling, coding trackers, and tests that need SQL behavior without Postgres/MySQL in CI.

## Full Verification

```bash
bun run check
```

This runs Biome, TypeScript 7 beta typechecking through `tsgo`, and all Bun tests.
