<p align="center">
  <img src="https://raw.githubusercontent.com/benhildermantelus/cqta-hackathon/submission/team-telus-gtlp/submissions/team-telus-gtlp/presentation/keel-title.png" alt="Keel. The foundation of the ship." width="820">
</p>

<h1 align="center">Keel ⚓</h1>

<p align="center">
  <em>The foundation of the ship. Resilience you can talk to.</em>
</p>

<p align="center">
  An interactive SRE and chaos engineering co-pilot, powered by Gemini, that lets an entire<br>
  product team simulate, diagnose, and remediate incidents through plain conversation.
</p>

<p align="center">
  <a href="https://youtu.be/IQ1bTmSWtZ8"><img src="https://img.shields.io/badge/%E2%96%B6_Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch the demo"></a>
  <a href="https://github.com/benhildermantelus/cqta-hackathon/blob/submission/team-telus-gtlp/submissions/team-telus-gtlp/presentation/keel-pitch-deck.pdf"><img src="https://img.shields.io/badge/Pitch_Deck-0B3D5C?style=for-the-badge&logo=adobeacrobatreader&logoColor=white" alt="Pitch deck"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite 6">
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4">
  <img src="https://img.shields.io/badge/Gemini-8E75B2?logo=googlegemini&logoColor=white" alt="Google Gemini">
</p>

<p align="center">
  <strong>Team TELUS GTLP</strong> &nbsp;&middot;&nbsp; CQTA Quality Engineering Hackathon 2026
</p>

---

## Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Who It Is For](#who-it-is-for)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Demo Walkthrough](#demo-walkthrough)
- [Roadmap and Adoption](#roadmap-and-adoption)
- [Known Limitations](#known-limitations)
- [Team](#team)
- [License](#license)
- [Presentation Gallery](#presentation-gallery)

---

## Overview

**Keel** is an SRE and chaos engineering co-pilot for the whole team. It turns resilience
engineering into a conversation: anyone can ask a high level question in plain English, and
Keel translates it into active cluster queries and stress tests, then explains the outcome in
language that fits the person asking.

## The Problem

Resilience knowledge lives with a handful of SREs and senior engineers. Everyone else on a
product team, including product managers, designers, executives, and non technical
stakeholders, struggles to answer simple questions:

- Will checkout survive a peak sale?
- What does an hour of downtime actually cost us?
- Is this slow for our users?

Running a real fault simulation or reading a chaos report is out of reach for most of the
team. The result is slow feedback, shallow shared understanding of risk, and reliability work
that never quite gets prioritized.

## The Solution

The core innovation is **operational profile gating**: a single conversational engine that
adapts its telemetry, vocabulary, and recommendations to the user's role. The same incident is
reframed automatically for a developer, a product manager, a designer, an executive, or a non
technical stakeholder, so the whole team builds shared understanding from one source of truth.

## Who It Is For

Whole product teams with mixed technical depth.

| Role | What Keel surfaces |
| :--- | :--- |
| 💻 **Developer** | Architectural diagnostics, connection pool status, YAML validation, `p95` latency trends |
| 💼 **Product Manager** | Cart abandonment, checkout friction, retention funnel drop off |
| 🎨 **Designer** | Interaction delay (FID), Cumulative Layout Shift (CLS), loader fallback states |
| 🧭 **Executive** | SLA budgets, hourly downtime cost, outage recovery exposure |
| 👤 **Non Technical** | Plain English speed and uptime indicators, safety guarantees |

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | React 19, TypeScript |
| Build tool | Vite 6 |
| Server | Express full stack, run with `tsx` in development |
| AI | Google Gemini via `@google/genai`, called server side |
| Styling | Tailwind CSS v4 |
| Animation | Motion |
| Icons | Lucide React |
| Production bundler | esbuild, compiling the server to a standalone CommonJS bundle |

## Architecture

A single Express server hosts both the API and the Vite built React frontend. In development,
Vite runs as Express middleware for instant hot reload. In production, esbuild bundles
`server.ts` into `dist/server.cjs` and serves the static frontend assets. All Gemini calls
happen server side, so the API key never reaches the browser. The interface is a split view
workspace: a conversational panel on the left, and a live role dependent telemetry control
board on the right.

## Repository Structure

```text
submissions/team-telus-gtlp/
├── README.md            This file
├── src/                 Complete, runnable Keel application
│   ├── server.ts        Full stack Express server (Vite middleware + static routes)
│   ├── .env.example     Template for required secrets (e.g. GEMINI_API_KEY)
│   └── src/
│       ├── App.tsx                       Profile gating, chat panels, workflows
│       └── components/
│           ├── RoleDashboard.tsx         Role specific telemetry (SVG charts, gauges, KPIs)
│           ├── ExperimentPlanCard.tsx    Active test blueprints and progress
│           └── ProvisioningPanel.tsx     Virtual cluster config and resource state
├── presentation/        Pitch deck PDF, slide images, demo video link
└── docs/                Supporting notes
```

## Getting Started

> Requires Node.js 18 or newer.

```bash
cd src
npm install
cp .env.example .env      # then set GEMINI_API_KEY to a valid Google Gemini API key
```

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Runs the full stack app on port `3000` |
| `npm run build` | Builds the frontend and bundles the server to `dist/server.cjs` |
| `npm run start` | Runs the production build |
| `npm run lint` | Type checks with `tsc --noEmit` |

> ✅ Validated on a clean install: `npm install` (214 packages) and `npm run lint` both pass.

## Demo Walkthrough

1. Start the app with `npm run dev` and open http://localhost:3000.
2. Select an operational profile, for example Developer or Executive.
3. Watch the right hand telemetry board populate with role specific live metrics.
4. Use the conversational panel to trigger an investigation, for example *"simulate a database slowdown during a peak sale"* or *"blast synthetic traffic at the checkout endpoint."*
5. Switch profiles to see the same incident reframed for a different audience.

## Roadmap and Adoption

Keel is designed to be adopted, not just demoed. It has a zero learning curve, a role specific
interface, and standard connectors for k6, Grafana, and CI/CD. Rollout follows the Prosci ADKAR
change management framework so adoption sticks.

A feasible, phased rollout for a mid size engineering organization:

| Phase | Timeline | Estimate | Highlights |
| :--- | :--- | :--- | :--- |
| **1. Pilot** | Weeks 0 to 6 | ~$40K | Single team MVP in staging, Slack bot, one canonical experiment flow |
| **2. Integrate** | Months 2 to 5 | ~$180K | Wire into CI/CD and PR checks, two way translator and reports, onboard 5 to 8 service teams |
| **3. Scale** | Months 6 to 12 | ~$450K | Org wide self service rollout, automated Game Days and SLO gates, incident replay library |

Cumulative investment is roughly **$670K over 12 months**. Figures are planning estimates.

## Known Limitations

- Requires a valid `GEMINI_API_KEY`. Without it, the conversational features do not function.
- Telemetry, simulations, and cluster state are simulated for demonstration purposes.
- Voice input depends on browser and microphone permissions.

## Team

**TELUS GTLP**

- Ben Hilderman
- Anjuthan Tharmarajah
- Ansia Sivakumaran
- Nolan Verboomen

## License

No separate license is specified for this submission. Third party libraries retain their
respective licenses, including React, Vite, Express, Tailwind CSS, Motion, Lucide, and
`@google/genai`.

---

## Presentation Gallery

🎬 **[Watch the full demo on YouTube](https://youtu.be/IQ1bTmSWtZ8)** &nbsp;&middot;&nbsp; 📊 **[Download the pitch deck (PDF)](https://github.com/benhildermantelus/cqta-hackathon/blob/submission/team-telus-gtlp/submissions/team-telus-gtlp/presentation/keel-pitch-deck.pdf)**

<table>
  <tr>
    <td align="center" width="33%">
      <img src="https://raw.githubusercontent.com/benhildermantelus/cqta-hackathon/submission/team-telus-gtlp/submissions/team-telus-gtlp/presentation/keel-title.png" alt="Keel title slide" width="100%"><br>
      <strong>Title</strong><br>
      <sub>The foundation of the ship.</sub>
    </td>
    <td align="center" width="33%">
      <img src="https://raw.githubusercontent.com/benhildermantelus/cqta-hackathon/submission/team-telus-gtlp/submissions/team-telus-gtlp/presentation/keel-adoption.png" alt="Built for adoption slide" width="100%"><br>
      <strong>Built for Adoption</strong><br>
      <sub>Zero learning curve and ADKAR change management.</sub>
    </td>
    <td align="center" width="33%">
      <img src="https://raw.githubusercontent.com/benhildermantelus/cqta-hackathon/submission/team-telus-gtlp/submissions/team-telus-gtlp/presentation/keel-roadmap.png" alt="Implementation roadmap slide" width="100%"><br>
      <strong>Implementation Roadmap</strong><br>
      <sub>Pilot, Integrate, and Scale phases.</sub>
    </td>
  </tr>
</table>
