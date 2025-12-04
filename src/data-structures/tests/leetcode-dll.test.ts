import { describe, expect, test } from "bun:test";
import { DoublyLinkedList } from "@/data-structures/doubly-linked-list/doubly-linked-list";
import {
	palindromeChecker,
	partitionList,
	reverseList,
	swapPairs,
} from "@/data-structures/doubly-linked-list/problems/leetcode-dll";

describe("palindromeChecker()", () => {
	describe("basic functionality", () => {
		test("should return true for single node list", () => {
			const list = new DoublyLinkedList<number>(5);

			const result = palindromeChecker(list);

			expect(result).toBe(true);
		});

		test("should return true for two-node palindrome", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(1);

			const result = palindromeChecker(list);

			expect(result).toBe(true);
		});

		test("should return false for two-node non-palindrome", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2);

			const result = palindromeChecker(list);

			expect(result).toBe(false);
		});

		test("should return true for odd-length palindrome", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(2).push(1);

			const result = palindromeChecker(list);

			expect(result).toBe(true);
		});

		test("should return true for even-length palindrome", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(2).push(1);

			const result = palindromeChecker(list);

			expect(result).toBe(true);
		});

		test("should return false for odd-length non-palindrome", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			const result = palindromeChecker(list);

			expect(result).toBe(false);
		});

		test("should return false for even-length non-palindrome", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			const result = palindromeChecker(list);

			expect(result).toBe(false);
		});
	});

	describe("edge cases", () => {
		test("should return true for list with all same values", () => {
			const list = new DoublyLinkedList<number>(5);
			list.push(5).push(5).push(5).push(5);

			const result = palindromeChecker(list);

			expect(result).toBe(true);
		});

		test("should return false when only first and last match", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(1);

			const result = palindromeChecker(list);

			expect(result).toBe(false);
		});

		test("should return false when mismatch is in the middle", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(9).push(3).push(1);

			const result = palindromeChecker(list);

			expect(result).toBe(false);
		});

		test("should return true for three-node palindrome", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(1);

			const result = palindromeChecker(list);

			expect(result).toBe(true);
		});

		test("should return false for three-node non-palindrome", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3);

			const result = palindromeChecker(list);

			expect(result).toBe(false);
		});
	});

	describe("large lists", () => {
		test("should return true for large palindrome", () => {
			const list = new DoublyLinkedList<number>(1);
			for (let i = 2; i <= 50; i++) {
				list.push(i);
			}
			for (let i = 50; i >= 1; i--) {
				list.push(i);
			}

			const result = palindromeChecker(list);

			expect(result).toBe(true);
		});

		test("should return false for large non-palindrome", () => {
			const list = new DoublyLinkedList<number>(1);
			for (let i = 2; i <= 100; i++) {
				list.push(i);
			}

			const result = palindromeChecker(list);

			expect(result).toBe(false);
		});

		test("should return true for large list with all same values", () => {
			const list = new DoublyLinkedList<number>(7);
			for (let i = 0; i < 99; i++) {
				list.push(7);
			}

			const result = palindromeChecker(list);

			expect(result).toBe(true);
		});
	});

	describe("palindromes with different patterns", () => {
		test("should handle palindrome with negative numbers", () => {
			const list = new DoublyLinkedList<number>(-1);
			list.push(-2).push(-3).push(-2).push(-1);

			const result = palindromeChecker(list);

			expect(result).toBe(true);
		});

		test("should handle palindrome with zeros", () => {
			const list = new DoublyLinkedList<number>(0);
			list.push(1).push(2).push(1).push(0);

			const result = palindromeChecker(list);

			expect(result).toBe(true);
		});

		test("should handle palindrome with mixed positive and negative", () => {
			const list = new DoublyLinkedList<number>(-5);
			list.push(0).push(5).push(0).push(-5);

			const result = palindromeChecker(list);

			expect(result).toBe(true);
		});

		test("should handle long palindrome with center element", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6).push(7);
			list.push(6).push(5).push(4).push(3).push(2).push(1);

			const result = palindromeChecker(list);

			expect(result).toBe(true);
		});

		test("should handle long even palindrome", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6);
			list.push(6).push(5).push(4).push(3).push(2).push(1);

			const result = palindromeChecker(list);

			expect(result).toBe(true);
		});
	});

	describe("early termination", () => {
		test("should fail immediately on first mismatch at edges", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6);

			const result = palindromeChecker(list);

			expect(result).toBe(false);
		});

		test("should fail on second comparison", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(1);

			const result = palindromeChecker(list);

			expect(result).toBe(false);
		});
	});

	describe("specific numeric patterns", () => {
		test("should return true for [1, 2, 1]", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(1);

			expect(palindromeChecker(list)).toBe(true);
		});

		test("should return true for [1, 2, 3, 2, 1]", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(2).push(1);

			expect(palindromeChecker(list)).toBe(true);
		});

		test("should return true for [5, 4, 3, 4, 5]", () => {
			const list = new DoublyLinkedList<number>(5);
			list.push(4).push(3).push(4).push(5);

			expect(palindromeChecker(list)).toBe(true);
		});

		test("should return false for [1, 2, 3]", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3);

			expect(palindromeChecker(list)).toBe(false);
		});

		test("should return false for [1, 2, 3, 4]", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			expect(palindromeChecker(list)).toBe(false);
		});

		test("should return true for [9, 9]", () => {
			const list = new DoublyLinkedList<number>(9);
			list.push(9);

			expect(palindromeChecker(list)).toBe(true);
		});

		test("should return false for [9, 8]", () => {
			const list = new DoublyLinkedList<number>(9);
			list.push(8);

			expect(palindromeChecker(list)).toBe(false);
		});
	});

	describe("boundary values", () => {
		test("should handle maximum safe integer", () => {
			const max = Number.MAX_SAFE_INTEGER;
			const list = new DoublyLinkedList<number>(max);
			list.push(100).push(max);

			expect(palindromeChecker(list)).toBe(true);
		});

		test("should handle minimum safe integer", () => {
			const min = Number.MIN_SAFE_INTEGER;
			const list = new DoublyLinkedList<number>(min);
			list.push(0).push(min);

			expect(palindromeChecker(list)).toBe(true);
		});

		test("should handle very large palindrome sequence", () => {
			const list = new DoublyLinkedList<number>(1);
			const size = 500;
			for (let i = 2; i <= size; i++) {
				list.push(i);
			}
			for (let i = size; i >= 1; i--) {
				list.push(i);
			}

			expect(palindromeChecker(list)).toBe(true);
		});
	});

	describe("integration with list operations", () => {
		test("should work after push operations", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2);
			list.push(3);
			list.push(2);
			list.push(1);

			expect(palindromeChecker(list)).toBe(true);
		});

		test("should work after removing elements to form palindrome", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(2).push(1).push(99);
			list.pop(); // Remove 99

			expect(palindromeChecker(list)).toBe(true);
		});

		test("should work after shift operations", () => {
			const list = new DoublyLinkedList<number>(99);
			list.push(1).push(2).push(3).push(2).push(1);
			list.shift(); // Remove 99

			expect(palindromeChecker(list)).toBe(true);
		});

		test("should work with set operations", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(99).push(2).push(1);
			list.set(2, 3); // Change 99 to 3

			expect(palindromeChecker(list)).toBe(true);
		});
	});

	describe("list integrity", () => {
		test("should not modify the list", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(2).push(1);
			const originalLength = list.length;
			const originalHead = list.head?.value;
			const originalTail = list.tail?.value;

			palindromeChecker(list);

			expect(list.length).toBe(originalLength);
			expect(list.head?.value).toBe(originalHead);
			expect(list.tail?.value).toBe(originalTail);
		});

		test("should not affect list structure", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3);

			palindromeChecker(list);

			// Verify forward traversal
			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([1, 2, 3]);
		});
	});
});

