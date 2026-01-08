import { describe, expect, test } from "bun:test";
import {
  BinarySearchTree,
  TreeNode,
} from "@/data-structures/binary-search-tree/binary-search-tree";
import {
  hasPathSum,
  invertTree,
  isSymmetric,
  kthSmallest,
  lowestCommonAncestor,
  maxDepth,
  validateBST,
  closestValue,
  branchSum,
  nodeDepth,
  evaluateExpressionTree,
  kthLargest,
  reconstructBST,
  diameterBST,
  findSuccessor,
  heightBalancedBinaryTree,
  mergeBinaryTrees,
} from "@/data-structures/binary-search-tree/problems/leetcode-bst";

describe("validateBST", () => {
  test("should return true for empty tree", () => {
    expect(validateBST(null)).toBe(true);
  });

  test("should return true for single node", () => {
    const bst = new BinarySearchTree<number>(5);
    expect(validateBST(bst.root)).toBe(true);
  });

  test("should return true for valid BST", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(3).insert(7).insert(1).insert(4).insert(6).insert(9);
    expect(validateBST(bst.root)).toBe(true);
  });

  test("should return false for invalid BST - right child smaller than ancestor", () => {
    const root = new TreeNode(5);
    root.left = new TreeNode(3);
    root.right = new TreeNode(7);
    root.right.left = new TreeNode(6);
    root.right.right = new TreeNode(4); // Invalid: 4 < 5
    expect(validateBST(root)).toBe(false);
  });

  test("should return false for invalid BST - left child larger than ancestor", () => {
    const root = new TreeNode(5);
    root.left = new TreeNode(3);
    root.right = new TreeNode(7);
    root.left.left = new TreeNode(1);
    root.left.right = new TreeNode(6); // Invalid: 6 > 5
    expect(validateBST(root)).toBe(false);
  });

  test("should return false for duplicate values", () => {
    const root = new TreeNode(5);
    root.left = new TreeNode(5); // Duplicate
    expect(validateBST(root)).toBe(false);
  });

  test("should handle tree with only left children", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(4).insert(3).insert(2).insert(1);
    expect(validateBST(bst.root)).toBe(true);
  });

  test("should handle tree with only right children", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(6).insert(7).insert(8).insert(9);
    expect(validateBST(bst.root)).toBe(true);
  });

  test("should validate complex valid BST", () => {
    const bst = new BinarySearchTree<number>(50);
    [30, 70, 20, 40, 60, 80, 10, 25, 35, 45].forEach((v) => bst.insert(v));
    expect(validateBST(bst.root)).toBe(true);
  });

  test("should handle negative numbers", () => {
    const bst = new BinarySearchTree<number>(0);
    bst.insert(-10).insert(10).insert(-5).insert(5);
    expect(validateBST(bst.root)).toBe(true);
  });
});

describe("maxDepth", () => {
  test("should return 0 for empty tree", () => {
    expect(maxDepth(null)).toBe(0);
  });

  test("should return 1 for single node", () => {
    const bst = new BinarySearchTree<number>(5);
    expect(maxDepth(bst.root)).toBe(1);
  });

  test("should return 2 for tree with two levels", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(3).insert(7);
    expect(maxDepth(bst.root)).toBe(2);
  });

  test("should calculate depth for balanced tree", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(3).insert(7).insert(1).insert(4).insert(6).insert(9);
    expect(maxDepth(bst.root)).toBe(3);
  });

  test("should calculate depth for left-skewed tree", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(4).insert(3).insert(2).insert(1);
    expect(maxDepth(bst.root)).toBe(5);
  });

  test("should calculate depth for right-skewed tree", () => {
    const bst = new BinarySearchTree<number>(1);
    bst.insert(2).insert(3).insert(4).insert(5);
    expect(maxDepth(bst.root)).toBe(5);
  });

  test("should handle complex unbalanced tree", () => {
    const bst = new BinarySearchTree<number>(50);
    bst.insert(30).insert(70).insert(20).insert(40).insert(10);
    // Depth depends on longest path
    const depth = maxDepth(bst.root);
    expect(depth).toBeGreaterThan(0);
  });

  test("should work with manually created tree", () => {
    const root = new TreeNode(3);
    root.left = new TreeNode(9);
    root.right = new TreeNode(20);
    root.right.left = new TreeNode(15);
    root.right.right = new TreeNode(7);
    expect(maxDepth(root)).toBe(3);
  });
});

