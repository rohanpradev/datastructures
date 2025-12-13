# Array Exercises - Practice Guide

## Overview

This guide covers 7 essential array manipulation problems commonly found in coding interviews. Each problem demonstrates important algorithmic techniques like two-pointers, sliding window, and dynamic programming.

---

## Problem 1: Remove Element (LeetCode 27)

### Problem Statement

Given an array `nums` and a value `val`, remove all occurrences of `val` **in-place**. Return the new length of the array.

### Example

```
Input: nums = [3, 2, 2, 3], val = 3
Output: 2
Explanation: nums becomes [2, 2, _, _] (first 2 elements are valid)

Input: nums = [0, 1, 2, 2, 3, 0, 4, 2], val = 2
Output: 5
Explanation: nums becomes [0, 1, 3, 0, 4, _, _, _]
```

### Visual Explanation

```
Before: [3, 2, 2, 3]  val = 3
         ^           k = 0 (position for next valid element)

Step 1: nums[0] = 3 → Skip (equals val)
        k stays 0

Step 2: nums[1] = 2 → Keep!
        [2, 2, 2, 3]
         ^
        k = 1

Step 3: nums[2] = 2 → Keep!
        [2, 2, 2, 3]
            ^
        k = 2

Step 4: nums[3] = 3 → Skip (equals val)
        k stays 2

Result: k = 2, first 2 elements are [2, 2]
```

### Algorithm (Two-Pointer Technique)

```
1. Initialize k = 0 (tracks position for next valid element)
2. For each element in array:
   - If element ≠ val:
     • Place element at position k
     • Increment k
3. Return k (new length)
```

### Implementation Steps

```typescript
export function removeElement(nums: number[], val: number): number {
  // TODO: Initialize k to track valid elements position
  // TODO: Loop through each element
  // TODO: If element is not val, place it at position k and increment k
  // TODO: Return k
}
```

### Complexity

- **Time:** O(n) - single pass through array
- **Space:** O(1) - in-place modification

---

## Problem 2: Find Max and Min

### Problem Statement

Find both the maximum and minimum values in an array in a **single pass**.

### Example

```
Input: [3, 1, 4, 1, 5, 9, 2, 6]
Output: [9, 1]  // [max, min]

Input: [-5, -1, -10, -3]
Output: [-1, -10]
```

### Visual Explanation

```
Array: [3, 1, 4, 1, 5, 9, 2, 6]

Initialize:
max = 3, min = 3

Step 1: Check 1
max = 3, min = 1  (1 < 3)

Step 2: Check 4
max = 4, min = 1  (4 > 3)

Step 3: Check 1
max = 4, min = 1  (no change)

Step 4: Check 5
max = 5, min = 1  (5 > 4)

Step 5: Check 9
max = 9, min = 1  (9 > 5)

Step 6: Check 2
max = 9, min = 1  (no change)

Step 7: Check 6
max = 9, min = 1  (no change)

Final: [9, 1]
```

### Algorithm

```
1. Handle empty array error
2. Initialize max and min to first element
3. For each remaining element:
   - If current > max: update max
   - If current < min: update min
4. Return [max, min]
```

### Implementation Steps

```typescript
export function findMaxMin(arr: number[]): [number, number] {
  // TODO: Check if array is empty and throw error
  // TODO: Initialize max and min to first element
  // TODO: Loop through remaining elements
  // TODO: Update max if current is larger
  // TODO: Update min if current is smaller
  // TODO: Return [max, min]
}
```

### Complexity

- **Time:** O(n) - single pass
- **Space:** O(1) - only two variables

---

## Problem 3: Find Longest String

### Problem Statement

Find the longest string in an array. If multiple strings have the same maximum length, return the first one.

### Example

```
Input: ["apple", "banana", "kiwi"]
Output: "banana"

Input: ["a", "bb", "cc"]
Output: "bb"  (first one with length 2)
```

### Visual Explanation

```
Array: ["apple", "banana", "kiwi"]
        len=5   len=6     len=4

Initialize:
longest = "apple" (length 5)

Step 1: Check "banana" (length 6)
6 > 5 → Update longest = "banana"

Step 2: Check "kiwi" (length 4)
4 < 6 → No change

Result: "banana"
```

### Algorithm

```
1. Handle empty array error
2. Initialize longest to first string
3. For each remaining string:
   - If current.length > longest.length:
     • Update longest
4. Return longest
```

### Implementation Steps

