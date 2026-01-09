/**
 * @file worker.ts
 * @description
 * Worker that performs CPU-intensive tasks off the main thread.
 * Safe for your system and terminates after work.
 */

// prevents TS errors
declare var self: Worker;

self.onmessage = (event: MessageEvent<{ task: string }>) => {
	if (event.data.task === "compute") {
		// Simulate CPU-heavy calculation
		let result = 0;
		for (let i = 0; i < 500; i++) {
			result += i * i; // safe, bounded
		}

		// Send result back to main thread
		self.postMessage(result);
	}
};
