/**
 * Node class represents a single element in the linked list
 * Each node contains:
 * - value: The data stored in this node
 * - next: Reference to the next node in the list (or null if this is the last node)
 */
class Node<T> {
	value: T;
	next: Node<T> | null;

	constructor(value: T) {
		this.value = value;
		this.next = null; // Initially, the node points to nothing
	}
}

/**
 * SinglyLinkedList is a linear data structure where elements are stored in nodes
 * Each node points to the next node in the sequence
 *
 * Key properties:
 * - head: Points to the first node in the list
 * - tail: Points to the last node in the list
 * - length: Tracks the number of nodes in the list
 *
 * Time Complexities:
 * - push: O(1) - Adding to the end
 * - pop: O(n) - Removing from the end (need to traverse to find second-to-last)
 * - unshift: O(1) - Adding to the beginning
 * - shift: O(1) - Removing from the beginning
 * - peek: O(n) - Viewing all elements
 * - getLength: O(1) - Getting the size
 */
class SinglyLinkedList<T> {
	public head: Node<T> | null; // First node in the list
	public tail: Node<T> | null; // Last node in the list
	public length: number; // Number of nodes

	/**
	 * Creates a new linked list
	 * @param initValue - Optional initial value to start the list with
	 *
	 * Example:
	 * const emptyList = new SinglyLinkedList<number>(); // Creates empty list
	 * const listWithValue = new SinglyLinkedList<number>(10); // Creates list with one node
	 */
	constructor(initValue?: T) {
		// If initial value provided, create first node; otherwise, list starts empty
		this.head = initValue !== undefined ? new Node(initValue) : null;
		this.tail = initValue !== undefined ? this.head : null;
		this.length = initValue !== undefined ? 1 : 0;
	}

	/**
	 * Returns the current number of nodes in the list
	 * Time Complexity: O(1)
	 *
	 * @returns The length of the list
	 */
	getLength(): number {
		return this.length;
	}

	/**
	 * Adds a new node with the given value to the END of the list
	 * Time Complexity: O(1)
	 *
	 * Process:
	 * 1. Create a new node with the value
	 * 2. If list is empty, new node becomes both head and tail
	 * 3. Otherwise, attach new node after current tail and update tail
	 * 4. Increment length
	 *
	 * @param value - The value to add
	 * @returns The list instance for method chaining
	 *
	 * Example:
	 * list.push(1).push(2).push(3); // Adds 1, 2, 3 to the end
	 */
	push(value: T): this {
		this.length++; // Increment length first
		const newNode = new Node(value);

		if (!this.tail) {
			// List is empty: new node becomes both head and tail
			this.head = newNode;
			this.tail = newNode;
		} else {
			// List has nodes: attach new node to current tail
			this.tail.next = newNode;
			this.tail = newNode; // Update tail to new node
		}

		return this; // Return list for chaining
	}

	/**
	 * Removes and returns the LAST node from the list
	 * Time Complexity: O(n) - Must traverse to find second-to-last node
	 *
	 * Process:
	 * 1. If list is empty, return undefined
	 * 2. Traverse to find the second-to-last node
	 * 3. Make second-to-last node the new tail
	 * 4. Disconnect the last node
	 * 5. Decrement length
	 * 6. If list becomes empty, set head and tail to null
	 *
	 * @returns The removed node, or undefined if list was empty
	 *
	 * Example:
	 * const removed = list.pop(); // Removes and returns last node
	 * console.log(removed?.value); // Access the value of removed node
	 */
	pop(): Node<T> | undefined {
		if (!this.head) return undefined; // Empty list

		let currentNode = this.head; // Will become the node to remove
		let previousNode = this.head; // Will become the new tail

		// Traverse to the last node
		while (currentNode.next) {
			previousNode = currentNode; // Keep track of previous node
			currentNode = currentNode.next; // Move to next node
		}

		// Now currentNode is the last node, previousNode is second-to-last
		this.tail = previousNode; // Update tail
		this.tail.next = null; // Disconnect the last node
		this.length--; // Decrement length

		// If list is now empty, reset head and tail
		if (this.length === 0) {
			this.head = null;
			this.tail = null;
		}

		return currentNode; // Return the removed node
	}

