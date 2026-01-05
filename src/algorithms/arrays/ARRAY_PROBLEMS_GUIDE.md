# Array Exercises – Intersecting Intervals

## Overview

This guide covers the **Merge Intervals** problem, a common array manipulation challenge in coding interviews. It demonstrates essential techniques such as **sorting**, **interval merging**, and **greedy algorithms**. Mastering this problem helps with handling overlapping ranges, scheduling conflicts, and timeline computations.

---

## Problem: Merge Intervals (LeetCode 56)

### Problem Statement

Given an array of intervals `intervals` where each interval is `[start, end]`, **merge all overlapping intervals** and return an array of **non-overlapping intervals** that cover all the intervals in the input.

### Examples

```
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]

Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
```

### Visual Explanation

```
Before: [[1,3], [2,6], [8,10], [15,18]]

Step 1: Sort intervals by start:
        [[1,3], [2,6], [8,10], [15,18]]

Step 2: Initialize result = []

Step 3: Process intervals:
        Interval [1,3] → result is empty → add [1,3]
        Interval [2,6] → overlaps with [1,3] → merge → [1,6]
        Interval [8,10] → no overlap → add [8,10]
        Interval [15,18] → no overlap → add [15,18]

Result: [[1,6], [8,10], [15,18]]
```

---

## Algorithm (Greedy + Sorting)

1. **Sort** intervals by their start time.
2. Initialize an empty array `result`.
3. Iterate through each interval `[start, end]`:
   - If `result` is empty or the last interval ends before `start` → **add the interval**.
   - Else (overlap exists) → **merge** with the last interval:
     `last[1] = max(last[1], end)`

4. Return `result`.

---

## Implementation

```typescript
/**
 * Merges all overlapping intervals.
 *
 * An interval [a, b] overlaps with [c, d] if c <= b.
 *
 * @param {Array<[number, number]>} intervals
 *   An array of intervals where each interval is a tuple [start, end].
 *
 * @returns {Array<[number, number]>}
 *   A new array of merged, non-overlapping intervals sorted by start time.
 *
 * @example
 * mergeIntervals([[1,3],[2,6],[8,10],[15,18]])
 * // → [[1,6],[8,10],[15,18]]
 */
export function mergeIntervals(
  intervals: Array<[number, number]>,
): Array<[number, number]> {
  if (intervals.length === 0) return [];

  // Step 1: Sort intervals by their start value
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);

  const result: Array<[number, number]> = [];

  // Step 2: Iterate through sorted intervals
  for (const [start, end] of sorted) {
    const last = result[result.length - 1];

    // Case A: No overlap → add new interval
    if (!last || last[1] < start) {
      result.push([start, end]);
    }
    // Case B: Overlap → merge with the last interval
    else {
      last[1] = Math.max(last[1], end);
    }
  }

  return result;
}
```

---

## Complexity Analysis

- **Time:** O(n log n) → due to sorting
- **Space:** O(n) → result array (or O(1) if modifying in-place)

---

## Key Takeaways

- Always **sort intervals by start** before merging.
- Check only the **last interval** for overlap → efficient O(n) pass.
- Useful in scheduling, timeline overlap, or range-related problems.

---

# Best Seat (Greedy / Two Pointers)

## Overview

This problem focuses on finding the **best available seat** in a row such that the distance to the **closest occupied seat** is maximized. It is a classic **array traversal** problem that uses a **greedy, two-pointer approach** to efficiently determine the optimal position.

This pattern is commonly used in seating arrangements, spacing optimization, and interval-style problems.

---

## Problem Description

You are given an array `seats` where:

- `1` represents an **occupied** seat
- `0` represents an **empty** seat

Your task is to return the **index of the empty seat** that maximizes the distance to the **nearest occupied seat**.

If no valid seat exists, return `-1`.

---

## Example

```
Input:  seats = [1, 0, 0, 0, 1]
Output: 2
```

### Explanation

The longest stretch of empty seats lies between the occupied seats at indices `0` and `4`:

```
[1, 0, 0, 0, 1]
    ↑  ↑  ↑
```

The middle seat (`index 2`) maximizes the distance to the closest occupied seat.

---

## Approach

### Key Idea

