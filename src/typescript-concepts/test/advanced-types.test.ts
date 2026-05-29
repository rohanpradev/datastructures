import { describe, expect, test } from "bun:test";
import {
	defineTuple,
	disposableCleanup,
	hasStringProperty,
	indexBy,
	parseJson,
	ScopedCounter,
	TypedCalculator,
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
