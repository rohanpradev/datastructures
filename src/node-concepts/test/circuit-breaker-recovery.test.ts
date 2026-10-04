import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { CircuitBreaker, type CircuitBreakerOptions } from "../async/circuit-breaker";

const options: CircuitBreakerOptions = {
	failureThreshold: 50, minimumRequests: 2, windowDuration: 10,
	resetTimeout: 20, timeout: 1000,
};
const restored: Array<() => void> = [];
afterEach(() => { for (const restore of restored.splice(0)) restore(); });

function clock() {
	let now = 0;
	const mock = spyOn(Date, "now").mockImplementation(() => now);
	restored.push(() => mock.mockRestore());
	return (value: number) => { now = value; };
}

describe("CircuitBreaker recovery", () => {
	test("a failed recovery probe reopens even after rolling metrics expire", async () => {
		const advance = clock();
		const breaker = new CircuitBreaker(async () => { throw new Error("offline"); }, options, () => "fallback");
		await breaker.fire();
		await breaker.fire();
		expect(breaker.getState()).toBe("OPEN");
		advance(20);
		expect(await breaker.fire()).toBe("fallback");
		expect(breaker.getState()).toBe("OPEN");
	});

	test("allows only one default recovery probe and ignores a stale closed-state success", async () => {
		const advance = clock();
		const old = Promise.withResolvers<string>();
		const probe = Promise.withResolvers<string>();
		let calls = 0;
		const breaker = new CircuitBreaker(() => {
			calls++;
			if (calls === 1) return old.promise;
			if (calls === 2) return Promise.reject(new Error("offline"));
			return probe.promise;
		}, { ...options, minimumRequests: 1 }, () => "fallback");
		const pendingOld = breaker.fire();
		await breaker.fire();
		advance(20);
		const pendingProbe = breaker.fire();
		expect(await breaker.fire()).toBe("fallback");
		expect(calls).toBe(3);
		old.resolve("old result");
		expect(await pendingOld).toBe("old result");
		expect(breaker.getState()).toBe("HALF_OPEN");
		probe.resolve("recovered");
		expect(await pendingProbe).toBe("recovered");
		expect(breaker.getState()).toBe("CLOSED");
	});

	test("requires every admitted probe to succeed and ignores late results after failure", async () => {
		const advance = clock();
		const first = Promise.withResolvers<string>();
		const second = Promise.withResolvers<string>();
		let calls = 0;
		const breaker = new CircuitBreaker(() => {
			calls++;
			if (calls === 1) return Promise.reject(new Error("offline"));
			return calls === 2 ? first.promise : second.promise;
		}, { ...options, minimumRequests: 1, halfOpenMaxCalls: 2 }, () => "fallback");
		await breaker.fire();
		advance(20);
		const a = breaker.fire();
		const b = breaker.fire();
		first.reject(new Error("still offline"));
		expect(await a).toBe("fallback");
		second.resolve("late success");
		expect(await b).toBe("late success");
		expect(breaker.getState()).toBe("OPEN");
		advance(40);
		await breaker.fire();
		expect(breaker.getState()).toBe("HALF_OPEN");
		await breaker.fire();
		expect(breaker.getState()).toBe("CLOSED");
	});

	test("validates thresholds, probe counts, and timer ranges", () => {
		for (const invalid of [
			{ failureThreshold: NaN }, { failureThreshold: 101 }, { failureThreshold: 0 },
			{ minimumRequests: 0 }, { minimumRequests: 1.5 }, { halfOpenMaxCalls: 0 },
			{ windowDuration: Infinity }, { resetTimeout: -1 }, { timeout: 2 ** 31 },
		]) {
			expect(() => new CircuitBreaker(async () => "ok", { ...options, ...invalid })).toThrow(RangeError);
		}
	});
});
