# TypeScript Concepts Learning Map

This folder demonstrates TypeScript features that improve real code quality in the rest of the repo. The examples are small on purpose: each one teaches a type-system tool that should transfer to algorithms, data structures, Node examples, and tests.

## Topics Covered

| Topic | File | Why it matters |
|---|---|---|
| `unknown` over `any` | `advanced-types.ts` | Keeps unsafe values explicit until narrowed. |
| Generics | `advanced-types.ts` | Preserves caller-specific types across reusable helpers. |
| `const` type parameters | `advanced-types.ts` | Captures literal tuple/object shapes without requiring callers to write `as const`. |
| `satisfies` | `advanced-types.ts` | Validates object shape while preserving precise inferred properties. |
| Branded domain types | `advanced-types.ts` | Prevents mixing plain strings with validated tenant/user/order IDs. |
| `NoInfer` | `advanced-types.ts` | Keeps fallback/default values from widening caller-owned literal unions. |
| Template literal types | `advanced-types.ts` | Turns route strings and naming conventions into checked APIs. |
| Exhaustive unions | `advanced-types.ts` | Forces every discriminated-union variant to be handled when the model evolves. |
| Typed event maps | `advanced-types.ts` | Keeps event names and payload tuple types synchronized. |
| Typed decorators | `advanced-types.ts` | Demonstrates method wrapping without losing `this`, argument, or return types. |
| `using` declarations | `advanced-types.ts` | Guarantees cleanup through `Symbol.dispose` when a scope exits. |
| Result unions | `advanced-types.ts` | Makes success and failure states explicit without throwing. |

## Best Practices Used Here

- Prefer `unknown` for external errors and untrusted values.
- Use generics when the API should return the same shape or value type the caller provided.
- Use `readonly` inputs when a helper only reads data.
- Use discriminated unions for result states that callers must handle.
- Brand values only after runtime validation at the system boundary.
- Use `NoInfer` when defaults, fallbacks, or comparison values must not become part of the inferred source union.
- Use template literal types for stable string protocols such as routes, event names, cache keys, and metric names.
- Put `assertNever` in the default branch of important discriminated-union switches.
- Use decorators sparingly for cross-cutting behavior; keep business logic readable without them.
- Use `using` for subscriptions, handles, timers, or adapters that must be cleaned up even on early return or throw.

## Tooling Notes

- `bun run typecheck` uses stable `typescript@7.0.2` and its native `tsc` compiler. The repository moved off the preview nightly when TypeScript 7 became stable in July 2026.
- The repo follows Bun's TypeScript guidance by using `moduleResolution: "bundler"`, `module: "Preserve"`, `verbatimModuleSyntax`, and `types: ["bun"]`.
- `exactOptionalPropertyTypes` and `noPropertyAccessFromIndexSignature` are enabled. `noUncheckedIndexedAccess` is documented as the next strictness backlog because enabling it now surfaces many unrelated algorithm-indexing fixes.

## Test Command

```bash
bun test src/typescript-concepts/test
```
