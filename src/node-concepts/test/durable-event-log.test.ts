import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DurableEventLog } from "@/node-concepts/system-design/durable-event-log";

describe("DurableEventLog", () => {
	test("deduplicates matching retries and rejects conflicting payloads atomically", () => {
		using log = new DurableEventLog();
		const first = log.append("orders", "event-1", "packed");
		expect(first.created).toBe(true);
		expect(log.append("orders", "event-1", "packed")).toEqual({
			event: first.event,
			created: false,
		});
		expect(() => log.append("orders", "event-1", "shipped")).toThrow(
			"different payload",
		);
		expect(log.read("orders").events).toEqual([first.event]);
	});

	test("paginates by indexed cursor with room scoping and global sequence gaps", () => {
		using log = new DurableEventLog();
		log.append("a", "1", "first");
		log.append("b", "1", "other room");
		const last = log.append("a", "2", "last");
		const page = log.read("a", 0, 1);
		expect(page.events.map((e) => e.text)).toEqual(["first"]);
		expect(page.hasMore).toBe(true);
		expect(log.read("a", page.nextCursor, 1)).toEqual({
			events: [last.event],
			nextCursor: last.event.sequence,
			hasMore: false,
		});
		expect(log.read("a", last.event.sequence).events).toEqual([]);
		expect(log.read("missing").nextCursor).toBe(0);
	});

	test("keeps replay and deduplication state after closing and reopening a file", () => {
		const directory = mkdtempSync(join(tmpdir(), "course-event-log-"));
		const filename = join(directory, "events.sqlite");
		try {
			let sequence: number;
			{
				using log = new DurableEventLog(filename);
				sequence = log.append("a", "1", "durable").event.sequence;
			}
			{
				using log = new DurableEventLog(filename);
				expect(log.append("a", "1", "durable").created).toBe(false);
				expect(log.read("a").events[0].text).toBe("durable");
				expect(
					log.append("a", "2", "after restart").event.sequence,
				).toBeGreaterThan(sequence);
			}
		} finally {
			rmSync(directory, { recursive: true, force: true });
		}
	});

	test("rejects invalid payloads and cursor boundaries without appending", () => {
		using log = new DurableEventLog();
		for (const room of ["", "../private", "UPPER", "a".repeat(49)])
			expect(() => log.append(room, "id", "text")).toThrow();
		for (const id of ["", "has spaces", "x".repeat(81)])
			expect(() => log.append("a", id, "text")).toThrow();
		for (const text of ["", "  ", "x".repeat(501)])
			expect(() => log.append("a", "id", text)).toThrow();
		for (const after of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])
			expect(() => log.read("a", after)).toThrow();
		for (const limit of [0, -1, 1.5, 101, NaN])
			expect(() => log.read("a", 0, limit)).toThrow();
		expect(log.read("a").events).toEqual([]);
	});
});