describe("lowestCommonAncestor", () => {
  test("should return null for empty tree", () => {
    expect(lowestCommonAncestor(null, 2, 8)).toBeNull();
  });

  test("should return node value when both nodes are in different subtrees", () => {
    const bst = new BinarySearchTree<number>(6);
    bst.insert(2).insert(8).insert(0).insert(4).insert(7).insert(9);
    expect(lowestCommonAncestor(bst.root, 2, 8)).toBe(6);
  });

  test("should return ancestor when one node is ancestor of other", () => {
    const bst = new BinarySearchTree<number>(6);
    bst.insert(2).insert(8).insert(0).insert(4).insert(7).insert(9);
    expect(lowestCommonAncestor(bst.root, 2, 4)).toBe(2);
  });

  test("should handle both nodes in left subtree", () => {
    const bst = new BinarySearchTree<number>(6);
    bst.insert(2).insert(8).insert(0).insert(4).insert(3).insert(5);
    expect(lowestCommonAncestor(bst.root, 3, 5)).toBe(4);
  });

  test("should handle both nodes in right subtree", () => {
    const bst = new BinarySearchTree<number>(6);
    bst.insert(2).insert(8).insert(0).insert(4).insert(7).insert(9);
    expect(lowestCommonAncestor(bst.root, 7, 9)).toBe(8);
  });

  test("should return root when root is one of the nodes", () => {
    const bst = new BinarySearchTree<number>(6);
    bst.insert(2).insert(8);
    expect(lowestCommonAncestor(bst.root, 6, 8)).toBe(6);
  });

  test("should handle same node (node as its own ancestor)", () => {
    const bst = new BinarySearchTree<number>(6);
    bst.insert(2).insert(8);
    expect(lowestCommonAncestor(bst.root, 2, 2)).toBe(2);
  });

  test("should work with complex tree", () => {
    const bst = new BinarySearchTree<number>(20);
    [10, 30, 5, 15, 25, 35, 3, 7, 12, 18].forEach((v) => bst.insert(v));
    expect(lowestCommonAncestor(bst.root, 7, 18)).toBe(10);
    expect(lowestCommonAncestor(bst.root, 3, 12)).toBe(10);
    expect(lowestCommonAncestor(bst.root, 25, 35)).toBe(30);
  });
});

describe("invertTree", () => {
  test("should return null for empty tree", () => {
    expect(invertTree(null)).toBeNull();
  });

  test("should return same node for single node", () => {
    const bst = new BinarySearchTree<number>(5);
    const result = invertTree(bst.root);
    expect(result?.value).toBe(5);
    expect(result?.left).toBeNull();
    expect(result?.right).toBeNull();
  });

  test("should invert tree with two children", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(3).insert(7);
    invertTree(bst.root);
    expect(bst.root?.left?.value).toBe(7);
    expect(bst.root?.right?.value).toBe(3);
  });

  test("should invert balanced tree", () => {
    const bst = new BinarySearchTree<number>(4);
    bst.insert(2).insert(7).insert(1).insert(3).insert(6).insert(9);
    invertTree(bst.root);
    // After inversion: left and right subtrees should be swapped
    expect(bst.root?.left?.value).toBe(7);
    expect(bst.root?.right?.value).toBe(2);
    expect(bst.root?.left?.left?.value).toBe(9);
    expect(bst.root?.left?.right?.value).toBe(6);
  });

  test("should invert tree with only left children", () => {
    const root = new TreeNode(5);
    root.left = new TreeNode(3);
    root.left.left = new TreeNode(1);
    invertTree(root);
    // Should become tree with only right children
    expect(root.right?.value).toBe(3);
    expect(root.right?.right?.value).toBe(1);
    expect(root.left).toBeNull();
  });

  test("should invert tree with only right children", () => {
    const root = new TreeNode(5);
    root.right = new TreeNode(7);
    root.right.right = new TreeNode(9);
    invertTree(root);
    // Should become tree with only left children
    expect(root.left?.value).toBe(7);
    expect(root.left?.left?.value).toBe(9);
    expect(root.right).toBeNull();
  });

  test("should handle symmetric tree (becomes itself)", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(2);
    root.left.left = new TreeNode(3);
    root.left.right = new TreeNode(4);
    root.right.left = new TreeNode(4);
    root.right.right = new TreeNode(3);
    invertTree(root);
    // Structure should be same (but swapped)
    expect(root.left?.value).toBe(2);
    expect(root.right?.value).toBe(2);
  });

  test("should invert complex tree", () => {
    const bst = new BinarySearchTree<number>(10);
    [5, 15, 3, 7, 12, 18].forEach((v) => bst.insert(v));
    const originalLeft = bst.root?.left?.value;
    const originalRight = bst.root?.right?.value;
    invertTree(bst.root);
    expect(bst.root?.right?.value).toBe(originalLeft);
    expect(bst.root?.left?.value).toBe(originalRight);
  });
});

describe("isSymmetric", () => {
  test("should return true for empty tree", () => {
    expect(isSymmetric(null)).toBe(true);
  });

  test("should return true for single node", () => {
    const bst = new BinarySearchTree<number>(1);
    expect(isSymmetric(bst.root)).toBe(true);
  });

  test("should return true for symmetric tree with two children", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(2);
    expect(isSymmetric(root)).toBe(true);
  });

  test("should return false for asymmetric tree with two children", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    expect(isSymmetric(root)).toBe(false);
  });

  test("should return true for symmetric tree with multiple levels", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(2);
    root.left.left = new TreeNode(3);
    root.left.right = new TreeNode(4);
    root.right.left = new TreeNode(4);
    root.right.right = new TreeNode(3);
    expect(isSymmetric(root)).toBe(true);
  });

  test("should return false when structure is asymmetric", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(2);
    root.left.right = new TreeNode(3);
    root.right.right = new TreeNode(3);
    expect(isSymmetric(root)).toBe(false);
  });

  test("should return false when values differ", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(2);
    root.left.left = new TreeNode(3);
    root.right.right = new TreeNode(4); // Different value
    expect(isSymmetric(root)).toBe(false);
  });

  test("should handle tree with only one child", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    expect(isSymmetric(root)).toBe(false);
  });

  test("should handle complex symmetric tree", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(2);
    root.left.left = new TreeNode(3);
    root.left.right = new TreeNode(4);
    root.left.left.left = new TreeNode(5);
    root.right.right = new TreeNode(3);
    root.right.left = new TreeNode(4);
    root.right.right.right = new TreeNode(5);
    expect(isSymmetric(root)).toBe(true);
  });

  test("should return false for BST (BSTs are typically not symmetric)", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(3).insert(7).insert(1).insert(4).insert(6).insert(9);
    // BST structure is not symmetric by design
    expect(isSymmetric(bst.root)).toBe(false);
  });
});

