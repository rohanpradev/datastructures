/**
 * @file pubsub.test.ts
 * @description
 * Integration test suite for WebSocket Pub/Sub:
 * - Upgrade route
 * - Join system message
 * - Channel broadcast
 * - Sender exclusion
 * - Metrics WebSocket tracking
 */

import { describe, test, expect } from "bun:test";
import { server } from "@/node-concepts/server";

interface ChatMessage {
  type: "system" | "chat";
  user?: string;
  message: string;
  timestamp: number;
}

interface MetricsResponse {
  activeRequests: number;
  activeWebSockets: number;
}

// ──────────────────────────────
// Helpers
// ──────────────────────────────

function createSocket(username: string, channel: string) {
  const url = new URL(server.url.toString());
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "/ws";
  url.search = `?username=${username}&channel=${channel}`;
  return new WebSocket(url.toString());
}

function waitForOpen(socket: WebSocket, timeout = 1000) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("WebSocket open timeout")),
      timeout,
    );
    socket.addEventListener(
      "open",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}

function waitForMessage(
  socket: WebSocket,
  timeout = 1000,
): Promise<ChatMessage> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("WebSocket message timeout")),
      timeout,
    );
    socket.addEventListener(
      "message",
      (event) => {
        clearTimeout(timer);
        resolve(JSON.parse(event.data));
      },
      { once: true },
    );
  });
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// ──────────────────────────────
// Tests
// ──────────────────────────────

describe("WebSocket Pub/Sub", () => {
  test("WebSocket upgrade succeeds", async () => {
    const socket = createSocket("TestUser", "room1");
    await waitForOpen(socket);
    expect(socket.readyState).toBe(WebSocket.OPEN);
    socket.close();
  });

  test("Join system message is broadcasted", async () => {
    const socket1 = createSocket("Alice", "room2");
    await waitForOpen(socket1);

    const socket2 = createSocket("Bob", "room2");
    await waitForOpen(socket2);

    const joinMessage = await waitForMessage(socket1);

    expect(joinMessage.type).toBe("system");
    expect(joinMessage.message).toContain("Bob joined");

    socket1.close();
    socket2.close();
  });

  test("Message is broadcast to other subscribers", async () => {
    const socket1 = createSocket("Sender", "room3");
    const socket2 = createSocket("Receiver", "room3");

    await waitForOpen(socket1);
    await waitForOpen(socket2);

    // Let join messages settle
    await delay(50);

    const messagePromise = waitForMessage(socket2);

    socket1.send("Hello World");

    const received = await messagePromise;

    expect(received.type).toBe("chat");
    expect(received.message).toBe("Hello World");
    expect(received.user).toBe("Sender");

    socket1.close();
    socket2.close();
  });

  test("Sender does not receive its own message", async () => {
    const socket = createSocket("SelfUser", "room4");
    await waitForOpen(socket);

    await delay(50);

    let received = false;
    socket.addEventListener("message", () => {
      received = true;
    });

    socket.send("Should not echo");

    await delay(100); // wait to see if message arrives
    expect(received).toBe(false);

    socket.close();
  });

  test("Metrics reflect active WebSockets", async () => {
    const socket = createSocket("MetricUser", "metricsRoom");
    await waitForOpen(socket);

    await delay(50);

    const res = await fetch(new URL("/metrics", server.url));
    const data = (await res.json()) as MetricsResponse;

    expect(data.activeWebSockets).toBeGreaterThanOrEqual(1);

    socket.close();
  });

  test("WebSocket closes cleanly", async () => {
    const socket = createSocket("CloseUser", "room5");
    await waitForOpen(socket);

    socket.close();

    await delay(50); // wait for close to propagate

    expect(socket.readyState).toBe(WebSocket.CLOSED);
  });
});
