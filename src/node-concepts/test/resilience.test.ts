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
	test.each([-1, 0.5, NaN, Infinity])("rejects invalid retry budget %s before running", async (retries) => {
		let calls = 0;
		await expect(retry(async () => ++calls, { retries })).rejects.toThrow(RangeError);
		expect(calls).toBe(0);
	});

	test.each([-1, NaN, Infinity, 2_147_483_648])("rejects invalid backoff %s", async (delay) => {
		await expect(retry(async () => "ok", { retries: 1, baseDelayMs: delay })).rejects.toThrow(RangeError);
		await expect(retry(async () => "ok", { retries: 1, maxDelayMs: delay })).rejects.toThrow(RangeError);
	});

	test("does not run an already cancelled operation", async () => {
		let calls = 0;
		const reason = new Error("cancelled by caller");
		await expect(retry(async () => ++calls, { retries: 2, signal: AbortSignal.abort(reason) })).rejects.toBe(reason);
		expect(calls).toBe(0);
	});

	test("cancels a backoff without launching another attempt", async () => {
		const controller = new AbortController();
		let calls = 0;
		const pending = retry(async () => { calls++; throw new Error("temporary"); }, {
			retries: 2, baseDelayMs: 30_000, signal: controller.signal,
		});
		await Promise.resolve();
		controller.abort();
		await expect(pending).rejects.toBeInstanceOf(DOMException);
		expect(calls).toBe(1);
	});

	test("caps backoff and stops consulting the retry filter after exhaustion", async () => {
		let calls = 0;
		let filterCalls = 0;
		await expect(retry(async () => { calls++; throw new Error("failure"); }, {
			retries: 2, baseDelayMs: 30_000, maxDelayMs: 0,
			shouldRetry: () => { filterCalls++; return true; },
		})).rejects.toThrow("failure");
		expect(calls).toBe(3);
		expect(filterCalls).toBe(2);
	});

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
