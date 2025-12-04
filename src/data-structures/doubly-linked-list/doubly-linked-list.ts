/**
 * Node class for Doubly Linked List
 * Each node contains a value and pointers to both the previous and next nodes
 */
class Node<T> {
	value: T;
	prev: Node<T> | null;
	next: Node<T> | null;

	constructor(value: T) {
		this.value = value;
		this.prev = null;
		this.next = null;
	}
}

/**
 * Doubly Linked List Data Structure
 * A linear data structure where each node has pointers to both the next and previous nodes
 *
 * Key Features:
 * - Bidirectional traversal (can move forward and backward)
 * - O(1) insertion/deletion at both ends
 * - O(n) search and access by index
 * - Each node has prev and next pointers
 *
 * Advantages over Singly Linked List:
 * - Can traverse in both directions
 * - Easier deletion (no need to track previous node)
 * - Can access previous node in O(1)
 *
 * Disadvantages:
 * - Uses more memory (extra prev pointer per node)
 * - Slightly more complex to implement
 *
 * Time Complexities:
 * - push(): O(1)
 * - pop(): O(1)
 * - shift(): O(1)
 * - unshift(): O(1)
 * - get(): O(n) - optimized to O(n/2) by choosing direction
 * - set(): O(n)
 * - insert(): O(n)
 * - remove(): O(n)
 *
 * Visual Structure:
 * null ← [1] ⇄ [2] ⇄ [3] ⇄ [4] → null
 *         ↑                    ↑
 *       head                 tail
 */
class DoublyLinkedList<T> {
	head: Node<T> | null;
	tail: Node<T> | null;
	length: number;

	/**
	 * Creates a new doubly linked list with an initial value
	 * Time Complexity: O(1)
	 *
	 * @param value - The initial value for the first node
	 *
	 * @example
	 * const list = new DoublyLinkedListNode<number>(10);
	 * // Creates: null ← [10] → null
	 */
	constructor(value: T) {
		const newNode = new Node(value);
		this.head = newNode;
		this.tail = newNode;
		this.length = 1;
	}

	/**
	 * Adds a new node with the given value to the end of the list
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Create a new node with the given value
	 * 2. If list is empty, set both head and tail to the new node
	 * 3. Otherwise, connect the new node to the current tail
	 * 4. Update tail to point to the new node
	 * 5. Increment length
	 *
	 * Visual Example:
	 * Before: null ← [1] ⇄ [2] → null
	 *                ↑         ↑
	 *              head      tail
	 *
	 * After push(3):
	 * null ← [1] ⇄ [2] ⇄ [3] → null
	 *        ↑              ↑
	 *      head           tail
	 *
	 * @param value - The value to add to the end of the list
	 * @returns The list instance for method chaining
	 *
	 * @example
	 * const list = new DoublyLinkedListNode<number>(1);
	 * list.push(2).push(3);
	 * // Result: null ← [1] ⇄ [2] ⇄ [3] → null
	 */
	push(value: T): this {
		const newNode = new Node(value);
		this.length++;

		// Handle empty list
		if (!this.head) {
			this.head = newNode;
			this.tail = newNode;
		} else {
			// Connect new node to current tail
			this.tail!.next = newNode;
			newNode.prev = this.tail;
			this.tail = newNode;
		}

		return this;
	}

	/**
	 * Removes and returns the last node from the list
	 * Time Complexity: O(1) - Direct access to tail via prev pointer
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. If list is empty, return undefined
	 * 2. If list has only one node, set head and tail to null
	 * 3. Otherwise:
	 *    - Save reference to current tail (node to be removed)
	 *    - Update tail to point to the previous node
	 *    - Set new tail's next pointer to null
	 *    - Set removed node's prev pointer to null (cleanup)
	 * 4. Decrement length
	 * 5. Return the removed node
	 *
	 * Visual Example:
	 * Before: null ← [1] ⇄ [2] ⇄ [3] → null
	 *                ↑              ↑
	 *              head           tail
	 *
	 * After pop():
	 * null ← [1] ⇄ [2] → null    [3] (returned)
	 *        ↑         ↑
	 *      head      tail
	 *
	 * Key Advantage over Singly Linked List:
	 * - Doubly linked list can pop in O(1) because we have direct access
	 *   to the previous node via tail.prev
	 * - Singly linked list requires O(n) to find the node before tail
	 *
	 * Edge Cases:
	 * - Empty list: Returns undefined
	 * - Single element: Both head and tail become null
	 * - Two elements: Head becomes tail
	 *
	 * @returns The removed node, or undefined if list is empty
	 *
	 * @example
	 * const list = new DoublyLinkedListNode<number>(1);
	 * list.push(2).push(3);
	 * const popped = list.pop();
	 * console.log(popped?.value); // 3
	 * // List now: null ← [1] ⇄ [2] → null
	 *
	 * @example
	 * const list = new DoublyLinkedListNode<number>(5);
	 * const popped = list.pop();
	 * console.log(popped?.value); // 5
	 * console.log(list.head); // null (list is now empty)
	 */
	pop(): Node<T> | undefined {
		// Handle empty list
		if (this.length === 0) return undefined;

		// Save reference to node being removed
		const popped = this.tail;

		// Handle single element list
		if (this.length === 1) {
			this.head = null;
			this.tail = null;
		} else {
			// Update tail to previous node
			this.tail = this.tail!.prev;
			this.tail!.next = null;

			// Cleanup: disconnect removed node
			popped!.prev = null;
		}

		// Decrement length
		this.length--;

		return popped ?? undefined;
	}

