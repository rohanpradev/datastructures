import { describe, expect, test } from "bun:test";
import { HashNode, HashTable } from "@/data-structures/hash-table/hash-table";

describe("HashTable - Constructor", () => {
	test("should create empty hash table with default capacity", () => {
		const ht = new HashTable<string, number>();
		expect(ht.size()).toBe(0);
		expect(ht.isEmpty()).toBe(true);
		expect(ht.getCapacity()).toBe(16);
	});

	test("should create hash table with custom capacity", () => {
		const ht = new HashTable<string, number>(32);
		expect(ht.getCapacity()).toBe(32);
		expect(ht.size()).toBe(0);
	});

	test("should accept custom load factor threshold", () => {
		const ht = new HashTable<string, number>(16, 0.5);
		expect(ht.getCapacity()).toBe(16);
	});
});

describe("HashTable - Set", () => {
	test("should insert new key-value pair", () => {
		const ht = new HashTable<string, number>();
		ht.set("apple", 5);
		expect(ht.size()).toBe(1);
		expect(ht.get("apple")).toBe(5);
	});

	test("should update existing key", () => {
		const ht = new HashTable<string, number>();
		ht.set("apple", 5);
		ht.set("apple", 10);
		expect(ht.size()).toBe(1);
		expect(ht.get("apple")).toBe(10);
	});

	test("should handle multiple insertions", () => {
		const ht = new HashTable<string, number>();
		ht.set("apple", 5).set("banana", 10).set("cherry", 15);
		expect(ht.size()).toBe(3);
	});

	test("should support method chaining", () => {
		const ht = new HashTable<string, number>();
		const result = ht.set("a", 1).set("b", 2).set("c", 3);
		expect(result).toBe(ht);
		expect(ht.size()).toBe(3);
	});

	test("should handle hash collisions", () => {
		const ht = new HashTable<string, number>(4); // Small capacity for collisions
		ht.set("a", 1).set("b", 2).set("c", 3).set("d", 4).set("e", 5);
		expect(ht.size()).toBe(5);
		// All values should be retrievable despite collisions
		expect(ht.get("a")).toBe(1);
		expect(ht.get("b")).toBe(2);
		expect(ht.get("c")).toBe(3);
		expect(ht.get("d")).toBe(4);
		expect(ht.get("e")).toBe(5);
	});

	test("should trigger resize when load factor exceeded", () => {
		const ht = new HashTable<string, number>(4, 0.75);
		const initialCapacity = ht.getCapacity();
		ht.set("a", 1).set("b", 2).set("c", 3).set("d", 4);
		// Should trigger resize after 4th element (4/4 = 1.0 > 0.75)
		expect(ht.getCapacity()).toBeGreaterThan(initialCapacity);
		expect(ht.size()).toBe(4);
	});
});

describe("HashTable - Get", () => {
	test("should return undefined for non-existent key", () => {
		const ht = new HashTable<string, number>();
		expect(ht.get("apple")).toBeUndefined();
	});

	test("should retrieve existing value", () => {
		const ht = new HashTable<string, number>();
		ht.set("apple", 5);
		expect(ht.get("apple")).toBe(5);
	});

	test("should retrieve after multiple insertions", () => {
		const ht = new HashTable<string, number>();
		ht.set("apple", 5).set("banana", 10).set("cherry", 15);
		expect(ht.get("banana")).toBe(10);
	});

	test("should return undefined after deletion", () => {
		const ht = new HashTable<string, number>();
		ht.set("apple", 5);
		ht.delete("apple");
		expect(ht.get("apple")).toBeUndefined();
	});
});

