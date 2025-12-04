import { describe, expect, test } from "bun:test";
import {
	binaryToDecimal,
	findKthFromEnd,
	findMiddleNode,
	hasLoop,
	mergeTwoSortedLists,
	partitionList,
	removeDuplicates,
	reverseBetween,
} from "@/data-structures/singly-linked-list/problems/leetcode-sll";
import { SinglyLinkedList } from "@/data-structures/singly-linked-list/singly-linked-list";

/**
 * Test Suite: findMiddleNode()
 *
 * Tests the two-pointer algorithm for finding the middle node of a linked list.
 * Covers: odd-length lists, even-length lists, edge cases, and different data types.
 */
describe("findMiddleNode()", () => {
	describe("odd-length lists", () => {
		test("should find middle of list with 1 element", () => {
			const list = new SinglyLinkedList<number>(5);

			const result = findMiddleNode(list);

			expect(result?.value).toBe(5);
		});

		test("should find middle of list with 3 elements", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);

			const result = findMiddleNode(list);

			expect(result?.value).toBe(2); // Middle is the 2nd element
		});

		test("should find middle of list with 5 elements", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			const result = findMiddleNode(list);

			expect(result?.value).toBe(3); // Middle is the 3rd element
		});

		test("should find middle of list with 7 elements", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6).push(7);

			const result = findMiddleNode(list);

			expect(result?.value).toBe(4); // Middle is the 4th element
		});

		test("should find middle of list with 9 elements", () => {
			const list = new SinglyLinkedList<number>(10);
			list
				.push(20)
				.push(30)
				.push(40)
				.push(50)
				.push(60)
				.push(70)
				.push(80)
				.push(90);

			const result = findMiddleNode(list);

			expect(result?.value).toBe(50); // Middle is the 5th element
		});
	});

	describe("even-length lists", () => {
		test("should return second middle of list with 2 elements", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);

			const result = findMiddleNode(list);

			expect(result?.value).toBe(2); // Second of two middle elements
		});

		test("should return second middle of list with 4 elements", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			const result = findMiddleNode(list);

			expect(result?.value).toBe(3); // Second of [2, 3]
		});

		test("should return second middle of list with 6 elements", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6);

			const result = findMiddleNode(list);

			expect(result?.value).toBe(4); // Second of [3, 4]
		});

		test("should return second middle of list with 8 elements", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20).push(30).push(40).push(50).push(60).push(70).push(80);

			const result = findMiddleNode(list);

			expect(result?.value).toBe(50); // Second of [40, 50]
		});

		test("should return second middle of list with 10 elements", () => {
			const list = new SinglyLinkedList<number>(1);
			for (let i = 2; i <= 10; i++) {
				list.push(i);
			}

			const result = findMiddleNode(list);

			expect(result?.value).toBe(6); // Second of [5, 6]
		});
	});

	describe("edge cases", () => {
		test("should return null for empty list", () => {
			const list = new SinglyLinkedList<number>();

			const result = findMiddleNode(list);

			expect(result).toBe(null);
		});

		test("should work with zero values", () => {
			const list = new SinglyLinkedList<number>(0);
			list.push(1).push(0).push(2).push(0);

			const result = findMiddleNode(list);

			expect(result?.value).toBe(0); // Middle is 0
		});

		test("should work with negative numbers", () => {
			const list = new SinglyLinkedList<number>(-5);
			list.push(-3).push(-1).push(0).push(1);

			const result = findMiddleNode(list);

			expect(result?.value).toBe(-1); // Middle element
		});

		test("should work with null values for nullable types", () => {
			const list = new SinglyLinkedList<number | null>(1);
			list.push(null).push(3).push(4).push(5);

			const result = findMiddleNode(list);

			expect(result?.value).toBe(3); // Middle is 3
		});

		test("should work when middle is null", () => {
			const list = new SinglyLinkedList<number | null>(1);
			list.push(2).push(null).push(4).push(5);

			const result = findMiddleNode(list);

			expect(result?.value).toBe(null); // Middle is null
		});
	});

	describe("different data types", () => {
		test("should work with strings", () => {
			const list = new SinglyLinkedList<string>("first");
			list.push("second").push("third").push("fourth").push("fifth");

			const result = findMiddleNode(list);

			expect(result?.value).toBe("third");
		});

		test("should work with booleans", () => {
			const list = new SinglyLinkedList<boolean>(true);
			list.push(false).push(true).push(false).push(true);

			const result = findMiddleNode(list);

			expect(result?.value).toBe(true);
		});

		test("should work with objects", () => {
			const obj1 = { id: 1, name: "first" };
			const obj2 = { id: 2, name: "second" };
			const obj3 = { id: 3, name: "third" };
			const obj4 = { id: 4, name: "fourth" };
			const obj5 = { id: 5, name: "fifth" };

			const list = new SinglyLinkedList<typeof obj1>(obj1);
			list.push(obj2).push(obj3).push(obj4).push(obj5);

			const result = findMiddleNode(list);

			expect(result?.value).toEqual(obj3);
		});

		test("should work with arrays", () => {
			const list = new SinglyLinkedList<number[]>([1, 2]);
			list.push([3, 4]).push([5, 6]).push([7, 8]).push([9, 10]);

			const result = findMiddleNode(list);

			expect(result?.value).toEqual([5, 6]);
		});
	});

	describe("large lists", () => {
		test("should handle list with 100 elements (odd)", () => {
			const list = new SinglyLinkedList<number>(1);
			for (let i = 2; i <= 99; i++) {
				list.push(i);
			}

			const result = findMiddleNode(list);

			expect(result?.value).toBe(50); // Middle of 99 elements
		});

		test("should handle list with 1000 elements (even)", () => {
			const list = new SinglyLinkedList<number>(1);
			for (let i = 2; i <= 1000; i++) {
				list.push(i);
			}

			const result = findMiddleNode(list);

			expect(result?.value).toBe(501); // Second middle of 1000 elements
		});
	});

	describe("after list modifications", () => {
		test("should work after pushing more elements", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);

			// Middle is 2
			expect(findMiddleNode(list)?.value).toBe(2);

			// Add more elements
			list.push(4).push(5);

			// Middle should now be 3
			expect(findMiddleNode(list)?.value).toBe(3);
		});

		test("should work after list reversal", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			// Middle is 3
			expect(findMiddleNode(list)?.value).toBe(3);

			// Reverse the list: [5, 4, 3, 2, 1]
			list.reverse();

			// Middle is still 3
			expect(findMiddleNode(list)?.value).toBe(3);
		});

		test("should work after popping elements", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6).push(7);

			// Middle of 7 elements is 4
			expect(findMiddleNode(list)?.value).toBe(4);

			// Remove last two: [1, 2, 3, 4, 5]
			list.pop();
			list.pop();

			// Middle of 5 elements is 3
			expect(findMiddleNode(list)?.value).toBe(3);
		});

		test("should work after shifting elements", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			// Middle of 5 elements is 3
			expect(findMiddleNode(list)?.value).toBe(3);

			// Remove first two: [3, 4, 5]
			list.shift();
			list.shift();

			// Middle of 3 elements is 4
			expect(findMiddleNode(list)?.value).toBe(4);
		});
	});

	describe("algorithm verification", () => {
		test("slow pointer should move half the distance of fast pointer", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6);

			// With 6 elements, slow should stop at position 3 (value 4)
			// Fast would have moved to position 6 (or null)
			const result = findMiddleNode(list);

			expect(result?.value).toBe(4);
		});

		test("should handle consecutive duplicate values", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(1).push(1).push(1).push(1);

			const result = findMiddleNode(list);

			expect(result?.value).toBe(1); // All same, middle is still 1
		});
	});
});

