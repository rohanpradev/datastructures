/**
 * @file pubsub.test.ts
 * @description
 * Integration test suite for WebSocket Pub/Sub:
 * - Upgrade route
 * - Join system message
 * - Channel broadcast
 * - Sender exclusion
 * - Metrics WebSocket tracking
 */

import { afterEach, describe, expect, test } from "bun:test";
import { server } from "@/node-concepts/server";

interface ChatMessage {
	type: "system" | "chat";
	user?: string;
	message: string;
	timestamp: number;
}

interface MetricsResponse {
	activeRequests: number;
	activeWebSockets: number;
}

type MessagePredicate = (message: ChatMessage) => boolean;

function createSocket(username: string, channel: string) {
	const url = new URL(server.url.toString());
	url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
	url.pathname = "/ws";
	url.search = `?username=${username}&channel=${channel}`;
	return new WebSocket(url.toString());
}

function waitForOpen(socket: WebSocket, timeout = 1000) {
	if (socket.readyState === WebSocket.OPEN) {
		return Promise.resolve();
	}

	if (
		socket.readyState === WebSocket.CLOSING ||
		socket.readyState === WebSocket.CLOSED
	) {
		return Promise.reject(new Error("WebSocket closed before opening"));
	}

	return new Promise<void>((resolve, reject) => {
		const cleanup = () => {
			clearTimeout(timer);
			socket.removeEventListener("open", onOpen);
			socket.removeEventListener("error", onError);
		};
		const onOpen = () => {
			cleanup();
			resolve();
		};
		const onError = () => {
			cleanup();
			reject(new Error("WebSocket open failed"));
		};
		const timer = setTimeout(() => {
			cleanup();
			reject(new Error("WebSocket open timeout"));
		}, timeout);

		socket.addEventListener("open", onOpen, { once: true });
		socket.addEventListener("error", onError, { once: true });
	});
}

function waitForMessage(
	socket: WebSocket,
	options: { timeout?: number; predicate?: MessagePredicate } = {},
): Promise<ChatMessage> {
	const { timeout = 1000, predicate } = options;

	return new Promise((resolve, reject) => {
		const cleanup = () => {
			clearTimeout(timer);
			socket.removeEventListener("message", onMessage);
			socket.removeEventListener("error", onError);
		};
		const onMessage = (event: MessageEvent) => {
			try {
				const message = JSON.parse(String(event.data)) as ChatMessage;

				if (predicate && !predicate(message)) {
					return;
				}

				cleanup();
				resolve(message);
			} catch (error) {
				cleanup();
				reject(error instanceof Error ? error : new Error(String(error)));
			}
		};
		const onError = () => {
			cleanup();
			reject(new Error("WebSocket message failed"));
		};
		const timer = setTimeout(() => {
			cleanup();
			reject(new Error("WebSocket message timeout"));
		}, timeout);

		socket.addEventListener("message", onMessage);
		socket.addEventListener("error", onError, { once: true });
	});
}

function delay(ms: number) {
	return Bun.sleep(ms);
}

async function readMetrics(timeout = 1000): Promise<MetricsResponse> {
	const res = await fetch(new URL("/metrics", server.url), {
		signal: AbortSignal.timeout(timeout),
	});
	return (await res.json()) as MetricsResponse;
}

async function waitForWebSocketCount(expected: number, timeout = 1000) {
	const start = performance.now();
	let lastCount = -1;

	while (performance.now() - start < timeout) {
		const metrics = await readMetrics();
		lastCount = metrics.activeWebSockets;

		if (lastCount === expected) {
			return;
		}

		await delay(10);
	}

	throw new Error(
		`Expected ${expected} active WebSockets, saw ${lastCount} after ${timeout}ms`,
	);
}

async function closeSocket(socket: WebSocket | undefined, timeout = 1000) {
	if (!socket || socket.readyState === WebSocket.CLOSED) {
		return;
	}

	await new Promise<void>((resolve) => {
		const cleanup = () => {
			clearTimeout(timer);
			socket.removeEventListener("close", onClose);
			socket.removeEventListener("error", onError);
		};
		const onClose = () => {
			cleanup();
			resolve();
		};
		const onError = () => {
			cleanup();
			resolve();
		};
		const timer = setTimeout(() => {
			cleanup();
			resolve();
		}, timeout);

		socket.addEventListener("close", onClose, { once: true });
		socket.addEventListener("error", onError, { once: true });

		if (
			socket.readyState === WebSocket.CONNECTING ||
			socket.readyState === WebSocket.OPEN
		) {
			socket.close();
		}
	});
}

describe("WebSocket Pub/Sub", () => {
	afterEach(async () => {
		await waitForWebSocketCount(0);
	});

	test("WebSocket upgrade succeeds", async () => {
		const socket = createSocket("TestUser", "room1");
		try {
			await waitForOpen(socket);
			expect(socket.readyState).toBe(WebSocket.OPEN);
		} finally {
			await closeSocket(socket);
		}
	});

	test("Join system message is broadcasted", async () => {
		let socket1: WebSocket | undefined;
		let socket2: WebSocket | undefined;

		try {
			socket1 = createSocket("Alice", "room2");
			await waitForOpen(socket1);

			socket2 = createSocket("Bob", "room2");
			await waitForOpen(socket2);

			const joinMessage = await waitForMessage(socket1, {
				predicate: (message) =>
					message.type === "system" && message.message.includes("Bob joined"),
			});

			expect(joinMessage.type).toBe("system");
			expect(joinMessage.message).toContain("Bob joined");
		} finally {
			await Promise.all([closeSocket(socket1), closeSocket(socket2)]);
		}
	});

	test("Message is broadcast to other subscribers", async () => {
		let socket1: WebSocket | undefined;
		let socket2: WebSocket | undefined;

		try {
			socket1 = createSocket("Sender", "room3");
			socket2 = createSocket("Receiver", "room3");

			await waitForOpen(socket1);
			await waitForOpen(socket2);

			const messagePromise = waitForMessage(socket2, {
				predicate: (message) => message.type === "chat",
			});

			socket1.send("Hello World");

			const received = await messagePromise;

			expect(received.type).toBe("chat");
			expect(received.message).toBe("Hello World");
			expect(received.user).toBe("Sender");
		} finally {
			await Promise.all([closeSocket(socket1), closeSocket(socket2)]);
		}
	});

	test("Sender does not receive its own message", async () => {
		const socket = createSocket("SelfUser", "room4");
		try {
			await waitForOpen(socket);

			await delay(50);

			let received = false;
			const onMessage = () => {
				received = true;
			};
			socket.addEventListener("message", onMessage);

			try {
				socket.send("Should not echo");

				await delay(100);
				expect(received).toBe(false);
			} finally {
				socket.removeEventListener("message", onMessage);
			}
		} finally {
			await closeSocket(socket);
		}
	});

	test("Metrics reflect active WebSockets", async () => {
		const socket = createSocket("MetricUser", "metricsRoom");
		try {
			await waitForOpen(socket);

			await delay(50);

			const data = await readMetrics();

			expect(data.activeWebSockets).toBeGreaterThanOrEqual(1);
		} finally {
			await closeSocket(socket);
		}
	});

	test("WebSocket closes cleanly", async () => {
		const socket = createSocket("CloseUser", "room5");
		try {
			await waitForOpen(socket);

			await closeSocket(socket);

			expect(socket.readyState).toBe(WebSocket.CLOSED);
		} finally {
			await closeSocket(socket);
		}
	});
});
