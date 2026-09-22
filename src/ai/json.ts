import type { z } from "zod/v4";

const JSON_HEADERS = {
	"cache-control": "no-store",
	"content-type": "application/json; charset=utf-8",
} as const;

export class ApiError extends Error {
	readonly code: string;
	readonly status: number;

	constructor(status: number, code: string, message: string) {
		super(message);
		this.name = "ApiError";
		this.code = code;
		this.status = status;
	}
}

export function jsonResponse(
	body: unknown,
	init: Omit<ResponseInit, "headers"> & {
		headers?: ConstructorParameters<typeof Headers>[0];
	} = {},
): Response {
	const headers = new Headers(JSON_HEADERS);
	for (const [name, value] of new Headers(init.headers)) {
		headers.set(name, value);
	}

	return Response.json(body, { ...init, headers });
}

export function errorResponse(error: unknown): Response {
	if (error instanceof ApiError) {
		return jsonResponse(
			{ error: { code: error.code, message: error.message } },
			{ status: error.status },
		);
	}

	console.error("Unhandled AI API error", error);
	return jsonResponse(
		{
			error: {
				code: "internal_error",
				message: "The request could not be completed.",
			},
		},
		{ status: 500 },
	);
}

export async function parseJson<T>(
	request: Request,
	schema: z.ZodType<T>,
	maxBytes = 64 * 1024,
): Promise<T> {
	const declaredLength = Number(request.headers.get("content-length") ?? 0);
	if (declaredLength > maxBytes) {
		await request.body?.cancel().catch(() => {});
		throw new ApiError(413, "payload_too_large", "Request body is too large.");
	}

	let payload: unknown;
	try {
		// Count bytes as they arrive, including chunked requests without a length.
		// Buffering request.text() first would leave the allocation unbounded.
		const reader = request.body?.getReader();
		const decoder = new TextDecoder("utf-8", { fatal: true });
		let text = "";
		let bytes = 0;
		try {
			if (reader) {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					bytes += value.byteLength;
					if (bytes > maxBytes) {
						throw new ApiError(
							413,
							"payload_too_large",
							"Request body is too large.",
						);
					}
					text += decoder.decode(value, { stream: true });
				}
			}
			text += decoder.decode();
		} catch (error) {
			await reader?.cancel().catch(() => {});
			throw error;
		} finally {
			reader?.releaseLock();
		}
		payload = JSON.parse(text) as unknown;
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new ApiError(400, "invalid_json", "Request body must be valid JSON.");
	}

	const result = schema.safeParse(payload);
	if (!result.success) {
		throw new ApiError(
			422,
			"validation_error",
			result.error.issues
				.map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
				.join("; "),
		);
	}

	return result.data;
}
