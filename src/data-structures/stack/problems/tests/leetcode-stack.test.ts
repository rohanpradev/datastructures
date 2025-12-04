import { describe, expect, test } from "bun:test";
import {
	isBalanced,
	QueueUsingStacks,
	reverseString,
	sortStack,
} from "@/data-structures/stack/problems/leetcode-stack";
import { Stack } from "@/data-structures/stack/stack";

describe("reverseString()", () => {
	describe("basic functionality", () => {
		test("should reverse a simple string", () => {
			expect(reverseString("hello")).toBe("olleh");
		});

		test("should reverse a single character", () => {
			expect(reverseString("a")).toBe("a");
		});

		test("should handle empty string", () => {
			expect(reverseString("")).toBe("");
		});

		test("should reverse a two-character string", () => {
			expect(reverseString("ab")).toBe("ba");
		});

		test("should reverse 'Stack'", () => {
			expect(reverseString("Stack")).toBe("kcatS");
		});
	});

	describe("palindromes", () => {
		test("should reverse palindrome correctly", () => {
			expect(reverseString("racecar")).toBe("racecar");
		});

		test("should reverse 'madam'", () => {
			expect(reverseString("madam")).toBe("madam");
		});

		test("should reverse 'noon'", () => {
			expect(reverseString("noon")).toBe("noon");
		});
	});

	describe("strings with spaces", () => {
		test("should preserve spaces in reversal", () => {
			expect(reverseString("hello world")).toBe("dlrow olleh");
		});

		test("should handle leading space", () => {
			expect(reverseString(" hello")).toBe("olleh ");
		});

		test("should handle trailing space", () => {
			expect(reverseString("hello ")).toBe(" olleh");
		});

		test("should handle multiple spaces", () => {
			expect(reverseString("a  b  c")).toBe("c  b  a");
		});
	});

	describe("special characters", () => {
		test("should handle numbers", () => {
			expect(reverseString("12345")).toBe("54321");
		});

		test("should handle special characters", () => {
			expect(reverseString("hello!")).toBe("!olleh");
		});

		test("should handle mixed alphanumeric", () => {
			expect(reverseString("abc123")).toBe("321cba");
		});

		test("should handle punctuation", () => {
			expect(reverseString("Hello, World!")).toBe("!dlroW ,olleH");
		});
	});

	describe("longer strings", () => {
		test("should handle longer string", () => {
			const input = "The quick brown fox";
			const expected = "xof nworb kciuq ehT";
			expect(reverseString(input)).toBe(expected);
		});

		test("should handle very long string", () => {
			const input = "a".repeat(1000);
			const expected = "a".repeat(1000);
			expect(reverseString(input)).toBe(expected);
		});
	});

	describe("edge cases", () => {
		test("should handle string with only spaces", () => {
			expect(reverseString("   ")).toBe("   ");
		});

		test("should handle unicode characters", () => {
			expect(reverseString("😀😁😂")).toBe("😂😁😀");
		});
	});
});

