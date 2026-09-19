# Cairose GTM dashboard

Local CRM-lite for Daniela (B2B florist leads, ICP research, competencia, week tasks). **No polish pass** — Branding/UX later.

This React app supersedes the static HTML GTM dashboard (`strategy/cairose-gtm/dashboard`). Do not delete that HTML yet.

Landings STOP — do not change the product Next.js marketing/root landing. This app lives only under `apps/gtm-dashboard`.

## How to run

```
cd apps/gtm-dashboard && npm install && npm run dev
```

Then open http://127.0.0.1:5173/

Tabs: `?tab=b2b` (default; also `leads`) · `icp` · `comp` · `b2c` · `semana` · `links`

## Data

| File | Feeds |
|------|--------|
| `src/data/seed-v5.json` | Canonical leads (**11**), competitors (**10**), tasks, product locks |

Edits to leads/tasks persist under localStorage key:

`cairose-gtm-crm-dash-v5-data`

Competitors re-sync from seed on load (watch list stays canonical).

## Tabs

- **B2B** — florist leads. Memories = HOLD/DNC. Amelia Casa Floral = counterexample, not a normal sales pitch.
- **ICP/research** — research priority / fit. Not purchase intent.
- **Competencia** — `competitors[]` only. Not CRM leads.
- **B2C** — empty / sin dato.
- **Esta semana** — tasks.
- **Links** — lead + competitor URLs.

Filters + search + drawer (opener / notes) on B2B, ICP, and Competencia.

## Product locks (footer)

- SaaS sold **to florist only**
- **No take rate** v1
- End-customer pays the **florist**
- Coexist with WA/site
- Outreach **HOLD** until Daniela OK

## Out of scope

Landing pages · cloud CRM · contacting anyone · UI polish.