describe("HashTable - Has", () => {
	test("should return false for non-existent key", () => {
		const ht = new HashTable<string, number>();
		expect(ht.has("apple")).toBe(false);
	});

	test("should return true for existing key", () => {
		const ht = new HashTable<string, number>();
		ht.set("apple", 5);
		expect(ht.has("apple")).toBe(true);
	});

	test("should return false after deletion", () => {
		const ht = new HashTable<string, number>();
		ht.set("apple", 5);
		ht.delete("apple");
		expect(ht.has("apple")).toBe(false);
	});

	test("should work with zero/falsy values", () => {
		const ht = new HashTable<string, number>();
		ht.set("zero", 0);
		expect(ht.has("zero")).toBe(true);
		expect(ht.get("zero")).toBe(0);
	});
});

describe("HashTable - Delete", () => {
	test("should return false when deleting non-existent key", () => {
		const ht = new HashTable<string, number>();
		expect(ht.delete("apple")).toBe(false);
	});

	test("should delete existing key and return true", () => {
		const ht = new HashTable<string, number>();
		ht.set("apple", 5);
		expect(ht.delete("apple")).toBe(true);
		expect(ht.size()).toBe(0);
		expect(ht.has("apple")).toBe(false);
	});

	test("should delete from chain with multiple elements", () => {
		const ht = new HashTable<string, number>(4); // Small for collisions
		ht.set("a", 1).set("b", 2).set("c", 3);
		expect(ht.delete("b")).toBe(true);
		expect(ht.has("a")).toBe(true);
		expect(ht.has("b")).toBe(false);
		expect(ht.has("c")).toBe(true);
		expect(ht.size()).toBe(2);
	});

	test("should handle multiple deletions", () => {
		const ht = new HashTable<string, number>();
		ht.set("a", 1).set("b", 2).set("c", 3).set("d", 4);
		expect(ht.delete("b")).toBe(true);
		expect(ht.delete("d")).toBe(true);
		expect(ht.size()).toBe(2);
		expect(ht.get("a")).toBe(1);
		expect(ht.get("c")).toBe(3);
	});
});

describe("HashTable - Keys/Values/Entries", () => {
	test("keys() should return empty array for empty table", () => {
		const ht = new HashTable<string, number>();
		expect(ht.keys()).toEqual([]);
	});

	test("keys() should return all keys", () => {
		const ht = new HashTable<string, number>();
		ht.set("a", 1).set("b", 2).set("c", 3);
		const keys = ht.keys();
		expect(keys.length).toBe(3);
		expect(keys).toContain("a");
		expect(keys).toContain("b");
		expect(keys).toContain("c");
	});

	test("values() should return empty array for empty table", () => {
		const ht = new HashTable<string, number>();
		expect(ht.values()).toEqual([]);
	});

	test("values() should return all values", () => {
		const ht = new HashTable<string, number>();
		ht.set("a", 1).set("b", 2).set("c", 3);
		const values = ht.values();
		expect(values.length).toBe(3);
		expect(values).toContain(1);
		expect(values).toContain(2);
		expect(values).toContain(3);
	});

	test("entries() should return empty array for empty table", () => {
		const ht = new HashTable<string, number>();
		expect(ht.entries()).toEqual([]);
	});

	test("entries() should return all key-value pairs", () => {
		const ht = new HashTable<string, number>();
		ht.set("a", 1).set("b", 2).set("c", 3);
		const entries = ht.entries();
		expect(entries.length).toBe(3);
		expect(entries).toContainEqual(["a", 1]);
		expect(entries).toContainEqual(["b", 2]);
		expect(entries).toContainEqual(["c", 3]);
	});
});

