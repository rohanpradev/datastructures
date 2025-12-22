import {
  BinarySearchTree,
  type TreeNode,
} from "@/data-structures/binary-search-tree/binary-search-tree";

/**
 * LeetCode Problem: Validate Binary Search Tree
 *
 * Problem Statement:
 * Given the root of a binary tree, determine if it is a valid binary search tree (BST).
 * A valid BST is defined as follows:
 * - The left subtree of a node contains only nodes with values less than the node's value
 * - The right subtree of a node contains only nodes with values greater than the node's value
 * - Both the left and right subtrees must also be binary search trees
 *
 * Why This Problem Matters:
 * - Tests understanding of BST properties
 * - Common in technical interviews
 * - Requires careful handling of constraints
 * - Multiple approaches (inorder traversal, range checking)
 *
 * Algorithm (Inorder Traversal Approach):
 * 1. Perform inorder traversal of the tree
 * 2. Check if values are in strictly increasing order
 * 3. If any value is <= previous value, tree is not a valid BST
 * 4. Return true if all values are in order
 *
 * Alternative Algorithm (Range Checking):
 * 1. Each node must satisfy: min < node.value < max
 * 2. Left child: range becomes (min, node.value)
 * 3. Right child: range becomes (node.value, max)
 * 4. Recursively check all nodes
 *
 * Time Complexity: O(n) - visit each node once
 * Space Complexity: O(n) - recursion stack (worst case) or array for inorder
 *
 * Visual Example:
 * ```
 * Valid BST:
 *      5
 *     / \
 *    3   7
 *   / \
 *  1   4
 * Inorder: [1, 3, 4, 5, 7] ✓ Increasing
 *
 * Invalid BST:
 *      5
 *     / \
 *    3   7
 *   / \
 *  1   6  <- 6 > 5 (violates BST property)
 * Inorder: [1, 3, 6, 5, 7] ✗ Not increasing
 * ```
 *
 * Edge Cases:
 * - Empty tree: Valid BST (return true)
 * - Single node: Valid BST
 * - Duplicate values: Invalid (we use strict inequality)
 * - All left children: Must still maintain order
 * - All right children: Must still maintain order
 *
 * Common Mistakes:
 * - Only comparing node with immediate children (doesn't check ancestors)
 * - Not handling null nodes correctly
 * - Allowing duplicate values
 * - Using local validation instead of global constraints
 *
 * Interview Tips:
 * - Ask about duplicate values (strict vs non-strict inequality)
 * - Discuss both approaches (inorder vs range)
 * - Mention space optimization with iterative inorder
 * - Consider integer overflow for range bounds
 *
 * @param root - Root node of the tree to validate
 * @returns true if valid BST, false otherwise
 *
 * @example
 * const bst = new BinarySearchTree<number>(5);
 * bst.insert(3).insert(7).insert(1).insert(4);
 * validateBST(bst.root); // true
 */
export function validateBST<T = number>(root: TreeNode<T> | null): boolean {
  // Empty tree is valid
  if (!root) return true;

  // Inorder traversal - should give sorted array
  const values: T[] = [];
  const inorder = (node: TreeNode<T> | null): void => {
    if (!node) return;
    inorder(node.left);
    values.push(node.value);
    inorder(node.right);
  };

  inorder(root);

  // Check if values are in strictly increasing order
  for (let i = 1; i < values.length; i++) {
    if (values[i]! <= values[i - 1]!) {
      return false;
    }
  }

  return true;
}

