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

# Problem 10: Branch Sum (Binary Tree)

This module is intended to compute the **sum of values along every root-to-leaf branch** in a binary tree.

A _branch_ is defined as any path that starts at the root node and ends at a leaf node.  
The result should be an array containing the sum for each of these branches.

---

## 📌 Problem Overview

Given a binary tree, calculate the sum of all node values from the root to each leaf.

### Example Tree

```

```

    1

/ \
 2 3
/ \ \
4 5 6

```

```

### Expected Output

```

[7, 8, 10]

```

**Explanation:**

- `1 → 2 → 4 = 7`
- `1 → 2 → 5 = 8`
- `1 → 3 → 6 = 10`

---

## 🧠 Intended Approach

The recommended approach is **Depth-First Search (DFS)** using recursion.

High-level idea:

1. Start at the root with a running sum of `0`
2. Add each node’s value to the running sum as you traverse
3. When a leaf node is reached, store the accumulated sum
4. Continue until all root-to-leaf paths are explored

This approach naturally follows the tree structure and is easy to reason about.

---

## 🧩 Implementation Status

🚧 **TODO**

- Implement `branchSum` to return all root-to-leaf branch sums
- Use a recursive helper or an iterative stack-based approach
- Ensure the function handles:
  - Empty trees
  - Single-node trees
  - Unbalanced trees

---

## ⏱️ Time & Space Complexity (Target)

### Time Complexity

**O(n)**
Each node should be visited exactly once.

### Space Complexity

**O(h)**
Where `h` is the height of the tree:

- Balanced tree: `O(log n)`
- Skewed tree: `O(n)`

Space usage comes from the recursion stack (or an explicit stack if implemented iteratively).

---

## Problem 11: Evaluate Expression Tree

### Problem Statement

Given a binary expression tree, evaluate the arithmetic expression it represents and return the resulting number.

### Expression Tree Rules

- **Leaf nodes** contain **non-negative integers** (operands)
- **Internal nodes** contain **negative integers** representing operators:

| Value | Operator                        |
| ----: | ------------------------------- |
|    -1 | Addition (`+`)                  |
|    -2 | Subtraction (`-`)               |
|    -3 | Integer Division (`÷`, floored) |
|    -4 | Multiplication (`*`)            |

Each operator node has **exactly two children**.

---

### Example

```
Expression Tree for: (3 + 2) * (4 - 1)

            -4 (*)
           /      \
        -1 (+)    -2 (-)
        /   \     /   \
       3     2   4     1
```

**Evaluation:**

```
(3 + 2) = 5
(4 - 1) = 3
5 * 3 = 15
```

**Result:** `15`

---

### Visual Explanation

```
Post-order evaluation (Left → Right → Root):

            *
           / \
          +   -
         / \ / \
        3  2 4  1

Step 1: Evaluate leaves → 3, 2, 4, 1
Step 2: Apply + → 3 + 2 = 5
Step 3: Apply - → 4 - 1 = 3
Step 4: Apply * → 5 * 3 = 15
```

---

### Algorithm

```
function evaluate(node):
    if node is a leaf:
        return node.value

    left = evaluate(node.left)
    right = evaluate(node.right)

    if node.value == -1:
        return left + right
    if node.value == -2:
        return left - right
    if node.value == -3:
        return floor(left / right)
    if node.value == -4:
        return left * right
```

---

### Step-by-Step Example

```
Tree Node: -1 (+)
Left: 3
Right: 2

Step 1: Evaluate left → 3
Step 2: Evaluate right → 2
Step 3: Apply operator → 3 + 2 = 5
```

---

### Implementation (TypeScript)

```ts
export function evaluateExpressionTree(tree: TreeNode<number>): number {
  // Base case: leaf node (operand)
  if (tree.value >= 0) {
    return tree.value;
  }

  // Operator nodes must have both children
  if (tree.left === null || tree.right === null) {
    throw new Error("Operator node must have both left and right children");
  }

  // Recursively evaluate subtrees
  const leftValue = evaluateExpressionTree(tree.left);
  const rightValue = evaluateExpressionTree(tree.right);

  // Apply operator
  switch (tree.value) {
    case -1: // addition
      return leftValue + rightValue;
    case -2: // subtraction
      return leftValue - rightValue;
    case -3: // integer division
      return Math.floor(leftValue / rightValue);
    case -4: // multiplication
      return leftValue * rightValue;
    default:
      throw new Error(`Unknown operator: ${tree.value}`);
  }
}
```