/**
 * Test Suite: hasLoop()
 *
 * Tests Floyd's Cycle Detection algorithm for detecting loops in linked lists.
 * Covers: lists without loops, lists with loops at various positions, and edge cases.
 */
describe("hasLoop()", () => {
	describe("lists without loops", () => {
		test("should return false for empty list", () => {
			const list = new SinglyLinkedList<number>();

			const result = hasLoop(list);

			expect(result).toBe(false);
		});

		test("should return false for single element list", () => {
			const list = new SinglyLinkedList<number>(1);

			const result = hasLoop(list);

			expect(result).toBe(false);
		});

		test("should return false for list with 2 elements", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);

			const result = hasLoop(list);

			expect(result).toBe(false);
		});

		test("should return false for list with 5 elements", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			const result = hasLoop(list);

			expect(result).toBe(false);
		});

		test("should return false for large list without loop", () => {
			const list = new SinglyLinkedList<number>(0);
			for (let i = 1; i < 100; i++) {
				list.push(i);
			}

			const result = hasLoop(list);

			expect(result).toBe(false);
		});
	});

	describe("lists with loops", () => {
		test("should detect loop when tail points to head", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			// Create loop: tail -> head
			list.tail!.next = list.head;

			const result = hasLoop(list);

			expect(result).toBe(true);
		});

		test("should detect loop when tail points to itself", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);

			// Create loop: tail -> tail
			list.tail!.next = list.tail;

			const result = hasLoop(list);

			expect(result).toBe(true);
		});

		test("should detect loop when tail points to middle node", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			// Get middle node (node with value 3)
			const middleNode = list.get(2);

			// Create loop: tail -> middle
			list.tail!.next = middleNode!;

			const result = hasLoop(list);

			expect(result).toBe(true);
		});

		test("should detect loop when tail points to second node", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			// Get second node (node with value 2)
			const secondNode = list.get(1);

			// Create loop: tail -> second node
			list.tail!.next = secondNode!;

			const result = hasLoop(list);

			expect(result).toBe(true);
		});

		test("should detect small loop (2 nodes)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);

			// Create loop: tail -> head
			list.tail!.next = list.head;

			const result = hasLoop(list);

			expect(result).toBe(true);
		});

		test("should detect loop in single element pointing to itself", () => {
			const list = new SinglyLinkedList<number>(42);

			// Create loop: head -> head (self-loop)
			list.head!.next = list.head;

			const result = hasLoop(list);

			expect(result).toBe(true);
		});

		test("should detect loop in large list", () => {
			const list = new SinglyLinkedList<number>(0);
			for (let i = 1; i < 100; i++) {
				list.push(i);
			}

			// Create loop: tail -> node at index 50
			const loopNode = list.get(50);
			list.tail!.next = loopNode!;

			const result = hasLoop(list);

			expect(result).toBe(true);
		});
	});

	describe("edge cases with loops", () => {
		test("should detect loop when second node points back to first", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);

			// Create loop: second node -> first node
			const firstNode = list.head;
			const secondNode = list.get(1);
			secondNode!.next = firstNode;

			const result = hasLoop(list);

			expect(result).toBe(true);
		});

		test("should work with different data types (strings)", () => {
			const list = new SinglyLinkedList<string>("a");
			list.push("b").push("c").push("d");

			// Create loop
			list.tail!.next = list.head;

			const result = hasLoop(list);

			expect(result).toBe(true);
		});

		test("should work with null values in list", () => {
			const list = new SinglyLinkedList<number | null>(1);
			list.push(null).push(3).push(null).push(5);

			// Create loop
			list.tail!.next = list.get(1)!;

			const result = hasLoop(list);

			expect(result).toBe(true);
		});

		test("should work with objects in list", () => {
			const obj1 = { id: 1 };
			const obj2 = { id: 2 };
			const obj3 = { id: 3 };

			const list = new SinglyLinkedList<typeof obj1>(obj1);
			list.push(obj2).push(obj3);

			// Create loop
			list.tail!.next = list.head;

			const result = hasLoop(list);

			expect(result).toBe(true);
		});
	});

	describe("after list modifications", () => {
		test("should return false after creating and breaking a loop", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);

			// Create loop
			list.tail!.next = list.head;
			expect(hasLoop(list)).toBe(true);

			// Break loop
			list.tail!.next = null;
			expect(hasLoop(list)).toBe(false);
		});

		test("should handle loop after reversing list", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			// Reverse doesn't create a loop
			list.reverse();
			expect(hasLoop(list)).toBe(false);

			// Now create a loop
			list.tail!.next = list.get(1)!;
			expect(hasLoop(list)).toBe(true);
		});

		test("should detect loop remains after pop operation (conceptually)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			// Get a middle node before creating loop
			const middleNode = list.get(2);

			// Create loop pointing to middle
			list.tail!.next = middleNode!;

			// Note: In a real scenario, pop() would not work correctly with a loop
			// This test just verifies hasLoop still detects the loop
			expect(hasLoop(list)).toBe(true);
		});
	});

	describe("algorithm verification", () => {
		test("should detect loop where slow and fast meet at same node", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6);

			// Create loop from tail to third node
			const thirdNode = list.get(2);
			list.tail!.next = thirdNode!;

			const result = hasLoop(list);

			expect(result).toBe(true);
		});

		test("should handle loop with even number of nodes in cycle", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6).push(7).push(8);

			// Create loop: tail -> node at index 4 (creates 4-node cycle)
			const loopNode = list.get(4);
			list.tail!.next = loopNode!;

			const result = hasLoop(list);

			expect(result).toBe(true);
		});

		test("should handle loop with odd number of nodes in cycle", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6).push(7);

			// Create loop: tail -> node at index 4 (creates 3-node cycle)
			const loopNode = list.get(4);
			list.tail!.next = loopNode!;

			const result = hasLoop(list);

			expect(result).toBe(true);
		});
	});
});

/**
 * Test Suite: findKthFromEnd()
 *
 * Tests the two-pointer k-gap algorithm for finding the kth node from the end.
 * Covers: basic functionality, invalid k values, small lists, different data types, large lists, and modifications.
 */
