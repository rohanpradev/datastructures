export interface IdempotencyStoreOptions {
	inFlightTtlMs: number;
	replayTtlMs: number;
}

export type IdempotencyClaim<TResponse> =
	| { status: "started" }
	| { status: "conflict"; retryAfterMs: number }
	| { status: "replay"; response: TResponse };

type IdempotencyRecord<TResponse> =
	| { status: "in-flight"; expiresAtMs: number }
	| { status: "completed"; expiresAtMs: number; response: TResponse };

/**
 * In-memory idempotency-key store for retry-safe write APIs.
 *
 * System design use:
 * - First request for a key performs the write.
 * - Concurrent duplicate requests receive a conflict/retry signal.
 * - Later duplicates receive the completed response until the replay TTL expires.
 *
 * Production upgrade: move the state machine to Redis or SQL with an atomic
 * "insert if absent" operation, because process-local memory is not shared.
 */
export class IdempotencyKeyStore<TResponse> {
	private readonly records = new Map<string, IdempotencyRecord<TResponse>>();

	constructor(private readonly options: IdempotencyStoreOptions) {
		if (options.inFlightTtlMs < 1) {
			throw new Error("inFlightTtlMs must be at least 1");
		}
		if (options.replayTtlMs < 1) {
			throw new Error("replayTtlMs must be at least 1");
		}
	}

	/**
	 * Claims an idempotency key before running a write.
	 *
	 * Time: O(e) for lazy expiry cleanup, where e is the number of expired keys.
	 * Steady-state lookup/update is O(1).
	 */
	claim(key: string, nowMs = Date.now()): IdempotencyClaim<TResponse> {
		this.validateKey(key);
		this.pruneExpired(nowMs);

		const record = this.records.get(key);
		if (!record) {
			this.records.set(key, {
				expiresAtMs: nowMs + this.options.inFlightTtlMs,
				status: "in-flight",
			});
			return { status: "started" };
		}

		if (record.status === "in-flight") {
			return {
				retryAfterMs: Math.max(0, record.expiresAtMs - nowMs),
				status: "conflict",
			};
		}

		return { response: record.response, status: "replay" };
	}

	complete(key: string, response: TResponse, nowMs = Date.now()): void {
		this.validateKey(key);
		const record = this.records.get(key);

		if (!record || record.status !== "in-flight") {
			throw new Error("idempotency key was not claimed");
		}

		this.records.set(key, {
			expiresAtMs: nowMs + this.options.replayTtlMs,
			response,
			status: "completed",
		});
	}

	/**
	 * Releases a failed write so the same client can retry with the same key.
	 */
	fail(key: string): boolean {
		this.validateKey(key);
		const record = this.records.get(key);
		if (!record || record.status !== "in-flight") return false;

		return this.records.delete(key);
	}

	pruneExpired(nowMs = Date.now()): number {
		let removed = 0;

		for (const [key, record] of this.records) {
			if (record.expiresAtMs > nowMs) continue;

			this.records.delete(key);
			removed++;
		}

		return removed;
	}

	size(): number {
		return this.records.size;
	}

	private validateKey(key: string): void {
		if (key.trim().length === 0) {
			throw new Error("idempotency key must not be empty");
		}
	}
}