describe("reverseList()", () => {
	describe("basic functionality", () => {
		test("should reverse a single node list", () => {
			const list = new DoublyLinkedList<number>(42);

			const reversed = reverseList(list);

			expect(reversed).not.toBeNull();
			expect(reversed?.head?.value).toBe(42);
			expect(reversed?.tail?.value).toBe(42);
			expect(reversed?.length).toBe(1);
		});

		test("should reverse a two-node list", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2);

			const reversed = reverseList(list);

			expect(reversed).not.toBeNull();
			expect(reversed?.head?.value).toBe(2);
			expect(reversed?.tail?.value).toBe(1);
			expect(reversed?.length).toBe(2);
		});

		test("should reverse a three-node list", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3);

			const reversed = reverseList(list);

			expect(reversed).not.toBeNull();
			expect(reversed?.head?.value).toBe(3);
			expect(reversed?.get(1)?.value).toBe(2);
			expect(reversed?.tail?.value).toBe(1);
			expect(reversed?.length).toBe(3);
		});

		test("should reverse a five-node list", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			const reversed = reverseList(list);

			expect(reversed).not.toBeNull();
			expect(reversed?.length).toBe(5);

			// Verify all values in order
			const values: number[] = [];
			let current = reversed?.head;
			while (current) {
				values.push(current.value);
				current = current.next;
			}
			expect(values).toEqual([5, 4, 3, 2, 1]);
		});

		test("should return null for empty list", () => {
			const list = new DoublyLinkedList<number>(1);
			list.pop(); // Make empty

			const reversed = reverseList(list);

			expect(reversed).toBeNull();
		});
	});

	describe("bidirectional integrity", () => {
		test("should maintain correct forward links", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			const reversed = reverseList(list);

			// Forward traversal
			let current = reversed?.head;
			const forward: number[] = [];
			while (current) {
				forward.push(current.value);
				current = current.next;
			}

			expect(forward).toEqual([4, 3, 2, 1]);
		});

		test("should maintain correct backward links", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			const reversed = reverseList(list);

			// Backward traversal
			let current = reversed?.tail;
			const backward: number[] = [];
			while (current) {
				backward.push(current.value);
				current = current.prev;
			}

			expect(backward).toEqual([1, 2, 3, 4]);
		});

		test("should have null prev pointer at head", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3);

			const reversed = reverseList(list);

			expect(reversed?.head?.prev).toBeNull();
		});

		test("should have null next pointer at tail", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3);

			const reversed = reverseList(list);

			expect(reversed?.tail?.next).toBeNull();
		});

		test("should maintain bidirectional links throughout list", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			const reversed = reverseList(list);

			// Check each node's bidirectional links
			let current = reversed?.head;
			while (current?.next) {
				expect(current.next.prev).toBe(current);
				current = current.next;
			}
		});
	});

	describe("original list preservation", () => {
		test("should not modify original list", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);
			const originalLength = list.length;
			const originalHead = list.head?.value;
			const originalTail = list.tail?.value;

			reverseList(list);

			expect(list.length).toBe(originalLength);
			expect(list.head?.value).toBe(originalHead);
			expect(list.tail?.value).toBe(originalTail);
		});

		test("should preserve original list structure", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3);

			reverseList(list);

			// Verify original forward traversal
			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([1, 2, 3]);
		});

		test("should create independent list", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3);

			const reversed = reverseList(list);

			// Modify reversed list
			reversed?.push(99);

			// Original should be unchanged
			expect(list.length).toBe(3);
			expect(list.tail?.value).toBe(3);
		});
	});

	describe("different data patterns", () => {
		test("should reverse list with negative numbers", () => {
			const list = new DoublyLinkedList<number>(-1);
			list.push(-2).push(-3).push(-4);

			const reversed = reverseList(list);

			let current = reversed?.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([-4, -3, -2, -1]);
		});

		test("should reverse list with zeros", () => {
			const list = new DoublyLinkedList<number>(0);
			list.push(1).push(0).push(2).push(0);

			const reversed = reverseList(list);

			let current = reversed?.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([0, 2, 0, 1, 0]);
		});

		test("should reverse list with duplicate values", () => {
			const list = new DoublyLinkedList<number>(5);
			list.push(5).push(5).push(5);

			const reversed = reverseList(list);

			let current = reversed?.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([5, 5, 5, 5]);
		});

		test("should reverse list with mixed positive and negative", () => {
			const list = new DoublyLinkedList<number>(-5);
			list.push(0).push(5).push(-10).push(10);

			const reversed = reverseList(list);

			let current = reversed?.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([10, -10, 5, 0, -5]);
		});
	});

	describe("large lists", () => {
		test("should reverse large list efficiently", () => {
			const list = new DoublyLinkedList<number>(1);
			for (let i = 2; i <= 100; i++) {
				list.push(i);
			}

			const reversed = reverseList(list);

			expect(reversed).not.toBeNull();
			expect(reversed?.length).toBe(100);
			expect(reversed?.head?.value).toBe(100);
			expect(reversed?.tail?.value).toBe(1);
		});

		test("should maintain integrity in large reversed list", () => {
			const list = new DoublyLinkedList<number>(1);
			for (let i = 2; i <= 50; i++) {
				list.push(i);
			}

			const reversed = reverseList(list);

			// Check forward traversal
			let current = reversed?.head;
			let count = 0;
			let expectedValue = 50;
			while (current) {
				expect(current.value).toBe(expectedValue);
				expectedValue--;
				count++;
				current = current.next;
			}

			expect(count).toBe(50);
		});

		test("should handle very large list", () => {
			const list = new DoublyLinkedList<number>(0);
			for (let i = 1; i < 500; i++) {
				list.push(i);
			}

			const reversed = reverseList(list);

			expect(reversed?.length).toBe(500);
			expect(reversed?.head?.value).toBe(499);
			expect(reversed?.tail?.value).toBe(0);
		});
	});

	describe("head and tail verification", () => {
		test("should set correct head in reversed list", () => {
			const list = new DoublyLinkedList<number>(10);
			list.push(20).push(30).push(40);

			const reversed = reverseList(list);

			expect(reversed?.head?.value).toBe(40);
		});

		test("should set correct tail in reversed list", () => {
			const list = new DoublyLinkedList<number>(10);
			list.push(20).push(30).push(40);

			const reversed = reverseList(list);

			expect(reversed?.tail?.value).toBe(10);
		});

		test("should have head and tail point to same node for single element", () => {
			const list = new DoublyLinkedList<number>(99);

			const reversed = reverseList(list);

			expect(reversed?.head).toBe(reversed?.tail);
		});
	});

	describe("double reversal", () => {
		test("should return to original order after double reversal", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			const reversed1 = reverseList(list);
			const reversed2 = reverseList(reversed1!);

			let current = reversed2?.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([1, 2, 3, 4, 5]);
		});

		test("should maintain integrity after multiple reversals", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3);

			let reversed = reverseList(list);
			for (let i = 0; i < 9; i++) {
				reversed = reverseList(reversed!);
			}

			// After 10 reversals total (even number), should be back to original order
			let current = reversed?.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([1, 2, 3]);
		});
	});

	describe("boundary values", () => {
		test("should handle maximum safe integer", () => {
			const max = Number.MAX_SAFE_INTEGER;
			const list = new DoublyLinkedList<number>(max);
			list.push(100).push(max - 1);

			const reversed = reverseList(list);

			expect(reversed?.head?.value).toBe(max - 1);
			expect(reversed?.tail?.value).toBe(max);
		});

		test("should handle minimum safe integer", () => {
			const min = Number.MIN_SAFE_INTEGER;
			const list = new DoublyLinkedList<number>(min);
			list.push(0).push(min + 1);

			const reversed = reverseList(list);

			expect(reversed?.head?.value).toBe(min + 1);
			expect(reversed?.tail?.value).toBe(min);
		});
	});

	describe("integration with list operations", () => {
		test("should work after push operations", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2);
			list.push(3);
			list.push(4);

			const reversed = reverseList(list);

			expect(reversed?.head?.value).toBe(4);
			expect(reversed?.tail?.value).toBe(1);
		});

		test("should work after pop operations", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);
			list.pop(); // Remove 5
			list.pop(); // Remove 4

			const reversed = reverseList(list);

			let current = reversed?.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([3, 2, 1]);
		});

		test("should work after unshift operations", () => {
			const list = new DoublyLinkedList<number>(3);
			list.unshift(2).unshift(1);

			const reversed = reverseList(list);

			let current = reversed?.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([3, 2, 1]);
		});

		test("should work after shift operations", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);
			list.shift(); // Remove 1

			const reversed = reverseList(list);

			let current = reversed?.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([4, 3, 2]);
		});

		test("should work after mixed operations", () => {
			const list = new DoublyLinkedList<number>(5);
			list.unshift(4).unshift(3);
			list.push(6).push(7);
			list.shift(); // Remove 3
			list.pop(); // Remove 7

			const reversed = reverseList(list);

			let current = reversed?.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([6, 5, 4]);
		});

		test("should work with get operations on reversed list", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			const reversed = reverseList(list);

			expect(reversed?.get(0)?.value).toBe(4);
			expect(reversed?.get(1)?.value).toBe(3);
			expect(reversed?.get(2)?.value).toBe(2);
			expect(reversed?.get(3)?.value).toBe(1);
		});

		test("should allow further operations on reversed list", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3);

			const reversed = reverseList(list);
			reversed?.push(0);
			reversed?.unshift(4);

			let current = reversed?.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([4, 3, 2, 1, 0]);
		});
	});

	describe("specific sequences", () => {
		test("should reverse [1, 2, 3, 4, 5]", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			const reversed = reverseList(list);

			let current = reversed?.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([5, 4, 3, 2, 1]);
		});

		test("should reverse [10, 20, 30]", () => {
			const list = new DoublyLinkedList<number>(10);
			list.push(20).push(30);

			const reversed = reverseList(list);

			let current = reversed?.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([30, 20, 10]);
		});

		test("should reverse [100]", () => {
			const list = new DoublyLinkedList<number>(100);

			const reversed = reverseList(list);

			expect(reversed?.head?.value).toBe(100);
			expect(reversed?.length).toBe(1);
		});
	});

	describe("length verification", () => {
		test("should maintain correct length in reversed list", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			const reversed = reverseList(list);

			expect(reversed?.length).toBe(5);
		});

		test("should have length 1 for single node reversal", () => {
			const list = new DoublyLinkedList<number>(42);

			const reversed = reverseList(list);

			expect(reversed?.length).toBe(1);
		});

		test("should match original list length", () => {
			const list = new DoublyLinkedList<number>(1);
			for (let i = 2; i <= 20; i++) {
				list.push(i);
			}

			const reversed = reverseList(list);

			expect(reversed?.length).toBe(list.length);
		});
	});
});