/**
 * LeetCode Problem: Maximum Depth of Binary Tree
 *
 * Problem Statement:
 * Given the root of a binary tree, return its maximum depth.
 * The maximum depth is the number of nodes along the longest path
 * from the root node down to the farthest leaf node.
 *
 * Why This Problem Matters:
 * - Fundamental tree recursion problem
 * - Tests understanding of tree height/depth
 * - Foundation for more complex tree problems
 * - Common interview question
 *
 * Algorithm (Recursive):
 * 1. Base case: null node has depth 0
 * 2. Recursively find depth of left subtree
 * 3. Recursively find depth of right subtree
 * 4. Return 1 + max(left depth, right depth)
 *
 * Alternative Algorithm (BFS/Level Order):
 * 1. Use queue for level-order traversal
 * 2. Count number of levels
 * 3. Return level count
 *
 * Time Complexity: O(n) - visit each node once
 * Space Complexity: O(h) - recursion stack where h is height
 *                  O(n) worst case for skewed tree
 *
 * Visual Example:
 * ```
 * Tree:
 *       3
 *      / \
 *     9  20
 *       /  \
 *      15   7
 *
 * Calculation:
 * maxDepth(3) = 1 + max(maxDepth(9), maxDepth(20))
 * maxDepth(9) = 1 (leaf)
 * maxDepth(20) = 1 + max(maxDepth(15), maxDepth(7)) = 2
 * Result: 1 + max(1, 2) = 3
 * ```
 *
 * Edge Cases:
 * - Empty tree (null root): Return 0
 * - Single node: Return 1
 * - Skewed tree (all left or all right): Return number of nodes
 * - Balanced tree: Return log(n) + 1
 *
 * Common Mistakes:
 * - Confusing depth with height (they're similar but measured differently)
 * - Off-by-one errors (forgetting to add 1 for current node)
 * - Not handling null children correctly
 *
 * Interview Tips:
 * - Discuss both recursive and iterative approaches
 * - Mention space complexity trade-offs
 * - Can extend to find minimum depth, diameter, etc.
 * - Good warm-up for harder tree problems
 *
 * @param root - Root node of the tree
 * @returns Maximum depth of the tree
 *
 * @example
 * const bst = new BinarySearchTree<number>(3);
 * bst.insert(9).insert(20).insert(15).insert(7);
 * maxDepth(bst.root); // 3
 */
export function maxDepth<T>(root: TreeNode<T> | null): number {
  // Base case: null node has depth 0
  if (!root) return 0;

  // Recursively find depth of left and right subtrees
  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);

  // Return 1 (current node) + max of subtree depths
  return 1 + Math.max(leftDepth, rightDepth);
}

/**
 * LeetCode Problem: Lowest Common Ancestor of BST
 *
 * Problem Statement:
 * Given a binary search tree, find the lowest common ancestor (LCA)
 * of two given nodes in the BST. The LCA is defined as the lowest node
 * that has both nodes as descendants (a node can be a descendant of itself).
 *
 * Why This Problem Matters:
 * - Leverages BST properties for efficient solution
 * - Tests understanding of tree traversal and BST structure
 * - Common interview problem with clear optimal solution
 * - Foundation for more complex tree algorithms
 *
 * Algorithm (BST-specific):
 * 1. Start at root
 * 2. If both nodes are smaller, LCA is in left subtree
 * 3. If both nodes are larger, LCA is in right subtree
 * 4. Otherwise, current node is the LCA (split point)
 *
 * Why This Works:
 * - BST property ensures all left descendants < node < right descendants
 * - LCA is the first node where paths to p and q diverge
 * - No need to search entire tree, can use BST ordering
 *
 * Time Complexity: O(h) - where h is height
 *                  O(log n) for balanced tree
 *                  O(n) for skewed tree
 * Space Complexity: O(1) iterative, O(h) recursive
 *
 * Visual Example:
 * ```
 * Tree:
 *         6
 *       /   \
 *      2     8
 *     / \   / \
 *    0   4 7   9
 *       / \
 *      3   5
 *
 * LCA(2, 8) = 6  (2 < 6 < 8, so 6 is split point)
 * LCA(2, 4) = 2  (2 is ancestor of 4)
 * LCA(3, 5) = 4  (both in left subtree of 6, in right of 2, split at 4)
 * ```
 *
 * Edge Cases:
 * - One node is ancestor of the other: Return the ancestor
 * - Both nodes are the same: Return that node
 * - Nodes not in tree: Undefined behavior (assume inputs are valid)
 * - Root is one of the nodes: Root is the LCA
 *
 * Common Mistakes:
 * - Treating it like a general binary tree (not using BST property)
 * - Not handling case where one node is ancestor of other
 * - Incorrect inequality checks (using > instead of >=)
 * - Forgetting that node can be its own ancestor
 *
 * Interview Tips:
 * - Emphasize that this leverages BST property
 * - Contrast with general binary tree LCA (more complex)
 * - Mention iterative solution is cleaner than recursive
 * - Discuss how to handle invalid inputs
 *
 * @param root - Root of the BST
 * @param p - First node value
 * @param q - Second node value
 * @returns The value of the lowest common ancestor
 *
 * @example
 * const bst = new BinarySearchTree<number>(6);
 * [2, 8, 0, 4, 7, 9, 3, 5].forEach(v => bst.insert(v));
 * lowestCommonAncestor(bst.root, 2, 8); // 6
 * lowestCommonAncestor(bst.root, 2, 4); // 2
 */
