import * as z from "zod/v4";
import { ApiError } from "./json";

const gatewayModelsResponseSchema = z.object({
	data: z.array(
		z.object({
			id: z.string().min(1),
			name: z.string().optional(),
			tags: z.array(z.string()).optional(),
			type: z.string().optional(),
		}),
	),
});

export interface GatewayModelOption {
	id: string;
	name: string;
	provider: string;
}

const cacheDurationMs = 60 * 60 * 1000;
const retryDelayMs = 30_000;

/** One cache per service; injectable I/O and clock keep tests offline. */
export function createGatewayModelCatalog(
	fetchModels: (url: string, init: RequestInit) => Promise<Response> = (
		url,
		init,
	) => fetch(url, init),
	now: () => number = Date.now,
): () => Promise<GatewayModelOption[]> {
	let cachedCatalog:
		| { expiresAt: number; models: GatewayModelOption[] }
		| undefined;
	let catalogRequest: Promise<GatewayModelOption[]> | undefined;
	let retryAt = 0;
	const unavailable = () =>
		new ApiError(
			502,
			"gateway_catalog_unavailable",
			"Vercel AI Gateway model catalog is temporarily unavailable.",
		);
	return async () => {
		if (cachedCatalog && cachedCatalog.expiresAt > now())
			return cachedCatalog.models;
		if (catalogRequest) return catalogRequest;
		if (retryAt > now()) {
			if (cachedCatalog) return cachedCatalog.models;
			throw unavailable();
		}

		// Deferral coalesces requests even if an injected fetch implementation throws.
		catalogRequest = Promise.resolve()
			.then(() =>
				fetchModels("https://ai-gateway.vercel.sh/v1/models", {
					signal: AbortSignal.timeout(5_000),
				}),
			)
			.then(async (response) => {
				if (!response.ok) throw new Error("Gateway catalog request failed.");
				const payload: unknown = await response.json();
				const parsed = gatewayModelsResponseSchema.safeParse(payload);
				if (!parsed.success)
					throw new Error("Gateway catalog response was invalid.");

				const models = parsed.data.data
					.filter(
						(model) =>
							model.type === "language" && model.tags?.includes("tool-use"),
					)
					.map((model) => ({
						id: model.id,
						name: model.name ?? model.id,
						provider: model.id.split("/", 1)[0] ?? "unknown",
					}))
					.sort(
						(left, right) =>
							left.provider.localeCompare(right.provider) ||
							left.name.localeCompare(right.name),
					);

				cachedCatalog = { expiresAt: now() + cacheDurationMs, models };
				retryAt = 0;
				return models;
			})
			.catch(() => {
				// Back off on outages; otherwise every stale-cache read retries upstream.
				retryAt = now() + retryDelayMs;
				if (cachedCatalog) return cachedCatalog.models;
				throw unavailable();
			})
			.finally(() => {
				catalogRequest = undefined;
			});

		return catalogRequest;
	};
}

export const listGatewayModels = createGatewayModelCatalog();
