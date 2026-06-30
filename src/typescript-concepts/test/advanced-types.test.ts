import { describe, expect, test } from "bun:test";
import {
	chooseDefault,
	compileRoute,
	createTenantId,
	defineTuple,
	describeCachePolicy,
	disposableCleanup,
	hasStringProperty,
	indexBy,
	parseJson,
	ScopedCounter,
	TypedCalculator,
	TypedEventBus,
	typeScriptFeatureCatalog,
} from "@/typescript-concepts/advanced-types";

describe("modern TypeScript concepts", () => {
	test("preserves literal tuple shape with const type parameters", () => {
		const tuple = defineTuple(["stack", "queue", "heap"]);

		expect(tuple[0]).toBe("stack");
		expect(tuple).toEqual(["stack", "queue", "heap"]);
	});

	test("indexes readonly objects while preserving key and item types", () => {
		const topics = [
			{ difficulty: "easy", slug: "stack" },
			{ difficulty: "medium", slug: "heap" },
		] as const;

		const bySlug = indexBy(topics, "slug");

		expect(bySlug.get("heap")?.difficulty).toBe("medium");
	});

	test("uses satisfies to validate a catalog without widening its keys", () => {
		expect(typeScriptFeatureCatalog.satisfies.minimumVersion).toBe("4.9");
		expect(Object.keys(typeScriptFeatureCatalog)).toContain("decorators");
		expect(typeScriptFeatureCatalog.noInfer.minimumVersion).toBe("5.4");
	});

	test("narrows unknown JSON before property access", () => {
		const parsed = parseJson('{"name":"TypeScript"}');

		expect(parsed.ok).toBe(true);
		if (!parsed.ok) return;

		expect(hasStringProperty(parsed.value, "name")).toBe(true);
		if (hasStringProperty(parsed.value, "name")) {
			expect(parsed.value.name.toUpperCase()).toBe("TYPESCRIPT");
		}
	});

	test("returns explicit parse failures", () => {
		const parsed = parseJson("{invalid");

		expect(parsed.ok).toBe(false);
		if (parsed.ok) return;

		expect(parsed.error).toBeInstanceOf(SyntaxError);
	});

	test("brands validated domain identifiers", () => {
		const tenantId = createTenantId("tenant_search-platform");
		const invalidTenantId = createTenantId("search-platform");

		expect(tenantId.ok).toBe(true);
		if (tenantId.ok) {
			expect(String(tenantId.value)).toBe("tenant_search-platform");
		}

		expect(invalidTenantId.ok).toBe(false);
	});

	test("keeps defaults constrained to the literal option list with NoInfer", () => {
		const level = chooseDefault(["easy", "medium", "hard"], "medium");

		expect(level).toBe("medium");
	});

	test("builds and matches route params from template literal types", () => {
		const route = compileRoute("/tenants/:tenantId/jobs/:jobId");
		const pathname = route.build({
			jobId: "job 42",
			tenantId: "tenant_search-platform",
		});

		expect(pathname).toBe("/tenants/tenant_search-platform/jobs/job%2042");
		expect(route.match(pathname)).toEqual({
			jobId: "job 42",
			tenantId: "tenant_search-platform",
		});
		expect(route.match("/tenants/tenant_search-platform")).toBeUndefined();
		expect(() => compileRoute("/tenants/:id/jobs/:id")).toThrow(
			"duplicate route parameter",
		);
	});

	test("uses exhaustive switches for discriminated unions", () => {
		expect(describeCachePolicy({ mode: "network-only" })).toBe("network-only");
		expect(
			describeCachePolicy({
				mode: "stale-while-revalidate",
				staleMs: 30000,
				ttlMs: 5000,
			}),
		).toBe("fresh for 5000ms, stale for 30000ms");
	});

	test("keeps event names and payload tuples synchronized", () => {
		type LearningEvents = {
			"problem.completed": [slug: string, durationMs: number];
			"problem.started": [slug: string, difficulty: "easy" | "medium" | "hard"];
		};

		const bus = new TypedEventBus<LearningEvents>();
		const completed: string[] = [];

		{
			using _subscription = bus.on(
				"problem.completed",
				(slug, durationMs) => {
					completed.push(`${slug}:${durationMs}`);
				},
			);

			expect(bus.emit("problem.completed", "two-sum", 12)).toBe(1);
			expect(bus.listenerCount("problem.completed")).toBe(1);
		}

		expect(completed).toEqual(["two-sum:12"]);
		expect(bus.listenerCount("problem.completed")).toBe(0);
		expect(bus.emit("problem.completed", "two-sum", 15)).toBe(0);
	});

	test("records method calls with a typed decorator", () => {
		const calculator = new TypedCalculator();

		const sum = calculator.add(2, 3);
		const label = calculator.label("heap");

		expect(sum).toBe(5);
		expect(label).toBe("value:heap");
		expect(calculator.calls).toEqual([
			{ args: [2, 3], method: "add", result: 5 },
			{ args: ["heap"], method: "label", result: "value:heap" },
		]);
	});

	test("using disposes resources at scope exit", () => {
		let disposedCount = 0;
		let resource: ScopedCounter | undefined;

		{
			using scoped = new ScopedCounter(() => {
				disposedCount++;
			});

			resource = scoped;
			expect(scoped.isDisposed()).toBe(false);
		}

		expect(resource?.isDisposed()).toBe(true);
		expect(disposedCount).toBe(1);
	});

	test("using adapts cleanup callbacks into Disposable resources", () => {
		let activeListeners = 0;

		{
			activeListeners++;
			using _listener = disposableCleanup(() => {
				activeListeners--;
			});

			expect(activeListeners).toBe(1);
		}

		expect(activeListeners).toBe(0);
	});
});