export function lowestCommonAncestor<T>(
  root: TreeNode<T> | null,
  p: T,
  q: T,
): T | null {
  if (!root) return null;

  let current: TreeNode<T> | null = root;

  while (current) {
    // Both nodes in left subtree
    if (p < current.value && q < current.value) {
      current = current.left;
    }
    // Both nodes in right subtree
    else if (p > current.value && q > current.value) {
      current = current.right;
    }
    // Found split point - this is the LCA
    else {
      return current.value;
    }
  }

  return null;
}

/**
 * LeetCode Problem: Invert Binary Tree
 *
 * Problem Statement:
 * Given the root of a binary tree, invert the tree (flip it horizontally),
 * and return its root. Inverting means swapping the left and right children
 * of all nodes in the tree.
 *
 * Why This Problem Matters:
 * - Classic tree manipulation problem
 * - Tests understanding of recursion and tree structure
 * - Simple yet elegant solution
 * - Famously asked by Google (Max Howell incident)
 *
 * Algorithm (Recursive):
 * 1. Base case: null node returns null
 * 2. Swap left and right children of current node
 * 3. Recursively invert left subtree
 * 4. Recursively invert right subtree
 * 5. Return root
 *
 * Alternative Algorithm (BFS):
 * 1. Use queue for level-order traversal
 * 2. For each node, swap its children
 * 3. Add children to queue
 * 4. Continue until queue is empty
 *
 * Time Complexity: O(n) - visit each node once
 * Space Complexity: O(h) - recursion stack where h is height
 *                  O(n) worst case for skewed tree
 *
 * Visual Example:
 * ```
 * Original:           Inverted:
 *       4                 4
 *      / \               / \
 *     2   7             7   2
 *    / \ / \           / \ / \
 *   1  3 6  9         9  6 3  1
 *
 * Process:
 * 1. Swap 2 and 7 at root
 * 2. Recursively invert subtree rooted at 7 (was 2)
 * 3. Recursively invert subtree rooted at 2 (was 7)
 * ```
 *
 * Edge Cases:
 * - Empty tree (null root): Return null
 * - Single node: Return same node (no children to swap)
 * - Tree with only left children: Becomes tree with only right children
 * - Tree with only right children: Becomes tree with only left children
 * - Symmetric tree: Returns identical structure (but still swapped)
 *
 * Common Mistakes:
 * - Forgetting to return the root
 * - Modifying tree during traversal incorrectly
 * - Not handling null children properly
 * - Creating new nodes instead of swapping pointers
 *
 * Interview Tips:
 * - Discuss both recursive and iterative approaches
 * - Mention this is also called "mirror" operation
 * - Can be done in-place (no extra tree needed)
 * - Good example of simple recursion on trees
 *
 * @param root - Root node of the tree to invert
 * @returns The root of the inverted tree
 *
 * @example
 * const bst = new BinarySearchTree<number>(4);
 * bst.insert(2).insert(7).insert(1).insert(3);
 * invertTree(bst.root);
 * // Tree is now mirrored
 */
