/**
 * Wraps an async generator function to produce a cancellable asynchronous operation.
 *
 * The returned function executes the generator and provides:
 * - `promise`: resolves with the final generator result
 * - `cancel`: immediately stops the generator and rejects the promise
 *
 * @template Args - The parameter types of the generator function
 * @template YieldType - Type of values yielded by the generator
 * @template ReturnType - Type returned when the generator completes
 *
 * @param generatorFn - An async generator function
 * @returns A function that executes the generator and supports cancellation
 *
 * @example
 * const cancellable = createAsyncCancellable<[], number, number>(
 *   async function* (): AsyncGenerator<number, number, number> {
 *     const a = yield 1;
 *     const b = yield a + 2;
 *     return b * 2;
 *   }
 * );
 *
 * const { promise, cancel } = cancellable();
 *
 * // Cancel after 100ms
 * setTimeout(cancel, 100);
 *
 * promise
 *   .then(result => console.log("Result:", result))
 *   .catch(err => console.error(err.message)); // "Operation Cancelled" if cancelled
 */
export function createAsyncCancellable<
  Args extends unknown[],
  YieldType,
  ReturnType,
>(
  generatorFn: (
    ...args: Args
  ) => AsyncGenerator<YieldType, ReturnType, YieldType>,
) {
  return function executeCancellable(...args: Args): {
    promise: Promise<ReturnType>;
    cancel: () => void;
  } {
    const generatorIterator = generatorFn(...args);
    let isCancelled = false;

    const cancel = (): void => {
      isCancelled = true;

      // Safely terminate the generator
      if (typeof generatorIterator.return === "function") {
        // TypeScript requires a value of ReturnType
        void generatorIterator.return(null as unknown as ReturnType);
      }
    };

    const promise = new Promise<ReturnType>((resolve, reject) => {
      // Lint-safe async function inside Promise executor
      const processGenerator = async (): Promise<void> => {
        try {
          let iteration = await generatorIterator.next();

          while (!iteration.done) {
            if (isCancelled) {
              throw new Error("Operation Cancelled");
            }

            try {
              // Await in case the yield value is a Promise
              const resolvedValue = await iteration.value;
              iteration = await generatorIterator.next(resolvedValue);
            } catch (error) {
              iteration = await generatorIterator.throw(error);
            }
          }

          resolve(iteration.value);
        } catch (error) {
          reject(error);
        }
      };

      processGenerator();
    });

    return { promise, cancel };
  };
}
