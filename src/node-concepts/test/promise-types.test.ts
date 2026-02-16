import { describe, expect, test } from "bun:test";
import {
	allPromises,
	allSettledPromises,
	anyPromise,
	catchExample,
	chainedThen,
	finallyExample,
	racePromises,
	rejectedValue,
	resolvedValue,
} from "@/node-concepts/promise-types";

/* -------------------------------------------------- */
/* Promise.resolve */
/* -------------------------------------------------- */

describe("resolvedValue", () => {
	test("resolves with provided value", async () => {
		await expect(resolvedValue(42)).resolves.toBe(42);
	});

	test("resolves objects correctly", async () => {
		const obj = { name: "Luke" };
		await expect(resolvedValue(obj)).resolves.toEqual(obj);
	});
});

/* -------------------------------------------------- */
/* Promise.reject */
/* -------------------------------------------------- */

describe("rejectedValue", () => {
	test("rejects with provided reason", async () => {
		await expect(rejectedValue("fail")).rejects.toBe("fail");
	});

	test("rejects with Error instance", async () => {
		const err = new Error("boom");
		await expect(rejectedValue(err)).rejects.toBe(err);
	});
});

/* -------------------------------------------------- */
/* Promise.all */
/* -------------------------------------------------- */

describe("allPromises", () => {
	test("resolves when all succeed", async () => {
		const result = await allPromises([resolvedValue(1), resolvedValue(2)]);

		expect(result).toEqual([1, 2]);
	});

	test("rejects immediately when one fails", async () => {
		await expect(
			allPromises([resolvedValue(1), rejectedValue("error"), resolvedValue(3)]),
		).rejects.toBe("error");
	});
});

/* -------------------------------------------------- */
/* Promise.allSettled */
/* -------------------------------------------------- */

describe("allSettledPromises", () => {
	test("returns status for each promise", async () => {
		const result = await allSettledPromises([
			resolvedValue("ok"),
			rejectedValue("fail"),
		]);

		expect(result).toHaveLength(2);
		expect(result[0].status).toBe("fulfilled");
		expect(result[1].status).toBe("rejected");
	});
});

/* -------------------------------------------------- */
/* Promise.race */
/* -------------------------------------------------- */

describe("racePromises", () => {
	test("resolves with fastest promise", async () => {
		const fast = resolvedValue("fast");

		const slow = new Promise<string>((resolve) =>
			setTimeout(() => resolve("slow"), 20),
		);

		const result = await racePromises([slow, fast]);

		expect(result).toBe("fast");
	});

	test("rejects if first settled promise rejects", async () => {
		const fastReject = rejectedValue("boom");

		const slowResolve = new Promise<string>((resolve) =>
			setTimeout(() => resolve("ok"), 20),
		);

		await expect(racePromises([fastReject, slowResolve])).rejects.toBe("boom");
	});
});

/* -------------------------------------------------- */
/* Promise.any */
/* -------------------------------------------------- */

describe("anyPromise", () => {
	test("resolves with first fulfilled promise", async () => {
		const result = await anyPromise([
			rejectedValue("fail"),
			resolvedValue("success"),
		]);

		expect(result).toBe("success");
	});

	test("rejects with AggregateError if all fail", async () => {
		await expect(
			anyPromise([rejectedValue("a"), rejectedValue("b")]),
		).rejects.toThrow(AggregateError);
	});
});

/* -------------------------------------------------- */
/* then chaining */
/* -------------------------------------------------- */

describe("chainedThen", () => {
	test("correctly transforms value", async () => {
		const result = await chainedThen(5);
		expect(result).toBe(15); // (5 * 2) + 5
	});
});

/* -------------------------------------------------- */
/* catch handling */
/* -------------------------------------------------- */

describe("catchExample", () => {
	test("recovers from rejection", async () => {
		await expect(catchExample()).resolves.toBe("Recovered");
	});
});

/* -------------------------------------------------- */
/* finally handling */
/* -------------------------------------------------- */

describe("finallyExample", () => {
	test("executes callback before resolving", async () => {
		let executed = false;

		const result = await finallyExample(() => {
			executed = true;
		});

		expect(executed).toBe(true);
		expect(result).toBe("Done");
	});

	test("finally does not swallow errors", async () => {
		const failing = Promise.reject("boom").finally(() => {});

		await expect(failing).rejects.toBe("boom");
	});
});
