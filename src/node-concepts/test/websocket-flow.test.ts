import { describe, expect, test } from "bun:test";
import {
	createWebSocketWorkServer,
	type WebSocketWorkConnection,
} from "@/node-concepts/bun-runtime/websocket-flow";

function nextEvent<K extends keyof Bun.WebSocketEventMap>(
	socket: WebSocket,
	type: K,
): Promise<Bun.WebSocketEventMap[K]> {
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => {
			socket.removeEventListener(type, receive);
			reject(new Error(`Timed out waiting for WebSocket ${type}`));
		}, 2000);
		function receive(event: Bun.WebSocketEventMap[K]) {
			clearTimeout(timeout);
			resolve(event);
		}
		socket.addEventListener(type, receive, { once: true });
	});
}

function receiveReplies(socket: WebSocket, count: number): Promise<unknown[]> {
	return new Promise((resolve, reject) => {
		const replies: unknown[] = [];
		const timeout = setTimeout(() => finish(new Error("Reply deadline")), 2000);
		const closed = () => finish(new Error("Socket closed before all replies"));
		const receive = (event: MessageEvent) => {
			try {
				replies.push(JSON.parse(String(event.data)));
				if (replies.length === count) finish();
			} catch (error) {
				finish(error);
			}
		};
		function finish(error?: unknown) {
			clearTimeout(timeout);
			socket.removeEventListener("message", receive);
			socket.removeEventListener("close", closed);
			if (error) reject(error);
			else resolve(replies);
		}
		socket.addEventListener("message", receive);
		socket.addEventListener("close", closed);
	});
}

describe("createWebSocketWorkServer", () => {
	test("pauses socket reads during asynchronous work, preserves FIFO, and resumes", async () => {
		const started = Promise.withResolvers<void>();
		const release = Promise.withResolvers<void>();
		let serverSocket: Bun.ServerWebSocket<WebSocketWorkConnection> | undefined;
		const pausedWhileWorking: boolean[] = [];
		const server = createWebSocketWorkServer(async (request, socket) => {
			serverSocket = socket;
			pausedWhileWorking.push(socket.isPaused);
			if (request.id === 1) {
				started.resolve();
				await release.promise;
			}
			return request.text.toUpperCase();
		});
		const client = new WebSocket(
			new URL("/work", server.url).href.replace(/^http/, "ws"),
		);
		try {
			await nextEvent(client, "open");
			const replies = receiveReplies(client, 2);
			client.send(JSON.stringify({ id: 1, text: "first" }));
			await started.promise;
			expect(serverSocket?.isPaused).toBe(true);
			client.send(JSON.stringify({ id: 2, text: "second" }));
			release.resolve();
			expect(await replies).toEqual([
				{ id: 1, result: "FIRST" },
				{ id: 2, result: "SECOND" },
			]);
			expect(pausedWhileWorking).toEqual([true, true]);
			expect(serverSocket?.isPaused).toBe(false);
			expect(serverSocket?.data.pending).toBe(0);
			const resumedReply = receiveReplies(client, 1);
			client.send(JSON.stringify({ id: 3, text: "resumed" }));
			expect(await resumedReply).toEqual([{ id: 3, result: "RESUMED" }]);
		} finally {
			release.resolve();
			client.close();
			await server.stop(true);
		}
	});

	test("closes only the failing client for synchronous protocol errors and rejected work", async () => {
		const server = createWebSocketWorkServer(async (request) => {
			if (request.text === "reject") throw new Error("processing failed");
			return request.text;
		});
		const url = new URL("/work", server.url).href.replace(/^http/, "ws");
		const healthy = new WebSocket(url);
		try {
			await nextEvent(healthy, "open");
			for (const input of [
				"{",
				JSON.stringify({ id: 1.5, text: "invalid id" }),
				new Uint8Array([1, 2, 3]),
				JSON.stringify({ id: 1, text: "reject" }),
			]) {
				const failing = new WebSocket(url);
				try {
					await nextEvent(failing, "open");
					const closed = nextEvent(failing, "close");
					failing.send(input);
					expect(await closed).toMatchObject({
						code: 1011,
						reason: "Work failed",
						wasClean: true,
					});
					const reply = receiveReplies(healthy, 1);
					healthy.send(JSON.stringify({ id: 2, text: "still alive" }));
					expect(await reply).toEqual([{ id: 2, result: "still alive" }]);
				} finally {
					failing.close();
				}
			}
		} finally {
			healthy.close();
			await server.stop(true);
		}
	});

	test("waits for the closing handshake and reports an empty close frame as 1005", async () => {
		const server = createWebSocketWorkServer((request) => request.text);
		const client = new WebSocket(
			new URL("/work", server.url).href.replace(/^http/, "ws"),
		);
		try {
			await nextEvent(client, "open");
			const closed = nextEvent(client, "close");
			client.close();
			expect(client.readyState).toBe(WebSocket.CLOSING);
			expect(await closed).toMatchObject({
				code: 1005,
				reason: "",
				wasClean: true,
			});
			expect(client.readyState).toBe(WebSocket.CLOSED);
		} finally {
			client.close();
			await server.stop(true);
		}
	});

	test("reports a failed HTTP handshake as error followed by unclean close 1006", async () => {
		const server = createWebSocketWorkServer((request) => request.text);
		const client = new WebSocket(
			new URL("/missing", server.url).href.replace(/^http/, "ws"),
		);
		try {
			const events: string[] = [];
			client.addEventListener("error", () => events.push("error"));
			client.addEventListener("close", () => events.push("close"));
			const closed = await nextEvent(client, "close");
			expect(events).toEqual(["error", "close"]);
			expect(closed).toMatchObject({ code: 1006, reason: "", wasClean: false });
		} finally {
			client.close();
			await server.stop(true);
		}
	});

	test("rejects an invalid application queue bound before opening a listener", () => {
		for (const maxPendingMessages of [
			0,
			-1,
			1.5,
			Number.NaN,
			Number.POSITIVE_INFINITY,
		]) {
			expect(() =>
				createWebSocketWorkServer(() => "", { maxPendingMessages }),
			).toThrow(RangeError);
		}
	});
});
