# Math And Geometry Guide

These problems are common in interview lists because they test careful index handling.

## Rotate Image

Function: `rotateImage`

Problem:

Rotate an `n x n` matrix 90 degrees clockwise in-place.

Step-by-step:

1. Transpose the matrix: swap `matrix[row][col]` with `matrix[col][row]`.
2. Reverse every row.

Example:

```text
1 2 3      1 4 7      7 4 1
4 5 6  ->  2 5 8  ->  8 5 2
7 8 9      3 6 9      9 6 3
```

Complexity:

- Time: `O(n^2)`
- Space: `O(1)`

## Set Matrix Zeroes

Function: `setMatrixZeroes`

Problem:

If a cell is zero, set its whole row and column to zero.

Beginner approach:

Use two sets: one for rows and one for columns. This is easy but uses extra space.

Optimized approach:

Use the first row and first column as marker storage.

Step-by-step:

1. Remember whether the first row has a zero.
2. Remember whether the first column has a zero.
3. For every inner cell that is zero, mark its row and column in the first row/column.
4. Zero marked rows and columns.
5. Finally zero the first row/column if needed.

Complexity:

- Time: `O(rows * cols)`
- Space: `O(1)`

## Happy Number

Function: `isHappyNumber`

Problem:

Repeatedly replace a number by the sum of squares of its digits. Return true if it reaches `1`.

Key idea:

If it does not reach `1`, it eventually repeats. A repeated number means a cycle.

Complexity:

- Time: small bounded cycle in practice
- Space: `O(log n)` for seen numbers

