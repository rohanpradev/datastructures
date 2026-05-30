/**
 * Production-oriented Bun server examples.
 *
 * Concepts covered:
 * - Native Bun.serve routes
 * - Circuit breaker protected dependency calls
 * - Worker offloading for CPU-heavy tasks
 * - Metrics endpoint
 * - WebSocket pub/sub
 * - Test-safe server lifecycle
 */

import { CircuitBreaker } from "@/node-concepts/async/circuit-breaker";

function busyWait(ms: number) {
	const start = performance.now();
	while (performance.now() - start < ms) {}
}

const isTest = Bun.env.NODE_ENV === "test";
const isProd = Bun.env.NODE_ENV === "production";

type TestCleanup = () => void | Promise<void>;
type TestCleanupGlobal = typeof globalThis & {
	__DATASTRUCTURES_TEST_CLEANUPS__?: TestCleanup[];
};

function registerTestCleanup(cleanup: TestCleanup): void {
	const cleanupGlobal = globalThis as TestCleanupGlobal;
	cleanupGlobal.__DATASTRUCTURES_TEST_CLEANUPS__ ??= [];
	cleanupGlobal.__DATASTRUCTURES_TEST_CLEANUPS__.push(cleanup);
}

interface Todo {
	userId: number;
	id: number;
	title: string;
	completed: boolean;
}

async function callExternalAPI(): Promise<Todo> {
	if (isTest) {
		return {
			completed: false,
			id: 1,
			title: "Test todo",
			userId: 1,
		};
	}

	const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
		signal: AbortSignal.timeout(2000),
	});

	if (!res.ok) {
		throw new Error(`Upstream error: ${res.status}`);
	}

	return res.json() as Promise<Todo>;
}

/**
 * Shared circuit breaker guarding the example upstream API route.
 */
export const apiBreaker = new CircuitBreaker<[], Todo>(
	callExternalAPI,
	{
		failureThreshold: isTest ? 20 : 50,
		halfOpenMaxCalls: 2,
		minimumRequests: isTest ? 1 : 5,
		resetTimeout: 8000,
		timeout: 3000,
		windowDuration: 10000,
	},
	async () => ({
		completed: false,
		id: -1,
		title: "Fallback response",
		userId: -1,
	}),
);

const HEAVY_WORKER_URL = new URL("./worker/worker.ts", import.meta.url);
const WORKER_TIMEOUT_MS = 2000;

function runWorker(): Promise<number> {
	return new Promise<number>((resolve, reject) => {
		const worker = new Worker(HEAVY_WORKER_URL, { type: "module" });
		let settled = false;

		const cleanup = () => {
			clearTimeout(timeout);
			worker.onmessage = null;
			worker.onerror = null;
			worker.terminate();
		};

		const settle = <T>(callback: (value: T) => void, value: T) => {
			if (settled) return;
			settled = true;
			cleanup();
			callback(value);
		};

		const timeout = setTimeout(() => {
			settle(reject, new Error("Worker timed out"));
		}, WORKER_TIMEOUT_MS);

		worker.onmessage = (event: MessageEvent<number>) => {
			settle(resolve, event.data);
		};

		worker.onerror = (error) => {
			settle(reject, error);
		};

		try {
			worker.postMessage({ task: "compute" });
		} catch (error) {
			settle(reject, error instanceof Error ? error : new Error(String(error)));
		}
	});
}

type WSData = {
	channel: string;
	connectedAt: number;
	username: string;
};

/**
 * Bun.serve instance exposing HTTP, metrics, worker, and WebSocket examples.
 */
export const server = Bun.serve({
	error(error) {
		console.error("Server error:", error);
		return new Response("Internal Server Error", { status: 500 });
	},
	idleTimeout: 10,
	port: Number(Bun.env.PORT ?? (isTest ? 0 : 3000)),
	routes: {
		"/": new Response("Welcome to Bun!"),

		"/block": () => {
			if (isProd) {
				return new Response("Not Found", { status: 404 });
			}

			busyWait(50);
			return new Response("Blocking done!");
		},

		"/circuit-breaker": async (req, server) => {
			server.timeout(req, 10);

			const data = await apiBreaker.fire();

			return Response.json({
				data,
				state: apiBreaker.getState(),
				success: true,
			});
		},

		"/circuit-breaker/health": () =>
			Response.json({
				state: apiBreaker.getState(),
			}),

		"/heavy-task": async () => {
			const result = await runWorker();
			return Response.json({ result });
		},

		"/metrics": (_req, server) =>
			Response.json({
				activeRequests: server.pendingRequests,
				activeWebSockets: server.pendingWebSockets,
			}),

		"/ws": (req, server) => {
			const url = new URL(req.url);
			const username = url.searchParams.get("username");
			const channel = url.searchParams.get("channel");

			if (!username || !channel) {
				return new Response("Missing username or channel", {
					status: 400,
				});
			}

			const upgraded = server.upgrade(req, {
				data: {
					channel,
					connectedAt: Date.now(),
					username,
				},
			});

			return upgraded
				? undefined
				: new Response("Upgrade failed", { status: 500 });
		},
	},
	websocket: {
		backpressureLimit: 1024 * 1024,
		closeOnBackpressureLimit: true,
		data: {} as WSData,
		idleTimeout: 60,
		maxPayloadLength: 1024 * 1024,
		perMessageDeflate: true,

		close(ws) {
			const { channel, username } = ws.data;

			ws.unsubscribe(channel);

			ws.publish(
				channel,
				JSON.stringify({
					message: `${username} left ${channel}`,
					timestamp: Date.now(),
					type: "system",
				}),
			);
		},

		message(ws, message) {
			const { channel, username } = ws.data;

			const payload = JSON.stringify({
				message: message.toString(),
				timestamp: Date.now(),
				type: "chat",
				user: username,
			});

			const result = ws.publish(channel, payload, true);

			if (result === -1) {
				console.warn("Backpressure detected");
			}
		},

		open(ws) {
			const { channel, username } = ws.data;

			ws.subscribe(channel);

			ws.publish(
				channel,
				JSON.stringify({
					message: `${username} joined ${channel}`,
					timestamp: Date.now(),
					type: "system",
				}),
				true,
			);
		},
	},
});

if (isTest) {
	server.unref();
	registerTestCleanup(() => stopServer(true));
}

let shutdownStarted = false;

/**
 * Stops the shared Bun server and makes repeated shutdown calls idempotent.
 */
export async function stopServer(force = true): Promise<void> {
	if (shutdownStarted) return;
	shutdownStarted = true;
	await server.stop(force);
}

async function shutdown(signal: NodeJS.Signals): Promise<void> {
	console.log(`${signal} received. Shutting down...`);
	await stopServer(true);
	process.exit(0);
}

if (!isTest) {
	process.once("SIGTERM", () => {
		void shutdown("SIGTERM");
	});

	process.once("SIGINT", () => {
		void shutdown("SIGINT");
	});
}

if (!isTest) {
	console.log(`Server running at ${server.url}`);
}
