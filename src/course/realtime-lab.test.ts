import { describe, expect, test } from "bun:test";
import { createRealtimeLab } from "./realtime-lab";
import type { RoomEvent } from "@/node-concepts/system-design/durable-event-log";

function nextMessage(socket: WebSocket): Promise<any> {
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => finish(new Error("socket message deadline")), 2000);
		const onMessage = (event: MessageEvent) => finish(undefined, JSON.parse(String(event.data)));
		const onError = () => finish(new Error("socket failed before message"));
		function finish(error?: Error, value?: unknown) {
			clearTimeout(timeout);
			socket.removeEventListener("message", onMessage);
			socket.removeEventListener("error", onError);
			if (error) reject(error); else resolve(value);
		}
		socket.addEventListener("message", onMessage);
		socket.addEventListener("error", onError);
	});
}

describe("createRealtimeLab", () => {
	test("serves the lab and handles simultaneous retries with one durable append", async () => {
		const lab = createRealtimeLab({ port: 0 });
		// Bun 1.4.3: a scoped connection pool per dependency. This is transport
		// isolation, not an authentication boundary, concurrency limit or timeout.
		using session = new Bun.FetchSession({ keepAlive: { maxIdleSockets: 2 } });
		try {
			const page = await session.fetch(lab.server.url);
			expect(await page.text()).toContain("Systems in motion");
			const endpoint = new URL("api/rooms/orders/events", lab.server.url);
			const statuses = await Promise.all(Array.from({ length: 8 }, async () => {
				const response = await session.fetch(endpoint, { method: "POST", body: JSON.stringify({ eventId: "same", text: "packed" }) });
				await response.json(); // Consume the body so the connection is reusable.
				return response.status;
			}));
			expect(statuses.filter(status => status === 201)).toHaveLength(1);
			expect(statuses.filter(status => status === 200)).toHaveLength(7);
			const conflict = await session.fetch(endpoint, { method: "POST", body: JSON.stringify({ eventId: "same", text: "changed" }) });
			expect(conflict.status).toBe(409); await conflict.text();
			expect(lab.log.read("orders").events).toHaveLength(1);
			const metrics = await session.fetch(new URL("api/metrics", lab.server.url));
			expect(await metrics.json()).toMatchObject({ commits: 1, duplicates: 7 });
		} finally { session.close(); await lab.stop(); }
	});

	test("delivers live events and replays a disconnect gap without another room's events", async () => {
		const lab = createRealtimeLab({ port: 0 });
		const address = lab.server.url.toString().replace(/^http/, "ws");
		const first = new WebSocket(`${address}live/orders?after=0`);
		let second: WebSocket | undefined;
		try {
			expect(await nextMessage(first)).toMatchObject({ type: "snapshot", events: [] });
			const live = nextMessage(first);
			const publish = async (room: string, eventId: string) => {
				const response = await fetch(new URL(`api/rooms/${room}/events`, lab.server.url), { method: "POST", body: JSON.stringify({ eventId, text: eventId }) });
				return await response.json() as { event: RoomEvent };
			};
			await publish("private-room", "hidden");
			const sent = await publish("orders", "visible");
			expect(await live).toMatchObject({ type: "event", event: { eventId: "visible", room: "orders" } });
			first.close();
			await publish("orders", "offline");
			second = new WebSocket(`${address}live/orders?after=${sent.event.sequence}`);
			const replay = await nextMessage(second);
			expect(replay.type).toBe("snapshot");
			expect(replay.events.map((event: any) => event.eventId)).toEqual(["offline"]);
		} finally { first.close(); second?.close(); await lab.stop(); }
	});

	test("requires bounded HTTP catch-up when a socket replay would be too large", async () => {
		const lab = createRealtimeLab({ port: 0 });
		for (let i = 0; i < 26; i++) lab.log.append("a", String(i), "event");
		const socket = new WebSocket(`${lab.server.url.toString().replace(/^http/, "ws")}live/a`);
		try {
			expect(await nextMessage(socket)).toEqual({ type: "resync_required" });
			const response = await fetch(new URL("api/rooms/a/events?limit=25", lab.server.url));
			const page = await response.json() as { events: RoomEvent[]; hasMore: boolean };
			expect(page.events).toHaveLength(25);
			expect(page.hasMore).toBe(true);
		} finally { socket.close(); await lab.stop(); }
	});

	test("rejects malformed input, cross-origin writes, and unsupported methods", async () => {
		const lab = createRealtimeLab({ port: 0 });
		try {
			const endpoint = new URL("api/rooms/a/events", lab.server.url);
			for (const body of ["{", "null", JSON.stringify({ text: "missing ID" })]) {
				const response = await fetch(endpoint, { method: "POST", body });
				expect(response.status).toBe(400); await response.text();
			}
			const cases: [string, RequestInit, number][] = [
				["api/rooms/a/events", { method: "POST", headers: { Origin: "https://other.example" } }, 403],
				["api/rooms/a/events", { method: "DELETE" }, 405],
				["api/rooms/a/events?after=-1", {}, 400],
				["api/rooms/a/events?limit=101", {}, 400],
				["api/rooms/UPPER/events", {}, 400],
				["missing", {}, 404],
				["live/a", {}, 426],
			];
			for (const [path, init, status] of cases) {
				const response = await fetch(new URL(path, lab.server.url), init);
				expect(response.status).toBe(status); await response.text();
			}
		} finally { await lab.stop(); }
	});

	test("pins local hosts and the assigned port even when a foreign Origin matches", async () => {
		const lab = createRealtimeLab({ port: 0 });
		try {
			// Invoke the request handler directly: these rejected requests must
			// never reach storage, publish, or the WebSocket upgrade operation.
			const foreignOrigin = `http://rebound.example:${lab.server.port}`;
			for (const path of ["api/rooms/a/events", "live/a"]) {
				for (const origin of [undefined, foreignOrigin]) {
					const response = await lab.server.fetch(new Request(`${foreignOrigin}/${path}`, {
						headers: origin ? { Origin: origin } : {},
					}));
					expect(response.status).toBe(403);
					await response.text();
				}
			}
			const wrongPort = lab.server.port === 1 ? 2 : 1;
			const wrongAddress = `http://127.0.0.1:${wrongPort}/api/rooms/a/events`;
			expect((await lab.server.fetch(new Request(wrongAddress))).status).toBe(403);
			for (const hostname of ["127.0.0.1", "localhost"]) {
				const address = new URL("api/rooms/a/events", lab.server.url);
				address.hostname = hostname;
				const response = await lab.server.fetch(new Request(address.toString(), {
					headers: { Origin: address.origin },
				}));
				expect(response.status).toBe(200);
				expect(await response.json()).toMatchObject({ events: [] });
			}
			expect(lab.log.read("a").events).toEqual([]);
		} finally { await lab.stop(); }
	});

	test("bounds admission and gives a retry delay when writes exceed the bucket", async () => {
		const lab = createRealtimeLab({ port: 0, writeCapacity: 1 });
		try {
			const endpoint = new URL("api/rooms/a/events", lab.server.url);
			const first = await fetch(endpoint, { method: "POST", body: JSON.stringify({ eventId: "1", text: "first" }) });
			expect(first.status).toBe(201); await first.text();
			const second = await fetch(endpoint, { method: "POST", body: JSON.stringify({ eventId: "2", text: "rejected" }) });
			expect(second.status).toBe(429);
			expect(Number(second.headers.get("Retry-After"))).toBeGreaterThan(0); await second.text();
			expect(lab.log.read("a").events).toHaveLength(1);
		} finally { await lab.stop(); }
	});
});
