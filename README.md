# Cairose

White-label facilitator for florists. **Cairose never sells flowers.** Florists own catalog, pricing, fulfillment, and charging their customers. Platform revenue is SaaS to florists (price TBD / configurable — never hardcoded in the UI). End-customer in-app payments are a Coming soon stub.

This repo is a working slice: florist panel (Cairose chrome) + tenant storefront (florist brand). The showcase tenant is the fictional florist **Casa Limón**. URL slug is locked to **`casa-limon` only**. It is not Memories, Haru, Camelot, Bugambilias, Amelia, or Cairose-as-florist.

## Create the Origin repo (Daniela)

This cloud session is still on a temporary project. **The Create repo pill is still needed** — there is no `https://cursor.com/codebase/...` URL yet.

1. Open this agent thread in Cursor.
2. Click the **Create repo** pill (top of the agent / project view).
3. Name the private Origin repo **`cairose`** if Origin allows that name; otherwise accept the minted name and keep `package.json` / this README titled Cairose.
4. Keep the repo **private**.
5. After Origin finishes, the codebase URL looks like `https://cursor.com/codebase/<your-repo>` — paste that into Slack / Insights once it exists.
6. Clarity stays empty (`NEXT_PUBLIC_CLARITY_ID`) until that public/shareable URL exists.

Do not invent a codebase URL or a Clarity project ID before those exist.

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

Then `http://casa-limon.cairose.local:43147` rewrites to `/t/casa-limon` via `proxy.ts` (`PLATFORM_ROOT_DOMAIN=cairose.local`).

`/t/demo-amss` briefly redirects to `/t/casa-limon`. Seed and primary routes use **`casa-limon` only**.

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
| Custom event names | **TBD** — tracking plan later. Do not invent `clarity()` event names yet |
| Until ID exists | Leave the var empty; the app must run without Clarity |

Daniela pastes the real project ID into `.env.local` / host env when the public URL is ready.

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
