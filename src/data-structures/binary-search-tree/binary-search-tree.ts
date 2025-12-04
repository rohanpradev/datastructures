/**
 * Node class for Binary Search Tree
 * Each node contains a value and pointers to left and right children
 */
class TreeNode<T> {
	value: T;
	left: TreeNode<T> | null;
	right: TreeNode<T> | null;

	constructor(value: T) {
		this.value = value;
		this.left = null;
		this.right = null;
	}
}

/**
 * Binary Search Tree (BST) Data Structure
 * A hierarchical data structure where each node has at most two children
 * Left subtree contains values less than the node, right subtree contains values greater
 *
 * Key Properties:
 * - Left child < Parent < Right child
 * - No duplicate values (in this implementation)
 * - Efficient search, insert, and delete operations (when balanced)
 * - In-order traversal produces sorted sequence
 *
 * Common Use Cases:
 * - Maintaining sorted data with fast insertions/deletions
 * - Database indexing
 * - File system directories
 * - Expression parsing (syntax trees)
 * - Priority queues (when balanced)
 * - Auto-complete and search suggestions
 *
 * Time Complexities (Average/Worst):
 * - insert(): O(log n) / O(n) when unbalanced
 * - search(): O(log n) / O(n) when unbalanced
 * - delete(): O(log n) / O(n) when unbalanced
 * - traversals: O(n)
 *
 * Visual Structure:
 * ```
 *       50
 *      /  \
 *    30    70
 *   /  \   /  \
 *  20  40 60  80
 * ```
 */
class BinarySearchTree<T = number> {
	root: TreeNode<T> | null;
	length: number;
	private compareFn: (a: T, b: T) => number;

	/**
	 * Creates a new Binary Search Tree, optionally with an initial value
	 * Time Complexity: O(1)
	 *
	 * @param value - Optional initial value for the root node
	 * @param compareFn - Optional comparison function for custom types (default works for numbers)
	 *
	 * @example
	 * const bst = new BinarySearchTree<number>();
	 * // Creates empty tree: root → null
	 *
	 * @example
	 * const bst = new BinarySearchTree<number>(50);
	 * // Creates: root → [50]
	 *
	 * @example
	 * // Custom comparison for objects
	 * const bst = new BinarySearchTree<{id: number}>((a, b) => a.id - b.id);
	 */
	constructor(value?: T, compareFn?: (a: T, b: T) => number) {
		// Default comparison function
		if (!compareFn) {
			this.compareFn = (a: T, b: T) => {
				if (a < b) return -1;
				if (a > b) return 1;
				return 0;
			};
		} else {
			this.compareFn = compareFn;
		}

		if (value !== undefined) {
			this.root = new TreeNode(value);
			this.length = 1;
		} else {
			this.root = null;
			this.length = 0;
		}
	}

	/**
	 * Inserts a new value into the BST
	 * Time Complexity: O(log n) average, O(n) worst case (unbalanced)
	 * Space Complexity: O(log n) for recursion stack
	 *
	 * Algorithm:
	 * 1. If tree is empty, create root node
	 * 2. Start from root and compare value
	 * 3. If value < current node, go left; if value > current node, go right
	 * 4. Repeat until finding an empty spot
	 * 5. Insert new node at that position
	 *
	 * Visual Example:
	 * ```
	 * Insert 25 into:
	 *     50
	 *    /  \
	 *   30   70
	 *  /
	 * 20
	 *
	 * After insert(25):
	 *     50
	 *    /  \
	 *   30   70
	 *  /
	 * 20
	 *   \
	 *    25
	 * ```
	 *
	 * @param value - The value to insert
	 * @returns The BST instance for method chaining
	 *
	 * @example
	 * const bst = new BinarySearchTree<number>(50);
	 * bst.insert(30).insert(70).insert(20);
	 */
	insert(value: T): BinarySearchTree<T> {
		const newNode = new TreeNode(value);

		// If tree is empty, set root
		if (!this.root) {
			this.root = newNode;
			this.length++;
			return this;
		}

		// Helper function for recursive insertion
		const insertNode = (node: TreeNode<T>): void => {
			const comparison = this.compareFn(value, node.value);

			if (comparison < 0) {
				// Go left
				if (!node.left) {
					node.left = newNode;
					this.length++;
				} else {
					insertNode(node.left);
				}
			} else if (comparison > 0) {
				// Go right
				if (!node.right) {
					node.right = newNode;
					this.length++;
				} else {
					insertNode(node.right);
				}
			}
			// If equal, don't insert (no duplicates)
		};

		insertNode(this.root);
		return this;
	}

