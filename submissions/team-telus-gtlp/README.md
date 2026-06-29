# Keel ⚓ — SRE AI Co-Pilot

> Resilience you can talk to.

## Participant(s)
- Team: **TELUS GTLP**
- Ben Hilderman (ben.hilderman@telus.com)

## Problem Statement
Site reliability and chaos-engineering knowledge is usually locked inside a small
group of SREs and senior developers. The rest of a product team — PMs, designers,
executives, and non-technical stakeholders — cannot easily ask questions about
system resilience, SLO budgets, or the business impact of an outage, let alone run
a fault simulation. This creates slow feedback loops and poor shared understanding
of reliability risk.

## Solution Summary
**Keel** is an interactive SRE and chaos-engineering companion that lets anyone on a
product team simulate, diagnose, and remediate application incidents through
conversational AI. It translates high-level resilience questions into active cluster
queries and stress tests, and presents the results through role-aware dashboards so
each audience sees the metrics that matter to them.

Key innovation: **operational profile gating** — the same conversational engine
adapts its telemetry, language, and recommendations to the user's role (Developer,
Product Manager, Designer, Executive, or Non-Technical), making reliability
engineering accessible across an entire organization.

## Target Users
Whole product teams that care about reliability but have mixed technical depth:
- **Developers** — architectural diagnostics, connection pool status, YAML config validation, `p95` latency trends.
- **Product Managers** — cart abandonment, checkout friction, retention funnel drop-off.
- **Designers** — interaction delay (FID), Cumulative Layout Shift (CLS), loader fallback states.
- **Executives** — SLA budgets, hourly downtime financial exposure, recovery cost.
- **Non-Technical** — plain-English speed/uptime indicators and safety guarantees.

## Tech Stack
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Server**: Express (full-stack), run with `tsx` in development
- **AI**: Google Gemini via `@google/genai` (server-side)
- **Styling**: Tailwind CSS v4
- **Animation**: Motion
- **Icons**: Lucide React
- **Production Bundler**: esbuild (compiles `server.ts` to a standalone CommonJS bundle for fast container cold-starts)

## Architecture Overview
A single Express server hosts both the API and the Vite-built React frontend. In
development, Vite runs as Express middleware; in production, `esbuild` bundles
`server.ts` into `dist/server.cjs` and serves the static frontend assets. Gemini API
calls are made server-side so the API key is never exposed to the browser. The UI is
a split-view workspace: a conversational panel on the left and a live, role-dependent
telemetry control board on the right.

## Repository Structure
- `src/`: The complete, runnable Keel application (React frontend + Express server).
  - `src/src/App.tsx`: Primary app hub — profile gating, chat panels, workflows.
  - `src/src/components/RoleDashboard.tsx`: Role-specific telemetry dashboards (SVG charts, gauges, KPIs).
  - `src/src/components/ExperimentPlanCard.tsx`: Active test blueprints and step-by-step progress.
  - `src/src/components/ProvisioningPanel.tsx`: Virtual cluster config and resource state.
  - `src/server.ts`: Full-stack Express server with Vite middleware and static routes.
  - `src/.env.example`: Template for required secrets (e.g. `GEMINI_API_KEY`).
- `presentation/`: Demo video link (see below).
- `docs/`: Supporting notes.

## Setup Instructions
> Requires Node.js (18+ recommended).

1. `cd src`
2. `npm install`
3. Copy `.env.example` to `.env` and set `GEMINI_API_KEY` to a valid Google Gemini API key.

## Run Instructions
1. Development: `npm run dev` — serves the full-stack app on port `3000`.
2. Production build: `npm run build` — builds the frontend and bundles the server to `dist/server.cjs`.
3. Production start: `npm run start`.
4. Type-check / lint: `npm run lint`.

## Demo Instructions
1. Start the app (`npm run dev`) and open http://localhost:3000.
2. Select an **operational profile** (e.g. Developer or Executive) on load.
3. Watch the right-hand telemetry board populate with role-specific live metrics.
4. Use the conversational panel (typed or voice suggestions) to trigger an SRE
   investigation, e.g. "simulate a database slowdown during a peak sale" or
   "blast synthetic traffic at the checkout endpoint."
5. Switch profiles to see the same incident reframed for a different audience.

## Presentation
- **Demo video:** [Keel — demo (Google Drive)](https://drive.google.com/file/d/1i0tpB-dHFfFq1N3gRrX_eAg7Q1HKY2s8/view?usp=sharing)
- Slides: N/A (demo-driven submission).

## Known Limitations
- Requires a valid `GEMINI_API_KEY`; without it the conversational features will not function.
- Telemetry, simulations, and cluster state are simulated for demonstration purposes.
- Voice input is browser/microphone-permission dependent.

## License
No separate license specified for this submission. Third-party libraries retain their
respective licenses (React, Vite, Express, Tailwind CSS, Motion, Lucide, `@google/genai`).