describe("isBalanced()", () => {
	describe("valid parentheses", () => {
		test("should return true for empty string", () => {
			expect(isBalanced("")).toBe(true);
		});

		test("should return true for single pair ()", () => {
			expect(isBalanced("()")).toBe(true);
		});

		test("should return true for single pair {}", () => {
			expect(isBalanced("{}")).toBe(true);
		});

		test("should return true for single pair []", () => {
			expect(isBalanced("[]")).toBe(true);
		});

		test("should return true for multiple pairs", () => {
			expect(isBalanced("()[]{}")).toBe(true);
		});

		test("should return true for nested brackets", () => {
			expect(isBalanced("{[()]}")).toBe(true);
		});

		test("should return true for complex nesting", () => {
			expect(isBalanced("({[]})")).toBe(true);
		});

		test("should return true for deeply nested", () => {
			expect(isBalanced("(((())))")).toBe(true);
		});

		test("should return true for mixed deeply nested", () => {
			expect(isBalanced("{[({[]})]}")).toBe(true);
		});
	});

	describe("invalid parentheses", () => {
		test("should return false for single opening bracket", () => {
			expect(isBalanced("(")).toBe(false);
		});

		test("should return false for single closing bracket", () => {
			expect(isBalanced(")")).toBe(false);
		});

		test("should return false for mismatched pair (]", () => {
			expect(isBalanced("(]")).toBe(false);
		});

		test("should return false for mismatched pair (}", () => {
			expect(isBalanced("(}")).toBe(false);
		});

		test("should return false for wrong order ([)]", () => {
			expect(isBalanced("([)]")).toBe(false);
		});

		test("should return false for extra closing", () => {
			expect(isBalanced("())")).toBe(false);
		});

		test("should return false for extra opening", () => {
			expect(isBalanced("(()")).toBe(false);
		});

		test("should return false for mismatched types", () => {
			expect(isBalanced("{[}]")).toBe(false);
		});
	});

	describe("only opening brackets", () => {
		test("should return false for only (", () => {
			expect(isBalanced("((((")).toBe(false);
		});

		test("should return false for only {", () => {
			expect(isBalanced("{{{{")).toBe(false);
		});

		test("should return false for only [", () => {
			expect(isBalanced("[[[[")).toBe(false);
		});

		test("should return false for mixed opening", () => {
			expect(isBalanced("({[")).toBe(false);
		});
	});

	describe("only closing brackets", () => {
		test("should return false for only )", () => {
			expect(isBalanced("))))")).toBe(false);
		});

		test("should return false for only }", () => {
			expect(isBalanced("}}}}")).toBe(false);
		});

		test("should return false for only ]", () => {
			expect(isBalanced("]]]]")).toBe(false);
		});

		test("should return false for mixed closing", () => {
			expect(isBalanced(")]}")).toBe(false);
		});
	});

	describe("complex valid cases", () => {
		test("should handle multiple independent pairs", () => {
			expect(isBalanced("(){}[](){}[]")).toBe(true);
		});

		test("should handle alternating types", () => {
			expect(isBalanced("({})[]")).toBe(true);
		});

		test("should handle deeply nested same type", () => {
			expect(isBalanced("[[[[]]]]")).toBe(true);
		});

		test("should handle mixed deep nesting", () => {
			expect(isBalanced("[{[({})]}]")).toBe(true);
		});
	});

	describe("complex invalid cases", () => {
		test("should catch inner mismatch", () => {
			expect(isBalanced("[(])")).toBe(false);
		});

		test("should catch outer mismatch", () => {
			expect(isBalanced("[{()]}")).toBe(false);
		});

		test("should catch unbalanced in middle", () => {
			expect(isBalanced("()([)]{}")).toBe(false);
		});
	});

	describe("edge cases", () => {
		test("should handle very long valid string", () => {
			const str = "()".repeat(1000);
			expect(isBalanced(str)).toBe(true);
		});

		test("should handle very long invalid string", () => {
			const str = "(".repeat(1000);
			expect(isBalanced(str)).toBe(false);
		});

		test("should handle long nested valid", () => {
			let str = "";
			for (let i = 0; i < 100; i++) str += "(";
			for (let i = 0; i < 100; i++) str += ")";
			expect(isBalanced(str)).toBe(true);
		});
	});
});

