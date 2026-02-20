/**
 * Production-optimized Bun server
 * - Native routes API
 * - Circuit breaker
 * - Worker endpoint
 * - Metrics endpoint
 * - Centralized error handling
 * - Test-safe startup
 */

import { CircuitBreaker } from "@/node-concepts/async/circuit-breaker";

//
// ──────────────────────────────────────────
// Utilities
// ──────────────────────────────────────────
//

function busyWait(ms: number) {
	const start = performance.now();
	while (performance.now() - start < ms) {}
}

const isTest = process.env.NODE_ENV === "test";
const isProd = process.env.NODE_ENV === "production";

//
// ──────────────────────────────────────────
// External API (Typed)
// ──────────────────────────────────────────
//

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

//
// ──────────────────────────────────────────
// Circuit Breaker
// ──────────────────────────────────────────
//

export const apiBreaker = new CircuitBreaker<[], Todo>(
	callExternalAPI,
	{
		failureThreshold: isTest ? 20 : 50, // 20% for tests
		minimumRequests: isTest ? 1 : 5,
		windowDuration: 10000,
		resetTimeout: 8000,
		timeout: 3000,
		halfOpenMaxCalls: 2,
	},
	async () => ({
		userId: -1,
		id: -1,
		title: "Fallback response",
		completed: false,
	}),
);

//
// ──────────────────────────────────────────
// Worker
// ──────────────────────────────────────────
//

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

//
// ──────────────────────────────────────────
// WebSocket Types
// ──────────────────────────────────────────
//

type WSData = {
	username: string;
	channel: string;
	connectedAt: number;
};

//
// ──────────────────────────────────────────
// Server
// ──────────────────────────────────────────
//

export const server = Bun.serve({
	port: Number(process.env.PORT ?? 3000),
	idleTimeout: 10,

	routes: {
		"/": new Response("Welcome to Bun!"),

		// Only allow blocking route outside production
		"/block": () => {
			if (isProd) {
				return new Response("Not Found", { status: 404 });
			}
			busyWait(50);
			return new Response("Blocking done!");
		},

		"/heavy-task": async () => {
			const result = await runWorker();
			return Response.json({ result });
		},

		"/circuit-breaker": async (req, server) => {
			server.timeout(req, 10);

			const data = await apiBreaker.fire();

			return Response.json({
				success: true,
				state: apiBreaker.getState(),
				data,
			});
		},

		"/circuit-breaker/health": () =>
			Response.json({
				state: apiBreaker.getState(),
			}),

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
					username,
					channel,
					connectedAt: Date.now(),
				},
			});

			return upgraded
				? undefined
				: new Response("Upgrade failed", { status: 500 });
		},
	},
	websocket: {
		data: {} as WSData,

		perMessageDeflate: true,
		idleTimeout: 60,
		maxPayloadLength: 1024 * 1024,
		backpressureLimit: 1024 * 1024,
		closeOnBackpressureLimit: false,

		open(ws) {
			const { username, channel } = ws.data;

			ws.subscribe(channel);

			ws.publish(
				channel,
				JSON.stringify({
					type: "system",
					message: `${username} joined ${channel}`,
					timestamp: Date.now(),
				}),
				true,
			);
		},

		message(ws, message) {
			const { username, channel } = ws.data;

			const payload = JSON.stringify({
				type: "chat",
				user: username,
				message: message.toString(),
				timestamp: Date.now(),
			});

			const result = ws.publish(channel, payload, true);

			if (result === -1) {
				console.warn("Backpressure detected");
			}
		},

		close(ws) {
			const { username, channel } = ws.data;

			ws.unsubscribe(channel);

			ws.publish(
				channel,
				JSON.stringify({
					type: "system",
					message: `${username} left ${channel}`,
					timestamp: Date.now(),
				}),
			);
		},
	},

	error(error) {
		console.error("Server error:", error);
		return new Response("Internal Server Error", { status: 500 });
	},
});

//
// ──────────────────────────────────────────
// Lifecycle Management
// ──────────────────────────────────────────
//

// Prevent tests from hanging
if (isTest) {
	server.unref();
}

// Graceful shutdown (production safe)
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

console.log(`🚀 Server running at ${server.url}`);
