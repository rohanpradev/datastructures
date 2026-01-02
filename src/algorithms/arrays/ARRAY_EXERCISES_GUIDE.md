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

## Problem 8: Two Sum – Practice Guide

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

## Problem: Validate Subsequence

### Problem Statement

You are given two arrays of numbers:

- `array`: the main array
- `sequence`: a candidate subsequence

Rules:

- A subsequence must appear in the **same relative order** as in `array`
- Elements do **not** need to be contiguous
- Each element in `sequence` must appear in `array`
- If all elements of `sequence` can be found in order, return `true`
- Otherwise, return `false`

---

### Example

**Input:**

```

array = [5, 1, 22, 25, 6, -1, 8, 10]
sequence = [1, 6, -1, 10]

```

**Output:**

```

true

```

**Explanation:**
The values `1 → 6 → -1 → 10` appear in `array` in the same order, though not contiguously.

---

### Another Example

**Input:**

```

array = [1, 2, 3, 4]
sequence = [2, 4]

```

**Output:**

```

true

```

**Explanation:**
`2` appears before `4` in the array.

---

### Invalid Order Example

**Input:**

```

array = [1, 2, 3]
sequence = [3, 2]

```

**Output:**

```

false

```

**Explanation:**
Although both values exist, the order is not preserved.

---

### Empty Sequence Example

**Input:**

```

array = [1, 2, 3]
sequence = []

```

**Output:**

```

true

```

**Explanation:**
An empty sequence is always a valid subsequence.

---

## Visual Explanation

```

array = [5, 1, 22, 25, 6, -1, 8, 10]
sequence = [1, 6, -1, 10]

arrayIdx: ↑
sequenceIdx: ↑

Step-by-step:

- 5 ≠ 1 → move array pointer
- 1 == 1 → move both pointers
- 22 ≠ 6 → move array pointer
- 25 ≠ 6 → move array pointer
- 6 == 6 → move both pointers
- -1 == -1 → move both pointers
- 10 == 10 → sequence fully matched

```

---

## Algorithm

1. Initialize two pointers:
   - One for traversing `array`
   - One for tracking progress in `sequence`
2. Iterate through `array`:
   - If current elements match, advance the `sequence` pointer
   - Always advance the `array` pointer
3. Stop early if all sequence elements are matched
4. After traversal, check if the entire sequence was matched

---

## Key Insight

You never move backward in either array.

By only advancing the sequence pointer on a match, you guarantee:

- Order preservation
- Linear time complexity
- Constant space usage

This avoids unnecessary comparisons and backtracking.

---

## Implementation Steps

```ts
export function validateSubsequence(
  array: number[],
  sequence: number[],
): boolean {
  // TODO: Initialize two pointers
  // TODO: Traverse the main array
  //   - If elements match, advance sequence pointer
  //   - Always advance array pointer
  // TODO: Return true if all sequence elements were matched
}
```

---

## Complexity

**Time:** O(n) — where `n` is the length of `array`
**Space:** O(1) — constant extra space

---

## Example Behaviors

**Valid subsequence**

```
array = [1, 1, 2, 3]
sequence = [1, 3]
→ true
```

**Not a subsequence**

```
array = [1, 2, 3]
sequence = [2, 4]
→ false
```

**Sequence longer than array**

```
array = [1, 2]
sequence = [1, 2, 3]
→ false
```

**Both arrays empty**

```
array = []
sequence = []
→ true
```

---

## Algorithm

1. Initialize two pointers:
   - `left` starting at the beginning of the array
   - `right` starting at the end of the array
2. Create a result array of the same length as the input.
3. Fill the result array from right to left:
   - Compare the absolute values at `left` and `right`
   - Square the larger absolute value and place it at the current position
4. Move the corresponding pointer inward.
5. Continue until all elements are processed.

---

## Key Insight

The largest square will always come from one of the **ends** of the sorted array.

Because:

- Negative numbers with large magnitude produce large squares
- Positive numbers at the end also produce large squares

By comparing absolute values at both ends, we can:

- Avoid sorting after squaring
- Maintain linear time complexity
- Preserve correctness with a single pass

---

## Implementation Steps

```ts
export function sortedSquaredArray(nums: number[]): number[] {
  // TODO: Initialize left and right pointers
  // TODO: Create a result array
  // TODO: Fill result from right to left
  //   - Compare absolute values at both pointers
  //   - Square the larger value and insert
  // TODO: Move pointers inward
  // TODO: Return the result array
}
```

---

## Complexity

**Time:** O(n) — single pass through the array
**Space:** O(n) — output array required

---

## Example Behaviors

**Mixed negative and positive values**

```
nums = [-4, -1, 0, 3, 10]
→ [0, 1, 9, 16, 100]
```

**All negative numbers**

```
nums = [-7, -5, -3, -1]
→ [1, 9, 25, 49]
```

**All positive numbers**

```
nums = [1, 2, 3, 4]
→ [1, 4, 9, 16]
```

**Single element**

```
nums = [-5]
→ [25]
```

**Empty array**

```
nums = []
→ []
```

---

## Tournament Winner

Determines the overall winner of a tournament based on match results.
Each match consists of a **home team** and an **away team**, and results
indicate which team won.

---

## Problem Summary

- `competitions[i]` = `[homeTeam, awayTeam]`
- `results[i]`:
  - `1` → home team wins
  - `0` → away team wins
- Each win is worth **1 point**
- The team with the **highest total wins** is the tournament winner
- There is always exactly **one winner**

---

## Algorithm

1. Initialize a hash map to track win counts for each team.
2. Track the current tournament leader and their win count.
3. Iterate through all competitions:
   - Determine the winner based on the result.
   - Increment the winner’s count in the map.
   - Update the leader if this team has more wins than the current leader.
4. Return the team with the highest win count.

---

## Key Insight

You don’t need to wait until the end to find the winner.

By updating the tournament leader **as you process each match**, you:

- Avoid an extra pass over the data
- Maintain linear time complexity
- Keep the logic simple and efficient

The hash map allows constant-time score updates.

---

## Implementation

````ts
export function tournamentWinner(
  competitions: Array<[string, string]>,
  results: number[],
): string {
  const winCounts: Record<string, number> = {};
  let currentLeader = "";
  let maxWins = 0;

  for (let i = 0; i < competitions.length; i++) {
    const [homeTeam, awayTeam] = competitions[i];
    const winner = results[i] === 1 ? homeTeam : awayTeam;

    winCounts[winner] = (winCounts[winner] ?? 0) + 1;

    if (winCounts[winner] > maxWins) {
      maxWins = winCounts[winner];
      currentLeader = winner;
    }
  }

  return currentLeader;
}

---

## The "1 Logic" in Non-Constructible Change

The key insight is based on the number **1** and constructing sums incrementally.

### Problem Recap

- You have a set of positive integers (coins) `nums`.
- You want the **smallest amount of change** you **cannot** create using any subset of these coins.
- Coins can only be used once per sum.

---

## Core Idea

1. Sort the coins in **ascending order**.
2. Track the **maximum constructible change so far** with a variable `change`.
   - Initially, `change = 0` because we can construct nothing yet.
3. For each coin `val` in sorted order:
   - If `val > change + 1`:
     - There is a **gap**.
       Example: if `change = 3` and `val = 5`, then `4` cannot be formed.
     - Return `change + 1` immediately.
   - Otherwise:
     - Extend the constructible range: `change += val`.
4. After processing all coins, return `change + 1` as the smallest non-constructible value.

---

## Why `1` Is Special

- **The smallest possible sum we need to construct is 1**.
  If the array does **not contain 1**, then **1 is immediately unconstructible**.
- Sorting ensures that we always start from the smallest coin:
  - If the first coin is > 1 → return 1 immediately.
  - Otherwise, we incrementally build up sums starting from 1.

---

## Example Walkthrough

```ts
nums = [1, 1, 3, 4];
sorted = [1, 1, 3, 4];

change = 0

val = 1 → change = 1
val = 1 → change = 2
val = 3 → change = 5
val = 4 → change = 9

// All sums from 1 to 9 are constructible
return change + 1 → 10
````

**Another example without 1:**

```ts
nums = [2, 3, 4]
sorted = [2, 3, 4]

change = 0
val = 2 → val > change + 1 → return 1
```

- Since the first coin is 2, the smallest change we **cannot make is 1**.

---

## Backspace String Compare

This problem focuses on comparing two strings where the `#` character behaves like a **backspace** in a text editor.

---

## Problem Recap

- You are given **two strings** `s` and `t`.
- The character `#` represents a **backspace**, which deletes the previous character (if any).
- Each string is typed into an empty editor.
- Return `true` if both strings result in the **same final text**, otherwise `false`.

---

## Core Idea

