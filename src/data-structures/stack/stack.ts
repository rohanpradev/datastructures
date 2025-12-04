/**
 * Node class for Stack
 * Each node contains a value and a pointer to the next node
 */
class StackNode<T> {
	value: T;
	next: StackNode<T> | null;

	constructor(value: T) {
		this.value = value;
		this.next = null;
	}
}

/**
 * Stack Data Structure (LIFO - Last In First Out)
 * A linear data structure where elements are added and removed from the same end (top)
 *
 * Key Features:
 * - LIFO ordering (Last In, First Out)
 * - O(1) push and pop operations
 * - O(1) peek operation
 * - Only access to top element
 *
 * Common Use Cases:
 * - Function call stack (recursion)
 * - Undo/Redo functionality
 * - Expression evaluation (postfix, prefix)
 * - Backtracking algorithms
 * - Browser history (back button)
 *
 * Time Complexities:
 * - push(): O(1)
 * - pop(): O(1)
 * - peek(): O(1)
 * - isEmpty(): O(1)
 * - size: O(1)
 *
 * Visual Structure:
 * ```
 * Top → [4] → [3] → [2] → [1] → null
 *       ↑
 *     Latest element
 * ```
 */
class Stack<T> {
	top: StackNode<T> | null;
	length: number;

	/**
	 * Creates a new stack, optionally with an initial value
	 * Time Complexity: O(1)
	 *
	 * @param value - Optional initial value for the first node
	 *
	 * @example
	 * const stack = new Stack<number>();
	 * // Creates: Top → null
	 *
	 * @example
	 * const stack = new Stack<number>(10);
	 * // Creates: Top → [10] → null
	 */
	constructor(value?: T) {
		if (value !== undefined) {
			const newNode = new StackNode(value);
			this.top = newNode;
			this.length = 1;
		} else {
			this.top = null;
			this.length = 0;
		}
	}

	/**
	 * Adds a new element to the top of the stack
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Create a new node with the given value
	 * 2. If stack is empty, set top to the new node
	 * 3. Otherwise, point new node's next to current top
	 * 4. Update top to the new node
	 * 5. Increment length
	 *
	 * Visual Example:
	 * ```
	 * Before push(40):
	 * Top → [30] → [20] → [10] → null
	 *
	 * After push(40):
	 * Top → [40] → [30] → [20] → [10] → null
	 * ```
	 *
	 * @param value - The value to push onto the stack
	 * @returns The stack instance for method chaining
	 *
	 * @example
	 * const stack = new Stack<number>(1);
	 * stack.push(2).push(3);
	 * // Result: Top → [3] → [2] → [1] → null
	 */
	push(value: T): Stack<T> {
		// Create new node
		const newNode = new StackNode(value);

		// If stack is empty, set top to new node
		if (!this.top) {
			this.top = newNode;
		} else {
			// Point new node to current top
			newNode.next = this.top;
			// Update top to new node
			this.top = newNode;
		}

		// Increment length
		this.length++;

		// Return for chaining
		return this;
	}

	/**
	 * Removes and returns the top element from the stack
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Check if stack is empty, return undefined if so
	 * 2. Store current top node
	 * 3. Update top to next node
	 * 4. Disconnect removed node's next pointer
	 * 5. Decrement length
	 * 6. Return the removed node
	 *
	 * Visual Example:
	 * ```
	 * Before pop():
	 * Top → [40] → [30] → [20] → null
	 *
	 * After pop():
	 * Top → [30] → [20] → null
	 * Returns: [40] (disconnected)
	 * ```
	 *
	 * Edge Cases:
	 * - Empty stack: Returns undefined
	 * - Single element: Stack becomes empty, top = null
	 *
	 * @returns The value of the removed element, or undefined if stack is empty
	 *
	 * @example
	 * const stack = new Stack<number>(1);
	 * stack.push(2).push(3);
	 * const removed = stack.pop();
	 * // removed = 3
	 * // Stack: Top → [2] → [1] → null
	 */
	pop(): T | undefined {
		// Handle empty stack
		if (!this.top) {
			return undefined;
		}

		// Store current top
		const removedNode = this.top;

		// Update top to next node
		this.top = this.top.next;

		// Disconnect removed node
		removedNode.next = null;

		// Decrement length
		this.length--;

		// Return value of removed node
		return removedNode.value;
	}

	/**
	 * Returns the top element without removing it
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Return the top node (or null if empty)
	 *
	 * Visual Example:
	 * ```
	 * Stack: Top → [30] → [20] → [10] → null
	 * peek() returns: 30
	 * Stack unchanged: Top → [30] → [20] → [10] → null
	 * ```
	 *
	 * @returns The value of the top element, or undefined if stack is empty
	 *
	 * @example
	 * const stack = new Stack<number>(1);
	 * stack.push(2).push(3);
	 * const top = stack.peek();
	 * // top = 3
	 * // Stack unchanged: Top → [3] → [2] → [1] → null
	 */
	peek(): T | undefined {
		return this.top?.value;
	}

	/**
	 * Checks if the stack is empty
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * @returns true if stack is empty, false otherwise
	 *
	 * @example
	 * const stack = new Stack<number>(1);
	 * stack.isEmpty(); // false
	 * stack.pop();
	 * stack.isEmpty(); // true
	 */
	isEmpty(): boolean {
		return this.top === null;
	}

	/**
	 * Returns the number of elements in the stack
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * @returns The number of elements in the stack
	 *
	 * @example
	 * const stack = new Stack<number>(1);
	 * stack.push(2).push(3);
	 * stack.size(); // 3
	 */
	size(): number {
		return this.length;
	}

	/**
	 * Removes all elements from the stack
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Set top to null
	 * 2. Set length to 0
	 *
	 * @returns The stack instance for method chaining
	 *
	 * @example
	 * const stack = new Stack<number>(1);
	 * stack.push(2).push(3);
	 * stack.clear();
	 * // Stack: Top → null, length = 0
	 */
	clear(): Stack<T> {
		this.top = null;
		this.length = 0;
		return this;
	}
}

export { StackNode, Stack };
