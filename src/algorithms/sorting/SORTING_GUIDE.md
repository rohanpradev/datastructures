# Sorting Algorithms - Practice Guide

## Overview

This guide covers fundamental sorting algorithms with visual explanations, complexity analysis, and implementation strategies.

---

## 1. Bubble Sort

### Concept
Repeatedly swap adjacent elements if they're in wrong order. Largest elements "bubble up" to the end.

### Visual Explanation
```
Array: [5, 3, 8, 4, 2]

Pass 1:
[5, 3, 8, 4, 2]
 ↓↓ swap
[3, 5, 8, 4, 2]
    ↓↓ no swap
[3, 5, 8, 4, 2]
       ↓↓ swap
[3, 5, 4, 8, 2]
          ↓↓ swap
[3, 5, 4, 2, 8] ← 8 in place

Pass 2:
[3, 5, 4, 2, 8]
 ↓↓ no swap
[3, 5, 4, 2, 8]
    ↓↓ swap
[3, 4, 5, 2, 8]
       ↓↓ swap
[3, 4, 2, 5, 8] ← 5 in place

Pass 3:
[3, 4, 2, 5, 8]
 ↓↓ no swap
[3, 4, 2, 5, 8]
    ↓↓ swap
[3, 2, 4, 5, 8] ← 4 in place

Pass 4:
[3, 2, 4, 5, 8]
 ↓↓ swap
[2, 3, 4, 5, 8] ← sorted!
```

### Algorithm
```
for i from 0 to n-1:
	for j from 0 to n-i-2:
		if arr[j] > arr[j+1]:
			swap(arr[j], arr[j+1])
```

### Implementation
```typescript
function bubbleSort(arr: number[]): number[] {
	// TODO: Outer loop (n passes)
	// TODO: Inner loop (compare adjacent)
	// TODO: Swap if needed
	// TODO: Optimize: stop if no swaps made
}
```

### Complexity
- **Time:** 
  - Best: O(n) - already sorted
  - Average: O(n²)
  - Worst: O(n²) - reverse sorted
- **Space:** O(1) - in-place
- **Stable:** Yes

---

## 2. Selection Sort

### Concept
Find minimum element and swap with first unsorted position.

### Visual Explanation
```
Array: [5, 3, 8, 4, 2]

Pass 1: Find min in [5, 3, 8, 4, 2]
[5, 3, 8, 4, 2]
 ^        min^ swap
[2, 3, 8, 4, 5]
 └─sorted

Pass 2: Find min in [3, 8, 4, 5]
[2, 3, 8, 4, 5]
    ^  min^ no swap needed
[2, 3, 8, 4, 5]
 └───┘sorted

Pass 3: Find min in [8, 4, 5]
[2, 3, 8, 4, 5]
       ^  ^ swap
[2, 3, 4, 8, 5]
 └─────┘sorted

Pass 4: Find min in [8, 5]
[2, 3, 4, 8, 5]
          ^ ^ swap
[2, 3, 4, 5, 8]
 └───────────┘sorted
```

### Algorithm
```
for i from 0 to n-1:
	minIndex = i
	for j from i+1 to n:
		if arr[j] < arr[minIndex]:
			minIndex = j
	swap(arr[i], arr[minIndex])
```

### Implementation
```typescript
function selectionSort(arr: number[]): number[] {
	// TODO: Outer loop (each position)
	// TODO: Find minimum in remaining array
	// TODO: Swap minimum with current position
}
```

### Complexity
- **Time:** O(n²) - always
- **Space:** O(1) - in-place
- **Stable:** No (can be made stable)

---

## 3. Insertion Sort

### Concept
Build sorted array one element at a time by inserting each element into its correct position.

### Visual Explanation
```
Array: [5, 3, 8, 4, 2]

Start: [5] sorted, [3, 8, 4, 2] unsorted

Insert 3:
[5, 3, 8, 4, 2]
 ↓  ↓ insert before 5
[3, 5, 8, 4, 2]
 └───┘sorted

Insert 8:
[3, 5, 8, 4, 2]
       ↓ already in place
[3, 5, 8, 4, 2]
 └─────┘sorted

Insert 4:
[3, 5, 8, 4, 2]
       ↓  ↓ insert between 3 and 5
[3, 4, 5, 8, 2]
 └─────────┘sorted

Insert 2:
[3, 4, 5, 8, 2]
 ↓           ↓ insert at beginning
[2, 3, 4, 5, 8]
 └───────────┘sorted
```

### Algorithm
```
for i from 1 to n:
	key = arr[i]
	j = i - 1
	while j >= 0 and arr[j] > key:
		arr[j+1] = arr[j]
		j--
	arr[j+1] = key
```

### Implementation
```typescript
function insertionSort(arr: number[]): number[] {
	// TODO: Start from second element
	// TODO: Save current element as key
	// TODO: Shift larger elements right
	// TODO: Insert key in correct position
}
```

### Complexity
- **Time:**
  - Best: O(n) - already sorted
  - Average: O(n²)
  - Worst: O(n²) - reverse sorted
- **Space:** O(1) - in-place
- **Stable:** Yes

