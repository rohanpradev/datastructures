import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { validateUIMessages } from "ai";
import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import {
	type TutorMessage,
	type TutorRun,
	type TutorThread,
	tutorMessages,
	tutorRuns,
	tutorThreads,
} from "./schema";
import { threadListQuerySchema } from "./state";

const DEFAULT_DATABASE_PATH = "data/typescript-tutor.sqlite";
const DEFAULT_MIGRATIONS_PATH = resolve(import.meta.dir, "../../drizzle");

export type AiDatabase = ReturnType<typeof drizzle>;

export interface DatabaseHandle {
	client: Database;
	close(): void;
	db: AiDatabase;
}

function isInMemoryPath(path: string): boolean {
	return path === ":memory:" || path.startsWith("file::memory:");
}

export function createDatabase(
	path = process.env["AI_DATABASE_PATH"] ?? DEFAULT_DATABASE_PATH,
): DatabaseHandle {
	if (!isInMemoryPath(path))
		mkdirSync(dirname(resolve(path)), { recursive: true });

	const client = new Database(path, { create: true, strict: true });

	// These are connection settings, not application data queries. All reads and
	// writes below go through Drizzle's typed query builder.
	client.run("PRAGMA foreign_keys = ON");
	client.run("PRAGMA busy_timeout = 5000");
	if (!isInMemoryPath(path)) client.run("PRAGMA journal_mode = WAL");

	const db = drizzle({ client });
	return {
		client,
		close: () => client.close(false),
		db,
	};
}

export function migrateDatabase(
	db: AiDatabase,
	migrationsFolder = DEFAULT_MIGRATIONS_PATH,
): void {
	const result = migrate(db, { migrationsFolder });
	if (result && "error" in result) {
		throw result.error;
	}
}

function textParts(text: string): TutorMessage["parts"] {
	return [{ text, type: "text" }];
}

export function messageText(message: TutorMessage): string {
	return message.parts
		.filter(
			(
				part,
			): part is Extract<(typeof message.parts)[number], { type: "text" }> =>
				part.type === "text",
		)
		.map((part) => part.text)
		.join("\n");
}

export class TutorRepository {
	constructor(readonly db: AiDatabase) {}

	async ensureThread(threadId: string, prompt: string): Promise<TutorThread> {
		const now = new Date();
		const title = prompt.replaceAll(/\s+/gu, " ").trim().slice(0, 100);

		await this.db
			.insert(tutorThreads)
			.values({ createdAt: now, id: threadId, title, updatedAt: now })
			.onConflictDoNothing({ target: tutorThreads.id });

		const [thread] = await this.db
			.select()
			.from(tutorThreads)
			.where(eq(tutorThreads.id, threadId))
			.limit(1);

		if (!thread) throw new Error(`Failed to create tutor thread ${threadId}.`);
		return thread;
	}

	async getThread(threadId: string): Promise<TutorThread | undefined> {
		const [thread] = await this.db
			.select()
			.from(tutorThreads)
			.where(eq(tutorThreads.id, threadId))
			.limit(1);
		return thread;
	}

	async listMessages(threadId: string): Promise<TutorMessage[]> {
		const messages = await this.db
			.select()
			.from(tutorMessages)
			.where(eq(tutorMessages.threadId, threadId))
			.orderBy(asc(tutorMessages.sequence));

		// JSON columns are statically typed by Drizzle, but persisted data still
		// crosses a runtime trust boundary. AI SDK validation prevents malformed
		// message parts from reaching either the model or an API response.
		if (messages.length > 0) {
			await validateUIMessages({
				messages: messages.map(({ id, parts, role }) => ({ id, parts, role })),
			});
		}
		return messages;
	}

	async listThreads(
		options: { limit?: number; offset?: number } = {},
	): Promise<{
		threads: TutorThread[];
		nextOffset: number | null;
	}> {
		const { limit, offset } = threadListQuerySchema.parse(options);
		const rows = await this.db
			.select()
			.from(tutorThreads)
			.orderBy(desc(tutorThreads.updatedAt), desc(tutorThreads.id))
			.limit(limit + 1)
			.offset(offset);
		return {
			threads: rows.slice(0, limit),
			nextOffset: rows.length > limit ? offset + limit : null,
		};
	}

	async appendTurn(
		threadId: string,
		runId: string,
		userText: string,
		assistantText: string,
	): Promise<void> {
		this.db.transaction((tx) => {
			const [existing] = tx
				.select({ id: tutorMessages.id })
				.from(tutorMessages)
				.where(eq(tutorMessages.runId, runId))
				.limit(1)
				.all();
			if (existing) return;

			const [latest] = tx
				.select({ sequence: tutorMessages.sequence })
				.from(tutorMessages)
				.where(eq(tutorMessages.threadId, threadId))
				.orderBy(desc(tutorMessages.sequence))
				.limit(1)
				.all();
			const next = (latest?.sequence ?? -1) + 1;
			const now = new Date();

			tx.insert(tutorMessages)
				.values([
					{
						createdAt: now,
						id: Bun.randomUUIDv7(),
						parts: textParts(userText),
						role: "user",
						runId,
						sequence: next,
						threadId,
					},
					{
						createdAt: now,
						id: Bun.randomUUIDv7(),
						parts: textParts(assistantText),
						role: "assistant",
						runId,
						sequence: next + 1,
						threadId,
					},
				])
				.run();

			tx.update(tutorThreads)
				.set({ updatedAt: now })
				.where(eq(tutorThreads.id, threadId))
				.run();
		});
	}

	async startRun(run: {
		id: string;
		modelId: string;
		threadId: string;
	}): Promise<void> {
		await this.db
			.insert(tutorRuns)
			.values({
				id: run.id,
				modelId: run.modelId,
				startedAt: new Date(),
				status: "running",
				threadId: run.threadId,
			})
			.onConflictDoNothing({ target: tutorRuns.id });
	}

	async completeRun(
		runId: string,
		metrics: {
			finishReason?: string | undefined;
			inputTokens?: number | undefined;
			outputTokens?: number | undefined;
			responseTimeMs?: number | undefined;
			totalTokens?: number | undefined;
		},
	): Promise<void> {
		await this.db
			.update(tutorRuns)
			.set({
				completedAt: new Date(),
				finishReason: metrics.finishReason,
				inputTokens: metrics.inputTokens,
				outputTokens: metrics.outputTokens,
				responseTimeMs: metrics.responseTimeMs,
				status: "completed",
				totalTokens: metrics.totalTokens,
			})
			.where(eq(tutorRuns.id, runId));
	}

	async failRun(runId: string, error: unknown): Promise<void> {
		await this.db
			.update(tutorRuns)
			.set({
				completedAt: new Date(),
				error: error instanceof Error ? error.message : String(error),
				status: "failed",
			})
			.where(eq(tutorRuns.id, runId));
	}

	async getRun(threadId: string, runId: string): Promise<TutorRun | undefined> {
		const [run] = await this.db
			.select()
			.from(tutorRuns)
			.where(and(eq(tutorRuns.threadId, threadId), eq(tutorRuns.id, runId)))
			.limit(1);
		return run;
	}
}
