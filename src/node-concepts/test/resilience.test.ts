import { describe, expect, test } from "bun:test";
import {
	abortableDelay,
	retry,
	withTimeout,
} from "@/node-concepts/async/resilience";

function delayedResolve<T>(value: T, delayMs: number) {
	let timer: ReturnType<typeof setTimeout> | undefined;
	const promise = new Promise<T>((resolve) => {
		timer = setTimeout(() => resolve(value), delayMs);
	});

	return {
		promise,
		clear: () => {
			if (timer) clearTimeout(timer);
		},
	};
}

describe("withTimeout", () => {
	test("returns the operation result before timeout", async () => {
		await expect(withTimeout(Promise.resolve("ok"), 20)).resolves.toBe("ok");
	});

	test("rejects when the timeout wins", async () => {
		const slow = delayedResolve("late", 20);

		try {
			await expect(withTimeout(slow.promise, 1, "too slow")).rejects.toThrow(
				"too slow",
			);
		} finally {
			slow.clear();
		}
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

	test("removes abort listeners after resolving", async () => {
		const controller = new AbortController();
		const originalAdd = controller.signal.addEventListener.bind(controller.signal);
		const originalRemove = controller.signal.removeEventListener.bind(
			controller.signal,
		);
		let activeAbortListeners = 0;

		controller.signal.addEventListener = ((type, listener, options) => {
			if (type === "abort") activeAbortListeners++;
			return originalAdd(type, listener, options);
		}) as typeof controller.signal.addEventListener;
		controller.signal.removeEventListener = ((type, listener, options) => {
			if (type === "abort") activeAbortListeners--;
			return originalRemove(type, listener, options);
		}) as typeof controller.signal.removeEventListener;

		await abortableDelay(0, controller.signal);

		expect(activeAbortListeners).toBe(0);
	});

	test("rejects when aborted", async () => {
		const controller = new AbortController();
		const delay = abortableDelay(20, controller.signal);

		controller.abort();

		await expect(delay).rejects.toThrow("Aborted");
	});
});
