import { describe, expect, test } from "bun:test";
import {
	abortableDelay,
	retry,
	withTimeout,
} from "@/node-concepts/async/resilience";

describe("withTimeout", () => {
	test("returns the operation result before timeout", async () => {
		await expect(withTimeout(Promise.resolve("ok"), 20)).resolves.toBe("ok");
	});

	test("rejects when the timeout wins", async () => {
		const slow = new Promise((resolve) => setTimeout(() => resolve("late"), 20));

		await expect(withTimeout(slow, 1, "too slow")).rejects.toThrow("too slow");
	});
});

describe("retry", () => {
	test("retries until the operation succeeds", async () => {
		let attempts = 0;

		const result = await retry(
			async () => {
				attempts++;
				if (attempts < 3) throw new Error("temporary");
				return "success";
			},
			{ retries: 3 },
		);

		expect(result).toBe("success");
		expect(attempts).toBe(3);
	});

	test("stops when shouldRetry returns false", async () => {
		let attempts = 0;

		await expect(
			retry(
				async () => {
					attempts++;
					throw new Error("fatal");
				},
				{
					retries: 3,
					shouldRetry: () => false,
				},
			),
		).rejects.toThrow("fatal");

		expect(attempts).toBe(1);
	});
});

describe("abortableDelay", () => {
	test("resolves after the delay", async () => {
		await expect(abortableDelay(0)).resolves.toBeUndefined();
	});

	test("rejects when aborted", async () => {
		const controller = new AbortController();
		const delay = abortableDelay(20, controller.signal);

		controller.abort();

		await expect(delay).rejects.toThrow("Aborted");
	});
});
