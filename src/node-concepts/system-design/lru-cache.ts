interface Entry<K, V> {
	key: K;
	value: V;
	prev: Entry<K, V> | undefined;
	next: Entry<K, V> | undefined;
}

/**
 * LRU cache backed by a Map and doubly linked list.
 *
 * System design use:
 * - Keep hot items in memory.
 * - Evict least-recently-used entries when capacity is reached.
 * - Common in URL shorteners, feeds, API responses, sessions, and config caches.
 */
export class LRUCache<K, V> {
	private readonly entries = new Map<K, Entry<K, V>>();
	private head: Entry<K, V> | undefined;
	private tail: Entry<K, V> | undefined;

	constructor(private readonly capacity: number) {
		if (capacity < 1) throw new Error("capacity must be at least 1");
	}

	/**
	 * Retrieves a value by key and marks it as recently used.
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * If the key exists, it is moved to the front of the linked list (most recent).
	 *
	 * @param key - The key to retrieve
	 * @returns The value associated with the key, or undefined if not found
	 *
	 * @example
	 * const cache = new LRUCache<string, number>(2);
	 * cache.set("a", 1);
	 * cache.get("a"); // 1
	 * cache.get("b"); // undefined
	 */
	get(key: K): V | undefined {
		const entry = this.entries.get(key);
		if (!entry) return undefined;

		this.moveToFront(entry);
		return entry.value;
	}

	/**
	 * Inserts or updates a key-value pair in the cache.
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * If the key already exists, the value is updated and the entry is moved to the front.
	 * If the key is new and the cache is at capacity, the least recently used item is evicted.
	 *
	 * @param key - The key to insert or update
	 * @param value - The value to associate with the key
	 *
	 * @example
	 * const cache = new LRUCache<string, number>(2);
	 * cache.set("a", 1);
	 * cache.set("b", 2);
	 * cache.set("c", 3); // Evicts "a" (least recently used)
	 */
	set(key: K, value: V): void {
		const existing = this.entries.get(key);
		if (existing) {
			existing.value = value;
			this.moveToFront(existing);
			return;
		}

		const entry: Entry<K, V> = { key, next: undefined, prev: undefined, value };
		this.entries.set(key, entry);
		this.addToFront(entry);

		if (this.entries.size > this.capacity) {
			this.evictTail();
		}
	}

	/**
	 * Checks if a key exists in the cache without affecting its recency.
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * This is a non-access check that does NOT update the LRU ordering.
	 * Use this when you want to check existence without affecting cache state.
	 *
	 * @param key - The key to check
	 * @returns true if the key exists, false otherwise
	 *
	 * @example
	 * const cache = new LRUCache<string, number>(2);
	 * cache.set("a", 1);
	 * cache.has("a"); // true
	 * cache.has("b"); // false
	 */
	has(key: K): boolean {
		return this.entries.has(key);
	}

	/**
	 * Returns the current number of items in the cache.
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * @returns The number of entries currently stored in the cache
	 *
	 * @example
	 * const cache = new LRUCache<string, number>(5);
	 * cache.set("a", 1).set("b", 2);
	 * cache.size(); // 2
	 */
	size(): number {
		return this.entries.size;
	}

	/**
	 * Returns all keys in the cache ordered from most recently used to least recently used.
	 * Time Complexity: O(n) where n is the cache size
	 * Space Complexity: O(n) for the output array
	 *
	 * This provides insight into the LRU ordering and which items would be evicted next.
	 *
	 * @returns Array of keys in LRU order (most recent first)
	 *
	 * @example
	 * const cache = new LRUCache<string, number>(3);
	 * cache.set("a", 1).set("b", 2).set("c", 3);
	 * cache.get("a"); // Access "a", making it most recent
	 * cache.keysMostRecentFirst(); // ["a", "c", "b"]
	 */
	keysMostRecentFirst(): K[] {
		const keys: K[] = [];
		let current = this.head;

		while (current) {
			keys.push(current.key);
			current = current.next;
		}

		return keys;
	}

	private moveToFront(entry: Entry<K, V>): void {
		if (entry === this.head) return;

		this.detach(entry);
		this.addToFront(entry);
	}

	private addToFront(entry: Entry<K, V>): void {
		entry.prev = undefined;
		entry.next = this.head;

		if (this.head) this.head.prev = entry;
		this.head = entry;

		if (!this.tail) this.tail = entry;
	}

	private detach(entry: Entry<K, V>): void {
		if (entry.prev) entry.prev.next = entry.next;
		else this.head = entry.next;

		if (entry.next) entry.next.prev = entry.prev;
		else this.tail = entry.prev;

		entry.prev = undefined;
		entry.next = undefined;
	}

	private evictTail(): void {
		if (!this.tail) return;

		const key = this.tail.key;
		this.detach(this.tail);
		this.entries.delete(key);
	}
}