describe("findKthFromEnd()", () => {
	describe("basic functionality", () => {
		test("should find last node (k=1)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);
			const kthNode = findKthFromEnd(list, 1);
			expect(kthNode?.value).toBe(5);
		});

		test("should find second from end (k=2)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);
			const kthNode = findKthFromEnd(list, 2);
			expect(kthNode?.value).toBe(4);
		});

		test("should find middle node using k", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);
			const kthNode = findKthFromEnd(list, 3);
			expect(kthNode?.value).toBe(3);
		});

		test("should find fourth from end (k=4)", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20).push(30).push(40).push(50);
			const kthNode = findKthFromEnd(list, 4);
			expect(kthNode?.value).toBe(20);
		});
	});

	describe("invalid k values", () => {
		test("should return null when k is zero", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);
			const kthNode = findKthFromEnd(list, 0);
			expect(kthNode).toBeNull();
		});

		test("should return null when k is negative", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);
			const kthNode = findKthFromEnd(list, -1);
			expect(kthNode).toBeNull();
		});

		test("should return null when k is greater than list length", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);
			const kthNode = findKthFromEnd(list, 10);
			expect(kthNode).toBeNull();
		});

		test("should return head when k equals list length", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);
			const kthNode = findKthFromEnd(list, 3);
			expect(kthNode?.value).toBe(1); // Returns first element
		});
	});

	describe("edge cases - small lists", () => {
		test("should return null for empty list", () => {
			const list = new SinglyLinkedList<number>();
			const kthNode = findKthFromEnd(list, 1);
			expect(kthNode).toBeNull();
		});

		test("should handle single element list - k=1", () => {
			const list = new SinglyLinkedList<number>(42);
			const kthNode = findKthFromEnd(list, 1);
			expect(kthNode?.value).toBe(42);
		});

		test("should return null for single element list - k=2", () => {
			const list = new SinglyLinkedList<number>(42);
			const kthNode = findKthFromEnd(list, 2);
			expect(kthNode).toBeNull();
		});

		test("should handle two element list - k=1", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);
			const kthNode = findKthFromEnd(list, 1);
			expect(kthNode?.value).toBe(2);
		});

		test("should return head for two element list - k=2", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);
			const kthNode = findKthFromEnd(list, 2);
			expect(kthNode?.value).toBe(1); // Returns first element
		});
	});

	describe("tests with different data types", () => {
		test("should work with string values", () => {
			const list = new SinglyLinkedList<string>("first");
			list.push("second").push("third").push("fourth");
			const kthNode = findKthFromEnd(list, 2);
			expect(kthNode?.value).toBe("third");
		});

		test("should work with boolean values", () => {
			const list = new SinglyLinkedList<boolean>(true);
			list.push(false).push(true).push(false);
			const kthNode = findKthFromEnd(list, 3);
			expect(kthNode?.value).toBe(false);
		});
	});

	describe("large list test", () => {
		test("should handle larger lists efficiently", () => {
			const list = new SinglyLinkedList<number>(1);
			for (let i = 2; i <= 100; i++) {
				list.push(i);
			}
			const kthNode = findKthFromEnd(list, 10);
			expect(kthNode?.value).toBe(91); // 100 - 10 + 1 = 91
		});
	});

	describe("consecutive operations", () => {
		test("should work correctly after multiple list modifications", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			let kthNode = findKthFromEnd(list, 2);
			expect(kthNode?.value).toBe(4);

			list.pop(); // Remove 5
			kthNode = findKthFromEnd(list, 2);
			expect(kthNode?.value).toBe(3);

			list.push(10); // Add 10
			kthNode = findKthFromEnd(list, 1);
			expect(kthNode?.value).toBe(10);
		});

		test("should find correct node after unshift operations", () => {
			const list = new SinglyLinkedList<number>(3);
			list.push(4).push(5);
			list.unshift(2);
			list.unshift(1);
			// List: [1, 2, 3, 4, 5]
			const kthNode = findKthFromEnd(list, 3);
			expect(kthNode?.value).toBe(3);
		});
	});

	describe("algorithm verification", () => {
		test("should maintain correct positioning through entire list", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20).push(30).push(40).push(50);
			// List: [10, 20, 30, 40, 50]

			expect(findKthFromEnd(list, 1)?.value).toBe(50);
			expect(findKthFromEnd(list, 2)?.value).toBe(40);
			expect(findKthFromEnd(list, 3)?.value).toBe(30);
			expect(findKthFromEnd(list, 4)?.value).toBe(20);
			expect(findKthFromEnd(list, 5)?.value).toBe(10); // Returns first element
			expect(findKthFromEnd(list, 6)).toBeNull(); // k > length returns null
		});
	});
});

/**
 * Test Suite: removeDuplicates()
 *
 * Tests the duplicate removal algorithm for linked lists.
 * Covers: basic functionality, edge cases, different data types, and order preservation.
 */