---

### Complexity

- **Time:** `O(n)` — each node is evaluated once
- **Space:** `O(h)` — recursion stack, where `h` is the height of the tree

---

### Key Takeaways

- This is a classic **post-order traversal** problem
- Leaf nodes return values directly
- Internal nodes combine results from children
- Recursive evaluation mirrors how expressions are computed

---

## ✅ Edge Cases to Consider

- Empty tree (`null` root) → should return `[]`
- Tree with only one node
- Highly unbalanced trees
- Trees containing negative values

---

## 📚 Use Cases

- Binary tree traversal practice
- Coding interview preparation
- Teaching recursion and DFS
- Path-based tree analysis problems

---

## 🛠️ Requirements

- TypeScript
- A `TreeNode<T>` structure with:
  - `value`
  - `left`
  - `right`

---

### Edge Cases

- Empty tree → return `null`
- Single-node tree → return that value
- Exact match → return immediately
- Skewed BST → degrades to linear traversal
- Multiple equally close values → return either

---

## Problem: Kth Largest Element in a Binary Search Tree

### Problem Statement

Given the root of a **Binary Search Tree (BST)** and an integer `k`, return the **k-th largest value** in the tree.

If the k-th largest element does not exist, return `null`.

---

### Binary Search Tree Rules

- Values in the **left subtree** are **smaller** than the node
- Values in the **right subtree** are **larger** than the node
- Reverse in-order traversal (Right → Node → Left) visits nodes in **descending order**

---

### Example

```
BST:

        5
       / \
      3   8
     / \   \
    2   4   10
```

**k = 3**

Sorted values (descending):

```
10, 8, 5, 4, 3, 2
```

**Result:** `5`

---

### Visual Explanation

```
Reverse In-order Traversal (Right → Node → Left):

        5
       / \
      3   8
     / \   \
    2   4   10

Traversal order:
10 → 8 → 5 → 4 → 3 → 2

k = 3 → 5
```

---

### Algorithm

```
function kthLargest(root, k):
    count = 0
    result = null

    function reverseInorder(node):
        if node is null or result is not null:
            return

        reverseInorder(node.right)

        count += 1
        if count == k:
            result = node.value
            return

        reverseInorder(node.left)

    traverse(root)
    return result
```

---

### Step-by-Step Example

```
k = 2

Visit right subtree:
- Visit 10 → count = 1
- Visit 8  → count = 2 → FOUND

Traversal stops early.
```

---

### Implementation (TypeScript)

```ts
function kthLargest<T>(root: TreeNode<T> | null, k: number): T | null {
  if (!root || k <= 0) return null;

  let visitedCount = 0;
  let result: T | null = null;

  const reverseInorder = (node: TreeNode<T> | null): void => {
    if (!node || result !== null) return;

    reverseInorder(node.right);

    visitedCount++;
    if (visitedCount === k) {
      result = node.val;
      return;
    }

    reverseInorder(node.left);
  };

  reverseInorder(root);
  return result;
}
```

---

### Complexity

- **Time:** `O(n)` in the worst case
- **Space:** `O(h)` where `h` is the height of the tree

---

### Key Takeaways

- This is a **reverse in-order traversal** problem
- BST properties guarantee sorted order
- Early termination improves performance
- Common interview pattern for ordered tree queries

---

### Edge Cases

- Empty tree → return `null`
- Single-node tree → return that value
- `k` larger than number of nodes → return `null`
- Skewed BST → behaves like a linked list

---

## Problem: Reconstruct Binary Search Tree from Preorder Traversal

### Problem Statement

Given an array representing the **preorder traversal** of a **Binary Search Tree (BST)**, reconstruct the original BST and return its root.

---

