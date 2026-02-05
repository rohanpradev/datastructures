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

# River Sizes (Connected Components in a Matrix)

## Problem Statement

Given a 2D matrix of integers where:

- `1` represents **land that is part of a river**
- `0` represents **land that is not part of a river**

A **river** consists of **horizontally or vertically adjacent** `1`s (no diagonals).

Your task is to **compute the size of every river** in the matrix and return them as an array of integers.
The order of the sizes does **not** matter.

---

## Examples

### Example 1

```
Input:
matrix = [
  [1, 0, 0, 1, 0],
  [1, 0, 1, 0, 0],
  [0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 1, 1, 0],
]

Output: [2, 1, 5, 2, 2]
```

### Example 2

```
Input:
matrix = [
  [1, 1, 0],
  [0, 1, 0],
  [1, 0, 1],
]

Output: [3, 1, 1]
```

### Example 3

```
Input:
matrix = [
  [0, 0, 0],
  [0, 0, 0],
]

Output: []
```

---

## Visual Explanation

Consider the matrix:

```
[
  [1, 0, 1],
  [1, 1, 0],
  [0, 0, 1],
]
```

Traversal:

```
Start at (0,0)
↓
(1,0) → (1,1)
River size = 3

Next river:
(0,2)
River size = 1

Next river:
(2,2)
River size = 1

Output: [3, 1, 1]
```

Each river is discovered by **exploring all connected 1s** before moving on.

---

## Algorithm (Depth-First Search)

1. Traverse every cell in the matrix.
2. When a `1` is found:
   - Start a **Depth-First Search (DFS)** to explore the entire river.

3. During DFS:
   - Mark the current cell as visited (set it to `0`)
   - Recursively explore neighbors:
     - Up
     - Down
     - Left
     - Right

4. Count all connected cells to determine the river’s size.
5. Store each river size in an array.
6. Return the array of river sizes.

> ✅ Mutating the matrix avoids extra memory for a visited set.

---

## Implementation (TypeScript)

```ts
export function riverSizes(matrix: number[][]): number[] {
  // Store the size of each discovered river
  const riverSizes: number[] = [];

  // Directions for moving up, down, left, and right
  const directions = [
    [1, 0], // down
    [-1, 0], // up
    [0, 1], // right
    [0, -1], // left
  ];

  /**
   * Depth-First Search to explore a river starting from (row, col).
   */
  function dfs(row: number, col: number): number {
    // Stop if out of bounds or not part of a river
    if (
      row < 0 ||
      row >= matrix.length ||
      col < 0 ||
      col >= matrix[0].length ||
      matrix[row][col] === 0
    ) {
      return 0;
    }

    // Mark as visited
    matrix[row][col] = 0;

    let currentRiverSize = 1;

    // Explore neighbors
    for (const [rowOffset, colOffset] of directions) {
      currentRiverSize += dfs(row + rowOffset, col + colOffset);
    }

    return currentRiverSize;
  }

  // Traverse the matrix
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      if (matrix[row][col] === 1) {
        riverSizes.push(dfs(row, col));
      }
    }
  }

  return riverSizes;
}
```

---

## Complexity Analysis

| Metric           | Value                                   |
| ---------------- | --------------------------------------- |
| Time Complexity  | O(n × m) — every cell visited once      |
| Space Complexity | O(n × m) — recursion stack (worst case) |

> `n` = number of rows, `m` = number of columns

---

## Key Takeaways

- This is a classic **graph traversal** problem on a grid.
- Each river is a **connected component**.
- **DFS or BFS** both work well.
- Mutating the matrix simplifies visited tracking.
- Commonly asked in **technical interviews** to test recursion and grid traversal.

---

# Remove Islands (Matrix Traversal & Flood Fill)

## Problem Statement

Given a 2D matrix of integers where:

- `1` represents **land**
- `0` represents **water**

An **island** is a group of horizontally or vertically adjacent `1`s.

Your task is to **remove all islands that are _not connected to the border_** of the matrix.

- A `1` is considered **safe** if it is connected (directly or indirectly) to any border cell.
- All other `1`s (completely surrounded by `0`s) must be converted to `0`s.

Return the modified matrix.

---

## Examples

### Example 1

```
Input:
matrix = [
  [1, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 1, 1],
  [0, 0, 1, 0, 1, 0],
  [1, 1, 0, 0, 1, 0],
  [1, 0, 1, 1, 0, 0],
  [1, 0, 0, 0, 0, 1],
]

Output:
[
  [1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 1, 0],
  [1, 1, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 1],
]
```

### Example 2

```
Input:
matrix = [
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
]

Output:
[
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
]
```

