# FAANG Binary Tree Problems Guide

This guide explains common binary tree interview problems and patterns. Master these concepts to excel in Google, Meta, Amazon, Apple, and Microsoft interviews.

## Why Binary Trees Matter

Binary trees appear in roughly 30% of FAANG interviews. They test:
- **Recursion and divide-and-conquer thinking**
- **Problem-solving under pressure** (many variations exist)
- **Pattern recognition** (level-order, in-order, DFS vs BFS)
- **Edge case handling** (empty trees, single nodes, skewed trees)

Research references:
- [Google Tech Dev Guide: Trees](https://techdevguide.withgoogle.com/)
- [LeetCode Binary Tree Tag](https://leetcode.com/tag/binary-tree/)

---

## Core Patterns

### Pattern 1: Level-Order Traversal (BFS)

**Interview signal:** The interviewer mentions "each level" or asks for output grouped by level.

**When to use:**
- "Return nodes level by level"
- "Find node at depth k"
- "Spiral traversal"
- Any problem about layers or levels

**Key insight:** Use a queue and track level boundaries.

```typescript
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  
  const result: number[][] = [];
  const queue: TreeNode[] = [root];
  let queueIndex = 0;
  
  while (queueIndex < queue.length) {
    // All elements currently in queue are one level
    const levelSize = queue.length - queueIndex;
    const levelValues: number[] = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue[queueIndex++];
      levelValues.push(node.value);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(levelValues);
  }
  
  return result;
}
```

**Complexity:**
- Time: O(n) — visit each node once
- Space: O(w) — w is maximum width of tree (level with most nodes)

**Edge cases:**
- Empty tree → return []
- Single node → return [[value]]
- Skewed tree (like linked list) → queue size stays at 1

---

### Pattern 2: In-Order Traversal (for BST Problems)

**Interview signal:** "Print in sorted order" or "In-order traversal"

**When to use:**
- BST validation
- BST to sorted array
- Finding kth smallest element
- Any problem needing sorted BST values

**Key insight:** Left → Root → Right gives sorted BST values.

```typescript
function inOrderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  
  function traverse(node: TreeNode | null) {
    if (!node) return;
    
    traverse(node.left);      // Left
    result.push(node.value);  // Root
    traverse(node.right);     // Right
  }
  
  traverse(root);
  return result;
}
```

**Complexity:**
- Time: O(n) — visit each node once
- Space: O(h) — h is height (recursion stack)

---

### Pattern 3: DFS Path Finding

**Interview signal:** "Find path" or "Find sum path" or "All paths"

**When to use:**
- Path sum problems
- Find root-to-leaf paths
- Check if path exists
- Backtracking on tree

**Key insight:** Carry state down; check at leaf nodes.

```typescript
function pathSum(root: TreeNode | null, targetSum: number): number[][] {
  const result: number[][] = [];
  
  function dfs(node: TreeNode | null, remainingSum: number, path: number[]) {
    if (!node) return;
    
    // Add current node to path
    path.push(node.value);
    remainingSum -= node.value;
    
    // Check if leaf node and sum matches
    if (!node.left && !node.right && remainingSum === 0) {
      result.push([...path]);
    }
    
    // Explore left and right
    dfs(node.left, remainingSum, path);
    dfs(node.right, remainingSum, path);
    
    // Backtrack
    path.pop();
  }
  
  dfs(root, targetSum, []);
  return result;
}
```

**Complexity:**
- Time: O(n) — visit all nodes (might collect multiple paths)
- Space: O(h) — recursion depth

---

## Interview Strategy for Tree Problems

### Step 1: Clarify the Problem
Ask your interviewer:
- "Is it a binary search tree or any binary tree?"
- "Can I modify the tree structure?"
- "What output format do you want?"
- "Are there space constraints?"

### Step 2: Identify the Pattern
Look for signals:
- **"Level" mentioned** → Level-order (BFS) / breadth-first
- **"Path" mentioned** → DFS / depth-first with state tracking
- **"Sorted" mentioned** → In-order traversal
- **"Parent/Child relationship" mentioned** → Consider parent pointers or memoization
- **"Lowest common ancestor"** → Two-pointer or recursion approach
- **"Connected"** → BFS/DFS with visited set

### Step 3: Choose Traversal
| Problem Type | Best Traversal | Reason |
|---|---|---|
| Level order output | BFS (queue) | Natural level grouping |
| Sum/count in path | DFS (recursion) | Carry state down |
| Sorted BST values | In-order | Produces sorted sequence |
| Closest value | DFS | Stop early when found |
| All solutions | DFS with backtrack | Explore all branches |

### Step 4: Code Clear Variable Names

```typescript
// ✅ GOOD - clear intent
function dfs(
  node: TreeNode | null,
  currentSum: number,
  targetSum: number,
  path: number[]
) { }

// ❌ BAD - unclear
function dfs(n: TreeNode | null, s: number, t: number, p: number[]) { }
```

---

## Common Edge Cases to Test

Always voice these during interview:

1. **Empty tree** → Single line: `if (!root) return ...`
2. **Single node** → Ensure it's returned, not treated as empty
3. **Skewed tree** → Left-only or right-only chain (tree is like a linked list)
4. **All same values** → Duplicates should not break logic
5. **Negative values** → Sign should not affect tree structure logic
6. **Very deep tree** → Recursion stack overflow? Consider iterative approach
7. **No valid answer** → Return empty array or null, not error

Example test voice-through:
> "Let me test with an empty tree: returns []. Single node: returns [[1]]. All left children chain: still returns levels correctly. Negative values: -1, -2, -3 don't affect the structure."

---

## Time & Space Complexity Always

End every tree problem with:
- **Time:** Always O(n) for visiting all nodes
- **Space:** Depends on storage (result array size) + recursion depth
- **Trade-off:** Can we trade space for time? (e.g., memoize subtree results)

Example complete answer:
> "Time: O(n) because we visit each node once. Space: O(n) because we store all nodes in the result array, plus O(h) for recursion where h is tree height. In worst case (skewed tree), O(h) = O(n)."

---

## Quick Reference: Tree Problem Checklist

Before submitting:
- [ ] Checked null/empty cases
- [ ] Tested single node
- [ ] Tested skewed tree (all left or all right)
- [ ] Stated time complexity (should be O(n))
- [ ] Stated space complexity
- [ ] Used clear variable names (not single letters)
- [ ] Explained pattern choice to interviewer
- [ ] Tested one example out loud with the interviewer

---

## Next Steps

1. Implement level-order traversal on practice examples
2. Implement path-finding DFS
3. Try combining patterns (e.g., level-order + path collection)
4. Study tree problem variants in your target company's list
5. Speak through one problem entirely out loud (complexity, edge cases, testing)