### Binary Search Tree Rules

- For every node:
  - All values in the **left subtree** are **less than** the node value
  - All values in the **right subtree** are **greater than** the node value

- **Preorder traversal order:**
  **Root → Left → Right**

---

### Example

```
Preorder Traversal:
[10, 5, 1, 7, 15, 12, 20]
```

**Reconstructed BST:**

```
        10
       /  \
      5    15
     / \   / \
    1   7 12  20
```

---

### Visual Explanation

```
Preorder traversal order:

10 → 5 → 1 → 7 → 15 → 12 → 20

Step-by-step construction:

1. 10 becomes the root
2. 5 < 10 → goes to left subtree
3. 1 < 5 → goes to left of 5
4. 7 > 5 and < 10 → goes to right of 5
5. 15 > 10 → goes to right subtree
6. 12 < 15 → goes to left of 15
7. 20 > 15 → goes to right of 15
```

---

### Algorithm

```
Initialize index = 0

function build(min, max):
    if index is out of bounds:
        return null

    value = preorder[index]

    if value <= min or value >= max:
        return null

    index++

    node = new TreeNode(value)
    node.left = build(min, value)
    node.right = build(value, max)

    return node

Call build(-∞, +∞)
```

---

### Step-by-Step Example

```
Current value: 10
Range: (-∞, +∞)
→ Valid root

Left subtree range: (-∞, 10)
Current value: 5
→ Valid left child

Left subtree range: (-∞, 5)
Current value: 1
→ Valid left child

Right subtree range: (5, 10)
Current value: 7
→ Valid right child
```

---

### Implementation (TypeScript)

```ts
export function reconstructBST(preorder: number[]): TreeNode<number> | null {
  if (preorder.length === 0) return null;

  let index = 0;

  const build = (min: number, max: number): TreeNode<number> | null => {
    if (index >= preorder.length) return null;

    const value = preorder[index];
    if (value <= min || value >= max) return null;

    index++;

    return {
      value,
      left: build(min, value),
      right: build(value, max),
    };
  };

  return build(-Infinity, Infinity);
}
```

---

### Complexity

- **Time:** `O(n)` — each value is processed once
- **Space:** `O(h)` — recursion stack, where `h` is the height of the BST

---

### Key Takeaways

- Preorder traversal always visits the root first
- Value bounds enforce BST validity
- Each node is constructed exactly once
- This is the **optimal** solution for preorder-to-BST reconstruction

---

### Edge Cases

- Empty array → return `null`
- Single-element array → single-node BST
- Strictly increasing preorder → right-skewed BST
- Strictly decreasing preorder → left-skewed BST

---

### Use Cases

- Tree reconstruction problems
- Understanding traversal properties
- Coding interview preparation
- Efficient BST construction

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

1 3 5 7

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

# Node Depths (Recursive DFS)

## Problem Statement

Given the root of a binary tree, calculate the **sum of the depths of all nodes** in the tree.

- The **root node** has a depth of `0`
- Each child node has a depth of **parent depth + 1**
- If the tree is empty, return `0`

---

## Example

```
        1
       / \
      2   3
     /
    4
```

### Depth Calculation

- Node `1` → depth `0`
- Node `2` → depth `1`
- Node `3` → depth `1`
- Node `4` → depth `2`

**Total Depth Sum:**
`0 + 1 + 1 + 2 = 4`

---

## Recursive Intuition

At each node:

1. Add the current node’s depth
2. Recursively calculate depth sums of the left subtree
3. Recursively calculate depth sums of the right subtree

The recursion naturally follows a **depth-first traversal**.

---

## Algorithm

```
function nodeDepth(node, depth):
    if node is null:
        return 0

    return depth
         + nodeDepth(node.left, depth + 1)
         + nodeDepth(node.right, depth + 1)
```

---

## Implementation (TypeScript)

```ts
/**
 * Calculates the sum of depths of all nodes in a binary tree using recursion.
 */
export function nodeDepth(root: TreeNode<number> | null, depth = 0): number {
  if (root === null) {
    return 0;
  }

  return (
    depth + nodeDepth(root.left, depth + 1) + nodeDepth(root.right, depth + 1)
  );
}
```

