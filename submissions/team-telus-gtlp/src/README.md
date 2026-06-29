# Keel ⚓ — SRE AI Co-Pilot

Keel is an interactive SRE and chaos-engineering companion built to simulate, diagnose, and remediate application incidents using conversational AI. By translating high-level resilience questions into active cluster queries and stress tests, Keel makes system reliability, SLO budgets, and fault simulation accessible across entire product teams.

---

## 🌟 Core Features

### 1. Operational Profile Gating
Keel filters diagnostics, telemetry, and conversational prompts based on the user's role. Upon loading, users select an operational profile:
- 💻 **Developer**: Deep architectural diagnostics, connection pool status, YAML config validation, and `p95` latency trends.
- 💼 **Product Manager**: Cart abandonment metrics, checkout friction levels, and retention funnel drop-off indicators.
- 🎨 **Designer**: Interaction delay (FID), Cumulative Layout Shift (CLS), and loading spinner state fallbacks.
- 🧭 **Executive**: SLA budgets, hourly downtime financial exposure, and outage recovery cost calculations.
- 👤 **Non-Technical**: Plain-English speed indicators, simplified uptime metrics, and safety guarantees.

### 2. Live Role-Dependent Telemetry Dashboards
The application features a responsive split-view workspace. The right sidebar renders a custom, live-updating telemetry control board corresponding to your profile:
- **Developer View**: Live-streamed latencies on interactive SVG charts showing SLO thresholds.
- **Product Manager View**: Live checkout retention funnel tracking user drop-offs.
- **Designer View**: Interaction delay gauges and dynamic animated loader state mockups.
- **Executive View**: SLA compliance probability trends under stress load.
- **Non-Technical View**: A visual, colorful speedometer/gauge representing user response speeds.

### 3. Voice-Simulated Suggestions & Conversations
Users can interact via natural language. Keel generates dynamic, profile-specific recommendations and voice input suggestions to instantly trigger SRE investigations, including:
- Database slowdown simulations during peak shopping sales.
- Upstream/downstream network packet drop diagnostics.
- Synthetic traffic blasting (e.g., virtual users on checkout endpoints).

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vite.dev/)
- **Server**: Full-stack [Express](https://expressjs.com/) backend utilizing `tsx` in development
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for a sleek, modern dark UI
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Production Bundler**: [esbuild](https://esbuild.github.io/) (compiles server-side code into standalone CommonJS for optimized container cold-starts)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation
Install the project dependencies:
```bash
npm install
```

### Running the App
Start the full-stack development server:
```bash
npm run dev
```
The application will run locally and serve on port `3000`.

### Production Build & Start
To build and bundle the production assets:
```bash
npm run build
```
This command compiles the frontend static assets and uses `esbuild` to compile `server.ts` into a self-contained CommonJS file under `dist/server.cjs`.

To run the compiled production build:
```bash
npm run start
```

---

## 📂 Project Structure

- `src/App.tsx`: The primary application hub with profile gating, chat panels, and operational workflows.
- `src/components/RoleDashboard.tsx`: High-performance telemetry dashboards rendering dynamic SVG graphs, gauges, and role-specific KPIs.
- `src/components/ExperimentPlanCard.tsx`: Displays active test blueprints and step-by-step progress tracking.
- `src/components/ProvisioningPanel.tsx`: Virtual cluster configuration and resource state visualization.
- `server.ts`: Full-stack Express server integrating Vite development middleware and static route proxies.
- `.env.example`: Template for configuring API keys securely (e.g. `GEMINI_API_KEY`).
