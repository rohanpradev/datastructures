import type { UIMessage } from "ai";
import {
	blob,
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const tutorThreads = sqliteTable(
	"tutor_threads",
	{
		createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
		id: text("id").primaryKey(),
		title: text("title").notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
	},
	(table) => [index("tutor_threads_updated_at_idx").on(table.updatedAt)],
);

export const tutorMessages = sqliteTable(
	"tutor_messages",
	{
		createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
		id: text("id").primaryKey(),
		parts: text("parts", { mode: "json" })
			.$type<UIMessage["parts"]>()
			.notNull(),
		role: text("role", { enum: ["assistant", "system", "user"] }).notNull(),
		runId: text("run_id").notNull(),
		sequence: integer("sequence").notNull(),
		threadId: text("thread_id")
			.notNull()
			.references(() => tutorThreads.id, { onDelete: "cascade" }),
	},
	(table) => [
		uniqueIndex("tutor_messages_thread_sequence_uidx").on(
			table.threadId,
			table.sequence,
		),
		uniqueIndex("tutor_messages_run_role_uidx").on(table.runId, table.role),
		index("tutor_messages_thread_created_at_idx").on(
			table.threadId,
			table.createdAt,
		),
	],
);

export const tutorRuns = sqliteTable(
	"tutor_runs",
	{
		completedAt: integer("completed_at", { mode: "timestamp_ms" }),
		error: text("error"),
		finishReason: text("finish_reason"),
		id: text("id").primaryKey(),
		inputTokens: integer("input_tokens"),
		modelId: text("model_id").notNull(),
		outputTokens: integer("output_tokens"),
		responseTimeMs: integer("response_time_ms"),
		startedAt: integer("started_at", { mode: "timestamp_ms" }).notNull(),
		status: text("status", {
			enum: ["completed", "failed", "running"],
		}).notNull(),
		threadId: text("thread_id")
			.notNull()
			.references(() => tutorThreads.id, { onDelete: "cascade" }),
		totalTokens: integer("total_tokens"),
	},
	(table) => [
		index("tutor_runs_thread_started_at_idx").on(
			table.threadId,
			table.startedAt,
		),
		index("tutor_runs_status_started_at_idx").on(table.status, table.startedAt),
	],
);

export const graphCheckpoints = sqliteTable(
	"graph_checkpoints",
	{
		checkpoint: blob("checkpoint", { mode: "buffer" }).notNull(),
		checkpointId: text("checkpoint_id").notNull(),
		checkpointNamespace: text("checkpoint_namespace").notNull(),
		checkpointType: text("checkpoint_type").notNull(),
		metadata: blob("metadata", { mode: "buffer" }).notNull(),
		metadataType: text("metadata_type").notNull(),
		parentCheckpointId: text("parent_checkpoint_id"),
		threadId: text("thread_id").notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.threadId, table.checkpointNamespace, table.checkpointId],
			name: "graph_checkpoints_pk",
		}),
		index("graph_checkpoints_lookup_idx").on(
			table.threadId,
			table.checkpointNamespace,
			table.checkpointId,
		),
	],
);

export const graphWrites = sqliteTable(
	"graph_writes",
	{
		channel: text("channel").notNull(),
		checkpointId: text("checkpoint_id").notNull(),
		checkpointNamespace: text("checkpoint_namespace").notNull(),
		data: blob("data", { mode: "buffer" }).notNull(),
		index: integer("write_index").notNull(),
		taskId: text("task_id").notNull(),
		threadId: text("thread_id").notNull(),
		type: text("type").notNull(),
	},
	(table) => [
		primaryKey({
			columns: [
				table.threadId,
				table.checkpointNamespace,
				table.checkpointId,
				table.taskId,
				table.index,
			],
			name: "graph_writes_pk",
		}),
		index("graph_writes_checkpoint_idx").on(
			table.threadId,
			table.checkpointNamespace,
			table.checkpointId,
		),
	],
);

export type TutorMessage = typeof tutorMessages.$inferSelect;
export type TutorRun = typeof tutorRuns.$inferSelect;
export type TutorThread = typeof tutorThreads.$inferSelect;
