import {
	Node,
	SinglyLinkedList,
} from "@/data-structures/singly-linked-list/singly-linked-list";

/**
 * Finds the middle node of a singly linked list using the "slow and fast pointer" technique
 * Time Complexity: O(n) - Traverses the list once
 * Space Complexity: O(1) - Only uses two pointers
 *
 * Algorithm: Two-Pointer (Tortoise and Hare)
 * - Slow pointer moves 1 step at a time
 * - Fast pointer moves 2 steps at a time
 * - When fast pointer reaches the end, slow pointer is at the middle
 *
 * Visual Example:
 * List: [1] → [2] → [3] → [4] → [5] → null
 *
 * Step 1: slow=[1], fast=[1]
 * Step 2: slow=[2], fast=[3]
 * Step 3: slow=[3], fast=[5]
 * Step 4: fast.next=null, stop. slow is at middle [3]
 *
 * For even-length lists, returns the second middle node:
 * List: [1] → [2] → [3] → [4] → null
 * Result: [3] (the second of the two middle nodes)
 *
 * @param list - The singly linked list to find the middle of
 * @returns The middle node, or null if list is empty
 *
 * @example
 * const list = new SinglyLinkedList<number>(1);
 * list.push(2).push(3).push(4).push(5);
 * const middle = findMiddleNode(list); // Returns node with value 3
 * console.log(middle?.value); // 3
 *
 * @example
 * const evenList = new SinglyLinkedList<number>(1);
 * evenList.push(2).push(3).push(4);
 * const middle = findMiddleNode(evenList); // Returns node with value 3 (second middle)
 * console.log(middle?.value); // 3
 */
export function findMiddleNode<T>(list: SinglyLinkedList<T>): Node<T> | null {
	// Handle empty list
	if (!list.head) return null;

	// Initialize both pointers at the head
	let slowPointer: Node<T> | null = list.head;
	let fastPointer: Node<T> | null = list.head;

	// Move fast pointer 2 steps, slow pointer 1 step
	// When fast reaches end, slow is at middle
	while (fastPointer && fastPointer.next) {
		slowPointer = slowPointer!.next; // Slow moves 1 step
		fastPointer = fastPointer?.next?.next; // Fast moves 2 steps
	}

	// slowPointer is guaranteed to be non-null here because:
	// - We checked list.head is not null
	// - slowPointer starts at head
	// - slowPointer only moves when fastPointer exists
	return slowPointer;
}

/**
 * Detects if a singly linked list contains a loop (cycle) using Floyd's Cycle Detection Algorithm
 * Time Complexity: O(n) - In worst case, visits each node once
 * Space Complexity: O(1) - Only uses two pointers
 *
 * Algorithm: Floyd's Cycle Detection (Tortoise and Hare)
 * - Slow pointer moves 1 step at a time
 * - Fast pointer moves 2 steps at a time
 * - If there's a loop, fast pointer will eventually meet slow pointer
 * - If there's no loop, fast pointer reaches the end (null)
 *
 * Why this works:
 * - If there's a loop, both pointers will eventually enter the loop
 * - Once inside the loop, fast pointer closes the gap by 1 position per iteration
 * - They will meet at some point within the loop
 *
 * Visual Example (List with loop):
 * [1] → [2] → [3] → [4] → [5]
 *             ↑               ↓
 *             └───────────────┘
 *
 * Step 1: slow=[1], fast=[1]
 * Step 2: slow=[2], fast=[3]
 * Step 3: slow=[3], fast=[5]
 * Step 4: slow=[4], fast=[4] → LOOP DETECTED!
 *
 * Visual Example (List without loop):
 * [1] → [2] → [3] → [4] → [5] → null
 *
 * Step 1: slow=[1], fast=[1]
 * Step 2: slow=[2], fast=[3]
 * Step 3: slow=[3], fast=[5]
 * Step 4: fast.next=null, stop. NO LOOP
 *
 * @param list - The singly linked list to check for loops
 * @returns true if the list contains a loop, false otherwise
 *
 * @example
 * const list = new SinglyLinkedList<number>(1);
 * list.push(2).push(3);
 * // Create loop: make tail point back to head
 * list.tail!.next = list.head;
 * hasLoop(list); // Returns true
 *
 * @example
 * const normalList = new SinglyLinkedList<number>(1);
 * normalList.push(2).push(3);
 * hasLoop(normalList); // Returns false (no loop)
 */
