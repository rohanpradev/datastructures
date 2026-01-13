# Dynamic Programming – Core Patterns & Interview Problems

## Overview

This guide covers **Dynamic Programming (DP)**, one of the most important problem-solving techniques in coding interviews. It focuses on recognizing **overlapping subproblems**, defining correct **state transitions**, and choosing between **top-down (memoization)** and **bottom-up (tabulation)** approaches.

Mastering dynamic programming helps solve optimization, counting, and decision problems efficiently—turning exponential brute-force solutions into polynomial-time algorithms.

---

## What Is Dynamic Programming?

Dynamic Programming is a technique where:

- A problem is broken into **smaller overlapping subproblems**
- Each subproblem is solved **once**
- Results are **stored and reused**

### When to Use DP

Use dynamic programming when:

- The problem can be split into subproblems
- Subproblems overlap
- There is an **optimal substructure** (optimal solution depends on optimal solutions of subproblems)

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

# Levenshtein Distance (Edit Distance) — Dynamic Programming Guide

## Overview

The **Levenshtein Distance**, also known as **Edit Distance**, measures how different two strings are.

It represents the **minimum number of single-character operations** required to transform one string into another.

This is a **classic dynamic programming problem** and appears frequently in:

- Coding interviews
- Spell checkers
- Autocomplete systems
- DNA / text comparison
- Search relevance & fuzzy matching

---

## Allowed Operations

You may perform **only one character operation at a time**:

1. **Insert** a character
2. **Delete** a character
3. **Replace** a character

Each operation has a cost of **1**.

---

## Examples

### Example 1

```
Input:
str1 = "kitten"
str2 = "sitting"

Output:
3
```

**Explanation**

```
kitten → sitten   (replace 'k' with 's')
sitten → sittin   (replace 'e' with 'i')
sittin → sitting  (insert 'g')
```

---

### Example 2

```
Input:
str1 = "flaw"
str2 = "lawn"

Output:
2
```

**Explanation**

```
flaw → law   (delete 'f')
law  → lawn  (insert 'n')
```

---

### Example 3 (Edge Case)

```
Input:
str1 = ""
str2 = "abc"

Output:
3
```

**Explanation**

- Insert all 3 characters.

---

## Key Idea (Intuition)

Instead of comparing entire strings at once, we:

> **Break the problem into smaller substrings**
> and build the solution **bottom-up**.

We answer this question repeatedly:

> “What is the minimum number of edits needed to convert
> the first `i` characters of `str1`
> into the first `j` characters of `str2`?”

---

## Dynamic Programming Table

We create a 2D table:

```
dp[i][j] = minimum edits to convert
           str1[0..i-1] → str2[0..j-1]
```

### Table Dimensions

```
Rows    = str1.length + 1
Columns = str2.length + 1
```

---

## Visual Demo

### Input

```
str1 = "cat"
str2 = "cut"
```

### DP Table

```
      ""  c  u  t
   ----------------
"" |  0  1  2  3
c  |  1  0  1  2
a  |  2  1  1  2
t  |  3  2  2  1
```

### Explanation

- `dp[0][j]` → insert all characters
- `dp[i][0]` → delete all characters
- Characters match → carry diagonal
- Characters differ → take min(insert, delete, replace) + 1

✅ Final Answer = `dp[3][3] = 1`

---

## Algorithm (Step-by-Step)

1. Create a 2D array `dp`
2. Initialize base cases:
   - `dp[i][0] = i` (deletions)
   - `dp[0][j] = j` (insertions)

3. For each character pair:
   - If characters match → copy diagonal
   - Else → `1 + min(insert, delete, replace)`

4. Return the bottom-right cell

---

## Implementation

```ts
/**
 * Computes the Levenshtein (Edit) Distance between two strings.
 *
 * @param str1 - Source string
 * @param str2 - Target string
 * @returns Minimum number of edit operations
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const n = str1.length;
  const m = str2.length;

  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i][j - 1], // Insert
            dp[i - 1][j], // Delete
            dp[i - 1][j - 1], // Replace
          );
      }
    }
  }

  return dp[n][m];
}
```

---

## Complexity Analysis

- **Time Complexity:** `O(n × m)`
- **Space Complexity:** `O(n × m)`

Where:

- `n` = length of `str1`
- `m` = length of `str2`

---

## Common Mistakes

❌ Forgetting base cases (`dp[0][*]`, `dp[*][0]`)
❌ Off-by-one errors with indices
❌ Confusing _replace_ with _insert + delete_
❌ Trying greedy approaches (they fail!)

---

## Interview Tips

- Always explain **what `dp[i][j]` represents**
- Mention **why DP is required** (overlapping subproblems)
- Draw a **small table** during explanation
- Call out **insert / delete / replace explicitly**

---

## Related Problems

- Longest Common Subsequence (LCS)
- Minimum Insertions to Make Palindrome
- One Edit Distance
- Word Break (DP)
- Sequence Alignment (Bioinformatics)

---

## Key Takeaways

- Levenshtein Distance is a **foundational DP problem**
- Builds solutions from **small substrings**
- Used heavily in **real-world systems**
- Once understood, many string DP problems become easier

---

# Number of Ways to Traverse a Graph — Dynamic Programming & Combinatorics Guide

## Overview

The **Number of Ways to Traverse a Graph** problem asks:

