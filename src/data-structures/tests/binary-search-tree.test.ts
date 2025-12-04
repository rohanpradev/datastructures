import { describe, expect, test } from "bun:test";
import {
	BinarySearchTree,
	TreeNode,
} from "@/data-structures/binary-search-tree/binary-search-tree";

describe("BinarySearchTree - Constructor", () => {
	test("should create an empty tree when no value provided", () => {
		const bst = new BinarySearchTree<number>();
		expect(bst.root).toBeNull();
		expect(bst.length).toBe(0);
		expect(bst.isEmpty()).toBe(true);
	});

	test("should create tree with single node when value provided", () => {
		const bst = new BinarySearchTree<number>(50);
		expect(bst.root).not.toBeNull();
		expect(bst.root?.value).toBe(50);
		expect(bst.length).toBe(1);
		expect(bst.isEmpty()).toBe(false);
	});

	test("should create tree with custom comparison function", () => {
		interface Person {
			id: number;
			name: string;
		}
		const compareFn = (a: Person, b: Person) => a.id - b.id;
		const bst = new BinarySearchTree<Person>(
			{ id: 50, name: "Alice" },
			compareFn,
		);
		expect(bst.root?.value).toEqual({ id: 50, name: "Alice" });
	});

	test("should work with string values", () => {
		const bst = new BinarySearchTree<string>("middle");
		expect(bst.root?.value).toBe("middle");
	});
});

describe("BinarySearchTree - Insert", () => {
	test("should insert into empty tree", () => {
		const bst = new BinarySearchTree<number>();
		bst.insert(50);
		expect(bst.root?.value).toBe(50);
		expect(bst.length).toBe(1);
	});

	test("should insert smaller values to the left", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30);
		expect(bst.root?.left?.value).toBe(30);
		expect(bst.length).toBe(2);
	});

	test("should insert larger values to the right", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(70);
		expect(bst.root?.right?.value).toBe(70);
		expect(bst.length).toBe(2);
	});

	test("should insert multiple values correctly", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70).insert(20).insert(40).insert(60).insert(80);
		expect(bst.length).toBe(7);
		expect(bst.root?.value).toBe(50);
		expect(bst.root?.left?.value).toBe(30);
		expect(bst.root?.right?.value).toBe(70);
	});

	test("should not insert duplicate values", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(30);
		expect(bst.length).toBe(2);
	});

	test("should maintain BST property with random insertions", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70).insert(20).insert(40);
		const inorder = bst.inorderTraversal();
		expect(inorder).toEqual([20, 30, 40, 50, 70]);
	});

	test("should support method chaining", () => {
		const bst = new BinarySearchTree<number>();
		const result = bst.insert(50).insert(30).insert(70);
		expect(result).toBe(bst);
		expect(bst.length).toBe(3);
	});
});

describe("BinarySearchTree - Search", () => {
	test("should return false for empty tree", () => {
		const bst = new BinarySearchTree<number>();
		expect(bst.search(50)).toBe(false);
	});

	test("should find root value", () => {
		const bst = new BinarySearchTree<number>(50);
		expect(bst.search(50)).toBe(true);
	});

	test("should find values in left subtree", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(20).insert(40);
		expect(bst.search(30)).toBe(true);
		expect(bst.search(20)).toBe(true);
		expect(bst.search(40)).toBe(true);
	});

	test("should find values in right subtree", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(70).insert(60).insert(80);
		expect(bst.search(70)).toBe(true);
		expect(bst.search(60)).toBe(true);
		expect(bst.search(80)).toBe(true);
	});

	test("should return false for non-existent values", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70);
		expect(bst.search(100)).toBe(false);
		expect(bst.search(10)).toBe(false);
		expect(bst.search(55)).toBe(false);
	});

	test("should work with complex tree", () => {
		const bst = new BinarySearchTree<number>(50);
		[30, 70, 20, 40, 60, 80, 10, 25, 35, 45].forEach((val) => bst.insert(val));
		expect(bst.search(25)).toBe(true);
		expect(bst.search(45)).toBe(true);
		expect(bst.search(99)).toBe(false);
	});
});

