export interface EvaluationCase<TInput> {
	id: string;
	input: TInput;
}

export interface ToolCallObservation {
	authorized: boolean;
	name: string;
}

export interface EvaluationObservation {
	costUsd: number;
	humanCorrections: number;
	rolledBack: boolean;
	taskSucceeded: boolean;
	toolCalls: readonly ToolCallObservation[];
}

export interface EvaluationCaseResult extends EvaluationObservation {
	error?: string | undefined;
	id: string;
	latencyMs: number;
	unsafeToolCalls: number;
}

export interface EvaluationSummary {
	averageCostUsd: number;
	averageLatencyMs: number;
	cases: number;
	humanCorrectionRate: number;
	humanCorrections: number;
	p95LatencyMs: number;
	rollbackRate: number;
	successRate: number;
	totalCostUsd: number;
	unsafeToolCallRate: number;
	unsafeToolCalls: number;
}

export interface EvaluationReport {
	results: EvaluationCaseResult[];
	summary: EvaluationSummary;
}

export interface EvaluationHarnessOptions {
	now?: (() => number) | undefined;
}

function validateObservation(observation: EvaluationObservation): void {
	if (!Number.isFinite(observation.costUsd) || observation.costUsd < 0) {
		throw new Error("costUsd must be a non-negative finite number");
	}
	if (
		!Number.isInteger(observation.humanCorrections) ||
		observation.humanCorrections < 0
	) {
		throw new Error("humanCorrections must be a non-negative integer");
	}
}

function percentile(values: readonly number[], fraction: number): number {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((left, right) => left - right);
	const index = Math.max(0, Math.ceil(sorted.length * fraction) - 1);
	return sorted[index] ?? 0;
}

/**
 * Evaluates a scenario set and reports outcome, safety, latency, cost,
 * rollback, and human-correction signals together.
 *
 * Runs sequentially for deterministic local exercises. Time is O(c * r), where
 * c is case count and r is runner cost; report aggregation uses O(c) space.
 */
export async function runEvaluation<TInput>(
	cases: readonly EvaluationCase<TInput>[],
	runner: (
		testCase: EvaluationCase<TInput>,
	) => EvaluationObservation | Promise<EvaluationObservation>,
	options: EvaluationHarnessOptions = {},
): Promise<EvaluationReport> {
	if (cases.length < 2) {
		throw new Error("evaluation requires at least two cases");
	}
	if (new Set(cases.map(({ id }) => id)).size !== cases.length) {
		throw new Error("evaluation case IDs must be unique");
	}
	const now = options.now ?? Date.now;
	const results: EvaluationCaseResult[] = [];

	for (const testCase of cases) {
		const startedAtMs = now();
		try {
			const observation = await runner(testCase);
			validateObservation(observation);
			results.push({
				...observation,
				id: testCase.id,
				latencyMs: Math.max(0, now() - startedAtMs),
				unsafeToolCalls: observation.toolCalls.filter(
					({ authorized }) => !authorized,
				).length,
			});
		} catch (error) {
			results.push({
				costUsd: 0,
				error: error instanceof Error ? error.message : String(error),
				humanCorrections: 0,
				id: testCase.id,
				latencyMs: Math.max(0, now() - startedAtMs),
				rolledBack: false,
				taskSucceeded: false,
				toolCalls: [],
				unsafeToolCalls: 0,
			});
		}
	}

	const count = results.length;
	const successes = results.filter(({ taskSucceeded }) => taskSucceeded).length;
	const rollbacks = results.filter(({ rolledBack }) => rolledBack).length;
	const correctedCases = results.filter(
		({ humanCorrections }) => humanCorrections > 0,
	).length;
	const humanCorrections = results.reduce(
		(total, result) => total + result.humanCorrections,
		0,
	);
	const totalCostUsd = results.reduce(
		(total, result) => total + result.costUsd,
		0,
	);
	const unsafeToolCalls = results.reduce(
		(total, result) => total + result.unsafeToolCalls,
		0,
	);
	const toolCalls = results.reduce(
		(total, result) => total + result.toolCalls.length,
		0,
	);
	const totalLatencyMs = results.reduce(
		(total, result) => total + result.latencyMs,
		0,
	);

	return {
		results,
		summary: {
			averageCostUsd: totalCostUsd / count,
			averageLatencyMs: totalLatencyMs / count,
			cases: count,
			humanCorrectionRate: correctedCases / count,
			humanCorrections,
			p95LatencyMs: percentile(
				results.map(({ latencyMs }) => latencyMs),
				0.95,
			),
			rollbackRate: rollbacks / count,
			successRate: successes / count,
			totalCostUsd,
			unsafeToolCallRate: toolCalls === 0 ? 0 : unsafeToolCalls / toolCalls,
			unsafeToolCalls,
		},
	};
}
