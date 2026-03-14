# Architecture

**Analysis Date:** 2026-03-14

## Pattern Overview

**Overall:** Layered MVC architecture with separation of concerns across routes, services, and middleware.

**Key Characteristics:**
- Clear layering: HTTP concerns in routes, business logic in services, cross-cutting concerns in middleware
- Modular design with feature-based routing (auth mounted at `/v1/auth`)
- Token-based authentication using Supabase Auth provider
- Type-safe Express extensions via TypeScript declaration merging
- Stateless API design with session tokens as transport mechanism

## Layers

**Route Layer (HTTP):**
- Purpose: Handle HTTP requests/responses, validate incoming data, delegate to services
- Location: `backend/src/routes/`
- Contains: Express routers that define endpoints and HTTP-level validation
- Depends on: Service layer for business logic
- Used by: Express app in `backend/src/index.ts`
- Example: `backend/src/routes/authRoutes.ts` handles `/register`, `/login`, `/me`, `/logout` endpoints

**Service Layer (Business Logic):**
- Purpose: Encapsulate domain logic, handle authentication flows, data transformation
- Location: `backend/src/services/`
- Contains: Functions for user registration, login, token validation, session management
- Depends on: Library layer (Supabase client) and type definitions
- Used by: Route layer for request handling, middleware for authentication validation
- Example: `backend/src/services/authService.ts` contains `registerUser()`, `loginUser()`, `getUserFromAccessToken()`, etc.

**Middleware Layer (Cross-Cutting):**
- Purpose: Implement authentication guards, token extraction, request augmentation
- Location: `backend/src/middleware/`
- Contains: Authentication middleware that validates bearer tokens
- Depends on: Service layer for token validation
- Used by: Protected routes to ensure user is authenticated
- Example: `backend/src/middleware/authMiddleware.ts` provides `requireAuth` middleware that validates tokens and attaches user context to `req.auth`

**Library Layer (Infrastructure):**
- Purpose: Centralized client initialization and configuration for external services
- Location: `backend/src/lib/`
- Contains: Supabase client setup, connection pooling, auth configuration
- Depends on: Environment variables for credentials
- Used by: Service layer for all Supabase interactions
- Example: `backend/src/lib/supabase.ts` exports singleton `supabaseAuth` client and factory for user-scoped clients

**Type Layer (Contracts):**
- Purpose: Define TypeScript interfaces and types for type safety
- Location: `backend/src/types/`
- Contains: Express type augmentation, custom interfaces, domain types
- Used by: All layers for type checking
- Example: `backend/src/types/express.d.ts` extends Express Request to add `auth` property

## Data Flow

**User Registration Flow:**

1. Client POSTs email/password to `/v1/auth/register`
2. Route handler (`authRoutes.ts`) validates input format and constraints
3. Route calls `registerUser()` service function
4. Service normalizes email, calls Supabase Auth API via client
5. Service maps response to `SafeUser` type and returns
6. Route handler returns 201 with user data
7. Error responses include appropriate HTTP status codes from service layer

**User Login Flow:**

1. Client POSTs email/password to `/v1/auth/login`
2. Route handler validates input
3. Route calls `loginUser()` service function
4. Service calls Supabase Auth API with credentials
5. Service returns `LoginResponse` containing access token, refresh token, and user data
6. Client stores tokens locally
7. Subsequent requests include `Authorization: Bearer <accessToken>`

**Protected Endpoint Access Flow:**

1. Client requests protected endpoint (e.g., `GET /v1/auth/me`) with `Authorization: Bearer <token>` header
2. Route handler applies `requireAuth` middleware
3. Middleware extracts bearer token from header using `extractBearerToken()`
4. Middleware calls `getUserFromAccessToken()` to validate token with Supabase
5. Middleware attaches user context to `req.auth` object
6. Route handler accesses `req.auth` to fulfill request
7. Error responses return 401/403 if token invalid or expired

**State Management:**

- No in-memory state; all state persists in Supabase
- Session tokens are ephemeral (access token used for request validation)
- Refresh tokens managed by Supabase client (not implemented in backend yet)
- Request context (user) attached to Express Request object during middleware phase

## Key Abstractions

**AuthServiceError:**
- Purpose: Encapsulate authentication errors with HTTP status codes
- Examples: `backend/src/services/authService.ts` lines 3-10
- Pattern: Custom Error class with statusCode property allowing services to communicate HTTP semantics
- Usage: Thrown by service functions, caught by route handlers to set response status

**SafeUser:**
- Purpose: Define user data that is safe to send to clients (excludes password hashes)
- Examples: `backend/src/services/authService.ts` lines 12-16
- Pattern: Data transfer object (DTO) ensuring API only exposes intended fields
- Usage: Returned from `registerUser()`, mapped in `mapSafeUser()` helper

**AuthenticatedUser:**
- Purpose: Represent a validated user with current access token
- Examples: `backend/src/services/authService.ts` lines 18-22
- Pattern: Type contract for middleware and protected handlers
- Usage: Returned from `getUserFromAccessToken()`, attached to `req.auth`

**Supabase Client Factory:**
- Purpose: Create isolated client instances for different authentication contexts
- Examples: `backend/src/lib/supabase.ts` lines 19-29
- Pattern: Factory pattern with base configuration and user-scoped variations
- Usage: `supabaseAuth` for public operations, `createUserScopedClient()` for protected operations

**Express Request Extension:**
- Purpose: Add type-safe auth property to Express Request object
- Examples: `backend/src/types/express.d.ts`
- Pattern: TypeScript declaration merging to extend Express namespace
- Usage: Allows `req.auth` access in route handlers with full type safety

## Entry Points

**Backend Server:**
- Location: `backend/src/index.ts`
- Triggers: `npm run dev` or `npm run start`
- Responsibilities: Express app initialization, middleware setup, route mounting, port listening
- Mount pattern: Auth router mounted at `/v1/auth`, health check at `/v1/health`

**Frontend Application:**
- Location: `frontend/src/main.tsx`
- Triggers: Vite dev server or build process
- Responsibilities: React root initialization, StrictMode setup
- App component: `frontend/src/App.tsx` (currently scaffolding-only)

## Error Handling

**Strategy:** Service layer throws typed errors; route handlers catch and map to HTTP responses.

**Patterns:**

1. **AuthServiceError Pattern**: Service throws `AuthServiceError` with statusCode, route catches and returns JSON with matching status
   - Example: `authRoutes.ts` lines 40-46 (register error handling)

2. **Email Validation Pattern**: Inline validators in routes prevent invalid requests reaching services
   - Example: `authRoutes.ts` lines 27-30 (email format check)

3. **Data Type Guards**: Routes check request body types before passing to services
   - Example: `authRoutes.ts` lines 22-25 (string type checks)

4. **Supabase Error Translation**: Service maps Supabase error codes to domain errors
   - Example: `authService.ts` lines 60-73 (registration error mapping)

5. **Generic Server Error Fallback**: Unhandled errors return 500 response
   - Example: `authRoutes.ts` lines 46 (catch-all error)

## Cross-Cutting Concerns

**Logging:** Not yet implemented; `console.log` used in `index.ts` for server startup only

**Validation:**
- Route layer: Email format, password length, type guards
- Service layer: Email normalization, data transformation
- Supabase: Built-in constraints at persistence layer

**Authentication:**
- Bearer token extraction in middleware (`extractBearerToken()`)
- Token validation via Supabase in service layer (`getUserFromAccessToken()`)
- User context attachment via middleware to request object
- Protected routes use `requireAuth` middleware decorator pattern

---

*Architecture analysis: 2026-03-14*