export function invertTree<T>(root: TreeNode<T> | null): TreeNode<T> | null {
  // Base case
  if (!root) return null;

  // Swap left and right children
  const temp = root.left;
  root.left = root.right;
  root.right = temp;

  // Recursively invert subtrees
  invertTree(root.left);
  invertTree(root.right);

  return root;
}

/**
 * LeetCode Problem: Symmetric Tree
 *
 * Problem Statement:
 * Given the root of a binary tree, check whether it is a mirror of itself
 * (i.e., symmetric around its center). A tree is symmetric if the left subtree
 * is a mirror reflection of the right subtree.
 *
 * Why This Problem Matters:
 * - Tests understanding of tree comparison and recursion
 * - Requires thinking about multiple nodes simultaneously
 * - Common interview problem with elegant recursive solution
 * - Foundation for more complex tree comparison problems
 *
 * Algorithm (Recursive):
 * 1. Helper function to check if two trees are mirrors
 * 2. Two trees are mirrors if:
 *    a. Both are null: true
 *    b. One is null: false
 *    c. Values are different: false
 *    d. Left of first mirrors right of second AND right of first mirrors left of second
 * 3. Call helper on root's left and right children
 *
 * Alternative Algorithm (BFS):
 * 1. Use queue with pairs of nodes to compare
 * 2. Add (left.left, right.right) and (left.right, right.left) to queue
 * 3. Check each pair for equality
 * 4. Return true if all pairs match
 *
 * Time Complexity: O(n) - visit each node once
 * Space Complexity: O(h) - recursion stack where h is height
 *                  O(n) worst case for skewed tree
 *
 * Visual Example:
 * ```
 * Symmetric Tree:
 *       1
 *      / \
 *     2   2
 *    / \ / \
 *   3  4 4  3
 * Check: left.left (3) == right.right (3) ✓
 *        left.right (4) == right.left (4) ✓
 *
 * Not Symmetric:
 *       1
 *      / \
 *     2   2
 *      \   \
 *      3    3
 * Check: left.left (null) != right.right (3) ✗
 * ```
 *
 * Edge Cases:
 * - Empty tree: Symmetric (return true)
 * - Single node: Symmetric (return true)
 * - Two nodes: Symmetric only if both children equal
 * - All same values but asymmetric structure: Not symmetric
 *
 * Common Mistakes:
 * - Comparing left.left with right.left (should be right.right)
 * - Not checking null cases properly
 * - Comparing values but not structure
 * - Forgetting to check both child pairs
 *
 * Interview Tips:
 * - Discuss both recursive and iterative approaches
 * - Mention similarity to "Same Tree" problem
 * - Can optimize with early termination
 * - Good example of comparing multiple subtrees simultaneously
 *
 * @param root - Root node of the tree to check
 * @returns true if tree is symmetric, false otherwise
 *
 * @example
 * const tree = new BinarySearchTree<number>(1);
 * tree.root.left = new TreeNode(2);
 * tree.root.right = new TreeNode(2);
 * isSymmetric(tree.root); // true
 */
export function isSymmetric<T>(root: TreeNode<T> | null): boolean {
  if (!root) return true;

  // Helper function to check if two trees are mirrors
  const isMirror = (
    left: TreeNode<T> | null,
    right: TreeNode<T> | null,
  ): boolean => {
    // Both null - symmetric
    if (!left && !right) return true;

    // One null - not symmetric
    if (!left || !right) return false;

    // Check value equality and recursive mirror property
    return (
      left.value === right.value &&
      isMirror(left.left, right.right) &&
      isMirror(left.right, right.left)
    );
  };

  return isMirror(root.left, root.right);
}