---

## Test Cases

```ts
describe("nodeDepth()", () => {
  describe("basic functionality", () => {
    test("should return 0 for a null tree", () => {
      expect(nodeDepth(null)).toBe(0);
    });

    test("should return 0 for a single-node tree", () => {
      const tree = new TreeNode(1);
      expect(nodeDepth(tree)).toBe(0);
    });
  });

  describe("balanced trees", () => {
    test("should calculate correct depth sum", () => {
      const tree = new TreeNode(1);
      tree.left = new TreeNode(2);
      tree.right = new TreeNode(3);
      tree.left.left = new TreeNode(4);
      tree.left.right = new TreeNode(5);

      expect(nodeDepth(tree)).toBe(6);
    });
  });
});
```

---

## Complexity Analysis

- **Time Complexity:** `O(n)`
  - Each node is visited once

- **Space Complexity:** `O(h)`
  - `h` is the height of the tree (recursion stack)

---

## Advantages of the Recursive Approach

- Simple and expressive
- Closely matches the problem definition
- Easy to reason about and implement

---

## Limitations

⚠️ For **very deep trees**, recursion may cause stack overflow.
In such cases, consider an **iterative solution using a stack**.

---

## Related Concepts

- Binary Trees
- Depth-First Search (DFS)
- Recursion
- Tree Traversal

---

# Diameter of a Binary Tree (Recursive DFS)

## Problem Statement

Given the root of a binary tree, compute the **diameter** of the tree.

The **diameter** is defined as the **number of edges** in the longest path between **any two nodes** in the tree.
This path **may or may not pass through the root**.

- If the tree is empty, return `0`
- A single-node tree has a diameter of `0`

---

## Example

```
        1
       / \
      2   3
     / \
    4   5
```

### Longest Path

One of the longest paths is:

```
4 → 2 → 1 → 3
```

### Diameter Calculation

- Number of edges in the path: `3`

**Diameter = 3**

---

## Key Insight

At **every node**, there are two important values:

1. **Height**
   The number of edges from the current node to its deepest leaf

2. **Diameter**
   The longest path found anywhere in the subtree

The longest path **through** a node is:

```
leftHeight + rightHeight
```

The diameter at a node is the maximum of:

- Diameter of the left subtree
- Diameter of the right subtree
- Longest path passing through the current node

---

## Recursive Intuition

At each node:

1. Recursively compute diameter and height of the left subtree
2. Recursively compute diameter and height of the right subtree
3. Combine heights to form a path through the node
4. Track the maximum diameter seen so far

By returning **both diameter and height together**, we avoid repeated work.

---

## Algorithm

```
function dfs(node):
    if node is null:
        return [0, 0]  // [diameter, height]

    leftDiameter, leftHeight = dfs(node.left)
    rightDiameter, rightHeight = dfs(node.right)

    pathThroughNode = leftHeight + rightHeight
    currentDiameter = max(
        pathThroughNode,
        leftDiameter,
        rightDiameter
    )

    currentHeight = 1 + max(leftHeight, rightHeight)

    return [currentDiameter, currentHeight]
```

---

## Implementation (TypeScript)

```ts
/**
 * Computes the diameter of a binary tree.
 */
export function diameterBST(tree: TreeNode<number>): number {
  const [diameter] = getDiameterAndHeight(tree);
  return diameter;
}

/**
 * Returns both the diameter and height of a subtree.
 */
function getDiameterAndHeight(node: TreeNode<number> | null): [number, number] {
  if (node === null) {
    return [0, 0];
  }

  const [leftDiameter, leftHeight] = getDiameterAndHeight(node.left);
  const [rightDiameter, rightHeight] = getDiameterAndHeight(node.right);

  const pathThroughNode = leftHeight + rightHeight;

  const currentDiameter = Math.max(
    pathThroughNode,
    leftDiameter,
    rightDiameter,
  );

  const currentHeight = 1 + Math.max(leftHeight, rightHeight);

  return [currentDiameter, currentHeight];
}
```

---