	/**
	 * Returns an array of all values in the list WITHOUT modifying it
	 * Time Complexity: O(n) - Must visit every node
	 *
	 * Process:
	 * 1. Create an empty array
	 * 2. Traverse the list from head to tail
	 * 3. Add each node's value to the array
	 * 4. Return the array
	 *
	 * @returns Array containing all values in order
	 *
	 * Example:
	 * list.push(1).push(2).push(3);
	 * console.log(list.peek()); // [1, 2, 3]
	 */
	peek(): T[] {
		const values: T[] = [];
		let currentNode = this.head;

		// Traverse the list and collect values
		while (currentNode) {
			values.push(currentNode.value);
			currentNode = currentNode.next; // Move to next node
		}

		return values;
	}

	/**
	 * Adds a new node with the given value to the BEGINNING of the list
	 * Time Complexity: O(1)
	 *
	 * Process:
	 * 1. Create a new node with the value
	 * 2. If list is empty, new node becomes both head and tail
	 * 3. Otherwise, point new node to current head, then update head
	 * 4. Increment length
	 *
	 * @param value - The value to add
	 * @returns The list instance for method chaining
	 *
	 * Example:
	 * list.unshift(3).unshift(2).unshift(1); // Results in [1, 2, 3]
	 */
	unshift(value: T): this {
		this.length++; // Increment length first
		const newNode = new Node(value);

		if (!this.head) {
			// List is empty: new node becomes both head and tail
			this.head = newNode;
			this.tail = newNode;
		} else {
			// List has nodes: insert new node before current head
			newNode.next = this.head; // New node points to current head
			this.head = newNode; // Update head to new node
		}

		return this; // Return list for chaining
	}

	/**
	 * Removes and returns the FIRST node from the list
	 * Time Complexity: O(1)
	 *
	 * Process:
	 * 1. If list is empty, return undefined
	 * 2. Store reference to current head
	 * 3. Move head to the next node
	 * 4. Disconnect the old head node
	 * 5. Decrement length
	 * 6. If list becomes empty, set tail to null
	 *
	 * @returns The removed node, or undefined if list was empty
	 *
	 * Example:
	 * const removed = list.shift(); // Removes and returns first node
	 * console.log(removed?.value); // Access the value of removed node
	 */
	shift(): Node<T> | undefined {
		if (!this.head) return undefined; // Empty list

		const removedNode = this.head; // Store node to be removed
		this.head = this.head.next; // Move head to next node
		removedNode.next = null; // Disconnect removed node
		this.length--; // Decrement length

		// If list is now empty, reset tail
		if (this.length === 0) {
			this.tail = null;
		}

		return removedNode; // Return the removed node
	}

	/**
	 * Retrieves the node at a specific index (0-based)
	 * Time Complexity: O(n) - Must traverse from head to the target index
	 *
	 * Process:
	 * 1. Validate index is within bounds [0, length)
	 * 2. Start at head and traverse forward
	 * 3. Move to next node index times
	 * 4. Return the node at that position
	 *
	 * Note: Unlike arrays, linked lists don't have direct access to elements by index.
	 * We must traverse from the beginning to reach the desired position.
	 *
	 * @param index - The zero-based index of the node to retrieve (0 = first node)
	 * @returns The node at the specified index, or undefined if index is out of bounds
	 *
	 * Example:
	 * list.push(10).push(20).push(30);
	 * const node = list.get(1);  // Gets node with value 20
	 * console.log(node?.value);  // 20
	 *
	 * // Out of bounds examples:
	 * list.get(-1);              // undefined (negative index)
	 * list.get(3);               // undefined (index >= length)
	 */
	get(index: number): Node<T> | undefined {
		// Validate index is within valid range
		if (index < 0 || index >= this.length) return undefined;

		let currentNode = this.head; // Start at the beginning

		// Traverse to the target index
		for (let i = 0; i < index; i++) {
			if (currentNode) currentNode = currentNode.next; // Move to next node
		}

		return currentNode || undefined; // Return the node or undefined
	}

