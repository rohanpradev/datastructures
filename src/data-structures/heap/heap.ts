/**
 * Heap Data Structure (Binary Heap)
 * A complete binary tree where parent nodes satisfy heap property
 *
 * Key Features:
 * - Array-based implementation for efficiency
 * - MaxHeap: Parent >= Children (root is maximum)
 * - MinHeap: Parent <= Children (root is minimum)
 * - Complete binary tree (filled left to right)
 * - Efficient insert and remove operations
 *
 * Common Use Cases:
 * - Priority queues (task scheduling)
 * - Heap sort algorithm
 * - Finding k largest/smallest elements
 * - Graph algorithms (Dijkstra's, Prim's)
 * - Memory management (heap memory)
 * - Event-driven simulation
 *
 * Time Complexities:
 * - insert(): O(log n)
 * - remove(): O(log n)
 * - peek(): O(1)
 * - heapify: O(n)
 *
 * Space Complexity: O(n)
 *
 * Visual Structure (MaxHeap):
 * ```
 * Array: [100, 80, 60, 40, 30, 20, 10]
 *
 * Tree representation:
 *        100
 *       /   \
 *      80    60
 *     / \   / \
 *    40 30 20 10
 *
 * Parent-Child relationships:
 * - Parent index: Math.floor((i - 1) / 2)
 * - Left child: 2 * i + 1
 * - Right child: 2 * i + 2
 * ```
 */

/**
 * MaxHeap implementation
 * Parent node is always greater than or equal to children
 */
export class MaxHeap<T = number> {
	private heap: T[];
	private compareFn: (a: T, b: T) => number;

	/**
	 * Creates a new MaxHeap
	 * Time Complexity: O(1) or O(n) if values provided
	 *
	 * @param values - Optional array of initial values
	 * @param compareFn - Optional comparison function (default for numbers)
	 *
	 * @example
	 * const heap = new MaxHeap<number>();
	 * const heap2 = new MaxHeap<number>([5, 3, 8, 1]);
	 */
	constructor(values?: T[], compareFn?: (a: T, b: T) => number) {
		this.heap = [];

		// Default comparison for numbers
		if (!compareFn) {
			this.compareFn = (a: T, b: T) => {
				if (a > b) return 1;
				if (a < b) return -1;
				return 0;
			};
		} else {
			this.compareFn = compareFn;
		}

		if (values && values.length > 0) {
			for (const value of values) {
				this.insert(value);
			}
		}
	}

	/**
	 * Helper: Get parent index
	 * Time Complexity: O(1)
	 *
	 * @param index - Child index
	 * @returns Parent index
	 */
	private getParentIndex(index: number): number {
		return Math.floor((index - 1) / 2);
	}

	/**
	 * Helper: Get left child index
	 * Time Complexity: O(1)
	 *
	 * @param index - Parent index
	 * @returns Left child index
	 */
	private getLeftChildIndex(index: number): number {
		return 2 * index + 1;
	}

	/**
	 * Helper: Get right child index
	 * Time Complexity: O(1)
	 *
	 * @param index - Parent index
	 * @returns Right child index
	 */
	private getRightChildIndex(index: number): number {
		return 2 * index + 2;
	}

	/**
	 * Helper: Check if has parent
	 * Time Complexity: O(1)
	 */
	private hasParent(index: number): boolean {
		return this.getParentIndex(index) >= 0;
	}

	/**
	 * Helper: Check if has left child
	 * Time Complexity: O(1)
	 */
	private hasLeftChild(index: number): boolean {
		return this.getLeftChildIndex(index) < this.heap.length;
	}

	/**
	 * Helper: Check if has right child
	 * Time Complexity: O(1)
	 */
	private hasRightChild(index: number): boolean {
		return this.getRightChildIndex(index) < this.heap.length;
	}

	/**
	 * Helper: Get parent value
	 * Time Complexity: O(1)
	 */
	private parent(index: number): T {
		return this.heap[this.getParentIndex(index)]!;
	}

	/**
	 * Helper: Get left child value
	 * Time Complexity: O(1)
	 */
	private leftChild(index: number): T {
		return this.heap[this.getLeftChildIndex(index)]!;
	}

	/**
	 * Helper: Get right child value
	 * Time Complexity: O(1)
	 */
	private rightChild(index: number): T {
		return this.heap[this.getRightChildIndex(index)]!;
	}

