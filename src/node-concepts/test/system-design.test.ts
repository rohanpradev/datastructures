import { describe, expect, test } from "bun:test";
import {
	BloomFilter,
	optimalBitCount,
	optimalHashCount,
} from "@/node-concepts/system-design/bloom-filter";
import { ConsistentHashRing } from "@/node-concepts/system-design/consistent-hash";
import {
	createSortableUuid,
	decodeBase62,
	encodeBase62,
	SnowflakeIdGenerator,
} from "@/node-concepts/system-design/id-generation";
import { IdempotencyKeyStore } from "@/node-concepts/system-design/idempotency-store";
import { LRUCache } from "@/node-concepts/system-design/lru-cache";
import {
	SlidingWindowRateLimiter,
	TokenBucketRateLimiter,
} from "@/node-concepts/system-design/rate-limiter";
import { WeightedFairQueue } from "@/node-concepts/system-design/weighted-fair-queue";

describe("TokenBucketRateLimiter", () => {
	test("allows requests while tokens are available", () => {
		const limiter = new TokenBucketRateLimiter(2, 1, 0);

		expect(limiter.consume(0)).toEqual({
			allowed: true,
			remaining: 1,
			retryAfterMs: 0,
		});
		expect(limiter.consume(0)).toEqual({
			allowed: true,
			remaining: 0,
			retryAfterMs: 0,
		});
	});

	test("rejects when empty and reports retry time", () => {
		const limiter = new TokenBucketRateLimiter(1, 2, 0);

		limiter.consume(0);
		expect(limiter.consume(0)).toEqual({
			allowed: false,
			remaining: 0,
			retryAfterMs: 500,
		});
	});

	test("refills over time without exceeding capacity", () => {
		const limiter = new TokenBucketRateLimiter(3, 1, 0);

		limiter.consume(0, 3);
		expect(limiter.consume(2000)).toEqual({
			allowed: true,
			remaining: 1,
			retryAfterMs: 0,
		});
	});
});

describe("SlidingWindowRateLimiter", () => {
	test("allows up to the limit inside the window", () => {
		const limiter = new SlidingWindowRateLimiter(2, 1000);

		expect(limiter.consume("user-1", 0).allowed).toBe(true);
		expect(limiter.consume("user-1", 100).allowed).toBe(true);
		expect(limiter.consume("user-1", 200)).toEqual({
			allowed: false,
			remaining: 0,
			retryAfterMs: 800,
		});
	});

	test("expires old hits and tracks keys independently", () => {
		const limiter = new SlidingWindowRateLimiter(1, 1000);

		expect(limiter.consume("a", 0).allowed).toBe(true);
		expect(limiter.consume("b", 0).allowed).toBe(true);
		expect(limiter.consume("a", 1001).allowed).toBe(true);
	});

	test("removes stale keys so inactive callers do not accumulate", () => {
		const limiter = new SlidingWindowRateLimiter(2, 1000);

		limiter.consume("a", 0);
		limiter.consume("b", 100);
		expect(limiter.trackedKeyCount()).toBe(2);

		limiter.consume("c", 1201);

		expect(limiter.trackedKeyCount()).toBe(1);
		expect(limiter.consume("c", 1202).allowed).toBe(true);
	});
});

describe("LRUCache", () => {
	test("evicts the least recently used key", () => {
		const cache = new LRUCache<string, number>(2);

		cache.set("a", 1);
		cache.set("b", 2);
		cache.get("a");
		cache.set("c", 3);

		expect(cache.has("a")).toBe(true);
		expect(cache.has("b")).toBe(false);
		expect(cache.has("c")).toBe(true);
		expect(cache.keysMostRecentFirst()).toEqual(["c", "a"]);
	});

	test("updates existing keys and keeps capacity", () => {
		const cache = new LRUCache<string, number>(2);

		cache.set("a", 1);
		cache.set("b", 2);
		cache.set("a", 10);

		expect(cache.get("a")).toBe(10);
		expect(cache.size()).toBe(2);
		expect(cache.keysMostRecentFirst()).toEqual(["a", "b"]);
	});

	test("rejects invalid capacity", () => {
		expect(() => new LRUCache(0)).toThrow("capacity must be at least 1");
	});
});

