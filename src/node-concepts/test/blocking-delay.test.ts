/**
 * @file blocking-delay.test.ts
 * @description
 * Test suite for Bun server endpoints:
 * - Fast route
 * - Blocking route
 * - Worker route
 * - Metrics
 */

import { describe, test, expect } from "bun:test";
import { server } from "@/node-concepts/server";
import type { BunImageProcessingResult } from "@/node-concepts/bun-runtime/image-processing";

// Typed response helpers
interface WorkerResponse {
  result: BunImageProcessingResult;
}

interface MetricsResponse {
  activeRequests: number;
  activeWebSockets: number;
}

// Helper to fetch and parse JSON/text routes
async function fetchRoute<T = unknown>(
  path: string,
  timeout = 1000,
): Promise<{ status: number; data: T }> {
  const url = new URL(path, server.url).toString();
  const res = await fetch(url, { signal: AbortSignal.timeout(timeout) });
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const json = await res.json();
    return { status: res.status, data: json as T };
  }

  const text = await res.text();
  return { status: res.status, data: text as unknown as T };
}

describe("Bun server endpoints", () => {
  test("Fast route returns welcome message quickly", async () => {
    const start = performance.now();
    const { status, data } = await fetchRoute<string>("/");
    const duration = performance.now() - start;

    expect(status).toBe(200);
    expect(data).toBe("Welcome to Bun!");
    // Keep this as a broad responsiveness check, not a machine-speed benchmark.
    expect(duration).toBeLessThan(100);
  });

  test("Blocking route executes correctly (dev only)", async () => {
    const start = performance.now();
    const { status, data } = await fetchRoute<string>("/block");
    const duration = performance.now() - start;

    expect(status).toBe(200);
    expect(data).toBe("Blocking done!");
    expect(duration).toBeGreaterThanOrEqual(50);
  });

  test("Worker route processes an image with Bun.Image", async () => {
    const { status, data } = await fetchRoute<WorkerResponse>("/heavy-task", 3000);

    expect(status).toBe(200);
    expect(data.result.source).toMatchObject({
      format: "bmp",
      height: 180,
      width: 320,
    });
    expect(data.result.output.format).toBe("webp");
    expect(data.result.output.mimeType).toBe("image/webp");
    expect(data.result.output.bytes).toBeGreaterThan(0);
    expect(data.result.output.width).toBeLessThanOrEqual(160);
    expect(data.result.output.height).toBeLessThanOrEqual(90);
  });

  test("Metrics endpoint returns active requests and web sockets", async () => {
    const { status, data } = await fetchRoute<MetricsResponse>("/metrics");

    expect(status).toBe(200);
    expect(data).toHaveProperty("activeRequests");
    expect(data).toHaveProperty("activeWebSockets");
    expect(typeof data.activeRequests).toBe("number");
    expect(typeof data.activeWebSockets).toBe("number");
  });
});
