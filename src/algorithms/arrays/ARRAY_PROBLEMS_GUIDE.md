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

# Missing Numbers (Find Two Missing Numbers)

## Problem Statement

Given an array `nums` containing **unique numbers** from the range `1` to `n` (inclusive), where **exactly two numbers are missing**, write a function to find the missing numbers.

---

## Examples

### Example 1

```
Input: nums = [1, 2, 4, 6]
Output: [3, 5]
```

### Example 2

```
Input: nums = [1, 3]
Output: [2, 4]
```

---

## Visual Explanation

```
Original array: [1, 2, 4, 6]
Full range:     1 2 3 4 5 6

Step 1: Sum all numbers in the range 1..6
        1+2+3+4+5+6 = 21

Step 2: Sum numbers in the array
        1+2+4+6 = 13

Step 3: Sum of missing numbers
        21 - 13 = 8
        => missing1 + missing2 = 8

Step 4: Split range around midpoint (8 / 2 = 4)
        Left half: 1..4
        Right half: 5..6

Step 5: Sum actual numbers in each half
        Left sum: 1+2+4 = 7
        Right sum: 6

Step 6: Subtract actual from expected sums
        Left missing: 10-7 = 3
        Right missing: 14-6 = 8? Wait check

Actually step 6:
Expected left sum (1..4) = 1+2+3+4=10 → left missing = 10-7=3
Expected right sum (5..6) = 5+6=11 → right missing = 11-6=5

Result: [3, 5]
```

---

## Algorithm (Math + Partition)

1. **Calculate the expected sum** of numbers from 1 to n using the formula:

   ```
   sum = n * (n + 1) / 2
   ```

2. **Calculate the actual sum** of numbers in the array.

3. **Sum of missing numbers** = expected sum − actual sum.

4. **Split the range** around `missingSum / 2` into:
   - Left half → one missing number
   - Right half → the other missing number

5. **Compare sums** of actual numbers in each half with the expected sums
   to find the two missing numbers.

6. Return the two missing numbers.

---

## Implementation (TypeScript)

```ts
export function missingNumbers(nums: number[]): [number, number] {
  const n = nums.length + 2;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((a, b) => a + b, 0);
  const missingSum = expectedSum - actualSum;

  const mid = Math.floor(missingSum / 2);
  const expectedLeftSum = (mid * (mid + 1)) / 2;
  const expectedRightSum = expectedSum - expectedLeftSum;

  let actualLeftSum = 0;
  let actualRightSum = 0;

  for (const num of nums) {
    if (num <= mid) actualLeftSum += num;
    else actualRightSum += num;
  }

  const firstMissing = expectedLeftSum - actualLeftSum;
  const secondMissing = expectedRightSum - actualRightSum;

  return [firstMissing, secondMissing];
}
```

---

## Complexity Analysis

| Metric           | Value                                      |
| ---------------- | ------------------------------------------ |
| Time Complexity  | **O(n)** (single pass through array)       |
| Space Complexity | **O(1)** (only variables, no extra arrays) |

---

## Key Takeaways

- The problem can be solved using **math and sum formulas**, not brute force.
- Splitting the range into two halves allows finding each missing number **in one pass**.
- Works efficiently even for large ranges without extra space.
- Useful in **data validation, sequence recovery, and missing element detection**.

---

# Majority Element (LeetCode 169)

## Problem Statement

Given an array `nums` of size `n`, **find the majority element**, i.e., the element that appears **more than n/2 times**.

- You can assume that the majority element **always exists** in the array.

---

## Examples

### Example 1

```
Input: [3, 2, 3]
Output: 3
```

### Example 2

```
Input: [2,2,1,1,1,2,2]
Output: 2
```

---

## Visual Explanation

