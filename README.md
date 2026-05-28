# PhotoSpace Denver

Marketing + conversion site for **PhotoSpace Denver** — "Denver's creative production hub": studio
rental, memberships, gear rental, podcast/interview production, and production services. This is the
canonical site that consolidates the former `photospace.studio` into `photospacedenver.com`.

Built and maintained by **The Raven Group**.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript** · **Tailwind CSS 4**
- Fonts: **Fraunces** (display) + **Geist** (UI/body) · animation: **Framer Motion** (`motion`)
- Deployed on **Vercel**

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in keys as needed (all optional for local dev)
npm run dev                  # http://localhost:3000
```

Scripts: `npm run dev` · `npm run build` · `npm run start` · `npm run lint` · `npm run typecheck`.

## Project structure

```
src/
  app/                 # routes (pages, route handlers, sitemap/robots/OG/icons)
    [slug]/            # 7 high-intent SEO landing pages (from seo-pages.ts)
    services/[slug]/   # 5 service detail pages (from service-pages.ts)
    api/inquiry/       # form submission handler (Resend)
  components/
    ui/ layout/ sections/ cta/ forms/   # reusable, mostly server components
  lib/
    content/           # SINGLE SOURCE OF TRUTH for all business facts
    schema.ts          # JSON-LD builders
  proxy.ts             # legacy photospace.studio -> canonical 301s
docs/                  # REBUILD_PLAN, REBUILD_REPORT, audit/
public/images/         # studio + gear photography
```

## Content model

**All business facts live in `src/lib/content/*`** (NAP, pricing, studio specs, gear catalog, services,
SEO pages, FAQs, testimonials, clients, redirects). Never hard-code these in components. Change a fact
once, it propagates everywhere — including `/studio-facts` and `/studio-facts.json`.

## Environment

See [`.env.example`](.env.example). Forms work without keys locally (accepted + logged); set
`RESEND_API_KEY` in production to deliver email. Analytics and Stripe are env-gated and inert until set.

## Standards & docs

- `CLAUDE.md`, `DESIGN.md`, `COMPONENT_SOURCES.md`, `SECURITY_RULES.md` — project + TRG standards
- [`ROADMAP.md`](ROADMAP.md) — current status and what's next
- [`docs/REBUILD_REPORT.md`](docs/REBUILD_REPORT.md) — what was built and open TODOs

## Deploy

Pushing to `main` deploys to Vercel. Add `photospace.studio` (+ `www`) as project domains so the
legacy-domain redirect (`src/proxy.ts`) fires in production.