Instead of rebuilding the strings, we:

1. Traverse **both strings from right to left**.
2. Use **skip counters** to track how many characters should be ignored due to backspaces.
3. Compare only the **valid characters** that remain after applying backspaces.

This avoids extra memory and keeps the solution efficient.

---

## Why Right-to-Left Works

- A backspace (`#`) only affects characters **before it**.
- By scanning from the end:
  - We can immediately decide whether a character should be skipped.
  - No need to build the full string or use a stack.

---

## Algorithm Steps

1. Initialize two pointers at the **end of each string**.
2. Maintain two counters (`skipS`, `skipT`) for pending backspaces.
3. For each string:
   - If the current character is `#`, increment the skip counter.
   - If `skip > 0`, skip the character and decrement the counter.
   - Otherwise, the character is valid.

4. Compare the current valid characters from both strings.
   - If they differ → return `false`.

5. Continue until both strings are fully processed.
6. If all comparisons match → return `true`.

---

## Example Walkthrough

### Example 1

```ts
s = "ab#c";
t = "ad#c";
```

Processing:

- `#` removes `b` and `d`
- Final strings → `"ac"` and `"ac"`

✅ Result: `true`

---

### Example 2

```ts
s = "a#c";
t = "b";
```

Processing:

- `s` → `"c"`
- `t` → `"b"`

❌ Result: `false`

---

## Implementation

```ts
/**
 * Compares two strings where '#' represents a backspace.
 *
 * @param s - First input string
 * @param t - Second input string
 * @returns True if both strings are equal after applying backspaces
 */
function backspaceStringCompare(s: string, t: string): boolean {
  let i = s.length - 1;
  let j = t.length - 1;

  let skipS = 0;
  let skipT = 0;

  while (i >= 0 || j >= 0) {
    // Find next valid character in s
    while (i >= 0) {
      if (s[i] === "#") {
        skipS++;
        i--;
      } else if (skipS > 0) {
        skipS--;
        i--;
      } else {
        break;
      }
    }

    // Find next valid character in t
    while (j >= 0) {
      if (t[j] === "#") {
        skipT++;
        j--;
      } else if (skipT > 0) {
        skipT--;
        j--;
      } else {
        break;
      }
    }

    const charS = i >= 0 ? s[i] : null;
    const charT = j >= 0 ? t[j] : null;

    if (charS !== charT) return false;

    i--;
    j--;
  }

  return true;
}
```

---

## Complexity Analysis

- **Time Complexity:** `O(n + m)`
  - Each character in both strings is visited at most once.

- **Space Complexity:** `O(1)`
  - No extra data structures are used.

---

## Key Takeaways

- Backspaces affect **previous characters**, not future ones.
- Right-to-left traversal is the key insight.
- Skip counters allow us to process backspaces efficiently.
- This is the **optimal solution** expected in interviews.

---

# Transpose Matrix

This problem focuses on **transposing a 2D matrix**, turning rows into columns and columns into rows.

---

## Problem Recap

- You are given a **2D array** (matrix) of size `m x n`.
- Your task is to return a **new matrix** where:
  - The first row becomes the first column
  - The second row becomes the second column
  - And so on…

Formally:
If `matrix[i][j] = x`, then in the transposed matrix: `transposed[j][i] = x`.

---

## Core Idea

1. Determine the size of the new matrix:
   - If original is `m x n`, transposed will be `n x m`.

2. Iterate over the original matrix:
   - For each element `matrix[i][j]`, place it in `transposed[j][i]`.

3. Return the transposed matrix.

---

## Why It Works

- **Rows become columns**:
  - Iterating through rows and columns ensures each element is placed in the correct position.

- **Rectangular matrices are supported**:
  - Works for `m ≠ n` because we calculate dimensions dynamically.

- **Immutable**:
  - Original matrix is not modified (good for functional programming and testing).

---

## Example Walkthrough

### Example 1: Square Matrix

```ts
matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
```

Transpose:

```
[
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
]
```

---

### Example 2: Rectangular Matrix

```ts
matrix = [
  [1, 2],
  [3, 4],
  [5, 6],
];
```

Transpose:

```
[
  [1, 3, 5],
  [2, 4, 6],
]
```

---

### Example 3: Single Row / Column

```ts
matrix = [[1, 2, 3]];
```

Transpose:

```
[
  [1],
  [2],
  [3],
]
```

```ts
matrix = [[1], [2], [3]];
```

Transpose:

```
[[1, 2, 3]]
```

---

## Complexity Analysis

- **Time Complexity:** `O(m * n)`
  Every element is visited exactly once.
- **Space Complexity:** `O(n * m)`
  The new transposed matrix requires space proportional to the original size.

---

## Key Takeaways

- Transpose swaps **rows and columns** systematically.
- Works for both **square** and **rectangular** matrices.
- Common in **linear algebra**, **image processing**, and **data manipulation**.
- Knowing dimensions and iterating carefully ensures correctness.

---

## Key Takeaways

- Always check **for 1 first** implicitly by the greedy algorithm.
- The algorithm **builds the constructible range incrementally**.
- If a coin ever exceeds `change + 1`, the **gap** identifies the non-constructible change.
- This approach is **O(n log n)** due to sorting, then **O(n)** for the scan.

---

## Problem : Maximize Number of Planes Stopped Before Landing (HackerRank)

### Problem Statement

You are given two arrays of length `N`:

- `initialDistance[]` — where `initialDistance[i]` is the **starting distance** of the _i-th_ plane from the runway
- `landingSpeed[]` — where `landingSpeed[i]` is the **speed** at which the _i-th_ plane is approaching the runway

At **every second**, you can shoot down **at most one plane**.

A plane lands once its distance becomes **less than or equal to zero**.

Your task is to determine the **maximum number of planes** that can be stopped before they land.

---

### Example

```
initialDistance = [1, 3, 5, 4, 8]
landingSpeed    = [1, 2, 2, 1, 2]

Output: 4
```

---

### Key Insight

Each plane has a **deadline** — the time (in seconds) at which it will land:

```
landingTime[i] = ceil(initialDistance[i] / landingSpeed[i])
```

This converts the problem into a **task scheduling problem**:

- Each plane is a task
- Each task takes **1 second**
- Each task has a **deadline**
- Only **one task per second** can be completed

To maximize the number of planes stopped:

> **Always stop the plane that will land the earliest.**

---

### Visual Explanation

```
Plane   Distance   Speed   Landing Time
P1         1         1         1
P2         3         2         2
P3         5         2         3
P4         4         1         4
P5         8         2         4

Sorted landing times:
[1, 2, 3, 4, 4]

Time (seconds): 1  2  3  4
Plane stopped:  ✓  ✓  ✓  ✓

Maximum planes stopped = 4
```

---

### Algorithm (Greedy Scheduling)

```
function maxPlanesStopped(initialDistance, landingSpeed):
	landingTimes = []

	for i in range N:
		timeToLand = ceil(initialDistance[i] / landingSpeed[i])
		landingTimes.push(timeToLand)

	sort landingTimes in ascending order

	currentSecond = 0
	stoppedPlanes = 0

	for each landingTime in landingTimes:
		if currentSecond < landingTime:
			currentSecond += 1
			stoppedPlanes += 1

	return stoppedPlanes
```

---

### Implementation Steps

```typescript
function maxPlanesStopped(
  initialDistance: number[],
  landingSpeed: number[],
): number {
  // 1. Compute landing time for each plane
  // 2. Sort landing times
  // 3. Greedily stop planes before deadlines
  // 4. Return count of planes stopped
}
```

---

### Edge Cases

- No planes → return `0`
- Multiple planes landing at the same second
- Very fast planes (small landing times)
- All planes land too early
- Large input sizes

---

### Complexity

- **Time:** `O(n log n)` — sorting landing times
- **Space:** `O(n)` — storing deadlines

---

### Common Mistakes

- Using floor division instead of **ceiling**
- Ignoring the “one plane per second” rule
- Shooting planes in arbitrary order
- Simulating second-by-second instead of scheduling

---

### Interview Tips

- Identify this as a **deadline scheduling** problem
- Mention similarity to job scheduling with deadlines
- Explain why greedy sorting works
- Clarify constraints before coding
- Discuss how the solution scales

---

### Summary

- Convert distances and speeds into **landing deadlines**
- Sort by earliest landing
- Greedily stop planes to maximize count
- Clean, optimal, and interview-ready solution

---

# Problem: Minimum Waiting Time

### Problem Statement

You are given an array of positive integers representing the **duration of tasks**. Tasks are executed **sequentially**, one after another.

The **waiting time** for a task is the total time it waits for **all previous tasks to complete**.

Your goal is to **minimize the total waiting time** for all tasks by choosing the optimal order to execute them.

---

### Example

