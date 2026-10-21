import { createHash, randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, rm } from "node:fs/promises";
import { dirname } from "node:path";

export type ReviewGrade = "again" | "hard" | "good" | "easy";

export interface ReviewRecord {
	grade: ReviewGrade;
	reviews: number;
	streak: number;
	lastReviewedAt: string;
	dueAt: string;
}

export interface ReviewHistory {
	version: 1;
	entries: Record<string, ReviewRecord>;
}

interface ReviewTarget {
	testRelativePath: string;
	targetSymbols: Array<{ importPath: string; importedName: string }>;
	testBlocks: Array<{ text: string }>;
}

const DAY_MS = 86_400_000;
const INTERVAL_DAYS = [1, 3, 7, 14, 30, 60, 120, 180] as const;

/** Catalog numbers change as lessons are added. Case fingerprints don't.
 * Changing a target's tests intentionally starts a fresh review item.
 */
export function reviewKey(target: ReviewTarget): string {
	return createHash("sha256")
		.update(
			JSON.stringify([
				target.testRelativePath.replaceAll("\\", "/"),
				target.targetSymbols
					.map((symbol) => [
						symbol.importPath.replaceAll("\\", "/"),
						symbol.importedName,
					])
					.sort(),
				target.testBlocks.map((block) =>
					block.text.replaceAll("\r\n", "\n").trim(),
				),
			]),
		)
		.digest("hex");
}

export function isReviewGrade(value: unknown): value is ReviewGrade {
	return (
		value === "again" ||
		value === "hard" ||
		value === "good" ||
		value === "easy"
	);
}

/** Transparent study heuristic, not a calibrated memory or readiness model.
 * Again: ten minutes and reset. Hard: tomorrow, same stage. Good: advance
 * one stage. Easy: skip one stage. Intervals cap at 180 elapsed days.
 */
export function scheduleReview(
	previous: ReviewRecord | undefined,
	grade: ReviewGrade,
	now = new Date(),
): ReviewRecord {
	if (!isReviewGrade(grade))
		throw new Error("Grade must be again, hard, good, or easy.");
	if (!Number.isFinite(now.getTime()))
		throw new Error("Review time must be valid.");
	if (previous && previous.reviews >= Number.MAX_SAFE_INTEGER)
		throw new Error("Review counter is exhausted.");
	if (previous && new Date(previous.lastReviewedAt).getTime() > now.getTime()) {
		throw new Error(
			"Review time precedes the last review; check the system clock.",
		);
	}
	const stage = Math.min(previous?.streak ?? 0, INTERVAL_DAYS.length - 1);
	const nextStage = Math.min(
		stage + (grade === "easy" ? 2 : 1),
		INTERVAL_DAYS.length,
	);
	const interval =
		grade === "again"
			? 10 * 60_000
			: grade === "hard"
				? DAY_MS
				: INTERVAL_DAYS[
						Math.min(
							stage + (grade === "easy" ? 1 : 0),
							INTERVAL_DAYS.length - 1,
						)
					]! * DAY_MS;
	return {
		grade,
		reviews: (previous?.reviews ?? 0) + 1,
		streak:
			grade === "again"
				? 0
				: grade === "hard"
					? (previous?.streak ?? 0)
					: nextStage,
		lastReviewedAt: now.toISOString(),
		dueAt: new Date(now.getTime() + interval).toISOString(),
	};
}

function isCanonicalDate(value: unknown): value is string {
	return (
		typeof value === "string" &&
		Number.isFinite(Date.parse(value)) &&
		new Date(value).toISOString() === value
	);
}

function isReviewRecord(value: unknown): value is ReviewRecord {
	if (typeof value !== "object" || value === null) return false;
	const record = value as Record<string, unknown>;
	return (
		isReviewGrade(record["grade"]) &&
		typeof record["reviews"] === "number" &&
		Number.isSafeInteger(record["reviews"]) &&
		record["reviews"] > 0 &&
		typeof record["streak"] === "number" &&
		Number.isInteger(record["streak"]) &&
		record["streak"] >= 0 &&
		record["streak"] <= INTERVAL_DAYS.length &&
		record["streak"] <= record["reviews"] * 2 &&
		isCanonicalDate(record["lastReviewedAt"]) &&
		isCanonicalDate(record["dueAt"]) &&
		Date.parse(record["dueAt"]) > Date.parse(record["lastReviewedAt"])
	);
}

