import {
	DoublyLinkedList,
	Node,
} from "@/data-structures/doubly-linked-list/doubly-linked-list";

/**
 * Checks if a doubly linked list is a palindrome
 * Time Complexity: O(n/2) = O(n) where n is the length of the list
 * Space Complexity: O(1) - no extra space used, only two pointers
 *
 * Algorithm:
 * 1. Handle edge cases: null, single node, or empty list
 * 2. Initialize two pointers: leftPointer at head, rightPointer at tail
 * 3. Move pointers toward each other, comparing values
 * 4. If any values don't match, return false
 * 5. Stop when pointers meet or cross (leftPointer === rightPointer or they pass each other)
 * 6. If all values match, return true
 *
 * Visual Example (palindrome):
 * ```
 * Input:  null ← [1] ⇄ [2] ⇄ [3] ⇄ [2] ⇄ [1] → null
 *                 ↑                         ↑
 *           leftPointer               rightPointer
 *
 * Step 1: Compare 1 === 1 ✓, move pointers
 *         null ← [1] ⇄ [2] ⇄ [3] ⇄ [2] ⇄ [1] → null
 *                      ↑              ↑
 *                leftPointer    rightPointer
 *
 * Step 2: Compare 2 === 2 ✓, move pointers
 *         null ← [1] ⇄ [2] ⇄ [3] ⇄ [2] ⇄ [1] → null
 *                           ↑
 *                    both pointers at 3
 *
 * Step 3: Pointers met, all values matched → return true
 * ```
 *
 * Visual Example (not palindrome):
 * ```
 * Input:  null ← [1] ⇄ [2] ⇄ [3] ⇄ [4] → null
 *                 ↑                   ↑
 *           leftPointer         rightPointer
 *
 * Step 1: Compare 1 !== 4 ✗ → return false immediately
 * ```
 *
 * Key Optimizations:
 * - Uses bidirectional traversal (advantage of doubly linked list)
 * - Only needs to traverse half the list
 * - Early termination when mismatch found
 * - No extra space required (in-place comparison)
 *
 * Edge Cases:
 * - Empty list (length = 0): Returns true (empty is palindrome)
 * - Single node: Returns true (single element is palindrome)
 * - Two nodes with same value: Returns true
 * - Two nodes with different values: Returns false
 * - Odd length list: Middle element doesn't need comparison
 * - Even length list: All elements compared
 *
 * Why Check leftPointer !== rightPointer.prev:
 * - Prevents checking the same node twice in even-length lists
 * - For odd-length lists, stops when leftPointer === rightPointer
 * - For even-length lists, stops when pointers cross
 *
 * @param list - The doubly linked list to check
 * @returns true if the list is a palindrome, false otherwise
 *
 * @example
 * const list1 = new DoublyLinkedListNode<number>(1);
 * list1.push(2).push(3).push(2).push(1);
 * palindromeChecker(list1); // true
 *
 * @example
 * const list2 = new DoublyLinkedListNode<number>(1);
 * list2.push(2).push(3).push(4);
 * palindromeChecker(list2); // false
 *
 * @example
 * const list3 = new DoublyLinkedListNode<number>(5);
 * palindromeChecker(list3); // true (single node)
 */
function palindromeChecker(list: DoublyLinkedList<number>): boolean {
	// Handle empty list (considered palindrome)
	if (!list.head || !list.tail) {
		return true;
	}

	// Handle single node (always palindrome)
	if (list.head === list.tail) {
		return true;
	}

	// Initialize pointers at both ends
	let leftPointer = list.head;
	let rightPointer = list.tail;

	// Move pointers toward each other, comparing values
	// Stop when pointers meet or cross
	while (leftPointer && rightPointer) {
		// Compare values at both ends
		if (leftPointer.value !== rightPointer.value) {
			return false; // Not a palindrome
		}

		// Check if we've compared all necessary pairs
		// Stop if pointers met or if they're about to cross
		if (leftPointer === rightPointer || leftPointer.next === rightPointer) {
			break;
		}

		// Move pointers toward center
		leftPointer = leftPointer.next as typeof leftPointer;
		rightPointer = rightPointer.prev as typeof rightPointer;
	}

	// All values matched
	return true;
}

