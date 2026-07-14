export interface AtLeastOnceQueueOptions {
	maxAttempts: number;
	visibilityTimeoutMs: number;
	idFactory?: () => string;
}

export interface QueueDelivery<T> {
	attempt: number;
	id: string;
	receipt: string;
	value: T;
}

export interface DeadLetter<T> {
	attempts: number;
	id: string;
	value: T;
}

interface QueueRecord<T> {
	attempts: number;
	availableAtMs: number;
	currentReceipt?: string;
	id: string;
	value: T;
}

/**
 * In-memory model of an at-least-once work queue.
 *
 * The visibility timeout hides a delivered message while a consumer works. If
 * the consumer crashes before `ack`, the message becomes visible and can be
 * delivered again. That is why handlers must be idempotent: "exactly once"
 * business effects do not come from a delivery guarantee alone.
 *
 * This model uses a linear scan so the state machine stays readable. A real
 * broker uses durable logs/indexes, replication, leases, partitions, consumer
 * heartbeats, quotas, metrics, and a durable dead-letter policy.
 */
export class AtLeastOnceQueue<T> {
	private readonly deadLetters: DeadLetter<T>[] = [];
	private readonly records: QueueRecord<T>[] = [];
	private readonly seenIds = new Set<string>();
	private readonly idFactory: () => string;

	constructor(private readonly options: AtLeastOnceQueueOptions) {
		if (!Number.isInteger(options.maxAttempts) || options.maxAttempts < 1) {
			throw new Error("maxAttempts must be a positive integer");
		}
		if (
			!Number.isFinite(options.visibilityTimeoutMs) ||
			options.visibilityTimeoutMs < 1
		) {
			throw new Error("visibilityTimeoutMs must be at least 1");
		}

		this.idFactory = options.idFactory ?? Bun.randomUUIDv7;
	}

	enqueue(value: T, nowMs = Date.now(), delayMs = 0): string {
		if (!Number.isFinite(delayMs) || delayMs < 0) {
			throw new Error("delayMs must be non-negative");
		}

		const id = this.idFactory();
		if (id.trim().length === 0)
			throw new Error("idFactory returned an empty id");
		if (this.seenIds.has(id))
			throw new Error(`idFactory returned duplicate id: ${id}`);

		// Keep acknowledged IDs too: otherwise an old receipt could accidentally
		// acknowledge a later message that reused the same ID and attempt number.
		this.seenIds.add(id);
		this.records.push({
			attempts: 0,
			availableAtMs: nowMs + delayMs,
			id,
			value,
		});
		return id;
	}

	/**
	 * Delivers the oldest visible message and starts a new visibility lease.
	 *
	 * Time: O(n) in this educational implementation. Space: O(1) per call.
	 */
	receive(nowMs = Date.now()): QueueDelivery<T> | undefined {
		for (let index = 0; index < this.records.length; ) {
			const record = this.records[index]!;
			if (record.availableAtMs > nowMs) {
				index++;
				continue;
			}

			if (record.attempts >= this.options.maxAttempts) {
				this.deadLetters.push({
					attempts: record.attempts,
					id: record.id,
					value: record.value,
				});
				this.records.splice(index, 1);
				continue;
			}

			record.attempts++;
			record.availableAtMs = nowMs + this.options.visibilityTimeoutMs;
			record.currentReceipt = `${record.id}:${record.attempts}`;

			return {
				attempt: record.attempts,
				id: record.id,
				receipt: record.currentReceipt,
				value: record.value,
			};
		}

		return undefined;
	}

	/**
	 * Acknowledges only the current delivery receipt. A receipt becomes stale
	 * when a later delivery replaces it; this in-memory model does not reject an
	 * expired receipt until that redelivery occurs.
	 */
	ack(receipt: string): boolean {
		const index = this.records.findIndex(
			(record) => record.currentReceipt === receipt,
		);
		if (index === -1) return false;

		this.records.splice(index, 1);
		return true;
	}

	/**
	 * Makes failed work visible after an optional delay. Exponential backoff with
	 * jitter is normally computed by the consumer and passed as `delayMs`.
	 */
	nack(receipt: string, nowMs = Date.now(), delayMs = 0): boolean {
		if (!Number.isFinite(delayMs) || delayMs < 0) {
			throw new Error("delayMs must be non-negative");
		}

		const record = this.records.find(
			(candidate) => candidate.currentReceipt === receipt,
		);
		if (!record) return false;

		record.availableAtMs = nowMs + delayMs;
		delete record.currentReceipt;
		return true;
	}

	peekDeadLetters(): readonly DeadLetter<T>[] {
		return this.deadLetters;
	}

	stats(nowMs = Date.now()): {
		deadLettered: number;
		inFlight: number;
		queued: number;
	} {
		let inFlight = 0;
		for (const record of this.records) {
			if (record.currentReceipt && record.availableAtMs > nowMs) inFlight++;
		}

		return {
			deadLettered: this.deadLetters.length,
			inFlight,
			queued: this.records.length - inFlight,
		};
	}
}
