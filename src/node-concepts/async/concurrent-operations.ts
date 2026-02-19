/**
 * A function that produces a Promise when executed.
 * Using a factory ensures the task does not start
 * until the queue schedules it.
 */
export type AsyncTask<T> = () => Promise<T>;

/**
 * Summary returned when the queue becomes idle.
 */
export interface QueueSummary<T> {
	/** Successful task results */
	results: T[];
	/** Errors thrown by failed tasks */
	errors: unknown[];
}

/**
 * PromiseTaskQueue
 *
 * A concurrency-limited, FIFO task queue.
 * Designed to work safely in Bun, Node.js, and browsers.
 *
 * Key properties:
 * - Event-based idle detection (no polling)
 * - Deterministic concurrency
 * - Strong typing
 * - Error isolation
 */
export class PromiseTaskQueue<T> {
	private readonly maxConcurrency: number;
	private activeCount = 0;

	private readonly pendingTasks: AsyncTask<T>[] = [];
	private readonly results: T[] = [];
	private readonly errors: unknown[] = [];

	/** Resolvers waiting for the queue to become idle */
	private idleResolvers: Array<(summary: QueueSummary<T>) => void> = [];

	constructor(maxConcurrency = 1) {
		if (maxConcurrency < 1) {
			throw new Error("maxConcurrency must be at least 1");
		}
		this.maxConcurrency = maxConcurrency;
	}

	/**
	 * Enqueue a new async task.
	 */
	public enqueue(task: AsyncTask<T>): void {
		this.pendingTasks.push(task);
		this.run();
	}

	/**
	 * Executes tasks while respecting the concurrency limit.
	 */
	private run(): void {
		while (
			this.activeCount < this.maxConcurrency &&
			this.pendingTasks.length > 0
		) {
			const task = this.pendingTasks.shift()!;
			this.activeCount++;

			task()
				.then((result) => {
					this.results.push(result);
				})
				.catch((error) => {
					this.errors.push(error);
				})
				.finally(() => {
					this.activeCount--;
					this.run();
					this.checkIdle();
				});
		}
	}

	/**
	 * Resolves all waiting idle promises if the queue is idle.
	 */
	private checkIdle(): void {
		if (this.activeCount === 0 && this.pendingTasks.length === 0) {
			const summary = this.getSummary();
			this.idleResolvers.forEach((resolve) => {
				resolve(summary);
			});
			this.idleResolvers = [];
		}
	}

	/**
	 * Resolves when no tasks are pending or running.
	 */
	public async waitForIdle(): Promise<QueueSummary<T>> {
		if (this.activeCount === 0 && this.pendingTasks.length === 0) {
			return this.getSummary();
		}

		return new Promise((resolve) => {
			this.idleResolvers.push(resolve);
		});
	}

	/**
	 * Returns a snapshot of queue execution results.
	 */
	private getSummary(): QueueSummary<T> {
		return {
			results: [...this.results],
			errors: [...this.errors],
		};
	}
}