## Example Walkthrough

For this tree:

```
        1
       / \
      2   3
     /
    4
```

- Height at node `4` → `0`

- Height at node `2` → `1`

- Height at node `1` → `2`

- Path through node `1` → `2`

- Best diameter found → `2`

**Final Answer:** `2`

---

## Test Cases

```ts
describe("diameterBST()", () => {
  test("should return 0 for a null tree", () => {
    expect(diameterBST(null as any)).toBe(0);
  });

  test("should return 0 for a single-node tree", () => {
    const tree = new TreeNode(1);
    expect(diameterBST(tree)).toBe(0);
  });

  test("should return correct diameter for a balanced tree", () => {
    const tree = new TreeNode(1);
    tree.left = new TreeNode(2);
    tree.right = new TreeNode(3);
    tree.left.left = new TreeNode(4);
    tree.left.right = new TreeNode(5);

    expect(diameterBST(tree)).toBe(3);
  });
});
```

---

## Complexity Analysis

- **Time Complexity:** `O(n)`
  - Each node is visited exactly once

- **Space Complexity:** `O(h)`
  - `h` is the height of the tree (recursion stack)

---

## Why This Approach Works Well

✅ Single DFS traversal
✅ No redundant height calculations
✅ Clean separation of concerns
✅ Matches common LeetCode editorial solutions

---

## Limitations

⚠️ Deeply skewed trees may cause stack overflow due to recursion.

For such cases, consider:

- Iterative DFS
- Tail-call optimization (if supported)

---

## Related Concepts

- Binary Trees
- Depth-First Search (DFS)
- Tree Height
- Divide and Conquer
- Recursion

---

# Inorder Successor in a Binary Search Tree (BST)

## Problem Statement

Given the root of a **Binary Search Tree** and a target value, find the **inorder successor** of that value.

The **inorder successor** is the node with the **smallest value strictly greater** than the target.

- If the successor does not exist, return `null`
- The target value **may or may not exist** in the tree

---

## Example

```
        20
       /  \
     10    30
       \
        15
```

### Target

```
target = 15
```

### Inorder Traversal

```
10 → 15 → 20 → 30
```

### Successor

```
20
```

---

## Key BST Insight 🧠

In a BST:

- All values in the **left subtree** are smaller
- All values in the **right subtree** are larger

While traversing:

- If `target < node.value` → this node is a **successor candidate**
- If `target ≥ node.value` → successor must be in the **right subtree**

We keep updating the closest larger value found so far.

---

## Algorithm

```
function findSuccessor(root, target):
    successor = null
    current = root

    while current is not null:
        if target < current.value:
            successor = current.value
            current = current.left
        else:
            current = current.right

    return successor
```

---

## Implementation (TypeScript)

```ts
/**
 * Finds the inorder successor of a value in a Binary Search Tree.
 */
export function findSuccessor(
  root: TreeNode<number> | null,
  target: number,
): number | null {
  let successor: number | null = null;
  let current = root;

  while (current !== null) {
    if (target < current.value) {
      // Current node is a valid successor candidate
      successor = current.value;
      current = current.left;
    } else {
      // Successor must be in the right subtree
      current = current.right;
    }
  }

  return successor;
}
```

---

## Example Walkthrough

For the tree:

```
        20
       /  \
     10    30
       \
        15
```

Steps:

1. `15 < 20` → successor = `20`, move left
2. `15 ≥ 10` → move right
3. `15 ≥ 15` → move right (null)

**Final Answer:** `20`

---

## Edge Cases

✔ Tree is empty → return `null`
✔ Target is the largest value → return `null`
✔ Target does not exist → return next greater value if possible

---

## Complexity Analysis

- **Time Complexity:** `O(h)`
  - `h` = height of the BST

- **Space Complexity:** `O(1)`
  - No recursion or extra data structures

---

## Why This Approach Is Optimal

✅ Uses BST ordering directly
✅ Single pass from root to leaf
✅ No unnecessary traversal
✅ Interview-ready and LeetCode-approved

---

## Common Mistakes ❌