describe("partitionList()", () => {
	describe("basic functionality", () => {
		test("should partition list around x = 5", () => {
			const list = new DoublyLinkedList<number>(3);
			list.push(8).push(5).push(10).push(2).push(1);

			partitionList(list, 5);

			// Collect values
			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			// Check that values < 5 come before values >= 5
			expect(values).toEqual([3, 2, 1, 8, 5, 10]);
		});

		test("should handle all values less than x", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3);

			partitionList(list, 5);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([1, 2, 3]);
		});

		test("should handle all values greater than or equal to x", () => {
			const list = new DoublyLinkedList<number>(6);
			list.push(7).push(8);

			partitionList(list, 5);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([6, 7, 8]);
		});

		test("should handle single node list", () => {
			const list = new DoublyLinkedList<number>(42);

			partitionList(list, 5);

			expect(list.head?.value).toBe(42);
			expect(list.tail?.value).toBe(42);
			expect(list.length).toBe(1);
		});

		test("should handle two-node list with partition", () => {
			const list = new DoublyLinkedList<number>(10);
			list.push(2);

			partitionList(list, 5);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 10]);
		});
	});

	describe("relative order preservation", () => {
		test("should maintain relative order in less partition", () => {
			const list = new DoublyLinkedList<number>(3);
			list.push(1).push(2).push(10).push(8);

			partitionList(list, 5);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			// 3, 1, 2 should maintain their relative order
			expect(values.slice(0, 3)).toEqual([3, 1, 2]);
		});

		test("should maintain relative order in greater partition", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(10).push(8).push(7).push(2);

			partitionList(list, 5);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			// 10, 8, 7 should maintain their relative order
			expect(values.slice(2)).toEqual([10, 8, 7]);
		});

		test("should preserve order with multiple elements in both partitions", () => {
			const list = new DoublyLinkedList<number>(4);
			list.push(9).push(2).push(7).push(1).push(8).push(3);

			partitionList(list, 5);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			// Less: 4, 2, 1, 3 (original order)
			// Greater: 9, 7, 8 (original order)
			expect(values).toEqual([4, 2, 1, 3, 9, 7, 8]);
		});
	});

	describe("bidirectional integrity", () => {
		test("should maintain correct forward links", () => {
			const list = new DoublyLinkedList<number>(3);
			list.push(8).push(5).push(10).push(2).push(1);

			partitionList(list, 5);

			// Forward traversal
			let current = list.head;
			const forward: number[] = [];
			while (current) {
				forward.push(current.value);
				current = current.next;
			}

			expect(forward).toEqual([3, 2, 1, 8, 5, 10]);
		});

		test("should maintain correct backward links", () => {
			const list = new DoublyLinkedList<number>(3);
			list.push(8).push(5).push(10).push(2).push(1);

			partitionList(list, 5);

			// Backward traversal
			let current = list.tail;
			const backward: number[] = [];
			while (current) {
				backward.push(current.value);
				current = current.prev;
			}

			expect(backward).toEqual([10, 5, 8, 1, 2, 3]);
		});

		test("should have null prev pointer at head", () => {
			const list = new DoublyLinkedList<number>(3);
			list.push(8).push(5);

			partitionList(list, 5);

			expect(list.head?.prev).toBeNull();
		});

		test("should have null next pointer at tail", () => {
			const list = new DoublyLinkedList<number>(3);
			list.push(8).push(5);

			partitionList(list, 5);

			expect(list.tail?.next).toBeNull();
		});

		test("should maintain bidirectional links throughout list", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(6).push(2).push(7).push(3).push(8);

			partitionList(list, 5);

			// Check each node's bidirectional links
			let current = list.head;
			while (current?.next) {
				expect(current.next.prev).toBe(current);
				current = current.next;
			}
		});
	});

	describe("head and tail updates", () => {
		test("should update head when first node moves to greater partition", () => {
			const list = new DoublyLinkedList<number>(10);
			list.push(1).push(2);

			partitionList(list, 5);

			expect(list.head?.value).toBe(1);
		});

		test("should update tail when last node moves to less partition", () => {
			const list = new DoublyLinkedList<number>(5);
			list.push(6).push(2);

			partitionList(list, 5);

			expect(list.tail?.value).toBe(6);
		});

		test("should keep head unchanged when first node stays in less partition", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(6).push(2);

			partitionList(list, 5);

			expect(list.head?.value).toBe(1);
		});

		test("should keep tail unchanged when last node stays in greater partition", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(10);

			partitionList(list, 5);

			expect(list.tail?.value).toBe(10);
		});
	});

	describe("edge cases with partition value", () => {
		test("should handle x equal to a node value", () => {
			const list = new DoublyLinkedList<number>(5);
			list.push(3).push(7).push(5).push(2);

			partitionList(list, 5);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			// 5's should be in greater partition
			expect(values).toEqual([3, 2, 5, 7, 5]);
		});

		test("should handle x larger than all values", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			partitionList(list, 100);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([1, 2, 3, 4]);
		});

		test("should handle x smaller than all values", () => {
			const list = new DoublyLinkedList<number>(5);
			list.push(6).push(7).push(8);

			partitionList(list, 1);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([5, 6, 7, 8]);
		});

		test("should handle negative partition value", () => {
			const list = new DoublyLinkedList<number>(-5);
			list.push(3).push(-2).push(7).push(-1);

			partitionList(list, 0);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([-5, -2, -1, 3, 7]);
		});

		test("should handle zero as partition value", () => {
			const list = new DoublyLinkedList<number>(-3);
			list.push(5).push(-1).push(2).push(-2);

			partitionList(list, 0);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([-3, -1, -2, 5, 2]);
		});
	});

	describe("duplicate values", () => {
		test("should handle duplicate values less than x", () => {
			const list = new DoublyLinkedList<number>(2);
			list.push(8).push(2).push(2).push(9);

			partitionList(list, 5);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 2, 2, 8, 9]);
		});

		test("should handle duplicate values greater than x", () => {
			const list = new DoublyLinkedList<number>(7);
			list.push(2).push(7).push(3).push(7);

			partitionList(list, 5);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 3, 7, 7, 7]);
		});

		test("should handle all duplicate values", () => {
			const list = new DoublyLinkedList<number>(5);
			list.push(5).push(5).push(5);

			partitionList(list, 5);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([5, 5, 5, 5]);
		});
	});

	describe("large lists", () => {
		test("should partition large list efficiently", () => {
			const list = new DoublyLinkedList<number>(50);
			for (let i = 1; i <= 99; i++) {
				list.push(i);
			}

			partitionList(list, 50);

			// Verify partition
			let current = list.head;
			let foundGreaterOrEqual = false;
			while (current) {
				if (foundGreaterOrEqual) {
					expect(current.value).toBeGreaterThanOrEqual(50);
				}
				if (current.value >= 50) {
					foundGreaterOrEqual = true;
				}
				current = current.next;
			}
		});

		test("should maintain length in large list", () => {
			const list = new DoublyLinkedList<number>(1);
			for (let i = 2; i <= 100; i++) {
				list.push(i);
			}
			const originalLength = list.length;

			partitionList(list, 50);

			expect(list.length).toBe(originalLength);
		});

		test("should maintain integrity in large partitioned list", () => {
			const list = new DoublyLinkedList<number>(25);
			for (let i = 26; i <= 100; i++) {
				list.push(i);
			}

			partitionList(list, 50);

			// Check bidirectional links
			let current = list.head;
			let count = 0;
			while (current?.next) {
				expect(current.next.prev).toBe(current);
				count++;
				current = current.next;
			}
			expect(count).toBe(75); // 76 nodes = 75 links
		});
	});

	describe("length preservation", () => {
		test("should not change length after partition", () => {
			const list = new DoublyLinkedList<number>(3);
			list.push(8).push(5).push(10).push(2).push(1);
			const originalLength = list.length;

			partitionList(list, 5);

			expect(list.length).toBe(originalLength);
		});

		test("should preserve length for single node", () => {
			const list = new DoublyLinkedList<number>(5);

			partitionList(list, 3);

			expect(list.length).toBe(1);
		});
	});

	describe("integration with list operations", () => {
		test("should work after push operations", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(6);
			list.push(2);
			list.push(7);

			partitionList(list, 5);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([1, 2, 6, 7]);
		});

		test("should work after pop operations", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(6).push(2).push(100);
			list.pop(); // Remove 100

			partitionList(list, 5);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([1, 2, 6]);
		});

		test("should work after unshift operations", () => {
			const list = new DoublyLinkedList<number>(5);
			list.unshift(3);
			list.push(7);

			partitionList(list, 5);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([3, 5, 7]);
		});

		test("should allow get operations after partition", () => {
			const list = new DoublyLinkedList<number>(3);
			list.push(8).push(5).push(10).push(2).push(1);

			partitionList(list, 5);

			expect(list.get(0)?.value).toBe(3);
			expect(list.get(1)?.value).toBe(2);
			expect(list.get(2)?.value).toBe(1);
			expect(list.get(3)?.value).toBe(8);
		});

		test("should allow further modifications after partition", () => {
			const list = new DoublyLinkedList<number>(3);
			list.push(8).push(2);

			partitionList(list, 5);

			list.push(10);
			list.unshift(1);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([1, 3, 2, 8, 10]);
		});
	});

	describe("specific partition scenarios", () => {
		test("should partition [3, 8, 5, 10, 2, 1] with x=5", () => {
			const list = new DoublyLinkedList<number>(3);
			list.push(8).push(5).push(10).push(2).push(1);

			partitionList(list, 5);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([3, 2, 1, 8, 5, 10]);
		});

		test("should partition [1, 4, 3, 2, 5, 2] with x=3", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(4).push(3).push(2).push(5).push(2);

			partitionList(list, 3);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([1, 2, 2, 4, 3, 5]);
		});

		test("should partition [5, 1, 5, 1, 5] with x=3", () => {
			const list = new DoublyLinkedList<number>(5);
			list.push(1).push(5).push(1).push(5);

			partitionList(list, 3);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([1, 1, 5, 5, 5]);
		});
	});

	describe("boundary values", () => {
		test("should handle maximum safe integer as partition", () => {
			const max = Number.MAX_SAFE_INTEGER;
			const list = new DoublyLinkedList<number>(100);
			list.push(max).push(50);

			partitionList(list, max);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([100, 50, max]);
		});

		test("should handle minimum safe integer as partition", () => {
			const min = Number.MIN_SAFE_INTEGER;
			const list = new DoublyLinkedList<number>(0);
			list.push(min).push(100);

			partitionList(list, 0);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([min, 0, 100]);
		});
	});

	describe("alternating values", () => {
		test("should handle alternating less/greater values", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(10).push(2).push(9).push(3).push(8);

			partitionList(list, 5);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([1, 2, 3, 10, 9, 8]);
		});

		test("should handle descending values with partition in middle", () => {
			const list = new DoublyLinkedList<number>(10);
			list.push(9).push(8).push(7).push(6).push(5).push(4).push(3);

			partitionList(list, 7);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			// Values < 7: 6, 5, 4, 3 (maintain order)
			// Values >= 7: 10, 9, 8, 7 (maintain order)
			expect(values).toEqual([6, 5, 4, 3, 10, 9, 8, 7]);
		});
	});
});

