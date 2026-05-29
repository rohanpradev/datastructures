# Interview Learning Path

This is the high-signal route through the repo. It is designed for Bun,
TypeScript, JavaScript fundamentals, data structures, algorithms, and backend
system design practice.

## Daily Loop

1. Pick one target:

```bash
bun run practice:random
bun run practice:random graph
bun run practice -- --problem twoSum
```

2. Before coding, write four notes in your own words:
   pattern, invariant, edge cases, and complexity.

3. Implement only the generated file under `practice/`.

4. Run the focused test printed by the generator.

5. Add one missing edge-case test if your first attempt was wrong.

6. Compare with the reference in `src/` only after you have a passing solution.

7. Run the full gate before calling the session complete:

```bash
bun run check
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
| 7 | Bun and backend fundamentals | `src/node-concepts/bun-runtime`, `src/node-concepts/async` | Use `Bun.file`, `Bun.write`, `bun:test`, Shell, SQLite, cookies, hashing, retries, and circuit breakers. |
| 8 | System design primitives | `src/node-concepts/system-design` | Explain in-memory implementation, production distributed upgrade, bottlenecks, and failure modes. |

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
files, test file, and selected exports. Use it to build a dashboard, import into
SQLite, or plan spaced repetition.

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

- [Bun documentation](https://bun.sh/docs)
- [Bun file I/O](https://bun.sh/docs/runtime/file-io)
- [Bun test runner](https://bun.sh/docs/test)
- [Bun TypeScript](https://bun.sh/docs/typescript)
- [MDN JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [Google Tech Dev Guide: Data Structures and Algorithms](https://techdevguide.withgoogle.com/paths/data-structures-and-algorithms/)
- [Google Tech Dev Guide: Interview Prep](https://techdevguide.withgoogle.com/paths/interview/)
- [NeetCode roadmap](https://neetcode.io/roadmap)