- Using full inorder traversal (`O(n)`)
- Not handling the “no successor” case
- Forgetting that target may not exist
- Overwriting successor without checking bounds

---

# Height Balanced Binary Tree

## Problem Statement

Given the root of a **binary tree**, determine whether it is **height-balanced**.

A binary tree is **height-balanced** if:

> For **every node**, the difference between the heights of its left and right subtrees is **at most 1**.

Return `true` if the tree is balanced, otherwise return `false`.

---

## Example

### Balanced Tree ✅

```
        1
       / \
      2   3
     /
    4
```

- Left subtree height = 2
- Right subtree height = 1
- Difference = 1 → **Balanced**

---

### Unbalanced Tree ❌

```
        1
       /
      2
     /
    3
```

- Left subtree height = 2
- Right subtree height = -1
- Difference = 3 → **Not Balanced**

---

## Key Insight 🧠

Checking balance requires **two things** at every node:

1. The **left subtree** is balanced
2. The **right subtree** is balanced
3. The **height difference** between them is ≤ 1

To do this efficiently:

- Use **post-order traversal** (bottom-up)
- Return the **height** of the subtree
- Return **-1 immediately** if an imbalance is detected

This allows us to stop early instead of traversing the entire tree.

---

## Algorithm

```
function getHeight(node):
    if node is null:
        return 0

    leftHeight = getHeight(node.left)
    if leftHeight == -1:
        return -1

    rightHeight = getHeight(node.right)
    if rightHeight == -1:
        return -1

    if abs(leftHeight - rightHeight) > 1:
        return -1

    return max(leftHeight, rightHeight) + 1
```

The tree is balanced if the final result is **not -1**.

---

## Implementation (TypeScript)

```ts
/**
 * Determines if a binary tree is height-balanced.
 */
export function heightBalancedBinaryTree(tree: TreeNode<number>): boolean {
  return getHeight(tree) !== -1;
}

/**
 * Returns the height of the tree if balanced.
 * Returns -1 if the tree is not balanced.
 */
function getHeight(node: TreeNode<number> | null): number {
  // Base case: empty tree
  if (node === null) return 0;

  // Get left subtree height
  const leftHeight = getHeight(node.left);
  if (leftHeight === -1) return -1;

  // Get right subtree height
  const rightHeight = getHeight(node.right);
  if (rightHeight === -1) return -1;

  // Check balance condition
  if (Math.abs(leftHeight - rightHeight) > 1) {
    return -1;
  }

  // Return height of current node
  return Math.max(leftHeight, rightHeight) + 1;
}
```

---

## Example Walkthrough

For the tree:

```
        1
       / \
      2   3
     /
    4
```

Steps:

1. Node `4` → height = `0`
2. Node `2` → height = `1`
3. Node `3` → height = `0`
4. Node `1` → height difference = `1`

✅ Tree is balanced → returns `true`

---

## Edge Cases

✔ Empty tree → `true`
✔ Single node → `true`
✔ Deep skewed tree → `false`
✔ Early imbalance → stops traversal immediately

---

## Complexity Analysis

- **Time Complexity:** `O(n)`
  - Each node is visited once

- **Space Complexity:** `O(h)`
  - `h` = height of the tree (recursion stack)

---

## Why This Approach Is Optimal

✅ Early exit when imbalance is found
✅ No extra data structures
✅ Clean recursive logic
✅ LeetCode and interview standard solution

---

## Common Mistakes ❌

- Calculating height separately (`O(n²)`)
- Not stopping early after imbalance
- Forgetting that empty trees are balanced
- Using extra objects when unnecessary

---

# Merge Two Binary Trees

## Problem Statement

Given two binary trees, merge them into a **single binary tree**.

Rules for merging:

- If **both nodes exist**, sum their values
- If **only one node exists**, use that node
- If **both nodes are null**, the merged node is null

The merged tree should represent the combined structure of both trees.

---

## Example

### Tree 1

```
      1
     / \
    3   2
   /
  5
```

### Tree 2

```
      2
     / \
    1   3
     \   \
      4   7
```

---

### Merged Tree

```
      3
     / \
    4   5
   / \   \
  5   4   7
```

