type EventMap = Record<string, any>;

type Listener<T> = (payload: T) => void | Promise<void>;

export class EventBus<T extends EventMap> {
	private events: Map<keyof T, Set<Listener<any>>> = new Map();

	subscribe<K extends keyof T>(event: K, listener: Listener<T[K]>): () => void {
		if (!this.events.has(event)) {
			this.events.set(event, new Set());
		}

		const listeners = this.events.get(event)!;
		listeners.add(listener);

		// Return unsubscribe function
		return () => {
			listeners.delete(listener);
			if (listeners.size === 0) {
				this.events.delete(event);
			}
		};
	}

	subscribeOnce<K extends keyof T>(event: K, listener: Listener<T[K]>): void {
		const unsubscribe = this.subscribe(event, async (payload) => {
			await listener(payload);
			unsubscribe();
		});
	}

	async publish<K extends keyof T>(event: K, payload: T[K]): Promise<void> {
		const listeners = this.events.get(event);
		if (!listeners) return;

		await Promise.allSettled(
			[...listeners].map((listener) => {
				try {
					return listener(payload);
				} catch (e) {
					console.error(e);
					return undefined; // <- ensures a value is returned
				}
			}),
		);
	}

	clear() {
		this.events.clear();
	}
}