/**
 * LeetCode Problem: Path Sum
 *
 * Problem Statement:
 * Given the root of a binary tree and an integer targetSum, return true if
 * the tree has a root-to-leaf path such that adding up all the values along
 * the path equals targetSum. A leaf is a node with no children.
 *
 * Why This Problem Matters:
 * - Tests understanding of tree traversal with state
 * - Requires backtracking concept
 * - Common pattern in many tree problems
 * - Foundation for more complex path problems
 *
 * Algorithm (Recursive):
 * 1. Base case: null node returns false
 * 2. If leaf node, check if value equals remaining sum
 * 3. Subtract current value from target
 * 4. Recursively check left OR right subtree with reduced sum
 * 5. Return true if either path finds the sum
 *
 * Time Complexity: O(n) - might visit all nodes in worst case
 * Space Complexity: O(h) - recursion stack where h is height
 *
 * Visual Example:
 * ```
 * Tree:          Target: 22
 *       5
 *      / \
 *     4   8
 *    /   / \
 *   11  13  4
 *  /  \      \
 * 7    2      1
 *
 * Path: 5 -> 4 -> 11 -> 2 = 22 ✓
 * Other paths don't sum to 22
 * ```
 *
 * Edge Cases:
 * - Empty tree: false
 * - Single node: check if value equals target
 * - Negative values: Still works with subtraction
 * - Multiple valid paths: Return true after finding first
 * - No valid paths: Return false
 *
 * Common Mistakes:
 * - Not checking if node is a leaf
 * - Counting internal nodes as valid end points
 * - Not handling negative values correctly
 * - Forgetting to subtract current node's value
 *
 * Interview Tips:
 * - Discuss extension to return all valid paths
 * - Mention handling of negative values
 * - Can optimize with early termination for certain cases
 * - Related to "Path Sum II" which returns all paths
 *
 * @param root - Root node of the tree
 * @param targetSum - Target sum to find
 * @returns true if a root-to-leaf path with the target sum exists
 *
 * @example
 * const bst = new BinarySearchTree<number>(5);
 * bst.insert(4).insert(8).insert(11).insert(13);
 * hasPathSum(bst.root, 20); // true (5 -> 4 -> 11)
 */
export function hasPathSum<T extends number>(
  root: TreeNode<T> | null,
  targetSum: number,
): boolean {
  // Empty tree
  if (!root) return false;

  // Leaf node - check if value equals remaining sum
  if (!root.left && !root.right) {
    return root.value === targetSum;
  }

  // Recursively check left and right subtrees with reduced sum
  const remainingSum = targetSum - root.value;
  return (
    hasPathSum(root.left, remainingSum) || hasPathSum(root.right, remainingSum)
  );
}