```typescript
export function findLongestString(strings: string[]): string {
  // TODO: Check if array is empty and throw error
  // TODO: Initialize longest to first string
  // TODO: Loop through remaining strings
  // TODO: Update longest if current is longer
  // TODO: Return longest
}
```

### Complexity

- **Time:** O(n) - single pass
- **Space:** O(1) - only stores reference

---

## Problem 4: Remove Duplicates (LeetCode 26)

### Problem Statement

Remove duplicates from a **sorted array** in-place. Return the number of unique elements.

### Example

```
Input: [1, 1, 2]
Output: 2
Explanation: nums becomes [1, 2, _]

Input: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]
Output: 5
Explanation: nums becomes [0, 1, 2, 3, 4, _, _, _, _, _]
```

### Visual Explanation

```
Before: [1, 1, 2, 2, 3]
         ^              k = 0 (last unique position)
         i = 1 (current checking position)

Step 1: nums[1] = 1, nums[0] = 1 → Duplicate, skip

Step 2: nums[2] = 2, nums[0] = 1 → Different!
        k++, nums[1] = 2
        [1, 2, 2, 2, 3]
            ^
            k = 1

Step 3: nums[3] = 2, nums[1] = 2 → Duplicate, skip

Step 4: nums[4] = 3, nums[1] = 2 → Different!
        k++, nums[2] = 3
        [1, 2, 3, 2, 3]
               ^
               k = 2

Result: k + 1 = 3 unique elements
```

### Algorithm (Two-Pointer Technique)

```
1. If array is empty, return 0
2. Initialize k = 0 (position of last unique)
3. For i from 1 to end:
   - If nums[i] ≠ nums[k]:
     • k++
     • nums[k] = nums[i]
4. Return k + 1 (count of unique elements)
```

### Key Insight

> Since array is sorted, all duplicates are adjacent. We only need to compare with the previous unique element.

### Implementation Steps

```typescript
export function removeDuplicates(nums: number[]): number {
  // TODO: Handle empty array
  // TODO: Initialize k = 0
  // TODO: Loop from i = 1 to end
  // TODO: If nums[i] different from nums[k], increment k and copy
  // TODO: Return k + 1
}
```

### Complexity

- **Time:** O(n) - single pass
- **Space:** O(1) - in-place

---

## Problem 5: Best Time to Buy and Sell Stock (LeetCode 121)

### Problem Statement

Find the maximum profit from buying and selling a stock once. You must buy before you sell.

### Example

```
Input: [7, 1, 5, 3, 6, 4]
Output: 5
Explanation: Buy at 1, sell at 6 → profit = 5

Input: [7, 6, 4, 3, 1]
Output: 0
Explanation: No profit possible (prices only decrease)
```

### Visual Explanation

```
Prices: [7, 1, 5, 3, 6, 4]

Day 0: price = 7
  minPrice = 7, maxProfit = 0

Day 1: price = 1
  minPrice = 1 (found cheaper!)
  profit = 1 - 1 = 0
  maxProfit = 0

Day 2: price = 5
  minPrice = 1 (still)
  profit = 5 - 1 = 4
  maxProfit = 4 ✓

Day 3: price = 3
  minPrice = 1
  profit = 3 - 1 = 2
  maxProfit = 4 (no change)

Day 4: price = 6
  minPrice = 1
  profit = 6 - 1 = 5
  maxProfit = 5 ✓

Day 5: price = 4
  minPrice = 1
  profit = 4 - 1 = 3
  maxProfit = 5 (no change)

Best: Buy at 1, Sell at 6 → Profit = 5
```

### Algorithm (Single Pass - Greedy)

```
1. If prices empty, return 0
2. Initialize minPrice = prices[0], maxProfit = 0
3. For each price:
   - If price < minPrice: update minPrice
   - Calculate profit = price - minPrice
   - If profit > maxProfit: update maxProfit
4. Return maxProfit
```

### Key Insight

> We want to buy at the lowest price we've seen so far, and sell at the current price to maximize profit.

### Implementation Steps

```typescript
export function maxProfit(prices: number[]): number {
  // TODO: Handle empty array
  // TODO: Initialize minPrice and maxProfit
  // TODO: Loop through prices starting from index 1
  // TODO: Update minPrice if current price is lower
  // TODO: Calculate potential profit
  // TODO: Update maxProfit if current profit is higher
  // TODO: Return maxProfit
}
```

### Complexity

- **Time:** O(n) - single pass
- **Space:** O(1) - two variables

---

## Problem 6: Rotate Array (LeetCode 189)

### Problem Statement

Rotate an array to the right by `k` steps in-place.

### Example

