# CareerCheatCode — GitHub Issues (48-Hour Sprint)

Generated from README.md, swagger.yaml, and codebase analysis.

---

## Phase 1: Foundation (Hours 0–8)

---

**Title:** `[Frontend] Bootstrap App Layout & Navigation Shell`
**Iteration:** Phase 1 — Foundation
**Description:** Set up the root React app with page routing and a persistent layout shell (header, nav, content area). This gives every other frontend issue a stable scaffold to build on.
**Acceptance Criteria:**
- A `Layout` component renders a header with the CareerCheatCode brand and a nav bar
- React Router (or equivalent) has routes defined for `/`, `/tailor`, and `/skills`
- All routes render placeholder content without crashing; Tailwind CSS is installed and working

---

**Title:** `[Backend & AI] Scaffold Resume Tailor & Skill Tree Route Stubs`
**Iteration:** Phase 1 — Foundation
**Description:** Create the Express route files for `POST /resumes/tailor` and `POST /skills/tree` with hardcoded stub responses. This unblocks the Integrator to write API client code before the real AI logic is done.
**Acceptance Criteria:**
- `POST /resumes/tailor` returns a hardcoded JSON response with `tailoredBullets` and `matchScore` fields
- `POST /skills/tree` returns a hardcoded JSON response with a `learningPath` array of 3 steps
- Both routes are mounted in `backend/src/index.ts` and reachable via `curl` or Postman

---

**Title:** `[Integrator] Configure Shared Environment & API Client Module`
**Iteration:** Phase 1 — Foundation
**Description:** Create a single `api.ts` module in the frontend that centralizes all `fetch` calls to the backend. Set up `.env` files for both frontend and backend so the team can switch between local and deployed URLs with a single variable.
**Acceptance Criteria:**
- `frontend/src/api.ts` exports `tailorResume()` and `generateSkillTree()` functions that call the backend
- `VITE_API_URL` env var controls the backend base URL in the frontend with no hardcoded `localhost` elsewhere
- `backend/.env` is documented in `backend/.env.example` with all required keys listed

---

**Title:** `[Pitch Master] Define Demo Persona & Seed Content`
**Iteration:** Phase 1 — Foundation
**Description:** Create a realistic demo persona (name, background, resume text, target job) that the whole team can use for consistent testing and that will be used live during the pitch demo.
**Acceptance Criteria:**
- A `demo/` folder or Notion doc contains a sample resume (500+ words of realistic text) and a target job description
- The persona has a clear "before/after" story arc that supports the pitch narrative
- Demo inputs are pre-typed/copy-paste ready so the live demo can be run in under 60 seconds

---

## Phase 2: Core AI Engine (Hours 8–24)

---

**Title:** `[Backend & AI] Implement POST /resumes/tailor with Claude API`
**Iteration:** Phase 2 — Core AI Engine
**Description:** Replace the stub in `/resumes/tailor` with a real Claude (or OpenAI) prompt that rewrites resume bullet points to match keywords from the provided job description and returns a match score. This is the primary MVP feature.
**Acceptance Criteria:**
- Endpoint accepts `{ resumeText: string, jobDescription: string }` and returns `{ tailoredBullets: string[], matchScore: number, keywords: string[] }`
- The AI prompt instructs the model to preserve factual accuracy while optimizing for keyword overlap
- Returns a structured error with a 500 status if the AI API call fails, never crashing the server

---

**Title:** `[Backend & AI] Implement POST /skills/tree with Claude API`
**Iteration:** Phase 2 — Core AI Engine
**Description:** Replace the stub in `/skills/tree` with a real AI prompt that identifies skill gaps between the user's current skills and a target job title, returning a 3-step actionable learning path.
**Acceptance Criteria:**
- Endpoint accepts `{ currentSkills: string[], targetJobTitle: string }` and returns `{ gaps: string[], learningPath: Step[] }` where each `Step` has `title`, `resources`, and `estimatedTime`
- The response always contains exactly 3 learning path steps ordered by priority
- Endpoint responds in under 15 seconds under normal conditions; times out gracefully

---

**Title:** `[Frontend] Build Resume Input Component (Paste & File Upload)`
**Iteration:** Phase 2 — Core AI Engine
**Description:** Build the `ResumeInput` component that lets users either paste plain text or upload a `.pdf`/`.docx` file. For the MVP, file upload reads the file client-side and extracts raw text to pass to the API.
**Acceptance Criteria:**
- Component has two tabs: "Paste Text" (textarea) and "Upload File" (file picker accepting `.pdf` and `.docx`)
- File upload reads file content and stores extracted text in React state; a char count is displayed
- A "Next" button is disabled until resume text is non-empty (minimum 100 characters)

---

**Title:** `[Frontend] Build Job Description Input Component`
**Iteration:** Phase 2 — Core AI Engine
**Description:** Build the `JobDescriptionInput` component with a textarea for pasting a job description and a submission button that triggers the AI tailor flow. Include a field for the target job title used by the Skill Tree.
**Acceptance Criteria:**
- Component renders a labeled textarea and a "Job Title" text input field
- "Analyze My Resume" CTA button is visually prominent (primary Tailwind style) and disabled while loading
- Component emits `onSubmit({ jobDescription, jobTitle })` to the parent page for API orchestration

---