describe("hasPathSum", () => {
  test("should return false for empty tree", () => {
    expect(hasPathSum(null, 0)).toBe(false);
  });

  test("should return true for single node matching target", () => {
    const bst = new BinarySearchTree<number>(5);
    expect(hasPathSum(bst.root, 5)).toBe(true);
  });

  test("should return false for single node not matching target", () => {
    const bst = new BinarySearchTree<number>(5);
    expect(hasPathSum(bst.root, 10)).toBe(false);
  });

  test("should find path sum in left subtree", () => {
    const root = new TreeNode(5);
    root.left = new TreeNode(4);
    root.right = new TreeNode(8);
    root.left.left = new TreeNode(11);
    root.left.left.left = new TreeNode(7);
    root.left.left.right = new TreeNode(2);
    // Path: 5 -> 4 -> 11 -> 2 = 22
    expect(hasPathSum(root, 22)).toBe(true);
  });

  test("should find path sum in right subtree", () => {
    const root = new TreeNode(5);
    root.left = new TreeNode(4);
    root.right = new TreeNode(8);
    root.right.left = new TreeNode(13);
    root.right.right = new TreeNode(4);
    // Path: 5 -> 8 -> 13 = 26
    expect(hasPathSum(root, 26)).toBe(true);
  });

  test("should return false when no path matches", () => {
    const root = new TreeNode(5);
    root.left = new TreeNode(4);
    root.right = new TreeNode(8);
    root.left.left = new TreeNode(11);
    expect(hasPathSum(root, 100)).toBe(false);
  });

  test("should not count partial paths (must reach leaf)", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    // Path 1 -> 2 exists but 1 alone is not a valid path (not a leaf)
    expect(hasPathSum(root, 1)).toBe(false);
    expect(hasPathSum(root, 3)).toBe(true);
  });

  test("should handle negative numbers", () => {
    const root = new TreeNode(5);
    root.left = new TreeNode(-3);
    root.right = new TreeNode(8);
    root.left.left = new TreeNode(2);
    // Path: 5 -> -3 -> 2 = 4
    expect(hasPathSum(root, 4)).toBe(true);
  });

  test("should handle zero target sum", () => {
    const root = new TreeNode(-2);
    root.right = new TreeNode(2);
    // Path: -2 -> 2 = 0
    expect(hasPathSum(root, 0)).toBe(true);
  });

  test("should work with BST structure", () => {
    const bst = new BinarySearchTree<number>(10);
    bst.insert(5).insert(15).insert(3).insert(7).insert(18);
    // Path: 10 -> 5 -> 7 = 22
    expect(hasPathSum(bst.root, 22)).toBe(true);
    // Path: 10 -> 15 -> 18 = 43
    expect(hasPathSum(bst.root, 43)).toBe(true);
  });

  test("should handle tree with multiple valid paths", () => {
    const root = new TreeNode(5);
    root.left = new TreeNode(3);
    root.right = new TreeNode(2);
    // Both paths sum to 8
    expect(hasPathSum(root, 8)).toBe(true);
    expect(hasPathSum(root, 7)).toBe(true);
  });
});

describe("kthSmallest", () => {
  test("should return null for empty tree", () => {
    expect(kthSmallest(null, 1)).toBeNull();
  });

  test("should return root for single node and k=1", () => {
    const bst = new BinarySearchTree<number>(5);
    expect(kthSmallest(bst.root, 1)).toBe(5);
  });

  test("should find 1st smallest (minimum)", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(3).insert(7).insert(1).insert(4).insert(6).insert(9);
    expect(kthSmallest(bst.root, 1)).toBe(1);
  });

  test("should find 2nd smallest", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(3).insert(7).insert(1).insert(4).insert(6).insert(9);
    expect(kthSmallest(bst.root, 2)).toBe(3);
  });

  test("should find middle element", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(3).insert(7).insert(1).insert(4).insert(6).insert(9);
    // Sorted: [1, 3, 4, 5, 6, 7, 9]
    expect(kthSmallest(bst.root, 4)).toBe(5);
  });

  test("should find last element (maximum)", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(3).insert(7).insert(1).insert(4).insert(6).insert(9);
    // Sorted: [1, 3, 4, 5, 6, 7, 9]
    expect(kthSmallest(bst.root, 7)).toBe(9);
  });

  test("should work with left-skewed tree", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(4).insert(3).insert(2).insert(1);
    // Sorted: [1, 2, 3, 4, 5]
    expect(kthSmallest(bst.root, 3)).toBe(3);
  });

  test("should work with right-skewed tree", () => {
    const bst = new BinarySearchTree<number>(1);
    bst.insert(2).insert(3).insert(4).insert(5);
    // Sorted: [1, 2, 3, 4, 5]
    expect(kthSmallest(bst.root, 3)).toBe(3);
  });

  test("should handle tree with negative numbers", () => {
    const bst = new BinarySearchTree<number>(0);
    bst.insert(-5).insert(5).insert(-3).insert(3);
    // Sorted: [-5, -3, 0, 3, 5]
    expect(kthSmallest(bst.root, 2)).toBe(-3);
    expect(kthSmallest(bst.root, 4)).toBe(3);
  });

  test("should work with complex tree", () => {
    const bst = new BinarySearchTree<number>(20);
    [10, 30, 5, 15, 25, 35, 3, 7, 12, 18].forEach((v) => bst.insert(v));
    // Sorted: [3, 5, 7, 10, 12, 15, 18, 20, 25, 30, 35]
    expect(kthSmallest(bst.root, 1)).toBe(3);
    expect(kthSmallest(bst.root, 5)).toBe(12);
    expect(kthSmallest(bst.root, 11)).toBe(35);
  });

  test("should handle k at boundaries", () => {
    const bst = new BinarySearchTree<number>(50);
    [30, 70].forEach((v) => bst.insert(v));
    // Sorted: [30, 50, 70]
    expect(kthSmallest(bst.root, 1)).toBe(30);
    expect(kthSmallest(bst.root, 3)).toBe(70);
  });
});