---

## 4. Merge Sort

### Concept
Divide array in half, recursively sort each half, then merge sorted halves.

### Visual Explanation
```
Array: [5, 3, 8, 4, 2, 7, 1, 6]

Divide:
        [5, 3, 8, 4, 2, 7, 1, 6]
           /                \
    [5, 3, 8, 4]        [2, 7, 1, 6]
       /    \              /      \
   [5, 3]  [8, 4]      [2, 7]  [1, 6]
    /  \    /  \        /  \    /  \
  [5] [3] [8] [4]     [2] [7] [1] [6]

Merge:
  [3, 5] [4, 8]       [2, 7] [1, 6]
      \   /              \    /
   [3, 4, 5, 8]      [1, 2, 6, 7]
         \                /
     [1, 2, 3, 4, 5, 6, 7, 8]
```

### Merge Process
```
Merge [3, 5] and [4, 8]:

[3, 5]    [4, 8]
 ↑         ↑
 i         j

Compare 3 and 4: 3 < 4 → take 3
Result: [3]

[3, 5]    [4, 8]
    ↑      ↑
    i      j

Compare 5 and 4: 4 < 5 → take 4
Result: [3, 4]

[3, 5]    [4, 8]
    ↑         ↑
    i         j

Compare 5 and 8: 5 < 8 → take 5
Result: [3, 4, 5]

[3, 5]    [4, 8]
    done      ↑
              j

Copy remaining: 8
Result: [3, 4, 5, 8]
```

### Algorithm
```
function mergeSort(arr, left, right):
	if left >= right:
		return
	
	mid = (left + right) / 2
	mergeSort(arr, left, mid)
	mergeSort(arr, mid + 1, right)
	merge(arr, left, mid, right)

function merge(arr, left, mid, right):
	// Create temp arrays
	// Merge back to original
```

### Implementation
```typescript
function mergeSort(arr: number[]): number[] {
	// TODO: Base case - array size <= 1
	
	// TODO: Find middle
	
	// TODO: Recursively sort left and right
	
	// TODO: Merge sorted halves
}

function merge(left: number[], right: number[]): number[] {
	// TODO: Create result array
	// TODO: Use two pointers
	// TODO: Merge smaller elements first
	// TODO: Add remaining elements
}
```

### Complexity
- **Time:** O(n log n) - always
- **Space:** O(n) - temp arrays
- **Stable:** Yes

---

## 5. Quick Sort

### Concept
Choose pivot, partition array so elements < pivot are left, > pivot are right. Recursively sort partitions.

### Visual Explanation
```
Array: [5, 3, 8, 4, 2, 7, 1, 6]

Choose pivot: 6 (last element)

Partition:
[5, 3, 8, 4, 2, 7, 1, 6]
                       ↑ pivot

Move < pivot to left, > pivot to right:
[5, 3, 4, 2, 1] [6] [8, 7]
 └───left───┘   pivot └right┘

Recursively sort left and right:

Left: [5, 3, 4, 2, 1] pivot=1
[3, 2] [1] [5, 4]

Right: [8, 7] pivot=7
[7] [8]

Final: [1, 2, 3, 4, 5, 6, 7, 8]
```

### Partition Process
```
Array: [5, 3, 8, 4, 2, 7, 1, 6]
Pivot: 6

i = -1 (boundary of elements < pivot)

j = 0: 5 < 6
  i++, swap
  [5, 3, 8, 4, 2, 7, 1, 6]
   i

j = 1: 3 < 6
  i++, swap
  [5, 3, 8, 4, 2, 7, 1, 6]
      i

j = 2: 8 > 6
  no swap

j = 3: 4 < 6
  i++, swap
  [5, 3, 4, 8, 2, 7, 1, 6]
         i

j = 4: 2 < 6
  i++, swap
  [5, 3, 4, 2, 8, 7, 1, 6]
            i

j = 5: 7 > 6
  no swap

j = 6: 1 < 6
  i++, swap
  [5, 3, 4, 2, 1, 7, 8, 6]
               i

Place pivot:
  swap pivot with i+1
  [5, 3, 4, 2, 1, 6, 8, 7]
                  ↑
            pivot position
```

### Algorithm
```
function quickSort(arr, low, high):
	if low < high:
		pivotIndex = partition(arr, low, high)
		quickSort(arr, low, pivotIndex - 1)
		quickSort(arr, pivotIndex + 1, high)

function partition(arr, low, high):
	pivot = arr[high]
	i = low - 1
	
	for j from low to high-1:
		if arr[j] < pivot:
			i++
			swap(arr[i], arr[j])
	
	swap(arr[i+1], arr[high])
	return i + 1
```

### Implementation
```typescript
function quickSort(arr: number[], low: number, high: number): void {
	// TODO: Base case
	
	// TODO: Partition array
	
	// TODO: Recursively sort left and right
}

function partition(arr: number[], low: number, high: number): number {
	// TODO: Choose pivot (last element)
	
	// TODO: Partition array around pivot
	
	// TODO: Return pivot position
}
```

### Complexity
- **Time:**
  - Best: O(n log n)
  - Average: O(n log n)
  - Worst: O(n²) - already sorted
