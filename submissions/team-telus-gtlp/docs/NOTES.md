# Supporting Notes — Keel ⚓

## What Keel does
Keel is an interactive SRE / chaos-engineering co-pilot. It turns plain-language
resilience questions into active cluster queries and fault simulations, and renders
results through role-aware dashboards.

## Role-aware design ("operational profile gating")
A single conversational engine adapts telemetry, language, and recommendations to
the selected role:

| Profile         | Sample metrics surfaced                                |
|-----------------|--------------------------------------------------------|
| Developer       | Connection pool status, YAML validation, `p95` latency |
| Product Manager | Cart abandonment, checkout friction, funnel drop-off   |
| Designer        | FID, CLS, loader fallback states                       |
| Executive       | SLA budgets, hourly downtime cost, recovery cost       |
| Non-Technical   | Plain-English speed/uptime indicators                  |

## Security note
Gemini API calls are made server-side so the `GEMINI_API_KEY` is never shipped to the
browser. Only `.env.example` (placeholder values) is committed; real `.env` files are
git-ignored.

## Original project README
The application's own detailed README is preserved at `../src/README.md`.