describe("LeetCode BST Problems - Integration", () => {
  test("should combine multiple operations on same tree", () => {
    const bst = new BinarySearchTree<number>(10);
    [5, 15, 3, 7, 12, 18, 1, 6, 8].forEach((v) => bst.insert(v));

    // Validate it's a BST
    expect(validateBST(bst.root)).toBe(true);

    // Check depth
    const depth = maxDepth(bst.root);
    expect(depth).toBeGreaterThan(0);

    // Find LCA
    expect(lowestCommonAncestor(bst.root, 1, 8)).toBe(5);

    // Find kth smallest
    expect(kthSmallest(bst.root, 5)).toBe(7);

    // Check path sum
    // Path: 10 -> 5 -> 3 -> 1 = 19
    expect(hasPathSum(bst.root, 19)).toBe(true);
  });

  test("should handle inverted tree operations", () => {
    const bst = new BinarySearchTree<number>(4);
    bst.insert(2).insert(7).insert(1).insert(3).insert(6).insert(9);

    // Original is valid BST
    expect(validateBST(bst.root)).toBe(true);

    // Invert the tree
    invertTree(bst.root);

    // After inversion, it's no longer a valid BST
    expect(validateBST(bst.root)).toBe(false);

    // But depth should remain same
    expect(maxDepth(bst.root)).toBe(3);
  });

  test("should work with manually created symmetric tree", () => {
    const root = new TreeNode(5);
    root.left = new TreeNode(3);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(2);
    root.left.right = new TreeNode(4);
    root.right.left = new TreeNode(4);
    root.right.right = new TreeNode(2);

    // Is symmetric
    expect(isSymmetric(root)).toBe(true);

    // Not a valid BST (3 appears twice at same level)
    expect(validateBST(root)).toBe(false);

    // Has depth 3
    expect(maxDepth(root)).toBe(3);
  });
});

describe("Problem 9 - Closest Value in a Binary Tree", () => {
  test("should return null for an empty tree", () => {
    const result = closestValue(null, 10);
    expect(result).toBeNull();
  });

  test("should return the only value for a single-node tree", () => {
    const root = new TreeNode(5);
    const result = closestValue(root, 10);
    expect(result).toBe(5);
  });

  test("should return exact match if target exists", () => {
    const root = new TreeNode(8);
    root.left = new TreeNode(3);
    root.right = new TreeNode(10);

    const result = closestValue(root, 10);
    expect(result).toBe(10);
  });

  test("should return closest value when target is between nodes", () => {
    /**
     *       10
     *      /  \
     *     5    15
     *    / \     \
     *   2   7     20
     */
    const root = new TreeNode(10);
    root.left = new TreeNode(5);
    root.right = new TreeNode(15);

    root.left.left = new TreeNode(2);
    root.left.right = new TreeNode(7);

    root.right.right = new TreeNode(20);

    const result = closestValue(root, 9);
    expect(result).toBe(10);
  });

  test("should handle negative values", () => {
    const root = new TreeNode(0);
    root.left = new TreeNode(-10);
    root.right = new TreeNode(10);

    const result = closestValue(root, -7);
    expect(result).toBe(-10);
  });

  test("should return one of the values when equally close", () => {
    /**
     *       5
     *      / \
     *     3   7
     */
    const root = new TreeNode(5);
    root.left = new TreeNode(3);
    root.right = new TreeNode(7);

    const result = closestValue(root, 6);
    expect([5, 7]).toContain(result!);
  });

  test("should work with a skewed tree", () => {
    /**
     * 1
     *  \
     *   2
     *    \
     *     3
     *      \
     *       4
     */
    const root = new TreeNode(1);
    root.right = new TreeNode(2);
    root.right.right = new TreeNode(3);
    root.right.right.right = new TreeNode(4);

    const result = closestValue(root, 3.6);
    expect(result).toBe(4);
  });

  test("should work with manually created symmetric tree", () => {
    const root = new TreeNode(5);
    root.left = new TreeNode(3);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(2);
    root.left.right = new TreeNode(4);
    root.right.left = new TreeNode(4);
    root.right.right = new TreeNode(2);

    const result = closestValue(root, 3.8);
    expect([3, 4]).toContain(result!);
  });
});

