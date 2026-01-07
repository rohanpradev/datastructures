import { describe, test, expect } from "bun:test";
import { PromiseTaskQueue } from "@/node-concepts/concurrent-operations";

/**
 * Creates a task that resolves after a delay.
 */
function createDelayedTask<T>(value: T, delayMs = 10): () => Promise<T> {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(value), delayMs);
    });
}

/**
 * Creates a task that rejects after a delay.
 */
function createFailingTask(error: unknown, delayMs = 10): () => Promise<never> {
  return () =>
    new Promise((_, reject) => {
      setTimeout(() => reject(error), delayMs);
    });
}

describe("PromiseTaskQueue", () => {
  test("executes tasks and resolves results", async () => {
    const queue = new PromiseTaskQueue<number>(2);

    queue.enqueue(createDelayedTask(1));
    queue.enqueue(createDelayedTask(2));
    queue.enqueue(createDelayedTask(3));

    const { results, errors } = await queue.waitForIdle();

    expect([...results].sort()).toEqual([1, 2, 3]);
    expect(errors).toHaveLength(0);
  });

  test("respects the maximum concurrency limit", async () => {
    const concurrency = 2;
    const queue = new PromiseTaskQueue<void>(concurrency);

    let active = 0;
    let maxObserved = 0;

    const monitoredTask = () =>
      new Promise<void>((resolve) => {
        active++;
        maxObserved = Math.max(maxObserved, active);

        setTimeout(() => {
          active--;
          resolve();
        }, 20);
      });

    queue.enqueue(monitoredTask);
    queue.enqueue(monitoredTask);
    queue.enqueue(monitoredTask);
    queue.enqueue(monitoredTask);

    await queue.waitForIdle();

    expect(maxObserved).toBe(concurrency);
  });

  test("processes tasks in FIFO order", async () => {
    const queue = new PromiseTaskQueue<number>(1);
    const executionOrder: number[] = [];

    const task = (value: number) => () =>
      new Promise<number>((resolve) => {
        executionOrder.push(value);
        resolve(value);
      });

    queue.enqueue(task(1));
    queue.enqueue(task(2));
    queue.enqueue(task(3));

    await queue.waitForIdle();

    expect(executionOrder).toEqual([1, 2, 3]);
  });

  test("captures errors without stopping the queue", async () => {
    const queue = new PromiseTaskQueue<number>(2);

    queue.enqueue(createDelayedTask(1));
    queue.enqueue(createFailingTask(new Error("boom")));
    queue.enqueue(createDelayedTask(2));

    const { results, errors } = await queue.waitForIdle();

    expect([...results].sort()).toEqual([1, 2]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toBeInstanceOf(Error);
  });

  test("resolves immediately if no tasks are queued", async () => {
    const queue = new PromiseTaskQueue<number>(3);

    const { results, errors } = await queue.waitForIdle();

    expect(results).toEqual([]);
    expect(errors).toEqual([]);
  });

  test("allows tasks to be added while running", async () => {
    const queue = new PromiseTaskQueue<number>(1);

    queue.enqueue(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            queue.enqueue(createDelayedTask(2));
            resolve(1);
          }, 10);
        }),
    );

    const { results } = await queue.waitForIdle();

    expect(results).toEqual([1, 2]);
  });
});
