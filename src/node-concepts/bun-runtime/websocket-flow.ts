/** A deliberately small text protocol for the local WebSocket work lesson. */
export interface WebSocketWorkRequest {
	id: number;
	text: string;
}

export interface WebSocketWorkConnection {
	pending: number;
	failed: boolean;
	tail: Promise<void>;
}

export interface WebSocketWorkOptions {
	port?: number;
	maxPendingMessages?: number;
}

/**
 * Creates a loopback teaching server with one FIFO per client.
 *
 * Bun 1.4.4's pause/resume APIs stop socket reads while asynchronous work is
 * pending. Frames already buffered may still arrive, so a separate queue limit
 * bounds application work. Outbound buffering and payload size have their own
 * limits; pausing reads does not bound either one.
 *
 * Synchronous protocol errors reach error(error, socket), which now identifies
 * the failing client. Promise rejections do not: the queue catches those itself.
 * The caller owns the returned server and must await server.stop(true).
 */
export function createWebSocketWorkServer(
	processMessage: (
		request: WebSocketWorkRequest,
		socket: Bun.ServerWebSocket<WebSocketWorkConnection>,
	) => string | Promise<string>,
	options: WebSocketWorkOptions = {},
): Bun.Server<WebSocketWorkConnection> {
	const maxPending = options.maxPendingMessages ?? 8;
	if (!Number.isSafeInteger(maxPending) || maxPending < 1) {
		throw new RangeError("maxPendingMessages must be a positive safe integer");
	}

	const fail = (
		_error: Error,
		socket: Bun.ServerWebSocket<WebSocketWorkConnection>,
	) => {
		socket.data.failed = true;
		// Close just this client; other sockets keep their own queue and state.
		socket.close(1011, "Work failed");
	};

	return Bun.serve<WebSocketWorkConnection>({
		hostname: "127.0.0.1",
		port: options.port ?? 0,
		fetch(request, server) {
			const url = new URL(request.url);
			const origin = request.headers.get("origin");
			if (
				url.origin !== server.url.origin ||
				(origin && origin !== url.origin)
			) {
				return new Response("Origin rejected", { status: 403 });
			}
			if (url.pathname !== "/work") {
				return new Response("Not found", { status: 404 });
			}
			if (
				server.upgrade(request, {
					data: { pending: 0, failed: false, tail: Promise.resolve() },
				})
			)
				return;
			return new Response("WebSocket upgrade required", { status: 426 });
		},
		websocket: {
			maxPayloadLength: 16 * 1024,
			backpressureLimit: 64 * 1024,
			closeOnBackpressureLimit: true,
			message(socket, message) {
				if (typeof message !== "string") {
					throw new TypeError("Expected a text message");
				}
				const value: unknown = JSON.parse(message);
				if (
					!value ||
					typeof value !== "object" ||
					!("id" in value) ||
					!Number.isSafeInteger(value.id) ||
					!("text" in value) ||
					typeof value.text !== "string"
				) {
					throw new TypeError("Expected an integer id and text");
				}
				const request = value as WebSocketWorkRequest;
				if (socket.data.failed || socket.readyState !== 1) return;
				if (socket.data.pending >= maxPending) {
					socket.data.failed = true;
					socket.close(1013, "Work queue full");
					return;
				}

				socket.pause();
				socket.data.pending++;
				socket.data.tail = socket.data.tail
					.then(async () => {
						if (socket.data.failed || socket.readyState !== 1) return;
						const result = await processMessage(request, socket);
						if (socket.readyState === 1) {
							socket.send(JSON.stringify({ id: request.id, result }));
						}
					})
					.catch((error: unknown) => {
						fail(
							error instanceof Error ? error : new Error(String(error)),
							socket,
						);
					})
					.finally(() => {
						socket.data.pending--;
						if (
							socket.data.pending === 0 &&
							!socket.data.failed &&
							socket.readyState === 1
						) {
							socket.resume();
						}
					});
			},
			error: fail,
		},
	});
}
