/**
 * Node class for Hash Table (Chaining)
 * Each node stores a key-value pair and points to the next node in the chain
 */
class HashNode<K, V> {
	key: K;
	value: V;
	next: HashNode<K, V> | null;

	constructor(key: K, value: V) {
		this.key = key;
		this.value = value;
		this.next = null;
	}
}

/**
 * Hash Table Data Structure (using Separate Chaining for collision resolution)
 * A data structure that maps keys to values for efficient lookup
 *
 * Key Features:
 * - Average O(1) insert, get, delete operations
 * - Uses hashing function to compute index
 * - Separate chaining for collision resolution
 * - Dynamic resizing when load factor exceeds threshold
 * - Supports any key type (with proper hash function)
 *
 * Common Use Cases:
 * - Database indexing
 * - Caching (memoization)
 * - Counting frequency of elements
 * - Detecting duplicates
 * - Implementing dictionaries/maps
 * - Symbol tables in compilers
 *
 * Time Complexities:
 * - insert(): O(1) average, O(n) worst case
 * - get(): O(1) average, O(n) worst case
 * - delete(): O(1) average, O(n) worst case
 * - resize(): O(n)
 *
 * Visual Structure (Chaining):
 * ```
 * Index 0: [key1, val1] -> [key5, val5] -> null
 * Index 1: null
 * Index 2: [key2, val2] -> null
 * Index 3: [key3, val3] -> [key7, val7] -> [key9, val9] -> null
 * Index 4: [key4, val4] -> null
 * ```
 */
class HashTable<K = string, V = any> {
	private buckets: (HashNode<K, V> | null)[];
	private capacity: number;
	length: number;
	private loadFactorThreshold: number;

	/**
	 * Creates a new Hash Table
	 * Time Complexity: O(n) where n is initial capacity
	 *
	 * @param initialCapacity - Initial size of the hash table (default: 16)
	 * @param loadFactorThreshold - Threshold for resizing (default: 0.75)
	 *
	 * @example
	 * const hashTable = new HashTable<string, number>();
	 * // Creates table with capacity 16
	 *
	 * @example
	 * const hashTable = new HashTable<string, number>(32, 0.8);
	 * // Custom capacity and load factor
	 */
	constructor(
		initialCapacity: number = 16,
		loadFactorThreshold: number = 0.75,
	) {
		this.capacity = initialCapacity;
		this.buckets = new Array(this.capacity).fill(null);
		this.length = 0;
		this.loadFactorThreshold = loadFactorThreshold;
	}

	/**
	 * Hash function to convert key to array index
	 * Uses simple string hashing algorithm
	 * Time Complexity: O(k) where k is key length
	 *
	 * Algorithm:
	 * 1. Convert key to string
	 * 2. Iterate through each character
	 * 3. Compute hash using: hash = (hash * 31 + charCode) % capacity
	 * 4. Return hash as index
	 *
	 * @param key - The key to hash
	 * @returns Index in the buckets array
	 */
	private hash(key: K): number {
		// Convert key to string
		const keyStr = String(key);
		let hash = 0;

		// Simple polynomial rolling hash
		for (let i = 0; i < keyStr.length; i++) {
			hash = (hash * 31 + keyStr.charCodeAt(i)) % this.capacity;
		}

		return hash;
	}

	/**
	 * Inserts or updates a key-value pair in the hash table
	 * Time Complexity: O(1) average, O(n) worst case when chain is long
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Compute hash index for the key
	 * 2. Check if key already exists in chain
	 * 3. If exists, update value
	 * 4. If not, add new node to beginning of chain
	 * 5. Increment length
	 * 6. Check load factor and resize if needed
	 *
	 * Visual Example:
	 * ```
	 * Insert ("apple", 5):
	 * hash("apple") = 2
	 *
	 * Before:
	 * Index 2: null
	 *
	 * After:
	 * Index 2: ["apple", 5] -> null
	 *
	 * Insert ("banana", 10) (collision at index 2):
	 * Index 2: ["banana", 10] -> ["apple", 5] -> null
	 * ```
	 *
	 * @param key - The key to insert
	 * @param value - The value to associate with the key
	 * @returns The hash table instance for method chaining
	 *
	 * @example
	 * const ht = new HashTable<string, number>();
	 * ht.set("apple", 5).set("banana", 10);
	 */
	set(key: K, value: V): HashTable<K, V> {
		const index = this.hash(key);
		let current = this.buckets[index];

		// Check if key already exists
		while (current) {
			if (current.key === key) {
				// Update existing value
				current.value = value;
				return this;
			}
			current = current.next;
		}

		// Key doesn't exist, add new node
		const newNode = new HashNode(key, value);
		newNode.next = this.buckets[index] || null;
		this.buckets[index] = newNode;
		this.length++;

		// Check if we need to resize
		if (this.length / this.capacity > this.loadFactorThreshold) {
			this.resize();
		}

		return this;
	}

