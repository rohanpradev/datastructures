import { describe, expect, test } from "bun:test";
import { SinglyLinkedList } from "@/data-structures/singly-linked-list/singly-linked-list";

describe("SinglyLinkedList", () => {
	describe("constructor", () => {
		test("should create an empty list when no initial value is provided", () => {
			const list = new SinglyLinkedList<number>();
			expect(list.getLength()).toBe(0);
			expect(list.peek()).toEqual([]);
		});

		test("should create a list with one element when initial value is provided", () => {
			const list = new SinglyLinkedList<number>(10);
			expect(list.getLength()).toBe(1);
			expect(list.peek()).toEqual([10]);
		});

		test("should work with different types", () => {
			const stringList = new SinglyLinkedList<string>("hello");
			expect(stringList.getLength()).toBe(1);
			expect(stringList.peek()).toEqual(["hello"]);

			const boolList = new SinglyLinkedList<boolean>(true);
			expect(boolList.getLength()).toBe(1);
			expect(boolList.peek()).toEqual([true]);
		});
	});

	describe("push", () => {
		test("should add element to empty list", () => {
			const list = new SinglyLinkedList<number>();
			list.push(5);
			expect(list.getLength()).toBe(1);
			expect(list.peek()).toEqual([5]);
		});

		test("should add multiple elements to the end", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);
			list.push(3);
			list.push(4);
			expect(list.getLength()).toBe(4);
			expect(list.peek()).toEqual([1, 2, 3, 4]);
		});

		test("should maintain order of elements", () => {
			const list = new SinglyLinkedList<string>("first");
			list.push("second");
			list.push("third");
			expect(list.peek()).toEqual(["first", "second", "third"]);
		});
	});

	describe("pop", () => {
		test("should remove last element from list", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);
			list.push(3);
			list.pop();
			expect(list.getLength()).toBe(2);
			expect(list.peek()).toEqual([1, 2]);
		});

		test("should handle popping from single element list", () => {
			const list = new SinglyLinkedList<number>(42);
			list.pop();
			expect(list.getLength()).toBe(0);
			expect(list.peek()).toEqual([]);
		});

		test("should handle popping from empty list", () => {
			const list = new SinglyLinkedList<number>();
			list.pop();
			expect(list.getLength()).toBe(0);
			expect(list.peek()).toEqual([]);
		});

		test("should remove all elements when popped multiple times", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);
			list.push(3);
			list.pop();
			list.pop();
			list.pop();
			expect(list.getLength()).toBe(0);
			expect(list.peek()).toEqual([]);
		});
	});

	describe("unshift", () => {
		test("should add element to the beginning of empty list", () => {
			const list = new SinglyLinkedList<number>();
			list.unshift(10);
			expect(list.getLength()).toBe(1);
			expect(list.peek()).toEqual([10]);
		});

		test("should add element to the beginning of non-empty list", () => {
			const list = new SinglyLinkedList<number>(2);
			list.unshift(1);
			expect(list.getLength()).toBe(2);
			expect(list.peek()).toEqual([1, 2]);
		});

		test("should add multiple elements to the beginning", () => {
			const list = new SinglyLinkedList<number>(4);
			list.unshift(3);
			list.unshift(2);
			list.unshift(1);
			expect(list.getLength()).toBe(4);
			expect(list.peek()).toEqual([1, 2, 3, 4]);
		});

		test("should return the list instance (method chaining)", () => {
			const list = new SinglyLinkedList<number>();
			const result = list.unshift(1);
			expect(result).toBe(list);
		});

		test("should support method chaining", () => {
			const list = new SinglyLinkedList<number>();
			list.unshift(3).unshift(2).unshift(1);
			expect(list.peek()).toEqual([1, 2, 3]);
		});
	});

	describe("shift", () => {
		test("should remove first element from list", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);
			list.push(3);
			list.shift();
			expect(list.getLength()).toBe(2);
			expect(list.peek()).toEqual([2, 3]);
		});

		test("should handle shifting from single element list", () => {
			const list = new SinglyLinkedList<number>(42);
			list.shift();
			expect(list.getLength()).toBe(0);
			expect(list.peek()).toEqual([]);
		});

		test("should handle shifting from empty list", () => {
			const list = new SinglyLinkedList<number>();
			list.shift();
			expect(list.getLength()).toBe(0);
			expect(list.peek()).toEqual([]);
		});

		test("should remove all elements when shifted multiple times", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);
			list.push(3);
			list.shift();
			list.shift();
			list.shift();
			expect(list.getLength()).toBe(0);
			expect(list.peek()).toEqual([]);
		});

		test("should maintain order when shifting", () => {
			const list = new SinglyLinkedList<string>("first");
			list.push("second");
			list.push("third");
			list.push("fourth");
			list.shift();
			expect(list.peek()).toEqual(["second", "third", "fourth"]);
			list.shift();
			expect(list.peek()).toEqual(["third", "fourth"]);
		});

		test("should work correctly after unshift operations", () => {
			const list = new SinglyLinkedList<number>();
			list.unshift(3);
			list.unshift(2);
			list.unshift(1);
			list.shift();
			expect(list.peek()).toEqual([2, 3]);
			expect(list.getLength()).toBe(2);
		});
	});

	describe("peek", () => {
		test("should return empty array for empty list", () => {
			const list = new SinglyLinkedList<number>();
			expect(list.peek()).toEqual([]);
		});

		test("should return all values in order", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);
			list.push(3);
			expect(list.peek()).toEqual([1, 2, 3]);
		});

		test("should not modify the list", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);
			const values1 = list.peek();
			const values2 = list.peek();
			expect(values1).toEqual(values2);
			expect(list.getLength()).toBe(2);
		});
	});

	describe("getLength", () => {
		test("should return 0 for empty list", () => {
			const list = new SinglyLinkedList<number>();
			expect(list.getLength()).toBe(0);
		});

		test("should return correct length after operations", () => {
			const list = new SinglyLinkedList<number>(1);
			expect(list.getLength()).toBe(1);

			list.push(2);
			expect(list.getLength()).toBe(2);

			list.push(3);
			expect(list.getLength()).toBe(3);

			list.pop();
			expect(list.getLength()).toBe(2);

			list.unshift(0);
			expect(list.getLength()).toBe(3);
		});
	});

	describe("integration tests", () => {
		test("should handle complex sequence of operations", () => {
			const list = new SinglyLinkedList<number>(11);
			list.push(3);
			list.push(23);
			list.push(7);
			list.pop();
			list.pop();

			expect(list.getLength()).toBe(2);
			expect(list.peek()).toEqual([11, 3]);
		});

		test("should work with strings", () => {
			const list = new SinglyLinkedList<string>("hello");
			list.push("world");
			list.unshift("hey");
			list.pop();

			expect(list.peek()).toEqual(["hey", "hello"]);
		});

		test("should handle alternating push and pop operations", () => {
			const list = new SinglyLinkedList<number>();
			list.push(1);
			list.push(2);
			list.pop();
			list.push(3);
			list.push(4);
			list.pop();

			expect(list.peek()).toEqual([1, 3]);
			expect(list.getLength()).toBe(2);
		});

		test("should handle building list from scratch with unshift", () => {
			const list = new SinglyLinkedList<number>();
			list.unshift(5).unshift(4).unshift(3).unshift(2).unshift(1);

			expect(list.peek()).toEqual([1, 2, 3, 4, 5]);
			expect(list.getLength()).toBe(5);
		});

		test("should handle mixed shift and unshift operations", () => {
			const list = new SinglyLinkedList<number>(3);
			list.unshift(2);
			list.unshift(1);
			list.push(4);
			list.push(5);
			list.shift();
			list.shift();

			expect(list.peek()).toEqual([3, 4, 5]);
			expect(list.getLength()).toBe(3);
		});

		test("should handle alternating shift and push operations", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);
			list.push(3);
			list.shift();
			list.push(4);
			list.shift();

			expect(list.peek()).toEqual([3, 4]);
			expect(list.getLength()).toBe(2);
		});
	});

	describe("edge cases", () => {
		test("should handle operations on list that becomes empty", () => {
			const list = new SinglyLinkedList<number>(1);
			list.pop();
			list.push(2);

			expect(list.peek()).toEqual([2]);
			expect(list.getLength()).toBe(1);
		});

		test("should handle adding after list becomes empty", () => {
			const list = new SinglyLinkedList<number>(1);
			list.pop();
			list.unshift(5);

			expect(list.peek()).toEqual([5]);
			expect(list.getLength()).toBe(1);
		});

		test("should handle adding after shift empties the list", () => {
			const list = new SinglyLinkedList<number>(1);
			list.shift();
			list.push(5);

			expect(list.peek()).toEqual([5]);
			expect(list.getLength()).toBe(1);
		});

		test("should work with zero as a value", () => {
			const list = new SinglyLinkedList<number>(0);
			expect(list.peek()).toEqual([0]);

			list.push(0);
			expect(list.peek()).toEqual([0, 0]);
		});

		test("should work with null as a value for nullable types", () => {
			const list = new SinglyLinkedList<number | null>(null);
			expect(list.peek()).toEqual([null]);

			list.push(1);
			list.push(null);
			expect(list.peek()).toEqual([null, 1, null]);
		});

		test("should handle shift with null values", () => {
			const list = new SinglyLinkedList<number | null>(null);
			list.push(1);
			list.push(null);
			list.shift();

			expect(list.peek()).toEqual([1, null]);
			expect(list.getLength()).toBe(2);
		});
	});

	describe("get", () => {
		test("should return the node at index 0 (first node)", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20).push(30);

			const node = list.get(0);
			expect(node?.value).toBe(10);
		});

		test("should return the node at a middle index", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20).push(30);

			const node = list.get(1);
			expect(node?.value).toBe(20);
		});

		test("should return the node at the last index", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20).push(30);

			const node = list.get(2);
			expect(node?.value).toBe(30);
		});

		test("should return undefined for negative index", () => {
			const list = new SinglyLinkedList<number>(10);
			const result = list.get(-1);
			expect(result).toBeUndefined();
		});

		test("should return undefined for index equal to length", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20);
			const result = list.get(2);
			expect(result).toBeUndefined();
		});

		test("should return undefined for index greater than length", () => {
			const list = new SinglyLinkedList<number>(10);
			const result = list.get(100);
			expect(result).toBeUndefined();
		});

		test("should return undefined for empty list", () => {
			const list = new SinglyLinkedList<number>();
			const result = list.get(0);
			expect(result).toBeUndefined();
		});

		test("should work with different data types", () => {
			const list = new SinglyLinkedList<string>("first");
			list.push("second").push("third");

			const node = list.get(1);
			expect(node?.value).toBe("second");
		});

		test("should return same node on multiple calls with same index", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20);

			const node1 = list.get(0);
			const node2 = list.get(0);
			expect(node1).toBe(node2);
		});

		test("should work with null values", () => {
			const list = new SinglyLinkedList<number | null>(1);
			list.push(null).push(3);

			const node = list.get(1);
			expect(node?.value).toBe(null);
		});
	});

	describe("set", () => {
		test("should update value at index 0 (first node)", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20).push(30);

			const result = list.set(0, 99);
			expect(result).toBe(true);
			expect(list.peek()).toEqual([99, 20, 30]);
		});

		test("should update value at middle index", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20).push(30);

			const result = list.set(1, 99);
			expect(result).toBe(true);
			expect(list.peek()).toEqual([10, 99, 30]);
		});

		test("should update value at last index", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20).push(30);

			const result = list.set(2, 99);
			expect(result).toBe(true);
			expect(list.peek()).toEqual([10, 20, 99]);
		});

		test("should return false for negative index", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20);

			const result = list.set(-1, 99);
			expect(result).toBe(false);
			expect(list.peek()).toEqual([10, 20]);
		});

		test("should return false for index equal to length", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20).push(30);

			const result = list.set(3, 99);
			expect(result).toBe(false);
			expect(list.peek()).toEqual([10, 20, 30]);
		});

		test("should return false for index greater than length", () => {
			const list = new SinglyLinkedList<number>(10);

			const result = list.set(100, 99);
			expect(result).toBe(false);
		});

		test("should not change length after update", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);

			const lengthBefore = list.getLength();
			list.set(1, 99);
			expect(list.getLength()).toBe(lengthBefore);
		});

		test("should handle multiple updates to same index", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20).push(30);

			list.set(1, 99);
			expect(list.peek()).toEqual([10, 99, 30]);

			list.set(1, 88);
			expect(list.peek()).toEqual([10, 88, 30]);
		});

		test("should update to zero", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20).push(30);

			list.set(1, 0);
			expect(list.peek()).toEqual([10, 0, 30]);
		});

		test("should update to null for nullable types", () => {
			const list = new SinglyLinkedList<number | null>(1);
			list.push(2).push(3);

			list.set(1, null);
			expect(list.peek()).toEqual([1, null, 3]);
		});

		test("should verify updates using get()", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20).push(30);

			list.set(1, 99);
			const node = list.get(1);
			expect(node?.value).toBe(99);
		});
	});

	describe("insert", () => {
		test("should insert at the beginning (index 0)", () => {
			const list = new SinglyLinkedList<number>(20);
			list.push(30);

			const result = list.insert(0, 10);
			expect(result).toBe(true);
			expect(list.peek()).toEqual([10, 20, 30]);
			expect(list.getLength()).toBe(3);
		});

		test("should insert at the end (index === length)", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20);

			const result = list.insert(2, 30);
			expect(result).toBe(true);
			expect(list.peek()).toEqual([10, 20, 30]);
			expect(list.getLength()).toBe(3);
		});

		test("should insert in the middle", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(30);

			const result = list.insert(1, 20);
			expect(result).toBe(true);
			expect(list.peek()).toEqual([10, 20, 30]);
			expect(list.getLength()).toBe(3);
		});

		test("should insert into single element list at index 1", () => {
			const list = new SinglyLinkedList<string>("first");

			const result = list.insert(1, "second");
			expect(result).toBe(true);
			expect(list.peek()).toEqual(["first", "second"]);
			expect(list.getLength()).toBe(2);
		});

		test("should insert into empty list at index 0", () => {
			const list = new SinglyLinkedList<number>();

			const result = list.insert(0, 10);
			expect(result).toBe(true);
			expect(list.peek()).toEqual([10]);
			expect(list.getLength()).toBe(1);
		});

		test("should return false for negative index", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20);

			const result = list.insert(-1, 5);
			expect(result).toBe(false);
			expect(list.peek()).toEqual([10, 20]);
			expect(list.getLength()).toBe(2);
		});

		test("should return false for index greater than length", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20);

			const result = list.insert(3, 30);
			expect(result).toBe(false);
			expect(list.peek()).toEqual([10, 20]);
			expect(list.getLength()).toBe(2);
		});

		test("should insert multiple times at different positions", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(5);

			list.insert(1, 3);
			list.insert(1, 2);
			list.insert(3, 4);

			expect(list.peek()).toEqual([1, 2, 3, 4, 5]);
			expect(list.getLength()).toBe(5);
		});

		test("should handle inserting zero values", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);

			list.insert(1, 0);
			expect(list.peek()).toEqual([1, 0, 2]);
		});

		test("should handle inserting null for nullable types", () => {
			const list = new SinglyLinkedList<number | null>(1);
			list.push(2);

			list.insert(1, null);
			expect(list.peek()).toEqual([1, null, 2]);
		});

		test("should work correctly with get() after insertion", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(30);
			list.insert(1, 20);

			expect(list.get(0)?.value).toBe(10);
			expect(list.get(1)?.value).toBe(20);
			expect(list.get(2)?.value).toBe(30);
		});

		test("should work correctly after pop()", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			list.pop();
			list.insert(2, 2.5);

			expect(list.peek()).toEqual([1, 2, 2.5, 3]);
		});

		test("should handle sequential insertions at same index", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(5);

			list.insert(1, 4);
			list.insert(1, 3);
			list.insert(1, 2);

			expect(list.peek()).toEqual([1, 2, 3, 4, 5]);
		});

		test("should handle large lists", () => {
			const list = new SinglyLinkedList<number>(0);
			for (let i = 1; i < 100; i++) {
				list.push(i * 10);
			}

			const result = list.insert(50, 505);
			expect(result).toBe(true);
			expect(list.getLength()).toBe(101);
			expect(list.get(50)?.value).toBe(505);
		});
	});

	describe("reverse", () => {
		test("should reverse a list with multiple elements", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			list.reverse();

			expect(list.peek()).toEqual([4, 3, 2, 1]);
			expect(list.getLength()).toBe(4);
		});

		test("should handle empty list", () => {
			const list = new SinglyLinkedList<number>();

			list.reverse();

			expect(list.peek()).toEqual([]);
			expect(list.getLength()).toBe(0);
		});

		test("should handle single element list", () => {
			const list = new SinglyLinkedList<string>("only");

			list.reverse();

			expect(list.peek()).toEqual(["only"]);
			expect(list.getLength()).toBe(1);
		});

		test("should handle two element list", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2);

			list.reverse();

			expect(list.peek()).toEqual([2, 1]);
		});

		test("should return the list instance for method chaining", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);

			const result = list.reverse();

			expect(result).toBe(list);
			expect(list.peek()).toEqual([3, 2, 1]);
		});

		test("should work with strings", () => {
			const list = new SinglyLinkedList<string>("first");
			list.push("second").push("third").push("fourth");

			list.reverse();

			expect(list.peek()).toEqual(["fourth", "third", "second", "first"]);
		});

		test("should maintain correct head and tail", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);

			list.reverse();

			// Head should be 3, tail should be 1
			expect(list.get(0)?.value).toBe(3);
			expect(list.get(2)?.value).toBe(1);
		});

		test("should work after other operations", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3).push(4);
			list.pop(); // [1, 2, 3]
			list.shift(); // [2, 3]

			list.reverse();

			expect(list.peek()).toEqual([3, 2]);
		});

		test("should allow reversing multiple times", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);

			list.reverse(); // [3, 2, 1]
			expect(list.peek()).toEqual([3, 2, 1]);

			list.reverse(); // [1, 2, 3]
			expect(list.peek()).toEqual([1, 2, 3]);

			list.reverse(); // [3, 2, 1]
			expect(list.peek()).toEqual([3, 2, 1]);
		});

		test("should work with null values", () => {
			const list = new SinglyLinkedList<number | null>(1);
			list.push(null).push(3).push(null);

			list.reverse();

			expect(list.peek()).toEqual([null, 3, null, 1]);
		});

		test("should work correctly with get() after reversal", () => {
			const list = new SinglyLinkedList<number>(10);
			list.push(20).push(30).push(40);

			list.reverse();

			expect(list.get(0)?.value).toBe(40);
			expect(list.get(1)?.value).toBe(30);
			expect(list.get(2)?.value).toBe(20);
			expect(list.get(3)?.value).toBe(10);
		});

		test("should allow push after reverse", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);

			list.reverse(); // [3, 2, 1]
			list.push(0); // [3, 2, 1, 0]

			expect(list.peek()).toEqual([3, 2, 1, 0]);
		});

		test("should allow unshift after reverse", () => {
			const list = new SinglyLinkedList<number>(1);
			list.push(2).push(3);

			list.reverse(); // [3, 2, 1]
			list.unshift(4); // [4, 3, 2, 1]

			expect(list.peek()).toEqual([4, 3, 2, 1]);
		});

		test("should handle large lists", () => {
			const list = new SinglyLinkedList<number>(0);
			for (let i = 1; i <= 100; i++) {
				list.push(i);
			}

			list.reverse();

			expect(list.get(0)?.value).toBe(100);
			expect(list.get(50)?.value).toBe(50);
			expect(list.get(100)?.value).toBe(0);
			expect(list.getLength()).toBe(101);
		});

		test("should work with complex objects", () => {
			const obj1 = { id: 1, name: "first" };
			const obj2 = { id: 2, name: "second" };
			const obj3 = { id: 3, name: "third" };

			const list = new SinglyLinkedList<typeof obj1>(obj1);
			list.push(obj2).push(obj3);

			list.reverse();

			expect(list.peek()).toEqual([obj3, obj2, obj1]);
		});
	});
});