```
Input: [2, 2, 1, 1, 1, 2, 2]

Step 1: Initialize candidate = null, count = 0

Step 2: Iterate through array
Iteration 1: num = 2, count = 0 → candidate = 2, count = 1
Iteration 2: num = 2, matches candidate → count = 2
Iteration 3: num = 1, != candidate → count = 1
Iteration 4: num = 1, != candidate → count = 0
Iteration 5: num = 1, count = 0 → candidate = 1, count = 1
Iteration 6: num = 2, != candidate → count = 0
Iteration 7: num = 2, count = 0 → candidate = 2, count = 1

Step 3: End of array → candidate = 2
Output: 2
```

---

## Algorithm (Boyer–Moore Voting)

1. Initialize `count = 0` and `candidate = null`.
2. Iterate through the array:
   - If `count` is 0 → choose the current number as the new candidate.
   - If the current number equals the candidate → increment `count`.
   - Otherwise → decrement `count`.

3. After the loop, the candidate is guaranteed to be the majority element.

> ✅ The algorithm works because the majority element appears **more than half the time**, so it cannot be completely canceled out.

---

## Implementation (TypeScript)

```ts
export function majorityElement(nums: number[]): number {
  let candidate: number | null = null;
  let count = 0;

  for (const num of nums) {
    if (count === 0) {
      candidate = num; // pick a new candidate
    }

    if (num === candidate) count++;
    else count--;
  }

  return candidate!;
}
```

---

## Complexity Analysis

| Metric           | Value                            |
| ---------------- | -------------------------------- |
| Time Complexity  | O(n) — single pass through array |
| Space Complexity | O(1) — constant space            |

---

## Key Takeaways

- **Boyer–Moore Voting** is optimal for majority-element problems.
- Only the **current candidate and a count** need to be tracked.
- The algorithm is **linear time** and **constant space**.
- Very useful in **interview and competitive programming problems**.

---

# Sweet and Savoury (Two Sum Closest ≤ Target)

## Problem Statement

Given an array of integers `numbers` and an integer `targetSum`, **find two distinct numbers whose sum is less than or equal to the target and as close to the target as possible**.

- If an **exact match** exists, return it immediately.
- Otherwise, return the pair with the **largest sum smaller than the target**.
- If no valid pair exists, return `null`.

---

## Examples

### Example 1

```
Input: numbers = [-3, -5, 1, 7], targetSum = 4
Output: [-3, 7]
Explanation: -3 + 7 = 4 (exact match)
```

### Example 2

```
Input: numbers = [5, 2, 4, 6, 3], targetSum = 7
Output: [3, 4]
Explanation: 3 + 4 = 7 (exact match)
```

### Example 3

```
Input: numbers = [8, 10, 3], targetSum = 7
Output: null
Explanation: No pair has sum ≤ 7
```

---

## Visual Explanation

```
Input: [-5, -3, 1, 7], targetSum = 4
(sorted)

left → -5           right → 7
sum = 2  (valid, best so far)

left → -3           right → 7
sum = 4  (exact match)

Return [-3, 7]
```

Another case (no exact match):

```
Input: [1, 2, 4, 8], targetSum = 6
(sorted)

left → 1            right → 8
sum = 9  (> target) → move right

left → 1            right → 4
sum = 5  (valid, best so far) → move left

left → 2            right → 4
sum = 6  (exact match)

Return [2, 4]
```

---

## Algorithm (Two Pointers)

1. **Sort the array** in ascending order.
2. Initialize two pointers:
   - `leftIndex` at the start
   - `rightIndex` at the end

3. Track:
   - `closestValidSum` → largest sum ≤ target
   - `closestPair` → corresponding pair

4. While `leftIndex < rightIndex`:
   - Compute the current sum.
   - If sum equals target → return immediately.
   - If sum < target:
     - Update best solution if closer.
     - Move `leftIndex` right.

   - If sum > target:
     - Move `rightIndex` left.

5. Return the best pair found (or `null`).

> ✅ Sorting enables efficient elimination of impossible pairs using pointer movement.

---

## Implementation (TypeScript)

