# FAANG Binary Search Tree Problems Guide

This guide covers high-yield BST (Binary Search Tree) interview problems. BSTs appear in 15-20% of FAANG interviews and test understanding of tree invariants and efficient operations.

## Why BSTs Matter

BSTs test:
- **Invariant thinking** (understanding what makes a tree a BST)
- **Optimization patterns** (when to use BST vs hash map)
- **Range queries** (inorder traversal, min/max problems)
- **Recursive problem solving** (validation, insertion, deletion)

Research references:
- [Google Tech Dev Guide: Binary Search](https://techdevguide.withgoogle.com/)
- [LeetCode BST Tag](https://leetcode.com/tag/binary-search-tree/)

---

## Core Concept: BST Invariant

**The golden rule:**
```
For every node:
  - All values in LEFT subtree < node.value
  - All values in RIGHT subtree > node.value
  - Both left and right subtrees must also be valid BSTs
```

This is NOT just about local node comparison. The entire subtree must respect this property!

---

## Core BST Patterns

### Pattern 1: Validation

**Interview signal:** "Is this a valid BST?" or "Validate BST"

**Common mistake:** Only checking `left.value < node.value` and `right.value > node.value`. This is WRONG!

**Why it fails:**
```
      5
     / \
    3   7
   /
  6  ← ERROR: This violates BST property!
     6 > 5 but 6 is in left subtree of 5

Local check passes: 3 < 5 and 7 > 5 ✓
But 6 > 3 fails global constraint!
```

**Correct approach:** Use min/max bounds that propagate down.

```typescript
function isValidBST(node: TreeNode | null): boolean {
  return validate(node, -Infinity, Infinity);
}

function validate(
  node: TreeNode | null,
  min: number,
  max: number
): boolean {
  if (!node) return true;
  
  // Check if node violates bounds
  if (node.value <= min || node.value >= max) {
    return false;
  }
  
  // Left subtree: all must be < node.value
  const leftValid = validate(node.left, min, node.value);
  
  // Right subtree: all must be > node.value
  const rightValid = validate(node.right, node.value, max);
  
  return leftValid && rightValid;
}
```

**Complexity:**
- Time: O(n) — visit all nodes
- Space: O(h) — recursion depth, h = height

**Interview talking points:**
> "Can't just check immediate children. Must enforce bounds through entire subtree. Left subtree has upper bound = current node value. Right subtree has lower bound = current node value."

---

### Pattern 2: Inorder Traversal (Sorted Sequence)

**Interview signal:** "In sorted order" or "Kth smallest"

**Key insight:** Inorder traversal of BST produces values in sorted order!

Left → Root → Right = Sorted

```typescript
function kthSmallest(root: TreeNode | null, k: number): number {
  const values: number[] = [];
  
  function inorder(node: TreeNode | null) {
    if (!node) return;
    
    inorder(node.left);       // Left
    values.push(node.value);  // Root
    inorder(node.right);      // Right
  }
  
  inorder(root);
  return values[k - 1];
}

// Optimized: early exit when we hit kth element
function kthSmallestOptimized(root: TreeNode | null, k: number): number {
  let count = 0;
  let result = 0;
  
  function inorder(node: TreeNode | null) {
    if (!node || count >= k) return;
    
    inorder(node.left);
    
    count++;
    if (count === k) {
      result = node.value;
      return;
    }
    
    inorder(node.right);
  }
  
  inorder(root);
  return result;
}
```

**Complexity:**
- Basic: O(n) time, O(n) space (store all values)
- Optimized: O(k + h) time, O(h) space (early exit)

**Interview talking point:**
> "Inorder traversal gives sorted order. We can use this for Kth smallest (traverse k times), or for converting BST to sorted array."

---

### Pattern 3: BST Construction / Insertion

**Interview signal:** "Insert into BST" or "Build BST from array"

**How it works:** Find correct position using BST property.

```typescript
function insert(root: TreeNode | null, value: number): TreeNode {
  if (!root) {
    return new TreeNode(value);
  }
  
  if (value < root.value) {
    root.left = insert(root.left, value);
  } else if (value > root.value) {
    root.right = insert(root.right, value);
  }
  // If value == root.value, don't insert (duplicates handled per problem)
  
  return root;
}
```

**Complexity:**
- Time: O(log n) average, O(n) worst (skewed tree)
- Space: O(h) recursion depth

**Key insight:** For balanced BST, insertion is O(log n). For skewed tree, it's O(n).

---

### Pattern 4: Lowest Common Ancestor (LCA)

**Interview signal:** "Common ancestor" or "Find LCA"

**Approach:** Use BST property to navigate.

```typescript
function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode
): TreeNode | null {
  if (!root) return null;
  
  // If both p and q are smaller, go left
  if (p.value < root.value && q.value < root.value) {
    return lowestCommonAncestor(root.left, p, q);
  }
  
  // If both p and q are larger, go right
  if (p.value > root.value && q.value > root.value) {
    return lowestCommonAncestor(root.right, p, q);
  }
  
  // p and q are on different sides, or one is root
  // This is the LCA!
  return root;
}
```

**Complexity:**
- Time: O(log n) average, O(n) worst
- Space: O(h) recursion

**Why it works:** BST property lets us eliminate entire subtrees!

---

## Interview Strategy for BST Problems

### Step 1: Identify the BST Property You're Using

Every good BST solution leverages the invariant:

| Problem | BST Property Used | Strategy |
|---|---|---|
| Validate | Node bounds + subtree check | Pass min/max bounds |
| Kth smallest | Inorder = sorted | Inorder traversal |
| Search | Left < node < Right | Navigate left/right |
| Insert | Find sorted position | Recursively find insertion point |
| LCA | Path determined by value | Use comparisons to navigate |

### Step 2: Avoid These Common Mistakes

❌ **Mistake 1:** Only comparing immediate children
```typescript
// WRONG! Doesn't catch the full subtree violation
if (node.left?.value < node.value && node.right?.value > node.value) { }
```

✅ **Correct:** Pass bounds through recursion
```typescript
// RIGHT! Ensures entire subtree respects bounds
validate(node.left, min, node.value);
validate(node.right, node.value, max);
```

❌ **Mistake 2:** Assuming O(log n) for all BST operations
```typescript
// This tree is skewed! O(log n) doesn't apply
tree = insert(tree, 1); // [1, 2, 3, 4, 5] in order
```

✅ **Correct:** State the actual complexity
```typescript
// Time: O(log n) for balanced BST, O(n) if skewed
// To guarantee O(log n), would need to mention self-balancing (AVL, Red-Black)
```

### Step 3: Code Template

```typescript
// Template for traversal-based problems
function traverse(node: TreeNode | null, state: any): void {
  if (!node) return;
  
  traverse(node.left, state);  // Left
  // Process node here               // Root
  traverse(node.right, state); // Right
}

// Template for BST validation/search
function navigate(node: TreeNode | null, value: number): TreeNode | null {
  if (!node) return null;
  
  if (value < node.value) {
    return navigate(node.left, value);
  } else if (value > node.value) {
    return navigate(node.right, value);
  }
  
  return node;
}
```

---

## Edge Cases to Test

1. **Empty tree** → Return null/false as appropriate
2. **Single node** → Should work as base case
3. **All nodes on one side** (skewed) → Works, but slower O(n)
4. **Duplicate values** → Specify: insert or ignore?
5. **Negative values** → Don't affect BST logic
6. **Very large tree** → Recursion stack depth issues?

Example voice-through:
> "For empty tree: return null/false immediately. Single node: is valid BST. Skewed: still correct, just O(n) instead of O(log n). Duplicates: problem specifies handling. Negative numbers don't affect BST property."

---

## When BST vs Other Structures

| Need | Structure | Why |
|---|---|---|
| Sorted order + O(log n) operations | BST | Maintains sorted invariant |
| Just "contains"? | Set | O(1), simpler |
| "All values in range"? | BST | Log n binary search on structure |
| "Get min/max"? | Heap or BST | Heap: O(1) get-min, BST: O(log n) |
| "Lowest common ancestor"? | BST | Use value comparisons efficiently |

---

## Complexity Always

BST problems usually have:
- **Search:** O(log n) average, O(n) worst
- **Insert:** O(log n) average, O(n) worst
- **Inorder traversal:** O(n) always
- **Space:** O(h) recursion depth

Always clarify:
> "Time: O(log n) assuming balanced BST. If skewed, O(n). Space: O(h) where h is height. For balanced, O(log n) space. For skewed, O(n)."

---

## Quick Reference: BST Problem Checklist

Before submitting:
- [ ] Understand which BST property I'm using
- [ ] Tested empty tree
- [ ] Tested single node
- [ ] Tested duplicate values
- [ ] Verified O(log n) doesn't assume balanced (if not mentioned)
- [ ] Used inorder for "sorted" problems
- [ ] Passed bounds correctly for validation
- [ ] Stated both average and worst-case complexity
- [ ] Explained why BST is better than alternatives

---

## Next Steps

1. Implement BST validation with bounds
2. Implement Kth smallest using inorder
3. Implement BST insertion recursively
4. Practice LCA with value comparisons
5. Compare: BST vs hash map for various operations