	/**
	 * Searches for a value in the BST
	 * Time Complexity: O(log n) average, O(n) worst case (unbalanced)
	 * Space Complexity: O(1) iterative approach
	 *
	 * Algorithm:
	 * 1. Start from root
	 * 2. Compare target with current node
	 * 3. If equal, return true
	 * 4. If less, search left subtree
	 * 5. If greater, search right subtree
	 * 6. If reach null, value not found
	 *
	 * Visual Example:
	 * ```
	 * Search for 25:
	 *     50 (25 < 50, go left)
	 *    /  \
	 *   30   70 (25 < 30, go left)
	 *  /
	 * 20 (25 > 20, go right)
	 *   \
	 *    25 ✓ Found!
	 * ```
	 *
	 * @param value - The value to search for
	 * @returns true if value exists, false otherwise
	 *
	 * @example
	 * const bst = new BinarySearchTree<number>(50);
	 * bst.insert(30).insert(70);
	 * bst.search(30); // true
	 * bst.search(100); // false
	 */
	search(value: T): boolean {
		let current = this.root;

		while (current) {
			const comparison = this.compareFn(value, current.value);

			if (comparison === 0) {
				return true;
			}

			current = comparison < 0 ? current.left : current.right;
		}

		return false;
	}

	/**
	 * Deletes a value from the BST
	 * Time Complexity: O(log n) average, O(n) worst case (unbalanced)
	 * Space Complexity: O(log n) for recursion stack
	 *
	 * Algorithm (3 cases):
	 * 1. Node has no children: Simply remove it
	 * 2. Node has one child: Replace node with its child
	 * 3. Node has two children: Replace with inorder successor (smallest in right subtree)
	 *
	 * Visual Example:
	 * ```
	 * Delete 30 (has two children):
	 *     50              50
	 *    /  \            /  \
	 *   30   70   →    40   70
	 *  /  \            /
	 * 20  40         20
	 *
	 * Replace 30 with inorder successor (40)
	 * ```
	 *
	 * @param value - The value to delete
	 * @returns true if deleted, false if not found
	 *
	 * @example
	 * const bst = new BinarySearchTree<number>(50);
	 * bst.insert(30).insert(70).insert(20);
	 * bst.delete(30); // true, node deleted
	 * bst.delete(100); // false, not found
	 */
	delete(value: T): boolean {
		let deleted = false;

		const deleteNode = (
			node: TreeNode<T> | null,
			value: T,
		): TreeNode<T> | null => {
			if (!node) return null;

			const comparison = this.compareFn(value, node.value);

			if (comparison < 0) {
				node.left = deleteNode(node.left, value);
			} else if (comparison > 0) {
				node.right = deleteNode(node.right, value);
			} else {
				// Node found, delete it
				if (!deleted) {
					deleted = true;
					this.length--;
				}

				// Case 1: No children (leaf node)
				if (!node.left && !node.right) {
					return null;
				}

				// Case 2: One child
				if (!node.left) {
					return node.right;
				}
				if (!node.right) {
					return node.left;
				}

				// Case 3: Two children
				// Find inorder successor (smallest in right subtree)
				let successor = node.right;
				while (successor.left) {
					successor = successor.left;
				}

				// Replace node's value with successor's value
				node.value = successor.value;

				// Delete the successor (don't decrement length again)
				const temp = deleted;
				deleted = true; // Prevent double counting
				node.right = deleteNode(node.right, successor.value);
				deleted = temp;
			}

			return node;
		};

		this.root = deleteNode(this.root, value);
		return deleted;
	}

	/**
	 * Performs in-order traversal (Left → Root → Right)
	 * Returns values in sorted ascending order
	 * Time Complexity: O(n)
	 * Space Complexity: O(n) for result array + O(log n) recursion stack
	 *
	 * Algorithm:
	 * 1. Traverse left subtree
	 * 2. Visit root
	 * 3. Traverse right subtree
	 *
	 * Visual Example:
	 * ```
	 *     50
	 *    /  \
	 *   30   70
	 *  /  \
	 * 20  40
	 *
	 * In-order: [20, 30, 40, 50, 70]
	 * ```
	 *
	 * @returns Array of values in sorted order
	 */
	inorderTraversal(): T[] {
		const result: T[] = [];

		const traverse = (node: TreeNode<T> | null): void => {
			if (!node) return;

			traverse(node.left); // Left
			result.push(node.value); // Root
			traverse(node.right); // Right
		};

		traverse(this.root);
		return result;
	}