/**
 * Reverses a doubly linked list by creating a new reversed list
 * Time Complexity: O(n) where n is the length of the list
 * Space Complexity: O(n) - creates a new list with all nodes
 *
 * Algorithm:
 * 1. Handle edge case: return null if list is empty (no tail)
 * 2. Create a new list starting with the tail value (last element becomes first)
 * 3. Traverse backward from tail.prev using the prev pointers
 * 4. Push each node's value to the new list (builds reversed order)
 * 5. Return the new reversed list
 *
 * Visual Example:
 * ```
 * Input:  null ← [1] ⇄ [2] ⇄ [3] ⇄ [4] ⇄ [5] → null
 *                 ↑                         ↑
 *               head                      tail
 *
 * Step 1: Create new list with tail value (5)
 *         New: null ← [5] → null
 *              currentNode = [4]
 *
 * Step 2: Push 4
 *         New: null ← [5] ⇄ [4] → null
 *              currentNode = [3]
 *
 * Step 3: Push 3
 *         New: null ← [5] ⇄ [4] ⇄ [3] → null
 *              currentNode = [2]
 *
 * Step 4: Push 2
 *         New: null ← [5] ⇄ [4] ⇄ [3] ⇄ [2] → null
 *              currentNode = [1]
 *
 * Step 5: Push 1
 *         New: null ← [5] ⇄ [4] ⇄ [3] ⇄ [2] ⇄ [1] → null
 *              currentNode = null (stop)
 *
 * Output: null ← [5] ⇄ [4] ⇄ [3] ⇄ [2] ⇄ [1] → null
 *                 ↑                         ↑
 *               head                      tail
 * ```
 *
 * Key Operations:
 * - Leverages doubly linked list's backward traversal capability
 * - Uses prev pointers to traverse from tail to head
 * - Creates new list (non-destructive, original list unchanged)
 * - Each push operation is O(1), total O(n)
 *
 * Advantages of This Approach:
 * - Original list remains unchanged (non-destructive)
 * - Clean and simple implementation
 * - Easy to understand and maintain
 * - Takes advantage of doubly linked list's bidirectional nature
 *
 * Alternative Approach (In-Place Reversal):
 * - Could swap next/prev pointers in each node
 * - Would be O(n) time, O(1) space
 * - More complex but memory efficient
 * - Destructive (modifies original list)
 *
 * Edge Cases:
 * - Empty list (no tail): Returns null
 * - Single node list: Creates new list with same single value
 * - Two node list: Returns [tail, head]
 * - Large lists: Works efficiently with any size
 *
 * Why Start with tail.value:
 * - The last element of original list becomes first of reversed list
 * - Constructor requires an initial value
 * - Then we traverse backward and push remaining values
 *
 * Why Use tail.prev Instead of tail:
 * - We already used tail.value to create the new list
 * - Start from second-to-last node
 * - Prevents duplicating the tail value
 *
 * @param list - The doubly linked list to reverse
 * @returns A new reversed doubly linked list, or null if input list is empty
 *
 * @example
 * const list1 = new DoublyLinkedList<number>(1);
 * list1.push(2).push(3).push(4).push(5);
 * const reversed = reverseList(list1);
 * // reversed: [5, 4, 3, 2, 1]
 * // original list1: [1, 2, 3, 4, 5] (unchanged)
 *
 * @example
 * const list2 = new DoublyLinkedList<number>(10);
 * const reversed = reverseList(list2);
 * // reversed: [10] (single element)
 *
 * @example
 * const list3 = new DoublyLinkedList<number>(1);
 * list3.pop(); // Make empty
 * const reversed = reverseList(list3);
 * // reversed: null (empty list)
 */
function reverseList(
	list: DoublyLinkedList<number>,
): DoublyLinkedList<number> | null {
	// Handle empty list - return null if no tail exists
	if (!list.tail) {
		return null;
	}

	// Create new list starting with the last element (tail)
	// This becomes the head of the reversed list
	const reversedList = new DoublyLinkedList<number>(list.tail.value);

	// Start from second-to-last node (tail.prev)
	let currentNode = list.tail.prev;

	// Traverse backward through the original list using prev pointers
	while (currentNode) {
		// Push current value to the new list (builds in reversed order)
		reversedList.push(currentNode.value);

		// Move to previous node
		currentNode = currentNode.prev;
	}

	// Return the new reversed list
	return reversedList;
}