describe("swapPairs()", () => {
	describe("basic functionality", () => {
		test("should swap pairs in even-length list", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 1, 4, 3]);
		});

		test("should swap pairs in odd-length list leaving last node", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 1, 4, 3, 5]);
		});

		test("should handle single node list", () => {
			const list = new DoublyLinkedList<number>(42);

			swapPairs(list);

			expect(list.head?.value).toBe(42);
			expect(list.length).toBe(1);
		});

		test("should swap single pair (two nodes)", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2);

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 1]);
		});

		test("should handle three nodes", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3);

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 1, 3]);
		});
	});

	describe("bidirectional integrity", () => {
		test("should maintain correct forward links", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6);

			swapPairs(list);

			// Forward traversal
			let current = list.head;
			const forward: number[] = [];
			while (current) {
				forward.push(current.value);
				current = current.next;
			}

			expect(forward).toEqual([2, 1, 4, 3, 6, 5]);
		});

		test("should maintain correct backward links", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6);

			swapPairs(list);

			// Backward traversal
			let current = list.tail;
			const backward: number[] = [];
			while (current) {
				backward.push(current.value);
				current = current.prev;
			}

			expect(backward).toEqual([5, 6, 3, 4, 1, 2]);
		});

		test("should have null prev pointer at head", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			swapPairs(list);

			expect(list.head?.prev).toBeNull();
		});

		test("should have null next pointer at tail", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			swapPairs(list);

			expect(list.tail?.next).toBeNull();
		});

		test("should maintain bidirectional links throughout list", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6);

			swapPairs(list);

			// Check each node's bidirectional links
			let current = list.head;
			while (current?.next) {
				expect(current.next.prev).toBe(current);
				current = current.next;
			}
		});

		test("should verify all prev pointers are correct", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			swapPairs(list);

			// Collect values going forward
			let current = list.head;
			const forward: number[] = [];
			while (current) {
				forward.push(current.value);
				current = current.next;
			}

			// Collect values going backward
			current = list.tail;
			const backward: number[] = [];
			while (current) {
				backward.push(current.value);
				current = current.prev;
			}

			expect(backward.reverse()).toEqual(forward);
		});
	});

	describe("head and tail updates", () => {
		test("should update head after swapping first pair", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			swapPairs(list);

			expect(list.head?.value).toBe(2);
		});

		test("should update tail correctly for even-length list", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);
			// After swap: 2 <-> 1 <-> 4 <-> 3
			// Node with value 3 becomes the new tail

			swapPairs(list);

			expect(list.tail?.value).toBe(3);
			expect(list.tail?.next).toBeNull();
		});

		test("should keep tail unchanged for odd-length list", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3);
			const originalTail = list.tail;

			swapPairs(list);

			expect(list.tail).toBe(originalTail);
		});

		test("should handle head and tail correctly for two-node list", () => {
			const list = new DoublyLinkedList<number>(10);
			list.push(20);

			swapPairs(list);

			expect(list.head?.value).toBe(20);
			expect(list.tail?.value).toBe(10);
		});
	});

	describe("length preservation", () => {
		test("should not change length after swap", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6);
			const originalLength = list.length;

			swapPairs(list);

			expect(list.length).toBe(originalLength);
		});

		test("should preserve length for single node", () => {
			const list = new DoublyLinkedList<number>(1);

			swapPairs(list);

			expect(list.length).toBe(1);
		});

		test("should preserve length for two nodes", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2);

			swapPairs(list);

			expect(list.length).toBe(2);
		});
	});

	describe("multiple pairs", () => {
		test("should swap three pairs correctly", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6);

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 1, 4, 3, 6, 5]);
		});

		test("should swap four pairs correctly", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6).push(7).push(8);

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 1, 4, 3, 6, 5, 8, 7]);
		});

		test("should handle large even-length list", () => {
			const list = new DoublyLinkedList<number>(1);
			for (let i = 2; i <= 10; i++) {
				list.push(i);
			}

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 1, 4, 3, 6, 5, 8, 7, 10, 9]);
		});

		test("should handle large odd-length list", () => {
			const list = new DoublyLinkedList<number>(1);
			for (let i = 2; i <= 11; i++) {
				list.push(i);
			}

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 1, 4, 3, 6, 5, 8, 7, 10, 9, 11]);
		});
	});

	describe("different data patterns", () => {
		test("should work with negative numbers", () => {
			const list = new DoublyLinkedList<number>(-1);
			list.push(-2).push(-3).push(-4);

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([-2, -1, -4, -3]);
		});

		test("should work with zeros", () => {
			const list = new DoublyLinkedList<number>(0);
			list.push(1).push(0).push(2);

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([1, 0, 2, 0]);
		});

		test("should work with duplicate values", () => {
			const list = new DoublyLinkedList<number>(5);
			list.push(5).push(5).push(5);

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([5, 5, 5, 5]);
		});

		test("should work with descending values", () => {
			const list = new DoublyLinkedList<number>(10);
			list.push(9).push(8).push(7).push(6).push(5);

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([9, 10, 7, 8, 5, 6]);
		});
	});

	describe("integration with list operations", () => {
		test("should work after push operations", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2);
			list.push(3);
			list.push(4);

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 1, 4, 3]);
		});

		test("should work after pop operations", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6);
			list.pop(); // Remove 6
			list.pop(); // Remove 5

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 1, 4, 3]);
		});

		test("should work after unshift operations", () => {
			const list = new DoublyLinkedList<number>(3);
			list.push(4);
			list.unshift(2);
			list.unshift(1);

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 1, 4, 3]);
		});

		test("should allow get operations after swap", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			swapPairs(list);

			expect(list.get(0)?.value).toBe(2);
			expect(list.get(1)?.value).toBe(1);
			expect(list.get(2)?.value).toBe(4);
			expect(list.get(3)?.value).toBe(3);
		});

		test("should allow further modifications after swap", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			swapPairs(list);
			list.push(5);
			list.unshift(0);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([0, 2, 1, 4, 3, 5]);
		});
	});

	describe("double swap", () => {
		test("should return to original after swapping twice", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			swapPairs(list);
			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([1, 2, 3, 4]);
		});

		test("should maintain integrity after multiple swaps", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5).push(6);

			// Swap 3 times
			swapPairs(list);
			swapPairs(list);
			swapPairs(list);

			// After odd number of swaps, should be swapped
			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 1, 4, 3, 6, 5]);

			// Verify bidirectional integrity
			current = list.head;
			while (current?.next) {
				expect(current.next.prev).toBe(current);
				current = current.next;
			}
		});
	});

	describe("specific test cases", () => {
		test("should swap [1, 2, 3, 4] to [2, 1, 4, 3]", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4);

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 1, 4, 3]);
		});

		test("should swap [1, 2, 3, 4, 5] to [2, 1, 4, 3, 5]", () => {
			const list = new DoublyLinkedList<number>(1);
			list.push(2).push(3).push(4).push(5);

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([2, 1, 4, 3, 5]);
		});

		test("should handle [10, 20, 30, 40, 50, 60]", () => {
			const list = new DoublyLinkedList<number>(10);
			list.push(20).push(30).push(40).push(50).push(60);

			swapPairs(list);

			let current = list.head;
			const values: number[] = [];
			while (current) {
				values.push(current.value);
				current = current.next;
			}

			expect(values).toEqual([20, 10, 40, 30, 60, 50]);
		});
	});

	describe("boundary values", () => {
		test("should handle maximum safe integer", () => {
			const max = Number.MAX_SAFE_INTEGER;
			const list = new DoublyLinkedList<number>(max);
			list
				.push(100)
				.push(max - 1)
				.push(200);

			swapPairs(list);

			expect(list.head?.value).toBe(100);
			expect(list.head?.next?.value).toBe(max);
		});

		test("should handle minimum safe integer", () => {
			const min = Number.MIN_SAFE_INTEGER;
			const list = new DoublyLinkedList<number>(min);
			list
				.push(0)
				.push(min + 1)
				.push(100);

			swapPairs(list);

			expect(list.head?.value).toBe(0);
			expect(list.head?.next?.value).toBe(min);
		});
	});

	describe("large lists", () => {
		test("should handle very large even list", () => {
			const list = new DoublyLinkedList<number>(1);
			for (let i = 2; i <= 100; i++) {
				list.push(i);
			}

			swapPairs(list);

			expect(list.head?.value).toBe(2);
			expect(list.head?.next?.value).toBe(1);
			expect(list.length).toBe(100);

			// Verify all pairs are swapped
			let current = list.head;
			let index = 0;
			while (current?.next) {
				if (index % 2 === 0) {
					// Even index should have larger value
					expect(current.value).toBeGreaterThan(current.next.value);
				}
				current = current.next;
				index++;
			}
		});

		test("should maintain integrity in large swapped list", () => {
			const list = new DoublyLinkedList<number>(1);
			for (let i = 2; i <= 50; i++) {
				list.push(i);
			}

			swapPairs(list);

			// Check bidirectional links
			let current = list.head;
			let count = 0;
			while (current?.next) {
				expect(current.next.prev).toBe(current);
				count++;
				current = current.next;
			}
			expect(count).toBe(49);
		});
	});
});