	/**
	 * Updates the value of the node at a specific index
	 * Time Complexity: O(n) - Must traverse from head to the target index
	 *
	 * Process:
	 * 1. Use get() method to find the node at the specified index
	 * 2. If node exists, update its value and return true
	 * 3. If node doesn't exist (invalid index), return false
	 *
	 * This method is useful for modifying existing data without changing
	 * the structure of the list (no nodes are added or removed).
	 *
	 * Benefits of using get():
	 * - Reuses existing traversal logic (DRY principle)
	 * - Automatically handles index validation
	 * - More maintainable - changes to get() apply here too
	 *
	 * @param index - The zero-based index of the node to update
	 * @param value - The new value to set
	 * @returns true if update was successful, false if index out of bounds
	 *
	 * Example:
	 * list.push(10).push(20).push(30);  // [10, 20, 30]
	 * list.set(1, 99);                  // [10, 99, 30]
	 * console.log(list.peek());         // [10, 99, 30]
	 *
	 * // Invalid index examples:
	 * list.set(-1, 50);  // false (negative index)
	 * list.set(10, 50);  // false (index >= length)
	 */
	set(index: number, value: T): boolean {
		// Use get() to find the node at the specified index
		// get() already handles index validation and traversal
		const targetNode = this.get(index);

		// If node exists, update its value
		if (targetNode) {
			targetNode.value = value;
			return true; // Successfully updated
		}

		return false; // Index out of bounds or invalid
	}

	/**
	 * Inserts a new node with the given value at a specific index
	 * Time Complexity: O(n) - Must traverse to the index position
	 *
	 * Process:
	 * 1. Validate index is within bounds [0, length]
	 * 2. Handle special cases:
	 *    - index === 0: Use unshift() for O(1) insertion at beginning
	 *    - index === length: Use push() for O(1) insertion at end
	 * 3. For middle insertion:
	 *    a. Get the node BEFORE the target index (at index - 1)
	 *    b. Create new node
	 *    c. Point new node to the next node
	 *    d. Point previous node to new node
	 * 4. Increment length
	 *
	 * Note: This allows inserting at index equal to length (appending to end).
	 * The valid range is [0, length], not [0, length) like get() or set().
	 *
	 * @param index - The zero-based index where the new node should be inserted
	 * @param value - The value for the new node
	 * @returns true if insertion was successful, false if index out of bounds
	 *
	 * Example:
	 * list.push(10).push(30);     // [10, 30]
	 * list.insert(1, 20);          // [10, 20, 30]
	 * list.insert(0, 5);           // [5, 10, 20, 30]
	 * list.insert(4, 40);          // [5, 10, 20, 30, 40]
	 *
	 * // Invalid index examples:
	 * list.insert(-1, 50);  // false (negative index)
	 * list.insert(10, 50);  // false (index > length)
	 */
	insert(index: number, value: T): boolean {
		// Validate index is within valid range [0, length]
		if (index < 0 || index > this.length) return false;

		// Special case: inserting at beginning
		if (index === 0) {
			this.unshift(value);
			return true;
		}

		// Special case: inserting at end
		if (index === this.length) {
			this.push(value);
			return true;
		}

		// Middle insertion: get the node BEFORE the insertion point
		const previousNode = this.get(index - 1);

		if (previousNode) {
			const newNode = new Node(value);
			newNode.next = previousNode.next; // New node points to next node
			previousNode.next = newNode; // Previous node points to new node
			this.length++; // Increment length
			return true;
		}

		return false; // Should not reach here if validation works
	}

