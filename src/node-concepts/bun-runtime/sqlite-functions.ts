import { Database } from "bun:sqlite";

export interface PracticeScoreSummary {
	attempts: number;
	mastered: number;
	average: number | null;
	variance: number | null;
}

interface VarianceState {
	count: number;
	mean: number;
	m2: number;
}

/**
 * Bun 1.4.4 SQLite functions: a mastery rule and a streaming score aggregate.
 *
 * Scores are percentages. At most 10,000 scores keep this synchronous teaching
 * lab bounded. Population variance measures the spread of the supplied batch;
 * an empty batch has no average or variance. Existing practice state is unused.
 * Time: O(n). SQLite storage: O(n); aggregate state: O(1).
 */
export function summarizePracticeScores(
	scores: readonly number[],
): PracticeScoreSummary {
	if (scores.length > 10_000)
		throw new RangeError("At most 10,000 scores are supported");
	for (const score of scores) {
		if (!Number.isFinite(score) || score < 0 || score > 100) {
			throw new RangeError(
				"Scores must be finite percentages between 0 and 100",
			);
		}
	}

	const db = new Database(":memory:", { strict: true });
	try {
		db.function("is_mastered", { deterministic: true }, (score: number) =>
			score >= 80 ? 1 : 0,
		);
		// A factory gives each SQL group a fresh accumulator. Welford's method
		// avoids subtracting two nearly equal squared sums.
		db.aggregate<VarianceState>("population_variance", {
			start: () => ({ count: 0, mean: 0, m2: 0 }),
			step: (state, score: number) => {
				const count = state.count + 1;
				const delta = score - state.mean;
				const mean = state.mean + delta / count;
				return { count, mean, m2: state.m2 + delta * (score - mean) };
			},
			result: (state) => (state.count === 0 ? null : state.m2 / state.count),
		});
		db.run(
			"CREATE TABLE scores (score REAL NOT NULL CHECK (score BETWEEN 0 AND 100))",
		);
		const insert = db.prepare("INSERT INTO scores VALUES (?)");
		try {
			db.transaction(() => {
				for (const score of scores) insert.run(score);
			})();
		} finally {
			insert.finalize();
		}

		const query = db.query<PracticeScoreSummary, []>(`
			SELECT COUNT(*) AS attempts, COALESCE(SUM(is_mastered(score)), 0) AS mastered,
				AVG(score) AS average, population_variance(score) AS variance
			FROM scores
		`);
		try {
			return query.get()!;
		} finally {
			query.finalize();
		}
	} finally {
		db.close();
	}
}