describe("removeDuplicates()", () => {
	describe("basic functionality", () => {
		test("should remove duplicates from list [1, 2, 3, 2, 1, 4]", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(2).push(1).push(4);

			removeDuplicates(list);

			expect(list.peek()).toEqual([1, 2, 3, 4]);
			expect(list.length).toBe(4);
		});

		test("should remove all duplicates leaving only first occurrence", () => {
			const list = new SinglyLinkedList<number>(3);
			list.push(3).push(3);

			removeDuplicates(list);

			expect(list.peek()).toEqual([3]);
			expect(list.length).toBe(1);
		});

		test("should handle list with no duplicates", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			removeDuplicates(list);

			expect(list.peek()).toEqual([1, 2, 3, 4, 5]);
			expect(list.length).toBe(5);
		});

		test("should remove multiple occurrences of same value", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(1).push(1).push(1).push(1);

			removeDuplicates(list);

			expect(list.peek()).toEqual([1]);
			expect(list.length).toBe(1);
		});

		test("should preserve order of first occurrences", () => {
			const list = new SinglyLinkedList<number>(5);
			list.push(2).push(8).push(2).push(5).push(8);

			removeDuplicates(list);

			expect(list.peek()).toEqual([5, 2, 8]);
			expect(list.length).toBe(3);
		});
	});

	describe("edge cases", () => {
		test("should handle empty list", () => {
			const list = new SinglyLinkedList<number>();

			removeDuplicates(list);

			expect(list.peek()).toEqual([]);
			expect(list.length).toBe(0);
		});

		test("should handle single element list", () => {
			const list = new SinglyLinkedList<number>(42);

			removeDuplicates(list);

			expect(list.peek()).toEqual([42]);
			expect(list.length).toBe(1);
		});

		test("should handle two element list with no duplicates", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);

			removeDuplicates(list);

			expect(list.peek()).toEqual([1, 2]);
			expect(list.length).toBe(2);
		});

		test("should handle two element list with duplicates", () => {
			const list = new SinglyLinkedList<number>(5);
			list.push(5);

			removeDuplicates(list);

			expect(list.peek()).toEqual([5]);
			expect(list.length).toBe(1);
		});

		test("should handle list with zero values", () => {
			const list = new SinglyLinkedList<number>(0);
			list.push(0).push(1).push(0).push(2);

			removeDuplicates(list);

			expect(list.peek()).toEqual([0, 1, 2]);
			expect(list.length).toBe(3);
		});

		test("should handle list with negative numbers", () => {
			const list = new SinglyLinkedList<number>(-1);
			list.push(-2).push(-1).push(0).push(-2);

			removeDuplicates(list);

			expect(list.peek()).toEqual([-1, -2, 0]);
			expect(list.length).toBe(3);
		});
	});

	describe("different data types", () => {
		test("should work with strings", () => {
			const list = new SinglyLinkedList<string>("hello");
			list.push("world").push("hello").push("test").push("world");

			removeDuplicates(list);

			expect(list.peek()).toEqual(["hello", "world", "test"]);
			expect(list.length).toBe(3);
		});

		test("should work with booleans", () => {
			const list = new SinglyLinkedList<boolean>(true);
			list.push(false).push(true).push(false).push(true);

			removeDuplicates(list);

			expect(list.peek()).toEqual([true, false]);
			expect(list.length).toBe(2);
		});

		test("should work with mixed case strings", () => {
			const list = new SinglyLinkedList<string>("Hello");
			list.push("hello").push("HELLO").push("Hello");

			removeDuplicates(list);

			expect(list.peek()).toEqual(["Hello", "hello", "HELLO"]);
			expect(list.length).toBe(3);
		});
	});

	describe("pattern tests", () => {
		test("should handle alternating duplicates", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(1).push(2).push(1).push(2);

			removeDuplicates(list);

			expect(list.peek()).toEqual([1, 2]);
			expect(list.length).toBe(2);
		});

		test("should handle duplicates at the end", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(3).push(3);

			removeDuplicates(list);

			expect(list.peek()).toEqual([1, 2, 3]);
			expect(list.length).toBe(3);
		});

		test("should handle duplicates at the beginning", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(1).push(1).push(2).push(3);

			removeDuplicates(list);

			expect(list.peek()).toEqual([1, 2, 3]);
			expect(list.length).toBe(3);
		});

		test("should handle duplicates in the middle", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(2).push(2).push(3);

			removeDuplicates(list);

			expect(list.peek()).toEqual([1, 2, 3]);
			expect(list.length).toBe(3);
		});
	});

	describe("large lists", () => {
		test("should handle large list with many duplicates", () => {
			const list = new SinglyLinkedList<number>(1);
			// Create list: 1,2,3,4,5,1,2,3,4,5,...
			for (let i = 2; i <= 5; i++) list.push(i);
			for (let j = 0; j < 10; j++) {
				for (let i = 1; i <= 5; i++) list.push(i);
			}

			removeDuplicates(list);

			expect(list.peek()).toEqual([1, 2, 3, 4, 5]);
			expect(list.length).toBe(5);
		});

		test("should handle large list with no duplicates", () => {
			const list = new SinglyLinkedList<number>(1);
			for (let i = 2; i <= 100; i++) {
				list.push(i);
			}

			removeDuplicates(list);

			expect(list.length).toBe(100);
			expect(list.peek()[0]).toBe(1);
			expect(list.peek()[99]).toBe(100);
		});
	});

	describe("after list operations", () => {
		test("should work after push operations", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);

			removeDuplicates(list);
			expect(list.peek()).toEqual([1, 2, 3]);

			// Add more with duplicates
			list.push(1).push(4);
			removeDuplicates(list);

			expect(list.peek()).toEqual([1, 2, 3, 4]);
			expect(list.length).toBe(4);
		});

		test("should work after unshift operations", () => {
			const list = new SinglyLinkedList<number>(3);
			list.unshift(2).unshift(1);
			list.push(2).push(3);

			removeDuplicates(list);

			expect(list.peek()).toEqual([1, 2, 3]);
			expect(list.length).toBe(3);
		});

		test("should work after reverse", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(1).push(3);

			list.reverse();
			removeDuplicates(list);

			expect(list.peek()).toEqual([3, 1, 2]);
			expect(list.length).toBe(3);
		});
	});

	describe("head and tail verification", () => {
		test("should maintain correct head after removing duplicates", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(1).push(3);

			removeDuplicates(list);

			expect(list.head?.value).toBe(1);
		});

		test("should work correctly with subsequent operations", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(1).push(2);

			removeDuplicates(list);

			// Should be able to push after removal
			list.push(3);
			expect(list.peek()).toEqual([1, 2, 3]);

			// Should be able to pop after removal
			const popped = list.pop();
			expect(popped?.value).toBe(3);
			expect(list.peek()).toEqual([1, 2]);
		});
	});
});

/**
 * Test Suite: binaryToDecimal()
 *
 * Tests the binary-to-decimal conversion algorithm for linked lists.
 * Covers: basic conversions, edge cases, single bits, and various binary patterns.
 */
