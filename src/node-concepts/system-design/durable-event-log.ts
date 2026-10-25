import { Database } from "bun:sqlite";

export interface RoomEvent {
	sequence: number;
	room: string;
	eventId: string;
	text: string;
	createdAt: number;
}

export class EventLogError extends Error {
	constructor(
		message: string,
		readonly status: 400 | 409,
	) {
		super(message);
	}
}

export function validateRoom(room: string): void {
	if (!/^[a-z0-9-]{1,48}$/.test(room)) {
		throw new EventLogError(
			"room needs 1-48 lowercase letters, digits or hyphens",
			400,
		);
	}
}

/**
 * Source of truth for the real-time lab. A WebSocket notification is merely
 * a hint; disconnected clients recover committed events by durable cursor.
 *
 * UNIQUE(room,event_id) makes retries safe across process restart. Reusing an
 * ID with a different payload is a conflict, never an overwrite. The append
 * transaction commits before the caller publishes a notification.
 *
 * Indexed append/lookup O(log n); replay O(log n + k); retained storage O(n).
 * Sequence is global: room-local gaps are valid. It is ordering, not a clock.
 * SQLite is one host's storage; this is not distributed consensus or a broker.
 */
export class DurableEventLog {
	private readonly db: Database;

	constructor(filename = ":memory:") {
		this.db = new Database(filename, { create: true, strict: true });
		this.db.exec(`
			PRAGMA journal_mode = WAL;
			PRAGMA busy_timeout = 1000;
			CREATE TABLE IF NOT EXISTS room_events (
				sequence INTEGER PRIMARY KEY AUTOINCREMENT,
				room TEXT NOT NULL,
				event_id TEXT NOT NULL,
				text TEXT NOT NULL,
				created_at INTEGER NOT NULL,
				UNIQUE(room, event_id)
			);
			CREATE INDEX IF NOT EXISTS room_replay ON room_events(room, sequence);
		`);
	}

	append(
		room: string,
		eventId: string,
		text: string,
	): {
		event: RoomEvent;
		created: boolean;
	} {
		validateRoom(room);
		if (!/^[a-zA-Z0-9_-]{1,80}$/.test(eventId)) {
			throw new EventLogError(
				"eventId needs 1-80 letters, digits, underscores or hyphens",
				400,
			);
		}
		if (!text.trim() || text.length > 500) {
			throw new EventLogError(
				"text needs 1-500 characters and cannot be blank",
				400,
			);
		}
		return this.db
			.transaction(() => {
				const existing = this.db
					.query<RoomEvent, [string, string]>(
						`
				SELECT sequence, room, event_id AS eventId, text, created_at AS createdAt
				FROM room_events WHERE room = ? AND event_id = ?
			`,
					)
					.get(room, eventId);
				if (existing) {
					if (existing.text !== text) {
						throw new EventLogError(
							"eventId already belongs to a different payload",
							409,
						);
					}
					return { created: false, event: existing };
				}
				const createdAt = Date.now();
				const result = this.db
					.query(
						`
				INSERT INTO room_events(room, event_id, text, created_at) VALUES (?, ?, ?, ?)
			`,
					)
					.run(room, eventId, text, createdAt);
				return {
					created: true,
					event: {
						createdAt,
						eventId,
						room,
						sequence: Number(result.lastInsertRowid),
						text,
					},
				};
			})
			.immediate();
	}

	read(
		room: string,
		after = 0,
		limit = 25,
	): {
		events: RoomEvent[];
		nextCursor: number;
		hasMore: boolean;
	} {
		validateRoom(room);
		if (!Number.isSafeInteger(after) || after < 0) {
			throw new EventLogError("after must be a nonnegative safe integer", 400);
		}
		if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
			throw new EventLogError("limit must be an integer from 1 to 100", 400);
		}
		// Seek pagination uses the index; OFFSET would rescan older history.
		const rows = this.db
			.query<RoomEvent, [string, number, number]>(
				`
			SELECT sequence, room, event_id AS eventId, text, created_at AS createdAt
			FROM room_events WHERE room = ? AND sequence > ? ORDER BY sequence LIMIT ?
		`,
			)
			.all(room, after, limit + 1);
		const events = rows.slice(0, limit);
		return {
			events,
			hasMore: rows.length > limit,
			nextCursor: events.at(-1)?.sequence ?? after,
		};
	}

	close(): void {
		this.db.close();
	}

	[Symbol.dispose](): void {
		this.close();
	}
}
