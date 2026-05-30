# Interview Playbook

Use this file while solving any generated problem. The goal is to build the
habit interviewers are looking for: clear reasoning first, correct code second,
then verification and trade-offs.

## The 35-Minute Loop

1. Restate the problem and inputs.
2. Give the brute-force approach and complexity.
3. Name the pattern.
4. State the invariant, recurrence, or data-structure contract.
5. List edge cases before coding.
6. Implement the simplest correct version.
7. Run the focused Bun test.
8. Explain time and auxiliary space complexity.
9. Mention one follow-up or production constraint.

## Pattern Prompts

| Pattern | Question to ask before coding |
| --- | --- |
| Hash map | What lookup would make the nested loop disappear? |
| Two pointers | What monotonic movement avoids reconsidering work? |
| Sliding window | What condition makes the current window valid? |
| Prefix sum | Which previous accumulated value proves this range? |
| Stack | What decision must wait until a later value arrives? |
| Heap | Which candidates deserve to stay in memory? |
| Tree | What does each node return to its parent? |
| Graph | Is this BFS, DFS, topological order, union-find, or shortest path? |
| Backtracking | What choice is made, what constraint prunes, what state is undone? |
| Dynamic programming | What subproblem result can be reused? |
| Binary search | What invariant proves the answer remains in the search range? |

## TypeScript Standards

- Prefer `unknown` over `any` at boundaries, then narrow explicitly.
- Use generics when the container or algorithm preserves caller-provided types.
- Keep problem APIs simple and explicit; do not hide interview logic behind
  abstractions.
- Use readonly input types only when mutation is not part of the exercise.
- Add JSDoc with pattern, invariant, time complexity, and space complexity for
  every new exported problem.

## Bun Test Standards

The repo uses Bun's built-in test runner with TypeScript support. Use focused
filters while learning:

```bash
bun test src/algorithms/tests/array-exercises.test.ts
bun test src/algorithms/tests --test-name-pattern twoSum
```

Tests should cover empty input, one item, duplicates, boundaries, invalid input,
and no-solution cases. For async or runtime examples, include failure and
cleanup behavior.

## Readiness Bar

You are ready to move on from a topic when you can:

- Solve an unseen easy problem in under 15 minutes.
- Solve an unseen medium problem in under 35 minutes.
- Explain the pattern without reading the implementation.
- Name the edge cases before running tests.
- State complexity using the right variables.
- Rebuild the solution in `practice/` without looking at `src/`.