export function hasLoop<T>(list: SinglyLinkedList<T>): boolean {
	if (!list.head) return false;
	let slowPointer: Node<T> | null = list.head;
	let fastPointer: Node<T> | null = list.head;

	while (fastPointer && fastPointer.next) {
		slowPointer = slowPointer!.next; // Slow moves 1 step
		fastPointer = fastPointer.next.next; // Fast moves 2 steps

		if (slowPointer === fastPointer) {
			return true; // Loop detected
		}
	}

	return false; // No loop
}

/**
 * Finds and returns the kth node from the end of the linked list
 * Time Complexity: O(n) - Traverses the list once
 * Space Complexity: O(1) - Only uses two pointers
 *
 * Algorithm: Two-Pointer with k-gap
 * 1. Move the lead pointer k steps ahead
 * 2. If lead pointer reaches null before k steps, return null (k is too large)
 * 3. Move both pointers together until lead reaches null
 * 4. When lead is null, lag is at the kth node from the end
 *
 * Visual Example (k=2):
 * List: [1] → [2] → [3] → [4] → [5] → null
 *
 * Step 1: Create k-gap (move lead 2 steps ahead)
 *   lag=[1], lead=[3]
 *   [1] → [2] → [3] → [4] → [5] → null
 *    ↑           ↑
 *   lag        lead
 *
 * Step 2: Move both pointers until lead reaches null
 *   lag=[2], lead=[4]
 *   [1] → [2] → [3] → [4] → [5] → null
 *         ↑           ↑
 *        lag        lead
 *
 * Step 3: Move both pointers
 *   lag=[3], lead=[5]
 *   [1] → [2] → [3] → [4] → [5] → null
 *               ↑           ↑
 *              lag        lead
 *
 * Step 4: lead.next=null, move both again
 *   lag=[4], lead=null (end reached)
 *   [1] → [2] → [3] → [4] → [5] → null
 *                     ↑                ↑
 *                    lag             lead
 *   lag is at 2nd from end ✓
 *
 * WHY THIS WORKS:
 * - The gap between pointers stays constant at k nodes
 * - When lead reaches null, lag is exactly k nodes from the end
 * - This gives us the kth node from the end
 *
 * Edge Cases:
 * - k = 0: Returns null (no 0th from end)
 * - k > list length: Returns null (not enough nodes)
 * - k = list length: Returns null (would be before the head)
 * - Empty list: Returns null
 *
 * Constraints:
 * - Only traverses the list once (single pass)
 * - No additional data structures used (meets O(1) space requirement)
 * - Does not modify the existing list structure
 * - Note: This implementation does NOT use the length property
 *
 * @param k - The position from the end (1-indexed: 1 = last node, 2 = second-to-last, etc.)
 * @returns The kth node from the end, or null if k is out of bounds
 *
 * Example 1:
 * const list = new SinglyLinkedList<number>(1);
 * list.push(2).push(3).push(4).push(5);
 * const kthNode = findKthFromEnd(list, 2);
 * console.log(kthNode?.value); // 4 (2nd node from end)
 *
 * Example 2:
 * const list = new SinglyLinkedList<number>(1);
 * list.push(2).push(3).push(4).push(5).push(6);
 * const kthNode = findKthFromEnd(list, 4);
 * console.log(kthNode?.value); // 3 (4th node from end)
 *
 * Example 3 (k too large):
 * const list = new SinglyLinkedList<number>(1);
 * list.push(2).push(3);
 * const kthNode = findKthFromEnd(list, 10);
 * console.log(kthNode); // null (only 3 nodes in list)
 */
export function findKthFromEnd<T>(
	list: SinglyLinkedList<T>,
	k: number,
): Node<T> | null {
	// Handle invalid k or empty list
	if (k <= 0 || !list.head) return null;

	// Initialize both pointers at the head
	let lagPointer: Node<T> | null = list.head;
	let leadPointer: Node<T> | null = list.head;

	// Step 1: Move lead pointer k steps ahead to create the gap
	for (let i = 0; i < k; i++) {
		if (!leadPointer) return null;
		leadPointer = leadPointer.next;
	}

	// Step 2: Move both pointers until lead reaches null (end of list)
	while (leadPointer) {
		lagPointer = lagPointer!.next; // Lag moves 1 step
		leadPointer = leadPointer.next; // Lead moves 1 step
	}

	// When lead is null, lag is at kth from end
	return lagPointer;
}