- **Space:** O(log n) - recursion stack
- **Stable:** No

---

## Comparison of Sorting Algorithms

### Complexity Table
```
┌──────────────┬──────────┬──────────┬──────────┬────────┬─────────┐
│  Algorithm   │   Best   │ Average  │  Worst   │ Space  │ Stable  │
├──────────────┼──────────┼──────────┼──────────┼────────┼─────────┤
│ Bubble       │ O(n)     │ O(n²)    │ O(n²)    │ O(1)   │ Yes     │
│ Selection    │ O(n²)    │ O(n²)    │ O(n²)    │ O(1)   │ No      │
│ Insertion    │ O(n)     │ O(n²)    │ O(n²)    │ O(1)   │ Yes     │
│ Merge        │ O(n logn)│ O(n logn)│ O(n logn)│ O(n)   │ Yes     │
│ Quick        │ O(n logn)│ O(n logn)│ O(n²)    │ O(logn)│ No      │
│ Heap         │ O(n logn)│ O(n logn)│ O(n logn)│ O(1)   │ No      │
└──────────────┴──────────┴──────────┴──────────┴────────┴─────────┘
```

### When to Use Each Algorithm

#### Bubble Sort
```
✅ Educational purposes
✅ Nearly sorted data (optimized version)
✅ Simple to implement
❌ Never for large datasets
```

#### Selection Sort
```
✅ Memory constrained (O(1) space)
✅ Small datasets
✅ Minimizing swaps important
❌ Large datasets
```

#### Insertion Sort
```
✅ Small datasets (< 50 elements)
✅ Nearly sorted data
✅ Online sorting (data arrives continuously)
❌ Large unsorted datasets
```

#### Merge Sort
```
✅ Guaranteed O(n log n)
✅ Stable sort required
✅ Linked lists (no extra space)
✅ External sorting
❌ Memory constrained
```

#### Quick Sort
```
✅ Average case matters most
✅ In-place sorting needed
✅ Cache performance important
❌ Worst-case O(n log n) required
❌ Stable sort required
```

---

## Stability in Sorting

### What is Stability?
```
Stable sort preserves relative order of equal elements.

Input: [(4, A), (3, B), (4, C), (3, D), (2, E)]
       ↑ value  ↑ identifier

Stable sort:   [2E, 3B, 3D, 4A, 4C]
                    ↑───↑  ↑───↑
                    order preserved

Unstable sort: [2E, 3D, 3B, 4C, 4A]
                    ↑───↑  ↑───↑
                    order changed!
```

### Why Stability Matters
```
Example: Sort students by grade, then by name

Students: [(Alice, 90), (Bob, 85), (Charlie, 90)]

Sort by grade (stable):
[(Bob, 85), (Alice, 90), (Charlie, 90)]

If we later sort by name (stable):
[(Alice, 90), (Bob, 85), (Charlie, 90)]

Relative order of same-grade students preserved!
```

---

## Practice Tips

### Order to Practice
1. **Start with:** Bubble, Selection, Insertion (understand basics)
2. **Then:** Merge Sort (divide and conquer)
3. **Finally:** Quick Sort (partitioning, optimization)

### Optimizations

#### Bubble Sort
```
// Stop if no swaps made
boolean swapped = true;
while (swapped) {
	swapped = false;
	// ... if swap occurs, set swapped = true
}
```

#### Insertion Sort
```
// Binary search for insert position
// Still O(n²) due to shifting, but fewer comparisons
```

#### Quick Sort
```
// Choose better pivot (median of three)
// Switch to insertion sort for small subarrays
// Randomize pivot to avoid worst case
```

### Common Mistakes
1. ❌ Off-by-one errors in loop bounds
2. ❌ Not handling empty/single element arrays
3. ❌ Incorrect pivot selection in quick sort
4. ❌ Forgetting to copy back in merge sort
5. ❌ Not maintaining stability when required

### Testing Strategy
```typescript
✓ Empty array []
✓ Single element [5]
✓ Already sorted [1, 2, 3, 4, 5]
✓ Reverse sorted [5, 4, 3, 2, 1]
✓ All same [3, 3, 3, 3]
✓ Two elements [2, 1]
✓ Duplicates [3, 1, 4, 1, 5]
✓ Negative numbers [-5, 2, -3, 8]
```

---

## Visualization Tips

### Drawing Arrays
```
Always visualize:
[5, 3, 8, 4, 2]
 ↑           ↑
 i           j

Use markers:
- ↑ for pointers
- [x] for sorted section
- {x} for pivot
- → for swaps
```

### Step-by-Step
```
1. Draw initial state
2. Mark current operation
3. Show result after operation
4. Repeat until sorted
```

---

## Real-World Applications

### Merge Sort
- External sorting (files too large for memory)
- Sorting linked lists
- Parallel sorting

### Quick Sort
- Standard library sort (with optimizations)
- Database query optimization
- Numerical computations

### Insertion Sort
- Hybrid sorting algorithms (for small subarrays)
- Online sorting (continuous data)
- Nearly sorted data

Happy Coding! 🚀
