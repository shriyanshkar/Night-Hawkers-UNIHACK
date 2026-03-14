# Technology Stack

**Analysis Date:** 2026-03-14

## Languages

**Primary:**
- TypeScript 5.9.3 - Used across both frontend and backend for type safety and development experience

**Secondary:**
- JavaScript - Build configuration files (Vite, ESLint)

## Runtime

**Environment:**
- Node.js v20+ (currently v20.19.6 in development)

**Package Manager:**
- npm (inferred from package-lock.json presence)
- Lockfile: Present (package-lock.json)

## Frameworks

**Core:**
- React 19.2.4 - Frontend UI framework with React DOM
- Express 5.2.1 - Backend HTTP server and routing framework

**Frontend Build:**
- Vite 8.0.0 - Frontend build tool and dev server
- Vitejs/plugin-react 6.0.0 - React support for Vite

**Backend Build:**
- tsx 4.21.0 - TypeScript execution and watch mode for development (`tsx watch src/index.ts`)
- tsc (TypeScript Compiler) - Production build to CommonJS

**Testing:**
- Not detected

## Key Dependencies

**Critical - Backend:**
- @supabase/supabase-js 2.99.1 - Supabase authentication and database client
- dotenv 17.3.1 - Environment variable management for configuration

**Critical - Frontend:**
- react-dom 19.2.4 - React DOM rendering library

**DevDependencies - Backend:**
- @types/express 5.0.6 - TypeScript types for Express
- @types/node 25.5.0 - TypeScript types for Node.js

**DevDependencies - Frontend:**
- @types/react 19.2.14 - TypeScript types for React
- @types/react-dom 19.2.3 - TypeScript types for React DOM
- @types/node 24.12.0 - TypeScript types for Node.js (build tooling)
- typescript-eslint 8.56.1 - TypeScript linting support
- eslint 9.39.4 - Code linting
- @eslint/js 9.39.4 - ESLint recommended config
- eslint-plugin-react-hooks 7.0.1 - React hooks linting
- eslint-plugin-react-refresh 0.5.2 - React refresh validation
- globals 17.4.0 - Global variable definitions for ESLint

## Configuration

**Backend - Environment:**
- Configured via `.env` file (example template at `backend/.env.example`)
- Required variables: `PORT`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- Default PORT: 3000

**Backend - TypeScript Compiler:**
- Config file: `backend/tsconfig.json`
- Target: ES2020
- Module: CommonJS (for Node.js runtime)
- Module Resolution: Node
- Output: `dist/` directory
- Root: `src/` directory
- Strict mode enabled

**Frontend - TypeScript Compiler:**
- Config files: `frontend/tsconfig.json`, `frontend/tsconfig.app.json`, `frontend/tsconfig.node.json`
- Target: ES2023 (for modern browser support)
- Module: ESNext (bundled by Vite)
- Module Resolution: bundler
- JSX: react-jsx (modern JSX transform)
- Strict mode enabled
- Additional lint flags: noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch

**Frontend - Vite Build:**
- Config file: `frontend/vite.config.ts`
- Uses React plugin for SWC JSX transformation

**Frontend - ESLint:**
- Config file: `frontend/eslint.config.js`
- Uses flat config format (ESLint v9+)
- Extends: JS recommended, TypeScript ESLint recommended, React hooks recommended, React refresh
- Ignores: `dist/` directory

## Build & Development Scripts

**Backend:**
- `npm run dev` - Start development server with live reload using tsx watch
- `npm run build` - Compile TypeScript to JavaScript (CommonJS) in `dist/`
- `npm start` - Run compiled backend server

**Frontend:**
- `npm run dev` - Start Vite dev server with HMR (Hot Module Replacement)
- `npm run build` - Build optimized production bundle with TypeScript checking
- `npm run lint` - Run ESLint across all TypeScript/TSX files
- `npm run preview` - Preview production build locally

## Platform Requirements

**Development:**
- Node.js v20+
- npm package manager
- Modern terminal/CLI
- No specific OS requirements (cross-platform compatible)

**Production:**
- Backend: Node.js v20+ runtime
- Frontend: Static hosting capable of serving HTML/CSS/JS (CDN, web server, or serverless)
- Network access to Supabase infrastructure for authentication

## Version Coordination

- Both frontend and backend use **TypeScript 5.9.3** for consistency
- React 19.2.4 is modern stable release (React 19.x)
- Express 5.2.1 is the latest major version
- Vite 8.0.0 is stable for production builds

---

*Stack analysis: 2026-03-14*
