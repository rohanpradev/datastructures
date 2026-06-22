# Mastery Matrix

Use this matrix to decide what to study next. The goal is not to finish every
file once. The goal is to reach the exit criteria for your current level, then
move up.

## Level Map

| Level | Main objective | Repo focus | Exit criteria |
| --- | --- | --- | --- |
| Beginner | Become fluent with the language, tests, and core structures. | `src/javascript-concepts`, `src/typescript-concepts`, stacks, queues, linked lists, hash tables, easy arrays and strings. | You can implement an easy target in 20 minutes, state Big-O, and explain edge cases without reading the reference. |
| Intermediate | Recognize high-yield interview patterns. | Two pointers, sliding window, prefix sum, binary search, sorting, recursion, trees, BSTs, tries, heaps, graph traversal. | You can solve unseen medium targets in 35 minutes and explain the invariant before coding. |
| Advanced | Handle mixed problems and backend runtime failure modes. | Dynamic programming, backtracking, union-find, topological sort, monotonic stack/deque, async resilience, circuit breaker, pub/sub, workers, Bun runtime APIs. | You can solve mixed targets under time pressure and explain retries, timeout budgets, cleanup, and data-structure trade-offs. |
| Expert | Connect runnable primitives to enterprise system design. | `src/node-concepts/system-design`, `docs/ENTERPRISE_SYSTEM_DESIGN_CURRICULUM.md`, observability, security, platform engineering, multi-region trade-offs, AI/LLM app risks. | You can design a production system with SLOs, APIs, data model, bottlenecks, failure modes, observability, security, and migration steps. |

## Daily Session Template

| Phase | Time | Action |
| --- | ---: | --- |
| Recall | 3 min | Write the pattern, invariant, edge cases, and expected complexity before opening the implementation. |
| Implement | 20-70 min | Generate one target and implement only the file under `practice/`. |
| Verify | 5 min | Run the focused Bun test printed by the generator. |
| Explain | 5 min | Say the solution, complexity, and one follow-up out loud. |
| Record | 2 min | Mark score 0-5 and schedule the next review from the manifest cadence. |

## Practice Commands By Level

```bash
bun run practice -- --random beginner
bun run practice -- --random intermediate
bun run practice -- --random advanced
bun run practice -- --random expert
bun run practice:dashboard
```

The dashboard is generated from discovered tests and source exports, so it stays
aligned with the repo as coverage grows.

## Scorecard

| Score | Meaning | Next action |
| --- | --- | --- |
| 0 | Could not identify the pattern or data structure. | Read the guide and solve an easier target in the same topic. |
| 1 | Recognized the topic but needed heavy hints. | Rebuild the reference solution tomorrow. |
| 2 | Brute force passed some cases, optimized solution failed. | Write the invariant and add one missing edge-case test. |
| 3 | Optimized solution passed after debugging. | Review in 3-7 days. |
| 4 | Passed cleanly and explained complexity. | Do one harder target in the same pattern. |
| 5 | Passed cleanly, handled follow-ups, and explained production trade-offs. | Move to mixed practice or system-design mode. |

## Beginner Track

Focus on correctness and confidence.

1. JavaScript semantics: equality, references, closures, iteration, arrays, maps,
   sets, errors, and promises.
2. TypeScript fundamentals: `unknown`, narrowing, generics, readonly input
   types, discriminated unions, and safe API boundaries.
3. Data structures: stack, queue, singly linked list, doubly linked list, hash
   table.
4. Easy patterns: two sum, valid parentheses, binary search, simple recursion,
   array traversal, string frequency maps.

## Intermediate Track

Focus on recognizing patterns quickly.

1. Arrays and strings: two pointers, sliding window, prefix sum, product
   prefix/suffix, sorting and intervals.
2. Trees and tries: traversal order, recursion returns, BST ordering, prefix
   search.
3. Heaps: top-k, kth largest, merge k sorted lists, median stream.
4. Graphs: BFS, DFS, components, grid traversal, shortest path in unweighted
   graphs.
5. Interview delivery: state brute force first, then invariant, then optimized
   code.

## Advanced Track

Focus on mixed problem solving and runtime behavior.

1. Dynamic programming: state definition, base cases, transition order, space
   compression, reconstruction when needed.
2. Backtracking: choice tree, pruning, duplicate handling, copy-on-output.
3. Graph depth: topological sort, union-find, cycle detection, bipartite checks,
   weighted graph discussion.
4. Runtime resilience: timeout budgets, abort signals, retries, circuit
   breakers, bounded concurrency, pub/sub fanout, worker isolation.
5. Tooling: `bun:test`, `tsgo`, Biome, coverage, manifest generation, and CI
   gates.

## Expert Track

Focus on senior/staff interview material.

1. System-design primitives: rate limiter, LRU cache, ID generation, consistent
   hashing, Bloom filters.
2. Enterprise requirements: SLOs, SLIs, capacity estimates, data ownership,
   multi-tenant isolation, abuse prevention, privacy, and cost controls.
3. Observability: traces for request paths, metrics for health and saturation,
   logs for events, profiles for code-level resource usage.
4. Platform engineering: deployment boundaries, GitOps, Kubernetes-aware
   operations, internal developer platform trade-offs, CI/CD policy checks.
5. AI systems: RAG data boundaries, prompt injection, tool permissions,
   insecure output handling, evaluation, fallback, rate limiting, and cost.

## Maintenance Rule

When a new topic is added, also add:

- Focused tests.
- Export names that the practice generator can discover.
- Guide notes with beginner explanation, invariant, complexity, and production
  upgrade.
- A system-design or enterprise prompt when the topic touches backend behavior.
