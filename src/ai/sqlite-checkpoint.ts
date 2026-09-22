import type { RunnableConfig } from "@langchain/core/runnables";
import {
	BaseCheckpointSaver,
	type Checkpoint,
	type CheckpointListOptions,
	type CheckpointMetadata,
	type CheckpointPendingWrite,
	type CheckpointTuple,
	type PendingWrite,
	type SerializerProtocol,
	WRITES_IDX_MAP,
} from "@langchain/langgraph-checkpoint";
import { and, asc, desc, eq, lt } from "drizzle-orm";
import type { AiDatabase } from "./persistence";
import { graphCheckpoints, graphWrites } from "./schema";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * A deliberately narrow serializer for graph state owned by this service.
 * Wrapping preserves top-level `undefined` while avoiding constructor revival.
 */
export class PlainJsonSerializer implements SerializerProtocol {
	async dumpsTyped(data: unknown): Promise<[string, Uint8Array]> {
		return ["json", encoder.encode(JSON.stringify({ value: data }))];
	}

	async loadsTyped(type: string, data: Uint8Array | string): Promise<unknown> {
		if (type !== "json")
			throw new Error(`Unsupported checkpoint type: ${type}`);
		const text = typeof data === "string" ? data : decoder.decode(data);
		const parsed = JSON.parse(text) as { value: unknown };
		return parsed.value;
	}
}

interface CheckpointKey {
	checkpointId?: string | undefined;
	checkpointNamespace: string;
	threadId: string;
}

function checkpointKey(config: RunnableConfig): CheckpointKey {
	const configurable = config.configurable ?? {};
	const threadId = configurable["thread_id"];
	if (typeof threadId !== "string" || threadId.length === 0) {
		throw new Error(
			"LangGraph checkpoint config requires configurable.thread_id.",
		);
	}

	const checkpointId = configurable["checkpoint_id"];
	return {
		checkpointId:
			typeof checkpointId === "string" && checkpointId.length > 0
				? checkpointId
				: undefined,
		checkpointNamespace:
			typeof configurable["checkpoint_ns"] === "string"
				? configurable["checkpoint_ns"]
				: "",
		threadId,
	};
}

function runnableConfig(key: Required<CheckpointKey>): RunnableConfig {
	return {
		configurable: {
			checkpoint_id: key.checkpointId,
			checkpoint_ns: key.checkpointNamespace,
			thread_id: key.threadId,
		},
	};
}

function metadataMatches(
	metadata: CheckpointMetadata | undefined,
	filter: Record<string, unknown> | undefined,
): boolean {
	if (!filter) return true;
	if (!metadata) return false;
	const values = metadata as unknown as Record<string, unknown>;
	return Object.entries(filter).every(
		([key, value]) => JSON.stringify(values[key]) === JSON.stringify(value),
	);
}

export class DrizzleSqliteCheckpointer extends BaseCheckpointSaver<number> {
	constructor(
		private readonly db: AiDatabase,
		serde: SerializerProtocol = new PlainJsonSerializer(),
	) {
		super(serde);
	}

	async getTuple(config: RunnableConfig): Promise<CheckpointTuple | undefined> {
		const key = checkpointKey(config);
		const conditions = [
			eq(graphCheckpoints.threadId, key.threadId),
			eq(graphCheckpoints.checkpointNamespace, key.checkpointNamespace),
		];
		if (key.checkpointId) {
			conditions.push(eq(graphCheckpoints.checkpointId, key.checkpointId));
		}

		const [row] = await this.db
			.select()
			.from(graphCheckpoints)
			.where(and(...conditions))
			.orderBy(desc(graphCheckpoints.checkpointId))
			.limit(1);
		if (!row) return undefined;

		return this.hydrateTuple(row);
	}

	async *list(
		config: RunnableConfig,
		options: CheckpointListOptions = {},
	): AsyncGenerator<CheckpointTuple> {
		const key = checkpointKey(config);
		const conditions = [
			eq(graphCheckpoints.threadId, key.threadId),
			eq(graphCheckpoints.checkpointNamespace, key.checkpointNamespace),
		];
		const beforeId = options.before
			? checkpointKey(options.before).checkpointId
			: undefined;
		if (beforeId) conditions.push(lt(graphCheckpoints.checkpointId, beforeId));

		const rows = await this.db
			.select()
			.from(graphCheckpoints)
			.where(and(...conditions))
			.orderBy(desc(graphCheckpoints.checkpointId));

		let yielded = 0;
		for (const row of rows) {
			const tuple = await this.hydrateTuple(row);
			if (!metadataMatches(tuple.metadata, options.filter)) continue;
			yield tuple;
			yielded += 1;
			if (options.limit !== undefined && yielded >= options.limit) return;
		}
	}

