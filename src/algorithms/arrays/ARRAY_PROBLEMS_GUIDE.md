# Array Exercises - Intersecting Intervals

## Overview

This guide covers the **Merge Intervals** problem, a classic array manipulation challenge commonly found in coding interviews. It demonstrates key techniques such as **sorting**, **interval merging**, and **greedy algorithms**. Understanding this problem helps in handling overlapping ranges, scheduling problems, and timeline computations.

---

## Problem: Merge Intervals (LeetCode 56)

### Problem Statement

Given an array of intervals `intervals` where each interval is represented as `[start, end]`, **merge all overlapping intervals** and return an array of **non-overlapping intervals** that cover all the intervals in the input.

### Example

```
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Intervals [1,3] and [2,6] overlap, so they are merged into [1,6].

Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping and merged into [1,5].
```

### Visual Explanation

```
Before: [[1,3], [2,6], [8,10], [15,18]]

Step 1: Sort intervals by start:
        [[1,3], [2,6], [8,10], [15,18]]

Step 2: Initialize merged = []

Step 3: Process intervals:
        Interval [1,3] → merged is empty → push [1,3]
        Interval [2,6] → overlaps with [1,3] → merge → [1,6]
        Interval [8,10] → no overlap → push [8,10]
        Interval [15,18] → no overlap → push [15,18]

Result: [[1,6], [8,10], [15,18]]
```

---

### Algorithm (Greedy + Sorting)

```
1. Sort intervals by starting point
2. Initialize an empty array 'merged'
3. For each interval [start, end]:
   - If 'merged' is empty or last merged interval ends before 'start':
     • Append [start, end] to 'merged'
   - Else (overlapping):
     • Merge with last interval:
       last_end = max(last_end, end)
4. Return 'merged'
```

---

### Implementation Steps

```typescript
/**
 * Merges overlapping intervals.
 *
 * @param {Array<[number, number]>} intervals - List of intervals [start, end]
 * @returns {Array<[number, number]>} - Merged non-overlapping intervals
 */
export function mergeIntervals(
  intervals: Array<[number, number]>,
): Array<[number, number]> {
  if (intervals.length === 0) return [];

  // Sort intervals by start
  const sortedIntervals = [...intervals].sort(([a], [b]) => a - b);

  const merged: Array<[number, number]> = [];

  for (const [start, end] of sortedIntervals) {
    // No overlap → push interval
    if (merged.length === 0 || merged[merged.length - 1][1] < start) {
      merged.push([start, end]);
    } else {
      // Overlap → merge with last
      merged[merged.length - 1][1] = Math.max(
        merged[merged.length - 1][1],
        end,
      );
    }
  }

  return merged;
}
```

---

### Complexity Analysis

- **Time:** O(n log n) → sorting dominates
- **Space:** O(n) → merged array (or O(1) if modifying input in-place)

---

### Key Takeaways

- Always **sort intervals by start** before merging
- Check only the **last merged interval** for overlap → efficient O(n) pass
- Useful for scheduling, timeline overlap, or range problems

---
