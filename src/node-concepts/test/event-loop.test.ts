import { describe, expect, test } from "bun:test";
import {
	processInChunks,
	recordEventLoopOrder,
} from "@/node-concepts/basics/event-loop";

describe("recordEventLoopOrder", () => {
	test("records sync work before microtasks and timers", async () => {
		const order = await recordEventLoopOrder();

		expect(order[0]).toBe("sync:start");
		expect(order[1]).toBe("sync:end");
		expect(order.slice(2, 4).sort()).toEqual([
			"microtask:promise",
			"microtask:queueMicrotask",
		]);
		expect(order[4]).toBe("macrotask:timer");
	});
});

describe("processInChunks", () => {
	test("visits every item", async () => {
		const seen: number[] = [];

		await processInChunks([1, 2, 3, 4, 5], 2, (item) => {
			seen.push(item);
		});

		expect(seen).toEqual([1, 2, 3, 4, 5]);
	});

	test("rejects invalid chunk sizes", async () => {
		await expect(processInChunks([1], 0, () => {})).rejects.toThrow(
			"chunkSize must be at least 1",
		);
	});
});
