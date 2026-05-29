type EventMap = Record<PropertyKey, unknown>;

type Listener<T> = (payload: T) => void | Promise<void>;

/**
 * Disposable unsubscribe function returned by EventBus subscriptions.
 */
export type Unsubscribe = (() => void) & Disposable;

function toDisposableUnsubscribe(dispose: () => void): Unsubscribe {
	let disposed = false;

	const unsubscribe = (() => {
		if (disposed) return;

		disposed = true;
		dispose();
	}) as Unsubscribe;

	unsubscribe[Symbol.dispose] = unsubscribe;

	return unsubscribe;
}

/**
 * Type-safe in-memory event bus for one-process pub/sub examples.
 */
export class EventBus<T extends EventMap> {
	private events: Map<keyof T, Set<Listener<unknown>>> = new Map();

	/**
	 * Registers a listener and returns a disposable unsubscribe function.
	 */
	subscribe<K extends keyof T>(
		event: K,
		listener: Listener<T[K]>,
	): Unsubscribe {
		if (!this.events.has(event)) {
			this.events.set(event, new Set());
		}

		const listeners = this.events.get(event)!;
		const storedListener = listener as Listener<unknown>;
		listeners.add(storedListener);

		return toDisposableUnsubscribe(() => {
			listeners.delete(storedListener);
			if (listeners.size === 0) {
				this.events.delete(event);
			}
		});
	}

	/**
	 * Registers a listener that is removed before its first invocation awaits.
	 */
	subscribeOnce<K extends keyof T>(
		event: K,
		listener: Listener<T[K]>,
	): Unsubscribe {
		let unsubscribe: Unsubscribe = toDisposableUnsubscribe(() => {});
		unsubscribe = this.subscribe(event, async (payload) => {
			unsubscribe();
			await listener(payload);
		});

		return unsubscribe;
	}

	/**
	 * Publishes a payload to current listeners and isolates listener failures.
	 */
	async publish<K extends keyof T>(event: K, payload: T[K]): Promise<void> {
		const listeners = this.events.get(event);
		if (!listeners) return;

		await Promise.allSettled(
			[...listeners].map((listener) => {
				try {
					return (listener as Listener<T[K]>)(payload);
				} catch (e) {
					console.error(e);
					return undefined; // <- ensures a value is returned
				}
			}),
		);
	}

	/**
	 * Removes all listeners from all events.
	 */
	clear(): void {
		this.events.clear();
	}

	/**
	 * Returns listener count for one event or the whole bus.
	 */
	listenerCount(event?: keyof T): number {
		if (event !== undefined) {
			return this.events.get(event)?.size ?? 0;
		}

		let count = 0;
		for (const listeners of this.events.values()) {
			count += listeners.size;
		}
		return count;
	}
}
