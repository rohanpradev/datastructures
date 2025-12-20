# Binary Search Tree (BST) Problems - Practice Guide

## Overview

This guide covers common BST problems found in coding interviews, demonstrating recursion, tree traversal, and BST property validation.

---

## Problem 1: Validate BST (LeetCode 98)

### Problem Statement

Determine if a binary tree is a valid Binary Search Tree.

**BST Property:** For every node:

- All values in left subtree < node.value
- All values in right subtree > node.value

### Example

```
Valid BST:
       5
      / \
     3   7
    / \   \
   2   4   8

Invalid BST:
       5
      / \
     3   7
    /   /
   6   4
   ↑ ERROR: 6 > 5 but in left subtree!
```

### Visual Explanation

```
Valid BST must satisfy range constraints:

         10 (range: -∞ to +∞)
        /  \
       5    15 (range: 10 to +∞)
      / \   / \
     2   7 12  20
(range:   (range:
-∞ to 5)  10 to 15)

For each node, check:
- node.value > min
- node.value < max
- recursively check left (update max = node.value)
- recursively check right (update min = node.value)
```

### Algorithm

```
function isValid(node, min, max):
	if node is null:
		return true

	if node.value <= min or node.value >= max:
		return false

	return isValid(node.left, min, node.value) AND
	       isValid(node.right, node.value, max)

Initial call: isValid(root, -∞, +∞)
```

### Step-by-Step Example

```
Tree:     5
         / \
        3   7
       /
      6 ← INVALID!

Step 1: Check 5 (range: -∞, +∞) ✓
Step 2: Check 3 (range: -∞, 5) ✓
Step 3: Check 6 (range: -∞, 3) ❌
        6 > 3, INVALID!
```

### Implementation Steps

```typescript
export function validateBST(
  node: BSTNode | null,
  min: number = -Infinity,
  max: number = Infinity,
): boolean {
  // TODO: Base case - null node is valid
  // TODO: Check if current value violates range
  // TODO: Recursively validate left subtree (update max)
  // TODO: Recursively validate right subtree (update min)
  // TODO: Return true if both subtrees valid
}
```

### Complexity

- **Time:** O(n) - visit each node once
- **Space:** O(h) - recursion stack (h = height)

---

## Problem 2: Lowest Common Ancestor (LeetCode 235)

### Problem Statement

Find the Lowest Common Ancestor (LCA) of two nodes in a BST.

**LCA Definition:** The lowest node that has both nodes as descendants (a node can be its own ancestor).

### Example

```
        6
       / \
      2   8
     / \ / \
    0  4 7  9
      / \
     3   5

LCA(2, 8) = 6
LCA(2, 4) = 2
LCA(3, 5) = 4
```

### Visual Explanation

```
BST Property helps us navigate:

If p and q both < node.value:
   ↓ LCA must be in LEFT subtree

If p and q both > node.value:
   ↓ LCA must be in RIGHT subtree

If p ≤ node.value ≤ q (or vice versa):
   ↓ This node is the LCA!

Example: Find LCA(3, 5) in tree above

At 6: 3 < 6 and 5 < 6 → go LEFT
At 2: 3 > 2 and 5 > 2 → go RIGHT
At 4: 3 < 4 < 5 → FOUND LCA!
```

### Algorithm

```
function LCA(root, p, q):
	if root is null:
		return null

	// Both in left subtree
	if p.value < root.value AND q.value < root.value:
		return LCA(root.left, p, q)

	// Both in right subtree
	if p.value > root.value AND q.value > root.value:
		return LCA(root.right, p, q)

	// Split point found!
	return root
```

### Implementation Steps

```typescript
export function lowestCommonAncestor(
  root: BSTNode | null,
  p: BSTNode,
  q: BSTNode,
): BSTNode | null {
  // TODO: Handle null root
  // TODO: If both values less than root, search left
  // TODO: If both values greater than root, search right
  // TODO: Otherwise, root is LCA
}
```

### Complexity

- **Time:** O(h) - traverse down tree height
- **Space:** O(h) - recursion stack

---

## Problem 3: Invert Binary Tree (LeetCode 226)

### Problem Statement

Invert a binary tree (swap left and right children at every node).

### Example

```
Before:          After:
     4             4
    / \           / \
   2   7         7   2
  / \ / \       / \ / \
 1  3 6  9     9  6 3  1
```

### Visual Explanation

```
Process (Post-order):

Step 1: Invert left subtree
     4              4
    / \    →       / \
   2   7          2   7
  / \            / \
 1   3          3   1

Step 2: Invert right subtree
     4              4
    / \    →       / \
   2   7          2   7
      / \            / \
     6   9          9   6

Step 3: Swap root's children
     4              4
    / \    →       / \
   2   7          7   2
  / \ / \        / \ / \
 3  1 9  6      9  6 1  3
```