	/**
	 * Performs pre-order traversal (Root → Left → Right)
	 * Useful for creating a copy of the tree
	 * Time Complexity: O(n)
	 * Space Complexity: O(n) for result array + O(log n) recursion stack
	 *
	 * Visual Example:
	 * ```
	 *     50
	 *    /  \
	 *   30   70
	 *  /  \
	 * 20  40
	 *
	 * Pre-order: [50, 30, 20, 40, 70]
	 * ```
	 *
	 * @returns Array of values in pre-order
	 */
	preorderTraversal(): T[] {
		const result: T[] = [];

		const traverse = (node: TreeNode<T> | null): void => {
			if (!node) return;

			result.push(node.value); // Root
			traverse(node.left); // Left
			traverse(node.right); // Right
		};

		traverse(this.root);
		return result;
	}

	/**
	 * Performs post-order traversal (Left → Right → Root)
	 * Useful for deleting the tree (children first)
	 * Time Complexity: O(n)
	 * Space Complexity: O(n) for result array + O(log n) recursion stack
	 *
	 * Visual Example:
	 * ```
	 *     50
	 *    /  \
	 *   30   70
	 *  /  \
	 * 20  40
	 *
	 * Post-order: [20, 40, 30, 70, 50]
	 * ```
	 *
	 * @returns Array of values in post-order
	 */
	postorderTraversal(): T[] {
		const result: T[] = [];

		const traverse = (node: TreeNode<T> | null): void => {
			if (!node) return;

			traverse(node.left); // Left
			traverse(node.right); // Right
			result.push(node.value); // Root
		};

		traverse(this.root);
		return result;
	}

	/**
	 * Performs level-order traversal (Breadth-First Search)
	 * Visits nodes level by level from left to right
	 * Time Complexity: O(n)
	 * Space Complexity: O(w) where w is maximum width of tree
	 *
	 * Algorithm:
	 * 1. Use a queue to track nodes to visit
	 * 2. Start with root
	 * 3. For each node, add its children to queue
	 * 4. Process nodes in FIFO order
	 *
	 * Visual Example:
	 * ```
	 *     50
	 *    /  \
	 *   30   70
	 *  /  \
	 * 20  40
	 *
	 * Level-order: [50, 30, 70, 20, 40]
	 * Level 0: [50]
	 * Level 1: [30, 70]
	 * Level 2: [20, 40]
	 * ```
	 *
	 * @returns Array of values in level-order
	 */
	levelOrderTraversal(): T[] {
		if (!this.root) return [];

		const result: T[] = [];
		const queue: TreeNode<T>[] = [this.root];

		while (queue.length > 0) {
			const node = queue.shift()!;
			result.push(node.value);

			if (node.left) queue.push(node.left);
			if (node.right) queue.push(node.right);
		}

		return result;
	}

	/**
	 * Finds the minimum value in the BST
	 * Time Complexity: O(log n) average, O(n) worst case
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * Keep going left until reaching the leftmost node
	 *
	 * @returns The minimum value, or undefined if tree is empty
	 */
	findMin(): T | undefined {
		if (!this.root) return undefined;

		let current = this.root;
		while (current.left) {
			current = current.left;
		}
		return current.value;
	}

	/**
	 * Finds the maximum value in the BST
	 * Time Complexity: O(log n) average, O(n) worst case
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * Keep going right until reaching the rightmost node
	 *
	 * @returns The maximum value, or undefined if tree is empty
	 */
	findMax(): T | undefined {
		if (!this.root) return undefined;

		let current = this.root;
		while (current.right) {
			current = current.right;
		}
		return current.value;
	}

	/**
	 * Calculates the height of the tree
	 * Height = number of edges on longest path from root to leaf
	 * Time Complexity: O(n)
	 * Space Complexity: O(log n) for recursion stack
	 *
	 * @returns Height of tree, -1 for empty tree
	 */
	height(): number {
		const calculateHeight = (node: TreeNode<T> | null): number => {
			if (!node) return -1;

			const leftHeight = calculateHeight(node.left);
			const rightHeight = calculateHeight(node.right);

			return Math.max(leftHeight, rightHeight) + 1;
		};

		return calculateHeight(this.root);
	}

