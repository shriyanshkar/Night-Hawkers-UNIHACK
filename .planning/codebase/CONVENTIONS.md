# Coding Conventions

**Analysis Date:** 2026-03-14

## Naming Patterns

**Files:**
- Backend services: `camelCaseWithContext.ts` (e.g., `authService.ts`)
- Backend middleware: `descriptiveMiddleware.ts` (e.g., `authMiddleware.ts`)
- Routes: `descriptorRoutes.ts` (e.g., `authRoutes.ts`)
- Libraries/utilities: `descriptiveContext.ts` (e.g., `supabase.ts`)
- Type definitions: `express.d.ts` for ambient module declarations

**Functions:**
- camelCase for all function names
- Private/internal functions start with `extract`, `map`, `send`, `validate` prefixes indicating their purpose
- Examples: `extractBearerToken`, `mapSafeUser`, `sendBadRequest`, `isValidEmail`, `normalizeEmail`
- Async functions: no special prefix, use async/await syntax

**Variables:**
- camelCase for all variables
- Suffixed with semantic type when helpful: `emailValue`, `passwordValue`, `accessToken`, `refreshToken`
- Constants are PascalCase within functions but not separately declared as CONST
- React hooks: `useState`, `createRoot` from standard React

**Types:**
- PascalCase for all type definitions (TypeScript interfaces and types)
- Exported types named with semantic intent: `SafeUser`, `AuthenticatedUser`, `LoginResponse`, `AuthServiceError`
- Custom Error classes: PascalCase extending Error (e.g., `AuthServiceError`)

## Code Style

**Formatting:**
- ESLint with TypeScript support is primary linter
- Frontend: flat config via `eslint.config.js` using @eslint/js, typescript-eslint, and React plugins
- No Prettier configuration found; linting is primary code organization tool
- Line length appears to follow modern standards (120-150 character lines observed)

**Linting:**
- Frontend uses ESLint v9.39.4 with plugins:
  - `@eslint/js` for base recommendations
  - `typescript-eslint` for TypeScript specific rules
  - `eslint-plugin-react-hooks` for React hooks compliance
  - `eslint-plugin-react-refresh` for Vite React refresh compatibility
- Backend: No explicit ESLint config found; uses TypeScript compiler for static analysis
- Backend TypeScript strict mode enabled

## Import Organization

**Order:**
1. Third-party library imports (`express`, `@supabase/supabase-js`)
2. Local path imports (services, middleware, routes)
3. Ambient module declarations for types

**Path Aliases:**
- No path aliases configured
- Relative paths used throughout: `"../services/authService"`

**Example from `authMiddleware.ts`:**
```typescript
import { NextFunction, Request, Response } from "express";
import { AuthServiceError, getUserFromAccessToken } from "../services/authService";
```

**Example from `authService.ts`:**
```typescript
import { createUserScopedClient, supabaseAuth } from "../lib/supabase";
```

## Error Handling

**Patterns:**
- Custom Error class pattern: `AuthServiceError` extends Error with statusCode property
- Constructor: `new AuthServiceError(statusCode: number, message: string)`
- Error checking on API responses: Check for `error?.status` codes, then error presence, then data validity
- Three-step validation in service functions:
  1. Check specific error status codes (400, 401, 429, etc.) and throw with appropriate status
  2. Check for general error or missing data
  3. Throw generic 500 error if data missing
- Route handlers catch `AuthServiceError` instances with instanceof check and extract statusCode
- Fallback to 500 status with generic message for uncaught errors

**Example from `authService.ts`:**
```typescript
export class AuthServiceError extends Error {
  public statusCode: number;
  public constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const loginUser = async (emailInput: string, passwordInput: string): Promise<LoginResponse> => {
  const email = normalizeEmail(emailInput);
  const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password: passwordInput });

  if (error?.status === 429) {
    throw new AuthServiceError(429, "Too many login attempts. Try again later.");
  }
  if (error?.status === 400 || error?.status === 401) {
    throw new AuthServiceError(401, "Invalid credentials.");
  }
  if (error || !data.user || !data.session) {
    throw new AuthServiceError(500, "Failed to process login.");
  }
  // Return success
};
```

## Logging

**Framework:** `console` object (console.log)

**Patterns:**
- Server startup logging: `console.log("Server listening on port ${port}")`
- No structured logging framework in use
- No log levels (debug, info, warn, error) implemented
- Logging only for operational visibility, not for debugging

## Comments

**When to Comment:**
- No JSDoc comments found in current codebase
- Comments appear minimal or absent
- Code is self-documenting through clear function and variable naming

**JSDoc/TSDoc:**
- Not detected in current implementation
- Type documentation via TypeScript types and interfaces (preferred approach)

## Function Design

**Size:**
- Functions typically 5-50 lines
- Async functions in services handle single concerns (registration, login, token validation, logout)
- Route handlers follow 15-35 line pattern with request validation, service call, error handling, and response

**Parameters:**
- Explicit string parameters for user inputs: `emailInput`, `passwordInput` to avoid shadow naming
- Single responsibility per function parameters (auth functions take only email/password)
- Destructured response objects from external APIs

**Return Values:**
- Typed with explicit return types in function signatures
- Services return custom types: `SafeUser`, `LoginResponse`, `AuthenticatedUser`
- Middleware returns Promise<void> and uses early returns with response sending
- No implicit returns (void or explicit object returns)

## Module Design

**Exports:**
- Named exports for functions and types in services: `export const`, `export type`
- Custom Error class exported for instanceof checks in handlers
- Router default export pattern: `export default authRouter`
- Type unions exported for reuse: `LoginResponse` type exported from services

**Barrel Files:**
- Not used in current codebase
- Direct imports from specific module files

## TypeScript Configuration

**Backend (`tsconfig.json`):**
- Target: ES2020
- Module: CommonJS
- Strict mode: Enabled
- moduleResolution: Node
- Output: `dist/` directory
- Root: `src/` directory

**Frontend (`tsconfig.app.json`):**
- Target: ES2023 (more recent)
- Module: ESNext
- Strict mode: Enabled
- JSX: react-jsx
- Additional strictness: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`

---

*Convention analysis: 2026-03-14*