/** Missing history is normal. Malformed history must never be overwritten. */
export async function readReviewHistory(path: string): Promise<ReviewHistory> {
	let raw: string;
	try {
		raw = await readFile(path, "utf8");
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "ENOENT")
			return { version: 1, entries: {} };
		throw error;
	}
	let value: unknown;
	try {
		value = JSON.parse(raw);
	} catch {
		throw new Error(
			`Review history is invalid JSON; preserve and repair ${path}.`,
		);
	}
	if (typeof value !== "object" || value === null)
		throw new Error(`Invalid review history: ${path}`);
	const history = value as Record<string, unknown>;
	const entries = history["entries"];
	if (
		history["version"] !== 1 ||
		typeof entries !== "object" ||
		entries === null ||
		Array.isArray(entries) ||
		!Object.entries(entries).every(
			([key, record]) => /^[a-f0-9]{64}$/.test(key) && isReviewRecord(record),
		)
	) {
		throw new Error(`Invalid review history; preserve and repair ${path}.`);
	}
	return value as ReviewHistory;
}

async function replaceHistory(
	temporaryPath: string,
	path: string,
): Promise<void> {
	for (let attempt = 0; ; attempt++) {
		try {
			await rename(temporaryPath, path);
			return;
		} catch (error) {
			// Windows readers or antivirus scanners can briefly hold the destination
			// open. Retry replacement without unlinking the last complete snapshot.
			const code = (error as NodeJS.ErrnoException).code;
			if (
				process.platform !== "win32" ||
				attempt >= 6 ||
				!["EPERM", "EACCES", "EBUSY"].includes(code ?? "")
			)
				throw error;
			await Bun.sleep(Math.min(5 * 2 ** attempt, 100));
		}
	}
}

/** Lock the read/modify/write cycle; atomic rename keeps interrupted writes
 * from truncating history. An abandoned lock requires manual inspection.
 */
export async function recordReview(
	path: string,
	key: string,
	grade: ReviewGrade,
	now = new Date(),
): Promise<ReviewRecord> {
	if (!/^[a-f0-9]{64}$/.test(key)) throw new Error("Invalid review identity.");
	await mkdir(dirname(path), { recursive: true });
	const lockPath = `${path}.lock`;
	let lock;
	try {
		lock = await open(lockPath, "wx");
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "EEXIST")
			throw new Error(
				`Review history is locked. Close other practice writers; inspect ${lockPath} before removing an abandoned lock.`,
			);
		throw error;
	}
	const temporaryPath = `${path}.${randomUUID()}.tmp`;
	try {
		const history = await readReviewHistory(path);
		const result = scheduleReview(history.entries[key], grade, now);
		history.entries[key] = result;
		await Bun.write(temporaryPath, `${JSON.stringify(history, null, 2)}\n`);
		await replaceHistory(temporaryPath, path);
		return result;
	} finally {
		try {
			await rm(temporaryPath, { force: true });
		} finally {
			try {
				await lock.close();
			} finally {
				await rm(lockPath, { force: true });
			}
		}
	}
}

/** Due items first, then untouched items; future reviews stay scheduled. */
export function planReviews<T extends ReviewTarget>(
	targets: T[],
	history: ReviewHistory,
	now = new Date(),
): { due: T[]; unseen: T[] } {
	if (!Number.isFinite(now.getTime()))
		throw new Error("Review time must be valid.");
	const due = targets.filter((target) => {
		const entry = history.entries[reviewKey(target)];
		return entry !== undefined && Date.parse(entry.dueAt) <= now.getTime();
	});
	due.sort(
		(a, b) =>
			Date.parse(history.entries[reviewKey(a)]!.dueAt) -
			Date.parse(history.entries[reviewKey(b)]!.dueAt),
	);
	return {
		due,
		unseen: targets.filter(
			(target) => history.entries[reviewKey(target)] === undefined,
		),
	};
}
