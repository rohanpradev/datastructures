/**
 * Represents a binary tree node.
 */
class TreeNode<T> {
	/** Value stored in the node */
	public value: T;

	/** Left child node */
	public left: TreeNode<T> | null = null;

	/** Right child node */
	public right: TreeNode<T> | null = null;

	/**
	 * Creates a tree node.
	 * @param value - The value to store in the node.
	 */
	constructor(value: T) {
		this.value = value;
	}
}

/**
 * Represents a binary tree that inserts nodes
 * in level-order (breadth-first).
 */
class BinaryTree {
	/** Root node of the tree */
	public root: TreeNode<number> | null = null;

	/**
	 * Creates a binary tree.
	 * @param value - Optional initial root value.
	 */
	constructor(value?: number) {
		if (value !== undefined) {
			this.root = new TreeNode(value);
		}
	}

	/**
	 * Inserts a value into the tree using level-order traversal.
	 * Time Complexity: O(n)
	 *
	 * @param value - The number to insert.
	 */
	insert(value: number): void {
		const newNode = new TreeNode(value);

		if (!this.root) {
			this.root = newNode;
			return;
		}

		const queue: TreeNode<number>[] = [this.root];
		let pointer = 0;

		while (pointer < queue.length) {
			const current = queue[pointer++];

			if (!current.left) {
				current.left = newNode;
				return;
			}
			queue.push(current.left);

			if (!current.right) {
				current.right = newNode;
				return;
			}
			queue.push(current.right);
		}
	}

	/**
	 * Performs level-order traversal (Breadth-First Search).
	 *
	 * @returns A 2D array where each inner array
	 * represents one level of the tree.
	 *
	 * Example:
	 * ```
	 *      1
	 *     / \
	 *    2   3
	 *
	 * Returns: [[1], [2, 3]]
	 * ```
	 *
	 * Time Complexity: O(n)
	 * Space Complexity: O(n)
	 */
	levelOrder(): number[][] {
		if (!this.root) return [];

		const result: number[][] = [];
		const queue: TreeNode<number>[] = [this.root];
		let pointer = 0;

		while (pointer < queue.length) {
			const levelSize = queue.length - pointer;
			const level: number[] = [];

			for (let i = 0; i < levelSize; i++) {
				const current = queue[pointer++];
				level.push(current.value);

				if (current.left) queue.push(current.left);
				if (current.right) queue.push(current.right);
			}

			result.push(level);
		}

		return result;
	}
}

export default BinaryTree;