- Only empty seats **between two occupied seats** are considered.
- The optimal seat lies in the **middle of the longest contiguous block of empty seats**.
- A two-pointer scan efficiently finds these blocks in a single pass.

---

## Algorithm

1. Initialize:
   - `lastOccupiedIndex` to track the most recent occupied seat.
   - `maxEmptyLength` to track the longest empty segment found.
   - `bestIndex` to store the best seat position.

2. Traverse the array:
   - When an occupied seat is found:
     - Compute the number of empty seats between the current and previous occupied seats.
     - If this segment is longer than the previous maximum:
       - Update `bestIndex` to the middle of the segment.

     - Update `lastOccupiedIndex`.

3. Return `bestIndex`.

---

## Implementation

```ts
/**
 * Returns the index of the seat that maximizes the distance
 * to the closest occupied seat.
 */
export function findBestSeat(seats: number[]): number {
  let bestIndex = -1;
  let maxEmptyLength = 0;

  // Index of the last occupied seat
  let lastOccupiedIndex = 0;

  // Scan for the next occupied seat
  for (let currentIndex = 1; currentIndex < seats.length; currentIndex++) {
    if (seats[currentIndex] === 1) {
      // Number of empty seats between two occupied seats
      const emptyLength = currentIndex - lastOccupiedIndex - 1;

      // Update best seat if this stretch is longer
      if (emptyLength > maxEmptyLength) {
        maxEmptyLength = emptyLength;

        // Best seat is the middle of the empty stretch
        bestIndex = Math.floor((lastOccupiedIndex + currentIndex) / 2);
      }

      // Move pointer to current occupied seat
      lastOccupiedIndex = currentIndex;
    }
  }

  return bestIndex;
}
```

---

## Complexity Analysis

- **Time Complexity:** `O(n)` — single pass through the array
- **Space Complexity:** `O(1)` — constant extra space

---

## Key Takeaways

- Two-pointer scanning is ideal for interval-style problems.
- The middle of the longest empty segment provides the optimal solution.
- This approach is efficient, readable, and interview-ready.

---

## Related Problems

- LeetCode 849 – _Maximize Distance to Closest Person_
- Merge Intervals
- Meeting Rooms

---

# Zero Sum Subarray (Prefix Sum + Hash Map)

## Overview

This problem is about finding a **contiguous subarray** in an integer array that **sums to zero**.

It is a classic **prefix sum + hash map problem**, commonly asked in coding interviews. Understanding this technique helps with:

- Subarray sum problems
- Range queries
- Efficiently detecting repeated patterns in cumulative data

---

## Problem Description

Given an integer array `nums`, return **any contiguous subarray** whose elements sum to `0`.

If no such subarray exists, return `-1`.

**Constraints:**

- `nums` can contain positive, negative, and zero elements.
- Subarrays are contiguous.

---

## Example

```
Input: nums = [3, 1, -1, -3]
Output: [1, -1]

Explanation:
Prefix sums: [3, 4, 3, 0]
Prefix sum 3 appears at index 0 and index 2
→ Subarray between these indices [1, -1] sums to 0
```

```
Input: nums = [1, 2, 3]
Output: -1
Explanation: No subarray sums to zero
```

---

## Approach

### Key Idea

- Compute a **prefix sum** while iterating through the array.
- Use a **hash map** to store the first occurrence of each prefix sum.
- If a prefix sum repeats, the subarray between the two indices sums to zero.
- If the prefix sum is `0` at any index, the subarray from the start sums to zero.

This allows finding a zero-sum subarray in **linear time**.

---

## Algorithm (Step-by-step)

1. Initialize:
   - `prefixSum = 0`
   - `prefixSumIndex = Map()` to track first occurrence of each sum

2. Loop over array elements:
   - Add the current element to `prefixSum`
   - If `prefixSum === 0`, return the subarray from start to current index
   - If `prefixSum` exists in `prefixSumIndex`:
     - Return subarray between previous index + 1 and current index

   - Otherwise, store the current index in `prefixSumIndex`

3. If loop finishes without finding a zero-sum subarray, return `-1`

---

## Implementation