/**
 * LeetCode Problem: Kth Smallest Element in BST
 *
 * Problem Statement:
 * Given the root of a binary search tree and an integer k, return the kth
 * smallest element in the tree (1-indexed). The kth smallest means the kth
 * element in the sorted order of all values in the tree.
 *
 * Why This Problem Matters:
 * - Leverages BST property (inorder traversal gives sorted order)
 * - Tests understanding of traversal and early termination
 * - Common interview question
 * - Multiple approaches with different trade-offs
 *
 * Algorithm (Inorder Traversal):
 * 1. Perform inorder traversal (left -> root -> right)
 * 2. Keep counter of nodes visited
 * 3. Return value of kth node visited
 * 4. Can optimize with early termination
 *
 * Alternative Algorithm (Augmented Tree):
 * - Store size of left subtree in each node
 * - Can find kth element in O(h) time
 * - Requires modification of tree structure
 *
 * Time Complexity: O(k) with early termination
 *                  O(n) worst case if k = n
 * Space Complexity: O(h) - recursion stack
 *
 * Visual Example:
 * ```
 * Tree:
 *       5
 *      / \
 *     3   6
 *    / \
 *   2   4
 *  /
 * 1
 *
 * Inorder: [1, 2, 3, 4, 5, 6]
 * k = 3 -> return 3 (3rd smallest)
 * k = 5 -> return 5 (5th smallest)
 * ```
 *
 * Edge Cases:
 * - k = 1: Return minimum element
 * - k = n (tree size): Return maximum element
 * - k > n: Undefined (assume valid k in constraints)
 * - Single node tree: k must be 1
 *
 * Common Mistakes:
 * - Not using BST property (treating as regular binary tree)
 * - Off-by-one errors with k indexing
 * - Not optimizing with early termination
 * - Forgetting that inorder gives sorted sequence
 *
 * Interview Tips:
 * - Mention follow-up: what if BST is modified often?
 * - Discuss augmented tree approach for frequent queries
 * - Can extend to find kth largest (reverse inorder)
 * - Emphasize leveraging BST property
 *
 * @param root - Root of the BST
 * @param k - The kth position (1-indexed)
 * @returns The kth smallest element, or null if k is invalid
 *
 * @example
 * const bst = new BinarySearchTree<number>(5);
 * bst.insert(3).insert(6).insert(2).insert(4).insert(1);
 * kthSmallest(bst.root, 3); // 3
 */
export function kthSmallest<T>(root: TreeNode<T> | null, k: number): T | null {
  if (!root) return null;

  let count = 0;
  let result: T | null = null;

  const inorder = (node: TreeNode<T> | null): void => {
    if (!node || result !== null) return;

    // Traverse left
    inorder(node.left);

    // Visit node
    count++;
    if (count === k) {
      result = node.value;
      return;
    }

    // Traverse right
    inorder(node.right);
  };

  inorder(root);
  return result;
}

/**
 * LeetCode-Style Problem: Closest Value in a Binary Tree
 *
 * Problem Statement:
 * Given the root of a binary tree and a target number `k`, return the value
 * in the tree that is closest to `k`.
 *
 * If two values are equally close, returning either is acceptable.
 *
 * Why This Problem Matters:
 * - Tests tree traversal (DFS / BFS)
 * - Reinforces absolute difference comparisons
 * - Highlights careful variable meaning (value vs distance)
 * - Common interview and coding challenge
 *
 * Algorithm (Depth-First Search using Stack):
 * 1. Start with the root node
 * 2. Traverse every node using a stack (DFS)
 * 3. For each node:
 *    - Compare its distance to `k` with the current closest value
 *    - Update closest if the current node is nearer
 * 4. Return the closest value found
 *
 * Note:
 * - This solution works for ANY binary tree
 * - If the tree were a BST, this could be optimized to O(h)
 *
 * Time Complexity:
 * - O(n), where n is the number of nodes
 *
 * Space Complexity:
 * - O(n) in the worst case (stack for DFS)
 *
 * Visual Example:
 * ```
 * Tree:
 *       10
 *      /  \
 *     5    15
 *    / \     \
 *   2   7     20
 *
 * k = 9
 * Closest value = 10
 * ```
 *
 * Edge Cases:
 * - Empty tree → return null
 * - Single-node tree → return that node’s value
 * - Exact match → return immediately (still valid without optimization)
 *
 * Common Mistakes:
 * - Mixing up "closest value" with "closest distance"
 * - Comparing against Infinity incorrectly
 * - Forgetting to traverse all nodes
 *
 * Interview Tips:
 * - Clarify whether the tree is a BST
 * - Mention possible optimization using BST property
 * - Explain difference between tracking value vs distance
 *
 * @param root - Root of the binary tree
 * @param k - Target value to compare against
 * @returns The value closest to `k`, or null if the tree is empty
 *
 * @example
 * closestValue(root, 12); // returns the value closest to 12 in the tree
 */
