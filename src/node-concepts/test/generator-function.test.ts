import { describe, test, expect } from "bun:test";
import { createAsyncCancellable } from "@/node-concepts/basics/generator-function";

function createCancellableDelay<T>(value: T, delayMs: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const promise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(value), delayMs);
  });

  return {
    promise,
    clear: () => {
      if (timer) clearTimeout(timer);
    },
  };
}

describe("createAsyncCancellable", () => {
  test("resolves final result correctly", async () => {
    const cancellable = createAsyncCancellable<[], number, number>(
      async function* (): AsyncGenerator<number, number, number> {
        const a = yield 1;
        const b = yield a + 1;
        return b * 2;
      },
    );

    const { promise } = cancellable();
    await expect(promise).resolves.toBe(4);
  });

  test("cancels before first yield", async () => {
    const cancellable = createAsyncCancellable<[], number, number>(
      async function* (): AsyncGenerator<number, number, number> {
        const delay = createCancellableDelay(1, 1000);
        try {
          yield delay.promise;
          return 42;
        } finally {
          delay.clear();
        }
      },
    );

    const { promise, cancel } = cancellable();
    const start = performance.now();
    cancel();

    await expect(promise).rejects.toThrow("Operation Cancelled");
    expect(performance.now() - start).toBeLessThan(100);
  });

  test("cancels after first yield", async () => {
    const cancellable = createAsyncCancellable<[], number, number>(
      async function* (): AsyncGenerator<number, number, number> {
        const a = yield 10;
        const delay = createCancellableDelay(a + 5, 1000);
        try {
          const b = yield delay.promise;
          return b;
        } finally {
          delay.clear();
        }
      },
    );

    const { promise, cancel } = cancellable();
    const cancelTimer = setTimeout(cancel, 10);

    try {
      await expect(promise).rejects.toThrow("Operation Cancelled");
    } finally {
      clearTimeout(cancelTimer);
    }
  });

  test("handles errors thrown inside generator", async () => {
    const cancellable = createAsyncCancellable<[], number, number>(
      async function* (): AsyncGenerator<number, number, number> {
        yield 1;
        throw new Error("Generator failure");
      },
    );

    const { promise } = cancellable();
    await expect(promise).rejects.toThrow("Generator failure");
  });
});