**Title:** `[Integrator] Connect Frontend Inputs to Resume Tailor API`
**Iteration:** Phase 2 — Core AI Engine
**Description:** Wire the `ResumeInput` and `JobDescriptionInput` components to the `tailorResume()` API client function, managing loading state and passing the response to the results page. This is the first live end-to-end flow.
**Acceptance Criteria:**
- Clicking "Analyze My Resume" calls `api.tailorResume()` with live data and stores the response in React state
- A loading spinner replaces the button while the request is in-flight
- On API error, a user-visible error message is shown (not just a console log)

---

## Phase 3: Results UI & Integration (Hours 24–36)

---

**Title:** `[Frontend] Build Tailored Resume Results Display`
**Iteration:** Phase 3 — Results & Integration
**Description:** Build the `TailoredResumeResults` component that renders the AI-tailored bullet points alongside a match score badge and a highlighted keyword list. This is the primary output users see after analysis.
**Acceptance Criteria:**
- Match score is displayed as a prominent circular badge (e.g., "87% Match") with color coding (red/yellow/green)
- Tailored bullet points are displayed in a scrollable card, with a one-click "Copy All" button
- Detected keywords are shown as pill badges below the bullet points

---

**Title:** `[Frontend] Build Skill Tree Visualization Component`
**Iteration:** Phase 3 — Results & Integration
**Description:** Build the `SkillTree` component that renders the 3-step learning path as a visually distinct vertical timeline or card stack, showing each step's title, resources, and time estimate.
**Acceptance Criteria:**
- Three steps render in order with step numbers, titles, and resource links styled distinctly
- Each step card has an "estimated time" label (e.g., "~2 weeks")
- Identified skill gaps are listed above the timeline as "You're missing:" tags

---

**Title:** `[Integrator] Wire Skill Tree API & Full End-to-End QA`
**Iteration:** Phase 3 — Results & Integration
**Description:** Connect the `generateSkillTree()` API call to the `SkillTree` component and run a full end-to-end QA pass using the demo persona data to validate the entire user journey works without errors.
**Acceptance Criteria:**
- Skill Tree renders real AI data from the backend after the resume analysis completes
- The full flow (paste resume → paste JD → click analyze → see results on both tabs) works in one uninterrupted session
- No console errors or unhandled promise rejections appear during the demo flow

---

**Title:** `[Pitch Master] Populate App with Demo Data & Capture Screenshots`
**Iteration:** Phase 3 — Results & Integration
**Description:** Run the full demo flow with the pre-made persona data, capture screenshots of the results, and embed them in the pitch deck to show "what it looks like when it works" even if the live demo fails.
**Acceptance Criteria:**
- At least 3 polished screenshots of the app (input state, loading state, results state) are in the slide deck
- The "before resume" and "after tailored resume" are shown side-by-side in one slide
- Screenshots show realistic, non-Lorem-Ipsum content from the demo persona

---

## Phase 4: Polish & Demo Prep (Hours 36–48)

---

**Title:** `[Frontend] UI Polish, Responsive Layout & Loading States`
**Iteration:** Phase 4 — Polish & Demo Prep
**Description:** Do a final visual pass on all components — fix spacing, ensure the layout works on a laptop screen at 1280px wide, and add smooth loading skeletons so the app looks polished during the live demo.
**Acceptance Criteria:**
- All pages look intentional at 1280×800 (standard laptop); no overflowing elements or broken layouts
- Loading skeleton placeholders appear in the results area while the API call is pending
- No raw Tailwind utility class conflicts or unstyled default browser elements are visible

---

**Title:** `[Integrator] Error Handling, Edge Cases & Pre-Demo Smoke Test`
**Iteration:** Phase 4 — Polish & Demo Prep
**Description:** Harden the app against the most likely demo-breaking failures: empty inputs, AI API timeout, and network errors. Run a final smoke test simulating the exact demo conditions (WiFi, projector resolution).
**Acceptance Criteria:**
- Submitting empty inputs shows inline validation messages, not a crashed UI
- If the AI API call takes >20 seconds, a timeout error message is shown with a "Try Again" button
- The full demo flow is successfully completed 3 times back-to-back with zero crashes or console errors

---

**Title:** `[Pitch Master] Finalize Pitch Deck & Rehearse Demo Script`
**Iteration:** Phase 4 — Polish & Demo Prep
**Description:** Finalize the slide deck with the problem/solution/demo/team structure and lock in a 3-minute demo script where every sentence is paired with a specific action in the app.
**Acceptance Criteria:**
- Slide deck has: Problem, Solution, Live Demo placeholder, Tech Stack, Team, and "What's Next" slides
- A written demo script (with timestamps) exists so any team member can deliver the demo
- The team has rehearsed the full pitch at least once with a timer, hitting the time limit

---

## Summary: 16 Issues across 4 Phases

| Phase | Hours | Frontend | Backend & AI | Integrator | Pitch Master |
|---|---|---|---|---|---|
| 1 — Foundation | 0–8 | App layout | Route stubs | Env & API client | Demo persona |
| 2 — Core AI | 8–24 | Resume input, JD input | `/tailor` + `/skills/tree` | Wire tailor flow | — |
| 3 — Results | 24–36 | Results display, Skill tree | — | Wire skill tree + QA | Screenshots |
| 4 — Polish | 36–48 | UI polish | — | Error handling + smoke test | Pitch deck |

**Key parallelism notes:**
- Phase 1 issues are fully independent — all 4 roles can start simultaneously
- Phase 2: Backend stubs (Phase 1) unblock Integrator before real AI is done
- Phase 3: Frontend components can be built against mock data while Integrator waits for real API
- Hacker 2 has no Phase 3/4 issues — use that time for prompt tuning if AI quality is poor
