import { describe, expect, test } from "bun:test";
import { EventBus } from "@/node-concepts/async/pub-sub";

type TestEvents = {
	ready: string;
};

describe("EventBus", () => {
	test("unsubscribes one-time listeners even when they reject", async () => {
		const bus = new EventBus<TestEvents>();
		let calls = 0;

		bus.subscribeOnce("ready", async () => {
			calls++;
			throw new Error("listener failed");
		});

		await bus.publish("ready", "first");
		await bus.publish("ready", "second");

		expect(calls).toBe(1);
	});

	test("returned unsubscribe removes regular listeners", async () => {
		const bus = new EventBus<TestEvents>();
		let calls = 0;
		const unsubscribe = bus.subscribe("ready", () => {
			calls++;
		});

		await bus.publish("ready", "first");
		unsubscribe();
		await bus.publish("ready", "second");

		expect(calls).toBe(1);
	});
});