describe("binaryToDecimal()", () => {
	describe("basic binary conversions", () => {
		test("should convert binary 1011 (11 in decimal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(0).push(1).push(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(11);
		});

		test("should convert binary 1000 (8 in decimal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(0).push(0).push(0);

			const result = binaryToDecimal(list);

			expect(result).toBe(8);
		});

		test("should convert binary 1111 (15 in decimal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(1).push(1).push(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(15);
		});

		test("should convert binary 10101 (21 in decimal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(0).push(1).push(0).push(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(21);
		});

		test("should convert binary 11001 (25 in decimal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(1).push(0).push(0).push(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(25);
		});
	});

	describe("edge cases", () => {
		test("should return 0 for empty list", () => {
			const list = new SinglyLinkedList<number>();

			const result = binaryToDecimal(list);

			expect(result).toBe(0);
		});

		test("should convert single bit 0", () => {
			const list = new SinglyLinkedList<number>(0);

			const result = binaryToDecimal(list);

			expect(result).toBe(0);
		});

		test("should convert single bit 1", () => {
			const list = new SinglyLinkedList<number>(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(1);
		});

		test("should handle all zeros", () => {
			const list = new SinglyLinkedList<number>(0);
			list.push(0).push(0).push(0);

			const result = binaryToDecimal(list);

			expect(result).toBe(0);
		});
	});

	describe("two-bit numbers", () => {
		test("should convert binary 10 (2 in decimal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(0);

			const result = binaryToDecimal(list);

			expect(result).toBe(2);
		});

		test("should convert binary 11 (3 in decimal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(3);
		});

		test("should convert binary 01 (1 in decimal)", () => {
			const list = new SinglyLinkedList<number>(0);
			list.push(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(1);
		});
	});

	describe("three-bit numbers", () => {
		test("should convert binary 100 (4 in decimal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(0).push(0);

			const result = binaryToDecimal(list);

			expect(result).toBe(4);
		});

		test("should convert binary 101 (5 in decimal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(0).push(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(5);
		});

		test("should convert binary 110 (6 in decimal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(1).push(0);

			const result = binaryToDecimal(list);

			expect(result).toBe(6);
		});

		test("should convert binary 111 (7 in decimal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(1).push(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(7);
		});
	});

	describe("longer binary numbers", () => {
		test("should convert binary 11111111 (255 in decimal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(1).push(1).push(1).push(1).push(1).push(1).push(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(255);
		});

		test("should convert binary 10000000 (128 in decimal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(0).push(0).push(0).push(0).push(0).push(0).push(0);

			const result = binaryToDecimal(list);

			expect(result).toBe(128);
		});

		test("should convert binary 10101010 (170 in decimal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(0).push(1).push(0).push(1).push(0).push(1).push(0);

			const result = binaryToDecimal(list);

			expect(result).toBe(170);
		});

		test("should convert binary 1100110011 (819 in decimal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list
				.push(1)
				.push(0)
				.push(0)
				.push(1)
				.push(1)
				.push(0)
				.push(0)
				.push(1)
				.push(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(819);
		});
	});

	describe("powers of two", () => {
		test("should convert binary 10 (2^1 = 2)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(0);

			const result = binaryToDecimal(list);

			expect(result).toBe(2);
		});

		test("should convert binary 100 (2^2 = 4)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(0).push(0);

			const result = binaryToDecimal(list);

			expect(result).toBe(4);
		});

		test("should convert binary 10000 (2^4 = 16)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(0).push(0).push(0).push(0);

			const result = binaryToDecimal(list);

			expect(result).toBe(16);
		});

		test("should convert binary 100000000 (2^8 = 256)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(0).push(0).push(0).push(0).push(0).push(0).push(0).push(0);

			const result = binaryToDecimal(list);

			expect(result).toBe(256);
		});

		test("should convert binary 1000000000 (2^9 = 512)", () => {
			const list = new SinglyLinkedList<number>(1);
			list
				.push(0)
				.push(0)
				.push(0)
				.push(0)
				.push(0)
				.push(0)
				.push(0)
				.push(0)
				.push(0);

			const result = binaryToDecimal(list);

			expect(result).toBe(512);
		});
	});

	describe("special patterns", () => {
		test("should convert binary with leading zeros 00001 (1 in decimal)", () => {
			const list = new SinglyLinkedList<number>(0);
			list.push(0).push(0).push(0).push(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(1);
		});

		test("should convert binary with leading zeros 000111 (7 in decimal)", () => {
			const list = new SinglyLinkedList<number>(0);
			list.push(0).push(0).push(1).push(1).push(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(7);
		});

		test("should handle large consecutive ones 111111 (63 in decimal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(1).push(1).push(1).push(1).push(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(63);
		});

		test("should handle alternating pattern 010101 (21 in decimal)", () => {
			const list = new SinglyLinkedList<number>(0);
			list.push(1).push(0).push(1).push(0).push(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(21);
		});
	});

	describe("real-world examples", () => {
		test("should convert binary representation of 42", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(0).push(1).push(0).push(1).push(0); // 101010

			const result = binaryToDecimal(list);

			expect(result).toBe(42);
		});

		test("should convert binary representation of 100", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(1).push(0).push(0).push(1).push(0).push(0); // 1100100

			const result = binaryToDecimal(list);

			expect(result).toBe(100);
		});

		test("should convert binary representation of 1024 (2^10)", () => {
			const list = new SinglyLinkedList<number>(1);
			list
				.push(0)
				.push(0)
				.push(0)
				.push(0)
				.push(0)
				.push(0)
				.push(0)
				.push(0)
				.push(0)
				.push(0); // 10000000000

			const result = binaryToDecimal(list);

			expect(result).toBe(1024);
		});

		test("should convert binary representation of 999", () => {
			const list = new SinglyLinkedList<number>(1);
			list
				.push(1)
				.push(1)
				.push(1)
				.push(1)
				.push(0)
				.push(0)
				.push(1)
				.push(1)
				.push(1); // 1111100111

			const result = binaryToDecimal(list);

			expect(result).toBe(999);
		});
	});

	describe("boundary cases", () => {
		test("should handle maximum 8-bit value (255)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(1).push(1).push(1).push(1).push(1).push(1).push(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(255);
		});

		test("should handle maximum 16-bit value (65535)", () => {
			const list = new SinglyLinkedList<number>(1);
			// 1111111111111111
			for (let i = 0; i < 15; i++) {
				list.push(1);
			}

			const result = binaryToDecimal(list);

			expect(result).toBe(65535);
		});

		test("should handle minimum non-zero value (1)", () => {
			const list = new SinglyLinkedList<number>(1);

			const result = binaryToDecimal(list);

			expect(result).toBe(1);
		});
	});
});

/**
 * Test Suite: partitionList()
 *
 * Tests the linked list partition algorithm.
 * Covers: basic partitioning, edge cases, stability, and various partition values.
 */