	/**
	 * Helper: Swap two elements in heap
	 * Time Complexity: O(1)
	 */
	private swap(index1: number, index2: number): void {
		[this.heap[index1], this.heap[index2]] = [
			this.heap[index2]!,
			this.heap[index1]!,
		];
	}

	/**
	 * Inserts a value into the heap
	 * Time Complexity: O(log n)
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Add value to end of array
	 * 2. Bubble up (heapify up) to restore heap property
	 * 3. Compare with parent, swap if needed
	 * 4. Repeat until heap property satisfied
	 *
	 * @param value - Value to insert
	 * @returns The heap instance for method chaining
	 *
	 * @example
	 * heap.insert(50).insert(30).insert(70);
	 */
	insert(value: T): MaxHeap<T> {
		this.heap.push(value);
		this.heapifyUp();
		return this;
	}

	/**
	 * Heapify up (bubble up)
	 * Moves element up until heap property is satisfied
	 * Time Complexity: O(log n)
	 *
	 * For MaxHeap: Move up if current > parent
	 */
	private heapifyUp(): void {
		let index = this.heap.length - 1;

		while (
			this.hasParent(index) &&
			this.compareFn(this.heap[index]!, this.parent(index)) > 0
		) {
			this.swap(this.getParentIndex(index), index);
			index = this.getParentIndex(index);
		}
	}

	/**
	 * Removes and returns the maximum value (root)
	 * Time Complexity: O(log n)
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Save root value to return
	 * 2. Move last element to root
	 * 3. Remove last element
	 * 4. Sink down (heapify down) from root
	 * 5. Return saved root value
	 *
	 * @returns The maximum value, or undefined if empty
	 *
	 * @example
	 * heap.insert(50).insert(30).insert(70);
	 * heap.remove(); // 70
	 */
	remove(): T | undefined {
		if (this.heap.length === 0) return undefined;
		if (this.heap.length === 1) return this.heap.pop();

		const root = this.heap[0];
		this.heap[0] = this.heap.pop()!;
		this.heapifyDown();
		return root;
	}

	/**
	 * Heapify down (sink down)
	 * Moves element down until heap property is satisfied
	 * Time Complexity: O(log n)
	 *
	 * For MaxHeap: Move down if current < largest child
	 */
	private heapifyDown(): void {
		let index = 0;

		// Continue while has at least left child
		while (this.hasLeftChild(index)) {
			let largerChildIndex = this.getLeftChildIndex(index);

			// Find larger of two children
			if (
				this.hasRightChild(index) &&
				this.compareFn(this.rightChild(index), this.leftChild(index)) > 0
			) {
				largerChildIndex = this.getRightChildIndex(index);
			}

			// If current is larger than both children, heap property satisfied
			if (
				this.compareFn(this.heap[index]!, this.heap[largerChildIndex]!) >= 0
			) {
				break;
			}

			// Swap with larger child and continue
			this.swap(index, largerChildIndex);
			index = largerChildIndex;
		}
	}

	/**
	 * Returns the maximum value without removing it
	 * Time Complexity: O(1)
	 *
	 * @returns The maximum value, or undefined if empty
	 */
	peek(): T | undefined {
		return this.heap[0];
	}

	/**
	 * Returns the size of the heap
	 * Time Complexity: O(1)
	 */
	size(): number {
		return this.heap.length;
	}

	/**
	 * Checks if heap is empty
	 * Time Complexity: O(1)
	 */
	isEmpty(): boolean {
		return this.heap.length === 0;
	}

	/**
	 * Clears the heap
	 * Time Complexity: O(1)
	 */
	clear(): MaxHeap<T> {
		this.heap = [];
		return this;
	}

	/**
	 * Returns array representation of heap
	 * Time Complexity: O(n)
	 */
	toArray(): T[] {
		return [...this.heap];
	}
}

/**
 * MinHeap implementation
 * Parent node is always less than or equal to children
 */
export class MinHeap<T = number> {
	private heap: T[];
	private compareFn: (a: T, b: T) => number;

	/**
	 * Creates a new MinHeap
	 * Time Complexity: O(1) or O(n) if values provided
	 *
	 * @param values - Optional array of initial values
	 * @param compareFn - Optional comparison function (default for numbers)
	 *
	 * @example
	 * const heap = new MinHeap<number>();
	 * const heap2 = new MinHeap<number>([5, 3, 8, 1]);
	 */
	constructor(values?: T[], compareFn?: (a: T, b: T) => number) {
		this.heap = [];

		// Default comparison for numbers
		if (!compareFn) {
			this.compareFn = (a: T, b: T) => {
				if (a > b) return 1;
				if (a < b) return -1;
				return 0;
			};
		} else {
			this.compareFn = compareFn;
		}

		if (values && values.length > 0) {
			for (const value of values) {
				this.insert(value);
			}
		}
	}

