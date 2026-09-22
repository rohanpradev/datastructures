export interface FencedLease {
	readonly token: bigint;
	readonly expiresAtMs: number;
}

/**
 * A single-resource lease AND protected register in one in-memory authority.
 * Invariant: only the current, unexpired token may write or release ownership.
 * Trace: A gets 1, pauses; at expiry B gets 2 and writes; A's write is rejected.
 * Every operation is O(1) time and space, excluding the stored value.
 * Token ordering alone is insufficient: the protected storage must enforce it.
 * This model also checks expiry because it owns the lease authority. A separate
 * storage service normally rejects tokens older than its highest observed token;
 * it cannot infer lease expiry without coordination. Persist tokens and use a
 * linearizable authority in production; never reset the counter on restart.
 */
export class FencedRegister<T> {
	private nextToken = 0n;
	private lease: FencedLease | undefined;
	private value: T | undefined;
	private lastNow = 0;

	acquire(ttlMs: number, nowMs: number): FencedLease | null {
		if (!Number.isSafeInteger(ttlMs) || ttlMs <= 0) {
			throw new RangeError("ttlMs must be a positive safe integer");
		}
		if (!Number.isSafeInteger(nowMs + ttlMs)) {
			throw new RangeError("lease expiry must be a safe integer");
		}
		this.advanceClock(nowMs);
		if (this.lease && this.lease.expiresAtMs > nowMs) return null;
		this.lease = { token: ++this.nextToken, expiresAtMs: nowMs + ttlMs };
		return { ...this.lease };
	}

	write(token: bigint, value: T, nowMs: number): boolean {
		this.advanceClock(nowMs);
		if (!this.owns(token, nowMs)) return false;
		this.value = value;
		return true;
	}

	release(token: bigint, nowMs: number): boolean {
		this.advanceClock(nowMs);
		if (!this.owns(token, nowMs)) return false;
		this.lease = undefined;
		return true;
	}

	read(): T | undefined {
		return this.value;
	}

	private owns(token: bigint, nowMs: number): boolean {
		return this.lease?.token === token && this.lease.expiresAtMs > nowMs;
	}

	private advanceClock(nowMs: number): void {
		if (!Number.isSafeInteger(nowMs) || nowMs < this.lastNow) {
			throw new RangeError(
				"nowMs must be a non-negative monotonic safe integer",
			);
		}
		this.lastNow = nowMs;
	}
}