describe("branchSum", () => {
  test("should return empty array for empty tree", () => {
    expect(branchSum(null)).toEqual([]);
  });

  test("should return single value for single node tree", () => {
    const root = new TreeNode(5);
    expect(branchSum(root)).toEqual([5]);
  });

  test("should compute branch sums for simple tree", () => {
    /*
        1
       / \
      2   3
    */
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);

    expect(branchSum(root)).toEqual([3, 4]);
  });

  test("should compute branch sums for multi-level tree", () => {
    /*
            1
           / \
          2   3
         / \   \
        4   5   6
    */
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.left.right = new TreeNode(5);
    root.right.right = new TreeNode(6);

    expect(branchSum(root)).toEqual([7, 8, 10]);
  });

  test("should handle tree with only left children", () => {
    /*
        5
       /
      4
     /
    3
    */
    const root = new TreeNode(5);
    root.left = new TreeNode(4);
    root.left.left = new TreeNode(3);

    expect(branchSum(root)).toEqual([12]);
  });

  test("should handle tree with only right children", () => {
    /*
    5
     \
      6
       \
        7
    */
    const root = new TreeNode(5);
    root.right = new TreeNode(6);
    root.right.right = new TreeNode(7);

    expect(branchSum(root)).toEqual([18]);
  });

  test("should handle negative values", () => {
    /*
        1
       / \
     -2   3
       \
       -4
    */
    const root = new TreeNode(1);
    root.left = new TreeNode(-2);
    root.right = new TreeNode(3);
    root.left.right = new TreeNode(-4);

    expect(branchSum(root)).toEqual([-5, 4]);
  });

  test("should handle complex tree", () => {
    /*
             10
            /  \
           5    15
          / \     \
         2   7     20
            /
           6
    */
    const root = new TreeNode(10);
    root.left = new TreeNode(5);
    root.right = new TreeNode(15);
    root.left.left = new TreeNode(2);
    root.left.right = new TreeNode(7);
    root.left.right.left = new TreeNode(6);
    root.right.right = new TreeNode(20);

    expect(branchSum(root)).toEqual([17, 28, 45]);
  });
});

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
    test("should calculate correct depth sum for a balanced tree", () => {
      //        1
      //       / \
      //      2   3
      //     / \
      //    4   5
      const tree = new TreeNode(1);
      tree.left = new TreeNode(2);
      tree.right = new TreeNode(3);
      tree.left.left = new TreeNode(4);
      tree.left.right = new TreeNode(5);

      // depths: 0 + 1 + 1 + 2 + 2 = 6
      expect(nodeDepth(tree)).toBe(6);
    });
  });

  describe("unbalanced trees", () => {
    test("should handle left-skewed tree", () => {
      // 1 → 2 → 3 → 4
      const tree = new TreeNode(1);
      tree.left = new TreeNode(2);
      tree.left.left = new TreeNode(3);
      tree.left.left.left = new TreeNode(4);

      // depths: 0 + 1 + 2 + 3 = 6
      expect(nodeDepth(tree)).toBe(6);
    });

    test("should handle right-skewed tree", () => {
      // 1 → 2 → 3
      const tree = new TreeNode(1);
      tree.right = new TreeNode(2);
      tree.right.right = new TreeNode(3);

      // depths: 0 + 1 + 2 = 3
      expect(nodeDepth(tree)).toBe(3);
    });
  });

  describe("trees with missing children", () => {
    test("should handle nodes with one child", () => {
      //   1
      //    \
      //     2
      //    /
      //   3
      const tree = new TreeNode(1);
      tree.right = new TreeNode(2);
      tree.right.left = new TreeNode(3);

      // depths: 0 + 1 + 2 = 3
      expect(nodeDepth(tree)).toBe(3);
    });
  });

  describe("edge cases", () => {
    test("should work with deeper trees", () => {
      const tree = new TreeNode(1);
      tree.left = new TreeNode(2);
      tree.left.left = new TreeNode(3);
      tree.left.left.left = new TreeNode(4);
      tree.left.left.left.left = new TreeNode(5);

      // depths: 0 + 1 + 2 + 3 + 4 = 10
      expect(nodeDepth(tree)).toBe(10);
    });
  });
});