	/**
	 * Retrieves a value by key
	 * Time Complexity: O(1) average, O(n) worst case
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Compute hash index for the key
	 * 2. Traverse the chain at that index
	 * 3. If key found, return value
	 * 4. If chain ends, return undefined
	 *
	 * @param key - The key to look up
	 * @returns The value associated with the key, or undefined if not found
	 *
	 * @example
	 * const ht = new HashTable<string, number>();
	 * ht.set("apple", 5);
	 * ht.get("apple"); // 5
	 * ht.get("orange"); // undefined
	 */
	get(key: K): V | undefined {
		const index = this.hash(key);
		let current = this.buckets[index];

		while (current) {
			if (current.key === key) {
				return current.value;
			}
			current = current.next;
		}

		return undefined;
	}

	/**
	 * Checks if a key exists in the hash table
	 * Time Complexity: O(1) average, O(n) worst case
	 * Space Complexity: O(1)
	 *
	 * @param key - The key to check
	 * @returns true if key exists, false otherwise
	 *
	 * @example
	 * const ht = new HashTable<string, number>();
	 * ht.set("apple", 5);
	 * ht.has("apple"); // true
	 * ht.has("orange"); // false
	 */
	has(key: K): boolean {
		return this.get(key) !== undefined;
	}

	/**
	 * Deletes a key-value pair from the hash table
	 * Time Complexity: O(1) average, O(n) worst case
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Compute hash index for the key
	 * 2. Traverse chain looking for key
	 * 3. If found at head, update bucket pointer
	 * 4. If found in middle/end, update previous node's next pointer
	 * 5. Decrement length
	 * 6. Return true if deleted, false if not found
	 *
	 * Visual Example:
	 * ```
	 * Delete "apple":
	 * Before:
	 * Index 2: ["banana", 10] -> ["apple", 5] -> ["cherry", 15] -> null
	 *
	 * After:
	 * Index 2: ["banana", 10] -> ["cherry", 15] -> null
	 * ```
	 *
	 * @param key - The key to delete
	 * @returns true if deleted, false if key not found
	 *
	 * @example
	 * const ht = new HashTable<string, number>();
	 * ht.set("apple", 5);
	 * ht.delete("apple"); // true
	 * ht.delete("orange"); // false
	 */
	delete(key: K): boolean {
		const index = this.hash(key);
		let current = this.buckets[index];
		let prev: HashNode<K, V> | null = null;

		while (current) {
			if (current.key === key) {
				// Found the key
				if (prev) {
					// Key is not at head
					prev.next = current.next;
				} else {
					// Key is at head
					this.buckets[index] = current.next;
				}
				this.length--;
				return true;
			}
			prev = current;
			current = current.next;
		}

		return false;
	}

	/**
	 * Returns all keys in the hash table
	 * Time Complexity: O(n + m) where n is number of entries, m is capacity
	 * Space Complexity: O(n)
	 *
	 * @returns Array of all keys
	 *
	 * @example
	 * const ht = new HashTable<string, number>();
	 * ht.set("a", 1).set("b", 2).set("c", 3);
	 * ht.keys(); // ["a", "b", "c"] (order not guaranteed)
	 */
	keys(): K[] {
		const keysArray: K[] = [];

		for (const bucket of this.buckets) {
			let current = bucket;
			while (current) {
				keysArray.push(current.key);
				current = current.next;
			}
		}

		return keysArray;
	}

