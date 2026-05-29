# TypeScript Concepts Learning Map

This folder demonstrates TypeScript features that improve real code quality in the rest of the repo. The examples are small on purpose: each one teaches a type-system tool that should transfer to algorithms, data structures, Node examples, and tests.

## Topics Covered

| Topic | File | Why it matters |
|---|---|---|
| `unknown` over `any` | `advanced-types.ts` | Keeps unsafe values explicit until narrowed. |
| Generics | `advanced-types.ts` | Preserves caller-specific types across reusable helpers. |
| `const` type parameters | `advanced-types.ts` | Captures literal tuple/object shapes without requiring callers to write `as const`. |
| `satisfies` | `advanced-types.ts` | Validates object shape while preserving precise inferred properties. |
| Typed decorators | `advanced-types.ts` | Demonstrates method wrapping without losing `this`, argument, or return types. |
| `using` declarations | `advanced-types.ts` | Guarantees cleanup through `Symbol.dispose` when a scope exits. |
| Result unions | `advanced-types.ts` | Makes success and failure states explicit without throwing. |

## Best Practices Used Here

- Prefer `unknown` for external errors and untrusted values.
- Use generics when the API should return the same shape or value type the caller provided.
- Use `readonly` inputs when a helper only reads data.
- Use discriminated unions for result states that callers must handle.
- Use decorators sparingly for cross-cutting behavior; keep business logic readable without them.
- Use `using` for subscriptions, handles, timers, or adapters that must be cleaned up even on early return or throw.

## Test Command

```bash
bun test src/typescript-concepts/test
```