describe("Base62 ID helpers", () => {
	test("creates sortable UUID v7 values with Bun", () => {
		expect(createSortableUuid()).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
		);
	});

	test("encodes and decodes compact IDs", () => {
		expect(encodeBase62(0)).toBe("0");
		expect(encodeBase62(61)).toBe("Z");
		expect(encodeBase62(62)).toBe("10");
		expect(decodeBase62("10")).toBe(62n);
	});

	test("round-trips large bigint values", () => {
		const value = 9_223_372_036_854_775_807n;

		expect(decodeBase62(encodeBase62(value))).toBe(value);
	});

	test("rejects invalid values", () => {
		expect(() => encodeBase62(-1)).toThrow("value must be non-negative");
		expect(() => decodeBase62("")).toThrow("code must not be empty");
		expect(() => decodeBase62("abc!")).toThrow("invalid Base62 character");
	});
});

describe("SnowflakeIdGenerator", () => {
	test("generates sortable unique IDs", () => {
		const times = [1_700_000_000_000n, 1_700_000_000_000n, 1_700_000_000_001n];
		let index = 0;
		const generator = new SnowflakeIdGenerator({
			workerId: 7,
			epochMs: 1_600_000_000_000n,
			nowMs: () => times[index++]!,
		});

		const first = generator.nextId();
		const second = generator.nextId();
		const third = generator.nextId();

		expect(first < second).toBe(true);
		expect(second < third).toBe(true);
	});

	test("rejects invalid worker IDs and backwards clocks", () => {
		expect(() => new SnowflakeIdGenerator({ workerId: 1024 })).toThrow(
			"workerId must be between 0 and 1023",
		);

		const times = [10n, 9n];
		let index = 0;
		const generator = new SnowflakeIdGenerator({
			workerId: 1,
			epochMs: 0n,
			nowMs: () => times[index++]!,
		});

		generator.nextId();
		expect(() => generator.nextId()).toThrow("clock moved backwards");
	});
});

describe("ConsistentHashRing", () => {
	test("maps keys to stable nodes", () => {
		const ring = new ConsistentHashRing(["cache-a", "cache-b", "cache-c"], 25);

		expect(ring.ringSize()).toBe(75);
		expect(ring.getNode("user:123")).toBe(ring.getNode("user:123"));
		expect(ring.nodes()).toEqual(["cache-a", "cache-b", "cache-c"]);
	});

	test("supports node removal and rejects empty rings", () => {
		const ring = new ConsistentHashRing(["cache-a", "cache-b"], 10);

		ring.removeNode("cache-a");

		expect(ring.nodes()).toEqual(["cache-b"]);
		expect(ring.getNode("any-key")).toBe("cache-b");

		ring.removeNode("cache-b");
		expect(() => ring.getNode("any-key")).toThrow("hash ring has no nodes");
	});

	test("moves only part of the keyspace when adding a node", () => {
		const before = new ConsistentHashRing<string>(["a", "b", "c"], 200);
		const after = new ConsistentHashRing<string>(["a", "b", "c"], 200);
		const keys = Array.from({ length: 1000 }, (_, index) => `key:${index}`);
		const originalAssignments = keys.map((key) => before.getNode(key));

		after.addNode("d");
		const movedKeys = keys.filter(
			(key, index) => after.getNode(key) !== originalAssignments[index],
		);

		expect(movedKeys.length).toBeGreaterThan(150);
		expect(movedKeys.length).toBeLessThan(400);
	});
});