```
Input: nums = [1, 2, 3, 4, 5, 6, 7], k = 3
Output: [5, 6, 7, 1, 2, 3, 4]

Input: nums = [-1, -100, 3, 99], k = 2
Output: [3, 99, -1, -100]
```

### Visual Explanation (Triple Reverse Algorithm)

```
Original: [1, 2, 3, 4, 5, 6, 7]  k = 3

Step 1: Reverse entire array
[7, 6, 5, 4, 3, 2, 1]

Step 2: Reverse first k elements (0 to 2)
[5, 6, 7, 4, 3, 2, 1]
 ←-----→

Step 3: Reverse remaining elements (3 to 6)
[5, 6, 7, 1, 2, 3, 4]
          ←---------→

Result: [5, 6, 7, 1, 2, 3, 4] ✓
```

### Why This Works

```
Original: [A, B, C, D, E]  k = 2
Want:     [D, E, A, B, C]

Reverse all:    [E, D, C, B, A]
Reverse first 2: [D, E, C, B, A]
Reverse last 3:  [D, E, A, B, C] ✓
```

### Algorithm (Triple Reverse)

```
1. If array empty, return
2. Normalize k: k = k % n (handle k > n)
3. If k = 0, return
4. Reverse entire array [0, n-1]
5. Reverse first k elements [0, k-1]
6. Reverse remaining elements [k, n-1]
```

### Implementation Steps

```typescript
export function rotate(nums: number[], k: number): void {
  // TODO: Get array length
  // TODO: Normalize k (k = k % n)
  // TODO: Create helper function to reverse array segment
  // TODO: Reverse entire array
  // TODO: Reverse first k elements
  // TODO: Reverse remaining n-k elements
}
```

### Complexity

- **Time:** O(n) - three passes
- **Space:** O(1) - in-place

---

## Problem 7: Maximum Subarray (LeetCode 53) - Kadane's Algorithm

### Problem Statement

Find the contiguous subarray with the largest sum.

### Example

```
Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6
Explanation: [4, -1, 2, 1] has sum = 6

Input: [1]
Output: 1

Input: [-1, -2, -3]
Output: -1  (best we can do)
```

### Visual Explanation

```
Array: [-2, 1, -3, 4, -1, 2, 1, -5, 4]

i=0: num = -2
  currentSum = -2
  maxSum = -2

i=1: num = 1
  currentSum = max(1, -2+1) = 1  (restart!)
  maxSum = 1

i=2: num = -3
  currentSum = max(-3, 1-3) = -2
  maxSum = 1

i=3: num = 4
  currentSum = max(4, -2+4) = 4  (restart!)
  maxSum = 4

i=4: num = -1
  currentSum = max(-1, 4-1) = 3
  maxSum = 4

i=5: num = 2
  currentSum = max(2, 3+2) = 5
  maxSum = 5

i=6: num = 1
  currentSum = max(1, 5+1) = 6
  maxSum = 6 ✓

i=7: num = -5
  currentSum = max(-5, 6-5) = 1
  maxSum = 6

i=8: num = 4
  currentSum = max(4, 1+4) = 5
  maxSum = 6

Best subarray: [4, -1, 2, 1] with sum = 6
```

### Algorithm (Kadane's Algorithm)

```
1. Check if array is empty (error)
2. Initialize currentSum = nums[0], maxSum = nums[0]
3. For each element from index 1:
   - currentSum = max(current, currentSum + current)
     • Either start new subarray OR extend current
   - maxSum = max(maxSum, currentSum)
4. Return maxSum
```

### Key Insight

> If current sum becomes negative, it can't help future sums. So we restart from the next element.

### Why It Works

```
At each position, we decide:
1. Include current element in existing subarray
2. Start new subarray from current element

We choose whichever gives larger sum.
```

### Implementation Steps

```typescript
export function maxSubArray(nums: number[]): number {
  // TODO: Handle empty array
  // TODO: Initialize currentSum and maxSum to first element
  // TODO: Loop from index 1 to end
  // TODO: Update currentSum (either extend or restart)
  // TODO: Update maxSum if currentSum is larger
  // TODO: Return maxSum
}
```

### Complexity

- **Time:** O(n) - single pass
- **Space:** O(1) - two variables

---

## Problem 9: Two Sum – Practice Guide

This guide covers a classic array + hash map problem that appears frequently in coding interviews. The challenge is to determine whether two numbers in an array add up to a given target value, and to return their indices efficiently.

This problem teaches:

- Hash map usage for fast lookups
- Trading space for time
- Careful handling of indices and complements
- One-pass array processing