describe("sortStack()", () => {
	describe("basic functionality", () => {
		test("should sort a simple stack", () => {
			const stack = new Stack<number>(3);
			stack.push(1).push(4).push(2);

			sortStack(stack);

			expect(stack.pop()).toBe(1);
			expect(stack.pop()).toBe(2);
			expect(stack.pop()).toBe(3);
			expect(stack.pop()).toBe(4);
		});

		test("should handle empty stack", () => {
			const stack = new Stack<number>();

			sortStack(stack);

			expect(stack.isEmpty()).toBe(true);
		});

		test("should handle single element", () => {
			const stack = new Stack<number>(42);

			sortStack(stack);

			expect(stack.pop()).toBe(42);
			expect(stack.isEmpty()).toBe(true);
		});

		test("should handle two elements in order", () => {
			const stack = new Stack<number>(1);
			stack.push(2);

			sortStack(stack);

			expect(stack.pop()).toBe(1);
			expect(stack.pop()).toBe(2);
		});

		test("should handle two elements reversed", () => {
			const stack = new Stack<number>(2);
			stack.push(1);

			sortStack(stack);

			expect(stack.pop()).toBe(1);
			expect(stack.pop()).toBe(2);
		});
	});

	describe("already sorted", () => {
		test("should handle already sorted ascending", () => {
			const stack = new Stack<number>(1);
			stack.push(2).push(3).push(4).push(5);

			sortStack(stack);

			expect(stack.pop()).toBe(1);
			expect(stack.pop()).toBe(2);
			expect(stack.pop()).toBe(3);
			expect(stack.pop()).toBe(4);
			expect(stack.pop()).toBe(5);
		});

		test("should handle sorted with small values", () => {
			const stack = new Stack<number>(-5);
			stack.push(-3).push(-1).push(0).push(2);

			sortStack(stack);

			expect(stack.pop()).toBe(-5);
			expect(stack.pop()).toBe(-3);
			expect(stack.pop()).toBe(-1);
			expect(stack.pop()).toBe(0);
			expect(stack.pop()).toBe(2);
		});
	});

	describe("reverse sorted", () => {
		test("should handle reverse sorted", () => {
			const stack = new Stack<number>(5);
			stack.push(4).push(3).push(2).push(1);

			sortStack(stack);

			expect(stack.pop()).toBe(1);
			expect(stack.pop()).toBe(2);
			expect(stack.pop()).toBe(3);
			expect(stack.pop()).toBe(4);
			expect(stack.pop()).toBe(5);
		});

		test("should handle large reverse sorted", () => {
			const stack = new Stack<number>(10);
			stack.push(9).push(8).push(7).push(6).push(5);

			sortStack(stack);

			expect(stack.pop()).toBe(5);
			expect(stack.pop()).toBe(6);
			expect(stack.pop()).toBe(7);
			expect(stack.pop()).toBe(8);
			expect(stack.pop()).toBe(9);
			expect(stack.pop()).toBe(10);
		});
	});

	describe("duplicate values", () => {
		test("should handle duplicate values", () => {
			const stack = new Stack<number>(3);
			stack.push(1).push(3).push(2).push(3);

			sortStack(stack);

			expect(stack.pop()).toBe(1);
			expect(stack.pop()).toBe(2);
			expect(stack.pop()).toBe(3);
			expect(stack.pop()).toBe(3);
			expect(stack.pop()).toBe(3);
		});

		test("should handle all same values", () => {
			const stack = new Stack<number>(5);
			stack.push(5).push(5).push(5).push(5);

			sortStack(stack);

			expect(stack.pop()).toBe(5);
			expect(stack.pop()).toBe(5);
			expect(stack.pop()).toBe(5);
			expect(stack.pop()).toBe(5);
			expect(stack.pop()).toBe(5);
		});

		test("should handle many duplicates", () => {
			const stack = new Stack<number>(2);
			stack.push(1).push(2).push(1).push(2);

			sortStack(stack);

			expect(stack.pop()).toBe(1);
			expect(stack.pop()).toBe(1);
			expect(stack.pop()).toBe(2);
			expect(stack.pop()).toBe(2);
			expect(stack.pop()).toBe(2);
		});
	});

	describe("negative numbers", () => {
		test("should handle negative numbers", () => {
			const stack = new Stack<number>(-1);
			stack.push(-5).push(-3).push(-2);

			sortStack(stack);

			expect(stack.pop()).toBe(-5);
			expect(stack.pop()).toBe(-3);
			expect(stack.pop()).toBe(-2);
			expect(stack.pop()).toBe(-1);
		});

		test("should handle mixed positive and negative", () => {
			const stack = new Stack<number>(3);
			stack.push(-1).push(4).push(-2).push(0);

			sortStack(stack);

			expect(stack.pop()).toBe(-2);
			expect(stack.pop()).toBe(-1);
			expect(stack.pop()).toBe(0);
			expect(stack.pop()).toBe(3);
			expect(stack.pop()).toBe(4);
		});
	});

	describe("random order", () => {
		test("should sort random order [5, 1, 9, 3]", () => {
			const stack = new Stack<number>(5);
			stack.push(1).push(9).push(3);

			sortStack(stack);

			expect(stack.pop()).toBe(1);
			expect(stack.pop()).toBe(3);
			expect(stack.pop()).toBe(5);
			expect(stack.pop()).toBe(9);
		});

		test("should sort random order [7, 2, 8, 1, 5]", () => {
			const stack = new Stack<number>(7);
			stack.push(2).push(8).push(1).push(5);

			sortStack(stack);

			expect(stack.pop()).toBe(1);
			expect(stack.pop()).toBe(2);
			expect(stack.pop()).toBe(5);
			expect(stack.pop()).toBe(7);
			expect(stack.pop()).toBe(8);
		});
	});

	describe("zeros", () => {
		test("should handle zeros", () => {
			const stack = new Stack<number>(0);
			stack.push(3).push(0).push(-1).push(0);

			sortStack(stack);

			expect(stack.pop()).toBe(-1);
			expect(stack.pop()).toBe(0);
			expect(stack.pop()).toBe(0);
			expect(stack.pop()).toBe(0);
			expect(stack.pop()).toBe(3);
		});
	});

	describe("larger stacks", () => {
		test("should handle 10 elements", () => {
			const stack = new Stack<number>(5);
			stack
				.push(2)
				.push(8)
				.push(1)
				.push(9)
				.push(3)
				.push(7)
				.push(4)
				.push(6)
				.push(0);

			sortStack(stack);

			for (let i = 0; i <= 9; i++) {
				expect(stack.pop()).toBe(i);
			}
		});

		test("should handle large stack with random values", () => {
			const stack = new Stack<number>(50);
			stack.push(10).push(30).push(20).push(40).push(5).push(25);

			sortStack(stack);

			expect(stack.pop()).toBe(5);
			expect(stack.pop()).toBe(10);
			expect(stack.pop()).toBe(20);
			expect(stack.pop()).toBe(25);
			expect(stack.pop()).toBe(30);
			expect(stack.pop()).toBe(40);
			expect(stack.pop()).toBe(50);
		});
	});

	describe("verification", () => {
		test("should verify stack is sorted correctly", () => {
			const stack = new Stack<number>(8);
			stack.push(3).push(1).push(9).push(4).push(2);

			sortStack(stack);

			let prev = -Infinity;
			while (!stack.isEmpty()) {
				const current = stack.pop();
				if (current !== undefined) {
					expect(current).toBeGreaterThanOrEqual(prev);
					prev = current;
				}
			}
		});
	});
});

