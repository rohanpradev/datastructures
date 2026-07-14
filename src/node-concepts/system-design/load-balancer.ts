export interface Backend {
	id: string;
}

/**
 * A handle returned by `LeastConnectionsLoadBalancer.acquire()`.
 *
 * Releasing the handle is part of the algorithm: if callers forget it, the
 * balancer believes a backend is permanently busy. `using` makes that lifecycle
 * visible and exception-safe in modern TypeScript.
 */
export interface BackendLease<TBackend extends Backend> extends Disposable {
	readonly backend: TBackend;
	readonly released: boolean;
	release(): void;
}

function validateBackends<TBackend extends Backend>(
	backends: readonly TBackend[],
): void {
	const ids = new Set<string>();

	for (const backend of backends) {
		if (backend.id.trim().length === 0) {
			throw new Error("backend id must not be empty");
		}
		if (ids.has(backend.id)) {
			throw new Error(`duplicate backend id: ${backend.id}`);
		}
		ids.add(backend.id);
	}
}

/**
 * Round-robin load balancing for roughly equal, stateless backends.
 *
 * Invariant: after `k` successful selections, the next index is
 * `k mod backendCount`. Selection is O(1); replacing the pool is O(n).
 *
 * Production upgrade: combine this policy with health checks, outlier ejection,
 * connection draining, locality awareness, and a bounded retry budget. A retry
 * must not quietly double the total load during an incident.
 */
export class RoundRobinLoadBalancer<TBackend extends Backend> {
	private backends: TBackend[];
	private cursor = 0;

	constructor(backends: readonly TBackend[]) {
		validateBackends(backends);
		this.backends = [...backends];
	}

	select(): TBackend | undefined {
		if (this.backends.length === 0) return undefined;

		const backend = this.backends[this.cursor]!;
		this.cursor = (this.cursor + 1) % this.backends.length;
		return backend;
	}

	/**
	 * Replaces the healthy pool and restarts rotation.
	 *
	 * Real proxies usually preserve more state, but resetting here keeps the
	 * teaching invariant deterministic when membership changes.
	 */
	setBackends(backends: readonly TBackend[]): void {
		validateBackends(backends);
		this.backends = [...backends];
		this.cursor = 0;
	}

	size(): number {
		return this.backends.length;
	}
}

interface BackendState<TBackend extends Backend> {
	backend: TBackend;
	active: number;
	sequence: number;
}

/**
 * Least-connections load balancing for requests with uneven durations.
 *
 * The least busy backend wins. Ties rotate by selection sequence so the first
 * backend does not receive every request when all active counts are equal.
 * Selection is O(n), which is intentionally easy to inspect. Large production
 * pools use heaps, sampling ("power of two choices"), or proxy-native counters.
 */
export class LeastConnectionsLoadBalancer<TBackend extends Backend> {
	private readonly states: BackendState<TBackend>[];
	private sequence = 0;

	constructor(backends: readonly TBackend[]) {
		validateBackends(backends);
		this.states = backends.map((backend, sequence) => ({
			active: 0,
			backend,
			sequence,
		}));
	}

	acquire(): BackendLease<TBackend> | undefined {
		let selected: BackendState<TBackend> | undefined;

		for (const state of this.states) {
			if (
				!selected ||
				state.active < selected.active ||
				(state.active === selected.active && state.sequence < selected.sequence)
			) {
				selected = state;
			}
		}

		if (!selected) return undefined;

		selected.active++;
		selected.sequence = this.sequence++ + this.states.length;
		let released = false;

		return {
			backend: selected.backend,
			get released() {
				return released;
			},
			release: () => {
				if (released) return;
				released = true;
				selected.active--;
			},
			[Symbol.dispose]() {
				this.release();
			},
		};
	}

	activeConnections(): Readonly<Record<string, number>> {
		return Object.fromEntries(
			this.states.map(({ active, backend }) => [backend.id, active]),
		);
	}
}
