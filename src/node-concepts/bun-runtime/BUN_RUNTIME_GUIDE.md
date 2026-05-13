# Bun Runtime Interview Guide

This folder covers Bun concepts that are common in real backend interviews and take-home projects. The goal is not to memorize APIs. The goal is to explain when Bun replaces a Node package or when it gives you a faster native primitive.

Official references:

- [Bun runtime overview](https://bun.sh/docs/runtime)
- [Bun file I/O](https://bun.sh/docs/api/file-io)
- [Bun Glob](https://bun.sh/docs/runtime/glob)
- [Bun hashing and passwords](https://bun.sh/docs/runtime/hashing)
- [Bun cookies](https://bun.sh/docs/runtime/cookies)
- [Bun Shell](https://bun.sh/docs/runtime/shell)
- [Bun SQLite](https://bun.sh/docs/api/sqlite)
- [Bun test runner](https://bun.sh/docs/test)
- [Bun SQL](https://bun.sh/docs/api/sql)
- [Bun Redis](https://bun.sh/docs/runtime/redis)

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

## System Design Notes

- `Bun.sql` is useful when you need a built-in, Promise-based SQL client with pooling and tagged template literals.
- `Bun.redis` is useful when a design needs distributed cache, pub/sub, counters, rate limiting, or session storage.
- The code in this repo keeps Redis and SQL as documentation topics because CI should not depend on external services.
- For an interview, explain the boundary: in-memory examples are fine for one process; Redis/Postgres are needed when the design spans multiple processes or machines.

## Test Command

```bash
bun test src/node-concepts/test/bun-runtime.test.ts
bun test src/node-concepts/test/sqlite.test.ts
```
