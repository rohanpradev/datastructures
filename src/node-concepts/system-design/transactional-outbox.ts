import { Database } from "bun:sqlite";

export interface OutboxEvent {
	id: number;
	eventId: string;
	key: string;
	value: string;
}

/**
 * Commit a string record and its change event in the SAME SQLite transaction.
 * Invariant: a failed event insert cannot leave a committed record update.
 * Trace: commit order:1 + event:e1; publish e1; crash before markPublished;
 * pending() returns e1 again. Consumers must deduplicate by eventId atomically
 * with their effect. An outbox closes the dual-write gap, not the delivery gap.
 * Indexed writes O(log n); pending O(log n + limit); storage O(n) retained rows.
 * Default database is ephemeral; pass a filename for durability. This teaching
 * relay is single-worker; production adds leases, per-key ordering, retention,
 * schema versions, lag metrics and poison-event handling.
 */
export class TransactionalOutbox {
	private readonly db: Database;

	constructor(filename = ":memory:") {
		this.db = new Database(filename, { create: true });
		this.db.exec(`
			CREATE TABLE IF NOT EXISTS outbox_records (
				key TEXT PRIMARY KEY, value TEXT NOT NULL
			);
			CREATE TABLE IF NOT EXISTS outbox_events (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				event_id TEXT NOT NULL UNIQUE,
				key TEXT NOT NULL, value TEXT NOT NULL,
				published INTEGER NOT NULL DEFAULT 0
			);
			CREATE INDEX IF NOT EXISTS outbox_pending
			ON outbox_events(published, id);
		`);
	}

	setWithEvent(key: string, value: string, eventId: string): void {
		if (!key.trim() || !eventId.trim()) {
			throw new Error("key and eventId must not be empty");
		}
		this.db.transaction(() => {
			this.db
				.query(`INSERT INTO outbox_records(key, value) VALUES (?, ?)
				ON CONFLICT(key) DO UPDATE SET value = excluded.value`)
				.run(key, value);
			this.db
				.query(`INSERT INTO outbox_events(event_id, key, value)
				VALUES (?, ?, ?)`)
				.run(eventId, key, value);
		})();
	}

	get(key: string): string | undefined {
		return this.db
			.query<{ value: string }, [string]>(
				"SELECT value FROM outbox_records WHERE key = ?",
			)
			.get(key)?.value;
	}

	pending(limit = 100): OutboxEvent[] {
		if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1000) {
			throw new RangeError("limit must be an integer between 1 and 1000");
		}
		return this.db
			.query<OutboxEvent, [number]>(
				`SELECT id, event_id AS eventId, key, value FROM outbox_events
			 WHERE published = 0 ORDER BY id LIMIT ?`,
			)
			.all(limit);
	}

	markPublished(eventId: string): boolean {
		return (
			this.db
				.query(
					"UPDATE outbox_events SET published = 1 WHERE event_id = ? AND published = 0",
				)
				.run(eventId).changes === 1
		);
	}

	close(): void {
		this.db.close();
	}
}
