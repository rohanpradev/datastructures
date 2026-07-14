export interface QuorumPlan {
	replicas: number;
	readQuorum: number;
	writeQuorum: number;
}

export interface QuorumAnalysis extends QuorumPlan {
	/** Maximum unavailable replicas while a read can still collect R replies. */
	readFailureTolerance: number;
	/** Maximum unavailable replicas while a write can still collect W replies. */
	writeFailureTolerance: number;
	/** R + W > N, so every read set intersects every acknowledged write set. */
	readWriteOverlap: boolean;
	/** 2W > N, so any two acknowledged write sets intersect. */
	writeWriteOverlap: boolean;
}

function validatePositiveInteger(name: string, value: number): void {
	if (!Number.isInteger(value) || value < 1) {
		throw new Error(`${name} must be a positive integer`);
	}
}

/**
 * Explains the N/R/W trade-off used by Dynamo-style replicated stores.
 *
 * - N: number of replicas.
 * - R: replicas that must answer a read.
 * - W: replicas that must acknowledge a write.
 *
 * `R + W > N` guarantees an intersecting replica, not linearizability by
 * itself. The system still needs version ordering, conflict handling, bounded
 * clocks, and a coordinator protocol. This distinction is a frequent senior
 * system-design follow-up.
 *
 * Time and space: O(1).
 */
export function analyzeQuorum(plan: QuorumPlan): QuorumAnalysis {
	validatePositiveInteger("replicas", plan.replicas);
	validatePositiveInteger("readQuorum", plan.readQuorum);
	validatePositiveInteger("writeQuorum", plan.writeQuorum);

	if (plan.readQuorum > plan.replicas) {
		throw new Error("readQuorum must not exceed replicas");
	}
	if (plan.writeQuorum > plan.replicas) {
		throw new Error("writeQuorum must not exceed replicas");
	}

	return {
		...plan,
		readFailureTolerance: plan.replicas - plan.readQuorum,
		readWriteOverlap: plan.readQuorum + plan.writeQuorum > plan.replicas,
		writeFailureTolerance: plan.replicas - plan.writeQuorum,
		writeWriteOverlap: plan.writeQuorum * 2 > plan.replicas,
	};
}

/**
 * Returns a symmetric majority plan, the common baseline for consensus-backed
 * systems. It favors simple overlap guarantees over maximum read availability.
 */
export function majorityQuorum(replicas: number): QuorumPlan {
	validatePositiveInteger("replicas", replicas);
	const majority = Math.floor(replicas / 2) + 1;

	return {
		readQuorum: majority,
		replicas,
		writeQuorum: majority,
	};
}
