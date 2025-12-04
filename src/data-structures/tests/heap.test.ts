import { describe, expect, test } from "bun:test";
import { MaxHeap, MinHeap } from "@/data-structures/heap/heap";

describe("MaxHeap", () => {
	describe("constructor", () => {
		test("should create empty heap", () => {
			const heap = new MaxHeap<number>();
			expect(heap.size()).toBe(0);
			expect(heap.isEmpty()).toBe(true);
		});

		test("should create heap with initial values", () => {
			const heap = new MaxHeap<number>([5, 3, 8, 1, 9]);
			expect(heap.size()).toBe(5);
			expect(heap.peek()).toBe(9);
		});

		test("should work with custom comparison function", () => {
			const heap = new MaxHeap<{ priority: number }>(
				[{ priority: 5 }, { priority: 10 }],
				(a, b) => a.priority - b.priority,
			);
			expect(heap.peek()?.priority).toBe(10);
		});
	});

	describe("insert()", () => {
		test("should insert into empty heap", () => {
			const heap = new MaxHeap<number>();
			heap.insert(10);
			expect(heap.size()).toBe(1);
			expect(heap.peek()).toBe(10);
		});

		test("should insert multiple values and maintain max heap property", () => {
			const heap = new MaxHeap<number>();
			heap.insert(5).insert(3).insert(8).insert(1).insert(10);
			expect(heap.peek()).toBe(10);
		});

		test("should heapify up correctly", () => {
			const heap = new MaxHeap<number>();
			heap.insert(1).insert(2).insert(3).insert(4).insert(5);
			// Root should be 5 (maximum)
			expect(heap.peek()).toBe(5);
		});

		test("should handle duplicate values", () => {
			const heap = new MaxHeap<number>();
			heap.insert(5).insert(5).insert(5);
			expect(heap.size()).toBe(3);
			expect(heap.peek()).toBe(5);
		});

		test("should support method chaining", () => {
			const heap = new MaxHeap<number>();
			const result = heap.insert(1).insert(2).insert(3);
			expect(result).toBe(heap);
		});
	});

	describe("remove()", () => {
		test("should return undefined for empty heap", () => {
			const heap = new MaxHeap<number>();
			expect(heap.remove()).toBeUndefined();
		});

		test("should remove and return maximum value", () => {
			const heap = new MaxHeap<number>([5, 3, 8, 1, 10]);
			expect(heap.remove()).toBe(10);
			expect(heap.size()).toBe(4);
		});

		test("should maintain heap property after removal", () => {
			const heap = new MaxHeap<number>([5, 3, 8, 1, 10, 7]);
			heap.remove(); // Remove 10
			expect(heap.peek()).toBe(8);
			heap.remove(); // Remove 8
			expect(heap.peek()).toBe(7);
		});

		test("should handle removing all elements", () => {
			const heap = new MaxHeap<number>([3, 2, 1]);
			expect(heap.remove()).toBe(3);
			expect(heap.remove()).toBe(2);
			expect(heap.remove()).toBe(1);
			expect(heap.remove()).toBeUndefined();
			expect(heap.isEmpty()).toBe(true);
		});

		test("should handle single element", () => {
			const heap = new MaxHeap<number>([42]);
			expect(heap.remove()).toBe(42);
			expect(heap.isEmpty()).toBe(true);
		});
	});

	describe("peek()", () => {
		test("should return undefined for empty heap", () => {
			const heap = new MaxHeap<number>();
			expect(heap.peek()).toBeUndefined();
		});

		test("should return max without removing", () => {
			const heap = new MaxHeap<number>([5, 3, 8]);
			expect(heap.peek()).toBe(8);
			expect(heap.size()).toBe(3);
		});

		test("should always return current maximum", () => {
			const heap = new MaxHeap<number>();
			heap.insert(5);
			expect(heap.peek()).toBe(5);
			heap.insert(10);
			expect(heap.peek()).toBe(10);
			heap.insert(3);
			expect(heap.peek()).toBe(10);
		});
	});

	describe("heap property verification", () => {
		test("should maintain max heap property with random insertions", () => {
			const heap = new MaxHeap<number>();
			const values = [15, 10, 20, 8, 12, 25, 16];

			for (const val of values) {
				heap.insert(val);
			}

			// Remove all and verify descending order
			const sorted = [];
			while (!heap.isEmpty()) {
				sorted.push(heap.remove()!);
			}

			// Should be in descending order
			for (let i = 0; i < sorted.length - 1; i++) {
				expect(sorted[i]!).toBeGreaterThanOrEqual(sorted[i + 1]!);
			}
		});

		test("should handle heap sort scenario", () => {
			const values = [3, 7, 2, 11, 5, 17, 1, 13];
			const heap = new MaxHeap<number>(values);

			const sorted = [];
			while (!heap.isEmpty()) {
				sorted.push(heap.remove()!);
			}

			// Should be sorted in descending order
			expect(sorted).toEqual([17, 13, 11, 7, 5, 3, 2, 1]);
		});
	});

	describe("integration scenarios", () => {
		test("should work as priority queue", () => {
			const heap = new MaxHeap<number>();

			// Add tasks with priorities
			heap.insert(5).insert(1).insert(10).insert(3);

			// Process highest priority first
			expect(heap.remove()).toBe(10);
			expect(heap.remove()).toBe(5);
			expect(heap.remove()).toBe(3);
			expect(heap.remove()).toBe(1);
		});

		test("should handle mixed operations", () => {
			const heap = new MaxHeap<number>();

			heap.insert(5);
			heap.insert(3);
			expect(heap.remove()).toBe(5);
			heap.insert(10);
			heap.insert(1);
			expect(heap.peek()).toBe(10);
			expect(heap.remove()).toBe(10);
			expect(heap.remove()).toBe(3);
		});
	});

	describe("edge cases", () => {
		test("should handle negative numbers", () => {
			const heap = new MaxHeap<number>([-5, -1, -10, -3]);
			expect(heap.peek()).toBe(-1);
			expect(heap.remove()).toBe(-1);
			expect(heap.peek()).toBe(-3);
		});

		test("should handle zeros", () => {
			const heap = new MaxHeap<number>([0, -1, 1, 0]);
			expect(heap.remove()).toBe(1);
			expect(heap.remove()).toBe(0);
			expect(heap.remove()).toBe(0);
			expect(heap.remove()).toBe(-1);
		});

		test("should handle large heap", () => {
			const heap = new MaxHeap<number>();
			for (let i = 0; i < 1000; i++) {
				heap.insert(Math.floor(Math.random() * 1000));
			}
			expect(heap.size()).toBe(1000);

			let prev = heap.remove()!;
			while (!heap.isEmpty()) {
				const current = heap.remove()!;
				expect(prev).toBeGreaterThanOrEqual(current);
				prev = current;
			}
		});
	});

	describe("utility methods", () => {
		test("size() should return correct size", () => {
			const heap = new MaxHeap<number>();
			expect(heap.size()).toBe(0);
			heap.insert(1).insert(2).insert(3);
			expect(heap.size()).toBe(3);
			heap.remove();
			expect(heap.size()).toBe(2);
		});

		test("isEmpty() should work correctly", () => {
			const heap = new MaxHeap<number>();
			expect(heap.isEmpty()).toBe(true);
			heap.insert(1);
			expect(heap.isEmpty()).toBe(false);
			heap.remove();
			expect(heap.isEmpty()).toBe(true);
		});

		test("clear() should empty heap", () => {
			const heap = new MaxHeap<number>([1, 2, 3, 4, 5]);
			heap.clear();
			expect(heap.isEmpty()).toBe(true);
			expect(heap.size()).toBe(0);
		});

		test("toArray() should return heap array", () => {
			const heap = new MaxHeap<number>([5, 3, 8]);
			const arr = heap.toArray();
			expect(arr.length).toBe(3);
			expect(arr[0]).toBe(8); // Root is max
		});
	});
});