	/**
	 * Checks if the tree is empty
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * @returns true if tree is empty, false otherwise
	 */
	isEmpty(): boolean {
		return this.root === null;
	}

	/**
	 * Returns the number of nodes in the tree
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * @returns The number of nodes
	 */
	size(): number {
		return this.length;
	}

	/**
	 * Removes all nodes from the tree
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * @returns The BST instance for method chaining
	 */
	clear(): BinarySearchTree<T> {
		this.root = null;
		this.length = 0;
		return this;
	}

	/**
	 * Recursively searches for a value in the BST
	 * Time Complexity: O(log n) average, O(n) worst case
	 *
	 * @param value - Value to search for
	 * @returns True if found, false otherwise
	 */
	rContains(value: T): boolean {
		return this.rContainsHelper(this.root, value);
	}

	private rContainsHelper(node: TreeNode<T> | null, value: T): boolean {
		if (!node) return false;

		const cmp = this.compareFn(value, node.value);
		if (cmp === 0) return true;
		if (cmp < 0) return this.rContainsHelper(node.left, value);
		return this.rContainsHelper(node.right, value);
	}

	/**
	 * Recursively inserts a value into the BST
	 * Time Complexity: O(log n) average, O(n) worst case
	 *
	 * @param value - Value to insert
	 * @returns The BST instance for method chaining
	 */
	rInsert(value: T): BinarySearchTree<T> {
		this.root = this.rInsertHelper(this.root, value);
		return this;
	}

	private rInsertHelper(node: TreeNode<T> | null, value: T): TreeNode<T> {
		// Base case: found the position
		if (!node) {
			this.length++;
			return new TreeNode(value);
		}

		const cmp = this.compareFn(value, node.value);

		// Insert left or right
		if (cmp < 0) {
			node.left = this.rInsertHelper(node.left, value);
		} else if (cmp > 0) {
			node.right = this.rInsertHelper(node.right, value);
		}
		// If equal, don't insert duplicate

		return node;
	}

	/**
	 * Recursively deletes a value from the BST
	 * Time Complexity: O(log n) average, O(n) worst case
	 *
	 * @param value - Value to delete
	 * @returns The BST instance for method chaining
	 */
	rDelete(value: T): BinarySearchTree<T> {
		this.root = this.rDeleteHelper(this.root, value);
		return this;
	}

	private rDeleteHelper(
		node: TreeNode<T> | null,
		value: T,
	): TreeNode<T> | null {
		if (!node) return null;

		const cmp = this.compareFn(value, node.value);

		if (cmp < 0) {
			// Value is in left subtree
			node.left = this.rDeleteHelper(node.left, value);
		} else if (cmp > 0) {
			// Value is in right subtree
			node.right = this.rDeleteHelper(node.right, value);
		} else {
			// Found the node to delete
			this.length--;

			// Case 1: Leaf node
			if (!node.left && !node.right) {
				return null;
			}

			// Case 2: One child
			if (!node.left) return node.right;
			if (!node.right) return node.left;

			// Case 3: Two children
			// Find minimum value in right subtree (successor)
			let minNode = node.right;
			while (minNode.left) {
				minNode = minNode.left;
			}
			// Replace current value with successor value
			node.value = minNode.value;
			// Delete the successor node from right subtree
			node.right = this.rDeleteHelper(node.right, minNode.value);
			this.length++; // Compensate for the extra decrement
		}

		return node;
	}

	/**
	 * Recursively finds the minimum value in a subtree
	 * Time Complexity: O(log n) average, O(n) worst case
	 *
	 * @param node - Root of subtree (defaults to tree root)
	 * @returns Minimum value in subtree
	 */
	rFindMin(node: TreeNode<T> | null = this.root): T {
		if (!node) throw new Error("Cannot find minimum of empty tree");

		if (!node.left) return node.value;
		return this.rFindMin(node.left);
	}

	/**
	 * Recursively finds the maximum value in a subtree
	 * Time Complexity: O(log n) average, O(n) worst case
	 *
	 * @param node - Root of subtree (defaults to tree root)
	 * @returns Maximum value in subtree
	 */
	rFindMax(node: TreeNode<T> | null = this.root): T {
		if (!node) throw new Error("Cannot find maximum of empty tree");

		if (!node.right) return node.value;
		return this.rFindMax(node.right);
	}
}

export { TreeNode, BinarySearchTree };
