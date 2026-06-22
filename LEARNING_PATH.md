# Interview Learning Path

This is the high-signal route through the repo. It is designed for Bun,
TypeScript, JavaScript fundamentals, data structures, algorithms, and backend
system design practice.

## Daily Loop

1. Pick one target:

```bash
bun run practice:easy
bun run practice:medium
bun run practice:hard
bun run practice:random
bun run practice:random graph
bun run practice -- --problem twoSum
```

2. Before coding, write five notes in your own words:
   pattern, invariant, dry run, edge cases, and complexity.

3. Implement only the generated file under `practice/`.

4. Run the focused test printed by the generator.

5. Add one missing edge-case test if your first attempt was wrong.

6. Compare with the reference in `src/` only after you have a passing solution
   or a named blocker.

7. Record one compact review note: target, pattern, invariant, missed edge case,
   and next review date.

8. Run the full gate before calling the session complete:

```bash
bun run check
bun run practice:audit
bun run practice:validate
```

## Learning Material First Pass

Before grinding random targets, use the teaching docs in this order:

1. [docs/LEARNER_NOTE_STANDARDS.md](./docs/LEARNER_NOTE_STANDARDS.md) for the
   standard used by guides, comments, generated TODOs, and personal review
   notes.
2. [docs/WORKED_EXAMPLES.md](./docs/WORKED_EXAMPLES.md) for step-by-step
   examples: hash map, sliding window, binary search on answer, dynamic
   programming, graph traversal, URL shortener design, and AI-assisted coding.
3. [docs/AI_INTERVIEW_TRENDS_2026.md](./docs/AI_INTERVIEW_TRENDS_2026.md) for
   current interview formats: AI-assisted rounds, no-AI rounds, debugging, repo
   comprehension, and AI-system design.
4. [docs/ENTERPRISE_SYSTEM_DESIGN_CURRICULUM.md](./docs/ENTERPRISE_SYSTEM_DESIGN_CURRICULUM.md)
   for worked senior/staff design drills with APIs, data models, SLOs,
   observability, security, and follow-ups.
5. Generate the dashboard:

```bash
bun run practice:dashboard
```

Then drill by level:

```bash
bun run practice -- --random beginner
bun run practice -- --random intermediate
bun run practice -- --random advanced
bun run practice -- --random expert
```

## 8-Week Plan

| Week | Focus | Practice target | Exit criteria |
| --- | --- | --- | --- |
| 1 | JavaScript and TypeScript fundamentals | `src/javascript-concepts`, `src/node-concepts/basics` | Explain closures, equality, promises, generators, event-loop order, and type boundaries. |
| 2 | Arrays, strings, and sorting | `src/algorithms/arrays`, `src/algorithms/strings`, `src/algorithms/sorting` | Recognize two pointers, sliding window, prefix sum, binary search, and sorting trade-offs. |
| 3 | Linked lists, stacks, queues, hash tables | `src/data-structures` | Implement each structure from scratch and defend operation complexity. |
| 4 | Trees, BSTs, tries, heaps, graphs | `src/data-structures` | Traverse recursively/iteratively, use heap ordering, and choose BFS/DFS/topological patterns. |
| 5 | Recursion, backtracking, DP, bit manipulation | `src/algorithms` | State recurrence/invariant before code and identify overlapping subproblems. |
| 6 | Mixed interview patterns | `src/algorithms/interview-patterns` and FAANG guides | Solve unknown problems under time limits with clear verbal reasoning. |
| 7 | Bun, backend fundamentals, and AI-era interview drills | `src/node-concepts/bun-runtime`, `src/node-concepts/async`, `docs/AI_INTERVIEW_TRENDS_2026.md` | Use Bun file/Shell/test APIs, `bun:sqlite`, Bun.SQL/Redis discussion, retries, circuit breakers, code review, debugging, and AI-assisted/no-AI protocols. |
| 8 | Enterprise system design primitives | `src/node-concepts/system-design`, `docs/ENTERPRISE_SYSTEM_DESIGN_CURRICULUM.md` | Explain in-memory implementation, production distributed upgrade, SLOs, observability, security, bottlenecks, and failure modes. |

## 12-Week Expert Extension

Use this after the 8-week plan or for senior/staff prep.

| Week | Focus | Output |
| --- | --- | --- |
| 9 | Distributed caching and rate limiting | Design a multi-tenant API gateway with limiter, cache, Redis upgrade, and telemetry. |
| 10 | Feeds, queues, SQL, and async resilience | Design fanout, Bun.SQL-backed state, retries, dead-letter queues, idempotency, and backpressure. |
| 11 | AI/RAG system design | Design retrieval, ACL filtering, prompt-injection defenses, evaluation, fallback, and cost controls. |
| 12 | Mock loop | Run one coding, one debugging, one AI-assisted, one system design, and one behavioral/story round. |

## Bun-Focused Skills

Current Bun documentation frames Bun as an all-in-one JavaScript/TypeScript
toolkit: runtime, package manager, transpiler, bundler, script runner, and test
runner. Use that directly in this repo:

- Run TypeScript files directly with `bun run`.
- Keep static checking separate with `bun run typecheck`.
- Use `bun:test` for focused, watchable, TypeScript-first tests.
- Use `bun test --coverage` through `bun run test:coverage`.
- Prefer `Bun.file()` and `Bun.write()` for optimized file reads/writes.
- Use `bunfig.toml` for shared test preload, coverage, and install behavior.

## Practice Metadata

Build a machine-readable target list:

```bash
bun run practice:manifest
```

The manifest records title, slug, topic, inferred pattern, difficulty, source
files, test file, selected exports, learning objectives, an attempt checklist,
readiness rubric, review cadence, and a complexity prompt. Use it to build a
dashboard, import into SQLite, or plan spaced repetition.

Audit the target map after adding or renaming problems:

```bash
bun run practice:audit
```

## Interview Scorecard

Rate each attempt from 0 to 5:

| Score | Meaning |
| --- | --- |
| 0 | Could not identify the pattern. |
| 1 | Identified the pattern but needed heavy hints. |
| 2 | Brute force worked, optimized version did not. |
| 3 | Optimized solution passed after debugging. |
| 4 | Passed cleanly and explained complexity. |
| 5 | Passed cleanly, handled follow-ups, and explained trade-offs. |

## References

- [Learner note standards](./docs/LEARNER_NOTE_STANDARDS.md)
- [MIT OCW 6.006: Introduction to Algorithms](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/)
- [OpenDSA Data Structures and Algorithms](https://opendsa-server.cs.vt.edu/ODSA/Books/Everything/html/)
- [CP-Algorithms](https://cp-algorithms.com/)
- [Bun documentation](https://bun.com/docs)
- [Bun file I/O](https://bun.com/docs/runtime/file-io)
- [Bun test runner](https://bun.com/docs/test)
- [Bun TypeScript](https://bun.com/docs/typescript)
- [MDN JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [NeetCode roadmap](https://neetcode.io/roadmap)
