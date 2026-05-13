# FAANG Heap Problems Guide

This guide explains the heap problems covered in `src/data-structures/heap/heap.ts`.

## Problems Covered

| Problem | Export | Main pattern |
| --- | --- | --- |
| Kth Largest Element | `kthLargestElement` | Fixed-size min heap |
| Find Median From Data Stream | `MedianFinder` | Two heaps |
| Merge K Sorted Arrays | `mergeKSortedArrays` | Min heap over k sources |

## Kth Largest Element

Problem: given an unsorted array, return the kth largest value.

```ts
kthLargestElement([3, 2, 1, 5, 6, 4], 2); // 5
```

Sorted descending would be `[6, 5, 4, 3, 2, 1]`, so the 2nd largest is `5`.

Key idea: keep a min heap of size `k`. The heap stores the current `k` largest numbers seen so far. If the heap grows beyond `k`, remove its smallest value because that value cannot be in the final top `k`.

Complexity:

- Time: `O(n log k)`
- Space: `O(k)`

## Find Median From Data Stream

Problem: support `addNumber(num)` and `findMedian()` as numbers arrive one by one.

```ts
const finder = new MedianFinder();
finder.addNumber(1).addNumber(2);
finder.findMedian(); // 1.5
finder.addNumber(3);
finder.findMedian(); // 2
```

Key idea: split the stream into two heaps.

- `lowerHalf`: max heap for the smaller half.
- `upperHalf`: min heap for the larger half.
- Keep `lowerHalf.size()` equal to `upperHalf.size()` or exactly one larger.

If the heaps have the same size, the median is the average of both roots. If `lowerHalf` has one extra value, its root is the median.

Complexity:

- `addNumber`: `O(log n)`
- `findMedian`: `O(1)`
- Space: `O(n)`

## Merge K Sorted Arrays

Problem: merge many sorted arrays into one sorted output.

```ts
mergeKSortedArrays([
	[1, 4, 5],
	[1, 3, 4],
	[2, 6],
]); // [1, 1, 2, 3, 4, 4, 5, 6]
```

Key idea: keep one active entry from each sorted array in a min heap. Every time you remove the smallest entry, push the next value from that same source array.

Complexity:

- Time: `O(n log k)`, where `n` is total values and `k` is number of arrays
- Space: `O(k)`, excluding output

## Interview Checklist

- Can you explain why sorting is simpler but often more expensive?
- Can you justify why the heap size stays at `k`?
- Can you state which heap should be a min heap or max heap?
- Can you handle empty input, duplicates, negative numbers, and invalid `k`?
- Can you state whether the output order matters?