describe("evaluateExpressionTree", () => {
  test("should return value for single leaf node", () => {
    const tree = new TreeNode(5);
    expect(evaluateExpressionTree(tree)).toBe(5);
  });

  test("should evaluate addition", () => {
    // 3 + 2 = 5
    const tree = new TreeNode(-1);
    tree.left = new TreeNode(3);
    tree.right = new TreeNode(2);

    expect(evaluateExpressionTree(tree)).toBe(5);
  });

  test("should evaluate subtraction", () => {
    // 7 - 4 = 3
    const tree = new TreeNode(-2);
    tree.left = new TreeNode(7);
    tree.right = new TreeNode(4);

    expect(evaluateExpressionTree(tree)).toBe(3);
  });

  test("should evaluate multiplication", () => {
    // 6 * 5 = 30
    const tree = new TreeNode(-4);
    tree.left = new TreeNode(6);
    tree.right = new TreeNode(5);

    expect(evaluateExpressionTree(tree)).toBe(30);
  });

  test("should evaluate integer division (floored)", () => {
    // 7 / 2 = 3
    const tree = new TreeNode(-3);
    tree.left = new TreeNode(7);
    tree.right = new TreeNode(2);

    expect(evaluateExpressionTree(tree)).toBe(3);
  });

  test("should evaluate nested expression tree", () => {
    // (3 + 2) * (4 - 1) = 15
    const tree = new TreeNode(-4);

    tree.left = new TreeNode(-1);
    tree.left.left = new TreeNode(3);
    tree.left.right = new TreeNode(2);

    tree.right = new TreeNode(-2);
    tree.right.left = new TreeNode(4);
    tree.right.right = new TreeNode(1);

    expect(evaluateExpressionTree(tree)).toBe(15);
  });

  test("should throw error when operator node is missing children", () => {
    const tree = new TreeNode(-1);
    tree.left = new TreeNode(3);
    // right is missing

    expect(() => evaluateExpressionTree(tree)).toThrow(
      "Operator node must have both left and right children",
    );
  });
});

describe("kthLargest", () => {
  test("should return null for empty tree", () => {
    expect(kthLargest(null, 1)).toBeNull();
  });

  test("should return root for single node and k=1", () => {
    const bst = new BinarySearchTree<number>(5);
    expect(kthLargest(bst.root, 1)).toBe(5);
  });

  test("should find 1st largest (maximum)", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(3).insert(7).insert(1).insert(4).insert(6).insert(9);
    expect(kthLargest(bst.root, 1)).toBe(9);
  });

  test("should find 2nd largest", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(3).insert(7).insert(1).insert(4).insert(6).insert(9);
    expect(kthLargest(bst.root, 2)).toBe(7);
  });

  test("should find middle element", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(3).insert(7).insert(1).insert(4).insert(6).insert(9);
    // Sorted (descending): [9, 7, 6, 5, 4, 3, 1]
    expect(kthLargest(bst.root, 4)).toBe(5);
  });

  test("should find last element (minimum)", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(3).insert(7).insert(1).insert(4).insert(6).insert(9);
    // Sorted (descending): [9, 7, 6, 5, 4, 3, 1]
    expect(kthLargest(bst.root, 7)).toBe(1);
  });

  test("should work with left-skewed tree", () => {
    const bst = new BinarySearchTree<number>(5);
    bst.insert(4).insert(3).insert(2).insert(1);
    // Sorted (descending): [5, 4, 3, 2, 1]
    expect(kthLargest(bst.root, 3)).toBe(3);
  });

  test("should work with right-skewed tree", () => {
    const bst = new BinarySearchTree<number>(1);
    bst.insert(2).insert(3).insert(4).insert(5);
    // Sorted (descending): [5, 4, 3, 2, 1]
    expect(kthLargest(bst.root, 3)).toBe(3);
  });

  test("should handle tree with negative numbers", () => {
    const bst = new BinarySearchTree<number>(0);
    bst.insert(-5).insert(5).insert(-3).insert(3);
    // Sorted (descending): [5, 3, 0, -3, -5]
    expect(kthLargest(bst.root, 2)).toBe(3);
    expect(kthLargest(bst.root, 4)).toBe(-3);
  });

  test("should work with complex tree", () => {
    const bst = new BinarySearchTree<number>(20);
    [10, 30, 5, 15, 25, 35, 3, 7, 12, 18].forEach((v) => bst.insert(v));
    // Sorted (descending): [35, 30, 25, 20, 18, 15, 12, 10, 7, 5, 3]
    expect(kthLargest(bst.root, 1)).toBe(35);
    expect(kthLargest(bst.root, 5)).toBe(18);
    expect(kthLargest(bst.root, 11)).toBe(3);
  });

  test("should handle k at boundaries", () => {
    const bst = new BinarySearchTree<number>(50);
    [30, 70].forEach((v) => bst.insert(v));
    // Sorted (descending): [70, 50, 30]
    expect(kthLargest(bst.root, 1)).toBe(70);
    expect(kthLargest(bst.root, 3)).toBe(30);
  });
});

