/**
 * Represents a single node in a Trie.
 *
 * Each node:
 * - Stores children nodes mapped by character
 * - Tracks whether it represents the end of a complete word
 */
class TrieNode {
	/**
	 * Map of character → child TrieNode
	 *
	 * We use Map instead of a plain object for:
	 * - Better performance
	 * - Clear intent
	 * - No prototype inheritance issues
	 */
	public readonly children: Map<string, TrieNode>;

	/**
	 * Indicates whether this node marks the end of a valid word.
	 */
	public isEndOfWord: boolean;

	constructor() {
		this.children = new Map();
		this.isEndOfWord = false;
	}
}

/**
 * Trie (Prefix Tree) data structure.
 *
 * Supports:
 * - insert(word)
 * - search(word)
 * - startsWith(prefix)
 * - delete(word)
 * - getAllWords()
 */
export class Trie {
	/** Root node of the Trie. The root does not store any character. */
	private readonly root: TrieNode;

	constructor() {
		this.root = new TrieNode();
	}

	/**
	 * Inserts a word into the Trie.
	 *
	 * Time Complexity: O(n)
	 * Space Complexity: O(n)
	 *
	 * @param word - The word to insert
	 */
	public insert(word: string): void {
		if (!word) return;

		let currentNode = this.root;

		for (const char of word) {
			if (!currentNode.children.has(char)) {
				currentNode.children.set(char, new TrieNode());
			}
			currentNode = currentNode.children.get(char)!;
		}

		currentNode.isEndOfWord = true;
	}

	/**
	 * Searches for a complete word in the Trie.
	 *
	 * Time Complexity: O(n)
	 *
	 * @param word - The word to search
	 * @returns true if word exists, false otherwise
	 */
	public search(word: string): boolean {
		const node = this.findNode(word);
		return !!node && node.isEndOfWord;
	}

	/**
	 * Checks if any word in the Trie starts with the given prefix.
	 *
	 * Time Complexity: O(n)
	 *
	 * @param prefix - The prefix to search
	 * @returns true if prefix exists
	 */
	public startsWith(prefix: string): boolean {
		return !!this.findNode(prefix);
	}

	/**
	 * Deletes a word from the Trie.
	 *
	 * Returns true if the word existed and was removed/unmarked.
	 * Iterative backtracking keeps long words independent of call-stack limits.
	 * Time Complexity: O(n); auxiliary space: O(n) for the word's path.
	 *
	 * @param word - The word to delete
	 * @returns true if word was deleted
	 */
	public delete(word: string): boolean {
		if (!word) return false;

		const path: Array<[parent: TrieNode, char: string]> = [];
		let node = this.root;
		// Match the Unicode code-point iteration used by insert and findNode.
		for (const char of word) {
			const child = node.children.get(char);
			if (!child) return false;
			path.push([node, char]);
			node = child;
		}
		if (!node.isEndOfWord) return false;
		node.isEndOfWord = false;

		for (let index = path.length - 1; index >= 0; index--) {
			// A surviving word or branch still owns this prefix.
			if (node.isEndOfWord || node.children.size > 0) break;
			const [parent, char] = path[index]!;
			parent.children.delete(char);
			node = parent;
		}
		return true;
	}

	/**
	 * Returns all words stored in the Trie.
	 *
	 * Time Complexity: O(nodes + output characters); auxiliary space: O(height),
	 * excluding results. Child insertion order is preserved without recursion.
	 */
	public getAllWords(): string[] {
		const results: string[] = [];
		const characters: string[] = [];
		const stack = [this.root.children.entries()];
		while (stack.length > 0) {
			const next = stack[stack.length - 1]!.next();
			if (next.done) {
				stack.pop();
				characters.pop();
				continue;
			}
			const [char, node] = next.value;
			characters.push(char);
			if (node.isEndOfWord) results.push(characters.join(""));
			stack.push(node.children.entries());
		}
		return results;
	}

	/**
	 * Finds a node corresponding to a word or prefix.
	 *
	 * @param str - Word or prefix
	 * @returns The last node if found, otherwise null
	 */
	private findNode(str: string): TrieNode | null {
		if (!str) return null;

		let currentNode = this.root;
		for (const char of str) {
			const nextNode = currentNode.children.get(char);
			if (!nextNode) return null;
			currentNode = nextNode;
		}
		return currentNode;
	}
}