describe("HashTable - Size/IsEmpty/Clear", () => {
	test("isEmpty() should return true for new table", () => {
		const ht = new HashTable<string, number>();
		expect(ht.isEmpty()).toBe(true);
	});

	test("isEmpty() should return false after insertion", () => {
		const ht = new HashTable<string, number>();
		ht.set("a", 1);
		expect(ht.isEmpty()).toBe(false);
	});

	test("size() should track insertions", () => {
		const ht = new HashTable<string, number>();
		expect(ht.size()).toBe(0);
		ht.set("a", 1);
		expect(ht.size()).toBe(1);
		ht.set("b", 2);
		expect(ht.size()).toBe(2);
	});

	test("size() should track deletions", () => {
		const ht = new HashTable<string, number>();
		ht.set("a", 1).set("b", 2).set("c", 3);
		expect(ht.size()).toBe(3);
		ht.delete("b");
		expect(ht.size()).toBe(2);
	});

	test("clear() should remove all entries", () => {
		const ht = new HashTable<string, number>();
		ht.set("a", 1).set("b", 2).set("c", 3);
		ht.clear();
		expect(ht.size()).toBe(0);
		expect(ht.isEmpty()).toBe(true);
		expect(ht.has("a")).toBe(false);
	});

	test("clear() should support method chaining", () => {
		const ht = new HashTable<string, number>();
		const result = ht.set("a", 1).clear();
		expect(result).toBe(ht);
	});
});

describe("HashTable - Load Factor and Capacity", () => {
	test("getLoadFactor() should calculate correctly", () => {
		const ht = new HashTable<string, number>(10);
		expect(ht.getLoadFactor()).toBe(0);
		ht.set("a", 1).set("b", 2).set("c", 3);
		expect(ht.getLoadFactor()).toBe(0.3);
	});

	test("getCapacity() should return current capacity", () => {
		const ht = new HashTable<string, number>(20);
		expect(ht.getCapacity()).toBe(20);
	});

	test("capacity should double after resize", () => {
		const ht = new HashTable<string, number>(4, 0.75);
		const initialCapacity = ht.getCapacity();
		// Add enough elements to trigger resize
		for (let i = 0; i < 10; i++) {
			ht.set(`key${i}`, i);
		}
		expect(ht.getCapacity()).toBeGreaterThan(initialCapacity);
	});

	test("all elements should be accessible after resize", () => {
		const ht = new HashTable<string, number>(4, 0.75);
		const keys = [];
		for (let i = 0; i < 10; i++) {
			const key = `key${i}`;
			keys.push(key);
			ht.set(key, i);
		}
		// Verify all keys are still accessible
		keys.forEach((key, i) => {
			expect(ht.get(key)).toBe(i);
		});
	});
});

describe("HashTable - Edge Cases", () => {
	test("should handle empty string as key", () => {
		const ht = new HashTable<string, number>();
		ht.set("", 42);
		expect(ht.get("")).toBe(42);
	});

	test("should handle numeric keys", () => {
		const ht = new HashTable<number, string>();
		ht.set(1, "one").set(2, "two").set(3, "three");
		expect(ht.get(1)).toBe("one");
		expect(ht.get(2)).toBe("two");
	});

	test("should handle boolean values", () => {
		const ht = new HashTable<string, boolean>();
		ht.set("true", true).set("false", false);
		expect(ht.get("true")).toBe(true);
		expect(ht.get("false")).toBe(false);
	});

	test("should handle null values", () => {
		const ht = new HashTable<string, any>();
		ht.set("null", null);
		expect(ht.get("null")).toBe(null);
		expect(ht.has("null")).toBe(true);
	});

	test("should handle object values", () => {
		const ht = new HashTable<string, { id: number; name: string }>();
		const obj = { id: 1, name: "test" };
		ht.set("obj", obj);
		expect(ht.get("obj")).toEqual(obj);
	});

	test("should handle array values", () => {
		const ht = new HashTable<string, number[]>();
		ht.set("arr", [1, 2, 3]);
		expect(ht.get("arr")).toEqual([1, 2, 3]);
	});

	test("should handle very long keys", () => {
		const ht = new HashTable<string, number>();
		const longKey = "a".repeat(1000);
		ht.set(longKey, 42);
		expect(ht.get(longKey)).toBe(42);
	});

	test("should handle special characters in keys", () => {
		const ht = new HashTable<string, number>();
		ht.set("key@#$%", 1).set("key!&*()", 2).set("key-_+=", 3);
		expect(ht.get("key@#$%")).toBe(1);
		expect(ht.get("key!&*()")).toBe(2);
		expect(ht.get("key-_+=")).toBe(3);
	});
});