describe("BloomFilter", () => {
	test("reports inserted values as present", () => {
		const filter = new BloomFilter({
			expectedItems: 100,
			falsePositiveRate: 0.01,
		});

		filter.add("tenant:1");
		filter.add("tenant:2");

		expect(filter.mightContain("tenant:1")).toBe(true);
		expect(filter.mightContain("tenant:2")).toBe(true);
		expect(filter.mightContain("definitely-not-inserted")).toBe(false);
	});

	test("computes sizing from expected false-positive rate", () => {
		expect(optimalBitCount(1000, 0.01)).toBe(9586);
		expect(optimalHashCount(9586, 1000)).toBe(7);

		const filter = new BloomFilter({
			expectedItems: 1000,
			falsePositiveRate: 0.01,
		});

		expect(filter.stats()).toEqual({
			bitCount: 9586,
			byteCount: 1199,
			hashCount: 7,
		});
	});

	test("rejects invalid sizing options", () => {
		expect(
			() => new BloomFilter({ expectedItems: 0, falsePositiveRate: 0.01 }),
		).toThrow("expectedItems must be at least 1");
		expect(
			() => new BloomFilter({ expectedItems: 10, falsePositiveRate: 1 }),
		).toThrow("falsePositiveRate must be between 0 and 1");
	});
});

describe("WeightedFairQueue", () => {
	test("interleaves equal-weight tenants instead of draining one tenant first", () => {
		const queue = new WeightedFairQueue<string, string>();

		queue.enqueue("tenant-a", "a1");
		queue.enqueue("tenant-a", "a2");
		queue.enqueue("tenant-b", "b1");
		queue.enqueue("tenant-b", "b2");

		expect([
			queue.dequeue()?.value,
			queue.dequeue()?.value,
			queue.dequeue()?.value,
			queue.dequeue()?.value,
		]).toEqual(["a1", "b1", "a2", "b2"]);
		expect(queue.dequeue()).toBeUndefined();
	});

	test("gives higher-weight tenants a larger early share", () => {
		const queue = new WeightedFairQueue<string, string>([
			["premium", 2],
			["standard", 1],
		]);

		queue.enqueue("premium", "p1");
		queue.enqueue("premium", "p2");
		queue.enqueue("standard", "s1");
		queue.enqueue("standard", "s2");

		const firstThreeTenants = [
			queue.dequeue()?.tenant,
			queue.dequeue()?.tenant,
			queue.dequeue()?.tenant,
		];

		expect(firstThreeTenants.filter((tenant) => tenant === "premium")).toHaveLength(
			2,
		);
		expect(queue.size()).toBe(1);
	});

	test("accounts for work cost when ordering shared queues", () => {
		const queue = new WeightedFairQueue<string, string>();

		queue.enqueue("tenant-a", "expensive", 4);
		queue.enqueue("tenant-b", "cheap", 1);

		expect(queue.peek()?.value).toBe("cheap");
		expect(queue.dequeue()).toEqual({
			cost: 1,
			tenant: "tenant-b",
			value: "cheap",
		});
		expect(queue.stats().queuedItems).toBe(1);
	});
});

describe("IdempotencyKeyStore", () => {
	test("starts a write, blocks concurrent duplicates, then replays completion", () => {
		const store = new IdempotencyKeyStore<{ orderId: string }>({
			inFlightTtlMs: 1000,
			replayTtlMs: 5000,
		});

		expect(store.claim("checkout:1", 0)).toEqual({ status: "started" });
		expect(store.claim("checkout:1", 250)).toEqual({
			retryAfterMs: 750,
			status: "conflict",
		});

		store.complete("checkout:1", { orderId: "order-123" }, 500);

		expect(store.claim("checkout:1", 1000)).toEqual({
			response: { orderId: "order-123" },
			status: "replay",
		});
	});

	test("expires stuck in-flight work and completed replay records", () => {
		const store = new IdempotencyKeyStore<string>({
			inFlightTtlMs: 1000,
			replayTtlMs: 2000,
		});

		expect(store.claim("payment:1", 0)).toEqual({ status: "started" });
		expect(store.claim("payment:1", 1001)).toEqual({ status: "started" });
		store.complete("payment:1", "ok", 1200);

		expect(store.pruneExpired(3201)).toBe(1);
		expect(store.size()).toBe(0);
	});

	test("releases failed writes so callers can retry the same key", () => {
		const store = new IdempotencyKeyStore<string>({
			inFlightTtlMs: 1000,
			replayTtlMs: 2000,
		});

		store.claim("invoice:1", 0);

		expect(store.fail("invoice:1")).toBe(true);
		expect(store.claim("invoice:1", 10)).toEqual({ status: "started" });
		expect(() => store.complete("missing", "ok")).toThrow(
			"idempotency key was not claimed",
		);
	});
});