### Example 3

```
Input:
matrix = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
]

Output:
[
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
]
```

---

## Visual Explanation

### Step 1: Identify Border Land

```
Border cells containing 1s:
↓        ↓
[1, 0, 0]
[0, 1, 0]
[1, 0, 1]
```

### Step 2: Mark Safe Land (Connected to Border)

```
Safe (S) vs Island (I):

[S, 0, 0]
[0, I, 0]
[S, 0, S]
```

### Step 3: Remove Islands

```
Final:
[1, 0, 0]
[0, 0, 0]
[1, 0, 1]
```

---

## Algorithm (Flood Fill from Borders)

1. Traverse all **border cells** of the matrix.
2. When a border cell contains `1`:
   - Run **DFS (or BFS)** to mark all connected `1`s as **safe**.

3. After marking:
   - Traverse the entire matrix again.
   - Convert all **unmarked `1`s** to `0`s (these are islands).
   - Convert marked safe cells back to `1`.

> ✅ Only islands completely surrounded by water are removed.

---

## Implementation (TypeScript)

```ts
export function removeIslands(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const directions = [
    [1, 0], // down
    [-1, 0], // up
    [0, 1], // right
    [0, -1], // left
  ];

  function dfs(row: number, col: number): void {
    if (
      row < 0 ||
      row >= rows ||
      col < 0 ||
      col >= cols ||
      matrix[row][col] !== 1
    ) {
      return;
    }

    // Mark as safe using a temporary value
    matrix[row][col] = 2;

    for (const [dr, dc] of directions) {
      dfs(row + dr, col + dc);
    }
  }

  // Step 1: Mark all border-connected land as safe
  for (let col = 0; col < cols; col++) {
    if (matrix[0][col] === 1) dfs(0, col);
    if (matrix[rows - 1][col] === 1) dfs(rows - 1, col);
  }

  for (let row = 0; row < rows; row++) {
    if (matrix[row][0] === 1) dfs(row, 0);
    if (matrix[row][cols - 1] === 1) dfs(row, cols - 1);
  }

  // Step 2: Remove islands and restore safe land
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (matrix[row][col] === 1) {
        matrix[row][col] = 0; // remove island
      } else if (matrix[row][col] === 2) {
        matrix[row][col] = 1; // restore safe land
      }
    }
  }

  return matrix;
}
```

---

## Complexity Analysis

| Metric           | Value                                     |
| ---------------- | ----------------------------------------- |
| Time Complexity  | O(n × m) — each cell visited at most once |
| Space Complexity | O(n × m) — recursion stack (worst case)   |

---

## Key Takeaways

- Border-connected components should **never be removed**.
- Flood fill from borders cleanly separates **safe land vs islands**.
- Using a temporary marker avoids extra memory.
- A classic variation of **DFS/BFS on matrices**, frequently asked in interviews.

---

# Minimum Passes of Matrix (Multi-Source BFS)

## Problem Statement

Given a 2D matrix of integers where:

- **Positive numbers** can convert adjacent negative numbers
- **Negative numbers** can only be converted if they are adjacent to a positive number
- **0** values are neutral and do nothing

A **pass** consists of converting all negative numbers that are adjacent
(**up, down, left, or right**) to at least one positive number.

Your task is to determine the **minimum number of passes** required to convert **all negative numbers** into positive numbers.

If it is **impossible**, return `-1`.

---

## Rules

- Adjacency is **horizontal or vertical only** (no diagonals)
- All conversions in a pass happen **simultaneously**
- A negative number flips **at most once**

---

## Examples

### Example 1

```
Input:
matrix = [
  [0, -1, -3,  2,  0],
  [1, -2, -5, -1, -3],
  [3,  0,  0, -4, -1],
]

Output: 3
```

---

### Example 2

```
Input:
matrix = [
  [-1, -1],
  [-1, -1],
]

Output: -1
```

_No positive numbers exist to start the conversion._

---

### Example 3

```
Input:
matrix = [
  [1, 2, 3],
]

Output: 0
```

_No negative numbers to convert._

---

## Visual Explanation

Consider the matrix:

```
[
  [1, -1, -1],
  [-1, -1, -1],
]
```

### Pass 1

```
[1,  1, -1]
[1, -1, -1]
```

### Pass 2

```
[1, 1, 1]
[1, 1, -1]
```

### Pass 3

```
[1, 1, 1]
[1, 1, 1]
```

**Output: 3**

Each pass spreads positivity outward like a ripple 🌊.

---

## Algorithm (Multi-Source Breadth-First Search)

1. Traverse the matrix:
   - Add **all positive cells** to a queue
   - Count the number of negative cells