describe("BinarySearchTree - Delete", () => {
	test("should return false when deleting from empty tree", () => {
		const bst = new BinarySearchTree<number>();
		expect(bst.delete(50)).toBe(false);
		expect(bst.length).toBe(0);
	});

	test("should delete leaf node", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70);
		expect(bst.delete(30)).toBe(true);
		expect(bst.length).toBe(2);
		expect(bst.search(30)).toBe(false);
	});

	test("should delete node with one child (left)", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(20);
		expect(bst.delete(30)).toBe(true);
		expect(bst.length).toBe(2);
		expect(bst.search(30)).toBe(false);
		expect(bst.search(20)).toBe(true);
	});

	test("should delete node with one child (right)", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(70).insert(80);
		expect(bst.delete(70)).toBe(true);
		expect(bst.length).toBe(2);
		expect(bst.search(70)).toBe(false);
		expect(bst.search(80)).toBe(true);
	});

	test("should delete node with two children", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70).insert(20).insert(40).insert(60).insert(80);
		expect(bst.delete(50)).toBe(true);
		expect(bst.length).toBe(6);
		expect(bst.search(50)).toBe(false);
		// Tree should still be valid BST
		const inorder = bst.inorderTraversal();
		expect(inorder).toEqual([20, 30, 40, 60, 70, 80]);
	});

	test("should delete root node (single node tree)", () => {
		const bst = new BinarySearchTree<number>(50);
		expect(bst.delete(50)).toBe(true);
		expect(bst.root).toBeNull();
		expect(bst.length).toBe(0);
	});

	test("should return false when deleting non-existent value", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70);
		expect(bst.delete(100)).toBe(false);
		expect(bst.length).toBe(3);
	});

	test("should handle multiple deletions", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70).insert(20).insert(40).insert(60).insert(80);
		expect(bst.delete(20)).toBe(true);
		expect(bst.delete(80)).toBe(true);
		expect(bst.delete(50)).toBe(true);
		expect(bst.length).toBe(4);
		expect(bst.search(20)).toBe(false);
		expect(bst.search(80)).toBe(false);
		expect(bst.search(50)).toBe(false);
	});
});

describe("BinarySearchTree - Traversals", () => {
	test("inorderTraversal - should return empty array for empty tree", () => {
		const bst = new BinarySearchTree<number>();
		expect(bst.inorderTraversal()).toEqual([]);
	});

	test("inorderTraversal - should return values in sorted order", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70).insert(20).insert(40).insert(60).insert(80);
		expect(bst.inorderTraversal()).toEqual([20, 30, 40, 50, 60, 70, 80]);
	});

	test("preorderTraversal - should return empty array for empty tree", () => {
		const bst = new BinarySearchTree<number>();
		expect(bst.preorderTraversal()).toEqual([]);
	});

	test("preorderTraversal - should return values in pre-order", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70).insert(20).insert(40).insert(60).insert(80);
		expect(bst.preorderTraversal()).toEqual([50, 30, 20, 40, 70, 60, 80]);
	});

	test("postorderTraversal - should return empty array for empty tree", () => {
		const bst = new BinarySearchTree<number>();
		expect(bst.postorderTraversal()).toEqual([]);
	});

	test("postorderTraversal - should return values in post-order", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70).insert(20).insert(40).insert(60).insert(80);
		expect(bst.postorderTraversal()).toEqual([20, 40, 30, 60, 80, 70, 50]);
	});

	test("levelOrderTraversal - should return empty array for empty tree", () => {
		const bst = new BinarySearchTree<number>();
		expect(bst.levelOrderTraversal()).toEqual([]);
	});

	test("levelOrderTraversal - should return values level by level", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70).insert(20).insert(40).insert(60).insert(80);
		expect(bst.levelOrderTraversal()).toEqual([50, 30, 70, 20, 40, 60, 80]);
	});

	test("should handle single node tree in all traversals", () => {
		const bst = new BinarySearchTree<number>(50);
		expect(bst.inorderTraversal()).toEqual([50]);
		expect(bst.preorderTraversal()).toEqual([50]);
		expect(bst.postorderTraversal()).toEqual([50]);
		expect(bst.levelOrderTraversal()).toEqual([50]);
	});
});

