export interface ReviewChange {
	path: string;
	revision: number;
	risk: number;
	validation: "passed" | "failed";
}

export interface PullRequestExplanation {
	claimsInputIsUnchanged: boolean;
	timeComplexity: string;
}

export interface ReviewFinding {
	code:
		| "FAILED_VALIDATION_INCLUDED"
		| "INPUT_MUTATED"
		| "MISLEADING_COMPLEXITY"
		| "STALE_REVISION_INCLUDED";
	message: string;
}

export interface ReviewablePullRequest {
	explanation: PullRequestExplanation;
	select(changes: ReviewChange[], limit: number): ReviewChange[];
}

/**
 * Deliberately flawed code-review fixture. It represents the proposed change,
 * not the implementation applications should call.
 */
export const aiGeneratedPullRequest: ReviewablePullRequest = {
	explanation: {
		claimsInputIsUnchanged: true,
		timeComplexity: "O(n)",
	},
	select(changes, limit) {
		return changes
			.sort((left, right) => right.risk - left.risk)
			.slice(0, limit);
	},
};

/**
 * Selects the newest validated revision of each path, ordered by risk.
 *
 * Invariant: every returned path is unique, validated, and represented by its
 * greatest revision. The caller's array is never mutated.
 *
 * Time: O(n + u log u), where u is the number of unique validated paths.
 * Auxiliary space: O(u).
 */
export function selectReviewChanges(
	changes: readonly ReviewChange[],
	limit: number,
): ReviewChange[] {
	if (!Number.isInteger(limit) || limit < 1) {
		throw new Error("limit must be a positive integer");
	}

	const newestByPath = new Map<string, ReviewChange>();
	for (const change of changes) {
		if (change.validation !== "passed") continue;
		const current = newestByPath.get(change.path);
		if (!current || change.revision > current.revision) {
			newestByPath.set(change.path, change);
		}
	}

	return [...newestByPath.values()]
		.sort(
			(left, right) =>
				right.risk - left.risk || left.path.localeCompare(right.path),
		)
		.slice(0, limit);
}

export const repairedPullRequest: ReviewablePullRequest = {
	explanation: {
		claimsInputIsUnchanged: true,
		timeComplexity: "O(n + u log u)",
	},
	select(changes, limit) {
		return selectReviewChanges(changes, limit);
	},
};

/**
 * Runs contract probes against a proposed implementation. The probes make a
 * review repeatable instead of relying on whether a reviewer spots the bug by
 * inspection alone.
 */
export function auditPullRequest(
	candidate: ReviewablePullRequest,
): ReviewFinding[] {
	const findings: ReviewFinding[] = [];
	const changes: ReviewChange[] = [
		{ path: "safe.ts", revision: 1, risk: 3, validation: "passed" },
		{ path: "blocked.ts", revision: 1, risk: 100, validation: "failed" },
		{ path: "safe.ts", revision: 2, risk: 8, validation: "passed" },
		{ path: "other.ts", revision: 1, risk: 5, validation: "passed" },
	];
	const before = changes.map((change) => ({ ...change }));
	const selected = candidate.select(changes, changes.length);

	if (selected.some((change) => change.validation === "failed")) {
		findings.push({
			code: "FAILED_VALIDATION_INCLUDED",
			message: "A failed validation can displace a deployable change.",
		});
	}

	const selectedSafe = selected.filter((change) => change.path === "safe.ts");
	if (selectedSafe.length !== 1 || selectedSafe[0]?.revision !== 2) {
		findings.push({
			code: "STALE_REVISION_INCLUDED",
			message: "Duplicate paths must collapse to their newest revision.",
		});
	}

	if (JSON.stringify(changes) !== JSON.stringify(before)) {
		findings.push({
			code: "INPUT_MUTATED",
			message: "Array.sort mutated the caller-owned input.",
		});
	}

	if (candidate.explanation.timeComplexity !== "O(n + u log u)") {
		findings.push({
			code: "MISLEADING_COMPLEXITY",
			message: "Risk ordering requires sorting the unique candidates.",
		});
	}

	return findings;
}
