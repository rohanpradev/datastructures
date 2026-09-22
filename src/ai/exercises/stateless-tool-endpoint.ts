import { createHash } from "node:crypto";

export type ToolPermission = "api-key:rotate" | "profile:read";

export interface ToolPrincipal {
	id: string;
	permissions: ReadonlySet<ToolPermission>;
}

export type ValidatedToolInvocation =
	| {
			input: { userId: string };
			permission: "profile:read";
			tool: "read-profile";
	  }
	| {
			input: { keyId: string };
			permission: "api-key:rotate";
			tool: "rotate-api-key";
	  };

export interface ToolEndpointRequest {
	authorization: string | undefined;
	body: unknown;
	idempotencyKey: string | undefined;
}

export interface ToolResultEnvelope {
	auditId: string;
	error?: string;
	principalId?: string;
	replayed: boolean;
	requestHash?: string;
	result?: unknown;
	status: "denied" | "failed" | "succeeded";
	timestampMs: number;
	tool?: ValidatedToolInvocation["tool"];
}

export interface ToolEndpointResponse {
	body: ToolResultEnvelope;
	status: number;
}

type IdempotencyRecord =
	| { requestHash: string; status: "in-flight"; token: string }
	| {
			envelope: ToolResultEnvelope;
			requestHash: string;
			status: "completed";
	  };

export type IdempotencyClaim =
	| { status: "conflict"; reason: "in-flight" | "payload-mismatch" }
	| { status: "replay"; envelope: ToolResultEnvelope }
	| { status: "started"; token: string };

/** Process-local teaching implementation of an atomic idempotency repository. */
export class InMemoryToolReceiptRepository {
	private readonly records = new Map<string, IdempotencyRecord>();

	claim(
		scope: string,
		requestHash: string,
		createToken: () => string,
	): IdempotencyClaim {
		const record = this.records.get(scope);
		if (!record) {
			const token = createToken();
			this.records.set(scope, { requestHash, status: "in-flight", token });
			return { status: "started", token };
		}
		if (record.requestHash !== requestHash) {
			return { reason: "payload-mismatch", status: "conflict" };
		}
		if (record.status === "in-flight") {
			return { reason: "in-flight", status: "conflict" };
		}
		return { envelope: record.envelope, status: "replay" };
	}

	complete(
		scope: string,
		token: string,
		requestHash: string,
		envelope: ToolResultEnvelope,
	): void {
		const record = this.records.get(scope);
		if (!record || record.status !== "in-flight" || record.token !== token) {
			throw new Error("idempotency claim is stale");
		}
		this.records.set(scope, {
			envelope,
			requestHash,
			status: "completed",
		});
	}
}

export interface StatelessToolEndpointOptions {
	audit(envelope: ToolResultEnvelope): void | Promise<void>;
	authenticate(
		token: string,
	): ToolPrincipal | undefined | Promise<ToolPrincipal | undefined>;
	execute(
		invocation: ValidatedToolInvocation,
		principal: ToolPrincipal,
	): unknown | Promise<unknown>;
	idempotency: InMemoryToolReceiptRepository;
	createId?: (() => string) | undefined;
	now?: (() => number) | undefined;
}

function nonEmptyField(value: unknown, field: string): string {
	if (typeof value !== "string" || value.trim().length === 0) {
		throw new Error(`${field} must be a non-empty string`);
	}
	return value.trim();
}

function parseInvocation(body: unknown): ValidatedToolInvocation {
	if (!body || typeof body !== "object") {
		throw new Error("body must be an object");
	}
	const candidate = body as { input?: unknown; tool?: unknown };
	if (!candidate.input || typeof candidate.input !== "object") {
		throw new Error("input must be an object");
	}
	const input = candidate.input as { keyId?: unknown; userId?: unknown };

	if (candidate.tool === "read-profile") {
		return {
			input: { userId: nonEmptyField(input.userId, "userId") },
			permission: "profile:read",
			tool: "read-profile",
		};
	}
	if (candidate.tool === "rotate-api-key") {
		return {
			input: { keyId: nonEmptyField(input.keyId, "keyId") },
			permission: "api-key:rotate",
			tool: "rotate-api-key",
		};
	}
	throw new Error("tool is not supported");
}

