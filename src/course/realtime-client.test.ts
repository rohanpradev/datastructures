import { describe, expect, test } from "bun:test";
import { runInNewContext } from "node:vm";

const html = await Bun.file(new URL("./realtime-lab.html", import.meta.url)).text();
const clientScript = /<script type="module">([\s\S]*?)<\/script>/.exec(html)?.[1];
if (!clientScript) throw new Error("The lab client script is missing");

async function clientHarness() {
	const listeners = new Map<string, () => void>();
	const intervals = new Set<number>();
	const elements = new Map<string, {
		textContent: string;
		onclick?: () => void;
	}>();
	let nextInterval = 0;
	const element = (id: string) => {
		let current = elements.get(id);
		if (!current) {
			current = { textContent: "" };
			elements.set(id, current);
		}
		return current;
	};
	const sockets: FakeSocket[] = [];
	class FakeSocket {
		closed = false;
		onopen?: () => void;
		onclose?: () => void;
		constructor(readonly url: string) { sockets.push(this); }
		close() { this.closed = true; this.onclose?.(); }
	}
	const settle = () => new Promise<void>(resolve => setImmediate(resolve));
	runInNewContext(clientScript!, {
		document: { getElementById: element },
		location: { origin: "http://127.0.0.1:3002" },
		WebSocket: FakeSocket,
		fetch: async (url: string) => ({
			ok: true,
			json: async () => url === "/api/metrics"
				? { commits: 0, duplicates: 0, replayed: 0 }
				: { events: [], hasMore: false },
		}),
		addEventListener: (name: string, callback: () => void) => listeners.set(name, callback),
		setInterval: () => { const id = ++nextInterval; intervals.add(id); return id; },
		clearInterval: (id: number) => intervals.delete(id),
		setTimeout: () => { throw new Error("Unexpected reconnect timer"); },
		clearTimeout: () => {},
	});
	await settle();
	return { listeners, intervals, sockets, element, settle };
}

describe("real-time client page lifecycle", () => {
	test("reconnects and restarts metrics after a cached page is restored", async () => {
		const client = await clientHarness();
		expect(client.sockets).toHaveLength(1);
		expect(client.intervals.size).toBe(1);
		// The initial pageshow event must not create a second connection.
		client.listeners.get("pageshow")!();
		await client.settle();
		expect(client.sockets).toHaveLength(1);
		client.sockets[0].onopen!();
		expect(client.element("status").textContent).toBe("Live");
		client.listeners.get("pagehide")!();
		expect(client.sockets[0].closed).toBe(true);
		expect(client.intervals.size).toBe(0);
		client.listeners.get("pageshow")!();
		await client.settle();
		expect(client.sockets).toHaveLength(2);
		expect(client.intervals.size).toBe(1);
		client.sockets[1].onopen!();
		expect(client.element("status").textContent).toBe("Live");
	});

	test("preserves a deliberate disconnect across page restoration", async () => {
		const client = await clientHarness();
		client.element("connection").onclick!();
		expect(client.element("status").textContent).toBe("Disconnected");
		client.listeners.get("pagehide")!();
		client.listeners.get("pageshow")!();
		await client.settle();
		expect(client.sockets).toHaveLength(1);
		expect(client.intervals.size).toBe(1);
		expect(client.element("connection").textContent).toBe("Reconnect");
		expect(client.element("status").textContent).toBe("Disconnected");
	});
});