describe("HashTable - Integration Scenarios", () => {
	test("should handle frequency counter pattern", () => {
		const ht = new HashTable<string, number>();
		const words = ["apple", "banana", "apple", "cherry", "banana", "apple"];

		words.forEach((word) => {
			ht.set(word, (ht.get(word) || 0) + 1);
		});

		expect(ht.get("apple")).toBe(3);
		expect(ht.get("banana")).toBe(2);
		expect(ht.get("cherry")).toBe(1);
	});

	test("should handle cache pattern", () => {
		const ht = new HashTable<string, { value: number; timestamp: number }>();

		ht.set("user1", { value: 100, timestamp: Date.now() });
		ht.set("user2", { value: 200, timestamp: Date.now() });

		expect(ht.get("user1")?.value).toBe(100);
		expect(ht.get("user2")?.value).toBe(200);
	});

	test("should handle index mapping", () => {
		const ht = new HashTable<string, number>();
		const arr = ["apple", "banana", "cherry", "date"];

		arr.forEach((item, index) => {
			ht.set(item, index);
		});

		expect(ht.get("apple")).toBe(0);
		expect(ht.get("cherry")).toBe(2);
	});

	test("should survive stress test with many operations", () => {
		const ht = new HashTable<string, number>();
		const n = 100;

		// Insert many elements
		for (let i = 0; i < n; i++) {
			ht.set(`key${i}`, i);
		}
		expect(ht.size()).toBe(n);

		// Update half of them
		for (let i = 0; i < n / 2; i++) {
			ht.set(`key${i}`, i * 2);
		}
		expect(ht.size()).toBe(n);

		// Delete quarter of them
		for (let i = 0; i < n / 4; i++) {
			ht.delete(`key${i}`);
		}
		expect(ht.size()).toBe(n - n / 4);

		// Verify remaining elements
		for (let i = n / 4; i < n; i++) {
			expect(ht.has(`key${i}`)).toBe(true);
		}
	});

	test("should handle interleaved operations", () => {
		const ht = new HashTable<string, number>();

		ht.set("a", 1);
		ht.set("b", 2);
		expect(ht.get("a")).toBe(1);
		ht.delete("a");
		expect(ht.has("a")).toBe(false);
		ht.set("c", 3);
		ht.set("a", 10); // Re-add with different value
		expect(ht.get("a")).toBe(10);
		expect(ht.size()).toBe(3);
	});
});

describe("HashTable - Different Data Types", () => {
	test("should work with string keys and string values", () => {
		const ht = new HashTable<string, string>();
		ht.set("firstName", "John").set("lastName", "Doe");
		expect(ht.get("firstName")).toBe("John");
	});

	test("should work with number keys and number values", () => {
		const ht = new HashTable<number, number>();
		ht.set(1, 100).set(2, 200).set(3, 300);
		expect(ht.get(2)).toBe(200);
	});

	test("should work with object values", () => {
		interface User {
			id: number;
			name: string;
			email: string;
		}
		const ht = new HashTable<string, User>();

		ht.set("user1", { id: 1, name: "Alice", email: "alice@example.com" });
		ht.set("user2", { id: 2, name: "Bob", email: "bob@example.com" });

		expect(ht.get("user1")?.name).toBe("Alice");
		expect(ht.get("user2")?.email).toBe("bob@example.com");
	});

	test("should work with function values", () => {
		const ht = new HashTable<string, () => number>();
		ht.set("double", () => 2 * 2);
		ht.set("triple", () => 3 * 3);
		expect(ht.get("double")?.()).toBe(4);
		expect(ht.get("triple")?.()).toBe(9);
	});
});
