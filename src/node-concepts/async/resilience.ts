export interface RetryOptions {
	retries: number;
	baseDelayMs?: number;
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
 * Retries a failing async operation with linear backoff.
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
	let lastError: unknown;

	for (let attempt = 1; attempt <= options.retries + 1; attempt++) {
		try {
			return await operation(attempt);
		} catch (error) {
			lastError = error;

			const hasAttemptsLeft = attempt <= options.retries;
			const canRetry = options.shouldRetry?.(error, attempt) ?? true;
			if (!hasAttemptsLeft || !canRetry) break;

			if (baseDelayMs > 0) {
				await abortableDelay(baseDelayMs * attempt);
			}
		}
	}

	throw lastError;
}