	/**
	 * Adds a new node with the given value to the beginning of the list
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Create a new node with the given value
	 * 2. If list is empty, set both head and tail to the new node
	 * 3. Otherwise:
	 *    - Set new node's next pointer to current head
	 *    - Set current head's prev pointer to new node
	 *    - Update head to point to the new node
	 * 4. Increment length
	 * 5. Return list for method chaining
	 *
	 * Visual Example:
	 * Before: null ← [2] ⇄ [3] → null
	 *                ↑         ↑
	 *              head      tail
	 *
	 * After unshift(1):
	 * null ← [1] ⇄ [2] ⇄ [3] → null
	 *        ↑              ↑
	 *      head           tail
	 *
	 * Key Advantage over Singly Linked List:
	 * - Both have O(1) time complexity for unshift
	 * - Doubly linked list maintains bidirectional links automatically
	 * - The prev pointer of the old head is set to the new node
	 *
	 * Edge Cases:
	 * - Empty list: New node becomes both head and tail
	 * - Single element: New node becomes head, old head becomes tail
	 *
	 * @param value - The value to add to the beginning of the list
	 * @returns The list instance for method chaining
	 *
	 * @example
	 * const list = new DoublyLinkedListNode<number>(2);
	 * list.unshift(1).unshift(0);
	 * // Result: null ← [0] ⇄ [1] ⇄ [2] → null
	 *
	 * @example
	 * const emptyList = new DoublyLinkedListNode<number>(5);
	 * emptyList.pop(); // List becomes empty
	 * emptyList.unshift(10);
	 * // Result: null ← [10] → null
	 */
	unshift(value: T): this {
		const newNode = new Node(value);
		this.length++;

		// Handle empty list
		if (!this.head) {
			this.head = newNode;
			this.tail = newNode;
		} else {
			// Connect new node to current head
			newNode.next = this.head;
			this.head.prev = newNode;
			this.head = newNode;
		}

		return this;
	}

