/**
 * Coalesce concurrent loads for the same key without caching completed values.
 * Invariant: one unsettled promise per key; success AND failure remove it.
 * Trace: A starts product:1, B joins A, both receive 7, C starts a fresh load.
 * Map work is expected O(1) per call; space is O(k) active distinct keys.
 * Use tenant-qualified keys and an upstream deadline in production. This is
 * process-local: separate replicas still issue separate loads. A loader must
 * not recursively await its own key, which would create a promise cycle.
 */
export class SingleFlight<T> {
	private readonly pending = new Map<string, Promise<T>>();

	run(key: string, load: () => T | PromiseLike<T>): Promise<T> {
		const existing = this.pending.get(key);
		if (existing) return existing;

		// Defer invocation until the promise is registered, including sync throws.
		const result = Promise.resolve()
			.then(load)
			.finally(() => this.pending.delete(key));
		this.pending.set(key, result);
		return result;
	}

	size(): number {
		return this.pending.size;
	}
}
