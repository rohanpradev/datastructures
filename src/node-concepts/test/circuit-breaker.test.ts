/**
 * @file circuit-breaker.test.ts
 * @description
 * Tests the circuit breaker endpoints in Bun server
 */

import { describe, test, expect, afterAll } from "bun:test";
import { server, apiBreaker } from "@/node-concepts/server"; // your server with apiBreaker
import { CircuitBreaker } from "@/node-concepts/circuit-breaker";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

// API that always fails
const failingApi = async (): Promise<Todo> => {
  throw new Error("Simulated failure");
};

// Test breaker with low thresholds
const testBreaker = new CircuitBreaker<[], Todo>(
  failingApi,
  {
    failureThreshold: 20, // 20% failures triggers OPEN
    minimumRequests: 1, // only 1 request to open
    windowDuration: 1000, // 1s window
    resetTimeout: 2000,
    timeout: 1000,
    halfOpenMaxCalls: 1,
  },
  async () => ({
    userId: -1,
    id: -1,
    title: "Fallback response",
    completed: false,
  }),
);

// Helper to fetch and parse JSON
async function fetchRoute<T>(
  path: string,
): Promise<{ status: number; data: T }> {
  const url = new URL(path, server.url).toString();
  const res = await fetch(url);
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const json = await res.json().catch(() => ({})); // fallback if empty
    return { status: res.status, data: json as T };
  }

  const text = await res.text();
  return { status: res.status, data: text as unknown as T };
}

// Graceful shutdown after tests
afterAll(async () => {
  console.log("Shutting down server after circuit breaker tests...");
  await server.stop();
});

describe("Circuit breaker endpoints", () => {
  test("Circuit breaker returns successful data", async () => {
    const { status, data } = await fetchRoute<{
      success: boolean;
      state: string;
      data: { id: number; title: string };
    }>("/circuit-breaker");

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.state).toBeDefined();
    expect(data.data).toHaveProperty("id");
    expect(data.data).toHaveProperty("title");
  });

  test("Circuit breaker health endpoint returns state", async () => {
    const { status, data } = await fetchRoute<{ state: string }>(
      "/circuit-breaker/health",
    );

    expect(status).toBe(200);
    expect(data.state).toBeDefined();
  });

  test("Circuit breaker fallback activates on repeated failures", async () => {
    let lastResponse: Todo | null = null;

    // Fire enough requests to open the breaker
    for (let i = 0; i < 2; i++) {
      lastResponse = await testBreaker.fire();
      // small delay for internal state update
      await new Promise((r) => setTimeout(r, 50));
    }

    expect(lastResponse).toBeDefined();
    expect(lastResponse!.title).toBe("Fallback response");
    expect(testBreaker.getState()).toBe("OPEN");
  });
});