	/**
	 * Reverses the linked list in place
	 * Time Complexity: O(n) - Must visit every node once
	 * Space Complexity: O(1) - Only uses a few pointer variables
	 *
	 * Visual explanation of the reversal process:
	 *
	 * Original list:
	 *   [1] → [2] → [3] → [4] → null
	 *    ↑                       ↑
	 *   head                    tail
	 *
	 * After reversal:
	 *   null ← [1] ← [2] ← [3] ← [4]
	 *          ↑                  ↑
	 *         tail               head
	 *
	 * The algorithm works by "flipping" each arrow (next pointer) one by one:
	 *
	 * Step-by-step process:
	 * 1. Start with three pointers: previousNode=null, currentNode=head, nextNode=null
	 * 2. For each node:
	 *    a. Save the next node (before we lose the reference)
	 *    b. Reverse the current node's pointer to point backwards
	 *    c. Move all three pointers one step forward
	 * 3. After the loop, swap head and tail
	 *
	 * Detailed walkthrough with [1→2→3→null]:
	 *
	 * Initial:
	 *   prev=null, current=[1], next=null
	 *   null  [1]→[2]→[3]→null
	 *
	 * Iteration 1:
	 *   next = current.next        // next=[2], save before losing reference
	 *   current.next = prev        // [1]→null, flip the arrow
	 *   prev = current             // prev=[1], move forward
	 *   current = next             // current=[2], move forward
	 *   Result: null←[1]  [2]→[3]→null
	 *
	 * Iteration 2:
	 *   next = current.next        // next=[3]
	 *   current.next = prev        // [2]→[1], flip the arrow
	 *   prev = current             // prev=[2], move forward
	 *   current = next             // current=[3], move forward
	 *   Result: null←[1]←[2]  [3]→null
	 *
	 * Iteration 3:
	 *   next = current.next        // next=null
	 *   current.next = prev        // [3]→[2], flip the arrow
	 *   prev = current             // prev=[3], move forward
	 *   current = next             // current=null, exit loop
	 *   Result: null←[1]←[2]←[3]  null
	 *
	 * Final: Swap head and tail
	 *   head=[3], tail=[1]
	 *   Result: null←[1]←[2]←[3]
	 *                 ↑       ↑
	 *                tail    head
	 *
	 * @returns The list instance for method chaining
	 *
	 * Example:
	 * list.push(1).push(2).push(3);
	 * console.log(list.peek());     // [1, 2, 3]
	 * list.reverse();
	 * console.log(list.peek());     // [3, 2, 1]
	 */
	reverse(): this {
		// Handle empty list or single element (nothing to reverse)
		if (!this.head || this.length <= 1) return this;

		// Initialize three pointers for the reversal algorithm
		let previousNode: Node<T> | null = null; // Tracks the node behind
		let currentNode: Node<T> | null = this.head; // The node we're currently reversing
		let nextNode: Node<T> | null = null; // Temporarily stores the next node

		// Traverse the list and flip each arrow
		while (currentNode) {
			// Step 1: Save the next node (before we lose the reference)
			nextNode = currentNode.next;

			// Step 2: Reverse the pointer - make current point backwards
			currentNode.next = previousNode;

			// Step 3: Move both pointers one step forward for next iteration
			previousNode = currentNode;
			currentNode = nextNode;
		}

		// After loop: previousNode is the new head (last node of original list)
		//             currentNode is null (reached the end)

		// Step 4: Swap head and tail
		const temp = this.head; // Old head becomes new tail
		this.head = this.tail; // Old tail becomes new head
		this.tail = temp;

		return this; // Return for method chaining
	}

