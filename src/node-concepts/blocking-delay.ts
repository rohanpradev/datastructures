/**
 * @file server.ts
 * @description Bun HTTP server demonstrating:
 *  - fast routes
 *  - blocking tasks
 *  - offloading CPU work to a Worker
 *
 * Safe for your system:
 *  - CPU-heavy work is offloaded to a Worker
 *  - Worker is terminated after use
 *  - Fast route remains responsive
 */

export async function handler(path: string): Promise<string | number> {
  // Fast route
  if (path === "/") return "Fast response";

  // Blocking route (just for demonstration)
  if (path === "/count") {
    const start = Date.now();
    while (Date.now() - start < 50) {} // busy wait ~50ms
    return "Blocking done!";
  }

  // Worker route
  if (path === "/worker") {
    const WORKER_FILE = new URL("./worker.ts", import.meta.url);

    return await new Promise<number>((resolve, reject) => {
      const worker = new Worker(WORKER_FILE, { type: "module" });

      worker.onmessage = (event: MessageEvent<number>) => {
        resolve(event.data); // resolve with result
        worker.terminate(); // terminate safely after result
      };

      worker.onerror = (err) => {
        reject(err); // reject on error
        worker.terminate(); // clean termination
      };

      worker.postMessage({ task: "compute" }); // start work
    });
  }

  return "Not Found";
}

// Bun HTTP server
const server = Bun.serve({
  port: 3000,
  async fetch(req: Request) {
    const path = new URL(req.url).pathname;

    if (path === "/") {
      return new Response("Welcome to Bun!");
    }

    if (path === "/block") {
      const start = Date.now();
      while (Date.now() - start < 50) {
        // busy loop
      }
      return new Response("Blocking done!");
    }

    if (path === "/heavy-task") {
      const WORKER_FILE = new URL("./heavy-worker.ts", import.meta.url);
      return new Promise<Response>((resolve, reject) => {
        const worker = new Worker(WORKER_FILE, { type: "module" });

        worker.onmessage = (event: MessageEvent<number>) => {
          resolve(
            Response.json({
              message: "Worker finished computation",
              result: event.data,
            }),
          );
          worker.terminate();
        };

        worker.onerror = (err) => {
          reject(err);
          worker.terminate();
        };

        worker.postMessage({ task: "compute" });
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Listening on ${server.url}`);
