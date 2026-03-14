# Codebase Structure

**Analysis Date:** 2026-03-14

## Directory Layout

```
project-root/
├── backend/                    # Express + TypeScript backend API
│   ├── src/
│   │   ├── index.ts           # App initialization, route mounting, server startup
│   │   ├── routes/            # HTTP route handlers
│   │   ├── services/          # Business logic and domain operations
│   │   ├── middleware/        # Cross-cutting concerns (auth, validation)
│   │   ├── lib/               # Infrastructure clients and configuration
│   │   └── types/             # TypeScript type definitions
│   ├── package.json           # Dependencies and scripts
│   └── tsconfig.json          # TypeScript compiler configuration
│
├── frontend/                   # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── main.tsx           # React DOM mount point
│   │   ├── App.tsx            # Main App component (scaffold)
│   │   ├── assets/            # Static images and SVGs
│   │   └── App.css            # Styling
│   ├── public/                # Static assets served at root
│   ├── package.json           # Dependencies and scripts
│   ├── vite.config.ts         # Vite configuration
│   └── tsconfig.json          # TypeScript compiler configuration
│
├── .planning/                  # GSD planning directory
│   └── codebase/              # Codebase analysis documents
│
├── swagger.yaml               # OpenAPI specification for full API contract
├── AGENTS.md                  # Quick reference for coding agents
├── README.md                  # Project overview and setup instructions
└── LICENSE                    # ISC license
```

## Directory Purposes

**`backend/src/`:**
- Purpose: TypeScript source code for Express REST API
- Contains: Route handlers, service functions, middleware, client libraries, type definitions
- Key files: `index.ts` (entry point), organized by layer (routes/, services/, middleware/, lib/, types/)

**`backend/src/routes/`:**
- Purpose: HTTP request handlers and route definitions
- Contains: Express routers for each feature (auth, jobs, resumes, skills)
- Key files: `authRoutes.ts` - currently the only mounted router

**`backend/src/services/`:**
- Purpose: Encapsulated business logic, authentication flows, data operations
- Contains: Functions that implement domain operations independent of HTTP
- Key files: `authService.ts` - user registration, login, token validation, logout

**`backend/src/middleware/`:**
- Purpose: Express middleware for cross-cutting concerns
- Contains: Authentication guards, validation middleware, request transformation
- Key files: `authMiddleware.ts` - bearer token extraction and validation

**`backend/src/lib/`:**
- Purpose: Infrastructure clients and external service integration
- Contains: Supabase client initialization, connection configuration
- Key files: `supabase.ts` - singleton Supabase client factory

**`backend/src/types/`:**
- Purpose: TypeScript type definitions and type augmentation
- Contains: Custom interfaces, domain types, Express type extensions
- Key files: `express.d.ts` - extends Express Request with `auth` property

**`frontend/src/`:**
- Purpose: React TypeScript source code
- Contains: Components, styles, main entry point
- Key files: `main.tsx` (entry point), `App.tsx` (root component)

**`frontend/src/assets/`:**
- Purpose: Static images and SVG resources
- Contains: Logo files, hero images used in components

**`frontend/public/`:**
- Purpose: Static assets served at web root
- Contains: HTML template, favicon, static files

## Key File Locations

**Entry Points:**
- `backend/src/index.ts`: Express app initialization - mounts routers, starts server on port 3000
- `frontend/src/main.tsx`: React DOM mount - initializes StrictMode and renders App component
- `frontend/src/App.tsx`: Root React component (currently scaffold with counter example)

**Configuration:**
- `backend/package.json`: Backend dependencies (express, @supabase/supabase-js, typescript, tsx)
- `backend/tsconfig.json`: TypeScript strict mode, CommonJS output to dist/
- `frontend/package.json`: Frontend dependencies (react, react-dom, vite, eslint, typescript)
- `frontend/vite.config.ts`: Vite configuration with React plugin
- `swagger.yaml`: OpenAPI 3.0 spec defining all planned endpoints (auth, jobs, resumes, skills)

**Core Logic:**
- `backend/src/services/authService.ts`: Authentication service - register, login, token validation, logout
- `backend/src/routes/authRoutes.ts`: Auth endpoints - POST /register, POST /login, GET /me, POST /logout
- `backend/src/middleware/authMiddleware.ts`: Bearer token extraction and validation middleware
- `backend/src/lib/supabase.ts`: Supabase client setup and user-scoped client factory

**Type Definitions:**
- `backend/src/types/express.d.ts`: Express Request augmentation with optional `auth` property
- `backend/src/services/authService.ts`: Domain types - SafeUser, AuthenticatedUser, LoginResponse, AuthServiceError

## Naming Conventions

**Files:**
- TypeScript source: camelCase with `.ts` extension (`authService.ts`, `authRoutes.ts`)
- React components: PascalCase with `.tsx` extension (`App.tsx`; `main.tsx` is an exception)
- Configuration: lowercase (`tsconfig.json`, `vite.config.ts`)
- API specification: `swagger.yaml`
- Documentation: UPPERCASE with `.md` extension (`README.md`, `AGENTS.md`)

**Directories:**
- Feature-based grouping: `routes/`, `services/`, `middleware/`, `lib/`, `types/`
- Domain: `backend/`, `frontend/`, `.planning/`

**TypeScript Functions:**
- Service exports: camelCase (`registerUser`, `loginUser`, `getUserFromAccessToken`)
- Middleware exports: camelCase (`requireAuth`)
- Helper functions: camelCase (`extractBearerToken`, `mapSafeUser`, `normalizeEmail`)
- Error classes: PascalCase (`AuthServiceError`)

**TypeScript Types:**
- Domain types: PascalCase (`SafeUser`, `AuthenticatedUser`, `LoginResponse`)

## Where to Add New Code

**New Feature (e.g., Jobs, Resumes, Skills):**
- Routes: `backend/src/routes/[feature]Routes.ts`
- Business logic: `backend/src/services/[feature]Service.ts`
- Mount in: `backend/src/index.ts` at `app.use("/v1/[feature]", [feature]Router)`
- API contract: `swagger.yaml`

**New Frontend Component:**
- Create: `frontend/src/components/[ComponentName].tsx`
- Import in: `frontend/src/App.tsx` or parent component

**New Middleware:**
- Create: `backend/src/middleware/[concern]Middleware.ts`
- Export as: `export const [middleware] = async (req, res, next) => { ... }`

## Special Directories

**`.planning/codebase/`:** GSD codebase analysis documents (committed to git)

**`backend/dist/`:** Compiled JS output — generated, not committed

**`frontend/dist/`:** Production bundle — generated, not committed

**`node_modules/`:** npm dependencies — generated, not committed (exists in both `backend/` and `frontend/`)

---

*Structure analysis: 2026-03-14*