	/**
	 * Helper: Get parent index
	 */
	private getParentIndex(index: number): number {
		return Math.floor((index - 1) / 2);
	}

	/**
	 * Helper: Get left child index
	 */
	private getLeftChildIndex(index: number): number {
		return 2 * index + 1;
	}

	/**
	 * Helper: Get right child index
	 */
	private getRightChildIndex(index: number): number {
		return 2 * index + 2;
	}

	/**
	 * Helper: Check if has parent
	 */
	private hasParent(index: number): boolean {
		return this.getParentIndex(index) >= 0;
	}

	/**
	 * Helper: Check if has left child
	 */
	private hasLeftChild(index: number): boolean {
		return this.getLeftChildIndex(index) < this.heap.length;
	}

	/**
	 * Helper: Check if has right child
	 */
	private hasRightChild(index: number): boolean {
		return this.getRightChildIndex(index) < this.heap.length;
	}

	/**
	 * Helper: Get parent value
	 */
	private parent(index: number): T {
		return this.heap[this.getParentIndex(index)]!;
	}

	/**
	 * Helper: Get left child value
	 */
	private leftChild(index: number): T {
		return this.heap[this.getLeftChildIndex(index)]!;
	}

	/**
	 * Helper: Get right child value
	 */
	private rightChild(index: number): T {
		return this.heap[this.getRightChildIndex(index)]!;
	}

	/**
	 * Helper: Swap two elements in heap
	 */
	private swap(index1: number, index2: number): void {
		[this.heap[index1], this.heap[index2]] = [
			this.heap[index2]!,
			this.heap[index1]!,
		];
	}

	/**
	 * Inserts a value into the heap
	 * Time Complexity: O(log n)
	 *
	 * @param value - Value to insert
	 * @returns The heap instance for method chaining
	 */
	insert(value: T): MinHeap<T> {
		this.heap.push(value);
		this.heapifyUp();
		return this;
	}

	/**
	 * Heapify up (bubble up)
	 * For MinHeap: Move up if current < parent
	 */
	private heapifyUp(): void {
		let index = this.heap.length - 1;

		while (
			this.hasParent(index) &&
			this.compareFn(this.heap[index]!, this.parent(index)) < 0
		) {
			this.swap(this.getParentIndex(index), index);
			index = this.getParentIndex(index);
		}
	}

	/**
	 * Removes and returns the minimum value (root)
	 * Time Complexity: O(log n)
	 *
	 * @returns The minimum value, or undefined if empty
	 */
	remove(): T | undefined {
		if (this.heap.length === 0) return undefined;
		if (this.heap.length === 1) return this.heap.pop();

		const root = this.heap[0];
		this.heap[0] = this.heap.pop()!;
		this.heapifyDown();
		return root;
	}

	/**
	 * Heapify down (sink down)
	 * For MinHeap: Move down if current > smallest child
	 */
	private heapifyDown(): void {
		let index = 0;

		while (this.hasLeftChild(index)) {
			let smallerChildIndex = this.getLeftChildIndex(index);

			// Find smaller of two children
			if (
				this.hasRightChild(index) &&
				this.compareFn(this.rightChild(index), this.leftChild(index)) < 0
			) {
				smallerChildIndex = this.getRightChildIndex(index);
			}

			// If current is smaller than both children, heap property satisfied
			if (
				this.compareFn(this.heap[index]!, this.heap[smallerChildIndex]!) <= 0
			) {
				break;
			}

			// Swap with smaller child and continue
			this.swap(index, smallerChildIndex);
			index = smallerChildIndex;
		}
	}

	/**
	 * Returns the minimum value without removing it
	 * Time Complexity: O(1)
	 */
	peek(): T | undefined {
		return this.heap[0];
	}

	/**
	 * Returns the size of the heap
	 */
	size(): number {
		return this.heap.length;
	}

	/**
	 * Checks if heap is empty
	 */
	isEmpty(): boolean {
		return this.heap.length === 0;
	}

	/**
	 * Clears the heap
	 */
	clear(): MinHeap<T> {
		this.heap = [];
		return this;
	}

	/**
	 * Returns array representation of heap
	 */
	toArray(): T[] {
		return [...this.heap];
	}
}
