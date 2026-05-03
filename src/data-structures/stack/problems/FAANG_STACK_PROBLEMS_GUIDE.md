# FAANG Stack Problems Guide

This guide explains the extra stack problem added for interview prep.

## Largest Rectangle In Histogram

File: `src/data-structures/stack/problems/leetcode-stack.ts`  
Function: `largestRectangleArea`

Problem:

Given bar heights in a histogram, return the area of the largest rectangle.

Example:

```ts
largestRectangleArea([2, 1, 5, 6, 2, 3]); // 10
```

The largest rectangle uses heights `5` and `6`, with width `2`, so area is `10`.

### Beginner Intuition

For every bar, imagine it is the shortest bar in a rectangle. We need to know how far that bar can extend left and right before hitting a shorter bar.

The brute force approach checks every bar in every range, which is too slow.

A monotonic stack gives us the left and right boundaries in one pass.

### Stack Invariant

The stack stores indices of bars in increasing height order.

When a new bar is shorter than the stack top, the top bar cannot extend past the current index. That means we can calculate its final rectangle area.

### Step-By-Step

1. Create an empty stack of indices.
2. Scan from left to right.
3. While the current height is smaller than the height at stack top:
   - pop the stack
   - popped height is the rectangle height
   - current index is the right boundary
   - new stack top is the left boundary
   - compute area
4. Push the current index.
5. Add a fake `0` height at the end by looping one extra step. This clears the stack.

### Why It Works

Each bar is pushed once and popped once. When it is popped, we know the first smaller bar on the right and the first smaller bar on the left.

### Edge Cases

- Empty histogram
- One bar
- Increasing heights
- Decreasing heights
- All equal heights

### Complexity

- Time: `O(n)`
- Space: `O(n)`