describe("BinarySearchTree - FindMin/FindMax", () => {
	test("findMin - should return undefined for empty tree", () => {
		const bst = new BinarySearchTree<number>();
		expect(bst.findMin()).toBeUndefined();
	});

	test("findMin - should return root for single node", () => {
		const bst = new BinarySearchTree<number>(50);
		expect(bst.findMin()).toBe(50);
	});

	test("findMin - should return leftmost value", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70).insert(20).insert(10);
		expect(bst.findMin()).toBe(10);
	});

	test("findMax - should return undefined for empty tree", () => {
		const bst = new BinarySearchTree<number>();
		expect(bst.findMax()).toBeUndefined();
	});

	test("findMax - should return root for single node", () => {
		const bst = new BinarySearchTree<number>(50);
		expect(bst.findMax()).toBe(50);
	});

	test("findMax - should return rightmost value", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70).insert(80).insert(90);
		expect(bst.findMax()).toBe(90);
	});
});

describe("BinarySearchTree - Height", () => {
	test("should return -1 for empty tree", () => {
		const bst = new BinarySearchTree<number>();
		expect(bst.height()).toBe(-1);
	});

	test("should return 0 for single node", () => {
		const bst = new BinarySearchTree<number>(50);
		expect(bst.height()).toBe(0);
	});

	test("should return 1 for tree with two levels", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30);
		expect(bst.height()).toBe(1);
	});

	test("should return correct height for balanced tree", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70).insert(20).insert(40).insert(60).insert(80);
		expect(bst.height()).toBe(2);
	});

	test("should return correct height for unbalanced tree", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(60).insert(70).insert(80).insert(90);
		expect(bst.height()).toBe(4);
	});
});

describe("BinarySearchTree - Size/IsEmpty/Clear", () => {
	test("isEmpty - should return true for new tree", () => {
		const bst = new BinarySearchTree<number>();
		expect(bst.isEmpty()).toBe(true);
	});

	test("isEmpty - should return false after insertion", () => {
		const bst = new BinarySearchTree<number>(50);
		expect(bst.isEmpty()).toBe(false);
	});

	test("size - should return 0 for empty tree", () => {
		const bst = new BinarySearchTree<number>();
		expect(bst.size()).toBe(0);
	});

	test("size - should track insertions correctly", () => {
		const bst = new BinarySearchTree<number>(50);
		expect(bst.size()).toBe(1);
		bst.insert(30).insert(70).insert(20);
		expect(bst.size()).toBe(4);
	});

	test("size - should track deletions correctly", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70);
		expect(bst.size()).toBe(3);
		bst.delete(30);
		expect(bst.size()).toBe(2);
	});

	test("clear - should remove all nodes", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70).insert(20);
		bst.clear();
		expect(bst.root).toBeNull();
		expect(bst.length).toBe(0);
		expect(bst.isEmpty()).toBe(true);
	});

	test("clear - should support method chaining", () => {
		const bst = new BinarySearchTree<number>(50);
		const result = bst.clear();
		expect(result).toBe(bst);
	});
});

