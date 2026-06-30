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
		| "api-design"
		| "domain-modeling"
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
	brandedTypes: {
		category: "domain-modeling",
		minimumVersion: "2.7",
		whyItMatters: "Prevents mixing structurally identical IDs by accident.",
	},
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
	noInfer: {
		category: "api-design",
		minimumVersion: "5.4",
		whyItMatters:
			"Stops fallback values from widening a caller-provided literal union.",
	},
	satisfies: {
		category: "type-safety",
		minimumVersion: "4.9",
		whyItMatters: "Checks object compatibility without widening inference.",
	},
	templateLiteralTypes: {
		category: "type-safety",
		minimumVersion: "4.1",
		whyItMatters: "Turns string patterns such as routes into checked APIs.",
	},
	typedEventMaps: {
		category: "api-design",
		minimumVersion: "4.0",
		whyItMatters: "Keeps event names and payload tuples in sync.",
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
 * Type-only brand used to model nominal IDs in TypeScript's structural type system.
 *
 * The `unique symbol` member is impossible to construct accidentally, so a plain
 * string cannot be passed where a validated `TenantId` is required.
 */
declare const brand: unique symbol;
export type Brand<TValue, TBrand extends string> = TValue & {
	readonly [brand]: TBrand;
};

export type TenantId = Brand<string, "TenantId">;

const TENANT_ID_PATTERN = /^tenant_[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Validates and brands a tenant id at the boundary of the system.
 */
export function createTenantId(value: string): Result<TenantId, Error> {
	if (!TENANT_ID_PATTERN.test(value)) {
		return {
			ok: false,
			error: new Error("tenant id must look like tenant_example-123"),
		};
	}

	return { ok: true, value: value as TenantId };
}

/**
 * Keeps a default value tied to the caller's literal option list.
 *
 * Without `NoInfer`, TypeScript may widen `TOptions[number]` to include the
 * fallback itself. This helper keeps the options as the source of truth.
 */
export function chooseDefault<
	const TOptions extends readonly [string, ...string[]],
>(options: TOptions, fallback: NoInfer<TOptions[number]>): TOptions[number] {
	return options.includes(fallback) ? fallback : options[0];
}

type StripRouteToken<TToken extends string> = TToken extends `${infer Name}?`
	? Name
	: TToken;

/**
 * Extracts `:param` names from route strings such as `/tenants/:tenantId/jobs/:jobId`.
 */
export type RouteParamNames<TPath extends string> =
	TPath extends `${string}:${infer Param}/${infer Rest}`
		? StripRouteToken<Param> | RouteParamNames<`/${Rest}`>
		: TPath extends `${string}:${infer Param}`
			? StripRouteToken<Param>
			: never;

export type RouteParams<TPath extends string> = {
	readonly [TParam in RouteParamNames<TPath>]: string;
};

export interface CompiledRoute<TPath extends string> {
	readonly path: TPath;
	build(params: RouteParams<TPath>): string;
	match(pathname: string): RouteParams<TPath> | undefined;
}

/**
 * Compiles a small route template into a typed builder and matcher.
 *
 * The runtime parser stays deliberately simple and O(number of path segments);
 * the value is that callers get compile-time checking for the required params.
 */
export function compileRoute<const TPath extends string>(
	path: TPath,
): CompiledRoute<TPath> {
	if (!path.startsWith("/")) throw new Error("route path must start with /");

	const segments = splitPath(path);
	const paramNamesByIndex = new Map<number, string>();
	const seenParams = new Set<string>();

	for (let index = 0; index < segments.length; index++) {
		const segment = segments[index]!;
		if (!segment.startsWith(":")) continue;

		const paramName = segment.slice(1).replace(/\?$/, "");
		if (paramName.length === 0) throw new Error("route param name is empty");
		if (seenParams.has(paramName)) {
			throw new Error(`duplicate route parameter: ${paramName}`);
		}

		seenParams.add(paramName);
		paramNamesByIndex.set(index, paramName);
	}

	return {
		path,
		build(params) {
			const values = params as Record<string, string>;

			return `/${segments
				.map((segment, index) => {
					const paramName = paramNamesByIndex.get(index);
					return paramName ? encodeURIComponent(values[paramName]!) : segment;
				})
				.join("/")}`;
		},
		match(pathname) {
			const incomingSegments = splitPath(pathname);
			if (incomingSegments.length !== segments.length) return undefined;

			const params: Record<string, string> = {};
			for (let index = 0; index < segments.length; index++) {
				const paramName = paramNamesByIndex.get(index);
				const incomingSegment = incomingSegments[index]!;

				if (paramName) {
					params[paramName] = decodeURIComponent(incomingSegment);
					continue;
				}

				if (segments[index] !== incomingSegment) return undefined;
			}

			return params as RouteParams<TPath>;
		},
	};
}

function splitPath(pathname: string): string[] {
	return pathname.split("/").filter(Boolean);
}

export type CachePolicy =
	| { mode: "cache-first"; ttlMs: number }
	| { mode: "network-only" }
	| { mode: "stale-while-revalidate"; ttlMs: number; staleMs: number };

/**
 * Exhaustive switch helper. Adding a new union member now creates a compiler
 * error until this function's callers handle it.
 */
export function assertNever(value: never): never {
	throw new Error(`Unhandled variant: ${JSON.stringify(value)}`);
}

export function describeCachePolicy(policy: CachePolicy): string {
	switch (policy.mode) {
		case "cache-first":
			return `cache-first for ${policy.ttlMs}ms`;
		case "network-only":
			return "network-only";
		case "stale-while-revalidate":
			return `fresh for ${policy.ttlMs}ms, stale for ${policy.staleMs}ms`;
		default:
			return assertNever(policy);
	}
}

export type EventMapShape<TEvents> = {
	[TName in keyof TEvents]: unknown[];
};

export type EventHandler<TArgs extends unknown[]> = (...args: TArgs) => void;

/**
 * Event emitter whose event names control the payload tuple type.
 *
 * Listener lookup is O(1) by event name and emit is O(listener count). The
 * snapshot during emit lets listeners unsubscribe without mutating iteration.
 */
export class TypedEventBus<TEvents extends EventMapShape<TEvents>> {
	private readonly listeners = new Map<
		keyof TEvents,
		Set<(...args: unknown[]) => void>
	>();

	on<TName extends keyof TEvents>(
		event: TName,
		handler: EventHandler<TEvents[TName]>,
	): Disposable {
		let handlers = this.listeners.get(event);
		if (!handlers) {
			handlers = new Set<(...args: unknown[]) => void>();
			this.listeners.set(event, handlers);
		}

		handlers.add(handler as (...args: unknown[]) => void);

		return disposableCleanup(() => {
			handlers.delete(handler as (...args: unknown[]) => void);
			if (handlers.size === 0) this.listeners.delete(event);
		});
	}

	emit<TName extends keyof TEvents>(
		event: TName,
		...args: TEvents[TName]
	): number {
		const handlers = this.listeners.get(event);
		if (!handlers) return 0;

		const snapshot = [...handlers];
		for (const handler of snapshot) handler(...args);

		return snapshot.length;
	}

	listenerCount<TName extends keyof TEvents>(event: TName): number {
		return this.listeners.get(event)?.size ?? 0;
	}
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
