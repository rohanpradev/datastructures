export interface AgentAction {
	description: string;
	id: string;
	risk: "high" | "low";
}

export interface AgentLease<TState> {
	checkpoint: TState;
	expiresAtMs: number;
	receipt: string;
	runId: string;
	workerId: string;
}

export type ActionDecision =
	| { allowed: true }
	| { allowed: false; approvalId: string; reason: "approval-required" };

interface ApprovalRequest {
	action: AgentAction;
	id: string;
}

interface ApprovedAction {
	action: AgentAction;
	approvedBy: string;
}

interface StoredRun<TState> {
	approvedAction?: ApprovedAction | undefined;
	checkpoint: TState;
	lease?: Omit<AgentLease<TState>, "checkpoint" | "runId"> | undefined;
	pendingApproval?: ApprovalRequest | undefined;
	status: "awaiting-approval" | "completed" | "ready" | "running";
}

export interface AgentCheckpointSnapshot<TState> {
	checkpoint: TState;
	pendingApproval?: { action: AgentAction; id: string } | undefined;
	status: StoredRun<TState>["status"];
}

export interface AgentCheckpointStoreOptions<TState> {
	clone?: ((state: TState) => TState) | undefined;
	createId?: (() => string) | undefined;
	leaseDurationMs: number;
}

function sameAction(left: AgentAction, right: AgentAction): boolean {
	return (
		left.id === right.id &&
		left.risk === right.risk &&
		left.description === right.description
	);
}

/**
 * Process-local lease/checkpoint state machine for a resumable agent exercise.
 *
 * Invariant: only the current, unexpired receipt can mutate a run. High-impact
 * approval is bound to the exact action and is consumed once.
 */
export class AgentCheckpointStore<TState> {
	private readonly clone: (state: TState) => TState;
	private readonly createId: () => string;
	private readonly leaseDurationMs: number;
	private readonly runs = new Map<string, StoredRun<TState>>();

	constructor(options: AgentCheckpointStoreOptions<TState>) {
		if (
			!Number.isFinite(options.leaseDurationMs) ||
			options.leaseDurationMs < 1
		) {
			throw new Error("leaseDurationMs must be a positive finite number");
		}
		this.clone = options.clone ?? structuredClone;
		this.createId = options.createId ?? (() => crypto.randomUUID());
		this.leaseDurationMs = options.leaseDurationMs;
	}

	create(runId: string, initialCheckpoint: TState): void {
		if (runId.trim().length === 0) throw new Error("runId must not be empty");
		if (this.runs.has(runId)) throw new Error("run already exists");
		this.runs.set(runId, {
			checkpoint: this.clone(initialCheckpoint),
			status: "ready",
		});
	}

	acquire(
		runId: string,
		workerId: string,
		nowMs = Date.now(),
	): AgentLease<TState> {
		const run = this.requireRun(runId);
		if (workerId.trim().length === 0)
			throw new Error("workerId must not be empty");
		if (run.status === "completed") throw new Error("run is already completed");
		if (run.status === "awaiting-approval") {
			throw new Error("run is awaiting approval");
		}
		if (
			run.status === "running" &&
			run.lease &&
			run.lease.expiresAtMs > nowMs
		) {
			throw new Error("run already has an active lease");
		}

		const lease = {
			expiresAtMs: nowMs + this.leaseDurationMs,
			receipt: this.createId(),
			workerId,
		};
		run.lease = lease;
		run.status = "running";
		return {
			...lease,
			checkpoint: this.clone(run.checkpoint),
			runId,
		};
	}

	save(
		runId: string,
		receipt: string,
		checkpoint: TState,
		nowMs = Date.now(),
	): void {
		const run = this.requireCurrentLease(runId, receipt, nowMs);
		run.checkpoint = this.clone(checkpoint);
	}

	requestAction(
		runId: string,
		receipt: string,
		action: AgentAction,
		nowMs = Date.now(),
	): ActionDecision {
		const run = this.requireCurrentLease(runId, receipt, nowMs);
		if (action.risk === "low") return { allowed: true };
		if (run.approvedAction && sameAction(run.approvedAction.action, action)) {
			run.approvedAction = undefined;
			return { allowed: true };
		}

		const approvalId = this.createId();
		run.pendingApproval = { action: { ...action }, id: approvalId };
		run.lease = undefined;
		run.status = "awaiting-approval";
		return { allowed: false, approvalId, reason: "approval-required" };
	}

	approve(runId: string, approvalId: string, approvedBy: string): void {
		const run = this.requireRun(runId);
		if (
			run.status !== "awaiting-approval" ||
			!run.pendingApproval ||
			run.pendingApproval.id !== approvalId
		) {
			throw new Error("approval request is stale");
		}
		if (approvedBy.trim().length === 0) {
			throw new Error("approvedBy must not be empty");
		}

		run.approvedAction = {
			action: { ...run.pendingApproval.action },
			approvedBy,
		};
		run.pendingApproval = undefined;
		run.status = "ready";
	}

	complete(runId: string, receipt: string, nowMs = Date.now()): void {
		const run = this.requireCurrentLease(runId, receipt, nowMs);
		run.lease = undefined;
		run.status = "completed";
	}

	get(runId: string): AgentCheckpointSnapshot<TState> {
		const run = this.requireRun(runId);
		return {
			checkpoint: this.clone(run.checkpoint),
			pendingApproval: run.pendingApproval
				? {
						action: { ...run.pendingApproval.action },
						id: run.pendingApproval.id,
					}
				: undefined,
			status: run.status,
		};
	}

	private requireCurrentLease(
		runId: string,
		receipt: string,
		nowMs: number,
	): StoredRun<TState> {
		const run = this.requireRun(runId);
		if (
			run.status !== "running" ||
			!run.lease ||
			run.lease.receipt !== receipt ||
			run.lease.expiresAtMs <= nowMs
		) {
			throw new Error("checkpoint receipt is stale");
		}
		return run;
	}

	private requireRun(runId: string): StoredRun<TState> {
		const run = this.runs.get(runId);
		if (!run) throw new Error("run was not found");
		return run;
	}
}
