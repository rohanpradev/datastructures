import { beforeAll, describe, test, expect } from "bun:test";
import { server } from "@/node-concepts/server";
import { CircuitBreaker } from "@/node-concepts/async/circuit-breaker";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

async function fetchRoute<T>(path: string) {
  // wait for server.url to be ready
  while (!server.url) {
    await new Promise((resolve) => setTimeout(resolve, 5));
  }

  const url = new URL(path, server.url).toString();
  const res = await fetch(url);
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const json = await res.json().catch(() => ({}));
    return { status: res.status, data: json as T };
  }

  const text = await res.text();
  return { status: res.status, data: text as unknown as T };
}

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
  });

  test("Circuit breaker health endpoint returns state", async () => {
    const { status, data } = await fetchRoute<{ state: string }>(
      "/circuit-breaker/health",
    );

    expect(status).toBe(200);
    expect(data.state).toBeDefined();
  });

  test("Circuit breaker fallback activates on repeated failures", async () => {
    const failingApi = async (): Promise<Todo> => {
      throw new Error("Simulated failure");
    };

    const testBreaker = new CircuitBreaker<[], Todo>(
      failingApi,
      {
        failureThreshold: 20,
        minimumRequests: 1,
        windowDuration: 1000,
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

    let lastResponse: Todo | null = null;

    for (let i = 0; i < 2; i++) {
      lastResponse = await testBreaker.fire();
      await new Promise((r) => setTimeout(r, 50));
    }

    expect(lastResponse).toBeDefined();
    expect(lastResponse!.title).toBe("Fallback response");
    expect(testBreaker.getState()).toBe("OPEN");
  });
});
