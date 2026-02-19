/**
 * @file worker.ts
 * @description Worker that performs CPU-intensive tasks off the main thread.
 * Safe for your system and terminates after work.
 */

declare var self: Worker;

self.onmessage = (event: MessageEvent<{ task: string }>) => {
	if (event.data.task === "compute") {
		// CPU-heavy computation (safe and bounded)
		let result = 0;
		for (let i = 0; i < 500; i++) {
			result += i * i;
		}

		// Send result back
		self.postMessage(result);
	}
};