describe("partitionList()", () => {
	describe("basic partitioning", () => {
		test("should partition list around x=3", () => {
			const list = new SinglyLinkedList<number>(3);
			list.push(5).push(8).push(5).push(10).push(2).push(1);

			partitionList(list, 5);

			const values = list.peek();
			// All values < 5 should come before values >= 5
			const firstPartition = values.filter((v) => v < 5);
			const secondPartition = values.filter((v) => v >= 5);
			expect(values).toEqual([...firstPartition, ...secondPartition]);
			expect(firstPartition).toEqual([3, 2, 1]);
			expect(secondPartition).toEqual([5, 8, 5, 10]);
		});

		test("should partition list around x=3 with mixed values", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(4).push(3).push(2).push(5).push(2);

			partitionList(list, 3);

			const values = list.peek();
			const firstPartition = values.filter((v) => v < 3);
			const secondPartition = values.filter((v) => v >= 3);
			expect(values).toEqual([...firstPartition, ...secondPartition]);
			expect(firstPartition).toEqual([1, 2, 2]);
			expect(secondPartition).toEqual([4, 3, 5]);
		});

		test("should partition around x=5", () => {
			const list = new SinglyLinkedList<number>(3);
			list.push(1).push(8).push(2).push(7).push(4);

			partitionList(list, 5);

			const values = list.peek();
			const firstPartition = values.filter((v) => v < 5);
			const secondPartition = values.filter((v) => v >= 5);
			expect(values).toEqual([...firstPartition, ...secondPartition]);
			expect(firstPartition).toEqual([3, 1, 2, 4]);
			expect(secondPartition).toEqual([8, 7]);
		});
	});

	describe("edge cases", () => {
		test("should handle empty list", () => {
			const list = new SinglyLinkedList<number>();

			partitionList(list, 5);

			expect(list.peek()).toEqual([]);
			expect(list.head).toBeNull();
		});

		test("should handle single element less than x", () => {
			const list = new SinglyLinkedList<number>(3);

			partitionList(list, 5);

			expect(list.peek()).toEqual([3]);
			expect(list.head?.value).toBe(3);
			expect(list.tail?.value).toBe(3);
		});

		test("should handle single element greater than x", () => {
			const list = new SinglyLinkedList<number>(7);

			partitionList(list, 5);

			expect(list.peek()).toEqual([7]);
			expect(list.head?.value).toBe(7);
			expect(list.tail?.value).toBe(7);
		});

		test("should handle single element equal to x", () => {
			const list = new SinglyLinkedList<number>(5);

			partitionList(list, 5);

			expect(list.peek()).toEqual([5]);
			expect(list.head?.value).toBe(5);
		});

		test("should handle two elements", () => {
			const list = new SinglyLinkedList<number>(5);
			list.push(3);

			partitionList(list, 4);

			expect(list.peek()).toEqual([3, 5]);
		});
	});

	describe("all values in one partition", () => {
		test("should handle all values less than x", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			partitionList(list, 10);

			expect(list.peek()).toEqual([1, 2, 3, 4]);
			expect(list.head?.value).toBe(1);
			expect(list.tail?.value).toBe(4);
		});

		test("should handle all values greater than or equal to x", () => {
			const list = new SinglyLinkedList<number>(5);
			list.push(6).push(7).push(8);

			partitionList(list, 3);

			expect(list.peek()).toEqual([5, 6, 7, 8]);
			expect(list.head?.value).toBe(5);
			expect(list.tail?.value).toBe(8);
		});

		test("should handle all values equal to x", () => {
			const list = new SinglyLinkedList<number>(5);
			list.push(5).push(5).push(5);

			partitionList(list, 5);

			expect(list.peek()).toEqual([5, 5, 5, 5]);
		});
	});

	describe("stability check - relative order preserved", () => {
		test("should maintain relative order within less partition", () => {
			const list = new SinglyLinkedList<number>(2);
			list.push(1).push(3).push(4);

			partitionList(list, 5);

			expect(list.peek()).toEqual([2, 1, 3, 4]);
		});

		test("should maintain relative order within greater partition", () => {
			const list = new SinglyLinkedList<number>(7);
			list.push(9).push(6).push(8);

			partitionList(list, 5);

			expect(list.peek()).toEqual([7, 9, 6, 8]);
		});

		test("should maintain relative order in both partitions", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(4).push(2).push(5).push(3).push(6);

			partitionList(list, 4);

			const values = list.peek();
			expect(values.slice(0, 3)).toEqual([1, 2, 3]); // Less partition in order
			expect(values.slice(3)).toEqual([4, 5, 6]); // Greater partition in order
		});
	});

	describe("partition value scenarios", () => {
		test("should partition when x is not in list", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(4).push(5);

			partitionList(list, 3);

			const values = list.peek();
			expect(values.slice(0, 2)).toEqual([1, 2]);
			expect(values.slice(2)).toEqual([4, 5]);
		});

		test("should partition when x is minimum value", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			partitionList(list, 1);

			expect(list.peek()).toEqual([1, 2, 3, 4]);
		});

		test("should partition when x is maximum value", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			partitionList(list, 4);

			expect(list.peek()).toEqual([1, 2, 3, 4]);
		});

		test("should handle negative partition value", () => {
			const list = new SinglyLinkedList<number>(-5);
			list.push(-2).push(-8).push(-1);

			partitionList(list, -3);

			const values = list.peek();
			const firstPartition = values.filter((v) => v < -3);
			const secondPartition = values.filter((v) => v >= -3);
			expect(values).toEqual([...firstPartition, ...secondPartition]);
		});

		test("should handle zero as partition value", () => {
			const list = new SinglyLinkedList<number>(-2);
			list.push(1).push(-1).push(2);

			partitionList(list, 0);

			const values = list.peek();
			expect(values.slice(0, 2)).toEqual([-2, -1]);
			expect(values.slice(2)).toEqual([1, 2]);
		});
	});

	describe("duplicate values", () => {
		test("should handle duplicates across partitions", () => {
			const list = new SinglyLinkedList<number>(3);
			list.push(3).push(5).push(5).push(3).push(3);

			partitionList(list, 4);

			const values = list.peek();
			expect(values.slice(0, 4)).toEqual([3, 3, 3, 3]);
			expect(values.slice(4)).toEqual([5, 5]);
		});

		test("should handle all duplicates in greater partition", () => {
			const list = new SinglyLinkedList<number>(5);
			list.push(5).push(5).push(5);

			partitionList(list, 3);

			expect(list.peek()).toEqual([5, 5, 5, 5]);
		});

		test("should handle all duplicates in less partition", () => {
			const list = new SinglyLinkedList<number>(2);
			list.push(2).push(2).push(2);

			partitionList(list, 5);

			expect(list.peek()).toEqual([2, 2, 2, 2]);
		});
	});

	describe("list integrity", () => {
		test("should maintain correct length", () => {
			const list = new SinglyLinkedList<number>(3);
			list.push(1).push(4).push(2);
			const originalLength = list.length;

			partitionList(list, 3);

			expect(list.length).toBe(originalLength);
		});

		test("should update head correctly", () => {
			const list = new SinglyLinkedList<number>(5);
			list.push(1).push(2);

			partitionList(list, 3);

			expect(list.head?.value).toBe(1); // First value < 3
		});

		test("should update tail correctly", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(5).push(3);

			partitionList(list, 4);

			expect(list.tail?.value).toBe(5); // Last value in list
		});

		test("should not create cycles", () => {
			const list = new SinglyLinkedList<number>(3);
			list.push(1).push(5).push(2);

			partitionList(list, 4);

			// Traverse and ensure no cycle
			let count = 0;
			let current = list.head;
			while (current && count < 100) {
				current = current.next;
				count++;
			}

			expect(count).toBe(4); // Should stop at 4 nodes
			expect(current).toBeNull(); // Should end with null
		});

		test("should work with subsequent operations", () => {
			const list = new SinglyLinkedList<number>(3);
			list.push(1).push(5).push(2);

			partitionList(list, 4);
			list.push(6);

			expect(list.peek()).toEqual([3, 1, 2, 5, 6]);
			expect(list.tail?.value).toBe(6);
		});
	});

	describe("larger lists", () => {
		test("should handle larger list with random values", () => {
			const list = new SinglyLinkedList<number>(5);
			list.push(2).push(8).push(1).push(9).push(3).push(7).push(4).push(6);

			partitionList(list, 5);

			const values = list.peek();
			const firstPartition = values.filter((v) => v < 5);
			const secondPartition = values.filter((v) => v >= 5);
			expect(values).toEqual([...firstPartition, ...secondPartition]);
			expect(firstPartition.length).toBe(4);
			expect(secondPartition.length).toBe(5);
		});

		test("should handle list with many values", () => {
			const list = new SinglyLinkedList<number>(10);
			for (let i = 9; i >= 1; i--) {
				list.push(i);
			}

			partitionList(list, 5);

			const values = list.peek();
			const firstPartition = values.filter((v) => v < 5);
			const secondPartition = values.filter((v) => v >= 5);
			expect(values).toEqual([...firstPartition, ...secondPartition]);
			expect(firstPartition).toEqual([4, 3, 2, 1]);
			expect(secondPartition).toEqual([10, 9, 8, 7, 6, 5]);
		});
	});
});