describe("BinarySearchTree - Edge Cases", () => {
	test("should handle inserting only increasing values", () => {
		const bst = new BinarySearchTree<number>(1);
		bst.insert(2).insert(3).insert(4).insert(5);
		expect(bst.inorderTraversal()).toEqual([1, 2, 3, 4, 5]);
		expect(bst.height()).toBe(4);
	});

	test("should handle inserting only decreasing values", () => {
		const bst = new BinarySearchTree<number>(5);
		bst.insert(4).insert(3).insert(2).insert(1);
		expect(bst.inorderTraversal()).toEqual([1, 2, 3, 4, 5]);
		expect(bst.height()).toBe(4);
	});

	test("should handle negative numbers", () => {
		const bst = new BinarySearchTree<number>(0);
		bst.insert(-10).insert(-5).insert(10).insert(5);
		expect(bst.inorderTraversal()).toEqual([-10, -5, 0, 5, 10]);
	});

	test("should handle floating point numbers", () => {
		const bst = new BinarySearchTree<number>(5.5);
		bst.insert(3.3).insert(7.7).insert(2.2);
		expect(bst.search(3.3)).toBe(true);
		expect(bst.search(7.7)).toBe(true);
	});
});

describe("BinarySearchTree - Integration Scenarios", () => {
	test("should build and manipulate complex tree", () => {
		const bst = new BinarySearchTree<number>(50);
		const values = [30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 55, 65, 75, 85];
		values.forEach((val) => bst.insert(val));

		expect(bst.size()).toBe(15);
		expect(bst.height()).toBe(3);
		expect(bst.findMin()).toBe(10);
		expect(bst.findMax()).toBe(85);

		// Delete some nodes
		bst.delete(20);
		bst.delete(80);
		expect(bst.size()).toBe(13);
		expect(bst.search(20)).toBe(false);
		expect(bst.search(80)).toBe(false);

		// Tree should still be valid
		const inorder = bst.inorderTraversal();
		expect(inorder).toEqual([
			10, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 85,
		]);
	});

	test("should work with custom object types", () => {
		interface Student {
			id: number;
			name: string;
		}

		const compareFn = (a: Student, b: Student) => a.id - b.id;
		const bst = new BinarySearchTree<Student>(
			{ id: 50, name: "Alice" },
			compareFn,
		);

		bst.insert({ id: 30, name: "Bob" });
		bst.insert({ id: 70, name: "Charlie" });

		expect(bst.search({ id: 30, name: "Bob" })).toBe(true);
		expect(bst.search({ id: 100, name: "Unknown" })).toBe(false);
	});

	test("should handle rebuild after clear", () => {
		const bst = new BinarySearchTree<number>(50);
		bst.insert(30).insert(70);
		bst.clear();

		expect(bst.isEmpty()).toBe(true);

		bst.insert(100).insert(80).insert(120);
		expect(bst.size()).toBe(3);
		expect(bst.search(100)).toBe(true);
	});

	test("should maintain BST property after multiple operations", () => {
		const bst = new BinarySearchTree<number>(50);
		const operations = [
			{ op: "insert", val: 30 },
			{ op: "insert", val: 70 },
			{ op: "insert", val: 20 },
			{ op: "delete", val: 30 },
			{ op: "insert", val: 40 },
			{ op: "insert", val: 60 },
			{ op: "delete", val: 70 },
			{ op: "insert", val: 80 },
		];

		operations.forEach(({ op, val }) => {
			if (op === "insert") bst.insert(val);
			else bst.delete(val);
		});

		// Should maintain sorted order
		const inorder = bst.inorderTraversal();
		for (let i = 1; i < inorder.length; i++) {
			expect(inorder[i]!).toBeGreaterThan(inorder[i - 1]!);
		}
	});
});

describe("BinarySearchTree - Different Data Types", () => {
	test("should work with string values", () => {
		const bst = new BinarySearchTree<string>("M");
		bst.insert("D").insert("S").insert("B").insert("F");
		expect(bst.search("D")).toBe(true);
		expect(bst.search("Z")).toBe(false);
	});

	test("should work with boolean values", () => {
		const bst = new BinarySearchTree<boolean>(
			true,
			(a, b) => Number(a) - Number(b),
		);
		bst.insert(false);
		expect(bst.size()).toBe(2);
	});

	test("should work with date values", () => {
		const compareFn = (a: Date, b: Date) => a.getTime() - b.getTime();
		const bst = new BinarySearchTree<Date>(new Date("2024-01-15"), compareFn);
		bst.insert(new Date("2024-01-10"));
		bst.insert(new Date("2024-01-20"));
		expect(bst.size()).toBe(3);
	});
});

