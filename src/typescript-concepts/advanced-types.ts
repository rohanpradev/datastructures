/**
 * Discriminated result type for APIs that return failures as values.
 */
export type Result<TValue, TError = Error> =
	| { ok: true; value: TValue }
	| { ok: false; error: TError };

/**
 * Metadata for one TypeScript language feature covered by the examples.
 */
export interface TypeScriptFeature {
	category:
		| "type-safety"
		| "inference"
		| "metaprogramming"
		| "resource-management";
	minimumVersion: string;
	whyItMatters: string;
}

/**
 * `satisfies` validates the catalog shape while preserving exact keys and
 * literal values for downstream inference.
 */
export const typeScriptFeatureCatalog = {
	constTypeParameters: {
		category: "inference",
		minimumVersion: "5.0",
		whyItMatters: "Preserves literal tuple and object shapes in generic APIs.",
	},
	decorators: {
		category: "metaprogramming",
		minimumVersion: "5.0",
		whyItMatters: "Wraps class behavior while preserving method types.",
	},
	explicitResourceManagement: {
		category: "resource-management",
		minimumVersion: "5.2",
		whyItMatters: "Runs cleanup automatically when scope exits.",
	},
	satisfies: {
		category: "type-safety",
		minimumVersion: "4.9",
		whyItMatters: "Checks object compatibility without widening inference.",
	},
	unknown: {
		category: "type-safety",
		minimumVersion: "3.0",
		whyItMatters: "Forces narrowing before using untrusted values.",
	},
} satisfies Record<string, TypeScriptFeature>;

/**
 * Exact feature names inferred from the feature catalog keys.
 */
export type TypeScriptFeatureName = keyof typeof typeScriptFeatureCatalog;

/**
 * Captures a tuple with literal element types.
 *
 * A `const` type parameter lets callers write normal array literals while the
 * helper keeps the exact tuple shape for later type-safe indexing.
 */
export function defineTuple<const TItems extends readonly unknown[]>(
	items: TItems,
): TItems {
	return items;
}

/**
 * Builds a typed lookup from readonly items without losing the item shape.
 */
export function indexBy<
	const TItem extends Record<TKey, PropertyKey>,
	const TKey extends keyof TItem,
>(items: readonly TItem[], key: TKey): Map<TItem[TKey], TItem> {
	const index = new Map<TItem[TKey], TItem>();

	for (const item of items) {
		index.set(item[key], item);
	}

	return index;
}

/**
 * Safely parses JSON into a Result union so callers must handle failure.
 */
export function parseJson(value: string): Result<unknown, SyntaxError> {
	try {
		return { ok: true, value: JSON.parse(value) };
	} catch (error) {
		return {
			ok: false,
			error:
				error instanceof SyntaxError
					? error
					: new SyntaxError("Invalid JSON input"),
		};
	}
}

/**
 * Narrows an unknown value to an object with a string property at the given key.
 */
export function hasStringProperty<TKey extends PropertyKey>(
	value: unknown,
	key: TKey,
): value is Record<TKey, string> {
	if (typeof value !== "object" || value === null || !(key in value)) {
		return false;
	}

	const record = value as Record<TKey, unknown>;

	return typeof record[key] === "string";
}

/**
 * One decorator-recorded method invocation.
 */
export type MethodCall = {
	method: string;
	args: readonly unknown[];
	result: unknown;
};

/**
 * Contract for classes that expose their decorated method-call history.
 */
export interface RecordsMethodCalls {
	readonly calls: MethodCall[];
}

/**
 * Stage-3 method decorator with full `this`, argument, and return typing.
 *
 * The decorator records a method call but returns the original result type.
 */
export function recordMethodCall<
	TThis extends { calls: MethodCall[] },
	TArgs extends unknown[],
	TReturn,
>(
	method: (this: TThis, ...args: TArgs) => TReturn,
	context: ClassMethodDecoratorContext<
		TThis,
		(this: TThis, ...args: TArgs) => TReturn
	>,
): (this: TThis, ...args: TArgs) => TReturn {
	const methodName = String(context.name);

	return function replacement(this: TThis, ...args: TArgs): TReturn {
		const result = method.call(this, ...args);
		this.calls.push({ args, method: methodName, result });
		return result;
	};
}

/**
 * Small calculator used to demonstrate type-preserving method decorators.
 */
export class TypedCalculator implements RecordsMethodCalls {
	readonly calls: MethodCall[] = [];

	@recordMethodCall
	add(left: number, right: number): number {
		return left + right;
	}

	@recordMethodCall
	label(value: string): `value:${string}` {
		return `value:${value}`;
	}
}

/**
 * Disposable counter that records whether its cleanup callback already ran.
 */
export class ScopedCounter implements Disposable {
	private disposed = false;

	constructor(private readonly onDispose: () => void) {}

	isDisposed(): boolean {
		return this.disposed;
	}

	[Symbol.dispose](): void {
		if (this.disposed) return;

		this.disposed = true;
		this.onDispose();
	}
}

/**
 * Disposable adapter for APIs that already expose cleanup callbacks.
 *
 * Use this when a function returns `unsubscribe`, `close`, `abort`, or
 * `terminate`, and you want the call to happen automatically at scope exit.
 */
export function disposableCleanup(cleanup: () => void): Disposable {
	return {
		[Symbol.dispose]: cleanup,
	};
}
