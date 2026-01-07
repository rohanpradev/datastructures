import { describe, test, expect } from "bun:test";
import { createAsyncCancellable } from "@/node-concepts/generator-function";

describe("generatorFunction", () => {
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
        yield new Promise((res) => setTimeout(() => res(1), 1000));
        return 42;
      },
    );

    const { promise, cancel } = cancellable();
    cancel();

    await expect(promise).rejects.toThrow("Operation Cancelled");
  });

  test("cancels after first yield", async () => {
    const cancellable = createAsyncCancellable<[], number, number>(
      async function* (): AsyncGenerator<number, number, number> {
        const a = yield 10;
        const b = yield new Promise((res) =>
          setTimeout(() => res(a + 5), 1000),
        );
        return b;
      },
    );

    const { promise, cancel } = cancellable();
    setTimeout(cancel, 100);

    await expect(promise).rejects.toThrow("Operation Cancelled");
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
