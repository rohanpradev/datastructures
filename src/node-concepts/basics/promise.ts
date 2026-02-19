/**
 * MyPromiseInternal
 * -----------------
 * Internal promise-like class that manages state and handlers.
 * Does not provide .then/.catch/.finally methods directly.
 */
export class MyPromiseInternal<T> {
	/** Current state of the promise: pending, fulfilled, or rejected */
	state: "pending" | "fulfilled" | "rejected" = "pending";

	/** Value when fulfilled or reason when rejected */
	value?: T;

	/** Handlers waiting for resolution */
	handlers: Array<{
		onFulfilled?: (value: T) => void;
		onRejected?: (reason: any) => void;
	}> = [];

	/**
	 * Creates a new MyPromiseInternal
	 * @param executor Function with resolve and reject callbacks
	 */
	constructor(
		executor: (
			resolve: (value: T | MyPromiseInternal<T>) => void,
			reject: (reason: any) => void,
		) => void,
	) {
		const resolve = (value: T | MyPromiseInternal<T>) =>
			this.updateState("fulfilled", value);
		const reject = (reason: any) => this.updateState("rejected", reason);

		try {
			executor(resolve, reject);
		} catch (err) {
			reject(err);
		}
	}

	/**
	 * Updates the state of the promise and triggers handlers
	 * @param state "fulfilled" or "rejected"
	 * @param value Value or reason
	 */
	private updateState(
		state: "fulfilled" | "rejected",
		value: T | MyPromiseInternal<T> | any,
	): void {
		if (this.state !== "pending") return; // Ignore if already resolved/rejected

		// Flatten nested MyPromiseInternal
		if (state === "fulfilled" && value instanceof MyPromiseInternal) {
			myThen(
				value,
				(v) => this.updateState("fulfilled", v),
				(r) => this.updateState("rejected", r),
			);
			return;
		}

		this.state = state;
		this.value = value;

		// Run all queued handlers asynchronously
		queueMicrotask(() => {
			this.handlers.forEach((h) => {
				if (state === "fulfilled" && h.onFulfilled) h.onFulfilled(value);
				if (state === "rejected" && h.onRejected) h.onRejected(value);
			});
			this.handlers = []; // Clear handlers after execution
		});
	}
}

/**
 * Functional equivalent of .then
 * @param promise The MyPromiseInternal instance
 * @param onFulfilled Called when promise is fulfilled
 * @param onRejected Called when promise is rejected
 * @returns A new MyPromiseInternal for chaining
 */
function myThen<T, U>(
	promise: MyPromiseInternal<T>,
	onFulfilled?: (value: T) => U | MyPromiseInternal<U>,
	onRejected?: (reason: any) => U | MyPromiseInternal<U>,
): MyPromiseInternal<U> {
	return new MyPromiseInternal<U>((resolve, reject) => {
		const handler = {
			// Wrap to keep parameter type as T
			onFulfilled: (value: T) => {
				if (!onFulfilled) return resolve(value as unknown as U); // no callback, just resolve
				try {
					const result = onFulfilled(value);
					if (result instanceof MyPromiseInternal) {
						myThen(result, resolve, reject);
					} else {
						resolve(result);
					}
				} catch (err) {
					reject(err);
				}
			},
			onRejected: (reason: any) => {
				if (!onRejected) return reject(reason);
				try {
					const result = onRejected(reason);
					if (result instanceof MyPromiseInternal) {
						myThen(result, resolve, reject);
					} else {
						resolve(result);
					}
				} catch (err) {
					reject(err);
				}
			},
		};

		if (promise.state === "pending") {
			promise.handlers.push(handler); // Now safe: parameter types match
		} else {
			queueMicrotask(() => {
				if (promise.state === "fulfilled")
					handler.onFulfilled(promise.value as T);
				if (promise.state === "rejected") handler.onRejected(promise.value);
			});
		}
	});
}

/**
 * Functional equivalent of .catch
 * @param promise The MyPromiseInternal instance
 * @param onRejected Called when promise is rejected
 * @returns A new MyPromiseInternal for chaining
 */
export function myCatch<T>(
	promise: MyPromiseInternal<T>,
	onRejected: (reason: any) => T | MyPromiseInternal<T>,
): MyPromiseInternal<T> {
	return myThen(promise, undefined, onRejected);
}

/**
 * Functional equivalent of .finally
 * @param promise The MyPromiseInternal instance
 * @param callback Called regardless of fulfillment or rejection
 * @returns A new MyPromiseInternal for chaining
 */
export function myFinally<T>(
	promise: MyPromiseInternal<T>,
	callback: () => void,
): MyPromiseInternal<T> {
	return myThen(
		promise,
		(value) => {
			callback();
			return value;
		},
		(reason) => {
			callback();
			throw reason;
		},
	);
}
