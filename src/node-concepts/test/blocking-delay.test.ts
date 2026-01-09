/**
 * @file server-timing.test.ts
 * @description
 * Demonstrates main-thread blocking vs Worker offload.
 * Fully safe: bounded loops, Worker terminates.
 */

import { describe, test, expect } from "bun:test";
import { handler } from "@/node-concepts/blocking-delay";

test("Blocking route vs fast route", async () => {
  // Fast route
  const startFast = Date.now();
  const fastResult = await handler("/"); // <-- await!
  const fastDuration = Date.now() - startFast;

  console.log(`Fast route duration: ${fastDuration} ms`);
  expect(fastResult).toBe("Fast response");

  // Blocking route
  const startBlock = Date.now();
  const blockResult = await handler("/count"); // <-- await!
  const blockDuration = Date.now() - startBlock;

  console.log(`Blocking route duration: ${blockDuration} ms`);
  expect(blockResult).toBe("Blocking done!");
  expect(blockDuration).toBeGreaterThanOrEqual(5);
});