describe("reconstructBST", () => {
  test("should return null for empty preorder array", () => {
    expect(reconstructBST([])).toBeNull();
  });

  test("should return single node for one-element preorder", () => {
    const bst = reconstructBST([10]);
    expect(bst).toEqual({ value: 10, left: null, right: null });
  });

  test("should reconstruct simple BST", () => {
    const preorder = [10, 5, 15];
    const bst = reconstructBST(preorder);

    expect(bst?.value).toBe(10);
    expect(bst?.left?.value).toBe(5);
    expect(bst?.right?.value).toBe(15);
    expect(bst?.left?.left).toBeNull();
    expect(bst?.left?.right).toBeNull();
    expect(bst?.right?.left).toBeNull();
    expect(bst?.right?.right).toBeNull();
  });

  test("should reconstruct complex BST", () => {
    const preorder = [10, 5, 1, 7, 15, 12, 20];
    const bst = reconstructBST(preorder);

    // Root
    expect(bst?.value).toBe(10);

    // Left subtree
    expect(bst?.left?.value).toBe(5);
    expect(bst?.left?.left?.value).toBe(1);
    expect(bst?.left?.right?.value).toBe(7);

    // Right subtree
    expect(bst?.right?.value).toBe(15);
    expect(bst?.right?.left?.value).toBe(12);
    expect(bst?.right?.right?.value).toBe(20);
  });

  test("should reconstruct left-skewed BST", () => {
    const preorder = [5, 4, 3, 2, 1];
    const bst = reconstructBST(preorder);

    let current = bst;
    for (let val of [5, 4, 3, 2, 1]) {
      expect(current?.value).toBe(val);
      expect(current?.right).toBeNull();
      current = current?.left;
    }
  });

  test("should reconstruct right-skewed BST", () => {
    const preorder = [1, 2, 3, 4, 5];
    const bst = reconstructBST(preorder);

    let current = bst;
    for (let val of [1, 2, 3, 4, 5]) {
      expect(current?.value).toBe(val);
      expect(current?.left).toBeNull();
      current = current?.right;
    }
  });

  test("should handle BST with negative and positive numbers", () => {
    const preorder = [0, -10, -20, -5, 5, 10];
    const bst = reconstructBST(preorder);

    expect(bst?.value).toBe(0);
    expect(bst?.left?.value).toBe(-10);
    expect(bst?.left?.left?.value).toBe(-20);
    expect(bst?.left?.right?.value).toBe(-5);
    expect(bst?.right?.value).toBe(5);
    expect(bst?.right?.right?.value).toBe(10);
  });

  test("should handle complex arbitrary BST", () => {
    const preorder = [50, 30, 20, 40, 70, 60, 80];
    const bst = reconstructBST(preorder);

    expect(bst?.value).toBe(50);
    expect(bst?.left?.value).toBe(30);
    expect(bst?.left?.left?.value).toBe(20);
    expect(bst?.left?.right?.value).toBe(40);
    expect(bst?.right?.value).toBe(70);
    expect(bst?.right?.left?.value).toBe(60);
    expect(bst?.right?.right?.value).toBe(80);
  });
});

describe("diameterBST", () => {
  test("should return 0 for empty tree", () => {
    expect(diameterBST(null as any)).toBe(0);
  });

  test("should return 0 for single node", () => {
    const tree = new TreeNode(1);
    expect(diameterBST(tree)).toBe(0);
  });

  test("should return correct diameter for simple tree", () => {
    /*
          1
         / \
        2   3
     */
    const tree = new TreeNode(1);
    tree.left = new TreeNode(2);
    tree.right = new TreeNode(3);

    // Longest path: 2 → 1 → 3 (2 edges)
    expect(diameterBST(tree)).toBe(2);
  });

  test("should return correct diameter for unbalanced tree", () => {
    /*
            1
           /
          2
         /
        3
       /
      4
     */
    const tree = new TreeNode(1);
    tree.left = new TreeNode(2);
    tree.left.left = new TreeNode(3);
    tree.left.left.left = new TreeNode(4);

    // Longest path: 4 → 3 → 2 → 1 (3 edges)
    expect(diameterBST(tree)).toBe(3);
  });

  test("should handle diameter not passing through root", () => {
    /*
            1
           /
          2
         / \
        3   4
       /
      5
     */
    const tree = new TreeNode(1);
    tree.left = new TreeNode(2);
    tree.left.left = new TreeNode(3);
    tree.left.right = new TreeNode(4);
    tree.left.left.left = new TreeNode(5);

    // Longest path: 5 → 3 → 2 → 4 (3 edges)
    expect(diameterBST(tree)).toBe(3);
  });

  test("should handle balanced tree", () => {
    /*
            1
           / \
          2   3
         / \   \
        4   5   6
     */
    const tree = new TreeNode(1);
    tree.left = new TreeNode(2);
    tree.right = new TreeNode(3);
    tree.left.left = new TreeNode(4);
    tree.left.right = new TreeNode(5);
    tree.right.right = new TreeNode(6);

    // Longest path: 4 → 2 → 1 → 3 → 6 (4 edges)
    expect(diameterBST(tree)).toBe(4);
  });
});

describe("findSuccessor", () => {
  test("should return null for empty tree", () => {
    expect(findSuccessor(null, 10)).toBe(null);
  });

  test("should return null for single-node tree", () => {
    const tree = new TreeNode(10);
    expect(findSuccessor(tree, 10)).toBe(null);
  });

  test("should find successor in balanced BST", () => {
    /*
            20
           /  \
         10    30
           \
            15
     */
    const tree = new TreeNode(20);
    tree.left = new TreeNode(10);
    tree.right = new TreeNode(30);
    tree.left.right = new TreeNode(15);

    expect(findSuccessor(tree, 15)).toBe(20);
  });

  test("should return right child when it is the successor", () => {
    /*
            10
              \
               15
     */
    const tree = new TreeNode(10);
    tree.right = new TreeNode(15);

    expect(findSuccessor(tree, 10)).toBe(15);
  });

  test("should return null when target is largest value", () => {
    const bst = new BinarySearchTree<number>(10);
    bst.insert(5).insert(15).insert(20);

    expect(findSuccessor(bst.root, 20)).toBe(null);
  });

  test("should return successor even if target does not exist", () => {
    /*
            20
           /  \
         10    30
     */
    const tree = new TreeNode(20);
    tree.left = new TreeNode(10);
    tree.right = new TreeNode(30);

    // 15 does not exist, but successor should be 20
    expect(findSuccessor(tree, 15)).toBe(20);
  });

  test("should handle left-skewed BST", () => {
    const bst = new BinarySearchTree<number>(10);
    bst.insert(8).insert(6).insert(4);

    expect(findSuccessor(bst.root, 6)).toBe(8);
  });

  test("should handle right-skewed BST", () => {
    const bst = new BinarySearchTree<number>(10);
    bst.insert(12).insert(14).insert(16);

    expect(findSuccessor(bst.root, 12)).toBe(14);
  });

  test("should handle negative values", () => {
    const bst = new BinarySearchTree<number>(0);
    bst.insert(-10).insert(10).insert(-5).insert(5);

    expect(findSuccessor(bst.root, -5)).toBe(0);
  });
});

