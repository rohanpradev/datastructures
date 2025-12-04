# Heap (Priority Queue) - Practice Guide

## Overview

This guide covers heap data structure operations and common heap-based algorithms. Heaps are complete binary trees that maintain the heap property.

---

## What is a Heap?

A heap is a complete binary tree where:
- **Max Heap:** Parent ≥ all children (largest at root)
- **Min Heap:** Parent ≤ all children (smallest at root)

### Visual Representation
```
Max Heap:          Min Heap:
     100                1
    /   \              / \
   90    80           3   2
  / \   /            / \
 70 50 60           7   5

Array: [100,90,80,70,50,60]
Array: [1,3,2,7,5]
```

---

## Heap Operations

### 1. Insert (Push)

**Problem:** Insert a value while maintaining heap property.

#### Visual Explanation
```
Max Heap: [100, 90, 80, 70, 50]

Insert 95:

Step 1: Add to end
     100
    /   \
   90    80
  / \   /
 70 50 95
[100, 90, 80, 70, 50, 95]

Step 2: Bubble up (95 > 80)
     100
    /   \
   90    95 ← swapped
  / \   /
 70 50 80
[100, 90, 95, 70, 50, 80]

Step 3: Bubble up (95 < 100, stop)
Final: [100, 90, 95, 70, 50, 80]
```

#### Algorithm
```
function insert(value):
	1. Add value to end of array
	2. current = last index
	3. While current has parent AND value > parent:
	   - Swap with parent
	   - current = parent index
```

#### Parent-Child Relationships
```
For node at index i:
- Parent: (i - 1) / 2
- Left child: 2 * i + 1
- Right child: 2 * i + 2

Example: i = 5
- Parent: (5-1)/2 = 2
- Left: 2*5+1 = 11
- Right: 2*5+2 = 12
```

#### Implementation Steps
```typescript
class MaxHeap {
	private heap: number[] = [];
	
	insert(value: number): void {
		// TODO: Push value to heap
		
		// TODO: Get current index
		
		// TODO: Bubble up loop
		while (current > 0) {
			// TODO: Calculate parent index
			// TODO: Compare with parent
			// TODO: Swap if needed
			// TODO: Update current
		}
	}
}
```

#### Complexity
- **Time:** O(log n) - height of tree
- **Space:** O(1)

---

### 2. Remove (Pop)

**Problem:** Remove root (max/min) while maintaining heap property.

#### Visual Explanation
```
Max Heap: [100, 90, 95, 70, 50, 80]
     100
    /   \
   90    95
  / \   /
 70 50 80

Step 1: Replace root with last element
     80
    /   \
   90    95
  / \
 70 50
[80, 90, 95, 70, 50]

Step 2: Bubble down (80 < 95, swap with larger child)
     95
    /   \
   90    80
  / \
 70 50
[95, 90, 80, 70, 50]

Step 3: Bubble down (80 < 90? No, stop)
Final: [95, 90, 80, 70, 50]
Return: 100
```

#### Algorithm
```
function remove():
	if heap empty:
		return null
	
	max = heap[0]
	heap[0] = heap[last]
	remove last element
	
	current = 0
	while has children:
		find larger child
		if current < larger child:
			swap
			current = child index
		else:
			break
	
	return max
```

#### Implementation Steps
```typescript
class MaxHeap {
	remove(): number | null {
		// TODO: Handle empty heap
		
		// TODO: Save root value
		
		// TODO: Replace root with last element
		
		// TODO: Remove last element
		
		// TODO: Bubble down loop
		let current = 0;
		while (true) {
			// TODO: Calculate left and right child indices
			// TODO: Find largest among current and children
			// TODO: If no swap needed, break
			// TODO: Otherwise, swap and continue
		}
		
		// TODO: Return saved root
	}
}
```

#### Complexity
- **Time:** O(log n) - height of tree
- **Space:** O(1)

---

## Heap Problems

### Problem 1: Find Kth Largest Element (LeetCode 215)

#### Problem Statement
Find the kth largest element in an unsorted array.

#### Example
```
Input: [3, 2, 1, 5, 6, 4], k = 2
Output: 5

Input: [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4
Output: 4
```

#### Visual Explanation
```
Array: [3, 2, 1, 5, 6, 4], k = 2

Use Min Heap of size k:

Step 1: [3]
Step 2: [2, 3]
Step 3: [1, 2, 3] → size > k, remove min
        [2, 3]
Step 4: [2, 3, 5] → remove 2
        [3, 5]
Step 5: [3, 5, 6] → remove 3
        [5, 6]
Step 6: [4, 5, 6] → remove 4
        [5, 6]

Heap top: 5 (2nd largest)
```

#### Algorithm
```
1. Create min heap of size k
2. For each number:
   - Add to heap
   - If heap size > k, remove min
3. Return heap top
```

#### Complexity
- **Time:** O(n log k)
- **Space:** O(k)

---

### Problem 2: Merge K Sorted Lists (LeetCode 23)

#### Problem Statement
Merge k sorted linked lists into one sorted list.

#### Example
```
Input:
[
  1 → 4 → 5,
  1 → 3 → 4,
  2 → 6
]
Output: 1 → 1 → 2 → 3 → 4 → 4 → 5 → 6
```

#### Visual Explanation
```
Use min heap to track smallest element from each list:

Heap: [(1, list0), (1, list1), (2, list2)]

Step 1: Pop (1, list0), add to result
        Push next from list0: (4, list0)
Result: 1
Heap: [(1, list1), (2, list2), (4, list0)]

Step 2: Pop (1, list1), add to result
        Push next from list1: (3, list1)
Result: 1 → 1
Heap: [(2, list2), (3, list1), (4, list0)]

Continue until all lists exhausted...
```