```ts
Input: [3, 2, 1, 2, 6]

// Sort in ascending order: [1, 2, 2, 3, 6]

Waiting times per task:
Task 1 (1) → waits 0
Task 2 (2) → waits 1
Task 3 (2) → waits 1 + 2 = 3
Task 4 (3) → waits 1 + 2 + 2 = 5
Task 5 (6) → waits 1 + 2 + 2 + 3 = 8

Total waiting time = 0 + 1 + 3 + 5 + 8 = 17
```

---

### Algorithm

1. **Sort tasks** in ascending order (shortest first)
2. Initialize `totalWaitingTime = 0`
3. For each task:
   - Multiply its duration by the number of tasks **after it**
   - Add this to `totalWaitingTime`

4. Return `totalWaitingTime`

---

### Implementation (TypeScript)

```ts
/**
 * Calculates the minimum total waiting time for a list of tasks.
 *
 * @param nums - Array of positive integers representing task durations
 * @returns Minimum total waiting time
 */
function minimumWaitingTime(nums: number[]): number {
  nums.sort((a, b) => a - b);
  let total = 0;

  for (let i = 0; i < nums.length; i++) {
    total += nums[i] * (nums.length - i - 1);
  }

  return total;
}

// Example
console.log(minimumWaitingTime([3, 2, 1, 2, 6])); // 17
```

---

### Step-by-Step Example

```
Input: [3, 2, 1, 2, 6]
Step 1: Sort → [1, 2, 2, 3, 6]
Step 2: Calculate waiting times
  1 → 0
  2 → 1
  2 → 1+2 = 3
  3 → 1+2+2 = 5
  6 → 1+2+2+3 = 8
Step 3: Total waiting time = 0+1+3+5+8 = 17
```

---

### Complexity

- **Time:** `O(n log n)` → sorting the array
- **Space:** `O(1)` → in-place calculations

---

## Problem: Class Photo (Height Ordering)

### Problem Statement

You are given two arrays of positive integers:

- `redShirts` — heights of students wearing red shirts
- `blueShirts` — heights of students wearing blue shirts

Each array represents a group of students. You want to take a class photo where:

- Students wear **only one shirt color per row**
- One color is entirely in the **back row**
- The other color is entirely in the **front row**
- **Every student in the back row must be strictly taller** than the student directly in front of them

Return `true` if a valid photo arrangement is possible, otherwise return `false`.

---

### Example

```
Input:
redShirts  = [5, 8, 1, 3, 4]
blueShirts = [6, 9, 2, 4, 5]

Output:
true
```

**Explanation:**
Blue shirts can be placed in the back row, where each blue-shirt student is taller than the corresponding red-shirt student.

---

### Visual Explanation

```
Sorted (tallest → shortest):

Red:  [8, 5, 4, 3, 1]
Blue: [9, 6, 5, 4, 2]

Back Row:  Blue
Front Row: Red

Comparison:
9  >  8  ✔
6  >  5  ✔
5  >  4  ✔
4  >  3  ✔
2  >  1  ✔

All pairs satisfy the height condition → Valid photo
```

---

### Key Observations

- Both rows must have the **same number of students**
- Sorting helps compare students **pairwise**
- Only **one color** can be the back row
- Heights must be **strictly greater**, not equal

---

### Algorithm

```
1. If arrays have different lengths → return false
2. Sort both arrays in descending order
3. If tallest students have equal height → return false
4. Decide which color is in the back row
5. For each index:
   - Ensure back-row student is strictly taller
6. If all comparisons pass → return true
```

---

### Implementation (TypeScript)

```ts
/**
 * Determines whether a class photo can be taken such that
 * one shirt color is entirely in the back row and every student
 * in the back row is strictly taller than the student in front.
 *
 * @param redShirts - Heights of students wearing red shirts
 * @param blueShirts - Heights of students wearing blue shirts
 * @returns True if a valid class photo arrangement exists, otherwise false
 */
export function classPhoto(redShirts: number[], blueShirts: number[]): boolean {
  // If the groups are not the same size, a valid photo is impossible
  if (redShirts.length !== blueShirts.length) return false;

  // Sort both arrays from tallest to shortest
  redShirts.sort((a, b) => b - a);
  blueShirts.sort((a, b) => b - a);

  // If the tallest students are the same height, no valid back row exists
  if (redShirts[0] === blueShirts[0]) return false;

  // Determine which color must be in the back row
  const backRow = redShirts[0] > blueShirts[0] ? "red" : "blue";

  // Compare each pair of students by height
  for (let i = 0; i < redShirts.length; i++) {
    if (backRow === "red") {
      if (redShirts[i] <= blueShirts[i]) return false;
    } else {
      if (blueShirts[i] <= redShirts[i]) return false;
    }
  }

  return true;
}
```

---

### Complexity Analysis

- **Time Complexity:** `O(n log n)`
  (sorting both arrays)

- **Space Complexity:** `O(1)`
  (in-place sorting, constant extra space)

---

# 🧑‍🏫 Class Photo (Height Ordering)

## 📘 Problem Statement

You are given two arrays of positive integers:

- `redShirts` — heights of students wearing red shirts
- `blueShirts` — heights of students wearing blue shirts

Each array represents a group of students. You want to take a class photo where:

- Students wear **only one shirt color per row**
- One color is entirely in the **back row**
- The other color is entirely in the **front row**
- **Every student in the back row must be strictly taller** than the student directly in front of them

Return `true` if a valid photo arrangement is possible, otherwise return `false`.

---

## ✅ Example

### Input

```txt
redShirts  = [5, 8, 1, 3, 4]
blueShirts = [6, 9, 2, 4, 5]
```

### Output

```txt
true
```

### Explanation

Blue-shirt students can be placed in the back row. After sorting and comparing students pairwise, every blue-shirt student is strictly taller than the corresponding red-shirt student in front.

---

## 🖼️ Visual Explanation

```txt
Sorted (tallest → shortest):

Red:  [8, 5, 4, 3, 1]
Blue: [9, 6, 5, 4, 2]

Back Row:   Blue
Front Row: Red

Comparison:
9  >  8  ✔
6  >  5  ✔
5  >  4  ✔
4  >  3  ✔
2  >  1  ✔

✔ Valid photo arrangement
```

---

## 🔍 Key Observations

- Both rows must contain the **same number of students**
- Only **one shirt color** can be in the back row
- Heights must be **strictly greater**, not equal
- Sorting allows **direct pairwise comparison**
- The decision is **greedy** and depends on the tallest students

---

## 🧠 Algorithm Outline

```txt
1. Ensure both arrays have the same length
2. Sort both arrays by height
3. Determine which color must be the back row
4. Compare students pairwise by height
5. If any comparison fails → return false
6. Otherwise → return true
```

---

## 🧩 Implementation Reference (TypeScript)

```ts
function classPhoto(redShirts: number[], blueShirts: number[]): boolean {
  // 1. If the arrays have different lengths, return false
  // 2. Sort both arrays in descending order
  // 3. Compare the tallest students to determine the back row
  // 4. For each index:
  //    - Ensure the back-row student is strictly taller
  // 5. Return true if all comparisons pass
}
```

---

## ⏱️ Complexity Analysis

- **Time Complexity:** `O(n log n)`
  (sorting both arrays)

- **Space Complexity:** `O(1)`
  (in-place sorting, constant extra space)

---

## Problem: Optimal Freelancing (Job Sequencing with Deadlines)

### Problem Statement

You are given a list of freelance jobs. Each job has:

- a **deadline** (the latest day the job can be completed)
- a **payment**

Rules:

- Each job takes **exactly one day**
- You can complete **at most one job per day**
- You can work for **7 days total**

Your goal is to **maximize the total payment** by choosing which jobs to complete.

---

### Example

```
Input:
jobs = [
  { deadline: 1, payment: 100 },
  { deadline: 2, payment: 19 },
  { deadline: 2, payment: 27 },
  { deadline: 1, payment: 25 },
  { deadline: 3, payment: 15 }
]

Output:
142
```

**Explanation**

An optimal schedule is:

- Day 1 → payment 100
- Day 2 → payment 27
- Day 3 → payment 15

Total = `100 + 27 + 15 = 142`

---

### Visual Explanation

We have 7 available days:

```
Days:    1   2   3   4   5   6   7
Slots:  [ ] [ ] [ ] [ ] [ ] [ ] [ ]
```

#### Step 1: Sort jobs by payment (descending)

```
(1,100), (2,27), (1,25), (2,19), (3,15)
```

---

#### Step 2: Schedule each job as late as possible

**Job (deadline=1, payment=100)**
→ Place on Day 1

```
[100] [ ] [ ] [ ] [ ] [ ] [ ]
```

**Job (deadline=2, payment=27)**
→ Place on Day 2