/**
 * Removes all duplicate nodes from a singly linked list based on their values
 * Time Complexity: O(n) - Traverses the list once
 * Space Complexity: O(n) - Uses a Set to track unique values
 *
 * Algorithm:
 * 1. Use a Set to keep track of values we've already seen
 * 2. Traverse the list with current and previous pointers
 * 3. If current node's value is in the Set, remove it by updating previous.next
 * 4. If current node's value is new, add it to the Set and move previous pointer
 * 5. Update the list length and tail pointer after each removal
 *
 * Visual Example:
 * Original list: [1] → [2] → [3] → [2] → [1] → [4] → null
 * Set: {}
 *
 * Step 1: current=[1], Set={}, add 1 → Set={1}
 * Step 2: current=[2], Set={1}, add 2 → Set={1,2}
 * Step 3: current=[3], Set={1,2}, add 3 → Set={1,2,3}
 * Step 4: current=[2], Set={1,2,3}, 2 exists! Remove node
 *   prev.next = current.next → [1] → [2] → [3] → [1] → [4]
 * Step 5: current=[1], Set={1,2,3}, 1 exists! Remove node
 *   prev.next = current.next → [1] → [2] → [3] → [4]
 * Step 6: current=[4], Set={1,2,3}, add 4 → Set={1,2,3,4}
 *
 * Result: [1] → [2] → [3] → [4] → null
 *
 * Edge Cases:
 * - Empty list: No changes
 * - Single element: No duplicates to remove
 * - All duplicates: Only first occurrence remains
 * - No duplicates: List unchanged
 *
 * Note: This implementation modifies the list in-place and updates both
 * the length and tail properties. It works with SinglyLinkedList that has a tail pointer.
 *
 * @param list - The singly linked list to remove duplicates from
 *
 * @example
 * const list = new SinglyLinkedList<number>(1);
 * list.push(2).push(3).push(2).push(1).push(4);
 * removeDuplicates(list);
 * console.log(list.peek()); // [1, 2, 3, 4]
 *
 * @example
 * const list = new SinglyLinkedList<number>(3);
 * list.push(3).push(3);
 * removeDuplicates(list);
 * console.log(list.peek()); // [3]
 */
export function removeDuplicates<T>(list: SinglyLinkedList<T>): void {
	// Handle empty list or single element
	if (!list.head || !list.head.next) return;

	// Set to track values we've already seen
	const seen = new Set<T>();

	// Add the first node's value to the set
	seen.add(list.head.value);

	// Previous pointer starts at head, current at second node
	let previous: Node<T> = list.head;
	let current: Node<T> | null = list.head.next;

	// Traverse the list
	while (current) {
		if (seen.has(current.value)) {
			// Duplicate found - remove current node
			previous.next = current.next;
			list.length--; // Update length

			// If we removed the tail, update tail pointer
			if (current === list.tail) {
				list.tail = previous;
			}

			current = current.next; // Move to next node
		} else {
			// New value - add to set and move previous pointer
			seen.add(current.value);
			previous = current;
			current = current.next;
		}
	}
}

/**
 * Converts a binary number represented as a linked list to a decimal number
 * Time Complexity: O(n) - Traverses the list once
 * Space Complexity: O(1) - Only uses a single variable to accumulate the result
 *
 * Algorithm: Left-to-Right Binary Conversion
 * - Start with result = 0
 * - For each node: result = result * 2 + node.value
 * - This is equivalent to shifting left and adding the current bit
 *
 * Mathematical Explanation:
 * Binary number 1011 = 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8 + 0 + 2 + 1 = 11
 *
 * How the algorithm works:
 * - Start: result = 0
 * - Read 1: result = 0 * 2 + 1 = 1
 * - Read 0: result = 1 * 2 + 0 = 2
 * - Read 1: result = 2 * 2 + 1 = 5
 * - Read 1: result = 5 * 2 + 1 = 11 ✓
 *
 * Visual Example:
 * List: [1] → [0] → [1] → [1] → null (represents binary 1011)
 *
 * Step 1: num=0, read 1 → num = 0*2 + 1 = 1
 * Step 2: num=1, read 0 → num = 1*2 + 0 = 2
 * Step 3: num=2, read 1 → num = 2*2 + 1 = 5
 * Step 4: num=5, read 1 → num = 5*2 + 1 = 11
 * Result: 11 (decimal)
 *
 * Why this works:
 * - Each multiplication by 2 is equivalent to a left shift in binary
 * - Adding the current bit places it in the least significant position
 * - This builds up the decimal value from most significant to least significant bit
 *
 * Edge Cases:
 * - Empty list: Returns 0
 * - Single bit [0]: Returns 0
 * - Single bit [1]: Returns 1
 * - All zeros [0,0,0]: Returns 0
 * - Large binary numbers: Works up to JavaScript's safe integer limit (2^53 - 1)
 *
 * Constraints:
 * - Assumes each node contains either 0 or 1
 * - Assumes the list represents a valid binary number (most significant bit first)
 * - Does not validate input (assumes valid binary digits)
 *
 * @param list - The singly linked list representing a binary number (0s and 1s)
 * @returns The decimal representation of the binary number
 *
 * @example
 * const list = new SinglyLinkedList<number>(1);
 * list.push(0).push(1).push(1);
 * const decimal = binaryToDecimal(list);
 * console.log(decimal); // 11 (binary 1011 = decimal 11)
 *
 * @example
 * const list = new SinglyLinkedList<number>(1);
 * list.push(0).push(0).push(0);
 * const decimal = binaryToDecimal(list);
 * console.log(decimal); // 8 (binary 1000 = decimal 8)
 *
 * @example
 * const list = new SinglyLinkedList<number>(0);
 * const decimal = binaryToDecimal(list);
 * console.log(decimal); // 0
 */
