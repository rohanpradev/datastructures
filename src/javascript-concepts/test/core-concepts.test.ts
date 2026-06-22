import { describe, expect, test } from "bun:test";
import {
	cloneStructured,
	createCounter,
	createDeferred,
	groupBy,
	memoizeByKey,
	range,
	runWithConcurrency,
	sameValueZero,
} from "../core-concepts";

describe("sameValueZero", () => {
	test("matches Map and Set equality semantics", () => {
		expect(sameValueZero(Number.NaN, Number.NaN)).toBe(true);
		expect(sameValueZero(0, -0)).toBe(true);
		expect(sameValueZero("a", "a")).toBe(true);
		expect(sameValueZero({}, {})).toBe(false);
	});
});

describe("groupBy", () => {
	test("groups items by derived keys", () => {
		const grouped = groupBy(
			[
				{ title: "Two Sum", pattern: "hash-map" },
				{ title: "Group Anagrams", pattern: "hash-map" },
				{ title: "Koko Eating Bananas", pattern: "binary-search" },
			],
			(problem) => problem.pattern,
		);

		expect(grouped.get("hash-map")?.map((problem) => problem.title)).toEqual([
			"Two Sum",
			"Group Anagrams",
		]);
		expect(grouped.get("binary-search")?.[0]?.title).toBe(
			"Koko Eating Bananas",
		);
	});

	test("uses SameValueZero behavior through Map keys", () => {
		const grouped = groupBy([Number.NaN, Number.NaN, 1], (value) => value);

		expect(grouped.get(Number.NaN)).toEqual([Number.NaN, Number.NaN]);
	});
});

describe("createCounter", () => {
	test("keeps private closure state per counter", () => {
		const first = createCounter(10);
		const second = createCounter();

		expect(first.increment()).toBe(11);
		expect(first.decrement(3)).toBe(8);
		expect(first.value()).toBe(8);
		expect(second.value()).toBe(0);
		expect(first.reset()).toBe(10);
	});
});

describe("range", () => {
	test("creates positive and negative iterables", () => {
		expect(Array.from(range(1, 6, 2))).toEqual([1, 3, 5]);
		expect([...range(5, 0, -2)]).toEqual([5, 3, 1]);
	});

	test("rejects zero step", () => {
		expect(() => Array.from(range(1, 5, 0))).toThrow("step must not be 0");
	});
});

describe("cloneStructured", () => {
	test("deep clones structured values without JSON limitations", () => {
		const original = {
			createdAt: new Date("2026-05-13T00:00:00.000Z"),
			labels: new Set(["js", "dsa"]),
			stats: new Map([["solved", 42]]),
		};

		const cloned = cloneStructured(original);

		expect(cloned).not.toBe(original);
		expect(cloned.createdAt).not.toBe(original.createdAt);
		expect(cloned.createdAt.toISOString()).toBe("2026-05-13T00:00:00.000Z");
		expect([...cloned.labels]).toEqual(["js", "dsa"]);
		expect(cloned.stats.get("solved")).toBe(42);
	});
});

describe("createDeferred", () => {
	test("resolves from external completion", async () => {
		const deferred = createDeferred<string>();

		deferred.resolve("done");

		await expect(deferred.promise).resolves.toBe("done");
	});

	test("rejects from external failure", async () => {
		const deferred = createDeferred<string>();

		deferred.reject(new Error("failed"));

		await expect(deferred.promise).rejects.toThrow("failed");
	});
});

describe("memoizeByKey", () => {
	test("reuses cached results for equivalent keys", () => {
		let calls = 0;
		const add = memoizeByKey((left: number, right: number) => {
			calls++;
			return left + right;
		});

		expect(add(2, 3)).toBe(5);
		expect(add(2, 3)).toBe(5);
		expect(add(3, 2)).toBe(5);
		expect(calls).toBe(2);
	});
});

describe("runWithConcurrency", () => {
	test("preserves result order while limiting active tasks", async () => {
		let active = 0;
		let maxActive = 0;
		const tasks = [30, 10, 20, 5].map((duration, index) => async () => {
			active++;
			maxActive = Math.max(maxActive, active);
			await Bun.sleep(duration);
			active--;
			return index;
		});

		const result = await runWithConcurrency(tasks, 2);

		expect(result).toEqual([0, 1, 2, 3]);
		expect(maxActive).toBeLessThanOrEqual(2);
	});

	test("rejects invalid concurrency limits", async () => {
		await expect(runWithConcurrency([], 0)).rejects.toThrow(
			"limit must be a positive integer",
		);
	});
});
