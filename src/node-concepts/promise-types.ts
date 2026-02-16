/**
 * Promise Study Utilities
 * -----------------------
 * Each function demonstrates a specific Promise method
 * and is designed to be easily testable with Jest.
 */

/* -------------------------------------------------- */
/* 1️⃣ Promise.resolve */
/* -------------------------------------------------- */

/**
 * Returns a resolved promise with the given value.
 */
export function resolvedValue<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

/* -------------------------------------------------- */
/* 2️⃣ Promise.reject */
/* -------------------------------------------------- */

/**
 * Returns a rejected promise with the given reason.
 */
export function rejectedValue(reason: any): Promise<never> {
  return Promise.reject(reason);
}

/* -------------------------------------------------- */
/* 3️⃣ Promise.all */
/* -------------------------------------------------- */

/**
 * Resolves when all promises resolve.
 * Rejects immediately if one fails.
 */
export function allPromises<T>(promises: Promise<T>[]): Promise<T[]> {
  return Promise.all(promises);
}

/* -------------------------------------------------- */
/* 4️⃣ Promise.allSettled */
/* -------------------------------------------------- */

/**
 * Resolves when all promises settle (never rejects).
 */
export function allSettledPromises<T>(
  promises: Promise<T>[],
): Promise<PromiseSettledResult<T>[]> {
  return Promise.allSettled(promises);
}

/* -------------------------------------------------- */
/* 5️⃣ Promise.race */
/* -------------------------------------------------- */

/**
 * Resolves or rejects with the first settled promise.
 */
export function racePromises<T>(promises: Promise<T>[]): Promise<T> {
  return Promise.race(promises);
}

/* -------------------------------------------------- */
/* 6️⃣ Promise.any */
/* -------------------------------------------------- */

/**
 * Resolves with the first fulfilled promise.
 * Rejects only if all promises reject.
 */
export function anyPromise<T>(promises: Promise<T>[]): Promise<T> {
  return Promise.any(promises);
}

/* -------------------------------------------------- */
/* 7️⃣ then chaining */
/* -------------------------------------------------- */

/**
 * Demonstrates promise chaining with .then()
 */
export function chainedThen(value: number): Promise<number> {
  return Promise.resolve(value)
    .then((v) => v * 2)
    .then((v) => v + 5);
}

/* -------------------------------------------------- */
/* 8️⃣ catch handling */
/* -------------------------------------------------- */

/**
 * Demonstrates error recovery with .catch()
 */
export function catchExample(): Promise<string> {
  return Promise.reject("Error occurred").catch(() => "Recovered");
}

/* -------------------------------------------------- */
/* 9️⃣ finally handling */
/* -------------------------------------------------- */

/**
 * Demonstrates .finally() behavior.
 * Returns resolved value but runs callback first.
 */
export function finallyExample(callback: () => void): Promise<string> {
  return Promise.resolve("Done").finally(callback);
}