### Algorithm

```
function invert(node):
	if node is null:
		return null

	// Recursively invert subtrees
	left = invert(node.left)
	right = invert(node.right)

	// Swap children
	node.left = right
	node.right = left

	return node
```

### Implementation Steps

```typescript
export function invertTree(node: BSTNode | null): BSTNode | null {
  // TODO: Base case - null node
  // TODO: Recursively invert left subtree
  // TODO: Recursively invert right subtree
  // TODO: Swap children
  // TODO: Return node
}
```

### Complexity

- **Time:** O(n) - visit each node once
- **Space:** O(h) - recursion stack

---

## Problem 4: Kth Smallest Element (LeetCode 230)

### Problem Statement

Find the kth smallest element in a BST (1-indexed).

### Example

```
       5
      / \
     3   6
    / \
   2   4
  /
 1

k=1 → 1
k=2 → 2
k=3 → 3
k=4 → 4
```

### Visual Explanation

```
In-order traversal of BST gives SORTED order!

In-order: Left → Root → Right

Tree:     5
         / \
        3   6
       / \
      2   4
     /
    1

In-order traversal:
1. Visit left of 5
   - Visit left of 3
     - Visit left of 2
       - Visit 1 ← 1st smallest
     - Visit 2 ← 2nd smallest
   - Visit 3 ← 3rd smallest
   - Visit right of 3
     - Visit 4 ← 4th smallest
2. Visit 5 ← 5th smallest
3. Visit right of 5
   - Visit 6 ← 6th smallest

Result: [1, 2, 3, 4, 5, 6]
```

### Algorithm (In-order Traversal)

```
function kthSmallest(root, k):
	count = 0
	result = null

	function inOrder(node):
		if node is null:
			return

		// Traverse left
		inOrder(node.left)

		// Process current
		count++
		if count == k:
			result = node.value
			return

		// Traverse right
		inOrder(node.right)

	inOrder(root)
	return result
```

### Implementation Steps

```typescript
export function kthSmallest(root: BSTNode | null, k: number): number | null {
  // TODO: Initialize count and result variables
  // TODO: Create helper function for in-order traversal
  // TODO: In helper: base case for null
  // TODO: Traverse left subtree
  // TODO: Increment count, check if count === k
  // TODO: Traverse right subtree
  // TODO: Call helper and return result
}
```

### Complexity

- **Time:** O(h + k) - traverse to kth node
- **Space:** O(h) - recursion stack

---

## Problem 5: Sorted Array to BST (LeetCode 108)

### Problem Statement

Convert a sorted array into a height-balanced BST.

**Height-balanced:** Left and right subtrees differ in height by at most 1.

### Example

```
Input: [-10, -3, 0, 5, 9]

One possible BST:
       0
      / \
    -3   9
    /   /
  -10  5

Another valid BST:
       0
      / \
   -10   5
      \   \
      -3   9
```

### Visual Explanation

```
Key insight: Middle element becomes root!

Array: [-10, -3, 0, 5, 9]
              ↑
           middle = root

Left half: [-10, -3] → left subtree
Right half: [5, 9] → right subtree

Build recursively:

Step 1: Root = 0 (middle of [-10,-3,0,5,9])
        [0]

Step 2: Left = -3 (middle of [-10,-3])
        [0]
        /
      [-3]

Step 3: Left of -3 = -10
        [0]
        /
      [-3]
      /
    [-10]

Step 4: Right = 5 (middle of [5,9])
        [0]
        / \
      [-3] [5]
      /
    [-10]

Step 5: Right of 5 = 9
        [0]
        / \
      [-3] [5]
      /      \
    [-10]    [9]
```

### Algorithm

```
function arrayToBST(arr, left, right):
	if left > right:
		return null

	mid = (left + right) / 2
	node = new Node(arr[mid])

	node.left = arrayToBST(arr, left, mid - 1)
	node.right = arrayToBST(arr, mid + 1, right)

	return node
```

### Implementation Steps

```typescript
export function sortedArrayToBST(nums: number[]): BSTNode | null {
  // TODO: Create helper function with left/right pointers
  // TODO: Base case - if left > right, return null
  // TODO: Calculate middle index
  // TODO: Create node with middle element
  // TODO: Recursively build left subtree
  // TODO: Recursively build right subtree
  // TODO: Return node
}
```

### Complexity

- **Time:** O(n) - visit each element once
- **Space:** O(log n) - recursion stack for balanced tree