```ts
export function sweetAndSavoury(
  numbers: number[],
  targetSum: number,
): [number, number] | null {
  const sortedNumbers = [...numbers].sort((a, b) => a - b);

  let leftIndex = 0;
  let rightIndex = sortedNumbers.length - 1;

  let closestValidSum = -Infinity;
  let closestPair: [number, number] | null = null;

  while (leftIndex < rightIndex) {
    const leftValue = sortedNumbers[leftIndex];
    const rightValue = sortedNumbers[rightIndex];
    const currentSum = leftValue + rightValue;

    if (currentSum === targetSum) {
      return [leftValue, rightValue];
    }

    if (currentSum < targetSum) {
      if (currentSum > closestValidSum) {
        closestValidSum = currentSum;
        closestPair = [leftValue, rightValue];
      }
      leftIndex++;
    } else {
      rightIndex--;
    }
  }

  return closestPair;
}
```

---

## Complexity Analysis

| Metric           | Value                                 |
| ---------------- | ------------------------------------- |
| Time Complexity  | O(n log n) — sorting dominates        |
| Space Complexity | O(n) — sorted copy of the input array |

---

## Key Takeaways

- **Two-pointer technique** is ideal when working with sorted arrays.
- Always track the **best valid solution**, not just exact matches.
- Defensive copying avoids **unexpected input mutation**.
- Commonly tested in **interviews and coding assessments**.

---

## Problem: Maximum Sum of Non-Adjacent Numbers (House Robber / LeetCode Variant)

### Problem Statement

Given an array of numbers `nums`, find the **maximum sum of non-adjacent numbers**.
You cannot pick two numbers that are next to each other in the array. Return the **maximum sum possible**.

> Essentially, you are selecting numbers from the array such that no two chosen numbers are adjacent, and their sum is maximized.

---

### Examples

```
Input: nums = [3, 2, 5, 10, 7]
Output: 15
Explanation: Pick 3 + 5 + 7 = 15

Input: nums = [2, 1, 4, 9]
Output: 11
Explanation: Pick 2 + 9 = 11

Input: nums = [5]
Output: 5
Explanation: Only one element, take it

Input: nums = []
Output: null
Explanation: No elements to pick
```

---

### Visual Explanation

```
nums = [3, 2, 5, 10, 7]

Step 1: Consider 3 → max sum = 3
Step 2: Consider 2 → max sum = max(3, 2) = 3
Step 3: Consider 5 → max sum = max(previous max sum, sum two steps back + current)
                      = max(3, 3+5) = 8
Step 4: Consider 10 → max sum = max(8, 3+10) = 13
Step 5: Consider 7 → max sum = max(13, 8+7) = 15

Result: 15
```

---

## Algorithm (Dynamic Programming, Space-Optimized)

1. Handle edge cases:
   - Empty array → return `null`
   - Single element → return that element

2. Initialize two variables:
   - `prevTwo` → max sum up to **two steps before**
   - `prevOne` → max sum up to **previous element**

3. Iterate through the array from index 2 onward:
   - `current = max(prevOne, prevTwo + nums[i])` → choose to **skip** or **take** current element
   - Slide window: `prevTwo = prevOne`, `prevOne = current`

4. Return `prevOne` → maximum sum

---

## Implementation

```typescript
/**
 * Finds the maximum sum of non-adjacent numbers in an array.
 *
 * @param {number[]} nums - The input array of numbers.
 * @returns {number | null} Maximum sum of non-adjacent numbers, or null if empty.
 *
 * @example
 * maxSumNonAdjacent([3,2,5,10,7])
 * // → 15
 */
export function maxSumNonAdjacent(nums: number[]): number | null {
  // Edge case: empty array
  if (nums.length === 0) return null;

  // Edge case: single element
  if (nums.length === 1) return nums[0];

  // prevTwo: max sum up to i-2
  let prevTwo = nums[0];

  // prevOne: max sum up to i-1
  let prevOne = Math.max(nums[0], nums[1]);

  // Iterate through the array
  for (let i = 2; i < nums.length; i++) {
    const currentMax = Math.max(prevOne, prevTwo + nums[i]);
    prevTwo = prevOne;
    prevOne = currentMax;
  }

  return prevOne;
}
```