describe("BinarySearchTree - Recursive Methods", () => {
	describe("rContains", () => {
		test("should find existing values recursively", () => {
			const bst = new BinarySearchTree<number>(50);
			bst.insert(30).insert(70).insert(20).insert(40).insert(60).insert(80);

			expect(bst.rContains(50)).toBe(true);
			expect(bst.rContains(30)).toBe(true);
			expect(bst.rContains(70)).toBe(true);
			expect(bst.rContains(20)).toBe(true);
			expect(bst.rContains(80)).toBe(true);
		});

		test("should not find non-existing values", () => {
			const bst = new BinarySearchTree<number>(50);
			bst.insert(30).insert(70);

			expect(bst.rContains(25)).toBe(false);
			expect(bst.rContains(100)).toBe(false);
			expect(bst.rContains(55)).toBe(false);
		});

		test("should return false for empty tree", () => {
			const bst = new BinarySearchTree<number>();
			expect(bst.rContains(10)).toBe(false);
		});
	});

	describe("rInsert", () => {
		test("should insert values recursively", () => {
			const bst = new BinarySearchTree<number>();
			bst.rInsert(50).rInsert(30).rInsert(70).rInsert(20).rInsert(40);

			expect(bst.size()).toBe(5);
			expect(bst.search(50)).toBe(true);
			expect(bst.search(30)).toBe(true);
			expect(bst.search(70)).toBe(true);
			expect(bst.search(20)).toBe(true);
			expect(bst.search(40)).toBe(true);
		});

		test("should maintain BST property after recursive inserts", () => {
			const bst = new BinarySearchTree<number>();
			bst
				.rInsert(50)
				.rInsert(30)
				.rInsert(70)
				.rInsert(20)
				.rInsert(40)
				.rInsert(60)
				.rInsert(80);

			const inorder = bst.inorderTraversal();
			for (let i = 1; i < inorder.length; i++) {
				expect(inorder[i]!).toBeGreaterThan(inorder[i - 1]!);
			}
		});

		test("should not insert duplicates", () => {
			const bst = new BinarySearchTree<number>();
			bst.rInsert(50).rInsert(30).rInsert(30);

			expect(bst.size()).toBe(2);
		});

		test("should chain recursive inserts", () => {
			const bst = new BinarySearchTree<number>();
			const result = bst.rInsert(1).rInsert(2).rInsert(3);

			expect(result).toBe(bst);
			expect(bst.size()).toBe(3);
		});
	});

	describe("rDelete", () => {
		test("should delete leaf nodes", () => {
			const bst = new BinarySearchTree<number>(50);
			bst.insert(30).insert(70).insert(20).insert(40);

			bst.rDelete(20);
			expect(bst.search(20)).toBe(false);
			expect(bst.size()).toBe(4);
		});

		test("should delete nodes with one child", () => {
			const bst = new BinarySearchTree<number>(50);
			bst.insert(30).insert(70).insert(20);

			bst.rDelete(30); // Has only left child
			expect(bst.search(30)).toBe(false);
			expect(bst.search(20)).toBe(true);
			expect(bst.size()).toBe(3); // 50, 20, 70 remain
		});

		test("should delete nodes with two children", () => {
			const bst = new BinarySearchTree<number>(50);
			bst.insert(30).insert(70).insert(20).insert(40).insert(60).insert(80);

			bst.rDelete(50); // Root with two children
			expect(bst.search(50)).toBe(false);
			expect(bst.size()).toBe(6); // 30, 20, 40, 60, 70, 80 remain
			// Tree should still be valid
			const inorder = bst.inorderTraversal();
			for (let i = 1; i < inorder.length; i++) {
				expect(inorder[i]!).toBeGreaterThan(inorder[i - 1]!);
			}
		});

		test("should handle deleting non-existent value", () => {
			const bst = new BinarySearchTree<number>(50);
			bst.insert(30).insert(70);

			bst.rDelete(100);
			expect(bst.size()).toBe(3);
		});

		test("should handle deleting from empty tree", () => {
			const bst = new BinarySearchTree<number>();
			bst.rDelete(50);
			expect(bst.size()).toBe(0);
		});

		test("should maintain BST property after multiple recursive deletes", () => {
			const bst = new BinarySearchTree<number>(50);
			bst
				.insert(30)
				.insert(70)
				.insert(20)
				.insert(40)
				.insert(60)
				.insert(80)
				.insert(10)
				.insert(25);

			bst.rDelete(30).rDelete(70);

			const inorder = bst.inorderTraversal();
			for (let i = 1; i < inorder.length; i++) {
				expect(inorder[i]!).toBeGreaterThan(inorder[i - 1]!);
			}
		});
	});

	describe("rFindMin", () => {
		test("should find minimum value", () => {
			const bst = new BinarySearchTree<number>(50);
			bst.insert(30).insert(70).insert(20).insert(40).insert(10);

			expect(bst.rFindMin()).toBe(10);
		});

		test("should find minimum when root is minimum", () => {
			const bst = new BinarySearchTree<number>(10);
			bst.insert(20).insert(30);

			expect(bst.rFindMin()).toBe(10);
		});

		test("should throw error for empty tree", () => {
			const bst = new BinarySearchTree<number>();
			expect(() => bst.rFindMin()).toThrow("Cannot find minimum of empty tree");
		});
	});

	describe("rFindMax", () => {
		test("should find maximum value", () => {
			const bst = new BinarySearchTree<number>(50);
			bst.insert(30).insert(70).insert(60).insert(80).insert(90);

			expect(bst.rFindMax()).toBe(90);
		});

		test("should find maximum when root is maximum", () => {
			const bst = new BinarySearchTree<number>(50);
			bst.insert(30).insert(20);

			expect(bst.rFindMax()).toBe(50);
		});

		test("should throw error for empty tree", () => {
			const bst = new BinarySearchTree<number>();
			expect(() => bst.rFindMax()).toThrow("Cannot find maximum of empty tree");
		});
	});

	describe("Recursive vs Iterative Comparison", () => {
		test("rContains and search should return same results", () => {
			const bst = new BinarySearchTree<number>(50);
			const values = [30, 70, 20, 40, 60, 80];
			values.forEach((v) => bst.insert(v));

			values.forEach((v) => {
				expect(bst.rContains(v)).toBe(bst.search(v));
			});

			expect(bst.rContains(100)).toBe(bst.search(100));
		});

		test("rInsert and insert should produce same tree", () => {
			const bst1 = new BinarySearchTree<number>();
			const bst2 = new BinarySearchTree<number>();
			const values = [50, 30, 70, 20, 40, 60, 80];

			values.forEach((v) => bst1.insert(v));
			values.forEach((v) => bst2.rInsert(v));

			expect(bst1.size()).toBe(bst2.size());
			expect(bst1.inorderTraversal()).toEqual(bst2.inorderTraversal());
		});

		test("rDelete and delete should produce same results", () => {
			const bst1 = new BinarySearchTree<number>(50);
			const bst2 = new BinarySearchTree<number>(50);
			const inserts = [30, 70, 20, 40, 60, 80];

			inserts.forEach((v) => bst1.insert(v));
			inserts.forEach((v) => bst2.insert(v));

			bst1.delete(30);
			bst2.rDelete(30);

			expect(bst1.size()).toBe(bst2.size());
			expect(bst1.inorderTraversal()).toEqual(bst2.inorderTraversal());
		});
	});
});
