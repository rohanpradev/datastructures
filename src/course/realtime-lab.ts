import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
	DurableEventLog,
	EventLogError,
	validateRoom,
} from "@/node-concepts/system-design/durable-event-log";
import { TokenBucketRateLimiter } from "@/node-concepts/system-design/rate-limiter";

interface Connection {
	room: string;
	after: number;
}

/**
 * Single-process teaching server: SQLite commit -> local publish -> cursor replay.
 * No import-time listener, external services, account, or credentials required.
 * Local room names demonstrate scoping, not authentication or authorization.
 */
export function createRealtimeLab(
	options: { port?: number; filename?: string; writeCapacity?: number } = {},
) {
	const log = new DurableEventLog(options.filename);
	// One bounded process-local bucket demonstrates admission control. A real
	// multi-tenant service needs authenticated keys and shared/partitioned limits.
	const limiter = new TokenBucketRateLimiter(options.writeCapacity ?? 60, 10);
	const metrics = { commits: 0, duplicates: 0, limited: 0, replayed: 0 };
	const localOrigins = new Set<string>();
	const json = (
		value: unknown,
		status = 200,
		headers: Record<string, string> = {},
	) =>
		Response.json(value, {
			headers: { "Cache-Control": "no-store", ...headers },
			status,
		});
	const server = Bun.serve<Connection>({
		hostname: "127.0.0.1",
		port: options.port ?? 3002,
		maxRequestBodySize: 4096,
		async fetch(request, instance) {
			const url = new URL(request.url);
			// Pin the local authority as well as Origin: a rebinding hostname can
			// otherwise supply a matching Host and Origin while reaching loopback.
			const origin = request.headers.get("origin");
			if (!localOrigins.has(url.origin) || (origin && origin !== url.origin))
				return json({ error: "origin rejected" }, 403);
			try {
				if (url.pathname === "/" && request.method === "GET") {
					return new Response(
						Bun.file(new URL("./realtime-lab.html", import.meta.url)),
						{
							headers: { "Content-Type": "text/html; charset=utf-8" },
						},
					);
				}
				if (url.pathname === "/api/metrics" && request.method === "GET") {
					return json({ ...metrics, connections: instance.pendingWebSockets });
				}
				const live = /^\/live\/([^/]+)$/.exec(url.pathname);
				if (live && request.method === "GET") {
					const room = live[1];
					validateRoom(room);
					const after = Number(url.searchParams.get("after") ?? 0);
					// Validate with the same cursor contract before upgrading.
					log.read(room, after, 1);
					if (instance.upgrade(request, { data: { after, room } })) return;
					return json({ error: "WebSocket upgrade required" }, 426);
				}
				const route = /^\/api\/rooms\/([^/]+)\/events$/.exec(url.pathname);
				if (!route) return json({ error: "route not found" }, 404);
				const room = route[1];
				validateRoom(room);
				if (request.method === "GET") {
					return json(
						log.read(
							room,
							Number(url.searchParams.get("after") ?? 0),
							Number(url.searchParams.get("limit") ?? 25),
						),
					);
				}
				if (request.method !== "POST")
					return json({ error: "method not allowed" }, 405, {
						Allow: "GET, POST",
					});
				const decision = limiter.consume();
				if (!decision.allowed) {
					metrics.limited++;
					return json({ error: "write budget exhausted" }, 429, {
						"Retry-After": String(Math.ceil(decision.retryAfterMs / 1000)),
					});
				}
				let body: unknown;
				try {
					body = await request.json();
				} catch {
					return json({ error: "invalid JSON" }, 400);
				}
				if (
					typeof body !== "object" ||
					body === null ||
					!("eventId" in body) ||
					!("text" in body) ||
					typeof body.eventId !== "string" ||
					typeof body.text !== "string"
				) {
					return json({ error: "body needs string eventId and text" }, 400);
				}
				const result = log.append(room, body.eventId, body.text);
				if (result.created) {
					metrics.commits++;
					// The database is durable before publish. A crash in this gap can
					// lose the hint; reconnect/catch-up reads recover the event.
					instance.publish(
						`room:${room}`,
						JSON.stringify({ event: result.event, type: "event" }),
					);
				} else metrics.duplicates++;
				return json(result, result.created ? 201 : 200);
			} catch (error) {
				if (error instanceof EventLogError)
					return json({ error: error.message }, error.status);
				console.error("Real-time lab request failed", error);
				return json({ error: "storage temporarily unavailable" }, 503);
			}
		},
		websocket: {
			maxPayloadLength: 1024,
			backpressureLimit: 64 * 1024,
			closeOnBackpressureLimit: true,
			error(error, socket) {
				// Bun 1.4.4 supplies the socket whose handler failed. A replay
				// error after upgrade belongs to this connection, not the HTTP
				// fetch error boundary or every subscriber in the room.
				console.error("Real-time lab WebSocket failed", error);
				// A failure during open may abort before the peer sees this frame;
				// clients must also recover from an abnormal (1006) disconnect.
				socket.close(1011, "connection failed; reconnect with cursor");
			},
			open(socket) {
				const { room, after } = socket.data;
				// No await between subscribe and replay: other JS handlers cannot
				// interleave here. This property does not extend across replicas.
				socket.subscribe(`room:${room}`);
				const page = log.read(room, after, 25);
				if (page.hasMore) {
					socket.send(JSON.stringify({ type: "resync_required" }));
					socket.close(1013, "catch up over HTTP before reconnecting");
					return;
				}
				metrics.replayed += page.events.length;
				// -1 means accepted into Bun's queue, not dropped. Re-sending it
				// would duplicate delivery. Bound the queue and recover by cursor.
				if (socket.send(JSON.stringify({ ...page, type: "snapshot" })) < 0) {
					socket.close(1013, "slow consumer; reconnect with cursor");
				}
			},
			message(socket) {
				// Writes use HTTP so status codes and idempotency are observable.
				socket.close(1008, "publish through the HTTP endpoint");
			},
		},
	});
	for (const hostname of ["127.0.0.1", "localhost"]) {
		const localUrl = new URL(server.url);
		localUrl.hostname = hostname;
		localOrigins.add(localUrl.origin);
	}
	return {
		log,
		server,
		async stop() {
			await server.stop(true);
			log.close();
		},
	};
}

if (import.meta.main) {
	await mkdir(new URL("../../data/", import.meta.url), { recursive: true });
	const lab = createRealtimeLab({
		filename: fileURLToPath(
			new URL("../../data/realtime-lab.sqlite", import.meta.url),
		),
	});
	console.log(`Real-time systems lab: ${lab.server.url}`);
	const shutdown = async () => {
		await lab.stop();
		process.exit(0);
	};
	process.once("SIGINT", shutdown);
	process.once("SIGTERM", shutdown);
}
