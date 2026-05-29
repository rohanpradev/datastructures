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
		expect(bus.listenerCount("ready")).toBe(0);
	});

	test("detaches one-time listeners before awaiting user code", async () => {
		const bus = new EventBus<TestEvents>();
		let release!: () => void;
		let calls = 0;

		const publishPromise = bus.publish("ready", "first");
		bus.subscribeOnce("ready", async () => {
			calls++;
			await new Promise<void>((resolve) => {
				release = resolve;
			});
		});

		await publishPromise;
		expect(calls).toBe(0);

		const pendingPublish = bus.publish("ready", "second");
		await Promise.resolve();

		expect(calls).toBe(1);
		expect(bus.listenerCount("ready")).toBe(0);

		release();
		await pendingPublish;
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

	test("using disposes subscriptions at block exit", async () => {
		const bus = new EventBus<TestEvents>();
		let calls = 0;

		{
			using _subscription = bus.subscribe("ready", () => {
				calls++;
			});

			await bus.publish("ready", "inside");
		}

		await bus.publish("ready", "outside");

		expect(calls).toBe(1);
	});
});