	/**
	 * Returns all values in the hash table
	 * Time Complexity: O(n + m) where n is number of entries, m is capacity
	 * Space Complexity: O(n)
	 *
	 * @returns Array of all values
	 *
	 * @example
	 * const ht = new HashTable<string, number>();
	 * ht.set("a", 1).set("b", 2).set("c", 3);
	 * ht.values(); // [1, 2, 3] (order not guaranteed)
	 */
	values(): V[] {
		const valuesArray: V[] = [];

		for (const bucket of this.buckets) {
			let current = bucket;
			while (current) {
				valuesArray.push(current.value);
				current = current.next;
			}
		}

		return valuesArray;
	}

	/**
	 * Returns all key-value pairs as entries
	 * Time Complexity: O(n + m) where n is number of entries, m is capacity
	 * Space Complexity: O(n)
	 *
	 * @returns Array of [key, value] tuples
	 *
	 * @example
	 * const ht = new HashTable<string, number>();
	 * ht.set("a", 1).set("b", 2);
	 * ht.entries(); // [["a", 1], ["b", 2]]
	 */
	entries(): [K, V][] {
		const entriesArray: [K, V][] = [];

		for (const bucket of this.buckets) {
			let current = bucket;
			while (current) {
				entriesArray.push([current.key, current.value]);
				current = current.next;
			}
		}

		return entriesArray;
	}

	/**
	 * Resizes the hash table to double its current capacity
	 * Time Complexity: O(n) - rehash all elements
	 * Space Complexity: O(n) - new buckets array
	 *
	 * Algorithm:
	 * 1. Create new buckets array with double capacity
	 * 2. Iterate through all existing entries
	 * 3. Rehash each entry into new buckets
	 * 4. Update capacity and buckets reference
	 *
	 * Why Resize:
	 * - Maintains O(1) average time complexity
	 * - Reduces chain length (fewer collisions)
	 * - Load factor threshold prevents performance degradation
	 *
	 * @example
	 * const ht = new HashTable<string, number>(4, 0.75);
	 * ht.set("a", 1).set("b", 2).set("c", 3); // triggers resize at 4th element
	 */
	private resize(): void {
		const oldBuckets = this.buckets;
		this.capacity *= 2;
		this.buckets = new Array(this.capacity).fill(null);
		this.length = 0;

		// Rehash all entries
		for (const bucket of oldBuckets) {
			let current = bucket;
			while (current) {
				this.set(current.key, current.value);
				current = current.next;
			}
		}
	}

	/**
	 * Returns the number of key-value pairs
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * @returns Number of entries in the hash table
	 *
	 * @example
	 * const ht = new HashTable<string, number>();
	 * ht.set("a", 1).set("b", 2);
	 * ht.size(); // 2
	 */
	size(): number {
		return this.length;
	}

	/**
	 * Checks if the hash table is empty
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * @returns true if empty, false otherwise
	 *
	 * @example
	 * const ht = new HashTable<string, number>();
	 * ht.isEmpty(); // true
	 * ht.set("a", 1);
	 * ht.isEmpty(); // false
	 */
	isEmpty(): boolean {
		return this.length === 0;
	}

	/**
	 * Removes all entries from the hash table
	 * Time Complexity: O(m) where m is capacity
	 * Space Complexity: O(1)
	 *
	 * @returns The hash table instance for method chaining
	 *
	 * @example
	 * const ht = new HashTable<string, number>();
	 * ht.set("a", 1).set("b", 2);
	 * ht.clear();
	 * ht.size(); // 0
	 */
	clear(): HashTable<K, V> {
		this.buckets = new Array(this.capacity).fill(null);
		this.length = 0;
		return this;
	}

	/**
	 * Returns the current capacity of the hash table
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * @returns Current capacity (number of buckets)
	 */
	getCapacity(): number {
		return this.capacity;
	}

	/**
	 * Returns the current load factor
	 * Load factor = number of entries / capacity
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * @returns Load factor (between 0 and 1)
	 */
	getLoadFactor(): number {
		return this.length / this.capacity;
	}
}

export { HashNode, HashTable };