	/**
	 * Removes and returns the FIRST node from the list
	 * Time Complexity: O(1) - Direct access to head
	 * Space Complexity: O(1) - Only uses constant extra space
	 *
	 * This operation is extremely efficient in a doubly linked list because:
	 * 1. We have direct access to the head node
	 * 2. We can update the new head's prev pointer to null in O(1) time
	 * 3. No traversal is needed
	 *
	 * Algorithm:
	 * 1. Check if list is empty → return undefined
	 * 2. Store reference to current head (node to be removed)
	 * 3. Move head pointer to the next node
	 * 4. If new head exists, set its prev pointer to null
	 * 5. Decrement the list length
	 * 6. If list becomes empty (length = 0), set tail to null
	 * 7. Disconnect the removed node's pointers for cleanup
	 * 8. Return the removed node
	 *
	 * Visual Example:
	 * Before shift():
	 * ```
	 * null ← [5] ⇄ [10] ⇄ [15] → null
	 *         ↑                    ↑
	 *       head                 tail
	 * ```
	 *
	 * After shift():
	 * ```
	 * null ← [10] ⇄ [15] → null
	 *         ↑             ↑
	 *       head          tail
	 *
	 * Removed: [5] (returned)
	 * ```
	 *
	 * Edge Cases:
	 * - Empty list: Returns undefined, no changes to list structure
	 * - Single element: Both head and tail become null, length becomes 0
	 * - Two elements: Head moves to second node, new head.prev = null
	 *
	 * Key Advantage Over Singly Linked List:
	 * In a doubly linked list, after shifting, the new head's prev pointer
	 * can be set to null directly without any extra work. In a singly linked
	 * list, we only need to update the next pointer, but doubly linked lists
	 * maintain bidirectional integrity automatically.
	 *
	 * @returns The removed node, or undefined if list was empty
	 *
	 * @example
	 * const list = new DoublyLinkedListNode<number>(5);
	 * list.push(10).push(15);
	 * const removed = list.shift(); // Removes and returns first node
	 * console.log(removed?.value);  // 5
	 * // List is now: null ← [10] ⇄ [15] → null
	 *
	 * @example
	 * // Shifting from single-element list
	 * const list = new DoublyLinkedListNode<string>("only");
	 * const removed = list.shift();
	 * console.log(removed?.value);  // "only"
	 * console.log(list.head);       // null
	 * console.log(list.tail);       // null
	 * console.log(list.length);     // 0
	 *
	 * @example
	 * // Shifting from empty list
	 * const list = new DoublyLinkedListNode<number>(1);
	 * list.pop(); // Make list empty
	 * const removed = list.shift();
	 * console.log(removed); // undefined
	 */
	shift(): Node<T> | undefined {
		if (!this.head) return undefined; // Empty list

		const removedNode = this.head; // Store node to be removed
		this.head = this.head.next; // Move head to next node
		this.length--; // Decrement length

		// If list is now empty, reset tail
		if (this.length === 0) {
			this.tail = null;
		} else {
			// Set new head's prev pointer to null
			if (this.head) {
				this.head.prev = null;
			}
		}

		// Cleanup: Disconnect removed node's pointers
		removedNode.next = null;
		removedNode.prev = null;

		return removedNode; // Return the removed node
	}

	/**
	 * Retrieves the node at a specific index (0-based)
	 * Time Complexity: O(n/2) ≈ O(n) - But optimized to traverse from nearest end
	 * Space Complexity: O(1) - Only uses constant extra space
	 *
	 * This is a KEY ADVANTAGE of doubly linked lists over singly linked lists!
	 * By being able to traverse from either end, we can reduce traversal time by half
	 * in the average case.
	 *
	 * Optimization Strategy:
	 * 1. Calculate the midpoint of the list
	 * 2. If index < midpoint: Start from head and traverse forward
	 * 3. If index >= midpoint: Start from tail and traverse backward
	 * 4. This ensures we never traverse more than half the list
	 *
	 * Algorithm:
	 * 1. Validate index is within bounds [0, length)
	 * 2. Calculate midpoint using Math.floor(length / 2)
	 * 3. If index is in first half:
	 *    - Start at head
	 *    - Traverse forward using next pointers
	 *    - Move index times
	 * 4. If index is in second half:
	 *    - Start at tail
	 *    - Traverse backward using prev pointers
	 *    - Move (length - 1 - index) times
	 * 5. Return the node at that position
	 *
	 * Visual Example (list with 7 nodes):
	 * ```
	 * Index:     0     1     2     3     4     5     6
	 *         null ← [A] ⇄ [B] ⇄ [C] ⇄ [D] ⇄ [E] ⇄ [F] ⇄ [G] → null
	 *                 ↑           midpoint           ↑
	 *               head          (index 3)        tail
	 *
	 * get(1): index < 3 → Start from head, move forward 1 time → [B]
	 * get(5): index >= 3 → Start from tail, move backward 1 time → [F]
	 * ```
	 *
	 * Performance Comparison:
	 * - Singly Linked List get(5) in 7-node list: 5 traversals
	 * - Doubly Linked List get(5) in 7-node list: 1 traversal (from tail)
	 * - Average improvement: ~50% fewer traversals
	 *
	 * Edge Cases:
	 * - Negative index: Returns undefined
	 * - Index >= length: Returns undefined
	 * - Index 0: Returns head (no traversal needed)
	 * - Index === length - 1: Returns tail (no traversal needed)
	 * - Single element list: Returns that element for index 0
	 *
	 * @param index - The zero-based index of the node to retrieve (0 = first node)
	 * @returns The node at the specified index, or undefined if index is out of bounds
	 *
	 * @example
	 * const list = new DoublyLinkedListNode<number>(10);
	 * list.push(20).push(30).push(40).push(50);
	 * // List: [10, 20, 30, 40, 50], length = 5, midpoint = 2
	 *
	 * const node1 = list.get(1);  // index < 2, traverse from head
	 * console.log(node1?.value);  // 20
	 *
	 * const node4 = list.get(4);  // index >= 2, traverse from tail
	 * console.log(node4?.value);  // 50
	 *
	 * @example
	 * // Out of bounds examples:
	 * list.get(-1);              // undefined (negative index)
	 * list.get(5);               // undefined (index >= length)
	 */
	get(index: number): Node<T> | undefined {
		// Validate index is within valid range
		if (index < 0 || index >= this.length) return undefined;

		let currentNode: Node<T> | null;
		const mid = Math.floor(this.length / 2);

		// Optimization: Choose which end to start from
		if (index < mid) {
			// Start from head and traverse forward
			currentNode = this.head;
			for (let i = 0; i < index; i++) {
				if (currentNode) currentNode = currentNode.next;
			}
		} else {
			// Start from tail and traverse backward
			currentNode = this.tail;
			for (let i = this.length - 1; i > index; i--) {
				if (currentNode) currentNode = currentNode.prev;
			}
		}

		return currentNode || undefined; // Return the node or undefined
	}