/**
 * Partitions a doubly linked list around a value x
 * Rearranges the list so all nodes with values < x come before nodes with values >= x
 * Time Complexity: O(n) where n is the length of the list
 * Space Complexity: O(1) - in-place modification using dummy nodes
 *
 * Algorithm:
 * 1. Create two dummy nodes to build two separate partitions:
 *    - lessDummy: for nodes with values < x
 *    - greaterDummy: for nodes with values >= x
 * 2. Initialize pointers (lessTail, greaterTail) to track ends of each partition
 * 3. Traverse the original list from head to tail
 * 4. For each node:
 *    a. If value < x, append to "less" partition
 *    b. If value >= x, append to "greater" partition
 * 5. Connect the two partitions: lessTail.next = greaterDummy.next
 * 6. Update list head and tail to the new structure
 * 7. Clean up: set proper prev/next pointers and null terminators
 *
 * Visual Example:
 * ```
 * Input: 3 <-> 8 <-> 5 <-> 10 <-> 2 <-> 1, x = 5
 *
 * Step 1: Initialize dummy nodes
 * lessDummy -> null
 * greaterDummy -> null
 *
 * Step 2: Process 3 (< 5)
 * lessDummy -> 3 -> null
 * greaterDummy -> null
 *
 * Step 3: Process 8 (>= 5)
 * lessDummy -> 3 -> null
 * greaterDummy -> 8 -> null
 *
 * Step 4: Process 5 (>= 5)
 * lessDummy -> 3 -> null
 * greaterDummy -> 8 -> 5 -> null
 *
 * Step 5: Process 10 (>= 5)
 * lessDummy -> 3 -> null
 * greaterDummy -> 8 -> 5 -> 10 -> null
 *
 * Step 6: Process 2 (< 5)
 * lessDummy -> 3 -> 2 -> null
 * greaterDummy -> 8 -> 5 -> 10 -> null
 *
 * Step 7: Process 1 (< 5)
 * lessDummy -> 3 -> 2 -> 1 -> null
 * greaterDummy -> 8 -> 5 -> 10 -> null
 *
 * Step 8: Connect partitions
 * lessDummy -> 3 <-> 2 <-> 1 <-> 8 <-> 5 <-> 10 -> null
 *
 * Output: 3 <-> 2 <-> 1 <-> 8 <-> 5 <-> 10
 * ```
 *
 * Key Operations:
 * - Uses dummy nodes to avoid special-casing empty partitions
 * - Maintains relative order within each partition
 * - Properly updates bidirectional pointers (prev and next)
 * - In-place modification (doesn't create new nodes)
 *
 * Why Use Dummy Nodes:
 * - Simplifies edge cases (empty partitions, single element)
 * - No need to check if partition is empty before appending
 * - Easier to get the actual head of each partition (dummy.next)
 * - Cleaner code without special head/tail handling
 *
 * Edge Cases:
 * - Empty list: Returns without modification
 * - Single node: No change needed
 * - All values < x: Only "less" partition populated
 * - All values >= x: Only "greater" partition populated
 * - x larger than all values: All nodes in "less" partition
 * - x smaller than all values: All nodes in "greater" partition
 *
 * Pointer Management:
 * - lessTail tracks last node in "less" partition
 * - greaterTail tracks last node in "greater" partition
 * - Must update both next and prev pointers for doubly linked list
 * - Final tail must have next = null
 * - Final head must have prev = null
 *
 * Why In-Place:
 * - More memory efficient (no new nodes created)
 * - Directly modifies the original list structure
 * - Only rearranges existing node connections
 * - Uses O(1) extra space (just pointers and dummy nodes)
 *
 * @param list - The doubly linked list to partition
 * @param x - The partition value
 * @returns The modified list with nodes partitioned around x
 *
 * @example
 * const list1 = new DoublyLinkedList<number>(3);
 * list1.push(8).push(5).push(10).push(2).push(1);
 * partitionList(list1, 5);
 * // Result: 3 <-> 2 <-> 1 <-> 8 <-> 5 <-> 10
 *
 * @example
 * const list2 = new DoublyLinkedList<number>(1);
 * list2.push(2).push(3);
 * partitionList(list2, 5);
 * // Result: 1 <-> 2 <-> 3 (all values < 5)
 *
 * @example
 * const list3 = new DoublyLinkedList<number>(6);
 * list3.push(7).push(8);
 * partitionList(list3, 5);
 * // Result: 6 <-> 7 <-> 8 (all values >= 5)
 */
