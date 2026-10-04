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

/**
 * Tunable thresholds and time windows for a circuit breaker instance.
 */
export interface CircuitBreakerOptions {
	failureThreshold: number; // % failure rate to trip
	minimumRequests: number; // minimum requests before evaluating
	windowDuration: number; // rolling window (ms)
	resetTimeout: number; // how long before half-open (ms)
	timeout: number; // per-request timeout (ms)
	halfOpenMaxCalls?: number; // recovery probes required to succeed (default: 1)
}

interface MetricEvent {
	outcome: "success" | "failure";
	timestamp: number;
}

/**
 * Executes async work behind a closed/open/half-open circuit breaker.
 */
export class CircuitBreaker<TArgs extends unknown[], TResult> {
	private state: CircuitState = "CLOSED";
	private metrics: MetricEvent[] = [];
	private nextAttempt = 0;
	private halfOpenCalls = 0;
	private halfOpenSuccesses = 0;
	private generation = 0;

	constructor(
		private action: (...args: TArgs) => Promise<TResult>,
		private options: CircuitBreakerOptions,
		private fallback?: (...args: TArgs) => TResult | Promise<TResult>,
	) {
		if (
			!Number.isFinite(options.failureThreshold) ||
			options.failureThreshold <= 0 ||
			options.failureThreshold > 100
		) {
			throw new RangeError(
				"failureThreshold must be between 0 (exclusive) and 100",
			);
		}
		for (const [name, value] of Object.entries({
			minimumRequests: options.minimumRequests,
			halfOpenMaxCalls: options.halfOpenMaxCalls ?? 1,
		})) {
			if (!Number.isSafeInteger(value) || value < 1) {
				throw new RangeError(`${name} must be a positive safe integer`);
			}
		}
		for (const [name, value] of Object.entries({
			windowDuration: options.windowDuration,
			resetTimeout: options.resetTimeout,
			timeout: options.timeout,
		})) {
			if (!Number.isFinite(value) || value <= 0 || value > 2_147_483_647) {
				throw new RangeError(
					`${name} must be between 0 (exclusive) and 2147483647 ms`,
				);
			}
		}
		this.options = {
			...options,
			halfOpenMaxCalls: options.halfOpenMaxCalls ?? 1,
		};
	}

	/**
	 * Executes the action behind the circuit breaker, applying all protective logic.
	 * Time Complexity: O(n), where n is the number of outcomes in the window
	 * Space Complexity: O(n)
	 *
	 * Algorithm:
	 * 1. If OPEN and cooldown passed, transition to HALF_OPEN
	 * 2. If OPEN and cooldown not passed, use fallback or throw
	 * 3. If HALF_OPEN at max test calls limit, use fallback
	 * 4. Execute action with timeout
	 * 5. Record success/failure and update state as needed
	 *
	 * States:
	 * - CLOSED: Normal operation, all calls pass through
	 * - OPEN: Failing, fast-fail with fallback or throw
	 * - HALF_OPEN: Testing recovery with limited calls
	 *
	 * @param args - Arguments to pass to the underlying action
	 * @returns Promise resolving to the action result or fallback value
	 * @throws Error if action fails and no fallback available
	 *
	 * @example
	 * const breaker = new CircuitBreaker(asyncCall, { ... });
	 * const result = await breaker.fire(param1, param2);
	 */
	async fire(...args: TArgs): Promise<TResult> {
		if (this.state === "OPEN") {
			if (Date.now() >= this.nextAttempt) {
				this.state = "HALF_OPEN";
				this.generation++;
				this.halfOpenCalls = 0;
				this.halfOpenSuccesses = 0;
			} else {
				return this.handleFallback(args, new Error("Circuit is OPEN"));
			}
		}

		if (
			this.state === "HALF_OPEN" &&
			this.halfOpenCalls >= (this.options.halfOpenMaxCalls ?? 1)
		) {
			return this.handleFallback(args, new Error("Half-open limit reached"));
		}

		if (this.state === "HALF_OPEN") {
			this.halfOpenCalls++;
		}

		// Outcomes from an earlier state cannot close/reopen a newer circuit.
		const generation = this.generation;
		try {
			const result = await this.executeWithTimeout(args);
			if (generation === this.generation) this.recordSuccess();
			return result;
		} catch (err) {
			if (generation === this.generation) this.recordFailure();
			return this.handleFallback(args, err);
		}
	}

	private async executeWithTimeout(args: TArgs): Promise<TResult> {
		let timer: ReturnType<typeof setTimeout> | undefined;

		const timeout = new Promise<never>((_, reject) => {
			timer = setTimeout(
				() => reject(new Error("Execution timeout")),
				this.options.timeout,
			);
		});

		try {
			return await Promise.race([this.action(...args), timeout]);
		} finally {
			if (timer) clearTimeout(timer);
		}
	}

	private recordSuccess() {
		if (this.state === "HALF_OPEN") {
			this.halfOpenSuccesses++;
			if (this.halfOpenSuccesses >= (this.options.halfOpenMaxCalls ?? 1))
				this.reset();
			return;
		}
		this.metrics.push({ outcome: "success", timestamp: Date.now() });
		this.cleanupWindow();
	}

	private recordFailure() {
		if (this.state === "HALF_OPEN") {
			this.trip();
			return;
		}
		this.metrics.push({ outcome: "failure", timestamp: Date.now() });
		this.cleanupWindow();

		if (this.shouldTrip()) {
			this.trip();
		}
	}

	private shouldTrip(): boolean {
		const total = this.metrics.length;

		if (total < this.options.minimumRequests) return false;

		const failures = this.metrics.reduce(
			(count, metric) => count + Number(metric.outcome === "failure"),
			0,
		);
		const failureRate = (failures / total) * 100;
		return failureRate >= this.options.failureThreshold;
	}

	private trip() {
		this.generation++;
		this.state = "OPEN";
		this.nextAttempt = Date.now() + this.options.resetTimeout;
	}

	private reset() {
		this.generation++;
		this.state = "CLOSED";
		this.metrics = [];
	}

	private cleanupWindow() {
		const now = Date.now();
		const windowStart = now - this.options.windowDuration;

		this.metrics = this.metrics.filter(
			(metric) => metric.timestamp >= windowStart,
		);
	}

	private async handleFallback(args: TArgs, error: unknown): Promise<TResult> {
		if (this.fallback) {
			return await this.fallback(...args);
		}
		throw error;
	}

	/**
	 * Returns the current state of the circuit breaker.
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * Use this for monitoring and debugging circuit breaker behavior.
	 *
	 * @returns Current circuit state: 'CLOSED' (normal), 'OPEN' (failing fast), or 'HALF_OPEN' (testing recovery)
	 *
	 * @example
	 * const breaker = new CircuitBreaker(asyncCall, { ... });
	 * if (breaker.getState() === "OPEN") {
	 *   console.log("Service is down, using fallback");
	 * }
	 */
	getState(): CircuitState {
		return this.state;
	}
}
