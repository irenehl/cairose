# Cairose

White-label facilitator for florists. **Cairose never sells flowers.** Florists own catalog, pricing, fulfillment, and charging their customers. Platform revenue is SaaS to florists (price TBD / configurable — never hardcoded in the UI). End-customer in-app payments are a Coming soon stub.

This repo is a working slice: florist panel (Cairose chrome) + tenant storefront (florist brand). The showcase tenant is the fictional florist **Casa Limón**. URL slug is locked to **`casa-limon` only**. It is not Memories, Haru, Camelot, Bugambilias, Amelia, or Cairose-as-florist.

## Source of truth (GitHub)

Publish path is **GitHub first**. Do not create an Origin repo.

- Private repo: [https://github.com/irenehl/cairose](https://github.com/irenehl/cairose)
- Default branch: `main`

If this cloud session cannot authenticate to GitHub, create the empty **private** repo as `irenehl/cairose`, then either push `main` from a machine that has access or add a Cloud Agent secret named `GH_TOKEN` / `GITHUB_TOKEN` (`repo` scope) and ask the agent to push.

### Vercel preview (next)

After the GitHub repo exists: Import **that** repo in the Vercel dashboard (`New Project` → GitHub → `irenehl/cairose`). Do not invent a `*.vercel.app` URL before Vercel creates one.

Preview env (placeholders are OK; Clarity stays empty):

| Name | Preview value |
|------|----------------|
| `NEXT_PUBLIC_CONVEX_URL` | `https://placeholder.convex.cloud` |
| `CONVEX_DEPLOYMENT` | *(empty)* |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_placeholder` |
| `CLERK_SECRET_KEY` | `sk_test_placeholder` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | `/panel` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | `/panel` |
| `PLATFORM_ROOT_DOMAIN` | `cairose.local` (path `/t/casa-limon` still works on the Vercel host) |
| `NEXT_PUBLIC_CLARITY_ID` | *(empty — do not invent an ID)* |

Local seed fallback runs without real Clerk/Convex. Sign-in UI and live Convex need real keys later. Clarity stays empty until there is a public URL.

## Stack

- Next.js App Router + TypeScript + Tailwind
- Convex (schema, queries, mutations, seed)
- Clerk (Google + email/SMS OTP, when keys are real)
- Spanish UI defaults

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Dev server: [http://127.0.0.1:43147](http://127.0.0.1:43147)

Without real Clerk/Convex keys the app still runs using a local seed of Casa Limón (browser `localStorage`). That is for preview only.

### Hit the two surfaces

| Surface | Path | Notes |
|---------|------|--------|
| Florist panel (Cairose chrome) | `/panel` | Branding, catalog, plans, deliveries |
| Casa Limón storefront | `/t/casa-limon` | Tenant colors, not Cairose palette |
| Plan subscribe / gift | `/t/casa-limon/planes` | Payer ≠ recipient, diaspora OK |
| Manage skip/pause | `/t/casa-limon/s/[id]` | Events are recorded; ops may finish on WhatsApp |

Subdomain (optional): add to `/etc/hosts`:

```
127.0.0.1 cairose.local casa-limon.cairose.local
```

Then `http://casa-limon.cairose.local:43147` rewrites to `/t/casa-limon` via `proxy.ts` (`PLATFORM_ROOT_DOMAIN=cairose.local`). The only showcase slug is **`casa-limon`**.

## Environment

See `.env.example`. Required for full auth + live backend:

- `NEXT_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- Convex dashboard: `CLERK_JWT_ISSUER_DOMAIN` (Clerk Frontend API URL)
- `PLATFORM_ROOT_DOMAIN=cairose.local`

Clerk dashboard: enable Google and email/SMS OTP. Create a JWT template named `convex`.

The app **compiles** with placeholder keys. Sign-in UI needs real Clerk keys.

## Insights / Microsoft Clarity

For the Insights bot. **Do not block the product cut on Clarity.** The project ID comes late (Daniela needs a public URL first). No fake Clarity ID.

| Item | Status |
|------|--------|
| Env var | `NEXT_PUBLIC_CLARITY_ID` (stub in `.env.example`, empty by default) |
| Script | `components/clarity.tsx` — loads on storefront **and** florist panel via root layout **only if** the env var is non-empty |
| Helper | `lib/analytics.ts` — fires named events when the ID is set; **no-ops** if unset |
| Until ID exists | Leave the var empty; the app must run without Clarity |

Daniela pastes the real project ID into `.env.local` / host env when the public URL is ready.

Min props on every event: `tenant_id` (slug) + `is_demo` (`true` when slug is `casa-limon`). No PII.

### Storefront events (B2C)

| Event | When |
|-------|------|
| `view_home` | Casa Limón home |
| `view_plan` | Plan list or a plan page |
| `subscribe_start` | Enters subscribe flow |
| `start_gift` | “Enviar a alguien más” |
| `subscribe_step` | Step `plan` \| `gift` \| `address` \| `checkout` |
| `checkout_coming_soon` | Payment coming-soon banner |
| `skip_intent` | Skip stub |
| `pause_intent` | Pause stub |
| `wa_handoff` | WhatsApp CTA (`reason`: `skip` \| `pause` \| `checkout` \| `support`) |

### Panel events (B2B)

| Event | When |
|-------|------|
| `panel_view_plans` | `/panel/subscriptions` |
| `panel_view_subscribers` | Same list of subscriber plans |
| `panel_view_orders` | `/panel/orders` |
| `panel_edit_price` | Florist saves a catalog price |
| `panel_edit_cadence` | Florist saves a subscription SKU (cadence UI is still the seed defaults) |

Funnels v0: `view_plan` → `subscribe_start` → `subscribe_step(address)` → `checkout_coming_soon`. Gift adds `start_gift`. Retention: `skip_intent` / `pause_intent` (+ `wa_handoff`).

## Convex

Schema lives in `convex/schema.ts`. Public functions validate `args` and `returns`.

Seed Casa Limón as `casa-limon` (prices/SKUs/cadences from the Research seed pack — do not invent other prices):

```bash
npx convex dev          # or: CONVEX_AGENT_MODE=anonymous npx convex dev
npx convex run seed:seedDemo
# replace catalog/zones: npx convex run seed:seedDemo '{"force":true}'
```

Seed creates tenant slug `casa-limon`, display name **Casa Limón**, 6 products, 3 add-ons, AMSS + exterior zone (USD 6 surcharge), cadences 7 / 14 / 28 days. SaaS plan price is unset → UI shows **TBD**.

First Clerk user with no membership is attached to the demo tenant as owner (`users.ensureMe`).

## Folder map

```
app/(platform)/panel/     Florist panel — Cairose tokens, wordmark, mark
app/t/[slug]/             Tenant storefront — Casa Limón theme (`/t/casa-limon`)
app/cairose-tokens.css    Platform chrome tokens
app/tenant-theme.css      Casa Limón storefront theme
convex/                   Schema + queries/mutations + seed
lib/copy.ts               Spanish panel/storefront defaults
lib/storefront-copy.ts    Casa Limón storefront voice
public/cairose-*.svg      Platform brand
public/tenants/casa-limon Official Casa Limón mark + wordmark
```

## Product notes

- Storefront must not look like Cairose is selling bouquets. No prominent powered-by.
- Gift flow allows a foreign payer and a local recipient. Payment status is `awaiting_florist_payment`.
- In-app card pay button is disabled **Próximamente**.
- Skip/pause/resume/cancel/change address/cadence all write `subscriptionEvents`.
- Deliveries include `failed_nobody_home` plus florist notes.
- Showcase pitch: “así se vería tu marca.”
