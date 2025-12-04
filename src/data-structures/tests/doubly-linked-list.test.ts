import { describe, expect, test } from "bun:test";
import { DoublyLinkedList } from "@/data-structures/doubly-linked-list/doubly-linked-list";

/**
 * Test Suite: DoublyLinkedList
 *
 * Tests the doubly linked list implementation.
 * Covers: constructor, push, bidirectional linking, and edge cases.
 */

describe("DoublyLinkedList", () => {
	describe("constructor", () => {
		test("should create a list with a single node", () => {
			const list = new DoublyLinkedList<number>(10);

			expect(list.head?.value).toBe(10);
			expect(list.tail?.value).toBe(10);
			expect(list.length).toBe(1);
		});

		test("should create node with null prev and next pointers", () => {
			const list = new DoublyLinkedList<number>(5);

			expect(list.head?.prev).toBeNull();
			expect(list.head?.next).toBeNull();
			expect(list.tail?.prev).toBeNull();
			expect(list.tail?.next).toBeNull();
		});

		test("should have head and tail pointing to same node", () => {
			const list = new DoublyLinkedList<number>(7);

			expect(list.head).toBe(list.tail);
		});

		test("should work with different data types - string", () => {
			const list = new DoublyLinkedList<string>("hello");

			expect(list.head?.value).toBe("hello");
			expect(list.length).toBe(1);
		});

		test("should work with different data types - boolean", () => {
			const list = new DoublyLinkedList<boolean>(true);

			expect(list.head?.value).toBe(true);
			expect(list.length).toBe(1);
		});

		test("should work with different data types - object", () => {
			const obj = { id: 1, name: "test" };
			const list = new DoublyLinkedList<typeof obj>(obj);

			expect(list.head?.value).toEqual(obj);
			expect(list.length).toBe(1);
		});

		test("should work with zero value", () => {
			const list = new DoublyLinkedList<number>(0);

			expect(list.head?.value).toBe(0);
			expect(list.length).toBe(1);
		});

		test("should work with negative numbers", () => {
			const list = new DoublyLinkedList<number>(-5);

			expect(list.head?.value).toBe(-5);
			expect(list.length).toBe(1);
		});
	});

	describe("push()", () => {
		describe("basic functionality", () => {
			test("should add a node to the end of the list", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2);

				expect(list.head?.value).toBe(1);
				expect(list.tail?.value).toBe(2);
				expect(list.length).toBe(2);
			});

			test("should add multiple nodes", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);

				expect(list.head?.value).toBe(1);
				expect(list.tail?.value).toBe(4);
				expect(list.length).toBe(4);
			});

			test("should maintain correct order", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				let current = list.head;
				const values: number[] = [];
				while (current) {
					values.push(current.value);
					current = current.next;
				}

				expect(values).toEqual([1, 2, 3]);
			});
		});

		describe("bidirectional linking", () => {
			test("should set next pointers correctly", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				expect(list.head?.next?.value).toBe(2);
				expect(list.head?.next?.next?.value).toBe(3);
				expect(list.head?.next?.next?.next).toBeNull();
			});

			test("should set prev pointers correctly", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				expect(list.tail?.prev?.value).toBe(2);
				expect(list.tail?.prev?.prev?.value).toBe(1);
				expect(list.tail?.prev?.prev?.prev).toBeNull();
			});

			test("should allow backward traversal", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);

				let current = list.tail;
				const values: number[] = [];
				while (current) {
					values.push(current.value);
					current = current.prev;
				}

				expect(values).toEqual([4, 3, 2, 1]);
			});

			test("should allow forward and backward traversal to match", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4).push(5);

				// Forward traversal
				let current = list.head;
				const forward: number[] = [];
				while (current) {
					forward.push(current.value);
					current = current.next;
				}

				// Backward traversal
				current = list.tail;
				const backward: number[] = [];
				while (current) {
					backward.push(current.value);
					current = current.prev;
				}

				expect(forward).toEqual([1, 2, 3, 4, 5]);
				expect(backward).toEqual([5, 4, 3, 2, 1]);
				expect(forward.reverse()).toEqual(backward);
			});

			test("should maintain proper links after multiple pushes", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				const middle = list.head?.next;
				expect(middle?.prev?.value).toBe(1);
				expect(middle?.next?.value).toBe(3);
			});
		});

		describe("method chaining", () => {
			test("should return the list instance", () => {
				const list = new DoublyLinkedList<number>(1);
				const result = list.push(2);

				expect(result).toBe(list);
			});

			test("should support method chaining", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4).push(5);

				expect(list.length).toBe(5);
				expect(list.head?.value).toBe(1);
				expect(list.tail?.value).toBe(5);
			});
		});

		describe("edge cases", () => {
			test("should handle pushing to a single-node list", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2);

				expect(list.head?.value).toBe(1);
				expect(list.tail?.value).toBe(2);
				expect(list.head?.next).toBe(list.tail);
				expect(list.tail?.prev).toBe(list.head);
			});

			test("should handle pushing zero", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(0);

				expect(list.tail?.value).toBe(0);
				expect(list.length).toBe(2);
			});

			test("should handle pushing negative numbers", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(-5);

				expect(list.tail?.value).toBe(-5);
				expect(list.length).toBe(2);
			});

			test("should handle pushing duplicate values", () => {
				const list = new DoublyLinkedList<number>(5);
				list.push(5).push(5);

				expect(list.length).toBe(3);
				let current = list.head;
				let count = 0;
				while (current) {
					expect(current.value).toBe(5);
					count++;
					current = current.next;
				}
				expect(count).toBe(3);
			});
		});

		describe("different data types", () => {
			test("should work with strings", () => {
				const list = new DoublyLinkedList<string>("a");
				list.push("b").push("c");

				let current = list.head;
				const values: string[] = [];
				while (current) {
					values.push(current.value);
					current = current.next;
				}

				expect(values).toEqual(["a", "b", "c"]);
			});

			test("should work with booleans", () => {
				const list = new DoublyLinkedList<boolean>(true);
				list.push(false).push(true);

				expect(list.head?.value).toBe(true);
				expect(list.head?.next?.value).toBe(false);
				expect(list.tail?.value).toBe(true);
			});

			test("should work with objects", () => {
				const list = new DoublyLinkedList<{ id: number }>({ id: 1 });
				list.push({ id: 2 }).push({ id: 3 });

				expect(list.head?.value.id).toBe(1);
				expect(list.tail?.value.id).toBe(3);
				expect(list.length).toBe(3);
			});

			test("should work with arrays", () => {
				const list = new DoublyLinkedList<number[]>([1, 2]);
				list.push([3, 4]).push([5, 6]);

				expect(list.head?.value).toEqual([1, 2]);
				expect(list.tail?.value).toEqual([5, 6]);
			});
		});

		describe("length updates", () => {
			test("should increment length correctly", () => {
				const list = new DoublyLinkedList<number>(1);
				expect(list.length).toBe(1);

				list.push(2);
				expect(list.length).toBe(2);

				list.push(3);
				expect(list.length).toBe(3);
			});

			test("should track length for many pushes", () => {
				const list = new DoublyLinkedList<number>(1);
				for (let i = 2; i <= 100; i++) {
					list.push(i);
				}

				expect(list.length).toBe(100);
			});
		});

		describe("head and tail integrity", () => {
			test("should keep head unchanged when pushing", () => {
				const list = new DoublyLinkedList<number>(1);
				const originalHead = list.head;

				list.push(2).push(3).push(4);

				expect(list.head).toBe(originalHead);
				expect(list.head?.value).toBe(1);
			});

			test("should update tail with each push", () => {
				const list = new DoublyLinkedList<number>(1);

				list.push(2);
				expect(list.tail?.value).toBe(2);

				list.push(3);
				expect(list.tail?.value).toBe(3);

				list.push(4);
				expect(list.tail?.value).toBe(4);
			});

			test("should maintain tail.next as null", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				expect(list.tail?.next).toBeNull();
			});

			test("should maintain head.prev as null", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				expect(list.head?.prev).toBeNull();
			});
		});

		describe("large lists", () => {
			test("should handle pushing many elements", () => {
				const list = new DoublyLinkedList<number>(1);
				for (let i = 2; i <= 1000; i++) {
					list.push(i);
				}

				expect(list.length).toBe(1000);
				expect(list.head?.value).toBe(1);
				expect(list.tail?.value).toBe(1000);
			});

			test("should maintain proper links in large list", () => {
				const list = new DoublyLinkedList<number>(1);
				for (let i = 2; i <= 50; i++) {
					list.push(i);
				}

				// Traverse forward
				let count = 0;
				let current = list.head;
				while (current) {
					count++;
					current = current.next;
				}
				expect(count).toBe(50);

				// Traverse backward
				count = 0;
				current = list.tail;
				while (current) {
					count++;
					current = current.prev;
				}
				expect(count).toBe(50);
			});
		});
	});

	describe("integration scenarios", () => {
		test("should handle complex sequence of operations", () => {
			const list = new DoublyLinkedList<number>(10);
			list.push(20).push(30).push(40);

			expect(list.length).toBe(4);
			expect(list.head?.value).toBe(10);
			expect(list.tail?.value).toBe(40);

			// Verify complete chain
			expect(list.head?.next?.value).toBe(20);
			expect(list.head?.next?.next?.value).toBe(30);
			expect(list.head?.next?.next?.next?.value).toBe(40);

			// Verify backward chain
			expect(list.tail?.prev?.value).toBe(30);
			expect(list.tail?.prev?.prev?.value).toBe(20);
			expect(list.tail?.prev?.prev?.prev?.value).toBe(10);
		});

		test("should verify circular-like traversal pattern", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3);

			// Go forward to tail then back to head
			const forwardToTail = list.head?.next?.next;
			expect(forwardToTail?.value).toBe(3);

			const backToHead = forwardToTail?.prev?.prev;
			expect(backToHead?.value).toBe(1);
			expect(backToHead).toBe(list.head);
		});
	});

	describe("pop()", () => {
		describe("basic functionality", () => {
			test("should remove and return the last node", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				const popped = list.pop();

				expect(popped?.value).toBe(3);
				expect(list.length).toBe(2);
				expect(list.tail?.value).toBe(2);
			});

			test("should remove multiple nodes correctly", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);

				const first = list.pop();
				expect(first?.value).toBe(4);
				expect(list.length).toBe(3);

				const second = list.pop();
				expect(second?.value).toBe(3);
				expect(list.length).toBe(2);

				const third = list.pop();
				expect(third?.value).toBe(2);
				expect(list.length).toBe(1);
			});

			test("should maintain correct order after pop", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);

				list.pop();

				let current = list.head;
				const values: number[] = [];
				while (current) {
					values.push(current.value);
					current = current.next;
				}

				expect(values).toEqual([1, 2, 3]);
			});
		});

		describe("edge cases", () => {
			test("should return undefined when popping from empty list", () => {
				const list = new DoublyLinkedList<number>(1);
				list.pop(); // Remove the only element

				const result = list.pop(); // Try to pop from empty list

				expect(result).toBeUndefined();
				expect(list.length).toBe(0);
				expect(list.head).toBeNull();
				expect(list.tail).toBeNull();
			});

			test("should handle popping from single element list", () => {
				const list = new DoublyLinkedList<number>(5);

				const popped = list.pop();

				expect(popped?.value).toBe(5);
				expect(list.length).toBe(0);
				expect(list.head).toBeNull();
				expect(list.tail).toBeNull();
			});

			test("should handle popping from two element list", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2);

				const popped = list.pop();

				expect(popped?.value).toBe(2);
				expect(list.length).toBe(1);
				expect(list.head?.value).toBe(1);
				expect(list.tail?.value).toBe(1);
				expect(list.head).toBe(list.tail);
			});

			test("should handle popping all elements", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				list.pop();
				list.pop();
				list.pop();

				expect(list.length).toBe(0);
				expect(list.head).toBeNull();
				expect(list.tail).toBeNull();
			});
		});

		describe("pointer cleanup", () => {
			test("should set new tail.next to null", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				list.pop();

				expect(list.tail?.next).toBeNull();
			});

			test("should disconnect removed node's prev pointer", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				const popped = list.pop();

				expect(popped?.prev).toBeNull();
				expect(popped?.next).toBeNull();
			});

			test("should maintain head.prev as null", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				list.pop();

				expect(list.head?.prev).toBeNull();
			});
		});

		describe("bidirectional integrity after pop", () => {
			test("should maintain backward traversal after pop", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);

				list.pop();

				let current = list.tail;
				const values: number[] = [];
				while (current) {
					values.push(current.value);
					current = current.prev;
				}

				expect(values).toEqual([3, 2, 1]);
			});

			test("should maintain forward traversal after pop", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);

				list.pop();

				let current = list.head;
				const values: number[] = [];
				while (current) {
					values.push(current.value);
					current = current.next;
				}

				expect(values).toEqual([1, 2, 3]);
			});

			test("should maintain proper links after multiple pops", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4).push(5);

				list.pop();
				list.pop();

				// Check forward links
				expect(list.head?.next?.value).toBe(2);
				expect(list.head?.next?.next?.value).toBe(3);
				expect(list.head?.next?.next?.next).toBeNull();

				// Check backward links
				expect(list.tail?.prev?.value).toBe(2);
				expect(list.tail?.prev?.prev?.value).toBe(1);
				expect(list.tail?.prev?.prev?.prev).toBeNull();
			});
		});

		describe("head and tail updates", () => {
			test("should keep head unchanged when popping", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);
				const originalHead = list.head;

				list.pop();

				expect(list.head).toBe(originalHead);
				expect(list.head?.value).toBe(1);
			});

			test("should update tail correctly", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);

				list.pop();
				expect(list.tail?.value).toBe(3);

				list.pop();
				expect(list.tail?.value).toBe(2);

				list.pop();
				expect(list.tail?.value).toBe(1);
			});

			test("should set both head and tail to null when last element is popped", () => {
				const list = new DoublyLinkedList<number>(1);

				list.pop();

				expect(list.head).toBeNull();
				expect(list.tail).toBeNull();
			});
		});

		describe("length updates", () => {
			test("should decrement length correctly", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				expect(list.length).toBe(3);

				list.pop();
				expect(list.length).toBe(2);

				list.pop();
				expect(list.length).toBe(1);

				list.pop();
				expect(list.length).toBe(0);
			});

			test("should not go below zero length", () => {
				const list = new DoublyLinkedList<number>(1);

				list.pop();
				list.pop(); // Try to pop from empty list

				expect(list.length).toBe(0);
			});
		});

		describe("return value", () => {
			test("should return the removed node", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				const popped = list.pop();

				expect(popped).toBeDefined();
				expect(popped?.value).toBe(3);
			});

			test("should return node with expected structure", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20);

				const popped = list.pop();

				expect(popped).toHaveProperty("value");
				expect(popped).toHaveProperty("prev");
				expect(popped).toHaveProperty("next");
			});

			test("should return undefined for empty list", () => {
				const list = new DoublyLinkedList<number>(1);
				list.pop();

				const result = list.pop();

				expect(result).toBeUndefined();
			});
		});

		describe("different data types", () => {
			test("should work with strings", () => {
				const list = new DoublyLinkedList<string>("a");
				list.push("b").push("c");

				const popped = list.pop();

				expect(popped?.value).toBe("c");
				expect(list.tail?.value).toBe("b");
			});

			test("should work with booleans", () => {
				const list = new DoublyLinkedList<boolean>(true);
				list.push(false).push(true);

				const popped = list.pop();

				expect(popped?.value).toBe(true);
				expect(list.length).toBe(2);
			});

			test("should work with objects", () => {
				const list = new DoublyLinkedList<{ id: number }>({ id: 1 });
				list.push({ id: 2 }).push({ id: 3 });

				const popped = list.pop();

				expect(popped?.value.id).toBe(3);
				expect(list.tail?.value.id).toBe(2);
			});
		});

		describe("alternating operations", () => {
			test("should handle alternating push and pop", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2);
				list.pop();
				list.push(3);
				list.pop();
				list.push(4);

				expect(list.length).toBe(2);
				expect(list.tail?.value).toBe(4);
			});

			test("should handle push after popping all elements", () => {
				const list = new DoublyLinkedList<number>(1);
				list.pop();
				list.push(5);

				expect(list.length).toBe(1);
				expect(list.head?.value).toBe(5);
				expect(list.tail?.value).toBe(5);
			});

			test("should maintain integrity with complex operations", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);
				list.pop();
				list.push(5);
				list.pop();
				list.pop();

				expect(list.length).toBe(2);
				expect(list.head?.value).toBe(1);
				expect(list.tail?.value).toBe(2);
			});
		});

		describe("large lists", () => {
			test("should handle popping from large list", () => {
				const list = new DoublyLinkedList<number>(1);
				for (let i = 2; i <= 100; i++) {
					list.push(i);
				}

				for (let i = 0; i < 50; i++) {
					list.pop();
				}

				expect(list.length).toBe(50);
				expect(list.tail?.value).toBe(50);
			});

			test("should maintain links in large list after pops", () => {
				const list = new DoublyLinkedList<number>(1);
				for (let i = 2; i <= 20; i++) {
					list.push(i);
				}

				for (let i = 0; i < 10; i++) {
					list.pop();
				}

				// Verify forward traversal
				let count = 0;
				let current = list.head;
				while (current) {
					count++;
					current = current.next;
				}
				expect(count).toBe(10);

				// Verify backward traversal
				count = 0;
				current = list.tail;
				while (current) {
					count++;
					current = current.prev;
				}
				expect(count).toBe(10);
			});
		});
	});

	describe("unshift()", () => {
		describe("basic functionality", () => {
			test("should add a node to the beginning of the list", () => {
				const list = new DoublyLinkedList<number>(2);
				list.unshift(1);

				expect(list.head?.value).toBe(1);
				expect(list.tail?.value).toBe(2);
				expect(list.length).toBe(2);
			});

			test("should add multiple nodes to the beginning", () => {
				const list = new DoublyLinkedList<number>(3);
				list.unshift(2).unshift(1).unshift(0);

				expect(list.head?.value).toBe(0);
				expect(list.tail?.value).toBe(3);
				expect(list.length).toBe(4);
			});

			test("should maintain correct order", () => {
				const list = new DoublyLinkedList<number>(3);
				list.unshift(2).unshift(1);

				let current = list.head;
				const values: number[] = [];
				while (current) {
					values.push(current.value);
					current = current.next;
				}

				expect(values).toEqual([1, 2, 3]);
			});
		});

		describe("bidirectional linking", () => {
			test("should set next pointers correctly", () => {
				const list = new DoublyLinkedList<number>(3);
				list.unshift(2).unshift(1);

				expect(list.head?.next?.value).toBe(2);
				expect(list.head?.next?.next?.value).toBe(3);
				expect(list.head?.next?.next?.next).toBeNull();
			});

			test("should set prev pointers correctly", () => {
				const list = new DoublyLinkedList<number>(3);
				list.unshift(2).unshift(1);

				expect(list.tail?.prev?.value).toBe(2);
				expect(list.tail?.prev?.prev?.value).toBe(1);
				expect(list.tail?.prev?.prev?.prev).toBeNull();
			});

			test("should allow backward traversal", () => {
				const list = new DoublyLinkedList<number>(4);
				list.unshift(3).unshift(2).unshift(1);

				let current = list.tail;
				const values: number[] = [];
				while (current) {
					values.push(current.value);
					current = current.prev;
				}

				expect(values).toEqual([4, 3, 2, 1]);
			});

			test("should allow forward and backward traversal to match", () => {
				const list = new DoublyLinkedList<number>(5);
				list.unshift(4).unshift(3).unshift(2).unshift(1);

				// Forward traversal
				let current = list.head;
				const forward: number[] = [];
				while (current) {
					forward.push(current.value);
					current = current.next;
				}

				// Backward traversal
				current = list.tail;
				const backward: number[] = [];
				while (current) {
					backward.push(current.value);
					current = current.prev;
				}

				expect(forward).toEqual([1, 2, 3, 4, 5]);
				expect(backward).toEqual([5, 4, 3, 2, 1]);
				expect(forward.reverse()).toEqual(backward);
			});

			test("should maintain proper links after multiple unshifts", () => {
				const list = new DoublyLinkedList<number>(3);
				list.unshift(2).unshift(1);

				const middle = list.head?.next;
				expect(middle?.prev?.value).toBe(1);
				expect(middle?.next?.value).toBe(3);
			});
		});

		describe("method chaining", () => {
			test("should return the list instance", () => {
				const list = new DoublyLinkedList<number>(2);
				const result = list.unshift(1);

				expect(result).toBe(list);
			});

			test("should support method chaining", () => {
				const list = new DoublyLinkedList<number>(5);
				list.unshift(4).unshift(3).unshift(2).unshift(1);

				expect(list.length).toBe(5);
				expect(list.head?.value).toBe(1);
				expect(list.tail?.value).toBe(5);
			});
		});

		describe("edge cases", () => {
			test("should handle unshifting to empty list after pop", () => {
				const list = new DoublyLinkedList<number>(1);
				list.pop(); // Make list empty
				list.unshift(2);

				expect(list.head?.value).toBe(2);
				expect(list.tail?.value).toBe(2);
				expect(list.head).toBe(list.tail);
				expect(list.length).toBe(1);
			});

			test("should handle unshifting to single-node list", () => {
				const list = new DoublyLinkedList<number>(2);
				list.unshift(1);

				expect(list.head?.value).toBe(1);
				expect(list.tail?.value).toBe(2);
				expect(list.head?.next).toBe(list.tail);
				expect(list.tail?.prev).toBe(list.head);
			});

			test("should handle unshifting zero", () => {
				const list = new DoublyLinkedList<number>(1);
				list.unshift(0);

				expect(list.head?.value).toBe(0);
				expect(list.length).toBe(2);
			});

			test("should handle unshifting negative numbers", () => {
				const list = new DoublyLinkedList<number>(1);
				list.unshift(-5);

				expect(list.head?.value).toBe(-5);
				expect(list.length).toBe(2);
			});

			test("should handle unshifting duplicate values", () => {
				const list = new DoublyLinkedList<number>(5);
				list.unshift(5).unshift(5);

				expect(list.length).toBe(3);
				let current = list.head;
				let count = 0;
				while (current) {
					expect(current.value).toBe(5);
					count++;
					current = current.next;
				}
				expect(count).toBe(3);
			});
		});

		describe("different data types", () => {
			test("should work with strings", () => {
				const list = new DoublyLinkedList<string>("c");
				list.unshift("b").unshift("a");

				let current = list.head;
				const values: string[] = [];
				while (current) {
					values.push(current.value);
					current = current.next;
				}

				expect(values).toEqual(["a", "b", "c"]);
			});

			test("should work with booleans", () => {
				const list = new DoublyLinkedList<boolean>(true);
				list.unshift(false).unshift(true);

				expect(list.head?.value).toBe(true);
				expect(list.head?.next?.value).toBe(false);
				expect(list.tail?.value).toBe(true);
			});

			test("should work with objects", () => {
				const list = new DoublyLinkedList<{ id: number }>({ id: 3 });
				list.unshift({ id: 2 }).unshift({ id: 1 });

				expect(list.head?.value.id).toBe(1);
				expect(list.tail?.value.id).toBe(3);
				expect(list.length).toBe(3);
			});

			test("should work with arrays", () => {
				const list = new DoublyLinkedList<number[]>([5, 6]);
				list.unshift([3, 4]).unshift([1, 2]);

				expect(list.head?.value).toEqual([1, 2]);
				expect(list.tail?.value).toEqual([5, 6]);
			});
		});

		describe("length updates", () => {
			test("should increment length correctly", () => {
				const list = new DoublyLinkedList<number>(3);
				expect(list.length).toBe(1);

				list.unshift(2);
				expect(list.length).toBe(2);

				list.unshift(1);
				expect(list.length).toBe(3);
			});

			test("should track length for many unshifts", () => {
				const list = new DoublyLinkedList<number>(100);
				for (let i = 99; i >= 1; i--) {
					list.unshift(i);
				}

				expect(list.length).toBe(100);
			});
		});

		describe("head and tail integrity", () => {
			test("should update head with each unshift", () => {
				const list = new DoublyLinkedList<number>(3);

				list.unshift(2);
				expect(list.head?.value).toBe(2);

				list.unshift(1);
				expect(list.head?.value).toBe(1);

				list.unshift(0);
				expect(list.head?.value).toBe(0);
			});

			test("should keep tail unchanged when unshifting", () => {
				const list = new DoublyLinkedList<number>(1);
				const originalTail = list.tail;

				list.unshift(2).unshift(3).unshift(4);

				expect(list.tail).toBe(originalTail);
				expect(list.tail?.value).toBe(1);
			});

			test("should maintain head.prev as null", () => {
				const list = new DoublyLinkedList<number>(3);
				list.unshift(2).unshift(1);

				expect(list.head?.prev).toBeNull();
			});

			test("should maintain tail.next as null", () => {
				const list = new DoublyLinkedList<number>(1);
				list.unshift(2).unshift(3);

				expect(list.tail?.next).toBeNull();
			});
		});

		describe("mixed operations with push", () => {
			test("should work correctly with push operations", () => {
				const list = new DoublyLinkedList<number>(3);
				list.unshift(2).push(4).unshift(1).push(5);

				expect(list.head?.value).toBe(1);
				expect(list.tail?.value).toBe(5);
				expect(list.length).toBe(5);

				let current = list.head;
				const values: number[] = [];
				while (current) {
					values.push(current.value);
					current = current.next;
				}

				expect(values).toEqual([1, 2, 3, 4, 5]);
			});

			test("should maintain bidirectional links with mixed operations", () => {
				const list = new DoublyLinkedList<number>(3);
				list.push(4).unshift(2).push(5).unshift(1);

				// Forward traversal
				let current = list.head;
				const forward: number[] = [];
				while (current) {
					forward.push(current.value);
					current = current.next;
				}

				// Backward traversal
				current = list.tail;
				const backward: number[] = [];
				while (current) {
					backward.push(current.value);
					current = current.prev;
				}

				expect(forward).toEqual([1, 2, 3, 4, 5]);
				expect(backward).toEqual([5, 4, 3, 2, 1]);
			});
		});

		describe("large lists", () => {
			test("should handle unshifting many elements", () => {
				const list = new DoublyLinkedList<number>(1000);
				for (let i = 999; i >= 1; i--) {
					list.unshift(i);
				}

				expect(list.length).toBe(1000);
				expect(list.head?.value).toBe(1);
				expect(list.tail?.value).toBe(1000);
			});

			test("should maintain proper links in large list", () => {
				const list = new DoublyLinkedList<number>(50);
				for (let i = 49; i >= 1; i--) {
					list.unshift(i);
				}

				// Traverse forward
				let count = 0;
				let current = list.head;
				while (current) {
					count++;
					current = current.next;
				}
				expect(count).toBe(50);

				// Traverse backward
				count = 0;
				current = list.tail;
				while (current) {
					count++;
					current = current.prev;
				}
				expect(count).toBe(50);
			});
		});

		describe("integration scenarios", () => {
			test("should handle complex sequence of operations", () => {
				const list = new DoublyLinkedList<number>(10);
				list.unshift(5).push(15).unshift(0).push(20);

				expect(list.length).toBe(5);
				expect(list.head?.value).toBe(0);
				expect(list.tail?.value).toBe(20);

				// Verify complete forward chain
				expect(list.head?.next?.value).toBe(5);
				expect(list.head?.next?.next?.value).toBe(10);
				expect(list.head?.next?.next?.next?.value).toBe(15);
				expect(list.head?.next?.next?.next?.next?.value).toBe(20);

				// Verify complete backward chain
				expect(list.tail?.prev?.value).toBe(15);
				expect(list.tail?.prev?.prev?.value).toBe(10);
				expect(list.tail?.prev?.prev?.prev?.value).toBe(5);
				expect(list.tail?.prev?.prev?.prev?.prev?.value).toBe(0);
			});

			test("should work with pop after unshift", () => {
				const list = new DoublyLinkedList<number>(3);
				list.unshift(2).unshift(1);
				const popped = list.pop();

				expect(popped?.value).toBe(3);
				expect(list.length).toBe(2);
				expect(list.head?.value).toBe(1);
				expect(list.tail?.value).toBe(2);
			});
		});
	});

	describe("shift()", () => {
		describe("basic functionality", () => {
			test("should remove and return the first node", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);
				const removed = list.shift();

				expect(removed?.value).toBe(1);
				expect(list.head?.value).toBe(2);
				expect(list.tail?.value).toBe(3);
				expect(list.length).toBe(2);
			});

			test("should remove multiple nodes correctly", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);

				const first = list.shift();
				const second = list.shift();

				expect(first?.value).toBe(1);
				expect(second?.value).toBe(2);
				expect(list.head?.value).toBe(3);
				expect(list.tail?.value).toBe(4);
				expect(list.length).toBe(2);
			});

			test("should maintain correct order after shift", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);
				list.shift();

				let current = list.head;
				const values: number[] = [];
				while (current) {
					values.push(current.value);
					current = current.next;
				}

				expect(values).toEqual([2, 3, 4]);
			});
		});

		describe("edge cases", () => {
			test("should return undefined when shifting from empty list", () => {
				const list = new DoublyLinkedList<number>(1);
				list.pop(); // Make list empty
				const removed = list.shift();

				expect(removed).toBeUndefined();
				expect(list.length).toBe(0);
				expect(list.head).toBeNull();
				expect(list.tail).toBeNull();
			});

			test("should handle shifting from single element list", () => {
				const list = new DoublyLinkedList<number>(42);
				const removed = list.shift();

				expect(removed?.value).toBe(42);
				expect(list.head).toBeNull();
				expect(list.tail).toBeNull();
				expect(list.length).toBe(0);
			});

			test("should handle shifting from two element list", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2);
				const removed = list.shift();

				expect(removed?.value).toBe(1);
				expect(list.head?.value).toBe(2);
				expect(list.tail?.value).toBe(2);
				expect(list.head).toBe(list.tail);
				expect(list.length).toBe(1);
			});

			test("should handle shifting all elements", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				list.shift();
				list.shift();
				list.shift();

				expect(list.head).toBeNull();
				expect(list.tail).toBeNull();
				expect(list.length).toBe(0);
			});
		});

		describe("pointer cleanup", () => {
			test("should set new head.prev to null", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);
				list.shift();

				expect(list.head?.prev).toBeNull();
			});

			test("should disconnect removed node's next pointer", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);
				const removed = list.shift();

				expect(removed?.next).toBeNull();
			});

			test("should disconnect removed node's prev pointer", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);
				const removed = list.shift();

				expect(removed?.prev).toBeNull();
			});

			test("should maintain tail.next as null", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);
				list.shift();

				expect(list.tail?.next).toBeNull();
			});
		});

		describe("bidirectional integrity after shift", () => {
			test("should maintain backward traversal after shift", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);
				list.shift();

				let current = list.tail;
				const values: number[] = [];
				while (current) {
					values.push(current.value);
					current = current.prev;
				}

				expect(values).toEqual([4, 3, 2]);
			});

			test("should maintain forward traversal after shift", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);
				list.shift();

				let current = list.head;
				const values: number[] = [];
				while (current) {
					values.push(current.value);
					current = current.next;
				}

				expect(values).toEqual([2, 3, 4]);
			});

			test("should maintain proper links after multiple shifts", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4).push(5);
				list.shift();
				list.shift();

				const second = list.head;
				expect(second?.value).toBe(3);
				expect(second?.prev).toBeNull();
				expect(second?.next?.value).toBe(4);
			});

			test("should maintain bidirectional integrity", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);
				list.shift();

				// Forward traversal
				let current = list.head;
				const forward: number[] = [];
				while (current) {
					forward.push(current.value);
					current = current.next;
				}

				// Backward traversal
				current = list.tail;
				const backward: number[] = [];
				while (current) {
					backward.push(current.value);
					current = current.prev;
				}

				expect(forward).toEqual([2, 3, 4]);
				expect(backward).toEqual([4, 3, 2]);
				expect(forward.reverse()).toEqual(backward);
			});
		});

		describe("head and tail updates", () => {
			test("should update head correctly", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				list.shift();
				expect(list.head?.value).toBe(2);

				list.shift();
				expect(list.head?.value).toBe(3);
			});

			test("should keep tail unchanged when shifting", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);
				const originalTail = list.tail;

				list.shift();

				expect(list.tail).toBe(originalTail);
				expect(list.tail?.value).toBe(3);
			});

			test("should set both head and tail to null when last element is shifted", () => {
				const list = new DoublyLinkedList<number>(1);
				list.shift();

				expect(list.head).toBeNull();
				expect(list.tail).toBeNull();
			});
		});

		describe("length updates", () => {
			test("should decrement length correctly", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);
				expect(list.length).toBe(3);

				list.shift();
				expect(list.length).toBe(2);

				list.shift();
				expect(list.length).toBe(1);
			});

			test("should not go below zero length", () => {
				const list = new DoublyLinkedList<number>(1);
				list.shift();
				list.shift(); // Attempt to shift from empty list

				expect(list.length).toBe(0);
			});
		});

		describe("return value", () => {
			test("should return the removed node", () => {
				const list = new DoublyLinkedList<number>(42);
				list.push(99);
				const removed = list.shift();

				expect(removed).toBeDefined();
				expect(removed?.value).toBe(42);
			});

			test("should return node with expected structure", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20);
				const removed = list.shift();

				expect(removed).toHaveProperty("value");
				expect(removed).toHaveProperty("next");
				expect(removed).toHaveProperty("prev");
				expect(removed?.value).toBe(10);
			});

			test("should return undefined for empty list", () => {
				const list = new DoublyLinkedList<number>(1);
				list.pop();
				const removed = list.shift();

				expect(removed).toBeUndefined();
			});
		});

		describe("different data types", () => {
			test("should work with strings", () => {
				const list = new DoublyLinkedList<string>("first");
				list.push("second").push("third");
				const removed = list.shift();

				expect(removed?.value).toBe("first");
				expect(list.head?.value).toBe("second");
			});

			test("should work with booleans", () => {
				const list = new DoublyLinkedList<boolean>(true);
				list.push(false).push(true);
				const removed = list.shift();

				expect(removed?.value).toBe(true);
				expect(list.head?.value).toBe(false);
			});

			test("should work with objects", () => {
				const list = new DoublyLinkedList<{ id: number }>({ id: 1 });
				list.push({ id: 2 }).push({ id: 3 });
				const removed = list.shift();

				expect(removed?.value.id).toBe(1);
				expect(list.head?.value.id).toBe(2);
			});
		});

		describe("alternating operations", () => {
			test("should handle alternating push and shift", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2); // [1, 2]
				list.shift(); // [2]
				list.push(3); // [2, 3]
				list.shift(); // [3]
				list.push(4); // [3, 4]

				expect(list.head?.value).toBe(3);
				expect(list.tail?.value).toBe(4);
				expect(list.length).toBe(2);
			});

			test("should handle push after shifting all elements", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2);
				list.shift();
				list.shift();
				list.push(3);

				expect(list.head?.value).toBe(3);
				expect(list.tail?.value).toBe(3);
				expect(list.length).toBe(1);
			});

			test("should maintain integrity with complex operations", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);
				list.shift();
				list.unshift(5);
				list.shift();
				list.push(6);

				let current = list.head;
				const values: number[] = [];
				while (current) {
					values.push(current.value);
					current = current.next;
				}

				expect(values).toEqual([2, 3, 4, 6]);
			});
		});

		describe("large lists", () => {
			test("should handle shifting from large list", () => {
				const list = new DoublyLinkedList<number>(1);
				for (let i = 2; i <= 100; i++) {
					list.push(i);
				}

				const removed = list.shift();

				expect(removed?.value).toBe(1);
				expect(list.head?.value).toBe(2);
				expect(list.tail?.value).toBe(100);
				expect(list.length).toBe(99);
			});

			test("should maintain links in large list after shifts", () => {
				const list = new DoublyLinkedList<number>(1);
				for (let i = 2; i <= 50; i++) {
					list.push(i);
				}

				// Shift first 10 elements
				for (let i = 0; i < 10; i++) {
					list.shift();
				}

				expect(list.length).toBe(40);
				expect(list.head?.value).toBe(11);
				expect(list.head?.prev).toBeNull();

				// Traverse forward
				let count = 0;
				let current = list.head;
				while (current) {
					count++;
					current = current.next;
				}
				expect(count).toBe(40);

				// Traverse backward
				count = 0;
				current = list.tail;
				while (current) {
					count++;
					current = current.prev;
				}
				expect(count).toBe(40);
			});
		});

		describe("mixed operations with unshift", () => {
			test("should work correctly with unshift operations", () => {
				const list = new DoublyLinkedList<number>(3);
				list.unshift(2).unshift(1); // [1, 2, 3]
				list.shift(); // [2, 3]
				list.push(4); // [2, 3, 4]
				list.shift(); // [3, 4]

				expect(list.head?.value).toBe(3);
				expect(list.tail?.value).toBe(4);
				expect(list.length).toBe(2);

				let current = list.head;
				const values: number[] = [];
				while (current) {
					values.push(current.value);
					current = current.next;
				}

				expect(values).toEqual([3, 4]);
			});

			test("should maintain bidirectional links with mixed operations", () => {
				const list = new DoublyLinkedList<number>(5);
				list.unshift(4).unshift(3); // [3, 4, 5]
				list.shift(); // [4, 5]
				list.push(6); // [4, 5, 6]
				list.shift(); // [5, 6]
				list.unshift(2).unshift(1); // [1, 2, 5, 6]

				// Forward traversal
				let current = list.head;
				const forward: number[] = [];
				while (current) {
					forward.push(current.value);
					current = current.next;
				}

				// Backward traversal
				current = list.tail;
				const backward: number[] = [];
				while (current) {
					backward.push(current.value);
					current = current.prev;
				}

				expect(forward).toEqual([1, 2, 5, 6]);
				expect(backward).toEqual([6, 5, 2, 1]);
			});
		});
	});

	describe("get()", () => {
		describe("basic functionality", () => {
			test("should retrieve node at specific index", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30).push(40).push(50);

				const node = list.get(2);
				expect(node?.value).toBe(30);
			});

			test("should retrieve first node at index 0", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const node = list.get(0);
				expect(node?.value).toBe(10);
			});

			test("should retrieve last node at index length-1", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const node = list.get(2);
				expect(node?.value).toBe(30);
			});

			test("should retrieve nodes from single element list", () => {
				const list = new DoublyLinkedList<number>(42);

				const node = list.get(0);
				expect(node?.value).toBe(42);
			});
		});

		describe("optimization - traverse from nearest end", () => {
			test("should traverse from head for indices in first half", () => {
				const list = new DoublyLinkedList<number>(0);
				for (let i = 1; i <= 10; i++) {
					list.push(i * 10);
				}

				// Index 2 is in first half (< 5.5)
				const node = list.get(2);
				expect(node?.value).toBe(20);
			});

			test("should traverse from tail for indices in second half", () => {
				const list = new DoublyLinkedList<number>(0);
				for (let i = 1; i <= 10; i++) {
					list.push(i * 10);
				}

				// Index 8 is in second half (>= 5.5)
				const node = list.get(8);
				expect(node?.value).toBe(80);
			});

			test("should handle midpoint correctly", () => {
				const list = new DoublyLinkedList<number>(0);
				list.push(10).push(20).push(30).push(40);
				// Length = 5, mid = 2

				const beforeMid = list.get(1); // < 2, from head
				const atMid = list.get(2); // >= 2, from tail
				const afterMid = list.get(3); // >= 2, from tail

				expect(beforeMid?.value).toBe(10);
				expect(atMid?.value).toBe(20);
				expect(afterMid?.value).toBe(30);
			});

			test("should work efficiently with large list from head", () => {
				const list = new DoublyLinkedList<number>(0);
				for (let i = 1; i < 100; i++) {
					list.push(i);
				}

				// Index 10 should traverse from head
				const node = list.get(10);
				expect(node?.value).toBe(10);
			});

			test("should work efficiently with large list from tail", () => {
				const list = new DoublyLinkedList<number>(0);
				for (let i = 1; i < 100; i++) {
					list.push(i);
				}

				// Index 90 should traverse from tail
				const node = list.get(90);
				expect(node?.value).toBe(90);
			});
		});

		describe("boundary cases", () => {
			test("should return undefined for negative index", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const node = list.get(-1);
				expect(node).toBeUndefined();
			});

			test("should return undefined for index equal to length", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const node = list.get(3); // length is 3
				expect(node).toBeUndefined();
			});

			test("should return undefined for index greater than length", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20);

				const node = list.get(10);
				expect(node).toBeUndefined();
			});

			test("should return undefined for empty list", () => {
				const list = new DoublyLinkedList<number>(1);
				list.pop(); // Make empty

				const node = list.get(0);
				expect(node).toBeUndefined();
			});

			test("should handle getting from two-element list", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20);

				const first = list.get(0);
				const second = list.get(1);

				expect(first?.value).toBe(10);
				expect(second?.value).toBe(20);
			});
		});

		describe("return value structure", () => {
			test("should return node with correct properties", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const node = list.get(1);

				expect(node).toHaveProperty("value");
				expect(node).toHaveProperty("next");
				expect(node).toHaveProperty("prev");
				expect(node?.value).toBe(20);
			});

			test("should return node with correct next pointer", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const node = list.get(1);

				expect(node?.next?.value).toBe(30);
			});

			test("should return node with correct prev pointer", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const node = list.get(1);

				expect(node?.prev?.value).toBe(10);
			});

			test("should return head with null prev", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20);

				const node = list.get(0);

				expect(node?.prev).toBeNull();
			});

			test("should return tail with null next", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const node = list.get(2);

				expect(node?.next).toBeNull();
			});
		});

		describe("different data types", () => {
			test("should work with strings", () => {
				const list = new DoublyLinkedList<string>("first");
				list.push("second").push("third").push("fourth");

				const node = list.get(2);
				expect(node?.value).toBe("third");
			});

			test("should work with booleans", () => {
				const list = new DoublyLinkedList<boolean>(true);
				list.push(false).push(true).push(false);

				const node = list.get(1);
				expect(node?.value).toBe(false);
			});

			test("should work with objects", () => {
				const list = new DoublyLinkedList<{ id: number; name: string }>({
					id: 1,
					name: "first",
				});
				list.push({ id: 2, name: "second" }).push({ id: 3, name: "third" });

				const node = list.get(1);
				expect(node?.value.id).toBe(2);
				expect(node?.value.name).toBe("second");
			});

			test("should work with arrays", () => {
				const list = new DoublyLinkedList<number[]>([1, 2]);
				list.push([3, 4]).push([5, 6]);

				const node = list.get(2);
				expect(node?.value).toEqual([5, 6]);
			});
		});

		describe("sequential access", () => {
			test("should retrieve all nodes in sequence", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30).push(40).push(50);

				const values: number[] = [];
				for (let i = 0; i < list.length; i++) {
					const node = list.get(i);
					if (node) values.push(node.value);
				}

				expect(values).toEqual([10, 20, 30, 40, 50]);
			});

			test("should retrieve nodes in reverse order", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30).push(40);

				const values: number[] = [];
				for (let i = list.length - 1; i >= 0; i--) {
					const node = list.get(i);
					if (node) values.push(node.value);
				}

				expect(values).toEqual([40, 30, 20, 10]);
			});

			test("should handle random access pattern", () => {
				const list = new DoublyLinkedList<number>(0);
				for (let i = 1; i <= 10; i++) {
					list.push(i);
				}

				expect(list.get(5)?.value).toBe(5);
				expect(list.get(2)?.value).toBe(2);
				expect(list.get(9)?.value).toBe(9);
				expect(list.get(0)?.value).toBe(0);
				expect(list.get(7)?.value).toBe(7);
			});
		});

		describe("integration with other operations", () => {
			test("should work after push operations", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2);
				expect(list.get(1)?.value).toBe(2);

				list.push(3);
				expect(list.get(2)?.value).toBe(3);
			});

			test("should work after pop operations", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);
				list.pop();

				expect(list.get(2)?.value).toBe(3);
				expect(list.get(3)).toBeUndefined();
			});

			test("should work after unshift operations", () => {
				const list = new DoublyLinkedList<number>(3);
				list.unshift(2).unshift(1);

				expect(list.get(0)?.value).toBe(1);
				expect(list.get(1)?.value).toBe(2);
				expect(list.get(2)?.value).toBe(3);
			});

			test("should work after shift operations", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);
				list.shift();

				expect(list.get(0)?.value).toBe(2);
				expect(list.get(2)?.value).toBe(4);
			});

			test("should work after mixed operations", () => {
				const list = new DoublyLinkedList<number>(3);
				list.unshift(2).unshift(1).push(4).push(5);
				list.shift();
				list.pop();
				// List should be: [2, 3, 4]

				expect(list.get(0)?.value).toBe(2);
				expect(list.get(1)?.value).toBe(3);
				expect(list.get(2)?.value).toBe(4);
				expect(list.length).toBe(3);
			});
		});

		describe("large lists", () => {
			test("should handle getting from large list", () => {
				const list = new DoublyLinkedList<number>(0);
				for (let i = 1; i < 1000; i++) {
					list.push(i);
				}

				expect(list.get(0)?.value).toBe(0);
				expect(list.get(500)?.value).toBe(500);
				expect(list.get(999)?.value).toBe(999);
			});

			test("should maintain correct pointers in large list", () => {
				const list = new DoublyLinkedList<number>(0);
				for (let i = 1; i <= 100; i++) {
					list.push(i);
				}

				const node = list.get(50);
				expect(node?.value).toBe(50);
				expect(node?.prev?.value).toBe(49);
				expect(node?.next?.value).toBe(51);
			});
		});

		describe("edge cases with list modifications", () => {
			test("should return undefined after list becomes empty", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2);
				list.pop();
				list.pop();

				expect(list.get(0)).toBeUndefined();
			});

			test("should adjust correctly when length changes", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				expect(list.get(2)?.value).toBe(3);
				expect(list.get(3)).toBeUndefined();

				list.push(4);
				expect(list.get(3)?.value).toBe(4);
			});
		});
	});

	describe("set()", () => {
		describe("basic functionality", () => {
			test("should update value at specific index", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30).push(40);

				const result = list.set(2, 99);

				expect(result).toBe(true);
				expect(list.get(2)?.value).toBe(99);
			});

			test("should update first node at index 0", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const result = list.set(0, 100);

				expect(result).toBe(true);
				expect(list.head?.value).toBe(100);
			});

			test("should update last node at index length-1", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const result = list.set(2, 300);

				expect(result).toBe(true);
				expect(list.tail?.value).toBe(300);
			});

			test("should update value in single element list", () => {
				const list = new DoublyLinkedList<number>(42);

				const result = list.set(0, 100);

				expect(result).toBe(true);
				expect(list.head?.value).toBe(100);
				expect(list.tail?.value).toBe(100);
			});

			test("should update multiple values sequentially", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4).push(5);

				list.set(0, 10);
				list.set(2, 30);
				list.set(4, 50);

				expect(list.get(0)?.value).toBe(10);
				expect(list.get(2)?.value).toBe(30);
				expect(list.get(4)?.value).toBe(50);
			});
		});

		describe("optimization - uses bidirectional traversal", () => {
			test("should update value in first half efficiently", () => {
				const list = new DoublyLinkedList<number>(0);
				for (let i = 1; i <= 10; i++) {
					list.push(i * 10);
				}

				const result = list.set(2, 999);

				expect(result).toBe(true);
				expect(list.get(2)?.value).toBe(999);
			});

			test("should update value in second half efficiently", () => {
				const list = new DoublyLinkedList<number>(0);
				for (let i = 1; i <= 10; i++) {
					list.push(i * 10);
				}

				const result = list.set(8, 888);

				expect(result).toBe(true);
				expect(list.get(8)?.value).toBe(888);
			});

			test("should handle updates near the end of large list", () => {
				const list = new DoublyLinkedList<number>(0);
				for (let i = 1; i < 100; i++) {
					list.push(i);
				}

				const result = list.set(95, 9500);

				expect(result).toBe(true);
				expect(list.get(95)?.value).toBe(9500);
			});
		});

		describe("boundary cases", () => {
			test("should return false for negative index", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const result = list.set(-1, 99);

				expect(result).toBe(false);
				// Verify no changes were made
				expect(list.get(0)?.value).toBe(10);
			});

			test("should return false for index equal to length", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const result = list.set(3, 99); // length is 3

				expect(result).toBe(false);
			});

			test("should return false for index greater than length", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20);

				const result = list.set(10, 99);

				expect(result).toBe(false);
			});

			test("should return false for empty list", () => {
				const list = new DoublyLinkedList<number>(1);
				list.pop(); // Make empty

				const result = list.set(0, 99);

				expect(result).toBe(false);
			});

			test("should handle setting on two-element list", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20);

				list.set(0, 100);
				list.set(1, 200);

				expect(list.head?.value).toBe(100);
				expect(list.tail?.value).toBe(200);
			});
		});

		describe("list structure preservation", () => {
			test("should not change list length", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30).push(40);
				const originalLength = list.length;

				list.set(2, 99);

				expect(list.length).toBe(originalLength);
			});

			test("should not change head pointer", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);
				const originalHead = list.head;

				list.set(1, 99);

				expect(list.head).toBe(originalHead);
			});

			test("should not change tail pointer", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);
				const originalTail = list.tail;

				list.set(1, 99);

				expect(list.tail).toBe(originalTail);
			});

			test("should preserve next pointers", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30).push(40);

				list.set(1, 99);

				expect(list.head?.next?.value).toBe(99);
				expect(list.head?.next?.next?.value).toBe(30);
			});

			test("should preserve prev pointers", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30).push(40);

				list.set(2, 99);

				expect(list.tail?.prev?.value).toBe(99);
				expect(list.tail?.prev?.prev?.value).toBe(20);
			});

			test("should maintain bidirectional integrity after update", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4).push(5);

				list.set(2, 99);

				// Forward traversal
				let current = list.head;
				const forward: number[] = [];
				while (current) {
					forward.push(current.value);
					current = current.next;
				}

				// Backward traversal
				current = list.tail;
				const backward: number[] = [];
				while (current) {
					backward.push(current.value);
					current = current.prev;
				}

				expect(forward).toEqual([1, 2, 99, 4, 5]);
				expect(backward).toEqual([5, 4, 99, 2, 1]);
			});
		});

		describe("different data types", () => {
			test("should work with strings", () => {
				const list = new DoublyLinkedList<string>("first");
				list.push("second").push("third").push("fourth");

				const result = list.set(2, "UPDATED");

				expect(result).toBe(true);
				expect(list.get(2)?.value).toBe("UPDATED");
			});

			test("should work with booleans", () => {
				const list = new DoublyLinkedList<boolean>(true);
				list.push(false).push(true).push(false);

				const result = list.set(1, true);

				expect(result).toBe(true);
				expect(list.get(1)?.value).toBe(true);
			});

			test("should work with objects", () => {
				const list = new DoublyLinkedList<{ id: number; name: string }>({
					id: 1,
					name: "first",
				});
				list.push({ id: 2, name: "second" }).push({ id: 3, name: "third" });

				const result = list.set(1, { id: 99, name: "updated" });

				expect(result).toBe(true);
				expect(list.get(1)?.value.id).toBe(99);
				expect(list.get(1)?.value.name).toBe("updated");
			});

			test("should work with arrays", () => {
				const list = new DoublyLinkedList<number[]>([1, 2]);
				list.push([3, 4]).push([5, 6]);

				const result = list.set(2, [7, 8, 9]);

				expect(result).toBe(true);
				expect(list.get(2)?.value).toEqual([7, 8, 9]);
			});

			test("should work with null and undefined values", () => {
				const list = new DoublyLinkedList<number | null>(10);
				list.push(20).push(30);

				const result = list.set(1, null);

				expect(result).toBe(true);
				expect(list.get(1)?.value).toBeNull();
			});
		});

		describe("return value validation", () => {
			test("should return true for successful update", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				expect(list.set(0, 100)).toBe(true);
				expect(list.set(1, 200)).toBe(true);
				expect(list.set(2, 300)).toBe(true);
			});

			test("should return false for all invalid indices", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20);

				expect(list.set(-1, 99)).toBe(false);
				expect(list.set(-10, 99)).toBe(false);
				expect(list.set(2, 99)).toBe(false);
				expect(list.set(100, 99)).toBe(false);
			});
		});

		describe("integration with other operations", () => {
			test("should work after push operations", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2);
				list.set(1, 99);

				list.push(3);
				list.set(2, 88);

				expect(list.get(1)?.value).toBe(99);
				expect(list.get(2)?.value).toBe(88);
			});

			test("should work after pop operations", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);
				list.pop();

				list.set(2, 99);

				expect(list.get(2)?.value).toBe(99);
				expect(list.length).toBe(3);
			});

			test("should work after unshift operations", () => {
				const list = new DoublyLinkedList<number>(3);
				list.unshift(2).unshift(1);

				list.set(0, 10);
				list.set(1, 20);
				list.set(2, 30);

				expect(list.get(0)?.value).toBe(10);
				expect(list.get(1)?.value).toBe(20);
				expect(list.get(2)?.value).toBe(30);
			});

			test("should work after shift operations", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);
				list.shift();

				list.set(0, 99);

				expect(list.get(0)?.value).toBe(99);
				expect(list.length).toBe(3);
			});

			test("should work after mixed operations", () => {
				const list = new DoublyLinkedList<number>(3);
				list.unshift(2).unshift(1).push(4).push(5);
				list.shift();
				list.pop();
				// List: [2, 3, 4]

				list.set(0, 20);
				list.set(1, 30);
				list.set(2, 40);

				expect(list.get(0)?.value).toBe(20);
				expect(list.get(1)?.value).toBe(30);
				expect(list.get(2)?.value).toBe(40);
			});
		});

		describe("large lists", () => {
			test("should handle setting in large list", () => {
				const list = new DoublyLinkedList<number>(0);
				for (let i = 1; i < 1000; i++) {
					list.push(i);
				}

				expect(list.set(0, 9000)).toBe(true);
				expect(list.set(500, 9500)).toBe(true);
				expect(list.set(999, 9999)).toBe(true);

				expect(list.get(0)?.value).toBe(9000);
				expect(list.get(500)?.value).toBe(9500);
				expect(list.get(999)?.value).toBe(9999);
			});

			test("should maintain integrity after multiple updates in large list", () => {
				const list = new DoublyLinkedList<number>(0);
				for (let i = 1; i <= 100; i++) {
					list.push(i);
				}

				// Update every 10th element
				for (let i = 0; i < 100; i += 10) {
					list.set(i, i * 1000);
				}

				expect(list.get(0)?.value).toBe(0);
				expect(list.get(10)?.value).toBe(10000);
				expect(list.get(50)?.value).toBe(50000);
				expect(list.get(90)?.value).toBe(90000);
			});
		});

		describe("edge cases with value types", () => {
			test("should handle setting zero", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const result = list.set(1, 0);

				expect(result).toBe(true);
				expect(list.get(1)?.value).toBe(0);
			});

			test("should handle setting negative numbers", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const result = list.set(1, -99);

				expect(result).toBe(true);
				expect(list.get(1)?.value).toBe(-99);
			});

			test("should handle setting empty string", () => {
				const list = new DoublyLinkedList<string>("hello");
				list.push("world");

				const result = list.set(1, "");

				expect(result).toBe(true);
				expect(list.get(1)?.value).toBe("");
			});

			test("should handle overwriting same value", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const result = list.set(1, 20);

				expect(result).toBe(true);
				expect(list.get(1)?.value).toBe(20);
			});
		});

		describe("sequential updates", () => {
			test("should handle updating all elements", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4).push(5);

				for (let i = 0; i < list.length; i++) {
					list.set(i, (i + 1) * 10);
				}

				expect(list.get(0)?.value).toBe(10);
				expect(list.get(1)?.value).toBe(20);
				expect(list.get(2)?.value).toBe(30);
				expect(list.get(3)?.value).toBe(40);
				expect(list.get(4)?.value).toBe(50);
			});

			test("should handle updating same index multiple times", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				list.set(1, 100);
				list.set(1, 200);
				list.set(1, 300);

				expect(list.get(1)?.value).toBe(300);
			});
		});
	});

	describe("remove()", () => {
		describe("basic functionality", () => {
			test("should remove and return node at specific index", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30).push(40).push(50);

				const removed = list.remove(2);

				expect(removed?.value).toBe(30);
				expect(list.length).toBe(4);
				expect(list.get(2)?.value).toBe(40);
			});

			test("should remove first node at index 0", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const removed = list.remove(0);

				expect(removed?.value).toBe(10);
				expect(list.head?.value).toBe(20);
				expect(list.length).toBe(2);
			});

			test("should remove last node at index length-1", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const removed = list.remove(2);

				expect(removed?.value).toBe(30);
				expect(list.tail?.value).toBe(20);
				expect(list.length).toBe(2);
			});

			test("should remove node from single element list", () => {
				const list = new DoublyLinkedList<number>(42);

				const removed = list.remove(0);

				expect(removed?.value).toBe(42);
				expect(list.head).toBeNull();
				expect(list.tail).toBeNull();
				expect(list.length).toBe(0);
			});

			test("should remove multiple nodes sequentially", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4).push(5);

				list.remove(2); // Remove 3
				list.remove(1); // Remove 2
				list.remove(2); // Remove 5

				expect(list.length).toBe(2);
				expect(list.get(0)?.value).toBe(1);
				expect(list.get(1)?.value).toBe(4);
			});
		});

		describe("boundary cases", () => {
			test("should return undefined for negative index", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const removed = list.remove(-1);

				expect(removed).toBeUndefined();
				expect(list.length).toBe(3);
			});

			test("should return undefined for index equal to length", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const removed = list.remove(3); // length is 3

				expect(removed).toBeUndefined();
				expect(list.length).toBe(3);
			});

			test("should return undefined for index greater than length", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20);

				const removed = list.remove(10);

				expect(removed).toBeUndefined();
				expect(list.length).toBe(2);
			});

			test("should return undefined for empty list", () => {
				const list = new DoublyLinkedList<number>(1);
				list.pop(); // Make empty

				const removed = list.remove(0);

				expect(removed).toBeUndefined();
				expect(list.length).toBe(0);
			});

			test("should handle removing from two-element list", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20);

				const removed = list.remove(1);

				expect(removed?.value).toBe(20);
				expect(list.length).toBe(1);
				expect(list.head?.value).toBe(10);
				expect(list.tail?.value).toBe(10);
			});
		});

		describe("pointer cleanup and integrity", () => {
			test("should disconnect removed node's next pointer", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);

				const removed = list.remove(2);

				expect(removed?.next).toBeNull();
			});

			test("should disconnect removed node's prev pointer", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);

				const removed = list.remove(2);

				expect(removed?.prev).toBeNull();
			});

			test("should maintain head.prev as null after removal", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);

				list.remove(1);

				expect(list.head?.prev).toBeNull();
			});

			test("should maintain tail.next as null after removal", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);

				list.remove(2);

				expect(list.tail?.next).toBeNull();
			});

			test("should properly bridge prev and next nodes", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30).push(40);

				list.remove(2); // Remove 30

				expect(list.get(1)?.next?.value).toBe(40);
				expect(list.get(2)?.prev?.value).toBe(20);
			});

			test("should maintain bidirectional integrity after removal", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4).push(5);

				list.remove(2); // Remove 3

				// Forward traversal
				let current = list.head;
				const forward: number[] = [];
				while (current) {
					forward.push(current.value);
					current = current.next;
				}

				// Backward traversal
				current = list.tail;
				const backward: number[] = [];
				while (current) {
					backward.push(current.value);
					current = current.prev;
				}

				expect(forward).toEqual([1, 2, 4, 5]);
				expect(backward).toEqual([5, 4, 2, 1]);
			});
		});

		describe("head and tail updates", () => {
			test("should update head when removing first node", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				list.remove(0);

				expect(list.head?.value).toBe(2);
			});

			test("should update tail when removing last node", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				list.remove(2);

				expect(list.tail?.value).toBe(2);
			});

			test("should not change head when removing middle node", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);
				const originalHead = list.head;

				list.remove(2);

				expect(list.head).toBe(originalHead);
			});

			test("should not change tail when removing middle node", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);
				const originalTail = list.tail;

				list.remove(1);

				expect(list.tail).toBe(originalTail);
			});

			test("should set both head and tail to null when removing last element", () => {
				const list = new DoublyLinkedList<number>(1);

				list.remove(0);

				expect(list.head).toBeNull();
				expect(list.tail).toBeNull();
			});
		});

		describe("length updates", () => {
			test("should decrement length correctly", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);
				expect(list.length).toBe(4);

				list.remove(2);
				expect(list.length).toBe(3);

				list.remove(1);
				expect(list.length).toBe(2);
			});

			test("should not change length for invalid index", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2);
				const originalLength = list.length;

				list.remove(-1);
				list.remove(10);

				expect(list.length).toBe(originalLength);
			});

			test("should reach zero length after removing all elements", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);

				list.remove(0);
				list.remove(0);
				list.remove(0);

				expect(list.length).toBe(0);
			});
		});

		describe("return value validation", () => {
			test("should return removed node with correct value", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const removed = list.remove(1);

				expect(removed).toBeDefined();
				expect(removed?.value).toBe(20);
			});

			test("should return node with correct structure", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20).push(30);

				const removed = list.remove(1);

				expect(removed).toHaveProperty("value");
				expect(removed).toHaveProperty("next");
				expect(removed).toHaveProperty("prev");
			});

			test("should return undefined for all invalid indices", () => {
				const list = new DoublyLinkedList<number>(10);
				list.push(20);

				expect(list.remove(-1)).toBeUndefined();
				expect(list.remove(-10)).toBeUndefined();
				expect(list.remove(2)).toBeUndefined();
				expect(list.remove(100)).toBeUndefined();
			});
		});

		describe("different data types", () => {
			test("should work with strings", () => {
				const list = new DoublyLinkedList<string>("first");
				list.push("second").push("third").push("fourth");

				const removed = list.remove(2);

				expect(removed?.value).toBe("third");
				expect(list.length).toBe(3);
			});

			test("should work with booleans", () => {
				const list = new DoublyLinkedList<boolean>(true);
				list.push(false).push(true).push(false);

				const removed = list.remove(1);

				expect(removed?.value).toBe(false);
				expect(list.length).toBe(3);
			});

			test("should work with objects", () => {
				const list = new DoublyLinkedList<{ id: number }>({ id: 1 });
				list.push({ id: 2 }).push({ id: 3 }).push({ id: 4 });

				const removed = list.remove(2);

				expect(removed?.value.id).toBe(3);
				expect(list.length).toBe(3);
			});

			test("should work with arrays", () => {
				const list = new DoublyLinkedList<number[]>([1, 2]);
				list.push([3, 4]).push([5, 6]);

				const removed = list.remove(1);

				expect(removed?.value).toEqual([3, 4]);
				expect(list.length).toBe(2);
			});
		});

		describe("integration with other operations", () => {
			test("should work after push operations", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3);
				list.remove(1);
				list.push(4);

				expect(list.length).toBe(3);
				expect(list.get(1)?.value).toBe(3);
				expect(list.get(2)?.value).toBe(4);
			});

			test("should work after unshift operations", () => {
				const list = new DoublyLinkedList<number>(3);
				list.unshift(2).unshift(1);
				list.remove(1);

				expect(list.length).toBe(2);
				expect(list.get(0)?.value).toBe(1);
				expect(list.get(1)?.value).toBe(3);
			});

			test("should work with set operations", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);
				list.set(2, 99);
				const removed = list.remove(2);

				expect(removed?.value).toBe(99);
				expect(list.length).toBe(3);
			});

			test("should work after mixed operations", () => {
				const list = new DoublyLinkedList<number>(3);
				list.unshift(2).unshift(1).push(4).push(5);
				list.shift();
				list.pop();
				list.remove(1); // Remove 3
				// List should be: [2, 4]

				expect(list.length).toBe(2);
				expect(list.get(0)?.value).toBe(2);
				expect(list.get(1)?.value).toBe(4);
			});
		});

		describe("edge cases - removing from specific positions", () => {
			test("should remove from beginning of large list", () => {
				const list = new DoublyLinkedList<number>(0);
				for (let i = 1; i < 100; i++) {
					list.push(i);
				}

				const removed = list.remove(0);

				expect(removed?.value).toBe(0);
				expect(list.head?.value).toBe(1);
				expect(list.length).toBe(99);
			});

			test("should remove from end of large list", () => {
				const list = new DoublyLinkedList<number>(0);
				for (let i = 1; i < 100; i++) {
					list.push(i);
				}

				const removed = list.remove(99);

				expect(removed?.value).toBe(99);
				expect(list.tail?.value).toBe(98);
				expect(list.length).toBe(99);
			});

			test("should remove from middle of large list", () => {
				const list = new DoublyLinkedList<number>(0);
				for (let i = 1; i < 100; i++) {
					list.push(i);
				}

				const removed = list.remove(50);

				expect(removed?.value).toBe(50);
				expect(list.length).toBe(99);
				expect(list.get(50)?.value).toBe(51);
			});

			test("should handle removing adjacent nodes", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4).push(5);

				list.remove(2); // Remove 3
				list.remove(2); // Remove 4 (now at index 2)

				expect(list.length).toBe(3);
				expect(list.get(0)?.value).toBe(1);
				expect(list.get(1)?.value).toBe(2);
				expect(list.get(2)?.value).toBe(5);
			});
		});

		describe("removing all elements sequentially", () => {
			test("should remove all elements from beginning", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);

				list.remove(0);
				list.remove(0);
				list.remove(0);
				list.remove(0);

				expect(list.length).toBe(0);
				expect(list.head).toBeNull();
				expect(list.tail).toBeNull();
			});

			test("should remove all elements from end", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4);

				list.remove(3);
				list.remove(2);
				list.remove(1);
				list.remove(0);

				expect(list.length).toBe(0);
				expect(list.head).toBeNull();
				expect(list.tail).toBeNull();
			});

			test("should remove all elements from middle outward", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4).push(5);

				list.remove(2); // Remove 3
				list.remove(2); // Remove 4
				list.remove(1); // Remove 2
				list.remove(1); // Remove 5
				list.remove(0); // Remove 1

				expect(list.length).toBe(0);
				expect(list.head).toBeNull();
				expect(list.tail).toBeNull();
			});
		});

		describe("complex scenarios", () => {
			test("should maintain correct structure after multiple removals", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2).push(3).push(4).push(5).push(6).push(7);

				list.remove(3); // Remove 4
				list.remove(5); // Remove 7
				list.remove(1); // Remove 2

				// List should be: [1, 3, 5, 6]
				expect(list.length).toBe(4);

				// Verify forward traversal
				let current = list.head;
				const forward: number[] = [];
				while (current) {
					forward.push(current.value);
					current = current.next;
				}

				// Verify backward traversal
				current = list.tail;
				const backward: number[] = [];
				while (current) {
					backward.push(current.value);
					current = current.prev;
				}

				expect(forward).toEqual([1, 3, 5, 6]);
				expect(backward).toEqual([6, 5, 3, 1]);
			});

			test("should handle alternating push and remove operations", () => {
				const list = new DoublyLinkedList<number>(1);
				list.push(2);
				list.remove(1);
				list.push(3);
				list.remove(0);
				list.push(4);

				expect(list.length).toBe(2);
				expect(list.get(0)?.value).toBe(3);
				expect(list.get(1)?.value).toBe(4);
			});
		});
	});
});
