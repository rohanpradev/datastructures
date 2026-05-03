# Interview Patterns Guide

This folder contains high-frequency coding interview patterns that were not yet first-class topics in the repo.

## Patterns Covered

| Pattern | Functions | Interview signal |
| --- | --- | --- |
| Binary search | `binarySearch`, `lowerBound`, `searchRotatedSortedArray` | Boundary handling, sorted invariants |
| Binary search on answer | `kokoEatingBananas` | Feasibility predicates and search space narrowing |
| Two pointers | `threeSum`, `trapRainWater` | Sorted scans, duplicate skipping, opposite-end invariants |
| Sliding window | `lengthOfLongestSubstring`, `minWindowSubstring`, `slidingWindowMaximum` | Window expansion/contraction and monotonic deque |
| Prefix sums | `subarraySumEqualsK` | Convert repeated range sums into hash lookups |
| Prefix/suffix | `productExceptSelf` | Avoid division and extra space |
| Greedy | `maxProfit` | Maintain best-so-far invariant |
| Intervals | `canAttendMeetings`, `eraseOverlapIntervals` | Sorting by start/end, overlap logic |
| Backtracking | `subsets`, `combinationSum`, `permutations` | Choice tree, pruning, copy-on-output |
| Matrix DFS/BFS | `numIslands`, `shortestPathBinaryMatrix` | Graph traversal on grids |
| Topological sort | `canFinishCourses` | Dependency ordering and cycle detection |
| Graph coloring | `isBipartite` | BFS/DFS with state |
| Dynamic programming | `coinChange`, `wordBreak`, `longestIncreasingSubsequence` | State definitions and transitions |
| Union-find | `UnionFind`, `countComponents` | Connectivity, cycle detection, components |

## Google-Focused Priority Set

Public Google interview reports and common prep lists repeatedly emphasize arrays/strings, trees/graphs, dynamic programming, heaps, backtracking, and strong pattern adaptation. This folder now covers the highest-return coding patterns from that set:

- Arrays/sliding window: 3Sum, rain water, minimum window, sliding window maximum, subarray sum equals k.
- Binary search: normal search, lower bound, rotated array, binary search on answer.
- Graphs: number of islands, course schedule, shortest path in binary matrix, bipartite graph, union-find components.
- Dynamic programming: coin change, word break, LIS.
- Backtracking: subsets, permutations, combination sum.

Google-style preparation should not be pure memorization. For each problem, practice explaining the invariant, proving correctness, and discussing edge cases before coding.

## Common Interview Flow

1. Clarify input size and edge cases.
2. State the brute-force approach.
3. Name the optimized pattern.
4. Explain the invariant.
5. Code against the invariant.
6. Test empty input, one item, duplicates, boundaries, and no-solution cases.

## Follow-Up Topics

- Binary search on answer: Koko Eating Bananas, split array largest sum.
- Monotonic deque: sliding window maximum.
- Backtracking with duplicates: subsets II, combination sum II.
- Graph BFS: shortest path in binary matrix, rotting oranges.
- Union-find: number of connected components, redundant connection.
