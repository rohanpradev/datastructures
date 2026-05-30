import { afterAll } from "bun:test";

type TestCleanup = () => void | Promise<void>;
type TestCleanupGlobal = typeof globalThis & {
	__DATASTRUCTURES_TEST_CLEANUPS__?: TestCleanup[];
};

const symbolConstructor = globalThis.Symbol as SymbolConstructor & {
	asyncDispose?: symbol;
	dispose?: symbol;
};

if (typeof symbolConstructor.dispose === "undefined") {
	Object.defineProperty(symbolConstructor, "dispose", {
		configurable: true,
		value: symbolConstructor("Symbol.dispose"),
	});
}

if (typeof symbolConstructor.asyncDispose === "undefined") {
	Object.defineProperty(symbolConstructor, "asyncDispose", {
		configurable: true,
		value: symbolConstructor("Symbol.asyncDispose"),
	});
}

afterAll(async () => {
	const cleanupGlobal = globalThis as TestCleanupGlobal;
	const cleanups = cleanupGlobal.__DATASTRUCTURES_TEST_CLEANUPS__ ?? [];
	cleanupGlobal.__DATASTRUCTURES_TEST_CLEANUPS__ = [];

	const errors: unknown[] = [];
	for (const cleanup of cleanups.reverse()) {
		try {
			await cleanup();
		} catch (error) {
			errors.push(error);
		}
	}

	if (errors.length > 0) {
		throw new AggregateError(errors, "One or more test cleanups failed");
	}
});