---

## Key Insight 🧠

At every node:

- If **both trees have a node**, add their values
- If **only one tree has a node**, reuse it
- Recursively apply the same logic to left and right children

This is a natural fit for **Depth-First Search (DFS)**.

---

## Algorithm

```
function mergeTrees(node1, node2):
    if node1 is null:
        return node2
    if node2 is null:
        return node1

    mergedNode.value = node1.value + node2.value
    mergedNode.left = mergeTrees(node1.left, node2.left)
    mergedNode.right = mergeTrees(node1.right, node2.right)

    return mergedNode
```

---

## Implementation (TypeScript)

```ts
/**
 * Merges two binary trees.
 * If both nodes exist, their values are summed.
 * If only one exists, that node is used.
 */
export function mergeBinaryTrees(
  tree1: TreeNode<number> | null,
  tree2: TreeNode<number> | null,
): TreeNode<number> | null {
  if (tree1 === null) return tree2;
  if (tree2 === null) return tree1;

  return {
    value: tree1.value + tree2.value,
    left: mergeBinaryTrees(tree1.left, tree2.left),
    right: mergeBinaryTrees(tree1.right, tree2.right),
  };
}
```

---

## Example Walkthrough

At the root:

```
1 + 2 = 3
```

Left subtree:

```
3 + 1 = 4
```

Right subtree:

```
2 + 3 = 5
```

Missing nodes are reused as-is.

---

## Edge Cases

✔ Both trees empty → return `null`
✔ One tree empty → return the other tree
✔ Trees of different shapes → merge where possible

---

## Complexity Analysis

- **Time Complexity:** `O(n)`
  - `n` = total number of nodes across both trees

- **Space Complexity:** `O(h)`
  - `h` = height of the merged tree (recursion stack)

---

## Why This Approach Is Optimal

✅ Visits each node once
✅ Simple recursive logic
✅ Preserves tree structure
✅ Matches LeetCode #617 expected behavior

---

## Common Mistakes ❌

- Returning numbers instead of nodes
- Ignoring one-sided subtrees
- Mutating input trees unintentionally
- Using unnecessary traversals

---

## Related Problems

- Invert Binary Tree
- Maximum Depth of Binary Tree
- Height Balanced Binary Tree
- Binary Tree Level Order Traversal

---

## Related Concepts

- Binary Search Trees
- Inorder Traversal
- Tree Navigation
- Successor / Predecessor Problems

---

# Split Binary Tree by Equal Sum

## Problem Statement

Given the root of a **binary tree**, determine whether it is possible to **split the tree into two non-empty subtrees with equal sum** by removing **exactly one edge**.

If such a split exists, return the **sum of either subtree** (i.e. half of the total sum).
Otherwise, return `0`.

> The **root itself does NOT count** as a valid split — at least one edge must be removed.

---

## Key Observation

Removing one edge partitions the tree into:

- a **subtree**
- the **remaining tree**

For the split to be valid:

```
subtreeSum === remainingSum
⇒ subtreeSum === totalSum / 2
```

So the task reduces to:

> **Does there exist a proper subtree whose sum equals half of the total tree sum?**

---

## Examples

### Tree Can Be Split ✅

```
        1
       / \
      2   3
```

- Total sum = `6`
- Target = `6 / 2 = 3`
- Subtree rooted at `3` → sum = `3`
- Remaining tree → sum = `3`

✅ Valid split
**Return:** `3`

---

### Tree Cannot Be Split ❌

```
        1
       / \
      2   4
```

- Total sum = `7` (odd)
- Cannot split evenly

❌ No valid split
**Return:** `0`

---

## Key Insight 🧠

1. Compute the **total sum** of the tree.
2. If the total sum is **odd**, return `0` immediately.
3. Traverse the tree in **post-order** to compute subtree sums.
4. If any **proper subtree** has sum equal to `totalSum / 2`, a split is possible.

### Why post-order?

- Subtree sums depend on children
- Post-order ensures children are processed before the parent

---

## Algorithm (Corrected)

