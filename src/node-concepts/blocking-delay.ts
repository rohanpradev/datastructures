/**
 * @file server.ts
 * @description
 * Bun HTTP server demonstrating:
 *  - fast routes
 *  - blocking tasks
 *  - offloading CPU work to a Worker
 * Safe for your system:
 *  - CPU-heavy work is offloaded to a Worker
 *  - Worker is terminated after use
 *  - Fast route remains responsive
 */

export async function handler(path: string): Promise<string | number> {
	// Fast route: responds immediately
	if (path === "/") {
		return "Fast response";
	}

	// Blocking route: main thread busy-wait (~50ms)
	if (path === "/count") {
		const start = Date.now();
		while (Date.now() - start < 50) {
			// busy loop
		}
		return "Blocking done!";
	}

	// Worker route: simulate CPU-intensive computation
	if (path === "/worker") {
		const WORKER_FILE = new URL("./heavy-worker.ts", import.meta.url);
		const worker = new Worker(WORKER_FILE, { type: "module" });

		const result: number = await new Promise((resolve) => {
			worker.onmessage = (event: MessageEvent<number>) => resolve(event.data);
			worker.postMessage({ task: "compute" });
		});

		worker.terminate();
		return result;
	}

	return "Not Found";
}

const server = Bun.serve({
	port: 3000,
	async fetch(req: Request) {
		const path = new URL(req.url).pathname;

		// Fast route: responds immediately
		if (path === "/") {
			return new Response("Welcome to Bun!");
		}

		// Blocking route: main thread busy-wait (~50ms)
		if (path === "/block") {
			const start = Date.now();
			while (Date.now() - start < 50) {
				// busy loop
			}
			return new Response("Blocking done!");
		}

		// Worker route: offload heavy CPU computation
		if (path === "/heavy-task") {
			const worker = new Worker(new URL("./heavy-worker.ts", import.meta.url), {
				type: "module",
			});

			return new Promise<Response>((resolve) => {
				worker.onmessage = (event: MessageEvent<number>) => {
					resolve(
						Response.json({
							message: "Worker finished computation",
							result: event.data,
						}),
					);
					worker.terminate(); // Clean up
				};

				worker.postMessage({ task: "compute" });
			});
		}

		// 404 fallback
		return new Response("Not Found", { status: 404 });
	},
});

console.log(`Listening on ${server.url}`);