describe("QueueUsingStacks", () => {
	describe("constructor", () => {
		test("should create an empty queue", () => {
			const queue = new QueueUsingStacks<number>();

			expect(queue.isEmpty()).toBe(true);
			expect(queue.peek()).toBeUndefined();
		});
	});

	describe("enqueue()", () => {
		test("should add element to empty queue", () => {
			const queue = new QueueUsingStacks<number>();

			queue.enqueue(1);

			expect(queue.isEmpty()).toBe(false);
			expect(queue.peek()).toBe(1);
		});

		test("should add multiple elements", () => {
			const queue = new QueueUsingStacks<number>();

			queue.enqueue(1);
			queue.enqueue(2);
			queue.enqueue(3);

			expect(queue.peek()).toBe(1);
		});

		test("should maintain FIFO order", () => {
			const queue = new QueueUsingStacks<number>();

			queue.enqueue(10);
			queue.enqueue(20);
			queue.enqueue(30);

			expect(queue.dequeue()).toBe(10);
			expect(queue.dequeue()).toBe(20);
			expect(queue.dequeue()).toBe(30);
		});
	});

	describe("dequeue()", () => {
		test("should return undefined for empty queue", () => {
			const queue = new QueueUsingStacks<number>();

			expect(queue.dequeue()).toBeUndefined();
		});

		test("should remove and return first element", () => {
			const queue = new QueueUsingStacks<number>();
			queue.enqueue(1);
			queue.enqueue(2);

			const value = queue.dequeue();

			expect(value).toBe(1);
			expect(queue.peek()).toBe(2);
		});

		test("should handle dequeuing all elements", () => {
			const queue = new QueueUsingStacks<number>();
			queue.enqueue(1);
			queue.enqueue(2);
			queue.enqueue(3);

			expect(queue.dequeue()).toBe(1);
			expect(queue.dequeue()).toBe(2);
			expect(queue.dequeue()).toBe(3);
			expect(queue.dequeue()).toBeUndefined();
			expect(queue.isEmpty()).toBe(true);
		});

		test("should maintain FIFO order with multiple operations", () => {
			const queue = new QueueUsingStacks<number>();

			queue.enqueue(1);
			queue.enqueue(2);
			expect(queue.dequeue()).toBe(1);

			queue.enqueue(3);
			expect(queue.dequeue()).toBe(2);
			expect(queue.dequeue()).toBe(3);
		});
	});

	describe("peek()", () => {
		test("should return undefined for empty queue", () => {
			const queue = new QueueUsingStacks<number>();

			expect(queue.peek()).toBeUndefined();
		});

		test("should return front element without removing", () => {
			const queue = new QueueUsingStacks<number>();
			queue.enqueue(1);
			queue.enqueue(2);

			expect(queue.peek()).toBe(1);
			expect(queue.peek()).toBe(1); // Should still be 1
			expect(queue.isEmpty()).toBe(false);
		});

		test("should update after dequeue", () => {
			const queue = new QueueUsingStacks<number>();
			queue.enqueue(1);
			queue.enqueue(2);
			queue.enqueue(3);

			expect(queue.peek()).toBe(1);
			queue.dequeue();
			expect(queue.peek()).toBe(2);
			queue.dequeue();
			expect(queue.peek()).toBe(3);
		});
	});

	describe("isEmpty()", () => {
		test("should return true for new queue", () => {
			const queue = new QueueUsingStacks<number>();

			expect(queue.isEmpty()).toBe(true);
		});

		test("should return false after enqueue", () => {
			const queue = new QueueUsingStacks<number>();
			queue.enqueue(1);

			expect(queue.isEmpty()).toBe(false);
		});

		test("should return true after dequeuing all elements", () => {
			const queue = new QueueUsingStacks<number>();
			queue.enqueue(1);
			queue.enqueue(2);

			queue.dequeue();
			queue.dequeue();

			expect(queue.isEmpty()).toBe(true);
		});
	});

	describe("alternating operations", () => {
		test("should handle alternating enqueue and dequeue", () => {
			const queue = new QueueUsingStacks<number>();

			queue.enqueue(1);
			expect(queue.dequeue()).toBe(1);

			queue.enqueue(2);
			expect(queue.dequeue()).toBe(2);

			queue.enqueue(3);
			expect(queue.dequeue()).toBe(3);
		});

		test("should handle multiple enqueues then dequeues", () => {
			const queue = new QueueUsingStacks<number>();

			queue.enqueue(1);
			queue.enqueue(2);
			queue.enqueue(3);
			queue.enqueue(4);

			expect(queue.dequeue()).toBe(1);
			expect(queue.dequeue()).toBe(2);
			expect(queue.dequeue()).toBe(3);
			expect(queue.dequeue()).toBe(4);
		});

		test("should handle mixed operations", () => {
			const queue = new QueueUsingStacks<number>();

			queue.enqueue(1);
			queue.enqueue(2);
			expect(queue.dequeue()).toBe(1);

			queue.enqueue(3);
			queue.enqueue(4);
			expect(queue.dequeue()).toBe(2);
			expect(queue.dequeue()).toBe(3);

			queue.enqueue(5);
			expect(queue.dequeue()).toBe(4);
			expect(queue.dequeue()).toBe(5);
		});
	});

	describe("different data types", () => {
		test("should work with strings", () => {
			const queue = new QueueUsingStacks<string>();

			queue.enqueue("a");
			queue.enqueue("b");
			queue.enqueue("c");

			expect(queue.dequeue()).toBe("a");
			expect(queue.dequeue()).toBe("b");
			expect(queue.dequeue()).toBe("c");
		});

		test("should work with objects", () => {
			const queue = new QueueUsingStacks<{ id: number }>();

			queue.enqueue({ id: 1 });
			queue.enqueue({ id: 2 });

			expect(queue.dequeue()).toEqual({ id: 1 });
			expect(queue.dequeue()).toEqual({ id: 2 });
		});
	});

	describe("large sequences", () => {
		test("should handle large number of enqueues", () => {
			const queue = new QueueUsingStacks<number>();

			for (let i = 1; i <= 100; i++) {
				queue.enqueue(i);
			}

			for (let i = 1; i <= 100; i++) {
				expect(queue.dequeue()).toBe(i);
			}

			expect(queue.isEmpty()).toBe(true);
		});

		test("should handle many alternating operations", () => {
			const queue = new QueueUsingStacks<number>();

			// Enqueue pairs and dequeue one at a time
			for (let i = 0; i < 50; i++) {
				queue.enqueue(i * 2); // Even numbers
				queue.enqueue(i * 2 + 1); // Odd numbers

				// First iteration dequeues 0, then 1, 2, 3, etc.
				if (i === 0) {
					expect(queue.dequeue()).toBe(0);
				} else {
					// After first iteration, we've enqueued i*2 pairs
					// and dequeued i elements, so next element is i
					expect(queue.dequeue()).toBe(i);
				}
			}
		});
	});

	describe("edge cases", () => {
		test("should handle enqueue after emptying", () => {
			const queue = new QueueUsingStacks<number>();

			queue.enqueue(1);
			queue.dequeue();
			expect(queue.isEmpty()).toBe(true);

			queue.enqueue(2);
			expect(queue.peek()).toBe(2);
			expect(queue.dequeue()).toBe(2);
		});

		test("should handle multiple peek calls", () => {
			const queue = new QueueUsingStacks<number>();
			queue.enqueue(1);

			expect(queue.peek()).toBe(1);
			expect(queue.peek()).toBe(1);
			expect(queue.peek()).toBe(1);
			expect(queue.dequeue()).toBe(1);
		});
	});

	describe("FIFO verification", () => {
		test("should strictly follow FIFO order", () => {
			const queue = new QueueUsingStacks<number>();
			const input = [10, 20, 30, 40, 50];

			for (const num of input) {
				queue.enqueue(num);
			}

			const output: number[] = [];
			while (!queue.isEmpty()) {
				const val = queue.dequeue();
				if (val !== undefined) {
					output.push(val);
				}
			}

			expect(output).toEqual(input);
		});
	});
});
