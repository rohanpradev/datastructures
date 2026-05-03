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

const isTest = process.env.NODE_ENV === "test";
const isProd = process.env.NODE_ENV === "production";

interface Todo {
	userId: number;
	id: number;
	title: string;
	completed: boolean;
}

async function callExternalAPI(): Promise<Todo> {
	const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
		signal: AbortSignal.timeout(2000),
	});

	if (!res.ok) {
		throw new Error(`Upstream error: ${res.status}`);
	}

	return res.json() as Promise<Todo>;
}

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

function runWorker(): Promise<number> {
	return new Promise<number>((resolve, reject) => {
		const worker = new Worker(HEAVY_WORKER_URL, { type: "module" });

		worker.onmessage = (e: MessageEvent<number>) => {
			resolve(e.data);
			worker.terminate();
		};

		worker.onerror = (err) => {
			reject(err);
			worker.terminate();
		};

		worker.postMessage({ task: "compute" });
	});
}

type WSData = {
	channel: string;
	connectedAt: number;
	username: string;
};

export const server = Bun.serve({
	error(error) {
		console.error("Server error:", error);
		return new Response("Internal Server Error", { status: 500 });
	},
	idleTimeout: 10,
	port: Number(process.env.PORT ?? 3000),
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
		closeOnBackpressureLimit: false,
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
}

if (!isTest) {
	process.on("SIGTERM", async () => {
		console.log("SIGTERM received. Shutting down...");
		await server.stop();
		process.exit(0);
	});

	process.on("SIGINT", async () => {
		console.log("SIGINT received. Shutting down...");
		await server.stop();
		process.exit(0);
	});
}

console.log(`Server running at ${server.url}`);