2. Perform **BFS level by level**:
   - Each BFS level represents **one pass**
   - Convert adjacent negative numbers to positive
   - Push newly converted cells into the queue

3. Stop when:
   - All negatives are converted → return passes
   - Queue is empty but negatives remain → return `-1`

> ✅ Using BFS ensures the **minimum number of passes**.

---

## Why Multi-Source BFS?

- All positive numbers spread **simultaneously**
- Prevents unnecessary rescans of the matrix
- Guarantees optimal solution

This is similar to:

- Fire spreading
- Infection propagation
- Rotten oranges problems

---

## Implementation (TypeScript)

```ts
/**
 * Returns the minimum number of passes required to convert all negative
 * numbers in the matrix to positive numbers.
 *
 * A negative number becomes positive if it is adjacent (up, down, left, right)
 * to a positive number during a pass.
 *
 * If conversion is impossible, returns -1.
 */
export function minimumPassMatrix(matrix: number[][]): number {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const queue: Array<[number, number]> = [];
  let negativeCount = 0;

  // Initialize queue with all positive numbers
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] > 0) queue.push([r, c]);
      else if (matrix[r][c] < 0) negativeCount++;
    }
  }

  const directions: Array<[number, number]> = [
    [1, 0], // down
    [-1, 0], // up
    [0, 1], // right
    [0, -1], // left
  ];

  let passes = 0;

  // BFS by levels (each level = one pass)
  while (queue.length > 0 && negativeCount > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [row, col] = queue.shift()!;

      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          matrix[newRow][newCol] < 0
        ) {
          matrix[newRow][newCol] *= -1;
          negativeCount--;
          queue.push([newRow, newCol]);
        }
      }
    }

    passes++;
  }

  return negativeCount === 0 ? passes : -1;
}
```

---

## Complexity Analysis

| Metric           | Value                                   |
| ---------------- | --------------------------------------- |
| Time Complexity  | **O(n × m)** — each cell processed once |
| Space Complexity | **O(n × m)** — queue in worst case      |

> `n` = rows, `m` = columns

---

## Key Takeaways

- This is a **graph traversal** problem on a grid
- Each cell is a node, adjacency forms edges
- **Each BFS level = one pass**
- Multi-source BFS guarantees the **minimum passes**
- Very common in **technical interviews**

---

## Problem: Group Strings by Adjacent Differences

### Problem Statement

Given an array of lowercase English strings, **group strings that have the same pattern of differences between adjacent characters**.

Two strings belong to the same group if:

1. They have the **same length**.
2. The **difference between each pair of adjacent characters** is the same.

> Important: Do **not** consider wrap-around (e.g., `z → a` is not allowed).

Return all groups of strings. The order of groups does not matter.

---

### Examples

```
Input: ["abc", "bcd", "cde", "abd"]
Output: [["abc", "bcd", "cde"], ["abd"]]

Input: ["abc", "bcd", "cde", "abd", "abcd", "cdef"]
Output: [["abc", "bcd", "cde"], ["abd"], ["abcd", "cdef"]]
```

---

### Visual Explanation

```
Strings: ["abc", "bcd", "cde", "abd", "abcd", "cdef"]

Step 1: Compute difference patterns for each string:
        "abc"  → [1,1]
        "bcd"  → [1,1]
        "cde"  → [1,1]
        "abd"  → [1,3]
        "abcd" → [1,1,1]
        "cdef" → [1,1,1]

Step 2: Group by identical difference patterns:
        [1,1]   → ["abc", "bcd", "cde"]
        [1,3]   → ["abd"]
        [1,1,1] → ["abcd", "cdef"]

Result: [["abc", "bcd", "cde"], ["abd"], ["abcd", "cdef"]]
```

---

## Algorithm (Hash Map + Difference Pattern)

1. Initialize a **map** to store groups keyed by their difference pattern.
2. For each string:
   - Compute the **difference between each pair of adjacent characters**.
   - Convert the difference array to a **string key** (e.g., `[1,1] → "1,1"`).
   - Add the string to the group corresponding to this key in the map.

3. Return the **values of the map** as the grouped strings.

---

## Implementation

```ts
/**
 * Groups strings by their adjacent character differences.
 *
 * Two strings are in the same group if they have the same length
 * and the same differences between adjacent characters.
 *
 * @param {string[]} strings - Array of lowercase strings
 * @returns {string[][]} - Array of grouped strings
 *
 * @example
 * groupStringsByDifferences(["abc", "bcd", "cde", "abd"])
 * // → [["abc","bcd","cde"],["abd"]]
 */
export function groupStringsByDifferences(strings: string[]): string[][] {
  const map: Map<string, string[]> = new Map();

  for (const str of strings) {
    // Compute difference pattern
    const diffs: number[] = [];
    for (let i = 1; i < str.length; i++) {
      diffs.push(str.charCodeAt(i) - str.charCodeAt(i - 1));
    }

    const key = diffs.join(",");
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(str);
  }

  return Array.from(map.values());
}
```

