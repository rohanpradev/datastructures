import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { FencedRegister } from "@/node-concepts/system-design/fenced-register";
import { SingleFlight } from "@/node-concepts/system-design/single-flight";
import { TransactionalOutbox } from "@/node-concepts/system-design/transactional-outbox";

describe("SingleFlight", () => {
	test("coalesces a burst and removes settled values instead of caching them", async () => {
		const flight = new SingleFlight<number>();
		let calls = 0;
		const load = () => ++calls;
		const requests = Array.from({ length: 100 }, () => flight.run("tenant:a", load));
		expect(new Set(requests).size).toBe(1);
		expect(flight.size()).toBe(1);
		expect(await Promise.all(requests)).toEqual(Array(100).fill(1));
		expect(flight.size()).toBe(0);
		expect(await flight.run("tenant:a", load)).toBe(2);
	});

	test("keeps different keys independent while loads are pending", async () => {
		const flight = new SingleFlight<number>();
		let finish!: (value: number) => void;
		const slow = flight.run("a", () => new Promise<number>((resolve) => { finish = resolve; }));
		expect(await flight.run("b", () => 9)).toBe(9);
		expect(flight.size()).toBe(1);
		finish(4);
		expect(await slow).toBe(4);
	});

	test("shares synchronous failures and allows a retry", async () => {
		const flight = new SingleFlight<number>();
		const first = flight.run("a", () => { throw new Error("offline"); });
		const second = flight.run("a", () => 99);
		expect(first).toBe(second);
		const results = await Promise.allSettled([first, second]);
		expect(results.map((result) => result.status)).toEqual(["rejected", "rejected"]);
		expect(flight.size()).toBe(0);
		expect(await flight.run("a", () => 3)).toBe(3);
	});

	test("cleans up asynchronous rejection", async () => {
		const flight = new SingleFlight<number>();
		await expect(flight.run("a", async () => { throw new Error("timeout"); })).rejects.toThrow("timeout");
		expect(flight.size()).toBe(0);
		expect(await flight.run("a", () => 5)).toBe(5);
	});
});

describe("FencedRegister", () => {
	test("rejects paused worker writes and stale releases after takeover", () => {
		const register = new FencedRegister<string>();
		const old = register.acquire(10, 0)!;
		expect(register.acquire(10, 9)).toBeNull();
		const current = register.acquire(10, 10)!;
		expect(current.token).toBeGreaterThan(old.token);
		expect(register.write(current.token, "new", 10)).toBe(true);
		expect(register.write(old.token, "stale", 11)).toBe(false);
		expect(register.release(old.token, 11)).toBe(false);
		expect(register.read()).toBe("new");
		expect(register.acquire(10, 11)).toBeNull();
	});

	test("expiry is exclusive even when nobody has acquired a new lease", () => {
		const register = new FencedRegister<number>();
		const lease = register.acquire(10, 0)!;
		expect(register.write(lease.token, 1, 9)).toBe(true);
		expect(register.write(lease.token, 2, 10)).toBe(false);
		expect(register.release(lease.token, 10)).toBe(false);
		expect(register.read()).toBe(1);
	});

	test("release permits reacquisition without token reuse", () => {
		const register = new FencedRegister<number>();
		expect(register.read()).toBeUndefined();
		expect(register.write(1n, 1, 0)).toBe(false);
		const first = register.acquire(20, 0)!;
		expect(register.release(first.token, 0)).toBe(true);
		expect(register.release(first.token, 0)).toBe(false);
		const second = register.acquire(20, 0)!;
		expect(second.token).toBeGreaterThan(first.token);
		expect(register.write(first.token, 1, 0)).toBe(false);
	});

	test("returned lease metadata cannot mutate internal ownership", () => {
		const register = new FencedRegister<number>();
		const lease = register.acquire(1, 0)!;
		Object.assign(lease, { expiresAtMs: 999, token: 99n });
		expect(register.write(99n, 1, 0)).toBe(false);
		expect(register.write(1n, 1, 1)).toBe(false);
	});

	test("rejects invalid TTLs, overflow, and backwards clocks", () => {
		const register = new FencedRegister<number>();
		for (const ttl of [0, -1, 0.5, NaN, Infinity]) {
			expect(() => register.acquire(ttl, 0)).toThrow(RangeError);
		}
		expect(() => register.acquire(1, Number.MAX_SAFE_INTEGER)).toThrow(RangeError);
		for (const now of [-1, 0.5, NaN, Infinity]) {
			expect(() => register.acquire(1, now)).toThrow(RangeError);
		}
		const lease = register.acquire(10, 5)!;
		expect(() => register.write(lease.token, 1, 4)).toThrow(RangeError);
		expect(() => register.release(lease.token, 4)).toThrow(RangeError);
	});
});