export function binaryToDecimal(list: SinglyLinkedList<number>): number {
	// Handle empty list
	if (!list.head) return 0;

	let num = 0;
	let temp: Node<number> | null = list.head;

	// Traverse the list and build decimal value
	while (temp) {
		num = num * 2 + temp.value;
		temp = temp.next;
	}

	return num;
}

/**
 * Partitions a linked list around a value x, such that all nodes with values less than x
 * come before nodes with values greater than or equal to x
 * Time Complexity: O(n) - Traverses the list once
 * Space Complexity: O(1) - Only uses a constant number of pointers (no new nodes created)
 *
 * Algorithm: Two-Pointer Partition (Stable Partition)
 * 1. Create two dummy nodes to start two separate lists:
 *    - One for values less than x (lessHead)
 *    - One for values greater than or equal to x (greaterHead)
 * 2. Traverse the original list and append each node to the appropriate list
 * 3. Connect the end of the "less" list to the start of the "greater" list
 * 4. Update the original list's head and tail pointers
 * 5. Properly terminate the greater list to avoid cycles
 *
 * Visual Example (partition around x=3):
 * Original: [3] → [5] → [8] → [5] → [10] → [2] → [1] → null
 *
 * Step 1: Initialize dummy nodes
 *   lessHead → null
 *   greaterHead → null
 *
 * Step 2: Traverse and partition
 *   After processing all nodes:
 *   lessHead → [2] → [1] → null
 *   greaterHead → [3] → [5] → [8] → [5] → [10] → null
 *
 * Step 3: Connect lists
 *   Result: [2] → [1] → [3] → [5] → [8] → [5] → [10] → null
 *
 * Key Points:
 * - Maintains relative order within each partition (stable partition)
 * - Nodes with value equal to x go to the "greater or equal" partition
 * - Original nodes are reused (no new node creation)
 *
 * Edge Cases:
 * - Empty list: Returns empty list
 * - Single element: Returns the same list
 * - All values less than x: Returns the same list
 * - All values greater than or equal to x: Returns the same list
 * - x not in list: Still partitions correctly based on value comparison
 *
 * Important Implementation Note:
 * - Must set prevGreater.next = null to avoid creating a cycle
 * - Must update both head and tail pointers correctly
 * - Must update the length property if nodes were added/removed
 *
 * @param list - The singly linked list to partition
 * @param x - The partition value
 * @returns The partitioned list (modifies in-place and returns the same list instance)
 *
 * @example
 * const list = new SinglyLinkedList<number>(3);
 * list.push(5).push(8).push(5).push(10).push(2).push(1);
 * partitionList(list, 5);
 * console.log(list.peek()); // [3, 2, 1, 5, 8, 5, 10] - all values < 5 come before values >= 5
 *
 * @example
 * const list = new SinglyLinkedList<number>(1);
 * list.push(4).push(3).push(2).push(5).push(2);
 * partitionList(list, 3);
 * console.log(list.peek()); // [1, 2, 2, 4, 3, 5] - maintains relative order within partitions
 */