	async put(
		config: RunnableConfig,
		checkpoint: Checkpoint,
		metadata: CheckpointMetadata,
		_newVersions: Record<string, number | string>,
	): Promise<RunnableConfig> {
		const key = checkpointKey(config);
		const [checkpointType, checkpointData] =
			await this.serde.dumpsTyped(checkpoint);
		const [metadataType, metadataData] = await this.serde.dumpsTyped(metadata);
		const values = {
			checkpoint: Buffer.from(checkpointData),
			checkpointId: checkpoint.id,
			checkpointNamespace: key.checkpointNamespace,
			checkpointType,
			metadata: Buffer.from(metadataData),
			metadataType,
			parentCheckpointId: key.checkpointId ?? null,
			threadId: key.threadId,
		};

		await this.db
			.insert(graphCheckpoints)
			.values(values)
			.onConflictDoUpdate({
				set: values,
				target: [
					graphCheckpoints.threadId,
					graphCheckpoints.checkpointNamespace,
					graphCheckpoints.checkpointId,
				],
			});

		return runnableConfig({
			checkpointId: checkpoint.id,
			checkpointNamespace: key.checkpointNamespace,
			threadId: key.threadId,
		});
	}

	async putWrites(
		config: RunnableConfig,
		writes: PendingWrite[],
		taskId: string,
	): Promise<void> {
		const key = checkpointKey(config);
		if (!key.checkpointId) {
			throw new Error("Pending writes require configurable.checkpoint_id.");
		}

		for (const [position, [channel, value]] of writes.entries()) {
			const [type, data] = await this.serde.dumpsTyped(value);
			const writeIndex = WRITES_IDX_MAP[channel] ?? position;
			const row = {
				channel,
				checkpointId: key.checkpointId,
				checkpointNamespace: key.checkpointNamespace,
				data: Buffer.from(data),
				index: writeIndex,
				taskId,
				threadId: key.threadId,
				type,
			};
			const insert = this.db.insert(graphWrites).values(row);

			if (channel in WRITES_IDX_MAP) {
				await insert.onConflictDoUpdate({
					set: { channel, data: row.data, type },
					target: [
						graphWrites.threadId,
						graphWrites.checkpointNamespace,
						graphWrites.checkpointId,
						graphWrites.taskId,
						graphWrites.index,
					],
				});
			} else {
				await insert.onConflictDoNothing();
			}
		}
	}

	async deleteThread(threadId: string): Promise<void> {
		this.db.transaction((tx) => {
			tx.delete(graphWrites).where(eq(graphWrites.threadId, threadId)).run();
			tx.delete(graphCheckpoints)
				.where(eq(graphCheckpoints.threadId, threadId))
				.run();
		});
	}

	private async hydrateTuple(
		row: typeof graphCheckpoints.$inferSelect,
	): Promise<CheckpointTuple> {
		const writes = await this.db
			.select()
			.from(graphWrites)
			.where(
				and(
					eq(graphWrites.threadId, row.threadId),
					eq(graphWrites.checkpointNamespace, row.checkpointNamespace),
					eq(graphWrites.checkpointId, row.checkpointId),
				),
			)
			.orderBy(asc(graphWrites.taskId), asc(graphWrites.index));
		const pendingWrites: CheckpointPendingWrite[] = [];
		for (const write of writes) {
			pendingWrites.push([
				write.taskId,
				write.channel,
				await this.serde.loadsTyped(write.type, write.data),
			]);
		}

		const key = {
			checkpointId: row.checkpointId,
			checkpointNamespace: row.checkpointNamespace,
			threadId: row.threadId,
		};
		const tuple: CheckpointTuple = {
			checkpoint: (await this.serde.loadsTyped(
				row.checkpointType,
				row.checkpoint,
			)) as Checkpoint,
			config: runnableConfig(key),
			metadata: (await this.serde.loadsTyped(
				row.metadataType,
				row.metadata,
			)) as CheckpointMetadata,
			pendingWrites,
		};
		if (row.parentCheckpointId) {
			tuple.parentConfig = runnableConfig({
				...key,
				checkpointId: row.parentCheckpointId,
			});
		}
		return tuple;
	}
}