/**
 * Test Suite: reverseBetween()
 *
 * Tests the partial list reversal algorithm.
 * Covers: middle reversals, edge cases, boundary positions, and list integrity.
 */
describe("reverseBetween()", () => {
	describe("basic reversal scenarios", () => {
		test("should reverse middle portion (positions 2 to 4)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			reverseBetween(list, 2, 4);

			expect(list.peek()).toEqual([1, 4, 3, 2, 5]);
		});

		test("should reverse positions 2 to 3", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			reverseBetween(list, 2, 3);

			expect(list.peek()).toEqual([1, 3, 2, 4]);
		});

		test("should reverse positions 1 to 3", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			reverseBetween(list, 1, 3);

			expect(list.peek()).toEqual([3, 2, 1, 4, 5]);
		});

		test("should reverse positions 3 to 5", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			reverseBetween(list, 3, 5);

			expect(list.peek()).toEqual([1, 2, 5, 4, 3]);
		});
	});

	describe("edge cases", () => {
		test("should handle empty list", () => {
			const list = new SinglyLinkedList<number>();

			reverseBetween(list, 1, 1);

			expect(list.peek()).toEqual([]);
			expect(list.head).toBeNull();
		});

		test("should handle single element (left = right = 1)", () => {
			const list = new SinglyLinkedList<number>(5);

			reverseBetween(list, 1, 1);

			expect(list.peek()).toEqual([5]);
			expect(list.head?.value).toBe(5);
			expect(list.tail?.value).toBe(5);
		});

		test("should handle left = right (no reversal)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			reverseBetween(list, 2, 2);

			expect(list.peek()).toEqual([1, 2, 3, 4]);
		});

		test("should handle left = right at position 3", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			reverseBetween(list, 3, 3);

			expect(list.peek()).toEqual([1, 2, 3, 4, 5]);
		});

		test("should handle two element list reversing both", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);

			reverseBetween(list, 1, 2);

			expect(list.peek()).toEqual([2, 1]);
		});
	});

	describe("boundary positions", () => {
		test("should reverse from head (position 1)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			reverseBetween(list, 1, 4);

			expect(list.peek()).toEqual([4, 3, 2, 1, 5]);
			expect(list.head?.value).toBe(4);
		});

		test("should reverse to tail", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			reverseBetween(list, 2, 5);

			expect(list.peek()).toEqual([1, 5, 4, 3, 2]);
			expect(list.tail?.value).toBe(2);
		});

		test("should reverse entire list (1 to length)", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			reverseBetween(list, 1, 5);

			expect(list.peek()).toEqual([5, 4, 3, 2, 1]);
			expect(list.head?.value).toBe(5);
			expect(list.tail?.value).toBe(1);
		});

		test("should reverse first two nodes", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			reverseBetween(list, 1, 2);

			expect(list.peek()).toEqual([2, 1, 3, 4]);
			expect(list.head?.value).toBe(2);
		});

		test("should reverse last two nodes", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			reverseBetween(list, 3, 4);

			expect(list.peek()).toEqual([1, 2, 4, 3]);
			expect(list.tail?.value).toBe(3);
		});
	});

	describe("adjacent positions", () => {
		test("should reverse two adjacent nodes at start", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);

			reverseBetween(list, 1, 2);

			expect(list.peek()).toEqual([2, 1, 3]);
		});

		test("should reverse two adjacent nodes in middle", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			reverseBetween(list, 2, 3);

			expect(list.peek()).toEqual([1, 3, 2, 4, 5]);
		});

		test("should reverse two adjacent nodes at end", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			reverseBetween(list, 3, 4);

			expect(list.peek()).toEqual([1, 2, 4, 3]);
		});
	});

	describe("larger ranges", () => {
		test("should reverse most of the list", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6).push(7);

			reverseBetween(list, 2, 6);

			expect(list.peek()).toEqual([1, 6, 5, 4, 3, 2, 7]);
		});

		test("should reverse large middle section", () => {
			const list = new SinglyLinkedList<number>(1);
			for (let i = 2; i <= 10; i++) {
				list.push(i);
			}

			reverseBetween(list, 3, 8);

			expect(list.peek()).toEqual([1, 2, 8, 7, 6, 5, 4, 3, 9, 10]);
		});

		test("should handle list with many elements", () => {
			const list = new SinglyLinkedList<number>(1);
			for (let i = 2; i <= 20; i++) {
				list.push(i);
			}

			reverseBetween(list, 5, 15);

			const values = list.peek();
			expect(values.slice(0, 4)).toEqual([1, 2, 3, 4]);
			expect(values.slice(4, 15)).toEqual([
				15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5,
			]);
			expect(values.slice(15)).toEqual([16, 17, 18, 19, 20]);
		});
	});

	describe("list integrity checks", () => {
		test("should maintain correct length", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);
			const originalLength = list.length;

			reverseBetween(list, 2, 4);

			expect(list.length).toBe(originalLength);
		});

		test("should update head when reversing from position 1", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);

			reverseBetween(list, 1, 3);

			expect(list.head?.value).toBe(3);
		});

		test("should update tail when reversing to end", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			reverseBetween(list, 2, 4);

			expect(list.tail?.value).toBe(2);
		});

		test("should not create cycles", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			reverseBetween(list, 2, 4);

			// Traverse and ensure no cycle
			let count = 0;
			let current = list.head;
			while (current && count < 100) {
				current = current.next;
				count++;
			}

			expect(count).toBe(5);
			expect(current).toBeNull();
		});

		test("should work with subsequent operations", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			reverseBetween(list, 2, 3);
			list.push(5);

			expect(list.peek()).toEqual([1, 3, 2, 4, 5]);
			expect(list.tail?.value).toBe(5);
		});
	});

	describe("different data types", () => {
		test("should work with strings", () => {
			const list = new SinglyLinkedList<string>("a");
			list.push("b").push("c").push("d").push("e");

			reverseBetween(list, 2, 4);

			expect(list.peek()).toEqual(["a", "d", "c", "b", "e"]);
		});

		test("should work with negative numbers", () => {
			const list = new SinglyLinkedList<number>(-1);
			list.push(-2).push(-3).push(-4).push(-5);

			reverseBetween(list, 2, 4);

			expect(list.peek()).toEqual([-1, -4, -3, -2, -5]);
		});

		test("should work with mixed positive and negative", () => {
			const list = new SinglyLinkedList<number>(-2);
			list.push(1).push(-1).push(2).push(0);

			reverseBetween(list, 2, 4);

			expect(list.peek()).toEqual([-2, 2, -1, 1, 0]);
		});
	});

	describe("sequential reversals", () => {
		test("should handle multiple reversals", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			reverseBetween(list, 2, 4);
			expect(list.peek()).toEqual([1, 4, 3, 2, 5]);

			reverseBetween(list, 1, 2);
			expect(list.peek()).toEqual([4, 1, 3, 2, 5]);
		});

		test("should handle reversing then reversing back", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);
			const original = list.peek();

			reverseBetween(list, 2, 4);
			reverseBetween(list, 2, 4);

			expect(list.peek()).toEqual(original);
		});
	});

	describe("duplicates", () => {
		test("should handle list with duplicate values", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(2).push(3).push(3);

			reverseBetween(list, 2, 4);

			expect(list.peek()).toEqual([1, 3, 2, 2, 3]);
		});

		test("should handle all same values", () => {
			const list = new SinglyLinkedList<number>(5);
			list.push(5).push(5).push(5);

			reverseBetween(list, 1, 4);

			expect(list.peek()).toEqual([5, 5, 5, 5]);
		});
	});
});