	/**
	 * Finds and returns the middle node of the linked list using the "slow and fast pointer" technique
	 * Time Complexity: O(n) - Traverses the list once
	 * Space Complexity: O(1) - Only uses two pointers, no additional data structures
	 *
	 * Algorithm: Two-Pointer (Tortoise and Hare)
	 * - Slow pointer moves 1 step at a time
	 * - Fast pointer moves 2 steps at a time
	 * - When fast pointer reaches the end, slow pointer is at the middle
	 *
	 * For lists with EVEN number of nodes:
	 * Returns the SECOND middle node (the one closer to the end)
	 *
	 * For lists with ODD number of nodes:
	 * Returns the exact middle node
	 *
	 * Visual Example (ODD length - 5 nodes):
	 * List: [1] → [2] → [3] → [4] → [5] → null
	 *
	 * Step 1: slow=[1], fast=[1]
	 * Step 2: slow=[2], fast=[3]
	 * Step 3: slow=[3], fast=[5]
	 * Step 4: fast.next=null, stop. slow is at middle [3] ✓
	 *
	 * Visual Example (EVEN length - 6 nodes):
	 * List: [1] → [2] → [3] → [4] → [5] → [6] → null
	 *
	 * Step 1: slow=[1], fast=[1]
	 * Step 2: slow=[2], fast=[3]
	 * Step 3: slow=[3], fast=[5]
	 * Step 4: slow=[4], fast=null, stop. slow is at second middle [4] ✓
	 *
	 * WHY THIS WORKS:
	 * - Fast pointer travels twice as fast as slow pointer
	 * - When fast reaches the end (null), slow has traveled half the distance
	 * - For even-length lists, when fast becomes null, slow is at the second middle
	 *
	 * Constraints:
	 * - Only traverses the list once (single pass)
	 * - No additional data structures used (meets O(1) space requirement)
	 * - Does not modify the existing list structure
	 *
	 * @returns The middle node, or undefined if list is empty
	 *
	 * Example 1 (ODD length):
	 * const list = new SinglyLinkedList<number>(1);
	 * list.push(2).push(3).push(4).push(5);
	 * const middle = list.findMiddleNode();
	 * console.log(middle?.value); // 3 (access the value property of the returned node)
	 *
	 * Example 2 (EVEN length):
	 * const list = new SinglyLinkedList<number>(1);
	 * list.push(2).push(3).push(4).push(5).push(6);
	 * const middle = list.findMiddleNode();
	 * console.log(middle?.value); // 4 (second middle node's value)
	 *
	 * Example 3 (Empty list):
	 * const list = new SinglyLinkedList<number>();
	 * const middle = list.findMiddleNode();
	 * console.log(middle); // undefined (no node to return)
	 */
	findMiddleNode(): Node<T> | undefined {
		// Handle empty list
		if (!this.head) return undefined;

		// Initialize both pointers at the head
		let slowPointer: Node<T> | null = this.head;
		let fastPointer: Node<T> | null = this.head;

		// Move fast pointer 2 steps, slow pointer 1 step
		// When fast reaches end, slow is at middle
		while (fastPointer && fastPointer.next) {
			slowPointer = slowPointer!.next; // Slow moves 1 step
			fastPointer = fastPointer.next.next; // Fast moves 2 steps
		}

		// slowPointer is guaranteed to be non-null here because:
		// - We checked this.head is not null at the beginning
		// - slowPointer starts at head
		// - slowPointer only moves when fastPointer exists
		return slowPointer || undefined;
	}
}

export { SinglyLinkedList, Node };