```
[100] [27] [ ] [ ] [ ] [ ] [ ]
```

**Job (deadline=1, payment=25)**
→ Day 1 is taken → skip

**Job (deadline=2, payment=19)**
→ Day 2 is taken → Day 1 is taken → skip

**Job (deadline=3, payment=15)**
→ Place on Day 3

```
[100] [27] [15] [ ] [ ] [ ] [ ]
```

---

### Key Insight

> **Always schedule the highest-paying job first, and place it as late as possible.**

Why?

- High-paying jobs are hard to replace
- Scheduling late keeps earlier days free for jobs with tighter deadlines

---

### Algorithm (Greedy Strategy)

```
1. Sort jobs by payment in descending order
2. Create an array of 7 slots (one per day)
3. For each job:
   a. Start from min(deadline, 7)
   b. Move backward to find the latest free day
   c. If found, schedule the job
4. Return total payment
```

---

### Implementation (TypeScript)

```ts
export function optimalFreelancing(
  jobs: Array<{ deadline: number; payment: number }>,
): number {
  const slots: Array<number | undefined> = new Array(7).fill(undefined);

  // Step 1: Sort by highest payment first
  jobs.sort((a, b) => b.payment - a.payment);

  let totalMoney = 0;

  // Step 2: Try to schedule each job
  for (const job of jobs) {
    // Convert deadline (1–7) to index (0–6)
    let idx = Math.min(job.deadline - 1, 6);

    // Step 3: Find the latest available day
    while (idx >= 0) {
      if (slots[idx] === undefined) {
        slots[idx] = job.payment;
        totalMoney += job.payment;
        break;
      }
      idx--;
    }
  }

  return totalMoney;
}
```

---

### Complexity

- **Time:** `O(n log n)` — sorting jobs
- **Space:** `O(1)` — only 7 slots used

---

### Common Mistakes to Avoid

- ❌ Scheduling jobs on the **earliest** available day
- ❌ Ignoring already-used days
- ❌ Not sorting by payment first
- ❌ Allowing more than one job per day

---

### Learning Pattern

This problem is a classic example of:

- **Greedy algorithms**
- **Scheduling problems**
- **“Do the most valuable work first” strategy**

You’ll see this pattern again in:

- CPU task scheduling
- Interval scheduling
- Resource allocation problems

---

## 📌 Notes

This problem focuses on:

- Sorting fundamentals
- Greedy pairing strategies
- Careful handling of equality edge cases

The key insight is that **once the tallest students determine the back row**, the rest of the comparison follows naturally.

---

## Problem : Binary Search (LeetCode 704)

### Problem Statement

Given a **sorted** array of integers `nums` and an integer `target`, return the **index** of `target` if it exists in the array.
If `target` does not exist, return `null`.

> ⚠️ The array is sorted in **ascending order**, which makes binary search possible.

---

### Example

```
Input: nums = [-1, 0, 3, 5, 9, 12], target = 9
Output: 4
Explanation: 9 exists at index 4

Input: nums = [-1, 0, 3, 5, 9, 12], target = 2
Output: null
Explanation: 2 does not exist in the array
```

---

### Visual Explanation

```
nums = [-1, 0, 3, 5, 9, 12]
target = 9

left = 0, right = 5

Step 1:
mid = floor((0 + 5) / 2) = 2
nums[mid] = 3

3 < 9 → Search right half
left = mid + 1 = 3

Step 2:
mid = floor((3 + 5) / 2) = 4
nums[mid] = 9

Found target at index 4 ✅
```

---

### Algorithm (Binary Search)

```
1. Initialize left = 0 and right = nums.length - 1
2. While left ≤ right:
   - Compute mid = floor((left + right) / 2)
   - If nums[mid] == target → return mid
   - If nums[mid] < target → search right half (left = mid + 1)
   - If nums[mid] > target → search left half (right = mid - 1)
3. If loop ends, target is not present → return null
```

---

### Implementation Steps

```typescript
export function binarySearch(nums: number[], target: number): number | null {
  // TODO: Initialize left and right pointers
  // TODO: Loop while left <= right
  // TODO: Calculate mid index
  // TODO: Compare nums[mid] with target
  // TODO: Adjust search range accordingly
  // TODO: Return index if found, otherwise null
}
```

---

### Complexity

- **Time:** O(log n) — search space is halved each iteration
- **Space:** O(1) — no extra memory used

---

### Notes

- Binary search **only works on sorted arrays**
- If duplicates exist, **any valid index** of the target may be returned
- The function does **not modify** the input array

---

## Problem : Three Largest Numbers

### Problem Statement

Given an array of integers `nums`, return the **three largest numbers** in the array.

The function should:

- Run in **O(n)** time
- Use **O(1)** extra space
- **Not sort** the array
- **Not modify** the input array

The returned array should be ordered as:

```
[thirdLargest, secondLargest, largest]
```

---

### Example

```
Input: nums = [10, 5, 9, 10, 12]
Output: [10, 10, 12]

Input: nums = [-1, 3, 0, 2, 5]
Output: [2, 3, 5]
```

---

### Visual Explanation

```
nums = [10, 5, 9, 10, 12]

Start:
result = [-∞, -∞, -∞]
           ^    ^    ^
          3rd  2nd  1st

Read 10:
result = [-∞, -∞, 10]

Read 5:
result = [-∞, 5, 10]

Read 9:
result = [5, 9, 10]

Read 10:
result = [9, 10, 10]

Read 12:
result = [10, 10, 12]
```

---

## Problem : Three Largest Numbers

### Problem Statement

Given an array of integers `nums`, return the **three largest numbers** in the array.

The function should:

- Run in **O(n)** time
- Use **O(1)** extra space
- **Not sort** the array
- **Not modify** the input array

The returned array is ordered as:

```
[thirdLargest, secondLargest, largest]
```

---

### Example

```
Input: nums = [10, 5, 9, 10, 12]
Output: [10, 10, 12]

Input: nums = [-1, 3, 0, 2, 5]
Output: [2, 3, 5]
```

---

### Visual Explanation

```
nums = [10, 5, 9, 10, 12]

Start:
result = [-∞, -∞, -∞]   // [thirdLargest, secondLargest, largest]

Read 10:
result = [-∞, -∞, 10]

Read 5:
result = [-∞, 5, 10]

Read 9:
result = [5, 9, 10]

Read 10:
result = [9, 10, 10]

Read 12:
result = [10, 10, 12]
```

---

### Algorithm (Single-Pass Tracking with Helper)

1. Initialize `result = [-∞, -∞, -∞]`
   - `result[0]` → third largest
   - `result[1]` → second largest
   - `result[2]` → largest

2. For each number in `nums`:
   - If number > `result[2]`: insert as largest
   - Else if number > `result[1]`: insert as second largest
   - Else if number > `result[0]`: insert as third largest

3. Use a helper function `shiftAndUpdate` to shift smaller elements left and insert the new value at the correct index.

4. Return `result`.

---

### Implementation

```typescript
export function threeLargestNumbers(nums: number[]): number[] {
  // TODO: Initialize result array to [-Infinity, -Infinity, -Infinity]
  // TODO: Iterate through each number in nums
  // TODO: Use conditional logic to determine if num should go in result
  // TODO: Call shiftAndUpdate to insert at correct index
  // TODO: Return result
}

function shiftAndUpdate(arr: number[], value: number, index: number) {
  // TODO: Shift smaller elements left to make room for new value
  // TODO: Insert value at the specified index
}
```

---

### Complexity

- **Time:** `O(n)` — one pass through the array
- **Space:** `O(1)` — constant extra space

---

### Notes

- Handles **negative numbers**
- Supports **duplicate values**
- Does **not mutate** the input array
- Assumes `nums.length >= 3`

---

## Caesar Cipher Encryptor

### Problem Statement

Given a string and a numeric `shift`, encrypt the string using a **Caesar Cipher**.

A Caesar Cipher shifts each **alphabetic character** forward in the alphabet by a fixed number of positions.

---

### Rules

- Lowercase letters (`a–z`) remain lowercase
- Uppercase letters (`A–Z`) remain uppercase
- Alphabet wrapping is supported (`z → a`, `Z → A`)
- Special characters (spaces, numbers, symbols) are **not changed**
- Shift values can be positive, negative, or greater than 26

---

### Example

```
Input:  "abc", shift = 1
Output: "bcd"

Input:  "xyz", shift = 2
Output: "zab"

Input:  "Hello, World!", shift = 3
Output: "Khoor, Zruog!"
```

---

### Visual Explanation

```
Alphabet Index Mapping:
a b c d e ... x y z
0 1 2 3 4     23 24 25

Example: "xyz", shift = 2

x (23) + 2 → z (25)
y (24) + 2 → a (wrap)
z (25) + 2 → b (wrap)

Result: "zab"
```

