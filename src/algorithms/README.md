# Algorithms Learning Map

This folder is the pattern-recognition half of the repo. Each topic contains runnable TypeScript implementations, focused Bun tests, and a guide when the topic needs more explanation than code comments can carry.

## How This Folder Is Organized

| Folder | Pattern family | Learn first | Then practice |
|---|---|---|---|
| `arrays/` | Hash maps, two pointers, matrix traversal, greedy scans, intervals | `array-exercises.ts` | `array-problems.ts`, `FAANG_ARRAY_PROBLEMS_GUIDE.md` |
| `strings/` | Frequencies, anagrams, palindrome checks, document generation | `string-exercises.ts` | `FAANG_STRING_PROBLEMS_GUIDE.md` |
| `sorting/` | Comparison sorting and partitioning | `sorting.ts` | `SORTING_GUIDE.md` |
| `recursion/` | Recursive decomposition and stack frames | `fibonacci.ts`, `array-recursion.ts` | `RECURSION_GUIDE.md` |
| `backtracking/` | Search trees, choices, constraints, undo state | `backtracking.ts` | `BACKTRACKING_GUIDE.md` |
| `dynamic-programming/` | Recurrence design, memoization, tabulation | `dynamic-programming.ts` | `DYNAMIC_PROGRAMMING_GUIDE.md`, `FAANG_DP_PROBLEMS_GUIDE.md` |
| `bit-manipulation/` | XOR, masks, bit shifts, fixed-width integer behavior | `bit-manipulation.ts` | `BIT_MANIPULATION_GUIDE.md` |
| `math-geometry/` | Matrix transforms and numeric invariants | `math-geometry.ts` | `MATH_GEOMETRY_GUIDE.md` |
| `interview-patterns/` | Mixed interview templates across common patterns | `interview-patterns.ts` | `INTERVIEW_PATTERNS_GUIDE.md` |

## Best Study Order

1. Start with arrays and strings because most interview patterns reuse their hash-map, two-pointer, and scanning ideas.
2. Learn sorting well enough to explain stability, in-place mutation, partitioning, and average vs worst-case behavior.
3. Move to recursion before backtracking; backtracking is recursion plus constraint management.
4. Study dynamic programming after recursion, because every DP solution starts as a recurrence.
5. Use `interview-patterns/` as the mixed-review layer once individual topics feel familiar.

## Problem-Solving Template

Use this same checklist for every algorithm file:

1. State the brute force solution and its complexity.
2. Name the pattern that improves it.
3. Write the invariant before coding.
4. Cover empty input, one item, duplicates, negative values, and no-solution cases.
5. End by stating time and space complexity.

## Test Commands

```bash
bun test src/algorithms/tests
bun run practice -- --list arrays
bun run practice -- --list dynamic
```

## Adding A New Algorithm

- Put the implementation in the closest topic folder.
- Add or extend the matching guide when the pattern is not already explained.
- Add tests under `src/algorithms/tests`.
- Export the main function with a problem-shaped name, for example `export function twoSum(...)`.
- Add JSDoc that explains the pattern, invariant, time complexity, and space complexity.