---

## Problem 6: Range Sum of BST (LeetCode 938)

### Problem Statement

Find the sum of all node values within a given range [low, high].

### Example

```
       10
      /  \
     5    15
    / \     \
   3   7    18

low = 7, high = 15
Sum = 7 + 10 + 15 = 32
```

### Visual Explanation

```
BST property helps prune search:

If node.value < low:
   ↓ Skip left subtree (all values < low)

If node.value > high:
   ↓ Skip right subtree (all values > high)

Example: low=7, high=15

At 10: 7 ≤ 10 ≤ 15 → Include, check both sides
At 5: 5 < 7 → Don't include, only check RIGHT
At 7: 7 ≤ 7 ≤ 15 → Include
At 15: 7 ≤ 15 ≤ 15 → Include
At 18: 18 > 15 → Don't include, skip

Sum = 7 + 10 + 15 = 32
```

### Algorithm

```
function rangeSum(node, low, high):
	if node is null:
		return 0

	sum = 0

	// Include current if in range
	if low <= node.value <= high:
		sum += node.value

	// Check left if current > low
	if node.value > low:
		sum += rangeSum(node.left, low, high)

	// Check right if current < high
	if node.value < high:
		sum += rangeSum(node.right, low, high)

	return sum
```

### Implementation Steps

```typescript
export function rangeSumBST(
  root: BSTNode | null,
  low: number,
  high: number,
): number {
  // TODO: Base case - null node returns 0
  // TODO: Initialize sum
  // TODO: If current in range, add to sum
  // TODO: If current > low, search left
  // TODO: If current < high, search right
  // TODO: Return sum
}
```

### Complexity

- **Time:** O(n) worst case, O(h + k) average (k = nodes in range)
- **Space:** O(h) - recursion stack

---

## Problem 7: Delete Node in BST (LeetCode 450)

### Problem Statement

Delete a node from a BST while maintaining BST property.

### Example

```
Before delete 3:        After:
       5                  5
      / \                / \
     3   6      →       4   6
    / \   \            /     \
   2   4   7          2       7
```

### Visual Explanation

```
Three cases to handle:

Case 1: Node is leaf (no children)
   - Simply remove it

Case 2: Node has one child
   - Replace node with its child

Case 3: Node has two children
   - Find successor (smallest in right subtree)
   - Replace node value with successor value
   - Delete successor

Example: Delete 3
       5
      / \
     3   6
    / \
   2   4

1. Find node 3
2. Has two children? YES
3. Find min in right subtree: 4
4. Replace 3 with 4:
       5
      / \
     4   6
    /
   2
5. Delete old 4 (it's now a leaf)
```

### Algorithm

```
function deleteNode(root, key):
	if root is null:
		return null

	if key < root.value:
		root.left = deleteNode(root.left, key)
	else if key > root.value:
		root.right = deleteNode(root.right, key)
	else:
		// Found node to delete

		// Case 1 & 2: 0 or 1 child
		if root.left is null:
			return root.right
		if root.right is null:
			return root.left

		// Case 3: 2 children
		min = findMin(root.right)
		root.value = min.value
		root.right = deleteNode(root.right, min.value)

	return root
```

### Implementation Steps

```typescript
export function deleteNode(root: BSTNode | null, key: number): BSTNode | null {
  // TODO: Base case - null node
  // TODO: If key < root, search left
  // TODO: If key > root, search right
  // TODO: Found node - handle 3 cases:
  //       1. No left child
  //       2. No right child
  //       3. Two children (find successor)
  // TODO: Return root
}
```

### Complexity

- **Time:** O(h) - traverse to node + find successor
- **Space:** O(h) - recursion stack

---

## Problem 9: Closest Value in a Binary Search Tree

### Problem Statement

Given the root of a **Binary Search Tree (BST)** and a target value `k`, return the value in the tree that is **closest to `k`**.

If multiple values are equally close, returning any one of them is acceptable.

---

### Why This Problem Matters

- Tests understanding of **BST ordering properties**
- Reinforces **binary search–style traversal**
- Demonstrates how constraints enable **time complexity optimization**
- Common interview problem with a clear follow-up optimization

---

### Key Insight (BST Optimization)

In a BST:

- All values in the left subtree are **less than** the current node
- All values in the right subtree are **greater than** the current node

This means:

- If `k < node.value` → the closest value must be **left**
- If `k > node.value` → the closest value must be **right**

⚡ **We only need to traverse one path from root to leaf**, not the entire tree.

---

### Example

```
Tree:
       10
      /  \
     5    15
    / \     \
   2   7     20

Target k = 9
Closest value = 10
```

---