```ts
export function zeroSumSubarray(nums: number[]): number[] | -1 {
  let prefixSum = 0;
  const prefixSumIndex = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    prefixSum += nums[i];

    if (prefixSum === 0) {
      return nums.slice(0, i + 1);
    }

    if (prefixSumIndex.has(prefixSum)) {
      const startIndex = prefixSumIndex.get(prefixSum)! + 1;
      return nums.slice(startIndex, i + 1);
    }

    prefixSumIndex.set(prefixSum, i);
  }

  return -1;
}
```

---

## Complexity Analysis

- **Time Complexity:** `O(n)` — single pass through the array
- **Space Complexity:** `O(n)` — hash map stores prefix sums

---

## Key Takeaways

- **Prefix sum + hash map** is a powerful pattern for subarray sum problems.
- Repeated prefix sums indicate a **zero-sum subarray**.
- Always handle **prefix sum 0** separately for subarrays starting at index 0.
- Use `Map.has()` to avoid bugs with index 0 or falsy values.

---

## Related Problems

- **LeetCode 560:** Subarray Sum Equals K
- **LeetCode 523:** Continuous Subarray Sum
- **Prefix Sum / Sliding Window / Hash Map** pattern problems

---

## Problem: Maximum Sum of Medians of Triplets (LeetCode-style)

### Problem Statement

You are given an integer array `nums`.

- You must divide the array into **disjoint subarrays (groups) of 3 elements**
- Each element can be used **only once**
- You can form at most `⌊n / 3⌋` groups
- The **median** of a group is the middle value after sorting the 3 elements

👉 **Goal:** Return the **maximum possible sum of medians** of all formed groups.

---

### Examples

```
Input: nums = [1,2,3,4,5]
Output: 4
Explanation: Only one group can be formed → median is 4

Input: nums = [1,2,3,4,5,6]
Output: 8
Explanation: Two groups → medians are 5 and 3 → sum = 8
```

---

## Visual Explanation

```
nums = [1,2,3,4,5,6]

Step 1: Sort the array
        [1,2,3,4,5,6]

Step 2: Number of groups = floor(6 / 3) = 2

Step 3: Form groups to maximize medians

Group 1: (1, 5, 6) → median = 5
Group 2: (2, 3, 4) → median = 3

Sum of medians = 5 + 3 = 8
```

🔑 **Key idea:**
The largest number in a group does **not** affect the median.
So we “sacrifice” small numbers and preserve large numbers as medians.

---

## Algorithm (Greedy + Sorting)

1. **Sort** the array in ascending order.
2. Compute `groups = ⌊n / 3⌋`.
3. Start from the **second-largest element** (index `n - 2`).
4. For each group:
   - Add the current element to the sum (this is the median).
   - Move left by 2 positions.

5. Return the total sum.

---

## Why This Works (Intuition)

For each triplet:

- Only the **median** contributes to the result
- The **largest element** can be anything
- The **smallest element** can be minimized

Optimal grouping pattern:

```
(small, median, large)
```

By sorting and selecting medians from the largest possible values, we ensure the **maximum total median sum**.

---

## Implementation

```ts
/**
 * Returns the maximum possible sum of medians
 * from ⌊n / 3⌋ disjoint triplets.
 *
 * @param nums - Array of integers
 * @returns Maximum sum of medians
 *
 * @example
 * maxMedianSum([1,2,3,4,5,6]) // 8
 */
export function maxMedianSum(nums: number[]): number {
  // Step 1: Sort the array in ascending order
  nums.sort((a, b) => a - b);

  const n = nums.length;
  const groups = Math.floor(n / 3);
  let sum = 0;

  /*
    Start from the second-largest element.
    Each step skips the largest element of the group
    and picks the median.
  */
  let index = n - 2;

  // Step 2: Collect medians
  for (let i = 0; i < groups; i++) {
    sum += nums[index];
    index -= 2;
  }

  return sum;
}
```

---

## Complexity Analysis

- **Time:** `O(n log n)` → sorting dominates
- **Space:** `O(1)` → in-place sorting (excluding input)

---

## Key Takeaways

- Only the **median matters**, not the full group.
- Sorting enables a simple greedy solution.
- Always take the **second-largest available element** as a median.
- A common pattern in optimization problems involving medians.

---
