# Copilot Custom Instructions for TypeScript

## Coding Style

- Use modern TypeScript syntax (ES2022+), including optional chaining, nullish coalescing, and private class fields.
- Prefer `const` and `let` over `var`. Default to `const` unless mutation is required.
- Always use type annotations for function parameters and return types.
- Use interface or type aliases for object and function types.
- Prefer `readonly` for immutable properties.
- Use ES modules (`import`/`export`) exclusively.
- Prefer arrow functions for callbacks and function expressions.
- Use template literals instead of string concatenation.

## Naming Conventions

- Use camelCase for variables, functions, and properties.
- Use PascalCase for types, interfaces, enums, and classes.
- Prefix boolean variables and functions that return a boolean with `is`, `has`, `can`, or `should`.
- Suffix async functions with `Async`.

## Error Handling

- Use `try-catch` for async/await error handling.
- Throw custom error types where appropriate.
- Avoid silent failures; log errors with context.

## Comments & Documentation

- Use JSDoc for public functions, classes, and complex logic.
- Inline comments should explain "why", not "what".

## Testing

- Write testable code; prefer pure functions.
- Use dependency injection for external resources.

## Best Practices

- Prefer immutability: avoid mutating parameters or global state.
- Avoid using `any`; use unknown or more specific types.
- Prefer explicit over implicit typing.
- Use strict compiler settings (`strict: true` in tsconfig.json).
- Organize code into small, reusable modules.

## Example

```typescript
// Adds two numbers and returns the result.
/**
 * Adds two numbers.
 * @param a - The first number.
 * @param b - The second number.
 * @returns The sum of a and b.
 */
export function add(a: number, b: number): number {
  return a + b;
}
```