export function closestValue(
  root: TreeNode<number> | null,
  k: number,
): number | null {
  if (!root) return null;

  let closest = root.value;
  let current: TreeNode<number> | null = root;

  while (current) {
    // Update closest if current node is nearer to k
    if (Math.abs(current.value - k) < Math.abs(closest - k)) {
      closest = current.value;
    }

    // Move left or right using BST property
    if (k < current.value) {
      current = current.left;
    } else if (k > current.value) {
      current = current.right;
    } else {
      // Exact match
      return current.value;
    }
  }

  return closest;
}

/**
 * Represents a binary tree node.
 * Assumes the TreeNode shape is:
 * {
 *   value: number;
 *   left: TreeNode<number> | null;
 *   right: TreeNode<number> | null;
 * }
 */

/**
 * Computes the sum of values for every root-to-leaf branch in a binary tree.
 *
 * @param root - The root node of the binary tree
 * @returns An array containing the sum of each branch
 */
export function branchSum(root: TreeNode<number> | null): number[] {
  const sums: number[] = [];
  calculateBranchSums(root, 0, sums);
  return sums;
}

/**
 * Recursively traverses the tree and accumulates branch sums.
 *
 * @param node - The current tree node
 * @param runningSum - The sum accumulated from the root to the parent node
 * @param sums - Array collecting all completed branch sums
 */
function calculateBranchSums(
  node: TreeNode<number> | null,
  runningSum: number,
  sums: number[],
): void {
  // Base case: reached past a leaf
  if (node === null) return;

  // Add current node's value to the running sum
  const newRunningSum = runningSum + node.value;

  // If this is a leaf node, store the branch sum
  if (node.left === null && node.right === null) {
    sums.push(newRunningSum);
    return;
  }

  // Recurse on left and right subtrees
  calculateBranchSums(node.left, newRunningSum, sums);
  calculateBranchSums(node.right, newRunningSum, sums);
}

/**
 * Calculates the sum of depths of all nodes in a binary tree using recursion.
 *
 * The depth of the root node is `0`.
 * Each child node increases depth by `1`.
 *
 * This function performs a **recursive depth-first traversal**,
 * accumulating the depth of each node as it visits it.
 *
 * Time Complexity: O(n)
 *   - Every node in the tree is visited exactly once.
 *
 * Space Complexity: O(h)
 *   - Where `h` is the height of the tree (call stack usage).
 *
 * @param root - The current node in the binary tree (or null)
 * @param depth - The depth of the current node (defaults to 0 for root)
 * @returns The sum of depths for all nodes in the subtree
 */
export function nodeDepth(root: TreeNode<number> | null, depth = 0): number {
  // Base case: empty node contributes 0 to depth sum
  if (root === null) {
    return 0;
  }

  // Sum of:
  // 1. Current node's depth
  // 2. Depths from left subtree
  // 3. Depths from right subtree
  return (
    depth + nodeDepth(root.left, depth + 1) + nodeDepth(root.right, depth + 1)
  );
}

/**
 * Evaluates a binary expression tree.
 *
 * Leaf nodes contain non-negative numbers and have no children.
 * Internal nodes contain negative numbers representing operators:
 *  - -1 → addition (+)
 *  - -2 → subtraction (-)
 *  - -3 → integer division (floored)
 *  - -4 → multiplication (*)
 *
 * @param tree - The root node of the expression tree
 * @returns The numeric result of evaluating the expression
 * @throws Error if an operator node is missing children
 */
export function evaluateExpressionTree(tree: TreeNode<number>): number {
  // Base case: leaf node (operand)
  if (tree.value >= 0) {
    return tree.value;
  }

  // Validate children exist for operator nodes
  if (tree.left === null || tree.right === null) {
    throw new Error("Operator node must have both left and right children");
  }

  // Recursively evaluate subtrees
  const leftValue = evaluateExpressionTree(tree.left);
  const rightValue = evaluateExpressionTree(tree.right);

  // Apply operator based on node value
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