function bearerToken(authorization: string | undefined): string | undefined {
	if (!authorization?.startsWith("Bearer ")) return undefined;
	const token = authorization.slice("Bearer ".length).trim();
	return token.length > 0 ? token : undefined;
}

function requestHash(invocation: ValidatedToolInvocation): string {
	return createHash("sha256")
		.update(JSON.stringify({ input: invocation.input, tool: invocation.tool }))
		.digest("hex");
}

/**
 * Creates a session-free tool boundary. Durable idempotency is an injected
 * dependency, so any process can serve the next request.
 */
export function createStatelessToolEndpoint(
	options: StatelessToolEndpointOptions,
): (request: ToolEndpointRequest) => Promise<ToolEndpointResponse> {
	const createId = options.createId ?? (() => crypto.randomUUID());
	const now = options.now ?? Date.now;

	return async (request) => {
		const base = {
			auditId: createId(),
			replayed: false,
			timestampMs: now(),
		} as const;
		const finish = async (
			status: number,
			body: ToolResultEnvelope,
		): Promise<ToolEndpointResponse> => {
			await options.audit(body);
			return { body, status };
		};

		const token = bearerToken(request.authorization);
		if (!token) {
			return finish(401, {
				...base,
				error: "authentication required",
				status: "denied",
			});
		}
		const principal = await options.authenticate(token);
		if (!principal) {
			return finish(401, {
				...base,
				error: "invalid credentials",
				status: "denied",
			});
		}

		let invocation: ValidatedToolInvocation;
		try {
			invocation = parseInvocation(request.body);
		} catch (error) {
			return finish(422, {
				...base,
				error: error instanceof Error ? error.message : "invalid request",
				principalId: principal.id,
				status: "denied",
			});
		}

		if (!principal.permissions.has(invocation.permission)) {
			return finish(403, {
				...base,
				error: `missing permission: ${invocation.permission}`,
				principalId: principal.id,
				status: "denied",
				tool: invocation.tool,
			});
		}

		let idempotencyKey: string;
		try {
			idempotencyKey = nonEmptyField(request.idempotencyKey, "idempotencyKey");
		} catch (error) {
			return finish(422, {
				...base,
				error: error instanceof Error ? error.message : "invalid request",
				principalId: principal.id,
				status: "denied",
				tool: invocation.tool,
			});
		}

		const hash = requestHash(invocation);
		const scope = `${principal.id}:${idempotencyKey}`;
		const claim = options.idempotency.claim(scope, hash, createId);
		if (claim.status === "replay") {
			return finish(claim.envelope.status === "succeeded" ? 200 : 500, {
				...claim.envelope,
				auditId: base.auditId,
				replayed: true,
				timestampMs: base.timestampMs,
			});
		}
		if (claim.status === "conflict") {
			return finish(409, {
				...base,
				error:
					claim.reason === "payload-mismatch"
						? "idempotency key reused with a different payload"
						: "matching request is still in flight",
				principalId: principal.id,
				requestHash: hash,
				status: "denied",
				tool: invocation.tool,
			});
		}

		let body: ToolResultEnvelope;
		let status: number;
		try {
			body = {
				...base,
				principalId: principal.id,
				requestHash: hash,
				result: await options.execute(invocation, principal),
				status: "succeeded",
				tool: invocation.tool,
			};
			status = 200;
		} catch {
			body = {
				...base,
				error: "tool execution failed",
				principalId: principal.id,
				requestHash: hash,
				status: "failed",
				tool: invocation.tool,
			};
			status = 500;
		}

		options.idempotency.complete(scope, claim.token, hash, body);
		return finish(status, body);
	};
}
