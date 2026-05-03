# FAANG Array Problems Guide

This guide explains the extra array problems added for interview prep. Read this before looking at the code if you are still learning the pattern.

## Longest Consecutive Sequence

File: `src/algorithms/arrays/array-problems.ts`  
Function: `longestConsecutiveSequence`

Problem:

Given an unsorted array, find the length of the longest run of consecutive numbers.

Example:

```ts
longestConsecutiveSequence([100, 4, 200, 1, 3, 2]); // 4
```

The longest run is `[1, 2, 3, 4]`.

### Beginner Intuition

A brute force approach would sort the array first, then scan for streaks. That works, but it costs `O(n log n)`.

The better interview approach uses a `Set`.

Key idea:

Only start counting a sequence when the previous number is missing.

For example, in `[1, 2, 3, 4]`, only `1` should start the count because `0` is missing. We should not start again at `2`, `3`, or `4`.

### Step-By-Step

1. Put every number into a `Set`.
2. Loop through each number.
3. If `num - 1` exists, skip it because this is not the start.
4. If `num - 1` does not exist, count upward: `num + 1`, `num + 2`, etc.
5. Track the longest count seen.

### Why It Works

Each sequence is counted only from its smallest value. That prevents duplicate work and keeps the solution linear.

### Edge Cases

- Empty array -> `0`
- Duplicates -> do not matter because `Set` removes duplicates
- Negative numbers -> work the same way
- Single number -> `1`

### Complexity

- Time: `O(n)`
- Space: `O(n)`

---

## Median Of Two Sorted Arrays

File: `src/algorithms/arrays/array-problems.ts`  
Function: `medianOfTwoSortedArrays`

Problem:

Given two sorted arrays, return the median of all values combined.

Example:

```ts
medianOfTwoSortedArrays([1, 3], [2]); // 2
medianOfTwoSortedArrays([1, 2], [3, 4]); // 2.5
```

### Beginner Intuition

The simple approach is to merge both arrays, then find the middle. That costs `O(m + n)`.

The advanced FAANG version asks for `O(log(min(m, n)))`.

Key idea:

We do not need to fully merge. We only need to split both arrays into a left half and right half such that:

- left side has half the total elements
- every left-side value is `<=` every right-side value

### Step-By-Step

1. Always binary search the smaller array.
2. Pick a partition in the first array.
3. Derive the matching partition in the second array.
4. Look at four values:
   - biggest value on left of first array
   - smallest value on right of first array
   - biggest value on left of second array
   - smallest value on right of second array
5. If both left values are less than or equal to both right values, the partition is correct.
6. If the left value from the first array is too big, move left.
7. Otherwise, move right.

### Why It Works

The arrays are sorted, so each partition tells us whether we took too many or too few values from the first array.

### Edge Cases

- One array is empty
- Odd total length
- Even total length
- Arrays have very different sizes
- Duplicate values

### Complexity

- Time: `O(log(min(m, n)))`
- Space: `O(1)`