describe("mergeTwoSortedLists()", () => {
	describe("basic merging", () => {
		test("should merge two sorted lists", () => {
			const list1 = new SinglyLinkedList<number>(1);
			list1.push(3).push(5);

			const list2 = new SinglyLinkedList<number>(2);
			list2.push(4).push(6);

			const merged = mergeTwoSortedLists(list1, list2);
			expect(merged.peek()).toEqual([1, 2, 3, 4, 5, 6]);
		});

		test("should merge when first list is smaller", () => {
			const list1 = new SinglyLinkedList<number>(1);
			list1.push(2);

			const list2 = new SinglyLinkedList<number>(3);
			list2.push(4).push(5).push(6);

			const merged = mergeTwoSortedLists(list1, list2);
			expect(merged.peek()).toEqual([1, 2, 3, 4, 5, 6]);
		});

		test("should merge when second list is smaller", () => {
			const list1 = new SinglyLinkedList<number>(1);
			list1.push(3).push(5).push(7);

			const list2 = new SinglyLinkedList<number>(2);
			list2.push(4);

			const merged = mergeTwoSortedLists(list1, list2);
			expect(merged.peek()).toEqual([1, 2, 3, 4, 5, 7]);
		});
	});

	describe("edge cases", () => {
		test("should handle empty first list", () => {
			const list1 = new SinglyLinkedList<number>();
			const list2 = new SinglyLinkedList<number>(1);
			list2.push(2).push(3);

			const merged = mergeTwoSortedLists(list1, list2);
			expect(merged.peek()).toEqual([1, 2, 3]);
		});

		test("should handle empty second list", () => {
			const list1 = new SinglyLinkedList<number>(1);
			list1.push(2).push(3);
			const list2 = new SinglyLinkedList<number>();

			const merged = mergeTwoSortedLists(list1, list2);
			expect(merged.peek()).toEqual([1, 2, 3]);
		});

		test("should handle both lists empty", () => {
			const list1 = new SinglyLinkedList<number>();
			const list2 = new SinglyLinkedList<number>();

			const merged = mergeTwoSortedLists(list1, list2);
			expect(merged.peek()).toEqual([]);
		});

		test("should handle single element lists", () => {
			const list1 = new SinglyLinkedList<number>(1);
			const list2 = new SinglyLinkedList<number>(2);

			const merged = mergeTwoSortedLists(list1, list2);
			expect(merged.peek()).toEqual([1, 2]);
		});
	});

	describe("duplicate values", () => {
		test("should handle duplicate values across lists", () => {
			const list1 = new SinglyLinkedList<number>(1);
			list1.push(3).push(5);

			const list2 = new SinglyLinkedList<number>(1);
			list2.push(3).push(5);

			const merged = mergeTwoSortedLists(list1, list2);
			expect(merged.peek()).toEqual([1, 1, 3, 3, 5, 5]);
		});

		test("should handle all same values", () => {
			const list1 = new SinglyLinkedList<number>(5);
			list1.push(5);

			const list2 = new SinglyLinkedList<number>(5);
			list2.push(5);

			const merged = mergeTwoSortedLists(list1, list2);
			expect(merged.peek()).toEqual([5, 5, 5, 5]);
		});
	});

	describe("negative numbers", () => {
		test("should handle negative numbers", () => {
			const list1 = new SinglyLinkedList<number>(-5);
			list1.push(-1).push(3);

			const list2 = new SinglyLinkedList<number>(-3);
			list2.push(0).push(7);

			const merged = mergeTwoSortedLists(list1, list2);
			expect(merged.peek()).toEqual([-5, -3, -1, 0, 3, 7]);
		});

		test("should handle all negative numbers", () => {
			const list1 = new SinglyLinkedList<number>(-10);
			list1.push(-5);

			const list2 = new SinglyLinkedList<number>(-8);
			list2.push(-3);

			const merged = mergeTwoSortedLists(list1, list2);
			expect(merged.peek()).toEqual([-10, -8, -5, -3]);
		});
	});

	describe("interleaving patterns", () => {
		test("should handle perfectly interleaved lists", () => {
			const list1 = new SinglyLinkedList<number>(1);
			list1.push(3).push(5).push(7);

			const list2 = new SinglyLinkedList<number>(2);
			list2.push(4).push(6).push(8);

			const merged = mergeTwoSortedLists(list1, list2);
			expect(merged.peek()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
		});

		test("should handle one list with all smaller values", () => {
			const list1 = new SinglyLinkedList<number>(1);
			list1.push(2).push(3);

			const list2 = new SinglyLinkedList<number>(10);
			list2.push(20).push(30);

			const merged = mergeTwoSortedLists(list1, list2);
			expect(merged.peek()).toEqual([1, 2, 3, 10, 20, 30]);
		});
	});

	describe("original lists unchanged", () => {
		test("should not modify original lists", () => {
			const list1 = new SinglyLinkedList<number>(1);
			list1.push(3).push(5);

			const list2 = new SinglyLinkedList<number>(2);
			list2.push(4).push(6);

			const original1 = [...list1.peek()];
			const original2 = [...list2.peek()];

			mergeTwoSortedLists(list1, list2);

			// Original lists should be unchanged
			expect(list1.peek()).toEqual(original1);
			expect(list2.peek()).toEqual(original2);
		});
	});

	describe("large lists", () => {
		test("should handle larger lists efficiently", () => {
			const list1 = new SinglyLinkedList<number>();
			const list2 = new SinglyLinkedList<number>();

			// Create two sorted lists with even/odd numbers
			for (let i = 0; i < 50; i += 2) {
				list1.push(i);
			}
			for (let i = 1; i < 50; i += 2) {
				list2.push(i);
			}

			const merged = mergeTwoSortedLists(list1, list2);
			const result = merged.peek();

			expect(result.length).toBe(50);
			// Verify sorted
			for (let i = 0; i < result.length - 1; i++) {
				expect(result[i]).toBeLessThanOrEqual(result[i + 1]!);
			}
		});
	});
});