#### Algorithm
```
1. Add first node from each list to min heap
2. While heap not empty:
   - Pop minimum node
   - Add to result
   - If node has next, push next to heap
3. Return result
```

#### Complexity
- **Time:** O(n log k) where n = total nodes, k = lists
- **Space:** O(k) - heap size

---

### Problem 3: Top K Frequent Elements (LeetCode 347)

#### Problem Statement
Find the k most frequent elements in an array.

#### Example
```
Input: [1, 1, 1, 2, 2, 3], k = 2
Output: [1, 2]

Input: [1], k = 1
Output: [1]
```

#### Visual Explanation
```
Step 1: Count frequencies
{1: 3, 2: 2, 3: 1}

Step 2: Use min heap of size k (by frequency)
Add (3, 1): [(3, 1)]
Add (2, 2): [(2, 2), (3, 1)]
Add (1, 3): [(1, 3), (2, 2), (3, 1)] → size > k
            Remove (1, 3)
            [(2, 2), (3, 1)]

Result: [2, 1]
```

#### Algorithm
```
1. Count frequencies using hash map
2. Create min heap of size k (by frequency)
3. For each (num, freq):
   - Add to heap
   - If size > k, remove min
4. Return elements in heap
```

#### Complexity
- **Time:** O(n log k)
- **Space:** O(n)

---

### Problem 4: Find Median from Data Stream (LeetCode 295)

#### Problem Statement
Design a data structure that supports:
- addNum(num): Add number to stream
- findMedian(): Return median of all numbers

#### Example
```
addNum(1)
addNum(2)
findMedian() → 1.5
addNum(3)
findMedian() → 2
```

#### Visual Explanation
```
Use two heaps:
- Max heap (left): smaller half
- Min heap (right): larger half

Keep max heap size ≥ min heap size

Add 1:
maxHeap: [1]
minHeap: []
Median: 1

Add 2:
maxHeap: [1]
minHeap: [2]
Median: (1 + 2) / 2 = 1.5

Add 3:
maxHeap: [1]
minHeap: [2, 3]
Rebalance: move 2 to maxHeap
maxHeap: [2, 1]
minHeap: [3]
Median: 2
```

#### Algorithm
```
addNum(num):
	if maxHeap empty or num < maxHeap.top():
		add to maxHeap
	else:
		add to minHeap
	
	// Balance
	if maxHeap.size() > minHeap.size() + 1:
		move top from maxHeap to minHeap
	if minHeap.size() > maxHeap.size():
		move top from minHeap to maxHeap

findMedian():
	if maxHeap.size() > minHeap.size():
		return maxHeap.top()
	else:
		return (maxHeap.top() + minHeap.top()) / 2
```

#### Complexity
- **addNum:** O(log n)
- **findMedian:** O(1)
- **Space:** O(n)

---

## Heap Properties

### Complete Binary Tree
```
Valid (complete):      Invalid (not complete):
      1                      1
     / \                    / \
    2   3                  2   5
   / \                        /
  4   5                      6

All levels filled except last, 
which fills left to right.
```

### Heap Property
```
Max Heap:
- Parent ≥ children
- Root is maximum

Min Heap:
- Parent ≤ children
- Root is minimum
```

### Height
```
For n elements:
Height = ⌊log₂(n)⌋

Examples:
n=1 → h=0
n=7 → h=2
n=15 → h=3
```

---

## Heapify

Convert array to heap in O(n) time:

```
Array: [1, 3, 5, 4, 6, 13, 10, 9, 8, 15, 17]

Start from last non-leaf node: n/2 - 1 = 4

Work backwards, sinking each node:
i=4: sink(6)
i=3: sink(4)
i=2: sink(5)
i=1: sink(3)
i=0: sink(1)

Result: Valid max heap
```

---

## Practice Tips

### Order to Practice
1. **Start with:** Basic insert/remove operations
2. **Then:** Kth largest, top K frequent (fixed-size heap)
3. **Finally:** Merge K lists, find median (advanced)

### When to Use Heap
- ✅ Find kth largest/smallest
- ✅ Maintain sorted order while streaming
- ✅ Merge k sorted arrays/lists
- ✅ Find median in stream
- ✅ Top K elements
- ✅ Dijkstra's algorithm

### Common Mistakes
1. ❌ Wrong parent/child index calculation
2. ❌ Not handling empty heap
3. ❌ Using max heap when min heap needed (or vice versa)
4. ❌ Forgetting to maintain heap property after modifications
5. ❌ Off-by-one errors in array indices

### Testing Strategy
```typescript
✓ Empty heap
✓ Single element
✓ Duplicate values
✓ Ascending/descending order
✓ Random order
✓ All same values
✓ Remove from empty heap
```

---

## Complexity Cheat Sheet

| Operation | Time | Space |
|-----------|------|-------|
| Insert | O(log n) | O(1) |
| Remove | O(log n) | O(1) |
| Peek | O(1) | O(1) |
| Heapify | O(n) | O(1) |
| Search | O(n) | O(1) |

| Problem | Time | Space | Key Technique |
|---------|------|-------|---------------|
| Kth Largest | O(n log k) | O(k) | Fixed-size min heap |
| Merge K Lists | O(n log k) | O(k) | Min heap of k elements |
| Top K Frequent | O(n log k) | O(n) | Frequency + heap |
| Find Median | O(log n) | O(n) | Two heaps (max + min) |

Happy Coding! 🚀
