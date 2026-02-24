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
	 *
	 * @param word - The word to delete
	 * @returns true if word was deleted
	 */
	public delete(word: string): boolean {
		if (!word) return false;

		let wordExisted = false;

		const deleteRecursive = (node: TrieNode, index: number): boolean => {
			if (index === word.length) {
				if (!node.isEndOfWord) return false;
				node.isEndOfWord = false;
				wordExisted = true;
				return node.children.size === 0;
			}

			const char = word[index];
			const childNode = node.children.get(char);
			if (!childNode) return false;

			const shouldDeleteChild = deleteRecursive(childNode, index + 1);

			if (shouldDeleteChild) {
				node.children.delete(char);
				return node.children.size === 0 && !node.isEndOfWord;
			}

			return false;
		};

		deleteRecursive(this.root, 0);
		return wordExisted;
	}

	/**
	 * Returns all words stored in the Trie.
	 *
	 * Time Complexity: O(n * m), n = number of words, m = average word length
	 */
	public getAllWords(): string[] {
		const results: string[] = [];
		this.collectWords(this.root, "", results);
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

	/**
	 * Recursively collects all words from a given node.
	 *
	 * @param node - Current TrieNode
	 * @param prefix - Accumulated prefix
	 * @param results - Output array
	 */
	private collectWords(
		node: TrieNode,
		prefix: string,
		results: string[],
	): void {
		if (node.isEndOfWord) {
			results.push(prefix);
		}

		for (const [char, childNode] of node.children.entries()) {
			this.collectWords(childNode, prefix + char, results);
		}
	}
}
