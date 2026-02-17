import { describe, expect, test } from "bun:test";
import BinaryTree from "@/data-structures/binary-tree/binary-tree";

/**
 * Test Suite: BinaryTree
 *
 * Tests the binary tree implementation using level-order insertion.
 * Covers: constructor, insert, levelOrder traversal, structure integrity,
 * edge cases, and large trees.
 */

describe("BinaryTree", () => {
  describe("constructor", () => {
    test("should create an empty tree if no value provided", () => {
      const tree = new BinaryTree();

      expect(tree.root).toBeNull();
    });

    test("should create a tree with root node", () => {
      const tree = new BinaryTree(10);

      expect(tree.root?.value).toBe(10);
      expect(tree.root?.left).toBeNull();
      expect(tree.root?.right).toBeNull();
    });

    test("should handle zero as root value", () => {
      const tree = new BinaryTree(0);

      expect(tree.root?.value).toBe(0);
    });

    test("should handle negative numbers as root value", () => {
      const tree = new BinaryTree(-5);

      expect(tree.root?.value).toBe(-5);
    });
  });

  describe("insert()", () => {
    describe("basic functionality", () => {
      test("should insert into empty tree", () => {
        const tree = new BinaryTree();
        tree.insert(1);

        expect(tree.root?.value).toBe(1);
      });

      test("should insert left child first", () => {
        const tree = new BinaryTree(1);
        tree.insert(2);

        expect(tree.root?.left?.value).toBe(2);
        expect(tree.root?.right).toBeNull();
      });

      test("should insert right child second", () => {
        const tree = new BinaryTree(1);
        tree.insert(2);
        tree.insert(3);

        expect(tree.root?.left?.value).toBe(2);
        expect(tree.root?.right?.value).toBe(3);
      });

      test("should insert in level-order", () => {
        const tree = new BinaryTree(1);
        tree.insert(2);
        tree.insert(3);
        tree.insert(4);
        tree.insert(5);

        /**
         * Expected structure:
         *        1
         *      /   \
         *     2     3
         *    / \
         *   4   5
         */

        expect(tree.root?.left?.left?.value).toBe(4);
        expect(tree.root?.left?.right?.value).toBe(5);
      });
    });

    describe("multiple inserts", () => {
      test("should build complete tree for 7 nodes", () => {
        const tree = new BinaryTree(1);
        for (let i = 2; i <= 7; i++) {
          tree.insert(i);
        }

        const result = tree.levelOrder();
        expect(result).toEqual([[1], [2, 3], [4, 5, 6, 7]]);
      });

      test("should handle many inserts", () => {
        const tree = new BinaryTree(1);
        for (let i = 2; i <= 100; i++) {
          tree.insert(i);
        }

        expect(tree.levelOrder().flat().length).toBe(100);
      });
    });
  });

  describe("levelOrder()", () => {
    describe("basic traversal", () => {
      test("should return empty array for empty tree", () => {
        const tree = new BinaryTree();
        expect(tree.levelOrder()).toEqual([]);
      });

      test("should return single level for single node", () => {
        const tree = new BinaryTree(1);
        expect(tree.levelOrder()).toEqual([[1]]);
      });

      test("should return correct levels", () => {
        const tree = new BinaryTree(1);
        tree.insert(2);
        tree.insert(3);
        tree.insert(4);

        expect(tree.levelOrder()).toEqual([[1], [2, 3], [4]]);
      });
    });

    describe("structure validation", () => {
      test("should maintain left-to-right order", () => {
        const tree = new BinaryTree(10);
        tree.insert(20);
        tree.insert(30);
        tree.insert(40);
        tree.insert(50);

        const levels = tree.levelOrder();

        expect(levels[1]).toEqual([20, 30]);
        expect(levels[2]).toEqual([40, 50]);
      });

      test("should match manual traversal", () => {
        const tree = new BinaryTree(1);
        tree.insert(2);
        tree.insert(3);
        tree.insert(4);
        tree.insert(5);
        tree.insert(6);

        const flat = tree.levelOrder().flat();
        expect(flat).toEqual([1, 2, 3, 4, 5, 6]);
      });
    });
  });

  describe("integration scenarios", () => {
    test("should handle complex insertion pattern", () => {
      const tree = new BinaryTree(5);
      tree.insert(10);
      tree.insert(15);
      tree.insert(20);
      tree.insert(25);
      tree.insert(30);

      expect(tree.levelOrder()).toEqual([[5], [10, 15], [20, 25, 30]]);
    });

    test("should maintain tree integrity after many operations", () => {
      const tree = new BinaryTree();

      for (let i = 1; i <= 50; i++) {
        tree.insert(i);
      }

      const levels = tree.levelOrder();
      const totalNodes = levels.flat().length;

      expect(totalNodes).toBe(50);
      expect(levels[0]).toEqual([1]);
      expect(levels[1]).toEqual([2, 3]);
    });
  });
});
