import { Database } from "bun:sqlite";

/**
 * Supported difficulty levels for generated practice problems.
 */
export type PracticeDifficulty = "easy" | "medium" | "hard";

/**
 * Input shape for creating or updating one practice problem.
 */
export type PracticeProblemInput = {
	slug: string;
	title: string;
	pattern: string;
	difficulty: PracticeDifficulty;
	mastery?: number;
	attempts?: number;
	solved?: number;
	updatedAt?: number;
};

/**
 * Row shape returned by SQLite queries against the practice problem table.
 */
export type PracticeProblemRow = {
	slug: string;
	title: string;
	pattern: string;
	difficulty: PracticeDifficulty;
	mastery: number;
	attempts: number;
	solved: number;
	updated_at: number;
};

/**
 * Aggregated progress metrics grouped by interview pattern.
 */
export type PatternStats = {
	pattern: string;
	total: number;
	average_mastery: number;
	solved: number;
	attempts: number;
};

type SqlParams = Record<string, string | number | boolean | null>;

/**
 * Creates an in-memory SQLite store for interview-practice progress.
 *
 * Bun's `bun:sqlite` is useful for local-first CLIs, coding trackers,
 * take-home projects, and tests that need a real SQL engine without a server.
 */
export function createPracticeProblemDatabase(
	problems: PracticeProblemInput[] = [],
): Database {
	const db = new Database(":memory:", { strict: true });

	db.run(`
		CREATE TABLE problems (
			slug TEXT PRIMARY KEY,
			title TEXT NOT NULL,
			pattern TEXT NOT NULL,
			difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
			mastery INTEGER NOT NULL DEFAULT 0 CHECK (mastery BETWEEN 0 AND 5),
			attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
			solved INTEGER NOT NULL DEFAULT 0 CHECK (solved >= 0),
			updated_at INTEGER NOT NULL
		);
	`);

	if (problems.length > 0) {
		upsertPracticeProblems(db, problems);
	}

	return db;
}

/**
 * Inserts or updates practice problems in one transaction.
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1), excluding SQLite storage
 */
export function upsertPracticeProblems(
	db: Database,
	problems: PracticeProblemInput[],
): number {
	const now = Date.now();
	const upsert = db.prepare<unknown, [SqlParams]>(`
		INSERT INTO problems (
			slug,
			title,
			pattern,
			difficulty,
			mastery,
			attempts,
			solved,
			updated_at
		)
		VALUES (
			$slug,
			$title,
			$pattern,
			$difficulty,
			$mastery,
			$attempts,
			$solved,
			$updatedAt
		)
		ON CONFLICT(slug) DO UPDATE SET
			title = excluded.title,
			pattern = excluded.pattern,
			difficulty = excluded.difficulty,
			mastery = excluded.mastery,
			attempts = excluded.attempts,
			solved = excluded.solved,
			updated_at = excluded.updated_at;
	`);

	const insertMany = db.transaction((items: PracticeProblemInput[]) => {
		let changedRows = 0;

		for (const problem of items) {
			const result = upsert.run({
				slug: problem.slug,
				title: problem.title,
				pattern: problem.pattern,
				difficulty: problem.difficulty,
				mastery: problem.mastery ?? 0,
				attempts: problem.attempts ?? 0,
				solved: problem.solved ?? 0,
				updatedAt: problem.updatedAt ?? now,
			});
			changedRows += result.changes;
		}

		return changedRows;
	});

	try {
		return insertMany(problems);
	} finally {
		upsert.finalize();
	}
}

/**
 * Records one solve attempt and adjusts mastery.
 *
 * A solved attempt increases mastery up to 5. A failed attempt lowers mastery
 * down to 0. This intentionally models spaced-repetition style review.
 */
export function recordPracticeAttempt(
	db: Database,
	slug: string,
	wasSolved: boolean,
	updatedAt = Date.now(),
): void {
	const update = db.prepare<unknown, [SqlParams]>(`
		UPDATE problems
		SET
			attempts = attempts + 1,
			solved = solved + $solved,
			mastery = CASE
				WHEN $solved = 1 THEN min(5, mastery + 1)
				ELSE max(0, mastery - 1)
			END,
			updated_at = $updatedAt
		WHERE slug = $slug;
	`);

	try {
		const result = update.run({
			slug,
			solved: wasSolved ? 1 : 0,
			updatedAt,
		});

		if (result.changes === 0) {
			throw new Error(`Unknown practice problem: ${slug}`);
		}
	} finally {
		update.finalize();
	}
}

/**
 * Returns problems that should be reviewed first.
 *
 * Lower mastery comes first, then fewer attempts, then easier problems. This
 * keeps a session focused on weak topics without hiding approachable wins.
 */
export function listDuePracticeProblems(
	db: Database,
	maxMastery = 2,
	limit = 10,
): PracticeProblemRow[] {
	const query = db.query<PracticeProblemRow, [SqlParams]>(`
			SELECT
				slug,
				title,
				pattern,
				difficulty,
				mastery,
				attempts,
				solved,
				updated_at
			FROM problems
			WHERE mastery <= $maxMastery
			ORDER BY
				mastery ASC,
				attempts ASC,
				CASE difficulty
					WHEN 'easy' THEN 0
					WHEN 'medium' THEN 1
					ELSE 2
				END ASC,
				slug ASC
			LIMIT $limit;
		`);

	try {
		return query.all({ maxMastery, limit });
	} finally {
		query.finalize();
	}
}

/**
 * Summarizes progress by interview pattern.
 */
export function getPracticePatternStats(db: Database): PatternStats[] {
	const query = db.query<PatternStats, []>(`
			SELECT
				pattern,
				COUNT(*) AS total,
				ROUND(AVG(mastery), 2) AS average_mastery,
				SUM(CASE WHEN mastery >= 4 THEN 1 ELSE 0 END) AS solved,
				SUM(attempts) AS attempts
			FROM problems
			GROUP BY pattern
			ORDER BY pattern ASC;
		`);

	try {
		return query.all();
	} finally {
		query.finalize();
	}
}