export function partitionList(
	list: SinglyLinkedList<number>,
	x: number,
): SinglyLinkedList<number> {
	// Handle empty list
	if (!list.head) return list;

	// Create dummy nodes for two partitions
	const dummyLess = new SinglyLinkedList<number>(0);
	const dummyGreater = new SinglyLinkedList<number>(0);

	// Pointers to build the two lists
	let prevLess = dummyLess.head!;
	let prevGreater = dummyGreater.head!;

	// Traverse the original list
	let current: Node<number> | null = list.head;

	while (current) {
		const next: Node<number> | null = current.next; // Save next pointer before modifying

		if (current.value < x) {
			// Add to "less than x" partition
			prevLess.next = current;
			prevLess = prevLess.next;
		} else {
			// Add to "greater or equal to x" partition
			prevGreater.next = current;
			prevGreater = prevGreater.next;
		}

		current = next;
	}

	// CRITICAL: Terminate the greater list to avoid cycles
	prevGreater.next = null;

	// Connect the two partitions: less → greater
	prevLess.next = dummyGreater.head!.next;

	// Update the list's head (skip dummy node)
	list.head = dummyLess.head!.next;

	// Update the tail pointer
	// Tail is either the last node of greater list (if it has nodes) or last node of less list
	if (dummyGreater.head!.next) {
		list.tail = prevGreater;
	} else {
		list.tail = prevLess;
	}

	return list;
}

/**
 * Reverses a portion of a linked list between positions left and right (inclusive)
 * Time Complexity: O(n) - Traverses the list once
 * Space Complexity: O(1) - Only uses a constant number of pointers
 *
 * Algorithm: Three-Phase Approach
 * 1. Navigate to the node before the left position
 * 2. Reverse the sublist from left to right
 * 3. Reconnect the reversed portion with the rest of the list
 *
 * Visual Example (reverseBetween at positions 2 to 4):
 * Original: [1] → [2] → [3] → [4] → [5] → null
 *            ↑     ↑           ↑     ↑
 *          head  left        right  after
 *
 * Step 1: Navigate to position before left (position 1)
 *   beforeLeft = [1]
 *   leftNode = [2]
 *
 * Step 2: Reverse nodes from position 2 to 4
 *   Process: [2] ← [3] ← [4]
 *
 * Step 3: Reconnect
 *   [1] → [4] → [3] → [2] → [5] → null
 *
 * Detailed Reversal Process:
 * Start: prev=null, current=[2]
 *
 * Iteration 1: Reverse [2]
 *   [2].next = null, prev=[2], current=[3]
 *
 * Iteration 2: Reverse [3]
 *   [3].next = [2], prev=[3], current=[4]
 *
 * Iteration 3: Reverse [4]
 *   [4].next = [3], prev=[4], current=[5]
 *
 * Final connections:
 *   beforeLeft.next = [4] (new start of reversed section)
 *   leftNode.next = [5] (connect end of reversed section to rest)
 *
 * Edge Cases:
 * - left = right: No reversal needed (single node)
 * - left = 1: Reversing from the head
 * - right = list.length: Reversing to the tail
 * - left = 1, right = list.length: Reverse entire list
 *
 * Position Indexing:
 * - Positions are 1-indexed (first node is position 1)
 * - left and right are inclusive
 * - Assumes 1 <= left <= right <= list.length
 *
 * @param list - The singly linked list to modify
 * @param left - The starting position for reversal (1-indexed, inclusive)
 * @param right - The ending position for reversal (1-indexed, inclusive)
 * @returns The modified list with the specified portion reversed
 *
 * @example
 * const list = new SinglyLinkedList<number>(1);
 * list.push(2).push(3).push(4).push(5);
 * reverseBetween(list, 2, 4);
 * console.log(list.peek()); // [1, 4, 3, 2, 5]
 *
 * @example
 * const list = new SinglyLinkedList<number>(1);
 * list.push(2).push(3).push(4).push(5);
 * reverseBetween(list, 1, 5);
 * console.log(list.peek()); // [5, 4, 3, 2, 1] - entire list reversed
 *
 * @example
 * const list = new SinglyLinkedList<number>(1);
 * list.push(2).push(3);
 * reverseBetween(list, 1, 2);
 * console.log(list.peek()); // [2, 1, 3]
 */
