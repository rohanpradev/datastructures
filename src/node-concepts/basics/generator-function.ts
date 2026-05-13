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
		const cancelledError = new Error("Operation Cancelled");
		let rejectCancelled: (reason: Error) => void = () => {};
		const cancellation = new Promise<never>((_, reject) => {
			rejectCancelled = reject;
		});

		const cancel = (): void => {
			if (isCancelled) return;
			isCancelled = true;
			rejectCancelled(cancelledError);

			// Safely terminate the generator
			if (typeof generatorIterator.return === "function") {
				// TypeScript requires a value of ReturnType
				void generatorIterator
					.return(null as unknown as ReturnType)
					.catch(() => {});
			}
		};

		const promise = new Promise<ReturnType>((resolve, reject) => {
			// Lint-safe async function inside Promise executor
			const processGenerator = async (): Promise<void> => {
				try {
					let iteration = await Promise.race([
						generatorIterator.next(),
						cancellation,
					]);

					while (!iteration.done) {
						if (isCancelled) {
							throw cancelledError;
						}

						try {
							// Await in case the yield value is a Promise
							const resolvedValue = await Promise.race([
								Promise.resolve(iteration.value),
								cancellation,
							]);
							iteration = await Promise.race([
								generatorIterator.next(resolvedValue),
								cancellation,
							]);
						} catch (error) {
							if (isCancelled || error === cancelledError) {
								throw error;
							}

							iteration = await Promise.race([
								generatorIterator.throw(error),
								cancellation,
							]);
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