> **How many unique paths exist from the top-left corner to the bottom-right corner of a grid**,
> if you can move **only RIGHT or DOWN**?

This is a **classic dynamic programming problem** and a foundational example for:

- Grid-based DP
- Combinatorics
- Recursion vs optimization
- Interview problem-solving patterns

---

## Problem Statement

You are given a grid of size:

```
width  ×  height
```

Starting at the **top-left cell**, you must reach the **bottom-right cell**.

### Movement Rules

You may move **only**:

- ➡️ RIGHT
- ⬇️ DOWN

---

## Examples

### Example 1

```
Input:
width = 3
height = 3

Output:
6
```

### Example 2

```
Input:
width = 2
height = 4

Output:
4
```

### Example 3 (Edge Case)

```
Input:
width = 1
height = 5

Output:
1
```

**Explanation**
If there is only one row or one column, there is **only one possible path**.

---

## Key Insight (Intuition)

To reach any cell `(row, col)` in the grid:

> You must have come from either:
>
> - the cell **above** `(row - 1, col)`
> - the cell **to the left** `(row, col - 1)`

So:

```
ways[row][col] =
  ways[row - 1][col] + ways[row][col - 1]
```

This overlapping subproblem structure makes it a **perfect fit for Dynamic Programming**.

---

## Approach 1: Naive Recursion

### Idea

At each step:

- Move RIGHT
- Move DOWN
- Add both results

### Base Case

If either:

- `width === 1` **or**
- `height === 1`

➡️ There is exactly **1 way**.

---

### Recursive Implementation

```ts
export function numOfWaysToTraverseGraphRecursive(
  width: number,
  height: number,
): number {
  if (width === 1 || height === 1) return 1;

  return (
    numOfWaysToTraverseGraphRecursive(width - 1, height) +
    numOfWaysToTraverseGraphRecursive(width, height - 1)
  );
}
```

---

### Complexity

- **Time:** `O(2^(width + height))` ❌
- **Space:** `O(width + height)` (call stack)

⚠️ **Not scalable** due to repeated subproblem computation.

---

## Approach 2: Dynamic Programming (2D Grid)

### Idea

Store the number of ways to reach each cell so that:

- Each subproblem is solved **once**
- Results are reused

---

### DP Table Definition

```
ways[row][col] =
number of ways to reach cell (row, col)
```

---

### Initialization

- First row → `1` (can only move RIGHT)
- First column → `1` (can only move DOWN)

---

### DP Implementation

```ts
export function numberOfWaysToTraverseGraph(
  width: number,
  height: number,
): number {
  const ways: number[][] = Array.from({ length: height }, () =>
    new Array(width).fill(0),
  );

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (row === 0 || col === 0) {
        ways[row][col] = 1;
      } else {
        ways[row][col] = ways[row - 1][col] + ways[row][col - 1];
      }
    }
  }

  return ways[height - 1][width - 1];
}
```

---

### Complexity

- **Time:** `O(width × height)` ✅
- **Space:** `O(width × height)`

This is the **most common interview solution**.

---

## Approach 3: Combinatorics (Mathematical Solution)

### Key Observation

To reach the bottom-right cell, you must make:

- `width - 1` RIGHT moves
- `height - 1` DOWN moves

Total moves:

```
totalMoves = (width - 1) + (height - 1)
```

The problem becomes:

> **How many unique permutations exist of these moves?**

---

### Formula

```
(totalMoves)! / (rightMoves! × downMoves!)
```

This is a **binomial coefficient**.

---

### Factorial Helper

```ts
function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
```

---

### Combinatorics Implementation

```ts
export function numberOfWaysToTraverseGraphFactorial(
  width: number,
  height: number,
): number {
  const rightMoves = width - 1;
  const downMoves = height - 1;
  const totalMoves = rightMoves + downMoves;

  return factorial(totalMoves) / (factorial(rightMoves) * factorial(downMoves));
}
```

---

### Complexity

- **Time:** `O(width + height)`
- **Space:** `O(1)`

⚠️ Be careful with **large numbers** (possible overflow).

---

## Comparison of Approaches

| Approach            | Time Complexity | Space Complexity | Notes               |
| ------------------- | --------------- | ---------------- | ------------------- |
| Recursive           | `O(2^(w+h))`    | `O(w+h)`         | Educational only    |
| Dynamic Programming | `O(w × h)`      | `O(w × h)`       | Interview favorite  |
| Combinatorics       | `O(w + h)`      | `O(1)`           | Fast but math-heavy |

---

## Common Mistakes

❌ Forgetting base cases
❌ Confusing width vs height
❌ Using recursion without memoization
❌ Integer overflow with factorials
❌ Off-by-one errors (`width - 1`, `height - 1`)

---

## Interview Tips

- Clearly define **what each DP cell represents**
- Explain **why overlapping subproblems exist**
- Start with recursion → optimize to DP
- Mention the **combinatorics shortcut** as an optimization
- Draw a small grid to explain visually

---

## Related Problems

- Unique Paths (LeetCode)
- Unique Paths II (with obstacles)
- Minimum Path Sum
- Robot Grid Traversal
- Pascal’s Triangle
- Combinations (`nCr`)

---

## Key Takeaways

- This is a **foundational grid DP problem**
- DP solution demonstrates **optimal substructure**
- Combinatorics provides a **clean mathematical shortcut**
- Understanding this unlocks many grid-based problems

---
