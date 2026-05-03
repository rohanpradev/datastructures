# FAANG Dynamic Programming Problems Guide

This guide explains the extra dynamic programming problems added for interview prep.

## Max Product Subarray

File: `src/algorithms/dynamic-programming/dynamic-programming.ts`  
Function: `maxProductSubarray`

Problem:

Find the maximum product of a contiguous subarray.

Example:

```ts
maxProductSubarray([2, 3, -2, 4]); // 6
maxProductSubarray([-2, 3, -4]); // 24
```

### Beginner Intuition

This looks similar to maximum subarray sum, but multiplication has one tricky case: negative numbers.

A negative number can turn a very small negative product into a very large positive product.

So we track both:

- current maximum product
- current minimum product

### Step-By-Step

1. Start both `currentMax` and `currentMin` at the first number.
2. For each next number:
   - if the number is negative, swap `currentMax` and `currentMin`
   - update `currentMax` as the best product ending here
   - update `currentMin` as the worst product ending here
   - update the global best answer
3. Return the global best.

### Why It Works

The best product ending at the current index only depends on:

- the current number alone
- current number times the previous maximum
- current number times the previous minimum

Tracking the minimum is what handles negative flips.

### Edge Cases

- Empty array
- Single number
- Zeros reset the product
- Even number of negatives
- Odd number of negatives

### Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Longest Common Subsequence

File: `src/algorithms/dynamic-programming/dynamic-programming.ts`  
Function: `longestCommonSubsequence`

Problem:

Find the length of the longest sequence that appears in both strings in the same order, not necessarily contiguously.

Example:

```ts
longestCommonSubsequence("abcde", "ace"); // 3
```

The subsequence is `"ace"`.

### Beginner Intuition

If the current characters match, they can extend a previous subsequence.

If they do not match, we try skipping one character from either string and keep the best answer.

### DP State

`dp[row][col]` means:

The LCS length between:

- `text1` prefix ending before `row`
- `text2` prefix ending before `col`

### Step-By-Step

1. Create a `(text1.length + 1) x (text2.length + 1)` table.
2. Fill the first row and first column with `0`.
3. For each pair of characters:
   - if they match, use diagonal + 1
   - otherwise, take max of top and left
4. The final answer is the bottom-right cell.

### Why It Works

Every prefix answer can be built from smaller prefix answers.

### Edge Cases

- One empty string
- No common characters
- Identical strings
- Repeated characters

### Complexity

- Time: `O(n * m)`
- Space: `O(n * m)`