function partitionList(
	list: DoublyLinkedList<number>,
	x: number,
): DoublyLinkedList<number> {
	// Handle empty list or single node (no partitioning needed)
	if (!list.head || list.length <= 1) {
		return list;
	}

	// Create dummy nodes to simplify partition building
	// These act as anchors for the two partitions
	const lessDummy = new Node<number>(0); // Dummy for values < x
	const greaterDummy = new Node<number>(0); // Dummy for values >= x

	// Track the tail of each partition for O(1) appends
	let lessTail = lessDummy;
	let greaterTail = greaterDummy;

	// Traverse the entire list
	let currentNode = list.head;

	while (currentNode) {
		// Save next node before modifying pointers
		const nextNode = currentNode.next;

		if (currentNode.value < x) {
			// Add to "less" partition
			lessTail.next = currentNode;
			currentNode.prev = lessTail;
			lessTail = currentNode;
		} else {
			// Add to "greater or equal" partition
			greaterTail.next = currentNode;
			currentNode.prev = greaterTail;
			greaterTail = currentNode;
		}

		// Move to next node
		currentNode = nextNode as typeof currentNode;
	}

	// Connect the two partitions
	// lessTail points to the end of "less" partition
	// greaterDummy.next points to the start of "greater" partition
	lessTail.next = greaterDummy.next;

	// If greater partition exists, update its head's prev pointer
	if (greaterDummy.next) {
		greaterDummy.next.prev = lessTail;
	}

	// Terminate the greater partition's tail
	greaterTail.next = null;

	// Update list head to the first real node (skip lessDummy)
	list.head = lessDummy.next;

	// Update list head's prev pointer to null
	if (list.head) {
		list.head.prev = null;
	}

	// Update list tail to the last real node
	// If greater partition exists, tail is greaterTail
	// Otherwise, tail is lessTail
	list.tail = greaterTail !== greaterDummy ? greaterTail : lessTail;

	// Return the modified list
	return list;
}