### Visual Walkthrough

```
Start at 10 → closest = 10
k < 10 → go left

At 5 → |5 - 9| = 4 (worse)
k > 5 → go right

At 7 → |7 - 9| = 2 (worse)
Right is null → stop

Result = 10
```

---

### Algorithm (Optimized for BST)

```
function closestValue(root, k):
	if root is null:
		return null

	closest = root.value
	current = root

	while current is not null:
		if |current.value - k| < |closest - k|:
			closest = current.value

		if k < current.value:
			current = current.left
		else if k > current.value:
			current = current.right
		else:
			return current.value

	return closest
```

---

### Implementation Steps

```typescript
export function closestValue(
  root: TreeNode<number> | null,
  k: number,
): number | null {
  // 1. Handle empty tree
  // 2. Initialize closest with root value
  // 3. Traverse down the BST
  // 4. Update closest using absolute difference
  // 5. Move left or right using BST property
  // 6. Return closest value
}
```

---

### Edge Cases

- Empty tree → return `null`
- Single-node tree → return that value
- Exact match → return immediately
- Skewed BST → degrades to linear traversal
- Multiple equally close values → return either

---

### Complexity

| Scenario                       | Time         | Space    |
| ------------------------------ | ------------ | -------- |
| Balanced BST                   | **O(log n)** | **O(1)** |
| Skewed BST                     | O(n)         | O(1)     |
| General binary tree (fallback) | O(n)         | O(n)     |

---

### Common Mistakes

- Traversing the entire tree despite BST guarantee
- Tracking distance instead of value
- Forgetting absolute difference
- Not handling exact match early
- Assuming the tree is always balanced

---

### Interview Tips

- Ask whether the tree is **guaranteed to be a BST**
- Start with the **O(h)** optimized solution
- Mention fallback **O(n)** solution for non-BST trees
- Highlight how constraints change complexity
- Extend discussion to:
  - Kth closest value
  - Closest value ≤ k or ≥ k
  - Frequent queries (augmented BST)

---

### Summary

- BST property enables **binary-search-like traversal**
- Optimal solution runs in **O(h)** time
- Clean, iterative approach with **constant space**
- Excellent example of constraint-driven optimization

---

## BST Traversal Patterns

### In-order (Left → Root → Right)

```
       4
      / \
     2   6
    / \ / \
   1  3 5  7

Result: [1, 2, 3, 4, 5, 6, 7] (SORTED!)
```

### Pre-order (Root → Left → Right)

```
Same tree:
Result: [4, 2, 1, 3, 6, 5, 7]
Use: Clone tree, serialize tree
```

### Post-order (Left → Right → Root)

```
Same tree:
Result: [1, 3, 2, 5, 7, 6, 4]
Use: Delete tree, calculate height
```

---

## Common BST Properties

### BST Invariant

```
For every node:
- All left descendants < node.value
- All right descendants > node.value
```

### Height of Balanced BST

```
Minimum height: log₂(n) - complete tree
Maximum height: n - degenerate tree (linked list)
```

### Search Complexity

```
Balanced BST: O(log n)
Unbalanced BST: O(n)
```

---

## Practice Tips

### Order to Practice

1. **Start with:** validateBST, kthSmallest (traversal basics)
2. **Then:** invertTree, sortedArrayToBST (construction)
3. **Finally:** lowestCommonAncestor, deleteNode (complex logic)

### Common Mistakes

1. ❌ Not maintaining range constraints in validateBST
2. ❌ Forgetting to handle all 3 cases in deleteNode
3. ❌ Not using BST property to prune search
4. ❌ Confusing in-order with pre-order traversal
5. ❌ Off-by-one errors in array-to-BST

### Testing Strategy

```typescript
✓ Empty tree
✓ Single node
✓ Balanced tree
✓ Degenerate tree (all left or all right)
✓ Duplicate values (if allowed)
✓ Negative values
✓ Large trees (performance)
```

---

## Complexity Cheat Sheet

| Problem                | Time   | Space    | Key Technique           |
| ---------------------- | ------ | -------- | ----------------------- |
| Validate BST           | O(n)   | O(h)     | Range validation        |
| Lowest Common Ancestor | O(h)   | O(h)     | BST property navigation |
| Invert Tree            | O(n)   | O(h)     | Post-order recursion    |
| Kth Smallest           | O(h+k) | O(h)     | In-order traversal      |
| Sorted Array to BST    | O(n)   | O(log n) | Middle element          |
| Range Sum BST          | O(n)   | O(h)     | Pruned traversal        |
| Delete Node            | O(h)   | O(h)     | 3-case handling         |

Happy Coding! 🚀