---

### Uppercase & Lowercase Handling

```
Input:  "AbCz", shift = 1
Output: "BcDa"
```

- Uppercase and lowercase characters are processed separately
- Case is preserved after shifting

---

### Special Characters

Non-alphabet characters are not encrypted.

```
Input:  "Hello, World! 123"
Output: "Mjqqt, Btwqi! 123"
```

---

### Algorithm Overview

```
1. Normalize the shift to stay within 0–25
2. Create an empty result string
3. Loop through each character in the input string
4. If character is lowercase:
   - Convert to alphabet index (0–25)
   - Apply shift and wrap using modulo
   - Convert back to lowercase letter
5. Else if character is uppercase:
   - Convert to alphabet index (0–25)
   - Apply shift and wrap using modulo
   - Convert back to uppercase letter
6. Else:
   - Append character as-is
7. Return the encrypted string
```

---

### Implementation Steps (with TODOs)

```ts
export function caesarCipherEncryptor(str: string, shift: number): string {
  // TODO: Define the alphabet size (26)
  // TODO: Normalize the shift to handle negative and large values
  // TODO: Initialize an empty string to store the encrypted result
  // TODO: Loop through each character in the input string
  // TODO: Get the character code of the current character
  // TODO: Check if the character is a lowercase letter (a–z)
  // TODO: Convert character code to a 0–25 range
  // TODO: Apply the shift and wrap using modulo
  // TODO: Convert back to a lowercase character and append to result
  // TODO: Else if the character is an uppercase letter (A–Z)
  // TODO: Convert character code to a 0–25 range
  // TODO: Apply the shift and wrap using modulo
  // TODO: Convert back to an uppercase character and append to result
  // TODO: Else (non-alphabet character)
  // TODO: Append the character without modifying it
  // TODO: Return the final encrypted string
}
```

---

### Why Modulo (%) Is Important

Modulo ensures the shift wraps around the alphabet:

```
'z' + 1 → 'a'
'Z' + 1 → 'A'
```

It also allows:

- Large shifts (`shift = 28`)
- Negative shifts (`shift = -1`)

---

### Complexity

- **Time:** O(n) — processes each character once
- **Space:** O(n) — creates a new encrypted string

---

# Run-Length Encoding (RLE)

### Problem Statement

Run-Length Encoding (RLE) is a **simple form of data compression** where consecutive repeated characters are replaced by a **count followed by the character**.

The goal is to **compress repeated characters** in a string while keeping counts ≤ 9.

---

### Rules

- Only consecutive **alphabetic characters** are counted.
- **Counts are capped at 9** — longer runs are split.
- Non-repeated characters are encoded as `1<character>`.
- The function should handle:
  - Empty strings
  - Single-character strings
  - Long runs

---

### Examples

```
Input:  "aaabbc"
Output: "3a2b1c"

Input:  "AAAAAAAAAAAAABBCCCCDD"
Output: "9A4A2B4C2D"

Input:  "ABABAB"
Output: "1A1B1A1B1A1B"

Input:  "A"
Output: "1A"

Input:  ""
Output: ""
```

---

### Visual Explanation

Input: `"AAAAAAAAAAAAABBCCCCDD"`

```
AAAAAAAAAAAAA → 13 A's
Split into 9A + 4A

BB            → 2 B's → 2B
CCCC          → 4 C's → 4C
DD            → 2 D's → 2D

Final Encoded: 9A4A2B4C2D
```

---

### Algorithm (Step-by-Step)

1. Initialize:
   - `count = 1`
   - `currentChar = first character of string`

2. Loop through the string starting at index 1:
   - If the current character is the same as `currentChar` and `count < 9`, increment `count`.
   - Else:
     - Append `count` + `currentChar` to the result.
     - Reset `currentChar = current character` and `count = 1`.

3. After the loop, append the **final run** (`count + currentChar`) to the result.
4. Return the encoded string.

---

### Implementation Steps (with TODOs)

```ts
export function runLengthEncoding(str: string): string {
  // TODO: Handle empty string case
  // TODO: Initialize array to store encoded result
  // TODO: Initialize count = 1 and currentChar = str[0]
  // TODO: Loop through string from index 1
  // TODO: If same character and count < 9, increment count
  // TODO: Else, push count + currentChar to array, reset currentChar and count
  // TODO: After loop, push final count + currentChar
  // TODO: Join array into a single string and return
}
```

---

### Complexity

- **Time:** O(n) — each character is processed once
- **Space:** O(n) — new array for encoded string

---

### Edge Cases

| Input          | Output       |
| -------------- | ------------ |
| `""`           | `""`         |
| `"A"`          | `"1A"`       |
| `"AAAAAAAAAA"` | `"9A1A"`     |
| `"ABCD"`       | `"1A1B1C1D"` |

---

### Summary

✅ Encodes repeated characters efficiently
✅ Handles counts > 9 by splitting runs
✅ Works for empty and single-character strings
✅ Clear, step-by-step logic for interviews

---

# String / Array Exercises – Practice Guide

## Overview

This guide contains essential coding exercises for arrays and strings, focusing on algorithms like two-pointer technique, sorting, and hash map usage.

---

## Exercise 4: Three Number Sum

### Problem Statement

Given an array of numbers and a target sum, find **all unique triplets** in the array whose sum equals the target.

---

### Examples

```text
Input: nums = [1, 2, 3, 4, 5, 6], target = 10
Output: [[1, 3, 6], [1, 4, 5], [2, 3, 5]]

Input: nums = [0, -1, 2, -3, 1], target = 0
Output: [[-3, 1, 2], [-1, 0, 1]]
```

---

### Visual Explanation

Input array: `[1, 2, 3, 4, 5, 6]`, target = 10

1. Sort the array → `[1, 2, 3, 4, 5, 6]`
2. Pick the first element (`i`) as 1:
   - Use two pointers `left` and `right` to find pairs summing to `10 - 1 = 9`
   - Found pairs: `[3,6]` and `[4,5]`

3. Pick the first element as 2:
   - Pairs summing to `10 - 2 = 8` → `[3,5]`

4. Continue until all triplets are found.

---

### Algorithm (Two-Pointer Technique)

1. **Sort** the array in ascending order.
2. Iterate through the array with index `i` for the first element.
3. For each `i`, initialize:
   - `left = i + 1`
   - `right = nums.length - 1`

4. While `left < right`:
   - Calculate `currentSum = nums[i] + nums[left] + nums[right]`
   - If `currentSum === target`, store triplet `[nums[i], nums[left], nums[right]]` and move both pointers.
   - If `currentSum < target`, increment `left`.
   - If `currentSum > target`, decrement `right`.

5. Return the list of all triplets found.

---

### Function Implementation (with TODO comments)

```ts
/**
 * Finds all unique triplets in an array that sum to a target value.
 *
 * @param nums - Array of numbers to search
 * @param target - Target sum for the triplets
 * @returns Array of triplets where each triplet sums to target
 */
export function threeNumberSum(nums: number[], target: number): number[][] {
  // TODO: Sort the array in ascending order

  // TODO: Initialize result array

  // TODO: Iterate over array (i) for the first element
  //   - Set left = i + 1, right = nums.length - 1
  //   - While left < right:
  //       - Compute sum of three elements
  //       - If sum === target, store triplet and move both pointers
  //       - Else if sum < target, move left forward
  //       - Else move right backward

  // TODO: Return result array
  return []; // placeholder
}
```

---

### Complexity Analysis

- **Time Complexity:** O(n²) — outer loop O(n), inner two-pointer O(n)
- **Space Complexity:** O(n) — for storing result array

---

### Notes for Practice

- Useful for mastering **two-pointer technique**.
- Sorting the array allows **efficient pair searching**.
- Can be extended to k-sum problems with recursion.

---

# Array / Algorithm Exercises – Practice Guide

## Overview

This guide contains essential coding exercises for arrays and strings, focusing on algorithmic techniques like two-pointers, sorting, and hash map usage. Each problem is designed to improve problem-solving skills for coding interviews.

---

## Exercise 5: Smallest Difference

### Problem Statement

Given two arrays of numbers, find a pair of numbers (one from each array) whose **absolute difference** is the smallest among all possible pairs.

---

### Examples

```text
Input: arr1 = [1, 3, 15, 11, 2], arr2 = [23, 127, 235, 19, 8]
Output: [11, 8]
Explanation: The pair (11, 8) has the smallest absolute difference: |11 - 8| = 3

Input: arr1 = [10, 20, 14], arr2 = [8, 13, 17]
Output: [14, 13]
```

---

### Visual Explanation

1. Sort both arrays:
   `arr1 = [1, 2, 3, 11, 15]`
   `arr2 = [8, 19, 23, 127, 235]`