/**
 * Swaps every two adjacent nodes in a doubly linked list
 * Advanced challenge focusing on pointer manipulation in doubly linked lists
 * Time Complexity: O(n) where n is the length of the list
 * Space Complexity: O(1) - in-place modification with only a few pointers
 *
 * Algorithm:
 * 1. Handle edge cases: empty list or single node (no swap needed)
 * 2. Initialize pointers: current = head, previous = null
 * 3. For each pair of nodes:
 *    a. Store references to first and second nodes of the pair
 *    b. Store reference to the node after the pair
 *    c. Swap the pair by reversing their connections
 *    d. Update prev pointers for both nodes in the pair
 *    e. Connect previous pair to current swapped pair
 *    f. Update head if swapping the first pair
 *    g. Move to next pair
 * 4. Continue until no more pairs to swap
 *
 * Visual Example:
 * ```
 * Input: 1 <-> 2 <-> 3 <-> 4 <-> 5 <-> 6
 *
 * Step 1: Swap (1, 2)
 * Before: 1 <-> 2 <-> 3 <-> 4 <-> 5 <-> 6
 *         ↑     ↑
 *       first second
 *
 * After: 2 <-> 1 <-> 3 <-> 4 <-> 5 <-> 6
 *        ↑     ↑
 *      head  first
 *
 * Step 2: Swap (3, 4)
 * Before: 2 <-> 1 <-> 3 <-> 4 <-> 5 <-> 6
 *                     ↑     ↑
 *                   first second
 *
 * After: 2 <-> 1 <-> 4 <-> 3 <-> 5 <-> 6
 *
 * Step 3: Swap (5, 6)
 * Before: 2 <-> 1 <-> 4 <-> 3 <-> 5 <-> 6
 *                                 ↑     ↑
 *                               first second
 *
 * After: 2 <-> 1 <-> 4 <-> 3 <-> 6 <-> 5
 *
 * Final Output: 2 <-> 1 <-> 4 <-> 3 <-> 6 <-> 5
 * ```
 *
 * Detailed Pointer Operations for Swapping:
 * ```
 * Given: first <-> second <-> next
 *
 * Step 1: first.next = second.next (first points to next)
 * Step 2: second.next = first (second points back to first)
 * Step 3: first.prev = second (first's prev points to second)
 * Step 4: second.prev = previous (second's prev points to previous node)
 * Step 5: if (next) next.prev = first (update next node's prev)
 * Step 6: if (previous) previous.next = second (connect previous pair)
 * Step 7: if (first was head) head = second (update head)
 * ```
 *
 * Key Challenges:
 * - Managing four pointers simultaneously (first, second, previous, next)
 * - Updating both next AND prev pointers correctly
 * - Handling head update when swapping first pair
 * - Connecting previous pair to current swapped pair
 * - Dealing with odd-length lists (last node remains in place)
 *
 * Why This Is Advanced:
 * - Requires careful tracking of multiple pointers
 * - Must update bidirectional links (prev and next)
 * - Order of operations matters (can lose references)
 * - Easy to create broken links or infinite loops
 * - Edge cases need special handling
 *
 * Edge Cases:
 * - Empty list: No change needed
 * - Single node: No swap needed
 * - Two nodes: Simple swap and done
 * - Odd number of nodes: Last node stays in place
 * - Even number of nodes: All nodes get swapped
 *
 * Common Pitfalls:
 * - Losing reference to next pair before swapping
 * - Forgetting to update prev pointers
 * - Not handling head update for first pair
 * - Breaking the connection between pairs
 * - Infinite loops due to circular references
 *
 * Why Draw It Out:
 * - Visualizing helps track all four pointers
 * - Can see which connections need updating
 * - Easier to verify correctness of each step
 * - Helps understand the sequence of operations
 *
 * Single Traversal Constraint:
 * - Can only go through the list once
 * - Must handle all swaps in one pass
 * - Makes the problem more challenging
 * - Requires careful planning of pointer updates
 *
 * @param list - The doubly linked list to modify
 * @returns The modified list with pairs swapped
 *
 * @example
 * const list1 = new DoublyLinkedList<number>(1);
 * list1.push(2).push(3).push(4);
 * swapPairs(list1);
 * // Result: 2 <-> 1 <-> 4 <-> 3
 *
 * @example
 * const list2 = new DoublyLinkedList<number>(1);
 * list2.push(2).push(3).push(4).push(5);
 * swapPairs(list2);
 * // Result: 2 <-> 1 <-> 4 <-> 3 <-> 5
 *
 * @example
 * const list3 = new DoublyLinkedList<number>(1);
 * swapPairs(list3);
 * // Result: 1 (no swap needed)
 */
function swapPairs(list: DoublyLinkedList<number>): DoublyLinkedList<number> {
	// Handle empty list or single node
	if (!list.head || !list.head.next) {
		return list;
	}

	// Track the node before the current pair
	let previousNode: Node<number> | null = null;

	// Start with the head
	let currentNode: Node<number> | null = list.head;

	// Traverse and swap pairs
	while (currentNode && currentNode.next) {
		// Store references for the current pair
		const firstNode = currentNode; // First node of the pair
		const secondNode = currentNode.next; // Second node of the pair
		const nextPairStart = secondNode.next; // Start of next pair

		// Swap the pair
		// Step 1: first node points to node after the pair
		firstNode.next = nextPairStart;

		// Step 2: second node points back to first node
		secondNode.next = firstNode;

		// Step 3: first node's prev points to second node
		firstNode.prev = secondNode;

		// Step 4: second node's prev points to previous node
		secondNode.prev = previousNode;

		// Step 5: Update next node's prev pointer if it exists
		if (nextPairStart) {
			nextPairStart.prev = firstNode;
		} else {
			// No next pair, so firstNode is now the tail
			list.tail = firstNode;
		}

		// Step 6: Connect previous pair to current swapped pair
		if (previousNode) {
			previousNode.next = secondNode;
		} else {
			// If no previous node, this is the first pair
			// Update head to the second node (which is now first)
			list.head = secondNode;
		}

		// Move to next pair
		// The first node is now the previous node for the next pair
		previousNode = firstNode;
		currentNode = nextPairStart as typeof currentNode;
	}

	// If there's a remaining single node (odd length), it becomes the tail
	if (currentNode) {
		list.tail = currentNode;
	}

	// Return the modified list
	return list;
}

export { palindromeChecker, reverseList, partitionList, swapPairs };
