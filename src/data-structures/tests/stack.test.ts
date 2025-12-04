import { describe, expect, test } from "bun:test";
import { Stack } from "@/data-structures/stack/stack";

describe("Stack", () => {
	describe("constructor", () => {
		test("should create empty stack", () => {
			const stack = new Stack<number>();

			expect(stack.isEmpty()).toBe(true);
			expect(stack.size()).toBe(0);
			expect(stack.peek()).toBeUndefined();
		});

		test("should create stack with initial value", () => {
			const stack = new Stack<number>(10);

			expect(stack.isEmpty()).toBe(false);
			expect(stack.size()).toBe(1);
			expect(stack.peek()).toBe(10);
		});

		test("should work with string type", () => {
			const stack = new Stack<string>("hello");

			expect(stack.peek()).toBe("hello");
			expect(stack.size()).toBe(1);
		});

		test("should work with object type", () => {
			const obj = { id: 1, name: "test" };
			const stack = new Stack<typeof obj>(obj);

			expect(stack.peek()).toEqual(obj);
			expect(stack.size()).toBe(1);
		});
	});

	describe("push()", () => {
		test("should add element to empty stack", () => {
			const stack = new Stack<number>();
			stack.push(5);

			expect(stack.size()).toBe(1);
			expect(stack.peek()).toBe(5);
			expect(stack.isEmpty()).toBe(false);
		});

		test("should add multiple elements", () => {
			const stack = new Stack<number>(1);
			stack.push(2).push(3).push(4);

			expect(stack.size()).toBe(4);
			expect(stack.peek()).toBe(4);
		});

		test("should maintain LIFO order", () => {
			const stack = new Stack<number>();
			stack.push(1).push(2).push(3);

			expect(stack.pop()).toBe(3);
			expect(stack.pop()).toBe(2);
			expect(stack.pop()).toBe(1);
		});

		test("should return stack for method chaining", () => {
			const stack = new Stack<number>();
			const result = stack.push(1);

			expect(result).toBe(stack);
		});

		test("should handle negative numbers", () => {
			const stack = new Stack<number>();
			stack.push(-10).push(-20).push(-30);

			expect(stack.peek()).toBe(-30);
			expect(stack.size()).toBe(3);
		});

		test("should handle zero", () => {
			const stack = new Stack<number>();
			stack.push(0);

			expect(stack.peek()).toBe(0);
			expect(stack.size()).toBe(1);
		});

		test("should handle duplicate values", () => {
			const stack = new Stack<number>();
			stack.push(5).push(5).push(5);

			expect(stack.size()).toBe(3);
			expect(stack.pop()).toBe(5);
			expect(stack.pop()).toBe(5);
			expect(stack.pop()).toBe(5);
		});
	});

	describe("pop()", () => {
		test("should remove and return top element", () => {
			const stack = new Stack<number>(10);
			stack.push(20).push(30);

			const value = stack.pop();

			expect(value).toBe(30);
			expect(stack.size()).toBe(2);
			expect(stack.peek()).toBe(20);
		});

		test("should return undefined for empty stack", () => {
			const stack = new Stack<number>();

			expect(stack.pop()).toBeUndefined();
			expect(stack.size()).toBe(0);
		});

		test("should handle popping all elements", () => {
			const stack = new Stack<number>(1);
			stack.push(2).push(3);

			expect(stack.pop()).toBe(3);
			expect(stack.pop()).toBe(2);
			expect(stack.pop()).toBe(1);
			expect(stack.pop()).toBeUndefined();
			expect(stack.isEmpty()).toBe(true);
		});

		test("should decrease size correctly", () => {
			const stack = new Stack<number>(1);
			stack.push(2).push(3).push(4).push(5);

			expect(stack.size()).toBe(5);
			stack.pop();
			expect(stack.size()).toBe(4);
			stack.pop();
			expect(stack.size()).toBe(3);
		});

		test("should maintain LIFO order with multiple pops", () => {
			const stack = new Stack<string>("a");
			stack.push("b").push("c").push("d").push("e");

			const values: string[] = [];
			while (!stack.isEmpty()) {
				const val = stack.pop();
				if (val !== undefined) values.push(val);
			}

			expect(values).toEqual(["e", "d", "c", "b", "a"]);
		});

		test("should handle single element stack", () => {
			const stack = new Stack<number>(42);

			expect(stack.pop()).toBe(42);
			expect(stack.isEmpty()).toBe(true);
			expect(stack.peek()).toBeUndefined();
		});
	});

	describe("peek()", () => {
		test("should return top element without removing", () => {
			const stack = new Stack<number>(10);
			stack.push(20);

			const value1 = stack.peek();
			const value2 = stack.peek();

			expect(value1).toBe(20);
			expect(value2).toBe(20);
			expect(stack.size()).toBe(2);
		});

		test("should return undefined for empty stack", () => {
			const stack = new Stack<number>();

			expect(stack.peek()).toBeUndefined();
		});

		test("should not modify stack", () => {
			const stack = new Stack<number>(1);
			stack.push(2).push(3);

			const sizeBefore = stack.size();
			stack.peek();
			const sizeAfter = stack.size();

			expect(sizeBefore).toBe(sizeAfter);
			expect(stack.peek()).toBe(3);
		});

		test("should always return current top", () => {
			const stack = new Stack<number>(1);
			stack.push(2);
			expect(stack.peek()).toBe(2);

			stack.push(3);
			expect(stack.peek()).toBe(3);

			stack.pop();
			expect(stack.peek()).toBe(2);
		});
	});

	describe("isEmpty()", () => {
		test("should return true for empty stack", () => {
			const stack = new Stack<number>();

			expect(stack.isEmpty()).toBe(true);
		});

		test("should return false for non-empty stack", () => {
			const stack = new Stack<number>(10);

			expect(stack.isEmpty()).toBe(false);
		});

		test("should return true after popping all elements", () => {
			const stack = new Stack<number>(1);
			stack.push(2);

			stack.pop();
			stack.pop();

			expect(stack.isEmpty()).toBe(true);
		});

		test("should return false after pushing to empty stack", () => {
			const stack = new Stack<number>();

			expect(stack.isEmpty()).toBe(true);
			stack.push(5);
			expect(stack.isEmpty()).toBe(false);
		});

		test("should return true after clear", () => {
			const stack = new Stack<number>(1);
			stack.push(2).push(3);

			stack.clear();

			expect(stack.isEmpty()).toBe(true);
		});
	});

	describe("size()", () => {
		test("should return 0 for empty stack", () => {
			const stack = new Stack<number>();

			expect(stack.size()).toBe(0);
		});

		test("should return correct size after pushes", () => {
			const stack = new Stack<number>(1);
			expect(stack.size()).toBe(1);

			stack.push(2);
			expect(stack.size()).toBe(2);

			stack.push(3);
			expect(stack.size()).toBe(3);
		});

		test("should return correct size after pops", () => {
			const stack = new Stack<number>(1);
			stack.push(2).push(3).push(4);

			expect(stack.size()).toBe(4);
			stack.pop();
			expect(stack.size()).toBe(3);
			stack.pop();
			expect(stack.size()).toBe(2);
		});

		test("should return correct size after mixed operations", () => {
			const stack = new Stack<number>(1);
			stack.push(2).push(3);
			expect(stack.size()).toBe(3);

			stack.pop();
			expect(stack.size()).toBe(2);

			stack.push(4).push(5);
			expect(stack.size()).toBe(4);

			stack.pop();
			expect(stack.size()).toBe(3);
		});

		test("should handle large stack", () => {
			const stack = new Stack<number>();

			for (let i = 0; i < 1000; i++) {
				stack.push(i);
			}

			expect(stack.size()).toBe(1000);
		});
	});

	describe("clear()", () => {
		test("should clear empty stack", () => {
			const stack = new Stack<number>();
			stack.clear();

			expect(stack.isEmpty()).toBe(true);
			expect(stack.size()).toBe(0);
		});

		test("should clear stack with elements", () => {
			const stack = new Stack<number>(1);
			stack.push(2).push(3).push(4);

			stack.clear();

			expect(stack.isEmpty()).toBe(true);
			expect(stack.size()).toBe(0);
			expect(stack.peek()).toBeUndefined();
		});

		test("should allow operations after clear", () => {
			const stack = new Stack<number>(1);
			stack.push(2).push(3);
			stack.clear();

			stack.push(10);

			expect(stack.size()).toBe(1);
			expect(stack.peek()).toBe(10);
		});

		test("should return stack for method chaining", () => {
			const stack = new Stack<number>(1);
			const result = stack.clear();

			expect(result).toBe(stack);
		});
	});

	describe("integration scenarios", () => {
		test("should work as undo/redo mechanism", () => {
			const undoStack = new Stack<string>();
			const redoStack = new Stack<string>();

			// Perform actions
			undoStack.push("action1");
			undoStack.push("action2");
			undoStack.push("action3");

			// Undo twice
			const undo1 = undoStack.pop();
			if (undo1) redoStack.push(undo1);
			const undo2 = undoStack.pop();
			if (undo2) redoStack.push(undo2);

			expect(undoStack.size()).toBe(1);
			expect(redoStack.size()).toBe(2);
			expect(redoStack.peek()).toBe("action2");

			// Redo once
			const redo1 = redoStack.pop();
			if (redo1) undoStack.push(redo1);

			expect(undoStack.size()).toBe(2);
			expect(undoStack.peek()).toBe("action2");
		});

		test("should reverse a string", () => {
			const stack = new Stack<string>();
			const input = "hello";

			for (const char of input) {
				stack.push(char);
			}

			let reversed = "";
			while (!stack.isEmpty()) {
				const char = stack.pop();
				if (char) reversed += char;
			}

			expect(reversed).toBe("olleh");
		});

		test("should check balanced parentheses", () => {
			const checkBalanced = (str: string): boolean => {
				const stack = new Stack<string>();
				const pairs: Record<string, string> = {
					")": "(",
					"}": "{",
					"]": "[",
				};

				for (const char of str) {
					if (char === "(" || char === "{" || char === "[") {
						stack.push(char);
					} else if (char === ")" || char === "}" || char === "]") {
						if (stack.isEmpty() || stack.pop() !== pairs[char]) {
							return false;
						}
					}
				}

				return stack.isEmpty();
			};

			expect(checkBalanced("()")).toBe(true);
			expect(checkBalanced("()[]{}")).toBe(true);
			expect(checkBalanced("{[()]}")).toBe(true);
			expect(checkBalanced("(]")).toBe(false);
			expect(checkBalanced("([)]")).toBe(false);
			expect(checkBalanced("((")).toBe(false);
		});

		test("should handle function call simulation", () => {
			const callStack = new Stack<string>();

			callStack.push("main()");
			callStack.push("processData()");
			callStack.push("validateInput()");

			expect(callStack.size()).toBe(3);
			expect(callStack.peek()).toBe("validateInput()");

			// Function returns
			callStack.pop(); // validateInput() returns
			expect(callStack.peek()).toBe("processData()");

			callStack.pop(); // processData() returns
			expect(callStack.peek()).toBe("main()");
		});
	});

	describe("edge cases", () => {
		test("should handle very large stack", () => {
			const stack = new Stack<number>();

			for (let i = 0; i < 10000; i++) {
				stack.push(i);
			}

			expect(stack.size()).toBe(10000);
			expect(stack.peek()).toBe(9999);

			for (let i = 0; i < 5000; i++) {
				stack.pop();
			}

			expect(stack.size()).toBe(5000);
			expect(stack.peek()).toBe(4999);
		});

		test("should handle alternating push and pop", () => {
			const stack = new Stack<number>();

			for (let i = 0; i < 100; i++) {
				stack.push(i);
				if (i % 2 === 0) {
					stack.pop();
				}
			}

			expect(stack.size()).toBe(50);
		});

		test("should handle peek on single element multiple times", () => {
			const stack = new Stack<number>(42);

			for (let i = 0; i < 100; i++) {
				expect(stack.peek()).toBe(42);
			}

			expect(stack.size()).toBe(1);
		});
	});

	describe("boundary values", () => {
		test("should handle maximum safe integer", () => {
			const stack = new Stack<number>(Number.MAX_SAFE_INTEGER);

			expect(stack.peek()).toBe(Number.MAX_SAFE_INTEGER);
		});

		test("should handle minimum safe integer", () => {
			const stack = new Stack<number>(Number.MIN_SAFE_INTEGER);

			expect(stack.peek()).toBe(Number.MIN_SAFE_INTEGER);
		});

		test("should handle Infinity", () => {
			const stack = new Stack<number>(Number.POSITIVE_INFINITY);
			stack.push(Number.NEGATIVE_INFINITY);

			expect(stack.pop()).toBe(Number.NEGATIVE_INFINITY);
			expect(stack.pop()).toBe(Number.POSITIVE_INFINITY);
		});

		test("should handle empty strings", () => {
			const stack = new Stack<string>("");

			expect(stack.peek()).toBe("");
			expect(stack.size()).toBe(1);
		});
	});

	describe("different data types", () => {
		test("should work with boolean values", () => {
			const stack = new Stack<boolean>(true);
			stack.push(false).push(true);

			expect(stack.pop()).toBe(true);
			expect(stack.pop()).toBe(false);
			expect(stack.pop()).toBe(true);
		});

		test("should work with arrays", () => {
			const stack = new Stack<number[]>([1, 2, 3]);
			stack.push([4, 5, 6]);

			expect(stack.pop()).toEqual([4, 5, 6]);
			expect(stack.pop()).toEqual([1, 2, 3]);
		});

		test("should work with nested objects", () => {
			type User = { id: number; profile: { name: string; age: number } };
			const user1: User = { id: 1, profile: { name: "Alice", age: 30 } };
			const user2: User = { id: 2, profile: { name: "Bob", age: 25 } };

			const stack = new Stack<User>(user1);
			stack.push(user2);

			expect(stack.pop()).toEqual(user2);
			expect(stack.pop()).toEqual(user1);
		});

		test("should work with null and undefined", () => {
			const stack = new Stack<number | null | undefined>(null);
			stack.push(undefined).push(5);

			expect(stack.pop()).toBe(5);
			expect(stack.pop()).toBeUndefined();
			expect(stack.pop()).toBeNull();
		});
	});
});