describe("TransactionalOutbox", () => {
	test("commits record and immutable event snapshots together", () => {
		const outbox = new TransactionalOutbox();
		try {
			expect(outbox.get("missing")).toBeUndefined();
			outbox.setWithEvent("order:1", "created", "e1");
			outbox.setWithEvent("order:1", "paid", "e2");
			expect(outbox.get("order:1")).toBe("paid");
			expect(outbox.pending().map(({ eventId, value }) => [eventId, value])).toEqual([
				["e1", "created"], ["e2", "paid"],
			]);
			expect(outbox.pending(1)).toHaveLength(1);
		} finally { outbox.close(); }
	});

	test("rolls back both an update and an insert when the event ID conflicts", () => {
		const outbox = new TransactionalOutbox();
		try {
			outbox.setWithEvent("a", "original", "event");
			expect(() => outbox.setWithEvent("a", "corrupted", "event")).toThrow();
			expect(() => outbox.setWithEvent("b", "orphan", "event")).toThrow();
			expect(outbox.get("a")).toBe("original");
			expect(outbox.get("b")).toBeUndefined();
			expect(outbox.pending()).toHaveLength(1);
		} finally { outbox.close(); }
	});

	test("redelivers until publish is acknowledged and retains ID uniqueness", () => {
		const outbox = new TransactionalOutbox();
		try {
			outbox.setWithEvent("a", "1", "e1");
			const delivered = outbox.pending();
			// A relay published this batch but crashed before recording success.
			expect(outbox.pending()).toEqual(delivered);
			expect(outbox.markPublished("e1")).toBe(true);
			expect(outbox.markPublished("e1")).toBe(false);
			expect(outbox.markPublished("unknown")).toBe(false);
			expect(outbox.pending()).toEqual([]);
			expect(() => outbox.setWithEvent("a", "2", "e1")).toThrow();
			expect(outbox.get("a")).toBe("1");
		} finally { outbox.close(); }
	});

	test("keeps pending events and publication status across database reopen", () => {
		const directory = mkdtempSync(join(tmpdir(), "outbox-test-"));
		const filename = join(directory, "events.sqlite");
		let outbox = new TransactionalOutbox(filename);
		try {
			outbox.setWithEvent("a", "1", "e1");
			outbox.setWithEvent("b", "2", "e2");
			outbox.markPublished("e1");
			outbox.close();
			outbox = new TransactionalOutbox(filename);
			expect(outbox.get("a")).toBe("1");
			expect(outbox.pending().map((event) => event.eventId)).toEqual(["e2"]);
		} finally {
			outbox.close();
			rmSync(directory, { recursive: true, force: true });
		}
	});

	test("validates batch bounds and required identifiers before writes", () => {
		const outbox = new TransactionalOutbox();
		try {
			for (const limit of [0, -1, 1.5, NaN, Infinity, 1001]) {
				expect(() => outbox.pending(limit)).toThrow(RangeError);
			}
			expect(() => outbox.setWithEvent(" ", "1", "e1")).toThrow();
			expect(() => outbox.setWithEvent("a", "1", " ")).toThrow();
			expect(outbox.pending()).toEqual([]);
		} finally { outbox.close(); }
	});
});
