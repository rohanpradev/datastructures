interface Entry<K, V> {
	key: K;
	value: V;
	prev?: Entry<K, V>;
	next?: Entry<K, V>;
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
	private head?: Entry<K, V>;
	private tail?: Entry<K, V>;

	constructor(private readonly capacity: number) {
		if (capacity < 1) throw new Error("capacity must be at least 1");
	}

	get(key: K): V | undefined {
		const entry = this.entries.get(key);
		if (!entry) return undefined;

		this.moveToFront(entry);
		return entry.value;
	}

	set(key: K, value: V): void {
		const existing = this.entries.get(key);
		if (existing) {
			existing.value = value;
			this.moveToFront(existing);
			return;
		}

		const entry: Entry<K, V> = { key, value };
		this.entries.set(key, entry);
		this.addToFront(entry);

		if (this.entries.size > this.capacity) {
			this.evictTail();
		}
	}

	has(key: K): boolean {
		return this.entries.has(key);
	}

	size(): number {
		return this.entries.size;
	}

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
