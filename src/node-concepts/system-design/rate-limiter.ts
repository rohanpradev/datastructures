/**
 * Decision returned by rate limiter consume operations.
 */
export interface RateLimitResult {
	allowed: boolean;
	remaining: number;
	retryAfterMs: number;
}

/**
 * Token bucket rate limiter.
 *
 * System design use:
 * - Smooths bursts while enforcing a refill rate.
 * - Useful for API gateways and user/IP request limits.
 */
export class TokenBucketRateLimiter {
	private tokens: number;
	private lastRefillMs: number;

	constructor(
		private readonly capacity: number,
		private readonly refillTokensPerSecond: number,
		nowMs = Date.now(),
	) {
		if (capacity < 1) throw new Error("capacity must be at least 1");
		if (refillTokensPerSecond <= 0) {
			throw new Error("refillTokensPerSecond must be positive");
		}

		this.tokens = capacity;
		this.lastRefillMs = nowMs;
	}

	consume(nowMs = Date.now(), cost = 1): RateLimitResult {
		if (cost < 1) throw new Error("cost must be at least 1");

		this.refill(nowMs);

		if (this.tokens >= cost) {
			this.tokens -= cost;
			return {
				allowed: true,
				remaining: Math.floor(this.tokens),
				retryAfterMs: 0,
			};
		}

		const missingTokens = cost - this.tokens;
		const retryAfterMs = Math.ceil(
			(missingTokens / this.refillTokensPerSecond) * 1000,
		);

		return {
			allowed: false,
			remaining: Math.floor(this.tokens),
			retryAfterMs,
		};
	}

	private refill(nowMs: number): void {
		const elapsedMs = Math.max(0, nowMs - this.lastRefillMs);
		const refillAmount = (elapsedMs / 1000) * this.refillTokensPerSecond;

		this.tokens = Math.min(this.capacity, this.tokens + refillAmount);
		this.lastRefillMs = nowMs;
	}
}

/**
 * Sliding window rate limiter.
 *
 * System design use:
 * - Enforces a hard maximum number of events in a rolling time window.
 * - Useful when fairness matters more than allowing bursts.
 */
export class SlidingWindowRateLimiter {
	private readonly hitsByKey = new Map<string, number[]>();

	constructor(
		private readonly limit: number,
		private readonly windowMs: number,
	) {
		if (limit < 1) throw new Error("limit must be at least 1");
		if (windowMs < 1) throw new Error("windowMs must be at least 1");
	}

	consume(key: string, nowMs = Date.now()): RateLimitResult {
		this.cleanupExpiredKeys(nowMs);
		const hits = this.hitsByKey.get(key) ?? [];

		if (hits.length >= this.limit) {
			return {
				allowed: false,
				remaining: 0,
				retryAfterMs: hits[0]! + this.windowMs - nowMs,
			};
		}

		hits.push(nowMs);
		this.hitsByKey.set(key, hits);

		return {
			allowed: true,
			remaining: this.limit - hits.length,
			retryAfterMs: 0,
		};
	}

	trackedKeyCount(): number {
		return this.hitsByKey.size;
	}

	private cleanupExpiredKeys(nowMs: number): void {
		const windowStart = nowMs - this.windowMs;

		for (const [key, hits] of this.hitsByKey) {
			const freshHits = hits.filter((timestamp) => timestamp > windowStart);

			if (freshHits.length === 0) {
				this.hitsByKey.delete(key);
			} else if (freshHits.length !== hits.length) {
				this.hitsByKey.set(key, freshHits);
			}
		}
	}
}