---

## Complexity Analysis

- **Time:** O(n) → single pass through array
- **Space:** O(1) → only two variables used, no extra array

---

## Key Takeaways

- This is a **classic dynamic programming problem** with **optimal substructure**: max sum at `i` depends only on `i-1` and `i-2`.
- Can be optimized from O(n) space → O(1) space using two variables.
- Useful in problems like **House Robber**, scheduling non-overlapping tasks, or selecting elements with adjacency constraints.

---

## Problem: Ways to Make Change (Dynamic Programming)

### Problem Statement

Given a **target amount** `target` and an array of **coin denominations** `denoms`, determine **the number of distinct ways** to make change for the target using the available denominations.

- You may use **each coin denomination as many times as needed**.
- The order of coins **does not matter**.

---

### Examples

```
Input: target = 5, denoms = [1, 2, 5]
Output: 4
Explanation: Ways to make 5:
1. 1 + 1 + 1 + 1 + 1
2. 1 + 1 + 1 + 2
3. 1 + 2 + 2
4. 5

Input: target = 3, denoms = [2]
Output: 0
Explanation: Cannot make 3 using only 2s.

Input: target = 10, denoms = [2, 5, 3, 6]
Output: 5
Explanation: Possible combinations:
[2+2+2+2+2], [2+2+6], [2+3+5], [5+5], [3+3+2+2]
```

---

### Visual Explanation

```
target = 5, denoms = [1, 2, 5]

Step 1: Initialize ways array:
ways = [1, 0, 0, 0, 0, 0]

Step 2: Use coin 1:
ways = [1, 1, 1, 1, 1, 1] → each amount can be made using 1s

Step 3: Use coin 2:
ways[2] += ways[0] → 2
ways[3] += ways[1] → 2
ways[4] += ways[2] → 3
ways[5] += ways[3] → 3

Step 4: Use coin 5:
ways[5] += ways[0] → 4

Result: ways[5] = 4
```

---

## Algorithm (Dynamic Programming, Bottom-Up)

1. Initialize an array `ways` of size `target + 1` with all zeros:
   - `ways[i]` = number of ways to make amount `i`
   - Base case: `ways[0] = 1` → 1 way to make 0

2. Loop through each coin denomination:
   - For each coin `c`, update `ways[i]` for all `i >= c`:

     ```
     ways[i] += ways[i - c]
     ```

3. Return `ways[target]` → total number of ways to make `target`.

---

## Implementation

```ts
/**
 * Calculates the number of ways to make change for a target amount
 * using the given denominations.
 *
 * @param {number} target - The target amount.
 * @param {number[]} denoms - Array of coin denominations.
 * @returns {number} - Number of ways to make change.
 *
 * @example
 * waysOfChange(5, [1, 2, 5])
 * // → 4
 */
export function waysOfChange(target: number, denoms: number[]): number {
  // ways[i] = number of ways to make amount i
  const ways = new Array(target + 1).fill(0);
  ways[0] = 1; // 1 way to make 0

  for (const coin of denoms) {
    for (let amount = coin; amount <= target; amount++) {
      ways[amount] += ways[amount - coin];
    }
  }

  return ways[target];
}
```

---

## Complexity Analysis

- **Time Complexity:** O(n \* target)
  - `n` = number of denominations
  - Each denomination loops through all amounts up to `target`

- **Space Complexity:** O(target)
  - Only one array of size `target + 1` is needed

---

## Key Takeaways

- Classic **dynamic programming / coin change problem**.
- Use **bottom-up DP** → compute smaller amounts first.
- Using **1D array** reduces space from O(n\*target) to O(target).
- Works for **unlimited supply of coins**.
- Order of coins **does not matter**, duplicates are avoided naturally.

