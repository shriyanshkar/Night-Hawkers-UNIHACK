# External Integrations

**Analysis Date:** 2026-03-14

## APIs & External Services

**Authentication & Database Platform:**
- Supabase - Full authentication and database backend
  - SDK/Client: @supabase/supabase-js v2.99.1
  - Auth: Environment variables `SUPABASE_URL` and `SUPABASE_ANON_KEY`
  - Used for: User registration, login, session management, token validation

## Data Storage

**Databases:**
- Supabase (PostgreSQL)
  - Connection: Via Supabase client initialized with `SUPABASE_URL` and `SUPABASE_ANON_KEY`
  - Client: @supabase/supabase-js
  - Authentication: Token-based via Bearer tokens in Authorization header

**File Storage:**
- Not detected - Local filesystem only (no explicit file storage integration)

**Caching:**
- None - No explicit caching layer detected

## Authentication & Identity

**Auth Provider:**
- Supabase Auth (native PostgreSQL authentication)
  - Implementation: Password-based email/password authentication
  - Token management: JWT access tokens and refresh tokens
  - Session handling: Bearer token authentication for subsequent requests
  - Endpoints:
    - `auth.signUp()` - User registration
    - `auth.signInWithPassword()` - User login
    - `auth.getUser()` - Validate access token and retrieve user info
    - `auth.signOut()` - Logout/invalidate session

**Token Strategy:**
- Access tokens: Short-lived JWT tokens for API authentication
- Refresh tokens: Long-lived tokens for session refresh (generated but not currently used in rotations)
- Token validation: Performed via Supabase `getUser()` method
- Bearer token extraction: Implemented in `backend/src/middleware/authMiddleware.ts`

## Monitoring & Observability

**Error Tracking:**
- Not detected - No external error tracking service integrated

**Logs:**
- Console logging only - Standard Node.js `console.log()` for server startup messages
- No structured logging framework detected
- Error responses return descriptive messages to clients

## CI/CD & Deployment

**Hosting:**
- Not detected - Development configuration only
- Candidate platforms (not yet configured): Vercel (frontend), Railway/Fly.io/Render (backend)

**CI Pipeline:**
- Not detected - No GitHub Actions, GitLab CI, or other pipeline configuration present

**Build Configuration:**
- Backend: TypeScript compilation to CommonJS
- Frontend: Vite bundling to static assets

## Environment Configuration

**Required env vars (Backend):**
- `PORT` - Server port (default: 3000)
- `SUPABASE_URL` - Supabase project URL (format: https://your-project-ref.supabase.co)
- `SUPABASE_ANON_KEY` - Supabase anonymous/publishable key for public auth flows

**Optional env vars:**
- None detected

**Secrets location:**
- `.env` file (local development only - not committed)
- Example template: `backend/.env.example`
- Production: Should be set via platform environment (e.g., Vercel/Railway environment variables)

**Loading mechanism:**
- dotenv package automatically loads `.env` file on import
- Loaded at: `backend/src/index.ts` and `backend/src/lib/supabase.ts`

## API Endpoints (Internal Backend)

**Authentication Endpoints:**
- `POST /v1/auth/register` - Create new user account
  - Body: `{ email: string, password: string }`
  - Returns: `{ user: { id, email, createdAt } }`

- `POST /v1/auth/login` - Authenticate user and get tokens
  - Body: `{ email: string, password: string }`
  - Returns: `{ accessToken, refreshToken, expiresIn, tokenType, user: { id, email, createdAt } }`

- `GET /v1/auth/me` - Get current authenticated user (requires Bearer token)
  - Header: `Authorization: Bearer <accessToken>`
  - Returns: `{ user: { id, email } }`

- `POST /v1/auth/logout` - Invalidate current session (requires Bearer token)
  - Header: `Authorization: Bearer <accessToken>`
  - Returns: `{ message: "Logged out." }`

- `GET /v1/health` - Health check endpoint
  - Returns: `"OK"`

## Webhooks & Callbacks

**Incoming:**
- Not detected - No webhook endpoints configured

**Outgoing:**
- Not detected - No outgoing webhook/event delivery system configured

## Client-Server Communication

**Frontend to Backend:**
- Not yet integrated - Frontend is template boilerplate with no API calls
- Candidate approach: Fetch API or Axios for HTTP requests to backend endpoints

**Base Configuration:**
- Backend server: `http://localhost:3000` (development)
- API prefix: `/v1/` (versioned API structure)

## Security Configuration

**CORS:**
- Not detected - No explicit CORS configuration
- Default Express behavior: No CORS headers set (frontend requests from different origin would be blocked)
- Recommendation: Add CORS middleware for frontend domain

**Authentication Middleware:**
- Location: `backend/src/middleware/authMiddleware.ts`
- Validates Bearer tokens before accessing protected routes
- Extracts and validates against Supabase Auth service

**Password Requirements:**
- Minimum length: 8 characters (enforced at registration)
- Email validation: Basic regex pattern validation

---

*Integration audit: 2026-03-14*
