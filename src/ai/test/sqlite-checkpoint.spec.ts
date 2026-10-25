import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { resolve } from "node:path";
import type { RunnableConfig } from "@langchain/core/runnables";
import {
	type CheckpointPendingWrite,
	emptyCheckpoint,
} from "@langchain/langgraph-checkpoint";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { readMigrationFiles } from "drizzle-orm/migrator";
import {
	createDatabase,
	type DatabaseHandle,
	migrateDatabase,
} from "../persistence";
import {
	DrizzleSqliteCheckpointer,
	PlainJsonSerializer,
} from "../sqlite-checkpoint";

const metadata = { parents: {}, source: "loop", step: 0 } as const;

describe("durable checkpoint writes", () => {
	let database: DatabaseHandle;
	let saver: DrizzleSqliteCheckpointer;
	let config: RunnableConfig;

	beforeEach(async () => {
		database = createDatabase(":memory:");
		migrateDatabase(database.db);
		saver = new DrizzleSqliteCheckpointer(database.db);
		config = await saver.put(
			{ configurable: { thread_id: Bun.randomUUIDv7() } },
			emptyCheckpoint(),
			metadata,
			{},
		);
	});

	afterEach(() => database.close());

	test("replays task paths before task IDs and preserves each task's write order", async () => {
		await saver.putWrites(config, [["items", "late"]], "a-task", "2");
		await saver.putWrites(
			config,
			[
				["items", "first"],
				["items", "second"],
			],
			"z-task",
			"1",
		);
		await saver.putWrites(config, [["items", "input"]], "input-task");
		const expected: CheckpointPendingWrite[] = [
			["input-task", "items", "input"],
			["z-task", "items", "first"],
			["z-task", "items", "second"],
			["a-task", "items", "late"],
		];

		// A fresh saver also proves the order lives in SQLite, not instance state.
		const reopened = new DrizzleSqliteCheckpointer(database.db);
		expect((await reopened.getTuple(config))?.pendingWrites).toEqual(expected);
		const history = await Array.fromAsync(reopened.list(config));
		expect(history[0]?.pendingWrites).toEqual(expected);
	});

	test("uses Unicode code point ordering for paths and task IDs", async () => {
		await saver.putWrites(config, [["items", "astral path"]], "a", "𐀀");
		await saver.putWrites(config, [["items", "BMP path"]], "z", "\uE000");
		await saver.putWrites(config, [["items", "astral ID"]], "𐀀");
		await saver.putWrites(config, [["items", "BMP ID"]], "\uE000");
		expect((await saver.getTuple(config))?.pendingWrites).toEqual([
			["\uE000", "items", "BMP ID"],
			["𐀀", "items", "astral ID"],
			["z", "items", "BMP path"],
			["a", "items", "astral path"],
		]);
	});

	test("keeps normal writes idempotent and replaces reserved error writes", async () => {
		await saver.putWrites(
			config,
			[
				["items", "original"],
				["__error__", "first error"],
			],
			"task",
			"1",
		);
		await saver.putWrites(config, [["items", "middle"]], "other", "2");
		await saver.putWrites(
			config,
			[
				["items", "duplicate"],
				["__error__", "updated error"],
			],
			"task",
			"3",
		);
		expect((await saver.getTuple(config))?.pendingWrites).toEqual([
			["task", "items", "original"],
			["other", "items", "middle"],
			["task", "__error__", "updated error"],
		]);
	});

	test("does not treat inherited object keys as reserved channels", async () => {
		await saver.putWrites(
			config,
			[
				["__proto__", "prototype"],
				["constructor", "constructor"],
				["toString", "method"],
			],
			"task",
		);
		expect((await saver.getTuple(config))?.pendingWrites).toEqual([
			["task", "__proto__", "prototype"],
			["task", "constructor", "constructor"],
			["task", "toString", "method"],
		]);
	});

	test("does not commit a prefix when later serialization fails", async () => {
		const cyclic: Record<string, unknown> = {};
		cyclic["self"] = cyclic;
		await expect(
			saver.putWrites(
				config,
				[
					["items", "must roll back"],
					["items", cyclic],
				],
				"task",
			),
		).rejects.toThrow();
		expect((await saver.getTuple(config))?.pendingWrites).toEqual([]);
	});

	test("rolls back inserts and reserved-write updates when a later SQL write fails", async () => {
		await saver.putWrites(config, [["__error__", "original error"]], "task");
		database.client.run(`CREATE TRIGGER reject_checkpoint_write
			BEFORE INSERT ON graph_writes WHEN NEW.channel = 'reject'
			BEGIN SELECT RAISE(ABORT, 'injected write failure'); END`);
		await expect(
			saver.putWrites(
				config,
				[
					["__error__", "must roll back"],
					["items", "must also roll back"],
					["reject", "injected failure"],
				],
				"task",
			),
		).rejects.toThrow();
		expect((await saver.getTuple(config))?.pendingWrites).toEqual([
			["task", "__error__", "original error"],
		]);
	});
});

test("migrates existing checkpoint writes with an empty task path and preserves their data", async () => {
	const database = createDatabase(":memory:");
	try {
		const original = readMigrationFiles({
			migrationsFolder: resolve(import.meta.dir, "../../../drizzle"),
		})[0]!;
		migrate(database.db, [
			{
				name: original.name,
				sql: original.sql.join("--> statement-breakpoint"),
				timestamp: original.folderMillis,
			},
		]);
		const saver = new DrizzleSqliteCheckpointer(database.db);
		const config = await saver.put(
			{ configurable: { thread_id: "legacy-thread" } },
			emptyCheckpoint(),
			metadata,
			{},
		);
		const [type, value] = await new PlainJsonSerializer().dumpsTyped({
			preserved: true,
		});
		database.client
			.query(
				`INSERT INTO graph_writes
				(channel, checkpoint_id, checkpoint_namespace, data, write_index, task_id, thread_id, type)
				VALUES (?, ?, '', ?, 0, 'legacy-task', 'legacy-thread', ?)`,
			)
			.run("items", config.configurable?.["checkpoint_id"], value, type);

		migrateDatabase(database.db);
		migrateDatabase(database.db);
		expect(
			database.client.query("SELECT task_path FROM graph_writes").get(),
		).toEqual({ task_path: "" });
		await saver.putWrites(config, [["items", "new write"]], "new-task", "1");
		expect((await saver.getTuple(config))?.pendingWrites).toEqual([
			["legacy-task", "items", { preserved: true }],
			["new-task", "items", "new write"],
		]);
	} finally {
		database.close();
	}
});
