# TESTING.md — Test Structure & Practices

**Analysis Date:** 2026-03-14

## Current State

**Zero automated tests exist in this codebase.**

No testing framework is installed in either `backend/` or `frontend/`. No test files (`.test.ts`, `.spec.ts`, `.test.tsx`) are present anywhere in the project.

## Testing Framework (Recommended)

Neither Jest nor Vitest is installed. Given the stack:

- **Backend:** Jest + `ts-jest` or Vitest (compatible with TypeScript/Node)
- **Frontend:** Vitest + React Testing Library (Vite-native, no extra config needed)

## What Needs Testing

### Backend — Critical (Security-Sensitive)

`backend/src/services/authService.ts` has 12+ error branches, all untested:

- `registerUser()` — success path, duplicate email, weak password, Supabase error
- `loginUser()` — success path, wrong password, unknown email, Supabase error
- `getUserFromAccessToken()` — valid token, expired token, malformed token
- `logoutUser()` — success path, invalid session

`backend/src/middleware/authMiddleware.ts`:
- Missing Authorization header
- Malformed Bearer token
- Valid token → `req.user` set correctly

`backend/src/routes/authRoutes.ts`:
- Route wiring (integration-level)
- Missing required body fields → 400 response
- Unauthenticated access to protected routes → 401

### Frontend — Currently Scaffold

`frontend/src/App.tsx` is a placeholder; no meaningful component logic to test yet.

Once feature components are added, test with:
- React Testing Library for component rendering and interaction
- Mock API calls (msw or vi.mock)

## Mocking Strategy (Recommended)

**Supabase:** Mock `@supabase/supabase-js` at the module level to avoid real network calls:

```ts
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      getUser: vi.fn(),
      signOut: vi.fn(),
    }
  }
}))
```

**Express routes:** Use `supertest` for HTTP-level integration tests without starting a real server.

## Test File Placement (Recommended)

Co-locate tests with source files:

```
backend/src/
  services/
    authService.ts
    authService.test.ts       ← unit tests
  routes/
    authRoutes.ts
    authRoutes.test.ts        ← integration tests (supertest)
  middleware/
    authMiddleware.ts
    authMiddleware.test.ts
```

## Coverage Gaps (Priority Order)

1. `authService.ts` — all exported functions (highest priority, security-critical)
2. `authMiddleware.ts` — token extraction and validation logic
3. `authRoutes.ts` — route/controller layer with supertest
4. Frontend components — once meaningful UI exists

## Setup Steps (When Ready)

**Backend:**
```bash
cd backend
npm install -D vitest @types/supertest supertest
```

Add to `backend/package.json`:
```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

**Frontend:**
```bash
cd frontend
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Vitest is already compatible with Vite; add `test` config to `frontend/vite.config.ts`.

---

*Testing analysis: 2026-03-14*
