/**
 * Retry budget and optional filtering for retryable failures.
 */
export interface RetryOptions {
	retries: number;
	baseDelayMs?: number;
	maxDelayMs?: number;
	signal?: AbortSignal;
	shouldRetry?: (error: unknown, attempt: number) => boolean;
}

/**
 * Resolves after delayMs unless the AbortSignal is aborted.
 *
 * Interview concept:
 * AbortController is the standard cancellation primitive for modern Node,
 * Bun, fetch, timers, and many web APIs.
 */
export function abortableDelay(
	delayMs: number,
	signal?: AbortSignal,
): Promise<void> {
	if (!signal) {
		return Bun.sleep(delayMs);
	}

	if (signal?.aborted) {
		return Promise.reject(new DOMException("Aborted", "AbortError"));
	}

	return new Promise((resolve, reject) => {
		const abort = () => {
			cleanup();
			reject(new DOMException("Aborted", "AbortError"));
		};
		const cleanup = () => {
			clearTimeout(timer);
			signal?.removeEventListener("abort", abort);
		};
		const timer = setTimeout(() => {
			cleanup();
			resolve();
		}, delayMs);

		signal?.addEventListener("abort", abort, { once: true });
	});
}

/**
 * Wraps a promise-producing operation with a timeout.
 *
 * Interview concept:
 * Timeouts prevent a dependency from consuming resources forever.
 */
export async function withTimeout<T>(
	operation: Promise<T>,
	timeoutMs: number,
	message = "Operation timed out",
): Promise<T> {
	let timer: ReturnType<typeof setTimeout> | undefined;

	const timeout = new Promise<never>((_, reject) => {
		timer = setTimeout(() => reject(new Error(message)), timeoutMs);
	});

	try {
		return await Promise.race([operation, timeout]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}

/**
 * Retries a failing async operation with capped linear backoff.
 * Cancellation stops waiting and prevents subsequent attempts. Pass the same
 * signal to the operation (for example fetch) to cancel work already in flight.
 *
 * Interview concept:
 * Retries should be bounded, delayed, and conditional. Production systems also
 * add jitter and idempotency keys.
 */
export async function retry<T>(
	operation: (attempt: number) => Promise<T>,
	options: RetryOptions,
): Promise<T> {
	const baseDelayMs = options.baseDelayMs ?? 0;
	const maxDelayMs = options.maxDelayMs ?? 30_000;
	if (!Number.isSafeInteger(options.retries) || options.retries < 0) {
		throw new RangeError("retries must be a non-negative safe integer");
	}
	for (const [name, value] of Object.entries({ baseDelayMs, maxDelayMs })) {
		if (!Number.isFinite(value) || value < 0 || value > 2_147_483_647) {
			throw new RangeError(
				`${name} must be between 0 and 2147483647 milliseconds`,
			);
		}
	}

	for (let attempt = 1; ; attempt++) {
		options.signal?.throwIfAborted();
		try {
			return await operation(attempt);
		} catch (error) {
			const hasAttemptsLeft = attempt <= options.retries;
			if (!hasAttemptsLeft) throw error;
			options.signal?.throwIfAborted();
			if (!(options.shouldRetry?.(error, attempt) ?? true)) throw error;

			if (baseDelayMs > 0) {
				await abortableDelay(
					Math.min(baseDelayMs * attempt, maxDelayMs),
					options.signal,
				);
			}
		}
	}
}