---

## Problem: Two Sum

### Problem Statement

You are given:

- `arr[i]`: a number at index `i`
- `target`: an integer target sum

Rules:

- Find **two distinct indices** `i` and `j` such that
  `arr[i] + arr[j] === target`
- Each element may be used **at most once**
- You may assume there is **at most one valid solution**
- Return the indices of the two numbers
- If no solution exists, return `undefined`

---

### Example

**Input:**

```
arr = [2, 7, 11, 15]
target = 9
```

**Output:**

```
[0, 1]
```

**Explanation:**
`arr[0] + arr[1] = 2 + 7 = 9`

---

### Another Example

**Input:**

```
arr = [3, 2, 4]
target = 6
```

**Output:**

```
[1, 2]
```

**Explanation:**
`arr[1] + arr[2] = 2 + 4 = 6`

---

### Duplicate Values Example

**Input:**

```
arr = [3, 3]
target = 6
```

**Output:**

```
[0, 1]
```

**Explanation:**
Even though the values are the same, the indices are different.

---

## Visual Explanation

```
arr = [2, 7, 11, 15]
target = 9

Index:   0   1   2   3
Value:   2   7  11  15

Start:
- Current = 2 → Need 7 → not seen
- Store 2 → index 0

Next:
- Current = 7 → Need 2 → FOUND in map
- Return [0, 1]
```

---

## Algorithm

1. Create an empty hash map to store numbers already seen and their indices.
2. Iterate through the array from left to right.
3. For each element:
   - Compute the complement: `target - current`
   - If the complement exists in the map:
     - Return the stored index and the current index.

   - Otherwise:
     - Store the current value with its index.

4. If the loop ends without finding a pair, return `undefined`.

---

## Key Insight

This problem reduces from **O(n²)** brute force to **O(n)** by using a hash map.

Instead of checking every possible pair, we ask:

> “Have I already seen the number that would complete the target?”

Because array order matters for indices, we must check **before** inserting the current value.

---

## Implementation Steps

```ts
export function twoSum(
  arr: number[],
  target: number,
): [number, number] | undefined {
  // TODO: Create a hash map to store seen values and their indices
  // TODO: Loop through the array
  //   - Compute complement = target - current
  //   - If complement exists → return indices
  //   - Otherwise store current value
  // TODO: Return undefined if no solution exists
}
```

---

## Complexity

**Time:** O(n) — single pass through the array
**Space:** O(n) — hash map storing visited values

---

## Example Behaviors

**Finds a pair**

```
arr = [1, 5, 3, 7]
target = 8
→ [0, 3]
```

**No valid pair**

```
arr = [1, 2, 3]
target = 10
→ undefined
```

**Negative numbers**

```
arr = [-3, 4, 1, 2]
target = -1
→ [0, 2]
```

---

---

## Practice Tips

### Order to Practice

1. **Start with:** removeElement, findMaxMin, findLongestString (easier)
2. **Then:** removeDuplicates, maxProfit (medium)
3. **Finally:** rotate, maxSubArray (harder)

### Common Patterns

- **Two-Pointer:** removeElement, removeDuplicates
- **Single Pass Greedy:** findMaxMin, maxProfit
- **Array Reversal:** rotate
- **Dynamic Programming:** maxSubArray

### Testing Strategy

```typescript
// Always test:
✓ Empty array (when applicable)
✓ Single element
✓ Two elements
✓ All same values
✓ Sorted array
✓ Reverse sorted array
✓ Negative numbers
✓ Mixed positive/negative
```

### Common Mistakes to Avoid

1. ❌ Forgetting to handle empty arrays
2. ❌ Off-by-one errors in loops
3. ❌ Not normalizing k in rotate (k > n case)
4. ❌ Forgetting to return count (not array) for in-place problems
5. ❌ Not maintaining invariants in two-pointer problems

---

## Additional Resources

### Time Complexity Cheat Sheet

| Problem           | Time | Space | Technique          |
| ----------------- | ---- | ----- | ------------------ |
| Remove Element    | O(n) | O(1)  | Two-Pointer        |
| Find Max Min      | O(n) | O(1)  | Single Pass        |
| Longest String    | O(n) | O(1)  | Single Pass        |
| Remove Duplicates | O(n) | O(1)  | Two-Pointer        |
| Max Profit        | O(n) | O(1)  | Greedy             |
| Rotate Array      | O(n) | O(1)  | Triple Reverse     |
| Max Subarray      | O(n) | O(1)  | Kadane's Algorithm |

Happy Coding! 🚀
