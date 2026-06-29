# Supporting Notes

## What Keel does
Keel is an interactive SRE and chaos engineering co-pilot. It turns plain language resilience questions into active cluster queries and fault simulations, then renders the results through role aware dashboards.

## Operational profile gating
A single conversational engine adapts telemetry, language, and recommendations to the selected role.

| Profile | Sample metrics surfaced |
| :--- | :--- |
| Developer | Connection pool status, YAML validation, `p95` latency |
| Product Manager | Cart abandonment, checkout friction, funnel drop off |
| Designer | FID, CLS, loader fallback states |
| Executive | SLA budgets, hourly downtime cost, recovery cost |
| Non Technical | Plain English speed and uptime indicators |

## Security note
Gemini API calls run server side, so the `GEMINI_API_KEY` is never shipped to the browser. Only `.env.example` with placeholder values is committed. Real `.env` files are git ignored.

## Original project README
The application's own detailed README is preserved at [../src/README.md](../src/README.md).