	/**
	 * Updates the value of the node at a specific index
	 * Time Complexity: O(n/2) ≈ O(n) - But optimized via bidirectional traversal
	 * Space Complexity: O(1) - Only uses constant extra space
	 *
	 * This method leverages the optimized get() method which can traverse
	 * from either end of the list, making updates more efficient than
	 * singly linked lists on average.
	 *
	 * Process:
	 * 1. Use get() method to find the node at the specified index
	 * 2. If node exists, update its value and return true
	 * 3. If node doesn't exist (invalid index), return false
	 *
	 * Benefits of using get():
	 * - Reuses existing optimized traversal logic (DRY principle)
	 * - Automatically handles index validation
	 * - Inherits the bidirectional optimization (~50% faster on average)
	 * - More maintainable - changes to get() apply here too
	 *
	 * This method is useful for modifying existing data without changing
	 * the structure of the list (no nodes are added or removed).
	 *
	 * Performance Advantage:
	 * - Singly Linked List: Always O(n) from head
	 * - Doubly Linked List: O(n/2) from nearest end
	 * - For updates near the end of a large list, this is significantly faster
	 *
	 * Visual Example:
	 * ```
	 * Before: null ← [10] ⇄ [20] ⇄ [30] → null
	 * set(1, 99)
	 * After:  null ← [10] ⇄ [99] ⇄ [30] → null
	 * ```
	 *
	 * Edge Cases:
	 * - Negative index: Returns false, no changes made
	 * - Index >= length: Returns false, no changes made
	 * - Empty list: Returns false
	 * - Valid index: Updates value, returns true
	 *
	 * @param index - The zero-based index of the node to update
	 * @param value - The new value to set
	 * @returns true if update was successful, false if index out of bounds
	 *
	 * @example
	 * const list = new DoublyLinkedListNode<number>(10);
	 * list.push(20).push(30);
	 * // List: [10, 20, 30]
	 *
	 * list.set(1, 99);  // true
	 * // List: [10, 99, 30]
	 *
	 * const node = list.get(1);
	 * console.log(node?.value);  // 99
	 *
	 * @example
	 * // Invalid index examples:
	 * list.set(-1, 50);   // false (negative index)
	 * list.set(10, 50);   // false (index >= length)
	 * list.set(3, 50);    // false (length is 3, valid indices: 0-2)
	 *
	 * @example
	 * // Updating near the end is efficient
	 * const list = new DoublyLinkedListNode<number>(1);
	 * for (let i = 2; i <= 100; i++) {
	 *   list.push(i);
	 * }
	 * // Update index 95 - traverses from tail (5 steps) instead of head (95 steps)
	 * list.set(95, 999);  // true, optimized traversal from tail
	 */
	set(index: number, value: T): boolean {
		// Use get() to find the node at the specified index
		// get() already handles index validation and optimized traversal
		const targetNode = this.get(index);

		// If node exists, update its value
		if (targetNode) {
			targetNode.value = value;
			return true; // Successfully updated
		}

		return false; // Index out of bounds or invalid
	}

