# Bun Runtime Interview Guide

This folder covers Bun concepts that are common in real backend interviews and take-home projects. The goal is not to memorize APIs. The goal is to explain when Bun replaces a Node package or when it gives you a faster native primitive.

Official references:

- [Bun runtime overview](https://bun.com/docs/runtime)
- [Bun APIs overview](https://bun.com/docs/runtime/bun-apis)
- [Bun file I/O](https://bun.com/docs/runtime/file-io)
- [Bun Glob](https://bun.com/docs/runtime/glob)
- [Bun hashing and passwords](https://bun.com/docs/runtime/hashing)
- [Bun cookies](https://bun.com/docs/runtime/cookies)
- [Bun Shell](https://bun.com/docs/runtime/shell)
- [Bun SQLite](https://bun.com/docs/runtime/sqlite)
- [Bun test runner](https://bun.com/docs/test)
- [Bun SQL](https://bun.com/docs/runtime/sql)
- [Bun Redis](https://bun.com/docs/runtime/redis)
- [Bun TypeScript setup](https://bun.com/docs/runtime/typescript)
- [Bun utilities](https://bun.com/docs/runtime/utils)
- [Bun test coverage](https://bun.com/docs/test/code-coverage)
- [bun install](https://bun.com/docs/pm/cli/install)
- [bunfig.toml](https://bun.com/docs/runtime/bunfig)

## What To Learn First

1. `Bun.file()` gives you a lazy file reference.
   You still need to call `.text()`, `.json()`, `.arrayBuffer()`, `.bytes()`, or `.stream()` to read content.

2. `Bun.write()` writes many data shapes.
   It can write a string, typed array, `Blob`, `Response`, or another `BunFile`.

3. `Bun.Glob` helps build CLIs and tooling.
   Use it for "find all changed tests", "scan all markdown", or "copy assets" style tasks.

4. `Bun.password` is for password hashing.
   Use it for password storage because it supports slow password-hashing algorithms. Do not use SHA-256 for passwords.

5. `Bun.CryptoHasher` is for integrity.
   Use it for content hashes, cache keys, checksums, or signatures where a cryptographic digest is needed.

6. `Bun.hash` is for fast non-security fingerprints.
   Use it for internal cache bucketing, dedupe hints, or sharding. Do not use it for auth.

7. `Bun.Cookie` and `Bun.CookieMap` make cookie work explicit.
   Prefer `HttpOnly`, `Secure`, `SameSite=Lax` or stricter, and a bounded `Max-Age` for sessions.

8. Bun Shell is useful for scripts.
   Its template interpolation escapes strings by default, so user input is not treated as shell syntax.

9. `bun:sqlite` is useful for local durable state and tests.
   Use prepared statements for repeated queries, strict named parameters to catch binding mistakes, transactions for batch writes, and `.finalize()` for short-lived statements in hot paths.

10. `bunfig.toml` should hold project-level test behavior.
    This repo uses it for test preloading and coverage reporters so individual package scripts stay short.

11. `Bun.SQL` is Bun's native Promise-based SQL client.
    The current docs describe a unified tagged-template API for PostgreSQL, MySQL, and SQLite with pooling, transactions, prepared statements, TLS, and environment-based configuration. Use it for production database discussion; keep `bun:sqlite` for CI-safe local examples.

12. `Bun.redis` and `RedisClient` are Bun's native Redis APIs.
    Use them in system-design answers for distributed rate limits, counters, shared cache, sessions, pub/sub, locks, and queue-adjacent coordination. Do not hide the production trade-offs: Redis availability, eviction policy, key design, and multi-region consistency still matter.

13. Bun executes TypeScript directly, but the repo still runs `bun run typecheck`.
    Treat runtime execution and static type checking as separate quality gates.

14. Prefer Bun-native APIs when they express the same intent clearly.
    Use `Bun.env` for runtime environment reads, `Bun.sleep()` for simple delays, and `Bun.randomUUIDv7()` when sortable UUIDs are a better fit than a custom ID generator.

15. Keep supply-chain controls visible.
    This repo uses `install.minimumReleaseAge` in `bunfig.toml`, which Bun documents as a filter against very recently published package versions. The docs also expose a security scanner hook for deeper install-time checks.

16. Keep coverage behavior centralized.
    This repo uses Bun's coverage reporters, `coverageSkipTestFiles`, and `coveragePathIgnorePatterns` in `bunfig.toml` so generated practice files do not distort the course signal.

## Step-By-Step Problem Approach

### File Processing

Problem: "Read a JSON config, validate it, and write a generated report."

1. Use `Bun.file(path)` to create the reference.
2. Check `await file.exists()` before parsing if missing files should be a clean error.
3. Use `await file.json()` for JSON.
4. Use `Bun.write(outputPath, serializedData)` for the report.
5. Test missing file, malformed content, and successful output.

Reference code: [file-system.ts](./file-system.ts)

### Glob-Based CLI

Problem: "Find every TypeScript file under a folder."

1. Create `new Glob("**/*.ts")`.
2. Scan with a root directory.
3. Normalize paths before comparing in tests.
4. Sort output so CI is deterministic.

Reference code: [file-system.ts](./file-system.ts)

### Login And Sessions

Problem: "Store a password and issue a session cookie."

1. Hash the password with `Bun.password.hash`.
2. Verify with `Bun.password.verify`.
3. Create a session id with a secure random source.
4. Send it as an `HttpOnly`, `Secure`, `SameSite` cookie.
5. Store session state server-side or in a signed/encrypted token.

Reference code: [security.ts](./security.ts)

### Safe Automation

Problem: "Write a script that calls a CLI with user-provided input."

1. Prefer Bun Shell template interpolation over string-concatenated commands.
2. Use `.quiet().text()` when the command output is part of program logic.
3. Use `.env()` for command-specific environment variables.
4. Validate dynamic environment variable names before using them.

Reference code: [shell.ts](./shell.ts)

### Local SQL State

Problem: "Track interview problems, attempts, and weak patterns without a hosted database."

1. Open an in-memory database with `new Database(":memory:", { strict: true })`.
2. Create a table with constraints that match the domain.
3. Use prepared statements for inserts and updates.
4. Wrap bulk writes in `db.transaction()` so the batch commits or rolls back together.
5. Finalize short-lived statements once the operation is done.
6. Query review candidates with ordered SQL instead of sorting everything in JavaScript.

Reference code: [sqlite.ts](./sqlite.ts)

### Production SQL Client Discussion

Problem: "Move a local progress tracker or URL shortener from SQLite to a production SQL database."

1. Use `Bun.SQL` or `sql` from `bun` for a Promise-based SQL client.
2. Keep tagged template literals for values so parameterization remains the default.
3. Use transactions for multi-row changes such as creating a link plus audit event.
4. Configure connection pooling, timeouts, TLS, and credentials through environment variables.
5. Decide which database owns the truth: PostgreSQL/MySQL for shared production state, SQLite for local-first tools and CI tests.
6. Add observability around query latency, pool saturation, transaction retries, and error classes.

Reference discussion:

```ts
import { sql } from "bun";

export async function findDueProblems(userId: string) {
	return sql`
		SELECT slug, title, pattern, mastery
		FROM practice_problems
		WHERE user_id = ${userId}
		ORDER BY mastery ASC, updated_at ASC
		LIMIT ${10}
	`;
}
```

Interview follow-ups:

- How do you handle connection-pool exhaustion?
- What should be retried, and what must not be retried?
- Where do idempotency keys belong for writes?
- How do you prevent SQL injection when table or column names are dynamic?

### Redis For Distributed Backend Primitives

Problem: "Upgrade an in-memory rate limiter, cache, or pub/sub service so it works across many app servers."

1. Use `Bun.redis` for the default Redis connection or `new RedisClient(url)` for explicit connections.
2. Use strings and counters for rate limits and quotas.
3. Use expirations for sessions, cache entries, and sliding time windows.
4. Use pub/sub for lightweight fanout where message loss is acceptable.
5. Use a durable queue or stream when work must survive process restarts.
6. Track Redis latency, rejected commands, reconnects, key cardinality, memory pressure, and eviction behavior.

Reference discussion:

```ts
import { redis } from "bun";

export async function incrementApiCounter(key: string, ttlSeconds: number) {
	const count = await redis.incr(key);
	if (count === 1) {
		await redis.expire(key, ttlSeconds);
	}
	return count;
}
```

Interview follow-ups:

- How do you make increment plus expiry atomic?
- What happens when Redis is slow or unavailable?
- Do you fail open or fail closed?
- How do you avoid hot keys for large tenants or viral content?
- When is pub/sub insufficient compared with streams or a queue?

## System Design Notes

- `Bun.sql` is useful when you need a built-in, Promise-based SQL client with pooling and tagged template literals.
- `Bun.redis` is useful when a design needs distributed cache, pub/sub, counters, rate limiting, or session storage.
- The code in this repo keeps Redis and SQL as documentation topics because CI should not depend on external services.
- For an interview, explain the boundary: in-memory examples are fine for one process; Redis/Postgres are needed when the design spans multiple processes or machines.
- Bun Shell is safer than string-concatenated shell commands because interpolated values are treated as literal arguments, but you still need validation for command choice, file paths, environment names, and permissions.
- Bun's package minimum-release-age setting is not a full security program. Pair it with lockfiles, code review, provenance checks, scanner hooks where appropriate, and least-privilege deployment credentials.

## Test Command

```bash
bun test src/node-concepts/test/bun-runtime.test.ts
bun test src/node-concepts/test/sqlite.test.ts
bun run test:coverage
```