describe("MinHeap", () => {
	describe("constructor", () => {
		test("should create empty heap", () => {
			const heap = new MinHeap<number>();
			expect(heap.size()).toBe(0);
			expect(heap.isEmpty()).toBe(true);
		});

		test("should create heap with initial values", () => {
			const heap = new MinHeap<number>([5, 3, 8, 1, 9]);
			expect(heap.size()).toBe(5);
			expect(heap.peek()).toBe(1);
		});

		test("should work with custom comparison function", () => {
			const heap = new MinHeap<{ priority: number }>(
				[{ priority: 5 }, { priority: 10 }],
				(a, b) => a.priority - b.priority,
			);
			expect(heap.peek()?.priority).toBe(5);
		});
	});

	describe("insert()", () => {
		test("should insert into empty heap", () => {
			const heap = new MinHeap<number>();
			heap.insert(10);
			expect(heap.size()).toBe(1);
			expect(heap.peek()).toBe(10);
		});

		test("should insert multiple values and maintain min heap property", () => {
			const heap = new MinHeap<number>();
			heap.insert(5).insert(3).insert(8).insert(1).insert(10);
			expect(heap.peek()).toBe(1);
		});

		test("should heapify up correctly", () => {
			const heap = new MinHeap<number>();
			heap.insert(5).insert(4).insert(3).insert(2).insert(1);
			// Root should be 1 (minimum)
			expect(heap.peek()).toBe(1);
		});

		test("should handle duplicate values", () => {
			const heap = new MinHeap<number>();
			heap.insert(5).insert(5).insert(5);
			expect(heap.size()).toBe(3);
			expect(heap.peek()).toBe(5);
		});
	});

	describe("remove()", () => {
		test("should return undefined for empty heap", () => {
			const heap = new MinHeap<number>();
			expect(heap.remove()).toBeUndefined();
		});

		test("should remove and return minimum value", () => {
			const heap = new MinHeap<number>([5, 3, 8, 1, 10]);
			expect(heap.remove()).toBe(1);
			expect(heap.size()).toBe(4);
		});

		test("should maintain heap property after removal", () => {
			const heap = new MinHeap<number>([5, 3, 8, 1, 10, 7]);
			heap.remove(); // Remove 1
			expect(heap.peek()).toBe(3);
			heap.remove(); // Remove 3
			expect(heap.peek()).toBe(5);
		});

		test("should handle removing all elements", () => {
			const heap = new MinHeap<number>([3, 2, 1]);
			expect(heap.remove()).toBe(1);
			expect(heap.remove()).toBe(2);
			expect(heap.remove()).toBe(3);
			expect(heap.remove()).toBeUndefined();
		});
	});

	describe("peek()", () => {
		test("should return undefined for empty heap", () => {
			const heap = new MinHeap<number>();
			expect(heap.peek()).toBeUndefined();
		});

		test("should return min without removing", () => {
			const heap = new MinHeap<number>([5, 3, 8]);
			expect(heap.peek()).toBe(3);
			expect(heap.size()).toBe(3);
		});

		test("should always return current minimum", () => {
			const heap = new MinHeap<number>();
			heap.insert(5);
			expect(heap.peek()).toBe(5);
			heap.insert(3);
			expect(heap.peek()).toBe(3);
			heap.insert(10);
			expect(heap.peek()).toBe(3);
		});
	});

	describe("heap property verification", () => {
		test("should maintain min heap property with random insertions", () => {
			const heap = new MinHeap<number>();
			const values = [15, 10, 20, 8, 12, 25, 16];

			for (const val of values) {
				heap.insert(val);
			}

			// Remove all and verify ascending order
			const sorted = [];
			while (!heap.isEmpty()) {
				sorted.push(heap.remove()!);
			}

			// Should be in ascending order
			for (let i = 0; i < sorted.length - 1; i++) {
				expect(sorted[i]!).toBeLessThanOrEqual(sorted[i + 1]!);
			}
		});

		test("should handle heap sort scenario", () => {
			const values = [3, 7, 2, 11, 5, 17, 1, 13];
			const heap = new MinHeap<number>(values);

			const sorted = [];
			while (!heap.isEmpty()) {
				sorted.push(heap.remove()!);
			}

			// Should be sorted in ascending order
			expect(sorted).toEqual([1, 2, 3, 5, 7, 11, 13, 17]);
		});
	});

	describe("integration scenarios", () => {
		test("should work as priority queue (lowest priority first)", () => {
			const heap = new MinHeap<number>();

			// Add tasks with priorities (lower = more urgent)
			heap.insert(5).insert(1).insert(10).insert(3);

			// Process lowest priority first
			expect(heap.remove()).toBe(1);
			expect(heap.remove()).toBe(3);
			expect(heap.remove()).toBe(5);
			expect(heap.remove()).toBe(10);
		});

		test("should find k smallest elements", () => {
			const values = [7, 10, 4, 3, 20, 15];
			const heap = new MinHeap<number>(values);

			// Get 3 smallest
			const smallest3 = [heap.remove(), heap.remove(), heap.remove()];
			expect(smallest3).toEqual([3, 4, 7]);
		});
	});

	describe("edge cases", () => {
		test("should handle negative numbers", () => {
			const heap = new MinHeap<number>([-5, -1, -10, -3]);
			expect(heap.peek()).toBe(-10);
			expect(heap.remove()).toBe(-10);
			expect(heap.peek()).toBe(-5);
		});

		test("should handle zeros", () => {
			const heap = new MinHeap<number>([0, -1, 1, 0]);
			expect(heap.remove()).toBe(-1);
			expect(heap.remove()).toBe(0);
			expect(heap.remove()).toBe(0);
			expect(heap.remove()).toBe(1);
		});

		test("should handle large heap", () => {
			const heap = new MinHeap<number>();
			for (let i = 0; i < 1000; i++) {
				heap.insert(Math.floor(Math.random() * 1000));
			}
			expect(heap.size()).toBe(1000);

			let prev = heap.remove()!;
			while (!heap.isEmpty()) {
				const current = heap.remove()!;
				expect(prev).toBeLessThanOrEqual(current);
				prev = current;
			}
		});
	});

	describe("utility methods", () => {
		test("size() should return correct size", () => {
			const heap = new MinHeap<number>();
			expect(heap.size()).toBe(0);
			heap.insert(1).insert(2).insert(3);
			expect(heap.size()).toBe(3);
			heap.remove();
			expect(heap.size()).toBe(2);
		});

		test("isEmpty() should work correctly", () => {
			const heap = new MinHeap<number>();
			expect(heap.isEmpty()).toBe(true);
			heap.insert(1);
			expect(heap.isEmpty()).toBe(false);
			heap.remove();
			expect(heap.isEmpty()).toBe(true);
		});

		test("clear() should empty heap", () => {
			const heap = new MinHeap<number>([1, 2, 3, 4, 5]);
			heap.clear();
			expect(heap.isEmpty()).toBe(true);
			expect(heap.size()).toBe(0);
		});

		test("toArray() should return heap array", () => {
			const heap = new MinHeap<number>([5, 3, 8]);
			const arr = heap.toArray();
			expect(arr.length).toBe(3);
			expect(arr[0]).toBe(3); // Root is min
		});
	});
});

describe("MaxHeap vs MinHeap", () => {
	test("should produce opposite sorted orders", () => {
		const values = [5, 2, 8, 1, 9, 3];

		const maxHeap = new MaxHeap<number>(values);
		const minHeap = new MinHeap<number>(values);

		const maxSorted = [];
		const minSorted = [];

		while (!maxHeap.isEmpty()) maxSorted.push(maxHeap.remove()!);
		while (!minHeap.isEmpty()) minSorted.push(minHeap.remove()!);

		expect(maxSorted).toEqual([9, 8, 5, 3, 2, 1]);
		expect(minSorted).toEqual([1, 2, 3, 5, 8, 9]);
	});
});