---

## Complexity Analysis

- **Time:** O(n \* k) → n = number of strings, k = average string length
  - Computing difference patterns requires iterating through each string.

- **Space:** O(n \* k) → storing difference patterns and grouped strings.

---

## Key Takeaways

- **Use difference patterns** to uniquely identify groups of strings.
- **Maps are perfect** for grouping by computed keys.
- This method works for **any string length** and handles multiple groups efficiently.
- Useful in string pattern matching, encryption checks, or analyzing sequences.

---

## Problem: Restore Travel Path from Consecutive Photos (CodeSignal)

### Problem Statement

A traveler has visited several places **consecutively**, but the original visiting order is lost.

You are given an array of tuples `pairs`, where each tuple `[A, B]` means that **place A was visited immediately before place B**.

Each place appears exactly once in the path (except the start and end), and the visits form **one continuous sequence with no branches**.

Your task is to **reconstruct and return the places in the correct visiting order**.

The place identifiers can be **strings or numbers**.

---

### Examples

```
Input: pairs = [["Paris","Berlin"],["London","Paris"],["Berlin","Rome"]]
Output: ["London","Paris","Berlin","Rome"]

Input: pairs = [[1,3],[0,1],[3,7]]
Output: [0,1,3,7]
```

---

### Visual Explanation

```
Given pairs:
["Paris","Berlin"]
["London","Paris"]
["Berlin","Rome"]

Interpretation (A → B means A before B):
London → Paris → Berlin → Rome

Step 1: Build directed edges:
London → Paris
Paris  → Berlin
Berlin → Rome

Step 2: Find starting place:
- Appears as a start
- Never appears as an end
→ "London"

Step 3: Follow the chain:
London → Paris → Berlin → Rome

Result:
["London","Paris","Berlin","Rome"]
```

---

## Algorithm (Graph + Hashing)

1. Create a mapping `nextPlace` where:
   - `nextPlace[A] = B` means A is followed by B.

2. Track:
   - All places that appear as **starts**
   - All places that appear as **ends**

3. The **starting place** is the one that:
   - Appears in `starts`
   - Does **not** appear in `ends`

4. Starting from this place, follow the mapping until the end is reached.
5. Collect each visited place in order.

---

## Implementation (TypeScript – Generic)

```typescript
/**
 * Restores the correct visiting order from consecutive visit pairs.
 *
 * Each tuple [A, B] means A was visited immediately before B.
 * All places form a single continuous path.
 *
 * Works for both string and number identifiers.
 *
 * @typeParam T - Place identifier type (string or number)
 * @param pairs - Array of consecutive visit pairs
 * @returns The places in the correct visiting order
 *
 * @example
 * restoreTravelPath([
 *   ["Paris", "Berlin"],
 *   ["London", "Paris"],
 *   ["Berlin", "Rome"]
 * ])
 * // → ["London", "Paris", "Berlin", "Rome"]
 */
export function restoreTravelPath<T extends string | number>(
  pairs: Array<[T, T]>,
): T[] {
  // Map each place to the place visited immediately after it
  const nextPlace = new Map<T, T>();

  // Track start and end appearances
  const starts = new Set<T>();
  const ends = new Set<T>();

  // Build the graph
  for (const [from, to] of pairs) {
    nextPlace.set(from, to);
    starts.add(from);
    ends.add(to);
  }

  // Find the starting place (no incoming edge)
  let start: T | undefined;
  for (const place of starts) {
    if (!ends.has(place)) {
      start = place;
      break;
    }
  }

  // Reconstruct the path
  const path: T[] = [];
  while (start !== undefined) {
    path.push(start);
    start = nextPlace.get(start);
  }

  return path;
}
```

---

## Complexity Analysis

- **Time:** O(n)
  - One pass to build mappings
  - One pass to reconstruct the path

- **Space:** O(n)
  - Hash map and sets to store relationships

---

## Key Takeaways

- This problem is a **path reconstruction from directed edges**.
- The starting node is the **only node with no incoming edge**.
- Using `Map` and `Set` avoids sorting and keeps the solution O(n).
- Commonly appears in problems involving:
  - Travel itineraries
  - Event sequences
  - Dependency chains

---