export function reverseBetween<T>(
	list: SinglyLinkedList<T>,
	left: number,
	right: number,
): SinglyLinkedList<T> {
	// Handle edge cases
	if (!list.head || left === right) return list;

	// Create a dummy node to handle the case when left = 1
	const dummy = { next: list.head } as Node<T>;
	let beforeLeft: Node<T> | typeof dummy = dummy;

	// Phase 1: Navigate to the node before the left position
	for (let i = 1; i < left; i++) {
		beforeLeft = beforeLeft.next!;
	}

	// leftNode will become the last node of the reversed section
	const leftNode = beforeLeft.next!;

	// Phase 2: Reverse the sublist from left to right
	let prev: Node<T> | null = null;
	let current: Node<T> | null = leftNode;

	// Reverse nodes from position left to right (inclusive)
	for (let i = 0; i <= right - left; i++) {
		const next: Node<T> | null = current!.next;
		current!.next = prev;
		prev = current;
		current = next;
	}

	// Phase 3: Reconnect the reversed portion
	// prev now points to the new start of the reversed section (rightNode)
	// current points to the node after right position
	beforeLeft.next = prev;
	leftNode.next = current;

	// Update head if we reversed from position 1
	if (left === 1) {
		list.head = dummy.next;
	}

	// Update tail if we reversed to the end
	if (!current) {
		list.tail = leftNode;
	}

	return list;
}

/**
 * LeetCode Problem: Merge Two Sorted Lists
 *
 * Problem: Merge two sorted linked lists and return as a new sorted list.
 * The new list should be made by splicing together the nodes of the lists.
 *
 * Algorithm:
 * 1. Create dummy node to build result list
 * 2. Use two pointers to traverse both lists
 * 3. Compare values and append smaller to result
 * 4. Handle remaining nodes from either list
 * 5. Return merged list
 *
 * Time Complexity: O(n + m) where n, m are lengths of lists
 * Space Complexity: O(1) - only creating new list structure
 *
 * @param list1 - First sorted linked list
 * @param list2 - Second sorted linked list
 * @returns New sorted linked list containing all nodes
 *
 * @example
 * const list1 = new SinglyLinkedList<number>();
 * list1.push(1).push(3).push(5);
 * const list2 = new SinglyLinkedList<number>();
 * list2.push(2).push(4).push(6);
 * const merged = mergeTwoSortedLists(list1, list2);
 * // merged contains: 1 -> 2 -> 3 -> 4 -> 5 -> 6
 */
export function mergeTwoSortedLists<T>(
	list1: SinglyLinkedList<T>,
	list2: SinglyLinkedList<T>,
): SinglyLinkedList<T> {
	const result = new SinglyLinkedList<T>();

	let current1 = list1.head;
	let current2 = list2.head;

	// Merge while both lists have nodes
	while (current1 && current2) {
		if ((current1.value as any) <= (current2.value as any)) {
			result.push(current1.value);
			current1 = current1.next;
		} else {
			result.push(current2.value);
			current2 = current2.next;
		}
	}

	// Add remaining nodes from list1
	while (current1) {
		result.push(current1.value);
		current1 = current1.next;
	}

	// Add remaining nodes from list2
	while (current2) {
		result.push(current2.value);
		current2 = current2.next;
	}

	return result;
}

/**
 * Adds two numbers represented by linked lists.
 * Digits are stored in reverse order (ones place first).
 *
 * @param l1 - Head of the first linked list (Node<number>)
 * @param l2 - Head of the second linked list (Node<number>)
 * @returns Head of the resulting linked list
 */
export function addTwoNumbers(
	l1: Node<number> | null,
	l2: Node<number> | null,
): Node<number> | null {
	// Dummy head node to simplify list construction
	const resultHead = new Node<number>(0);

	// Pointer used to build the result list
	let current = resultHead;

	// Carry from previous digit addition (0 or 1)
	let carry = 0;

	let temp1 = l1;
	let temp2 = l2;

	// Continue while there are digits left in either list
	while (temp1 || temp2) {
		// Use 0 if one list is shorter
		const val1 = temp1 ? temp1.value : 0;
		const val2 = temp2 ? temp2.value : 0;

		// Add digits plus carry
		const sum = val1 + val2 + carry;

		// Current digit is the last digit of sum
		const digit = sum % 10;

		// Carry is everything beyond the last digit
		carry = Math.floor(sum / 10);

		// Append the digit to the result list
		current.next = new Node<number>(digit);
		current = current.next;

		// Move input pointers forward
		if (temp1) temp1 = temp1.next;
		if (temp2) temp2 = temp2.next;
	}

	// If a carry remains, append it
	if (carry) {
		current.next = new Node<number>(carry);
	}

	// Return the real head (skip dummy node)
	return resultHead.next;
}
