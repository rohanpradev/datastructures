/**
 * 🔌 Circuit Breaker Pattern
 *
 * A circuit breaker is a resilience pattern that protects systems from
 * cascading failures when a dependent service becomes unavailable or unstable.
 *
 * It works by:
 * - Detecting repeated failures
 * - Temporarily blocking calls to the failing service
 * - Allowing the service time to recover
 * - Gradually restoring traffic once stability is confirmed
 *
 * The circuit breaker operates in three states:
 *
 * 1. Closed
 *    - Normal operation
 *    - All requests pass through
 *    - Failures are monitored
 *
 * 2. Open
 *    - Failure threshold exceeded
 *    - All requests are blocked (fail fast)
 *    - A cooldown timer starts
 *
 * 3. Half-Open
 *    - After cooldown, a limited number of test requests are allowed
 *    - If they succeed → transition to Closed
 *    - If they fail → transition back to Open
 */

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitBreakerOptions {
	failureThreshold: number; // % failure rate to trip
	minimumRequests: number; // minimum requests before evaluating
	windowDuration: number; // rolling window (ms)
	resetTimeout: number; // how long before half-open (ms)
	timeout: number; // per-request timeout (ms)
	halfOpenMaxCalls?: number; // test calls allowed in HALF_OPEN
}

interface Metrics {
	success: number;
	failure: number;
	timestamps: number[];
}

export class CircuitBreaker<TArgs extends any[], TResult> {
	private state: CircuitState = "CLOSED";
	private metrics: Metrics = { success: 0, failure: 0, timestamps: [] };
	private nextAttempt = 0;
	private halfOpenCalls = 0;

	constructor(
		private action: (...args: TArgs) => Promise<TResult>,
		private options: CircuitBreakerOptions,
		private fallback?: (...args: TArgs) => TResult | Promise<TResult>,
	) {}

	async fire(...args: TArgs): Promise<TResult> {
		if (this.state === "OPEN") {
			if (Date.now() > this.nextAttempt) {
				this.state = "HALF_OPEN";
				this.halfOpenCalls = 0;
			} else {
				return this.handleFallback(args, new Error("Circuit is OPEN"));
			}
		}

		if (
			this.state === "HALF_OPEN" &&
			this.options.halfOpenMaxCalls &&
			this.halfOpenCalls >= this.options.halfOpenMaxCalls
		) {
			return this.handleFallback(args, new Error("Half-open limit reached"));
		}

		if (this.state === "HALF_OPEN") {
			this.halfOpenCalls++;
		}

		try {
			const result = await this.executeWithTimeout(args);
			this.recordSuccess();
			return result;
		} catch (err) {
			this.recordFailure();
			return this.handleFallback(args, err);
		}
	}

	private async executeWithTimeout(args: TArgs): Promise<TResult> {
		return await Promise.race([
			this.action(...args),
			new Promise<never>((_, reject) =>
				setTimeout(
					() => reject(new Error("Execution timeout")),
					this.options.timeout,
				),
			),
		]);
	}

	private recordSuccess() {
		this.metrics.success++;
		this.cleanupWindow();

		if (this.state === "HALF_OPEN") {
			this.reset();
		}
	}

	private recordFailure() {
		this.metrics.failure++;
		this.metrics.timestamps.push(Date.now());
		this.cleanupWindow();

		if (this.shouldTrip()) {
			this.trip();
		}
	}

	private shouldTrip(): boolean {
		const total = this.metrics.success + this.metrics.failure;

		if (total < this.options.minimumRequests) return false;

		const failureRate = (this.metrics.failure / total) * 100;
		return failureRate >= this.options.failureThreshold;
	}

	private trip() {
		this.state = "OPEN";
		this.nextAttempt = Date.now() + this.options.resetTimeout;
	}

	private reset() {
		this.state = "CLOSED";
		this.metrics = { success: 0, failure: 0, timestamps: [] };
	}

	private cleanupWindow() {
		const now = Date.now();
		const windowStart = now - this.options.windowDuration;

		this.metrics.timestamps = this.metrics.timestamps.filter(
			(ts) => ts >= windowStart,
		);
	}

	private async handleFallback(args: TArgs, error: any): Promise<TResult> {
		if (this.fallback) {
			return await this.fallback(...args);
		}
		throw error;
	}

	getState() {
		return this.state;
	}
}