2. Initialize two pointers at the start of each array.

3. Compare current elements:
   - Track the pair with the **smallest difference**.
   - Move the pointer of the smaller number forward to reduce the difference.

4. Continue until one pointer reaches the end of its array.

5. Return the pair with the smallest absolute difference.

---

### Algorithm (Two-Pointer Technique)

1. **Sort both arrays** in ascending order.
2. Initialize pointers `left` at start of `arr1`, `right` at start of `arr2`.
3. Initialize `smallestDiff` and `diff = Infinity`.
4. While both pointers are in bounds:
   - Compute `currentDiff = |arr1[left] - arr2[right]|`.
   - If `currentDiff < diff`, update `smallestDiff`.
   - Move the pointer of the smaller value forward.

5. Return `smallestDiff`.

---

### Function Implementation (with TODO comments)

```ts
/**
 * Finds the pair of numbers (one from each array) with the smallest absolute difference.
 *
 * @param arr1 - The first array of numbers
 * @param arr2 - The second array of numbers
 * @returns A pair of numbers, one from each array, with the smallest absolute difference
 */
export function smallestDifference(
  arr1: number[],
  arr2: number[],
): [number, number] {
  // TODO: Sort both arrays in ascending order

  // TODO: Initialize pointers and variables to track smallest difference

  // TODO: While pointers are in bounds:
  //   - Calculate absolute difference of current pair
  //   - Update smallest pair if difference is smaller
  //   - Move the pointer of the smaller value

  // TODO: Return the pair with the smallest absolute difference
  return [arr1[0], arr2[0]]; // placeholder
}
```

---

### Complexity Analysis

- **Time Complexity:** O(n log n + m log m) — sorting + linear scan
- **Space Complexity:** O(1) — only pointers and variables

---

### Notes for Practice

- Useful for mastering **two-pointer technique on sorted arrays**.
- Avoids brute force O(n\*m) comparisons.
- Can be extended to k-array closest difference problems.

---

# Array / Algorithm Exercises – Practice Guide

## Overview

This guide contains essential coding exercises for arrays and strings, focusing on algorithmic techniques like two-pointers, sorting, and in-place modifications. Each problem is designed to improve problem-solving skills for coding interviews.

---

## Exercise 6: Move Element to the End

### Problem Statement

Given an array, move the element at a given index to the **end of the array in-place**, shifting all other elements as necessary.

- Do **not** create a new array.
- Return the modified array.

---

### Examples

```ts
moveElementToTheEnd([1, 2, 3, 4, 5], 2);
// Returns: [1, 2, 4, 5, 3]

moveElementToTheEnd([10, 20, 30], 0);
// Returns: [20, 30, 10]

moveElementToTheEnd(["a", "b", "c"], 2);
// Returns: ["a", "b", "c"] (element already at the end)
```

---

### Visual Explanation

```
Array: [1, 2, 3, 4, 5]
Index to move: 2 (value 3)

Step 1: Shift elements to the left to fill the gap:
[1, 2, 4, 5, 5]

Step 2: Place value at the end:
[1, 2, 4, 5, 3]
```

---

### Algorithm

1. **Validate index**: Ensure the index is within array bounds.
2. **Early return**: If the element is already at the end, return array.
3. **Store value**: Save the element to move.
4. **Shift elements**: Move all elements after the index one position to the left.
5. **Place value**: Set the saved element at the last position.
6. **Return array**.

---

### Function Implementation (with TODO comments)

```ts
/**
 * Moves the element at the given index to the end of the array in-place.
 *
 * @template T
 * @param {T[]} arr - The array to modify
 * @param {number} idx - The index of the element to move
 * @returns {T[]} The modified array with the element moved to the end
 *
 * @throws {Error} If the index is out of bounds
 */
export function moveElementToTheEnd<T>(arr: T[], idx: number): T[] {
  // TODO: Validate index
  // TODO: Return array if index is already at the end
  // TODO: Save element at idx
  // TODO: Shift elements left to fill the gap
  // TODO: Place saved element at the end
  // TODO: Return modified array
  return arr;
}
```

---

### Complexity Analysis

- **Time Complexity:** O(n) – each element after the index is shifted once
- **Space Complexity:** O(1) – in-place modification

---

### Notes

- Generic `<T>` allows arrays of numbers, strings, objects, or any type.
- Handles **first, middle, last, and single-element arrays**.
- Throws an error if the index is invalid.

---

## Problem: Monotonic Array

### Problem Statement

Given an array of numbers `nums`, determine whether the array is **monotonic**.

An array is monotonic if it is either:

- entirely **non-decreasing**, or
- entirely **non-increasing**

Return `true` if the array is monotonic, otherwise return `false`.

### Example

```
Input: nums = [1, 2, 2, 3]
Output: true
Explanation: The array never decreases.

Input: nums = [6, 5, 4, 4]
Output: true
Explanation: The array never increases.

Input: nums = [1, 3, 2]
Output: false
Explanation: The array increases, then decreases.
```

### Visual Explanation

```
Example: [1, 3, 2]

Compare 1 → 3  (increasing)
Direction = up

Compare 3 → 2  (decreasing)
Direction changes from up → down ❌

Result: Not monotonic
```

```
Example: [5, 4, 4, 2]

Compare 5 → 4  (decreasing)
Direction = down

Compare 4 → 4  (equal, ignore)

Compare 4 → 2  (still decreasing)

Result: Monotonic ✅
```

### Algorithm (Single Pass with Direction Tracking)

```
1. Initialize direction = null
2. Loop through the array starting from index 1
3. Compare current element with previous:
   - If decreasing:
     • If direction was "up", return false
     • Set direction to "down"
   - If increasing:
     • If direction was "down", return false
     • Set direction to "up"
   - If equal:
     • Do nothing
4. If loop finishes without conflict, return true
```

### Implementation Steps

```typescript
export function monotonicArray(nums: number[]): boolean {
  // TODO: Initialize direction as null
  // TODO: Loop through the array starting from index 1
  // TODO: Detect increasing or decreasing direction
  // TODO: If direction ever changes, return false
  // TODO: Return true if no conflicts are found
}
```

### Complexity

- **Time:** O(n) — single pass through the array
- **Space:** O(1) — constant extra space

---

## Problem: Spiral Traverse

### Problem Statement

Given a non-empty 2D array `arr`, return a new array containing all elements of the array in **spiral order (clockwise)**, starting from the top-left corner.

The traversal proceeds layer by layer:

1. Top row (left → right)
2. Right column (top → bottom)
3. Bottom row (right → left)
4. Left column (bottom → top)

### Example

```
Input:
arr = [
  [1,  2,  3,  4],
  [5,  6,  7,  8],
  [9, 10, 11, 12]
]

Output:
[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
```

### Visual Explanation

```
Step 1: Top row
[1,  2,  3,  4]
 ↑   ↑   ↑   ↑

Step 2: Right column
                ↓
[5,  6,  7,  8]
                ↓
[9, 10, 11, 12]

Step 3: Bottom row (reverse)
[9, 10, 11, 12]
 ↑   ↑   ↑   ↑

Step 4: Left column (up)
 ↑
[5,  6,  7,  8]
```

Final traversal order:

```
1 → 2 → 3 → 4 → 8 → 12 → 11 → 10 → 9 → 5 → 6 → 7
```

### Algorithm (Boundary Shrinking Technique)

```
1. Initialize four boundaries:
   - startRow, endRow
   - startColumn, endColumn
2. While boundaries are valid:
   a. Traverse top row (left → right)
   b. Traverse right column (top → bottom)
   c. Traverse bottom row (right → left), if rows remain
   d. Traverse left column (bottom → top), if columns remain
3. Shrink all boundaries inward
4. Repeat until all elements are collected
```

### Implementation Steps

```typescript
export function spiralTraverse<T>(arr: T[][]): T[] {
  // TODO: Initialize boundary pointers
  // TODO: Loop while rows and columns remain
  // TODO: Traverse top row
  // TODO: Traverse right column
  // TODO: Traverse bottom row (with boundary check)
  // TODO: Traverse left column (with boundary check)
  // TODO: Shrink boundaries
  // TODO: Return result
}
```

### Complexity

- **Time:** O(n × m) — every element is visited once
- **Space:** O(n × m) — output array storing all elements

---

## Problem: Longest Peak

### Problem Statement

Given an array of integers `nums`, return the length of the **longest peak**.

A **peak** is defined as a contiguous sequence of integers that:

1. Is **strictly increasing**
2. Reaches a **single highest value**
3. Is **strictly decreasing**
4. Has a **minimum length of 3**

If no peak exists, return `0`.

---

### Examples