describe("heightBalancedBinaryTree", () => {
  test("should return true for empty tree", () => {
    expect(heightBalancedBinaryTree(null as any)).toBe(true);
  });

  test("should return true for single node", () => {
    const root = new TreeNode(1);
    expect(heightBalancedBinaryTree(root)).toBe(true);
  });

  test("should return true for balanced tree with two levels", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);

    expect(heightBalancedBinaryTree(root)).toBe(true);
  });

  test("should return true for perfectly balanced tree", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.left.right = new TreeNode(5);
    root.right.left = new TreeNode(6);
    root.right.right = new TreeNode(7);

    expect(heightBalancedBinaryTree(root)).toBe(true);
  });

  test("should return false for left-skewed tree", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.left.left = new TreeNode(3);
    root.left.left.left = new TreeNode(4);

    expect(heightBalancedBinaryTree(root)).toBe(false);
  });

  test("should return false for right-skewed tree", () => {
    const root = new TreeNode(1);
    root.right = new TreeNode(2);
    root.right.right = new TreeNode(3);
    root.right.right.right = new TreeNode(4);

    expect(heightBalancedBinaryTree(root)).toBe(false);
  });

  test("should detect imbalance deep in the tree", () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.left.left.left = new TreeNode(5);

    expect(heightBalancedBinaryTree(root)).toBe(false);
  });

  test("should work with manually created mixed tree", () => {
    const root = new TreeNode(3);
    root.left = new TreeNode(9);
    root.right = new TreeNode(20);
    root.right.left = new TreeNode(15);
    root.right.right = new TreeNode(7);

    expect(heightBalancedBinaryTree(root)).toBe(true);
  });
});

/**
 * Helper to compare two binary trees deeply
 */
function isSameTree(
  a: TreeNode<number> | null,
  b: TreeNode<number> | null,
): boolean {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;

  return (
    a.value === b.value &&
    isSameTree(a.left, b.left) &&
    isSameTree(a.right, b.right)
  );
}

describe("mergeBinaryTrees", () => {
  test("should return null when both trees are null", () => {
    expect(mergeBinaryTrees(null, null)).toBeNull();
  });

  test("should return the non-null tree when one tree is null", () => {
    const tree = new TreeNode(1);
    tree.left = new TreeNode(2);

    const result = mergeBinaryTrees(tree, null);

    expect(isSameTree(result, tree)).toBe(true);
  });

  test("should merge single-node trees", () => {
    const t1 = new TreeNode(1);
    const t2 = new TreeNode(2);

    const result = mergeBinaryTrees(t1, t2);

    expect(result?.value).toBe(3);
    expect(result?.left).toBeNull();
    expect(result?.right).toBeNull();
  });

  test("should merge trees with overlapping structure", () => {
    const t1 = new TreeNode(1);
    t1.left = new TreeNode(3);
    t1.right = new TreeNode(2);
    t1.left.left = new TreeNode(5);

    const t2 = new TreeNode(2);
    t2.left = new TreeNode(1);
    t2.right = new TreeNode(3);
    t2.left.right = new TreeNode(4);
    t2.right.right = new TreeNode(7);

    const result = mergeBinaryTrees(t1, t2);

    const expected = new TreeNode(3);
    expected.left = new TreeNode(4);
    expected.right = new TreeNode(5);
    expected.left.left = new TreeNode(5);
    expected.left.right = new TreeNode(4);
    expected.right.right = new TreeNode(7);

    expect(isSameTree(result, expected)).toBe(true);
  });

  test("should handle trees with different shapes", () => {
    const t1 = new TreeNode(1);
    t1.left = new TreeNode(2);

    const t2 = new TreeNode(3);
    t2.right = new TreeNode(4);

    const result = mergeBinaryTrees(t1, t2);

    expect(result?.value).toBe(4);
    expect(result?.left?.value).toBe(2);
    expect(result?.right?.value).toBe(4);
  });

  test("should work with manually created trees", () => {
    const t1 = new TreeNode(5);
    t1.left = new TreeNode(3);
    t1.right = new TreeNode(7);

    const t2 = new TreeNode(1);
    t2.left = new TreeNode(2);
    t2.right = new TreeNode(4);

    const result = mergeBinaryTrees(t1, t2);

    expect(result?.value).toBe(6);
    expect(result?.left?.value).toBe(5);
    expect(result?.right?.value).toBe(11);
  });
});
