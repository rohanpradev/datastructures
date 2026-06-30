export interface FairQueueResult<TTenant extends string, TValue> {
	tenant: TTenant;
	value: TValue;
	cost: number;
}

interface ScheduledWork<TTenant extends string, TValue>
	extends FairQueueResult<TTenant, TValue> {
	sequence: number;
	virtualFinish: number;
}

/**
 * Weighted fair queue using virtual finish times.
 *
 * System design use:
 * - Prevent one tenant from monopolizing a shared worker pool.
 * - Give premium traffic a larger share without creating a hard priority lane.
 * - Prefer small/cheap work when it would otherwise sit behind expensive work.
 *
 * Enqueue is O(log n), dequeue is O(log n), and peek/size are O(1).
 */
export class WeightedFairQueue<TTenant extends string, TValue> {
	private readonly heap: ScheduledWork<TTenant, TValue>[] = [];
	private readonly lastFinishByTenant = new Map<TTenant, number>();
	private readonly weights = new Map<TTenant, number>();
	private sequence = 0;
	private virtualTime = 0;

	constructor(
		weights: Iterable<readonly [TTenant, number]> = [],
		private readonly defaultWeight = 1,
	) {
		if (!Number.isFinite(defaultWeight) || defaultWeight <= 0) {
			throw new Error("defaultWeight must be positive");
		}

		for (const [tenant, weight] of weights) this.setWeight(tenant, weight);
	}

	setWeight(tenant: TTenant, weight: number): void {
		if (!Number.isFinite(weight) || weight <= 0) {
			throw new Error("weight must be positive");
		}

		this.weights.set(tenant, weight);
	}

	/**
	 * Adds work to the queue.
	 *
	 * `cost / weight` is the virtual service time. Higher-weight tenants advance
	 * more slowly through virtual time, so they receive a larger share over time.
	 */
	enqueue(tenant: TTenant, value: TValue, cost = 1): void {
		if (!Number.isFinite(cost) || cost <= 0) {
			throw new Error("cost must be positive");
		}

		const weight = this.weights.get(tenant) ?? this.defaultWeight;
		const previousFinish = this.lastFinishByTenant.get(tenant) ?? 0;
		const start = Math.max(this.virtualTime, previousFinish);
		const virtualFinish = start + cost / weight;

		this.lastFinishByTenant.set(tenant, virtualFinish);
		this.push({
			cost,
			sequence: this.sequence++,
			tenant,
			value,
			virtualFinish,
		});
	}

	dequeue(): FairQueueResult<TTenant, TValue> | undefined {
		const work = this.pop();
		if (!work) return undefined;

		this.virtualTime = Math.max(this.virtualTime, work.virtualFinish);

		return {
			cost: work.cost,
			tenant: work.tenant,
			value: work.value,
		};
	}

	peek(): FairQueueResult<TTenant, TValue> | undefined {
		const work = this.heap[0];
		if (!work) return undefined;

		return {
			cost: work.cost,
			tenant: work.tenant,
			value: work.value,
		};
	}

	size(): number {
		return this.heap.length;
	}

	stats(): {
		queuedItems: number;
		trackedTenants: number;
		virtualTime: number;
	} {
		return {
			queuedItems: this.heap.length,
			trackedTenants: this.lastFinishByTenant.size,
			virtualTime: this.virtualTime,
		};
	}

	private push(work: ScheduledWork<TTenant, TValue>): void {
		this.heap.push(work);
		this.siftUp(this.heap.length - 1);
	}

	private pop(): ScheduledWork<TTenant, TValue> | undefined {
		if (this.heap.length === 0) return undefined;

		const root = this.heap[0]!;
		const last = this.heap.pop()!;
		if (this.heap.length > 0) {
			this.heap[0] = last;
			this.siftDown(0);
		}

		return root;
	}

	private siftUp(index: number): void {
		let child = index;

		while (child > 0) {
			const parent = Math.floor((child - 1) / 2);
			if (this.comesBefore(this.heap[parent]!, this.heap[child]!)) break;

			this.swap(parent, child);
			child = parent;
		}
	}

	private siftDown(index: number): void {
		let parent = index;

		while (true) {
			const left = parent * 2 + 1;
			const right = left + 1;
			let smallest = parent;

			if (
				left < this.heap.length &&
				this.comesBefore(this.heap[left]!, this.heap[smallest]!)
			) {
				smallest = left;
			}
			if (
				right < this.heap.length &&
				this.comesBefore(this.heap[right]!, this.heap[smallest]!)
			) {
				smallest = right;
			}
			if (smallest === parent) return;

			this.swap(parent, smallest);
			parent = smallest;
		}
	}

	private comesBefore(
		left: ScheduledWork<TTenant, TValue>,
		right: ScheduledWork<TTenant, TValue>,
	): boolean {
		if (left.virtualFinish !== right.virtualFinish) {
			return left.virtualFinish < right.virtualFinish;
		}

		return left.sequence < right.sequence;
	}

	private swap(left: number, right: number): void {
		const temporary = this.heap[left]!;
		this.heap[left] = this.heap[right]!;
		this.heap[right] = temporary;
	}
}