```
Input: nums = [1, 2, 3, 4, 5, 1]
Output: 6
Explanation: Entire array forms a peak

Input: nums = [1, 3, 2]
Output: 3
Explanation: [1, 3, 2] is a valid peak

Input: nums = [1, 2, 3]
Output: 0
Explanation: No decreasing part → not a peak
```

---

### Visual Explanation

```
Array: [1, 2, 3, 5, 4, 3, 2]

              peak
               ↓
Index:   0  1  2  3  4  5  6
Values: [1, 2, 3, 5, 4, 3, 2]

Step 1: Identify peak at index 3 (value = 5)
        5 > 3 and 5 > 4

Step 2: Expand left
        3 < 5
        2 < 3
        1 < 2
        Stop at index 0

Step 3: Expand right
        5 > 4
        4 > 3
        3 > 2
        Stop at index 6

Peak length = 6 - 0 + 1 = 7
```

---

### Key Observations

- A peak **must** have both an uphill and downhill
- Flat values (`=`) break a peak
- Once a peak is processed, its elements don’t need to be revisited

---

### Algorithm (Optimized Pointer Technique)

```
1. Start from index 1 (peaks need neighbors)
2. While index < length - 1:
   - Check if current index is a peak
   - If not, move forward
3. If a peak is found:
   - Expand left while values strictly increase
   - Expand right while values strictly decrease
   - Calculate peak length
   - Update longest peak
   - Skip to the end of this peak
4. Return longest peak length
```

---

### Implementation

```typescript
/**
 * Returns the length of the longest peak in the array.
 *
 * A peak is a contiguous sequence that strictly increases,
 * reaches a single maximum, then strictly decreases.
 */
export function longestPeak(nums: number[]): number {
  let longest = 0;
  let i = 1;

  while (i < nums.length - 1) {
    const isPeak = nums[i] > nums[i - 1] && nums[i] > nums[i + 1];

    if (!isPeak) {
      i++;
      continue;
    }

    // Expand left
    let left = i - 1;
    while (left > 0 && nums[left - 1] < nums[left]) {
      left--;
    }

    // Expand right
    let right = i + 1;
    while (right < nums.length - 1 && nums[right] > nums[right + 1]) {
      right++;
    }

    const currentPeakLength = right - left + 1;
    longest = Math.max(longest, currentPeakLength);

    // Skip processed elements
    i = right;
  }

  return longest;
}
```

---

### Complexity Analysis

- **Time Complexity:** `O(n)`
  - Each element is visited at most once

- **Space Complexity:** `O(1)`
  - No extra data structures used

---

# Problem: Array of Products Except Self

### Problem Statement

Given an array of numbers `nums`, return a new array where each element at index `i` is the **product of all numbers in `nums` except `nums[i]`**.

**Constraints:**

- Do **not use division**.
- Time complexity: O(n)
- Space complexity: O(n) or O(1) extra (excluding output array)
- The input array may contain zeros or negative numbers.

---

### Examples

```ts
Input:  [1, 2, 3, 4]
Output: [24, 12, 8, 6]
Explanation:
  - Index 0: 2*3*4 = 24
  - Index 1: 1*3*4 = 12
  - Index 2: 1*2*4 = 8
  - Index 3: 1*2*3 = 6

Input:  [0, 1, 2, 3]
Output: [6, 0, 0, 0]
Explanation:
  - Zero at index 0 means all products except index 0 are 0
```

---

### Visual Explanation

```
nums = [1, 2, 3, 4]

Step 1: Calculate prefix products (products to the left of each index)
Index:   0  1  2  3
Prefix:  1  1  2  6

Step 2: Calculate suffix products (products to the right of each index)
Index:   0  1  2  3
Suffix:  24 12 4 1

Step 3: Multiply prefix * suffix element-wise
Result: [24, 12, 8, 6]
```

---

### Algorithm (Prefix & Suffix Method)

```
1. Initialize result array with 1s.
2. Compute prefix products for each index:
   - result[i] = product of all numbers to the left of i
3. Compute suffix products while updating result in reverse:
   - Multiply result[i] by product of all numbers to the right of i
4. Return result array
```

---

### Implementation

```ts
/**
 * Returns an array where each element is the product of all numbers
 * except nums[i], without using division.
 */
export function arrayOfProducts(nums: number[]): number[] {
  const n = nums.length;
  const result: number[] = new Array(n).fill(1);

  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }

  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }

  return result;
}
```

---

### Complexity

- **Time:** O(n) — two passes through the array
- **Space:** O(n) — result array, or O(1) extra if allowed to reuse output

---

## Number of Islands

### Problem Statement

Given a 2D grid (matrix) of integers where:

- `1` represents **land**
- `0` represents **water**

An **island** is formed by connecting adjacent land cells (`1`s) **horizontally or vertically** (not diagonally).

Your task is to **count the total number of islands** in the grid.

The grid may be modified during processing.

---

### Example 1

```
Input:
matrix = [
  [1, 1, 0, 0],
  [1, 0, 0, 1],
  [0, 0, 1, 1]
]

Output: 3
```

**Explanation:**

- Island 1: top-left cluster
- Island 2: single land cell at (1,3)
- Island 3: bottom-right cluster

---

### Example 2

```
Input:
matrix = [
  [1, 1, 1],
  [0, 1, 0],
  [1, 1, 1]
]

Output: 1
```

**Explanation:**
All land cells are connected vertically or horizontally, forming one island.

---

### Example 3 (Edge Case)

```
Input:
matrix = [
  [0, 0],
  [0, 0]
]

Output: 0
```

**Explanation:**
No land cells exist.

---

## Key Observations

- Every time we encounter a `1` that hasn’t been visited, we’ve found **a new island**
- Once we find a land cell, we must **visit all connected land cells** so we don’t count the same island twice
- We can mark visited land cells by changing them from `1` → `0`

---

## Visual Explanation (BFS Traversal)

```
Grid:
[1, 1, 0]
[0, 1, 0]
[1, 0, 1]

Step 1:
Start at (0,0) → found land → islandCount = 1

Queue: [(0,0)]
Mark (0,0) as water

Step 2:
Visit neighbors → (0,1) and (1,1)
Mark them as water

Grid now:
[0, 0, 0]
[0, 0, 0]
[1, 0, 1]

Step 3:
Continue scanning grid
Found land at (2,0) → islandCount = 2

Step 4:
Found land at (2,2) → islandCount = 3
```

---

## Approach

We use **Breadth-First Search (BFS)** to explore each island fully.

### High-Level Steps

1. Loop through every cell in the grid
2. When a `1` is found:
   - Increment island count
   - Start BFS from that cell
   - Mark all connected `1`s as `0`

3. Continue until the grid is fully scanned

---

### Directions Used

We only move in **4 directions**:

```
Up    → (-1, 0)
Right → (0, 1)
Down  → (1, 0)
Left  → (0, -1)
```

Diagonal movement is not allowed.

---

## Algorithm (BFS)

```
1. Initialize islandCount = 0
2. Loop through each cell in the matrix
3. If cell == 1:
   - islandCount++
   - Push cell into queue
   - Mark cell as 0
4. While queue is not empty:
   - Pop a cell
   - Check its 4 neighbors
   - If neighbor is land (1):
     • Push into queue
     • Mark as 0
5. Return islandCount
```

---

## Implementation (TypeScript)

```ts
export function numberOfIslands(matrix: number[][]): number {
  if (matrix.length === 0 || matrix[0].length === 0) return 0;

  let islandCount = 0;
  const rows = matrix.length;
  const cols = matrix[0].length;

  const directions: Array<[number, number]> = [
    [-1, 0], // up
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
  ];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (matrix[row][col] === 0) continue;

      islandCount++;
      matrix[row][col] = 0;

      const queue: Array<[number, number]> = [[row, col]];

      while (queue.length > 0) {
        const [r, c] = queue.shift()!;

        for (const [dr, dc] of directions) {
          const nr = r + dr;
          const nc = c + dc;

          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

          if (matrix[nr][nc] === 1) {
            matrix[nr][nc] = 0;
            queue.push([nr, nc]);
          }
        }
      }
    }
  }

  return islandCount;
}
```

---

## Complexity Analysis

- **Time Complexity:** `O(rows × cols)`
  - Each cell is visited at most once

- **Space Complexity:** `O(rows × cols)` in the worst case (queue for BFS)

---

## Notes & Variations

- This solution **mutates the input grid**
- You can also solve this using:
  - **DFS (recursive or iterative)**
  - A separate `visited` matrix if mutation is not allowed

- Diagonal connectivity would require **8 directions instead of 4**

---

### Edge Cases

