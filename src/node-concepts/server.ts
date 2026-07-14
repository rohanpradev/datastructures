/**
 * Production-oriented Bun server examples.
 *
 * Concepts covered:
 * - Native Bun.serve routes
 * - Circuit breaker protected dependency calls
 * - Worker offloading for Bun-native image processing
 * - Metrics endpoint
 * - WebSocket pub/sub
 * - Test-safe server lifecycle
 */

import { CircuitBreaker } from "@/node-concepts/async/circuit-breaker";
import type { BunImageProcessingResult } from "@/node-concepts/bun-runtime/image-processing";

/**
 * Performs a busy-wait (spin-loop) for the specified duration.
 * This blocks the thread and consumes CPU, useful for simulating heavy synchronous work.
 *
 * Time Complexity: O(1) in terms of operations, but O(ms) in real time
 * Space Complexity: O(1)
 *
 * @param ms - Duration to busy-wait in milliseconds
 *
 * @example
 * busyWait(100); // Spins for ~100ms, blocking current thread
 */
function busyWait(ms: number) {
	const start = performance.now();
	while (performance.now() - start < ms) {}
}

const isTest = Bun.env.NODE_ENV === "test";
const isProd = Bun.env.NODE_ENV === "production";

interface Todo {
	userId: number;
	id: number;
	title: string;
	completed: boolean;
}

/**
 * Calls an external API (JSONPlaceholder) to fetch a todo item.
 * Returns a mock response in test environment, actual API call in production.
 * Includes a 2-second timeout to prevent hanging requests.
 *
 * Time Complexity: O(1) - single API call
 * Space Complexity: O(1)
 *
 * @returns Promise resolving to a Todo object
 * @throws Error if API response is not ok or request times out
 *
 * @example
 * const todo = await callExternalAPI();
 * console.log(todo.title); // "delectus aut autem"
 */
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

/**
 * Spawns a worker thread to execute Bun.Image work off the main thread.
 * The worker is terminated after completion or timeout.
 *
 * Time Complexity: O(1) for spawning, depends on image size and encoding format
 * Space Complexity: O(1) + worker memory
 *
 * @returns Promise resolving to the processed image summary from the worker
 * @throws Error if worker times out (>2000ms) or encounters an error
 *
 * @example
 * const result = await runWorker(); // Offloads thumbnail generation
 */
type ImageWorkerMessage =
	| {
			ok: true;
			result: BunImageProcessingResult;
	  }
	| {
			error: string;
			ok: false;
	  };

function runWorker(): Promise<BunImageProcessingResult> {
	return new Promise<BunImageProcessingResult>((resolve, reject) => {
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

		worker.onmessage = (event: MessageEvent<ImageWorkerMessage>) => {
			if (event.data.ok) {
				settle(resolve, event.data.result);
				return;
			}

			settle(reject, new Error(event.data.error));
		};

		worker.onerror = (error) => {
			settle(reject, error);
		};

		try {
			worker.postMessage({
				targetHeight: 90,
				targetWidth: 160,
				task: "image-thumbnail",
			});
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
	// biome-ignore lint/complexity/useLiteralKeys: noPropertyAccessFromIndexSignature requires bracket access for Bun.env.
	port: Number(Bun.env["PORT"] ?? (isTest ? 0 : 3000)),
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
	// Bun can rerun a test file in the same process. Do not stop this exported
	// singleton from an afterAll hook: later runs would import the cached server
	// after its listening socket had been closed. `unref()` lets Bun exit once
	// the test work is done, while individual tests still close their sockets.
	server.unref();
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

/**
 * Handles graceful shutdown of the server in response to system signals.
 * Logs the signal received, stops the server, and exits the process.
 *
 * Time Complexity: O(1) for signaling
 * Space Complexity: O(1)
 *
 * @param signal - The shutdown signal received (e.g., 'SIGTERM', 'SIGINT')
 * @returns Promise that resolves before process exit
 *
 * @example
 * await shutdown('SIGTERM'); // Graceful shutdown triggered
 */
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