---

### Edge Cases

- Empty denominations array → 0 ways (cannot make change)
- Target = 0 → 1 way (pick no coins)
- Coins larger than target → ignored automatically
- Negative target → invalid input, generally return 0

---

## Problem: Minimum Number of Coins for Change (Dynamic Programming)

### Problem Statement

Given a **target amount** `target` and an array of **coin denominations** `denoms`, determine the **minimum number of coins** required to make exactly the target amount.

- You may use **each coin denomination as many times as needed**.
- If the target amount **cannot be made**, return `-1`.

---

### Examples

```
Input: target = 7, denoms = [1, 5, 10]
Output: 3
Explanation: 5 + 1 + 1 = 7 (minimum coins)

Input: target = 3, denoms = [2]
Output: -1
Explanation: Cannot make 3 using only 2s.

Input: target = 0, denoms = [1, 2, 3]
Output: 0
Explanation: No coins are needed to make 0.
```

---

### Visual Explanation

```
target = 7, denoms = [1, 5]

Step 1: Initialize DP array
dp = [0, ∞, ∞, ∞, ∞, ∞, ∞, ∞]

dp[i] = minimum coins needed to make amount i

Step 2: Use coin 1
dp = [0, 1, 2, 3, 4, 5, 6, 7]

Step 3: Use coin 5
dp[5] = min(5, 1)     → 1
dp[6] = min(6, 2)     → 2
dp[7] = min(7, 3)     → 3

Final dp:
[0, 1, 2, 3, 4, 1, 2, 3]

Result: dp[7] = 3
```

---

## Algorithm (Dynamic Programming, Bottom-Up)

1. Create an array `dp` of size `target + 1`:
   - `dp[i]` represents the **minimum number of coins** needed to make amount `i`
   - Initialize all values to `Infinity`
   - Base case: `dp[0] = 0`

2. Loop through each coin denomination:
   - For each coin `c`, update all reachable amounts:

     ```
     dp[i] = min(dp[i], 1 + dp[i - c])
     ```

3. If `dp[target]` is still `Infinity`, return `-1`
   - Otherwise, return `dp[target]`

---

## Implementation

```ts
/**
 * Returns the minimum number of coins required to make the target amount.
 *
 * Uses bottom-up dynamic programming where each index represents the
 * minimum number of coins needed to form that amount.
 *
 * @param target - The target amount to make
 * @param denoms - Available coin denominations (unlimited supply)
 * @returns Minimum number of coins, or -1 if the target cannot be made
 *
 * @example
 * minNumberOfCoinsForChange(7, [1, 5, 10])
 * // → 3
 */
export function minNumberOfCoinsForChange(
  target: number,
  denoms: number[],
): number {
  // dp[i] = minimum coins needed to make amount i
  const dp = new Array(target + 1).fill(Infinity);

  // Base case: 0 coins are needed to make amount 0
  dp[0] = 0;

  for (const coin of denoms) {
    for (let amount = coin; amount <= target; amount++) {
      dp[amount] = Math.min(dp[amount], 1 + dp[amount - coin]);
    }
  }

  return dp[target] === Infinity ? -1 : dp[target];
}
```

---

## Complexity Analysis

- **Time Complexity:** `O(n × target)`
  - `n` = number of denominations
  - Each denomination updates all amounts up to `target`

- **Space Complexity:** `O(target)`
  - Uses a single 1D DP array

---

## Key Takeaways

- This is the **minimum coin** variant of the classic coin change problem.
- Uses **bottom-up dynamic programming**.
- `Infinity` is critical to mark unreachable states.
- Looping coins first avoids incorrect reuse logic.
- Efficient solution using **1D DP**.

---

### Edge Cases

- `target = 0` → return `0`
- No denominations → return `-1`
- All denominations larger than target → return `-1`
- Duplicate denominations → handled naturally
- Negative target → invalid input (should return `-1`)

---
