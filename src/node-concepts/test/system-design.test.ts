import { describe, expect, test } from "bun:test";
import {
	decodeBase62,
	encodeBase62,
	SnowflakeIdGenerator,
} from "@/node-concepts/system-design/id-generation";
import { LRUCache } from "@/node-concepts/system-design/lru-cache";
import {
	SlidingWindowRateLimiter,
	TokenBucketRateLimiter,
} from "@/node-concepts/system-design/rate-limiter";

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
