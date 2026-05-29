/**
 * Checks equality using SameValueZero semantics.
 *
 * SameValueZero is the equality model used by `Map`, `Set`,
 * `Array.prototype.includes`, and typed array `includes`.
 *
 * Key interview details:
 * - `NaN` equals `NaN`
 * - `0` equals `-0`
 * - objects only match by reference
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
export function sameValueZero(left: unknown, right: unknown): boolean {
	return (
		left === right ||
		(typeof left === "number" &&
			typeof right === "number" &&
			Number.isNaN(left) &&
			Number.isNaN(right))
	);
}

/**
 * Groups values into a `Map` by a key selector.
 *
 * This is the core pattern behind many array/hash-map interview questions:
 * transform each item into a stable key, then append it to that key's bucket.
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export function groupBy<TItem, TKey>(
	items: TItem[],
	getKey: (item: TItem, index: number) => TKey,
): Map<TKey, TItem[]> {
	const groups = new Map<TKey, TItem[]>();

	for (let index = 0; index < items.length; index++) {
		const item = items[index]!;
		const key = getKey(item, index);
		const group = groups.get(key);

		if (group) {
			group.push(item);
		} else {
			groups.set(key, [item]);
		}
	}

	return groups;
}

/**
 * Public operations exposed by the closure-backed counter example.
 */
export type Counter = {
	value: () => number;
	increment: (step?: number) => number;
	decrement: (step?: number) => number;
	reset: (nextValue?: number) => number;
};

/**
 * Builds a counter with private state captured in a closure.
 *
 * The returned object exposes behavior, but callers cannot directly mutate
 * the internal `current` variable.
 *
 * Time Complexity: O(1) per operation
 * Space Complexity: O(1)
 */
export function createCounter(initialValue = 0): Counter {
	let current = initialValue;

	return {
		value: () => current,
		increment: (step = 1) => {
			current += step;
			return current;
		},
		decrement: (step = 1) => {
			current -= step;
			return current;
		},
		reset: (nextValue = initialValue) => {
			current = nextValue;
			return current;
		},
	};
}

/**
 * Creates an iterable numeric range.
 *
 * This teaches the `Symbol.iterator` protocol that powers `for...of`,
 * spread syntax, `Array.from`, maps, sets, generators, and many runtime APIs.
 *
 * Time Complexity: O(n) to consume the iterable
 * Space Complexity: O(1), excluding consumed output
 */
export function range(
	startInclusive: number,
	endExclusive: number,
	step = 1,
): Iterable<number> {
	if (step === 0) {
		throw new Error("step must not be 0");
	}

	return {
		*[Symbol.iterator](): Iterator<number> {
			if (step > 0) {
				for (let value = startInclusive; value < endExclusive; value += step) {
					yield value;
				}
				return;
			}

			for (let value = startInclusive; value > endExclusive; value += step) {
				yield value;
			}
		},
	};
}

/**
 * Deep-clones a structured-clone-compatible value.
 *
 * Unlike JSON cloning, `structuredClone` preserves common built-ins such as
 * `Date`, `Map`, `Set`, `ArrayBuffer`, typed arrays, and circular references.
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export function cloneStructured<T>(value: T): T {
	return structuredClone(value);
}

/**
 * Promise plus externally exposed resolve/reject callbacks.
 */
export type Deferred<T> = {
	promise: Promise<T>;
	resolve: (value: T | PromiseLike<T>) => void;
	reject: (reason?: unknown) => void;
};

/**
 * Creates a promise whose resolution can be controlled externally.
 *
 * This is useful in tests, adapters around callback APIs, and interview
 * discussions about promise state. Avoid using it for normal application
 * control flow unless an external event really owns completion.
 */
export function createDeferred<T>(): Deferred<T> {
	let resolve!: (value: T | PromiseLike<T>) => void;
	let reject!: (reason?: unknown) => void;

	const promise = new Promise<T>((resolvePromise, rejectPromise) => {
		resolve = resolvePromise;
		reject = rejectPromise;
	});

	return { promise, resolve, reject };
}

/**
 * Memoizes a pure function using a caller-provided key function.
 *
 * Interview signal:
 * - memoization trades memory for repeated-work savings
 * - key choice is part of correctness
 * - do not memoize impure functions without a clear invalidation policy
 *
 * Time Complexity: O(1) average cache lookup plus key creation
 * Space Complexity: O(k), where k is number of unique keys
 */
export function memoizeByKey<TArgs extends unknown[], TResult>(
	fn: (...args: TArgs) => TResult,
	keyFor: (...args: TArgs) => string = (...args) => JSON.stringify(args),
): (...args: TArgs) => TResult {
	const cache = new Map<string, TResult>();

	return (...args: TArgs): TResult => {
		const key = keyFor(...args);

		if (cache.has(key)) {
			return cache.get(key)!;
		}

		const result = fn(...args);
		cache.set(key, result);
		return result;
	};
}

/**
 * Runs promise-returning task factories with a fixed concurrency limit.
 *
 * Promises start when their factory is called, so a scheduler must receive
 * functions instead of already-created promises.
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export async function runWithConcurrency<T>(
	tasks: Array<() => Promise<T>>,
	limit: number,
): Promise<T[]> {
	if (!Number.isInteger(limit) || limit < 1) {
		throw new Error("limit must be a positive integer");
	}

	if (tasks.length === 0) return [];

	const results = new Array<T>(tasks.length);
	let nextTaskIndex = 0;

	async function worker(): Promise<void> {
		while (nextTaskIndex < tasks.length) {
			const currentIndex = nextTaskIndex;
			nextTaskIndex++;
			results[currentIndex] = await tasks[currentIndex]!();
		}
	}

	const workerCount = Math.min(limit, tasks.length);
	await Promise.all(Array.from({ length: workerCount }, () => worker()));

	return results;
}
