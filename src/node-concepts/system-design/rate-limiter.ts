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

	/**
	 * Attempts to consume tokens from the bucket.
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * Refills tokens based on elapsed time since last call, then checks if enough tokens exist.
	 * Returns decision and remaining tokens or retry-after delay.
	 *
	 * Algorithm:
	 * 1. Calculate tokens to refill based on elapsed time
	 * 2. Cap refilled tokens at bucket capacity
	 * 3. If tokens >= cost, subtract cost and return allowed=true
	 * 4. Otherwise calculate time until enough tokens available
	 *
	 * @param nowMs - Current timestamp in milliseconds (default: Date.now())
	 * @param cost - Number of tokens to consume (default: 1)
	 * @returns RateLimitResult with decision (allowed) and retry info
	 *
	 * @example
	 * const limiter = new TokenBucketRateLimiter(10, 2); // 10 capacity, 2 refill/sec
	 * limiter.consume(); // { allowed: true, remaining: 9, retryAfterMs: 0 }
	 * limiter.consume(Date.now(), 15); // { allowed: false, remaining: 9, retryAfterMs: 3000 }
	 */
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

	/**
	 * Attempts to consume a token from the sliding window for a given key.
	 * Time Complexity: O(n) where n is average hits per key in the window
	 * Space Complexity: O(m) where m is number of tracked keys
	 *
	 * Cleans up expired entries before checking the limit.
	 * Allows up to `limit` hits within the `windowMs` rolling window.
	 *
	 * Algorithm:
	 * 1. Remove expired entries outside the current window
	 * 2. Check if hits within window >= limit
	 * 3. If not, record new hit and return allowed=true
	 * 4. If at limit, return retry-after time until oldest hit expires
	 *
	 * @param key - Identifier for rate limit tracking (e.g., user ID, IP address)
	 * @param nowMs - Current timestamp in milliseconds (default: Date.now())
	 * @returns RateLimitResult with decision and retry info
	 *
	 * @example
	 * const limiter = new SlidingWindowRateLimiter(10, 60000); // 10 requests per minute
	 * limiter.consume("user123"); // { allowed: true, remaining: 9, retryAfterMs: 0 }
	 * // After 11 calls in quick succession:
	 * limiter.consume("user123"); // { allowed: false, remaining: 0, retryAfterMs: ~60000 }
	 */
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

	/**
	 * Returns the number of distinct keys currently being tracked.
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * Useful for monitoring active clients or users being rate limited.
	 * Note: Stale keys are cleaned up lazily during consume() calls.
	 *
	 * @returns Number of keys with hit records still in memory
	 *
	 * @example
	 * const limiter = new SlidingWindowRateLimiter(10, 60000);
	 * limiter.consume("user1");
	 * limiter.consume("user2");
	 * limiter.trackedKeyCount(); // 2
	 */
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
