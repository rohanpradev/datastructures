/**
 * Node class for Queue
 * Each node contains a value and a pointer to the next node
 */
class QueueNode<T> {
	value: T;
	next: QueueNode<T> | null;

	constructor(value: T) {
		this.value = value;
		this.next = null;
	}
}

/**
 * Queue Data Structure (FIFO - First In First Out)
 * A linear data structure where elements are added at the rear and removed from the front
 *
 * Key Features:
 * - FIFO ordering (First In, First Out)
 * - O(1) enqueue and dequeue operations
 * - O(1) peek operation
 * - Access to both front and rear
 *
 * Common Use Cases:
 * - Task scheduling (job queues)
 * - Breadth-First Search (BFS)
 * - Print queue management
 * - Request handling in servers
 * - Message queues in distributed systems
 *
 * Time Complexities:
 * - enqueue(): O(1)
 * - dequeue(): O(1)
 * - peek(): O(1)
 * - isEmpty(): O(1)
 * - size: O(1)
 *
 * Visual Structure:
 * ```
 * Front → [1] → [2] → [3] → [4] ← Rear
 *         ↑                   ↑
 *   First element      Last element
 * (Remove from here)   (Add to here)
 * ```
 */
class Queue<T> {
	front: QueueNode<T> | null;
	rear: QueueNode<T> | null;
	length: number;

	/**
	 * Creates a new queue, optionally with an initial value
	 * Time Complexity: O(1)
	 *
	 * @param value - Optional initial value for the first node
	 *
	 * @example
	 * const queue = new Queue<number>();
	 * // Creates: Front → null, Rear → null
	 *
	 * @example
	 * const queue = new Queue<number>(10);
	 * // Creates: Front → [10] ← Rear
	 */
	constructor(value?: T) {
		if (value !== undefined) {
			const newNode = new QueueNode(value);
			this.front = newNode;
			this.rear = newNode;
			this.length = 1;
		} else {
			this.front = null;
			this.rear = null;
			this.length = 0;
		}
	}

	/**
	 * Adds a new element to the rear of the queue
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Create a new node with the given value
	 * 2. If queue is empty, set both front and rear to the new node
	 * 3. Otherwise, connect current rear to new node
	 * 4. Update rear to the new node
	 * 5. Increment length
	 *
	 * Visual Example:
	 * ```
	 * Before enqueue(40):
	 * Front → [10] → [20] → [30] ← Rear
	 *
	 * After enqueue(40):
	 * Front → [10] → [20] → [30] → [40] ← Rear
	 * ```
	 *
	 * @param value - The value to add to the rear of the queue
	 * @returns The queue instance for method chaining
	 *
	 * @example
	 * const queue = new Queue<number>(1);
	 * queue.enqueue(2).enqueue(3);
	 * // Result: Front → [1] → [2] → [3] ← Rear
	 */
	enqueue(value: T): Queue<T> {
		// Create new node
		const newNode = new QueueNode(value);

		// If queue is empty, set both front and rear to new node
		if (!this.front) {
			this.front = newNode;
			this.rear = newNode;
		} else {
			// Connect current rear to new node
			if (this.rear) {
				this.rear.next = newNode;
			}
			// Update rear to new node
			this.rear = newNode;
		}

		// Increment length
		this.length++;

		// Return for chaining
		return this;
	}

	/**
	 * Removes and returns the front element from the queue
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Check if queue is empty, return undefined if so
	 * 2. Store current front node
	 * 3. Update front to next node
	 * 4. If queue becomes empty, set rear to null as well
	 * 5. Disconnect removed node's next pointer
	 * 6. Decrement length
	 * 7. Return the removed node
	 *
	 * Visual Example:
	 * ```
	 * Before dequeue():
	 * Front → [10] → [20] → [30] ← Rear
	 *
	 * After dequeue():
	 * Front → [20] → [30] ← Rear
	 * Returns: [10] (disconnected)
	 * ```
	 *
	 * Edge Cases:
	 * - Empty queue: Returns undefined
	 * - Single element: Queue becomes empty, front and rear = null
	 *
	 * @returns The value of the removed element, or undefined if queue is empty
	 *
	 * @example
	 * const queue = new Queue<number>(1);
	 * queue.enqueue(2).enqueue(3);
	 * const removed = queue.dequeue();
	 * // removed = 1
	 * // Queue: Front → [2] → [3] ← Rear
	 */
	dequeue(): T | undefined {
		// Handle empty queue
		if (!this.front) {
			return undefined;
		}

		// Store current front
		const removedNode = this.front;

		// Update front to next node
		this.front = this.front.next;

		// If queue becomes empty, set rear to null
		if (!this.front) {
			this.rear = null;
		}

		// Disconnect removed node
		removedNode.next = null;

		// Decrement length
		this.length--;

		// Return value of removed node
		return removedNode.value;
	}

	/**
	 * Returns the front element without removing it
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Return the front node (or null if empty)
	 *
	 * Visual Example:
	 * ```
	 * Queue: Front → [10] → [20] → [30] ← Rear
	 * peek() returns: 10
	 * Queue unchanged: Front → [10] → [20] → [30] ← Rear
	 * ```
	 *
	 * @returns The value of the front element, or undefined if queue is empty
	 *
	 * @example
	 * const queue = new Queue<number>(1);
	 * queue.enqueue(2).enqueue(3);
	 * const front = queue.peek();
	 * // front = 1
	 * // Queue unchanged: Front → [1] → [2] → [3] ← Rear
	 */
	peek(): T | undefined {
		return this.front?.value;
	}

	/**
	 * Checks if the queue is empty
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * @returns true if queue is empty, false otherwise
	 *
	 * @example
	 * const queue = new Queue<number>(1);
	 * queue.isEmpty(); // false
	 * queue.dequeue();
	 * queue.isEmpty(); // true
	 */
	isEmpty(): boolean {
		return this.front === null;
	}

	/**
	 * Returns the number of elements in the queue
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * @returns The number of elements in the queue
	 *
	 * @example
	 * const queue = new Queue<number>(1);
	 * queue.enqueue(2).enqueue(3);
	 * queue.size(); // 3
	 */
	size(): number {
		return this.length;
	}

	/**
	 * Removes all elements from the queue
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Set front to null
	 * 2. Set rear to null
	 * 3. Set length to 0
	 *
	 * @returns The queue instance for method chaining
	 *
	 * @example
	 * const queue = new Queue<number>(1);
	 * queue.enqueue(2).enqueue(3);
	 * queue.clear();
	 * // Queue: Front → null, Rear → null, length = 0
	 */
	clear(): Queue<T> {
		this.front = null;
		this.rear = null;
		this.length = 0;
		return this;
	}
}

export { QueueNode, Queue };