| Input        | Output        | Explanation                           |
| ------------ | ------------- | ------------------------------------- |
| `[]`         | `[]`          | Empty array                           |
| `[5]`        | `[1]`         | Single element → product of empty = 1 |
| `[0, 0, 1]`  | `[0, 0, 0]`   | Multiple zeros                        |
| `[1, -2, 3]` | `[-6, 3, -2]` | Handles negative numbers              |

---

### Edge Cases

| Input       | Output | Reason                   |
| ----------- | ------ | ------------------------ |
| `[]`        | `0`    | No elements              |
| `[1, 2]`    | `0`    | Too short to form a peak |
| `[1, 2, 3]` | `0`    | No decreasing part       |
| `[3, 2, 1]` | `0`    | No increasing part       |
| `[1, 3, 2]` | `3`    | Valid peak               |

---

## Problem: Rotten Oranges (LeetCode 994)

### Problem Statement

You are given a 2D grid representing a box of oranges:

- `0` → **Empty cell**
- `1` → **Fresh orange**
- `2` → **Rotten orange**

Every minute, any **fresh orange adjacent** (up, down, left, right) to a rotten orange becomes rotten.

Return the **minimum number of minutes** needed until **no fresh oranges remain**.

If:

- It is impossible to rot all oranges → return `-1`
- There are no fresh oranges initially → return `0`

---

### Example

```
Input:
grid = [
  [2, 1, 1],
  [1, 1, 0],
  [0, 1, 1]
]

Output:
4
```

**Explanation:**
The rot spreads outward from the initial rotten orange. It takes `4` minutes to rot all fresh oranges.

---

### Visual Explanation

```
Minute 0:
[ R ][ F ][ F ]
[ F ][ F ][ E ]
[ E ][ F ][ F ]

Minute 1:
[ R ][ R ][ F ]
[ R ][ F ][ E ]
[ E ][ F ][ F ]

Minute 2:
[ R ][ R ][ R ]
[ R ][ R ][ E ]
[ E ][ F ][ F ]

Minute 3:
[ R ][ R ][ R ]
[ R ][ R ][ E ]
[ E ][ R ][ F ]

Minute 4:
[ R ][ R ][ R ]
[ R ][ R ][ E ]
[ E ][ R ][ R ]
```

Legend:

- `R` = Rotten (2)
- `F` = Fresh (1)
- `E` = Empty (0)

---

### Key Idea: Multi-Source Breadth-First Search (BFS)

- All initially rotten oranges act as **starting points**
- Rot spreads **simultaneously** in all directions
- BFS naturally models the passage of time (levels = minutes)

---

### Algorithm (High-Level)

```
1. Add all rotten oranges to the BFS queue
2. Count the number of fresh oranges
3. For each BFS level (minute):
   - Rot all adjacent fresh oranges
   - Decrease fresh count
4. Stop when no fresh oranges remain
5. Return elapsed minutes
```

---

### BFS Rules

- Movement allowed: up, down, left, right
- Skip cells that are:
  - Out of bounds
  - Empty (0)
  - Already rotten (2)

- Each BFS level represents **one minute**

---

### Implementation Skeleton

```ts
export function orangesRotting(grid: number[][]): number {
  // TODO: Initialize queue with all rotten oranges
  // TODO: Count fresh oranges
  // TODO: Perform BFS level by level
  // TODO: Return minutes or -1 if impossible
}
```

---

### Edge Cases Covered

- ✅ No fresh oranges → return `0`
- ✅ Fresh oranges unreachable → return `-1`
- ✅ Multiple starting rotten oranges
- ✅ Non-square grids
- ✅ Single-cell grids

---

### Complexity

- **Time:** `O(m × n)`
  Each cell is processed at most once

- **Space:** `O(m × n)`
  Queue can contain all oranges in the worst case

---

### Notes

- The grid is **mutated in-place** by marking fresh oranges as rotten
- BFS ensures the **minimum time** is calculated
- This is a classic **multi-source BFS** problem

---

## Problem: Walls and Gates (Shortest Distance to a Room)

### Problem Statement

You are given a 2D grid (`matrix`) representing a layout of:

- `0` → **Gate**
- `1` → **Empty room**
- `-1` → **Wall**

From each gate, you can move **up, down, left, or right** (no diagonals).

Your task is to find the **shortest distance from any gate to the nearest reachable room**.

If:

- No rooms are reachable from any gate → return `-1`
- There are **no gates at all** → return `Infinity`

---

### Example

```
Input:
matrix = [
  [0,  1,  1],
  [1, -1,  1],
  [1,  1,  1]
]

Output:
1
```

**Explanation:**
The gate at `(0,0)` is directly next to an empty room, so the shortest distance is `1`.

---

### Visual Explanation

```
Grid:
[ G ][ R ][ R ]
[ R ][ W ][ R ]
[ R ][ R ][ R ]

Legend:
G = Gate (0)
R = Room (1)
W = Wall (-1)
```

#### BFS Traversal from Gate `(0,0)`

```
Distance = 0
Start at gate (0,0)

Distance = 1
→ (1,0), (0,1)  ← first reachable rooms found
```

✅ Shortest distance = **1**

---

### Key Idea: Breadth-First Search (BFS)

- BFS explores the grid **level by level**
- The first time a room is reached, it is guaranteed to be the **shortest path**
- We run BFS **from each gate** and track the minimum distance found

---

### Algorithm (High-Level)

```
1. Initialize shortest distance as Infinity
2. Loop through every cell in the matrix
3. When a gate (0) is found:
   - Run BFS starting from that gate
   - Track distance to nearest reachable room
   - Update shortest distance
4. Return the shortest distance found
```

---

### BFS Rules

- Movement allowed: up, down, left, right
- Skip cells that are:
  - Out of bounds
  - Walls (-1)
  - Not empty rooms (must be exactly 1)

- Mark visited rooms as `2` to avoid revisiting

---

### Implementation Skeleton

```ts
export function wallsAndGates(matrix: number[][]): number {
  // TODO: Track shortest distance
  // TODO: Loop through matrix to find gates
  // TODO: Run BFS from each gate
  // TODO: Return shortest distance found
}
```

---

### Edge Cases Covered

- ✅ Multiple gates → choose the minimum distance
- ✅ Rooms blocked by walls → return `-1`
- ✅ No gates in grid → return `Infinity`
- ✅ Non-square grids
- ✅ Single-cell grids

---

### Complexity

- **Time:** `O(m × n)`
  Each cell is visited at most once per BFS run

- **Space:** `O(m × n)`
  BFS queue in the worst case

---

### Notes

- The function **mutates the matrix** by marking visited rooms
- Each BFS run requires a fresh matrix state
- This implementation focuses on **distance discovery**, not filling distances into the grid

---

Practice Tips

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

| Problem                  | Time       | Space   | Technique / Pattern                |
| ------------------------ | ---------- | ------- | ---------------------------------- |
| Remove Element           | O(n)       | O(1)    | Two-Pointer                        |
| Find Max Min             | O(n)       | O(1)    | Single Pass                        |
| Longest String           | O(n)       | O(1)    | Single Pass                        |
| Remove Duplicates        | O(n)       | O(1)    | Two-Pointer                        |
| Max Profit               | O(n)       | O(1)    | Greedy                             |
| Rotate Array             | O(n)       | O(1)    | Triple Reverse                     |
| Max Subarray             | O(n)       | O(1)    | Kadane’s Algorithm                 |
| Two Sum                  | O(n)       | O(n)    | Hash Map                           |
| Validate Subsequence     | O(n)       | O(1)    | Two-Pointer                        |
| Sorted Squared Array     | O(n)       | O(n)    | Two-Pointer (Ends Inward)          |
| Printing Press Capacity  | O(n)       | O(1)    | Greedy / Array Partitioning        |
| Tournament Winner        | O(n)       | O(n)    | Hash Map / Counting                |
| Non-Constructable Change | O(n log n) | O(1)    | Sorting / Greedy                   |
| Transpose Matrix         | O(n\*m)    | O(n\*m) | Nested Loops / Matrix Manipulation |
| Backspace String Compare | O(n)       | O(1)    | Two-Pointer / Stack Simulation     |
| Max Planes Stopped       | O(n log n) | O(n)    | Sweep Line / Sorting               |
| Minimum Waiting Time     | O(n log n) | O(1)    | Greedy / Sorting                   |
| Class Photo              | O(n log n) | O(1)    | Sorting / Greedy                   |
| Tandem Bicycle           | O(n log n) | O(1)    | Sorting / Greedy                   |
| Optimal Freelancing      | O(n log n) | O(1)    | Sorting / Greedy                   |
| Binary Search            | O(log n)   | O(1)    | Divide & Conquer                   |
| Find Longest String      | O(n)       | O(1)    | Single Pass                        |
| Find Max Min             | O(n)       | O(1)    | Single Pass                        |

---

Happy Coding! 🚀