/**
 * ============================================================================
 * LEARNING NOTES: Understanding Singly Linked Lists
 * ============================================================================
 *
 * WHAT IS A SINGLY LINKED LIST?
 * A singly linked list is a linear data structure where each element (node)
 * contains data and a reference (pointer) to the next node in the sequence.
 *
 * VISUAL REPRESENTATION:
 *
 *    HEAD                                      TAIL
 *     ↓                                         ↓
 *   [1|•]→[2|•]→[3|•]→[4|null]
 *    value next
 *
 * Each box [value|next] represents a node:
 * - Left side: the data stored
 * - Right side: pointer to next node (• means points to another node, null means end)
 *
 * ============================================================================
 * ADVANTAGES vs ARRAYS:
 * ============================================================================
 * 1. Dynamic size: No need to specify size upfront
 * 2. Efficient insertions/deletions at beginning: O(1) instead of O(n)
 * 3. No memory waste: Only allocates what's needed
 * 4. Easy to grow: No need to copy/resize like arrays
 *
 * ============================================================================
 * DISADVANTAGES vs ARRAYS:
 * ============================================================================
 * 1. No random access: Can't directly access by index [i]
 * 2. Extra memory: Each node needs storage for the pointer
 * 3. Sequential access only: Must traverse from beginning
 * 4. Poor cache locality: Nodes may be scattered in memory
 *
 * ============================================================================
 * TIME COMPLEXITIES SUMMARY:
 * ============================================================================
 * Operation    | Time      | Reason
 * -------------|-----------|------------------------------------------------
 * push         | O(1)      | Just update tail pointer
 * pop          | O(n)      | Must traverse to find second-to-last node
 * unshift      | O(1)      | Just update head pointer
 * shift        | O(1)      | Just update head pointer
 * peek         | O(n)      | Must visit all nodes
 * getLength    | O(1)      | We maintain a length variable
 * access[i]    | O(n)      | Must traverse from head (not implemented here)
 * search       | O(n)      | Must check each node (not implemented here)
 *
 * ============================================================================
 * REAL-WORLD USE CASES:
 * ============================================================================
 * 1. Browser History: Back/forward navigation
 * 2. Undo/Redo functionality: Each action is a node
 * 3. Music playlists: Next song functionality
 * 4. Image viewer: Previous/next image
 * 5. Implementation of other data structures:
 *    - Stacks (using push/pop or unshift/shift)
 *    - Queues (using push/shift)
 *
 * ============================================================================
 * USAGE PATTERNS:
 * ============================================================================
 *
 * AS A STACK (LIFO - Last In, First Out):
 * ----------------------------------------
 * const stack = new SinglyLinkedList<number>();
 * stack.push(1);  // Add to end
 * stack.push(2);
 * stack.push(3);
 * const last = stack.pop();  // Remove from end -> gets 3
 *
 * AS A QUEUE (FIFO - First In, First Out):
 * ----------------------------------------
 * const queue = new SinglyLinkedList<string>();
 * queue.push("first");   // Add to end (enqueue)
 * queue.push("second");
 * queue.push("third");
 * const first = queue.shift();  // Remove from front (dequeue) -> gets "first"
 *
 * METHOD CHAINING:
 * ----------------
 * list.push(1).push(2).unshift(0).push(3);  // Results in: [0, 1, 2, 3]
 *
 * ============================================================================
 * WHEN TO USE A SINGLY LINKED LIST:
 * ============================================================================
 * ✅ Use when:
 * - You need frequent insertions/deletions at the beginning
 * - You don't need random access to elements
 * - You're implementing a stack or queue
 * - Memory is a concern (more efficient than arrays for sparse data)
 * - You need a dynamic size with efficient growth
 *
 * ❌ Don't use when:
 * - You need random access (use arrays instead)
 * - You need frequent access to the last element (use doubly linked list)
 * - Memory overhead is a concern (pointer storage adds up)
 * - You need to traverse backwards (use doubly linked list)
 *
 * ============================================================================
 * KEY CONCEPTS TO UNDERSTAND:
 * ============================================================================
 * 1. HEAD: Pointer to the first node (entry point to the list)
 * 2. TAIL: Pointer to the last node (makes push() O(1))
 * 3. NODE: Container with value and next pointer
 * 4. TRAVERSAL: Moving through the list by following next pointers
 * 5. NULL TERMINATION: Last node's next pointer is null (marks the end)
 *
 * ============================================================================
 * COMMON PITFALLS FOR BEGINNERS:
 * ============================================================================
 * 1. Forgetting to update tail when adding to empty list
 * 2. Not handling empty list edge cases
 * 3. Forgetting to disconnect removed nodes (memory leaks in manual memory management)
 * 4. Not updating length counter
 * 5. Losing reference to head when removing first node
 * 6. Not checking for null before accessing node.next
 *
 * ============================================================================
 */
