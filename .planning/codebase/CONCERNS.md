# CONCERNS.md — Technical Debt & Issues

## Tech Debt

1. **CORS configuration is overly permissive** (`backend/src/index.ts`)
   - `cors()` called with no options, allowing all origins
   - Remediation: restrict to known frontend origins

2. **Missing input validation** (`backend/src/services/authService.ts`)
   - No sanitization or length limits on email/password inputs beyond basic checks
   - Remediation: add Zod or express-validator schemas on routes

3. **No structured logging** (entire backend)
   - All logging via `console.log` / `console.error`
   - Remediation: adopt pino or winston with log levels

4. **Frontend disconnected from backend** (`frontend/`)
   - No API client or service layer wiring frontend to backend auth endpoints
   - Remediation: create `frontend/src/services/api.ts` with auth calls

## Known Bugs

1. **Type safety gap in middleware** (`backend/src/middleware/authMiddleware.ts`)
   - `req.user` is typed via declaration merging but could silently be undefined downstream
   - Remediation: add runtime guard before trusting `req.user`

2. **Weak email validation** (`backend/src/services/authService.ts`)
   - Basic string check may pass malformed emails to Supabase
   - Remediation: use a proper email regex or validator library

## Security Considerations

1. **Supabase service role key exposure risk** (`backend/src/lib/supabaseClient.ts`)
   - Service role key grants admin access; must never be exposed client-side
   - Remediation: confirm key is only loaded server-side via env, add `.env` to gitignore audit

2. **No rate limiting** (`backend/src/routes/authRoutes.ts`)
   - Auth endpoints have no brute-force protection
   - Remediation: add `express-rate-limit` on `/login` and `/register`

3. **JWT token validation relies entirely on Supabase** (`backend/src/middleware/authMiddleware.ts`)
   - No secondary validation layer if Supabase is unavailable
   - Remediation: document dependency; consider caching verified tokens briefly

4. **HTTPS not enforced** (`backend/src/index.ts`)
   - No redirect or HSTS headers in the Express layer
   - Remediation: handle at reverse proxy or add helmet middleware

## Performance Bottlenecks

1. **Supabase client created per request** (`backend/src/lib/supabaseClient.ts`)
   - `createClient()` may be called on every auth operation
   - Remediation: instantiate a singleton client at module load

2. **No response caching** — all auth-adjacent user lookups hit Supabase on every request
   - Remediation: add short-lived in-memory cache for profile data

## Fragile Areas

1. **Middleware type safety** (`backend/src/middleware/authMiddleware.ts`)
   - Relies on TypeScript declaration merging for `req.user`; easy to misuse
   - Risk: runtime errors if middleware is skipped or reordered

2. **Error handling inconsistency** (`backend/src/routes/authRoutes.ts`)
   - Some routes catch errors and return structured responses; others may let errors bubble
   - Remediation: add global error handler in `index.ts`

3. **Auth service boilerplate** (`backend/src/services/authService.ts`)
   - Repeated try/catch and error-wrapping patterns; fragile if Supabase API changes
   - Remediation: extract a `supabaseCall()` wrapper utility

## Scaling Limits

1. **No database models beyond auth** — no ORM or schema layer for future data
   - Single Supabase client with no query abstraction

2. **Single process, no clustering** — Express runs on one core with no PM2 or cluster setup

## Dependencies at Risk

1. **Supabase is a single point of failure** for all auth — no fallback strategy
2. **React version** (`frontend/`) — verify it's current; no lock-step with backend versioning strategy

## Missing Critical Features

1. **Frontend API communication layer** — no fetch/axios client configured
2. **Error logging/observability** — no Sentry, Datadog, or equivalent
3. **Testing infrastructure** — zero tests; no Jest/Vitest installed anywhere in the project

## Test Coverage Gaps

1. **Auth flow entirely untested** (`backend/src/services/authService.ts`) — register, login, logout paths
2. **Error scenarios** — 12+ error branches in authService have no coverage
3. **Frontend integration** — no component tests, no E2E tests