	/**
	 * Removes and returns the node at a specific index
	 * Time Complexity: O(n/2) ≈ O(n) - But optimized via bidirectional traversal
	 * Space Complexity: O(1) - Only uses constant extra space
	 *
	 * This method combines the efficiency of get() with proper node removal,
	 * maintaining the integrity of the doubly linked list structure.
	 *
	 * Algorithm:
	 * 1. Validate index is within bounds [0, length)
	 * 2. Handle special cases for better performance:
	 *    a. index === 0: Use shift() to remove first node
	 *    b. index === length - 1: Use pop() to remove last node
	 * 3. For middle nodes:
	 *    a. Use get() to find the node (optimized traversal)
	 *    b. Update prev node's next pointer to skip removed node
	 *    c. Update next node's prev pointer to skip removed node
	 *    d. Disconnect removed node's pointers (cleanup)
	 *    e. Decrement length
	 * 4. Return the removed node
	 *
	 * Visual Example (removing index 2 from 5-node list):
	 * ```
	 * Before:
	 * null ← [10] ⇄ [20] ⇄ [30] ⇄ [40] ⇄ [50] → null
	 *         ↑                             ↑
	 *       head                          tail
	 *
	 * After remove(2):
	 * null ← [10] ⇄ [20] ⇄ [40] ⇄ [50] → null
	 *         ↑                       ↑
	 *       head                    tail
	 *
	 * Returned: [30] (disconnected: next=null, prev=null)
	 * ```
	 *
	 * Key Operations for Middle Node Removal:
	 * ```
	 * nodeToRemove.prev.next = nodeToRemove.next  // Bridge forward
	 * nodeToRemove.next.prev = nodeToRemove.prev  // Bridge backward
	 * nodeToRemove.next = null                     // Cleanup
	 * nodeToRemove.prev = null                     // Cleanup
	 * ```
	 *
	 * Performance Optimization:
	 * - Uses shift() for first element: O(1)
	 * - Uses pop() for last element: O(1)
	 * - Uses optimized get() for middle: O(n/2) on average
	 * - Much faster than singly linked list for nodes near the end
	 *
	 * Edge Cases:
	 * - Negative index: Returns undefined
	 * - Index >= length: Returns undefined
	 * - Empty list: Returns undefined
	 * - Single element: Removes and returns it, list becomes empty
	 * - First element: Delegates to shift()
	 * - Last element: Delegates to pop()
	 *
	 * Why Use shift() and pop():
	 * - They already handle head/tail updates correctly
	 * - They clean up pointers properly
	 * - DRY principle - reuse existing logic
	 * - Ensures consistency across all removal operations
	 *
	 * @param index - The zero-based index of the node to remove
	 * @returns The removed node, or undefined if index is out of bounds
	 *
	 * @example
	 * const list = new DoublyLinkedListNode<number>(10);
	 * list.push(20).push(30).push(40).push(50);
	 * // List: [10, 20, 30, 40, 50]
	 *
	 * const removed = list.remove(2);
	 * console.log(removed?.value);  // 30
	 * // List: [10, 20, 40, 50]
	 *
	 * @example
	 * // Removing first node
	 * const list = new DoublyLinkedListNode<number>(1);
	 * list.push(2).push(3);
	 * list.remove(0);  // Uses shift(), returns node with value 1
	 * // List: [2, 3]
	 *
	 * @example
	 * // Removing last node
	 * const list = new DoublyLinkedListNode<number>(1);
	 * list.push(2).push(3);
	 * list.remove(2);  // Uses pop(), returns node with value 3
	 * // List: [1, 2]
	 *
	 * @example
	 * // Invalid cases
	 * const list = new DoublyLinkedListNode<number>(1);
	 * list.push(2);
	 * list.remove(-1);   // undefined
	 * list.remove(5);    // undefined
	 * list.remove(2);    // undefined (length is 2, valid: 0-1)
	 */
	remove(index: number): Node<T> | undefined {
		// Validate index is within valid range
		if (index < 0 || index >= this.length) return undefined;

		// Special case: removing first node
		if (index === 0) return this.shift();

		// Special case: removing last node
		if (index === this.length - 1) return this.pop();

		// Middle removal: get the node to remove
		const nodeToRemove = this.get(index);

		if (nodeToRemove && nodeToRemove.prev && nodeToRemove.next) {
			// Bridge the gap: connect prev and next nodes together
			nodeToRemove.prev.next = nodeToRemove.next;
			nodeToRemove.next.prev = nodeToRemove.prev;

			// Cleanup: disconnect removed node's pointers
			nodeToRemove.next = null;
			nodeToRemove.prev = null;

			// Decrement length
			this.length--;

			return nodeToRemove;
		}

		return undefined; // Should not reach here if validation works
	}
}

export { Node, DoublyLinkedList };
