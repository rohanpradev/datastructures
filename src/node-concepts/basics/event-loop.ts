/**
 * Records a small, deterministic event-loop ordering sample.
 *
 * Interview concept:
 * - Synchronous code runs first.
 * - Microtasks run before timer callbacks.
 * - Timers run in a later macrotask turn.
 */
export async function recordEventLoopOrder(): Promise<string[]> {
	const order: string[] = [];

	order.push("sync:start");

	queueMicrotask(() => {
		order.push("microtask:queueMicrotask");
	});

	Promise.resolve().then(() => {
		order.push("microtask:promise");
	});

	setTimeout(() => {
		order.push("macrotask:timer");
	}, 0);

	order.push("sync:end");

	await Promise.resolve();
	await new Promise<void>((resolve) => setTimeout(resolve, 0));

	return order;
}

/**
 * Yields back to the event loop after each chunk of work.
 *
 * Interview concept:
 * CPU-heavy loops block the event loop unless work is split into chunks.
 */
export async function processInChunks<T>(
	items: T[],
	chunkSize: number,
	visit: (item: T) => void,
): Promise<void> {
	if (chunkSize < 1) {
		throw new Error("chunkSize must be at least 1");
	}

	for (let index = 0; index < items.length; index++) {
		visit(items[index]!);

		if ((index + 1) % chunkSize === 0) {
			await new Promise<void>((resolve) => setTimeout(resolve, 0));
		}
	}
}
