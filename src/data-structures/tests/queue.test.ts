import { describe, expect, test } from "bun:test";
import { Queue } from "@/data-structures/queue/queue";

describe("Queue", () => {
	describe("constructor", () => {
		test("should create empty queue", () => {
			const queue = new Queue<number>();

			expect(queue.isEmpty()).toBe(true);
			expect(queue.size()).toBe(0);
			expect(queue.peek()).toBeUndefined();
		});

		test("should create queue with initial value", () => {
			const queue = new Queue<number>(10);

			expect(queue.isEmpty()).toBe(false);
			expect(queue.size()).toBe(1);
			expect(queue.peek()).toBe(10);
		});

		test("should work with string type", () => {
			const queue = new Queue<string>("hello");

			expect(queue.peek()).toBe("hello");
			expect(queue.size()).toBe(1);
		});

		test("should work with object type", () => {
			const obj = { id: 1, name: "test" };
			const queue = new Queue<typeof obj>(obj);

			expect(queue.peek()).toEqual(obj);
			expect(queue.size()).toBe(1);
		});
	});

	describe("enqueue()", () => {
		test("should add element to empty queue", () => {
			const queue = new Queue<number>();
			queue.enqueue(5);

			expect(queue.size()).toBe(1);
			expect(queue.peek()).toBe(5);
			expect(queue.isEmpty()).toBe(false);
		});

		test("should add multiple elements", () => {
			const queue = new Queue<number>(1);
			queue.enqueue(2).enqueue(3).enqueue(4);

			expect(queue.size()).toBe(4);
			expect(queue.peek()).toBe(1);
		});

		test("should maintain FIFO order", () => {
			const queue = new Queue<number>();
			queue.enqueue(1).enqueue(2).enqueue(3);

			expect(queue.dequeue()).toBe(1);
			expect(queue.dequeue()).toBe(2);
			expect(queue.dequeue()).toBe(3);
		});

		test("should return queue for method chaining", () => {
			const queue = new Queue<number>();
			const result = queue.enqueue(1);

			expect(result).toBe(queue);
		});

		test("should handle negative numbers", () => {
			const queue = new Queue<number>();
			queue.enqueue(-10).enqueue(-20).enqueue(-30);

			expect(queue.peek()).toBe(-10);
			expect(queue.size()).toBe(3);
		});

		test("should handle zero", () => {
			const queue = new Queue<number>();
			queue.enqueue(0);

			expect(queue.peek()).toBe(0);
			expect(queue.size()).toBe(1);
		});

		test("should handle duplicate values", () => {
			const queue = new Queue<number>();
			queue.enqueue(5).enqueue(5).enqueue(5);

			expect(queue.size()).toBe(3);
			expect(queue.dequeue()).toBe(5);
			expect(queue.dequeue()).toBe(5);
			expect(queue.dequeue()).toBe(5);
		});

		test("should update rear pointer correctly", () => {
			const queue = new Queue<number>(1);
			queue.enqueue(2);
			queue.enqueue(3);

			// Dequeue first, then enqueue more
			queue.dequeue();
			queue.enqueue(4);

			expect(queue.size()).toBe(3);
			expect(queue.peek()).toBe(2);
		});
	});

	describe("dequeue()", () => {
		test("should remove and return front element", () => {
			const queue = new Queue<number>(10);
			queue.enqueue(20).enqueue(30);

			const value = queue.dequeue();

			expect(value).toBe(10);
			expect(queue.size()).toBe(2);
			expect(queue.peek()).toBe(20);
		});

		test("should return undefined for empty queue", () => {
			const queue = new Queue<number>();

			expect(queue.dequeue()).toBeUndefined();
			expect(queue.size()).toBe(0);
		});

		test("should handle dequeuing all elements", () => {
			const queue = new Queue<number>(1);
			queue.enqueue(2).enqueue(3);

			expect(queue.dequeue()).toBe(1);
			expect(queue.dequeue()).toBe(2);
			expect(queue.dequeue()).toBe(3);
			expect(queue.dequeue()).toBeUndefined();
			expect(queue.isEmpty()).toBe(true);
		});

		test("should decrease size correctly", () => {
			const queue = new Queue<number>(1);
			queue.enqueue(2).enqueue(3).enqueue(4).enqueue(5);

			expect(queue.size()).toBe(5);
			queue.dequeue();
			expect(queue.size()).toBe(4);
			queue.dequeue();
			expect(queue.size()).toBe(3);
		});

		test("should maintain FIFO order with multiple dequeues", () => {
			const queue = new Queue<string>("a");
			queue.enqueue("b").enqueue("c").enqueue("d").enqueue("e");

			const values: string[] = [];
			while (!queue.isEmpty()) {
				const val = queue.dequeue();
				if (val !== undefined) values.push(val);
			}

			expect(values).toEqual(["a", "b", "c", "d", "e"]);
		});

		test("should handle single element queue", () => {
			const queue = new Queue<number>(42);

			expect(queue.dequeue()).toBe(42);
			expect(queue.isEmpty()).toBe(true);
			expect(queue.peek()).toBeUndefined();
		});

		test("should handle front pointer updates correctly", () => {
			const queue = new Queue<number>(1);
			queue.enqueue(2).enqueue(3);

			queue.dequeue();
			expect(queue.peek()).toBe(2);

			queue.dequeue();
			expect(queue.peek()).toBe(3);
		});
	});

	describe("peek()", () => {
		test("should return front element without removing", () => {
			const queue = new Queue<number>(10);
			queue.enqueue(20);

			const value1 = queue.peek();
			const value2 = queue.peek();

			expect(value1).toBe(10);
			expect(value2).toBe(10);
			expect(queue.size()).toBe(2);
		});

		test("should return undefined for empty queue", () => {
			const queue = new Queue<number>();

			expect(queue.peek()).toBeUndefined();
		});

		test("should not modify queue", () => {
			const queue = new Queue<number>(1);
			queue.enqueue(2).enqueue(3);

			const sizeBefore = queue.size();
			queue.peek();
			const sizeAfter = queue.size();

			expect(sizeBefore).toBe(sizeAfter);
			expect(queue.peek()).toBe(1);
		});

		test("should always return current front", () => {
			const queue = new Queue<number>(1);
			queue.enqueue(2);
			expect(queue.peek()).toBe(1);

			queue.enqueue(3);
			expect(queue.peek()).toBe(1);

			queue.dequeue();
			expect(queue.peek()).toBe(2);
		});
	});

	describe("isEmpty()", () => {
		test("should return true for empty queue", () => {
			const queue = new Queue<number>();

			expect(queue.isEmpty()).toBe(true);
		});

		test("should return false for non-empty queue", () => {
			const queue = new Queue<number>(10);

			expect(queue.isEmpty()).toBe(false);
		});

		test("should return true after dequeuing all elements", () => {
			const queue = new Queue<number>(1);
			queue.enqueue(2);

			queue.dequeue();
			queue.dequeue();

			expect(queue.isEmpty()).toBe(true);
		});

		test("should return false after enqueuing to empty queue", () => {
			const queue = new Queue<number>();

			expect(queue.isEmpty()).toBe(true);
			queue.enqueue(5);
			expect(queue.isEmpty()).toBe(false);
		});

		test("should return true after clear", () => {
			const queue = new Queue<number>(1);
			queue.enqueue(2).enqueue(3);

			queue.clear();

			expect(queue.isEmpty()).toBe(true);
		});
	});

	describe("size()", () => {
		test("should return 0 for empty queue", () => {
			const queue = new Queue<number>();

			expect(queue.size()).toBe(0);
		});

		test("should return correct size after enqueues", () => {
			const queue = new Queue<number>(1);
			expect(queue.size()).toBe(1);

			queue.enqueue(2);
			expect(queue.size()).toBe(2);

			queue.enqueue(3);
			expect(queue.size()).toBe(3);
		});

		test("should return correct size after dequeues", () => {
			const queue = new Queue<number>(1);
			queue.enqueue(2).enqueue(3).enqueue(4);

			expect(queue.size()).toBe(4);
			queue.dequeue();
			expect(queue.size()).toBe(3);
			queue.dequeue();
			expect(queue.size()).toBe(2);
		});

		test("should return correct size after mixed operations", () => {
			const queue = new Queue<number>(1);
			queue.enqueue(2).enqueue(3);
			expect(queue.size()).toBe(3);

			queue.dequeue();
			expect(queue.size()).toBe(2);

			queue.enqueue(4).enqueue(5);
			expect(queue.size()).toBe(4);

			queue.dequeue();
			expect(queue.size()).toBe(3);
		});

		test("should handle large queue", () => {
			const queue = new Queue<number>();

			for (let i = 0; i < 1000; i++) {
				queue.enqueue(i);
			}

			expect(queue.size()).toBe(1000);
		});
	});

	describe("clear()", () => {
		test("should clear empty queue", () => {
			const queue = new Queue<number>();
			queue.clear();

			expect(queue.isEmpty()).toBe(true);
			expect(queue.size()).toBe(0);
		});

		test("should clear queue with elements", () => {
			const queue = new Queue<number>(1);
			queue.enqueue(2).enqueue(3).enqueue(4);

			queue.clear();

			expect(queue.isEmpty()).toBe(true);
			expect(queue.size()).toBe(0);
			expect(queue.peek()).toBeUndefined();
		});

		test("should allow operations after clear", () => {
			const queue = new Queue<number>(1);
			queue.enqueue(2).enqueue(3);
			queue.clear();

			queue.enqueue(10);

			expect(queue.size()).toBe(1);
			expect(queue.peek()).toBe(10);
		});

		test("should return queue for method chaining", () => {
			const queue = new Queue<number>(1);
			const result = queue.clear();

			expect(result).toBe(queue);
		});
	});

	describe("integration scenarios", () => {
		test("should work as task scheduler", () => {
			const taskQueue = new Queue<string>();

			// Add tasks
			taskQueue.enqueue("task1");
			taskQueue.enqueue("task2");
			taskQueue.enqueue("task3");

			// Process tasks in order
			const processed: string[] = [];
			while (!taskQueue.isEmpty()) {
				const task = taskQueue.dequeue();
				if (task) processed.push(task);
			}

			expect(processed).toEqual(["task1", "task2", "task3"]);
		});

		test("should work as print queue", () => {
			type PrintJob = { id: number; document: string };
			const printQueue = new Queue<PrintJob>();

			printQueue.enqueue({ id: 1, document: "doc1.pdf" });
			printQueue.enqueue({ id: 2, document: "doc2.pdf" });
			printQueue.enqueue({ id: 3, document: "doc3.pdf" });

			expect(printQueue.size()).toBe(3);

			// Process first job
			const firstJob = printQueue.dequeue();
			expect(firstJob?.id).toBe(1);
			expect(printQueue.size()).toBe(2);

			// Add urgent job
			printQueue.enqueue({ id: 4, document: "urgent.pdf" });
			expect(printQueue.size()).toBe(3);
		});

		test("should work for breadth-first search simulation", () => {
			const bfsQueue = new Queue<number>();

			// Simulate BFS traversal
			bfsQueue.enqueue(1); // root

			const visited: number[] = [];

			while (!bfsQueue.isEmpty()) {
				const node = bfsQueue.dequeue();
				if (node !== undefined) {
					visited.push(node);

					// Add children (for binary tree: left = 2*node, right = 2*node+1)
					if (node <= 3) {
						bfsQueue.enqueue(node * 2);
						bfsQueue.enqueue(node * 2 + 1);
					}
				}
			}

			expect(visited).toEqual([1, 2, 3, 4, 5, 6, 7]);
		});

		test("should handle message queue pattern", () => {
			type Message = { from: string; to: string; content: string };
			const messageQueue = new Queue<Message>();

			messageQueue.enqueue({ from: "Alice", to: "Bob", content: "Hello" });
			messageQueue.enqueue({ from: "Bob", to: "Alice", content: "Hi" });
			messageQueue.enqueue({
				from: "Alice",
				to: "Bob",
				content: "How are you?",
			});

			const firstMessage = messageQueue.dequeue();
			expect(firstMessage?.from).toBe("Alice");
			expect(firstMessage?.content).toBe("Hello");

			const secondMessage = messageQueue.dequeue();
			expect(secondMessage?.from).toBe("Bob");

			expect(messageQueue.size()).toBe(1);
		});

		test("should simulate customer service queue", () => {
			const customerQueue = new Queue<string>();

			// Customers arrive
			customerQueue.enqueue("Customer1");
			customerQueue.enqueue("Customer2");
			customerQueue.enqueue("Customer3");

			expect(customerQueue.size()).toBe(3);

			// Serve first customer
			const served1 = customerQueue.dequeue();
			expect(served1).toBe("Customer1");

			// New customer arrives
			customerQueue.enqueue("Customer4");

			// Serve next customer
			const served2 = customerQueue.dequeue();
			expect(served2).toBe("Customer2");

			expect(customerQueue.size()).toBe(2);
			expect(customerQueue.peek()).toBe("Customer3");
		});
	});

	describe("edge cases", () => {
		test("should handle very large queue", () => {
			const queue = new Queue<number>();

			for (let i = 0; i < 10000; i++) {
				queue.enqueue(i);
			}

			expect(queue.size()).toBe(10000);
			expect(queue.peek()).toBe(0);

			for (let i = 0; i < 5000; i++) {
				queue.dequeue();
			}

			expect(queue.size()).toBe(5000);
			expect(queue.peek()).toBe(5000);
		});

		test("should handle alternating enqueue and dequeue", () => {
			const queue = new Queue<number>();

			for (let i = 0; i < 100; i++) {
				queue.enqueue(i);
				if (i % 2 === 0) {
					queue.dequeue();
				}
			}

			expect(queue.size()).toBe(50);
		});

		test("should handle peek on single element multiple times", () => {
			const queue = new Queue<number>(42);

			for (let i = 0; i < 100; i++) {
				expect(queue.peek()).toBe(42);
			}

			expect(queue.size()).toBe(1);
		});

		test("should handle continuous enqueue after multiple dequeues", () => {
			const queue = new Queue<number>();

			// Fill queue
			for (let i = 0; i < 10; i++) {
				queue.enqueue(i);
			}

			// Empty queue
			for (let i = 0; i < 10; i++) {
				queue.dequeue();
			}

			expect(queue.isEmpty()).toBe(true);

			// Fill again
			for (let i = 10; i < 20; i++) {
				queue.enqueue(i);
			}

			expect(queue.size()).toBe(10);
			expect(queue.peek()).toBe(10);
		});
	});

	describe("boundary values", () => {
		test("should handle maximum safe integer", () => {
			const queue = new Queue<number>(Number.MAX_SAFE_INTEGER);

			expect(queue.peek()).toBe(Number.MAX_SAFE_INTEGER);
		});

		test("should handle minimum safe integer", () => {
			const queue = new Queue<number>(Number.MIN_SAFE_INTEGER);

			expect(queue.peek()).toBe(Number.MIN_SAFE_INTEGER);
		});

		test("should handle Infinity", () => {
			const queue = new Queue<number>(Number.POSITIVE_INFINITY);
			queue.enqueue(Number.NEGATIVE_INFINITY);

			expect(queue.dequeue()).toBe(Number.POSITIVE_INFINITY);
			expect(queue.dequeue()).toBe(Number.NEGATIVE_INFINITY);
		});

		test("should handle empty strings", () => {
			const queue = new Queue<string>("");

			expect(queue.peek()).toBe("");
			expect(queue.size()).toBe(1);
		});
	});

	describe("different data types", () => {
		test("should work with boolean values", () => {
			const queue = new Queue<boolean>(true);
			queue.enqueue(false).enqueue(true);

			expect(queue.dequeue()).toBe(true);
			expect(queue.dequeue()).toBe(false);
			expect(queue.dequeue()).toBe(true);
		});

		test("should work with arrays", () => {
			const queue = new Queue<number[]>([1, 2, 3]);
			queue.enqueue([4, 5, 6]);

			expect(queue.dequeue()).toEqual([1, 2, 3]);
			expect(queue.dequeue()).toEqual([4, 5, 6]);
		});

		test("should work with nested objects", () => {
			type User = { id: number; profile: { name: string; age: number } };
			const user1: User = { id: 1, profile: { name: "Alice", age: 30 } };
			const user2: User = { id: 2, profile: { name: "Bob", age: 25 } };

			const queue = new Queue<User>(user1);
			queue.enqueue(user2);

			expect(queue.dequeue()).toEqual(user1);
			expect(queue.dequeue()).toEqual(user2);
		});

		test("should work with null and undefined", () => {
			const queue = new Queue<number | null | undefined>(null);
			queue.enqueue(undefined).enqueue(5);

			expect(queue.dequeue()).toBeNull();
			expect(queue.dequeue()).toBeUndefined();
			expect(queue.dequeue()).toBe(5);
		});
	});

	describe("FIFO verification", () => {
		test("should strictly follow FIFO order", () => {
			const queue = new Queue<number>();

			const input = [10, 20, 30, 40, 50];
			for (const num of input) {
				queue.enqueue(num);
			}

			const output: number[] = [];
			while (!queue.isEmpty()) {
				const val = queue.dequeue();
				if (val !== undefined) output.push(val);
			}

			expect(output).toEqual(input);
		});

		test("should maintain FIFO with mixed operations", () => {
			const queue = new Queue<string>();

			queue.enqueue("A");
			queue.enqueue("B");
			expect(queue.dequeue()).toBe("A");

			queue.enqueue("C");
			queue.enqueue("D");
			expect(queue.dequeue()).toBe("B");

			expect(queue.dequeue()).toBe("C");
			expect(queue.dequeue()).toBe("D");
		});

		test("should preserve order after many operations", () => {
			const queue = new Queue<number>();
			const expected: number[] = [];

			// Mix enqueues and dequeues
			for (let i = 0; i < 100; i++) {
				queue.enqueue(i);
				if (i < 50) {
					queue.dequeue(); // Removes values 0-49
				}
			}

			// After loop: queue contains values 50-99
			for (let i = 50; i < 100; i++) {
				expected.push(i);
			}

			const result: number[] = [];
			while (!queue.isEmpty()) {
				const val = queue.dequeue();
				if (val !== undefined) result.push(val);
			}

			expect(result).toEqual(expected);
		});
	});
});
