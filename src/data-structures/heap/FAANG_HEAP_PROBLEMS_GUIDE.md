# FAANG Heap Problems Guide

This guide explains the extra heap problem added for interview prep.

## Kth Largest Element

File: `src/data-structures/heap/heap.ts`  
Function: `kthLargestElement`

Problem:

Given an unsorted array, return the kth largest value.

Example:

```ts
kthLargestElement([3, 2, 1, 5, 6, 4], 2); // 5
```

Sorted descending would be `[6, 5, 4, 3, 2, 1]`, so the 2nd largest is `5`.

### Beginner Intuition

The simplest approach is sorting:

```text
sort descending -> return index k - 1
```

That costs `O(n log n)`.

The heap approach is better when `k` is much smaller than `n`.

### Key Idea

Keep a min heap of size `k`.

The heap stores the current `k` largest numbers seen so far. The smallest number inside that heap is the kth largest overall candidate.

### Step-By-Step

1. Create an empty min heap.
2. Insert each number.
3. If heap size becomes larger than `k`, remove the smallest value.
4. After all numbers are processed, the heap root is the kth largest.

### Why It Works

If the heap has more than `k` values, the smallest value cannot be part of the top `k`, so it is safe to remove.

### Edge Cases

- `k = 1` means largest value
- `k = nums.length` means smallest value
- Duplicates count as separate values
- Invalid `k` should throw

### Complexity

- Time: `O(n log k)`
- Space: `O(k)`