```
function getTreeSum(node):
    if node is null:
        return 0
    return node.value + getTreeSum(node.left) + getTreeSum(node.right)

function canSplit(node, target, root):
    if node is null:
        return [0, false]

    [leftSum, leftFound] = canSplit(node.left, target, root)
    [rightSum, rightFound] = canSplit(node.right, target, root)

    currentSum = node.value + leftSum + rightSum

    foundSplit =
        leftFound OR
        rightFound OR
        (currentSum == target AND node != root)

    return [currentSum, foundSplit]

totalSum = getTreeSum(root)
if totalSum is odd:
    return 0

target = totalSum / 2
[_, found] = canSplit(root, target, root)

return target if found else 0
```

---

## Implementation (TypeScript — Corrected)

```ts
interface TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
}

/**
 * Determines whether a binary tree can be split into two equal-sum trees
 * by removing exactly one edge.
 *
 * @param root - Root of the binary tree
 * @returns Half of total sum if split is possible, otherwise 0
 */
export function splitBinaryTree(root: TreeNode<number> | null): number {
  if (!root) return 0;

  const totalSum = getTreeSum(root);
  if (totalSum % 2 !== 0) return 0;

  const target = totalSum / 2;
  const [, canBeSplit] = canSplitWithSum(root, target, root);

  return canBeSplit ? target : 0;
}

function canSplitWithSum(
  node: TreeNode<number> | null,
  target: number,
  root: TreeNode<number>,
): [number, boolean] {
  if (!node) return [0, false];

  const [leftSum, leftSplit] = canSplitWithSum(node.left, target, root);
  const [rightSum, rightSplit] = canSplitWithSum(node.right, target, root);

  const currentSum = node.value + leftSum + rightSum;

  const canBeSplit =
    leftSplit || rightSplit || (currentSum === target && node !== root);

  return [currentSum, canBeSplit];
}

function getTreeSum(node: TreeNode<number> | null): number {
  if (!node) return 0;
  return node.value + getTreeSum(node.left) + getTreeSum(node.right);
}
```

---

## Example Walkthrough

For this tree:

```
        1
       / \
      2   3
```

- Total sum = `6`
- Target = `3`
- Subtree at node `3` has sum `3`
- Edge removal creates two trees of sum `3`

✅ **Return `3`**

---

## Edge Cases

✔ Empty tree → `0`
✔ Single node → `0` (cannot remove an edge)
✔ Negative values → handled correctly
✔ Multiple valid splits → any one suffices
✔ Total sum = `0` → valid split only if a **proper subtree** sums to `0`

---

## Complexity Analysis

- **Time Complexity:** `O(n)`
- **Space Complexity:** `O(h)`
  (`h` = height of tree due to recursion stack)

---

## Common Mistakes ❌ (Corrected)

- ❌ Comparing subtree sum to **total sum**
- ❌ Returning total sum instead of `totalSum / 2`
- ❌ Allowing the root to count as a split
- ❌ Forgetting odd-sum early exit
- ❌ Using pre-order traversal

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

| Problem                    | Time   | Space    | Key Technique                       |
| -------------------------- | ------ | -------- | ----------------------------------- |
| Validate BST               | O(n)   | O(h)     | Range validation                    |
| Lowest Common Ancestor     | O(h)   | O(h)     | BST property navigation             |
| Invert Tree                | O(n)   | O(h)     | Post-order recursion                |
| Kth Smallest               | O(h+k) | O(h)     | In-order traversal                  |
| Sorted Array to BST        | O(n)   | O(log n) | Middle element                      |
| Range Sum BST              | O(n)   | O(h)     | Pruned traversal                    |
| Delete Node                | O(h)   | O(h)     | 3-case handling                     |
| Reconstruct BST (Preorder) | O(n)   | O(h)     | Bounds + preorder index             |
| Inorder Successor (BST)    | O(h)   | O(1)     | BST navigation + candidate tracking |
| Kth Largest                | O(h+k) | O(h)     | Reverse in-order traversal          |
| Diameter of Binary Tree    | O(n)   | O(h)     | DFS with height + diameter tracking |

Happy Coding! 🚀
