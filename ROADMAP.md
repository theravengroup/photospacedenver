# PhotoSpace Denver — Roadmap

Status as of **2026-05-28**. The ground-up rebuild + photospace.studio consolidation is **built and
deployed** to https://photospacedenver.vercel.app. Work lands directly on `main`; pushing `main`
auto-deploys production. Plan: [`docs/REBUILD_PLAN.md`](docs/REBUILD_PLAN.md) ·
report: [`docs/REBUILD_REPORT.md`](docs/REBUILD_REPORT.md).

> **Not cut over yet:** `photospacedenver.com` still serves the old WordPress site. The new build lives
> at the Vercel alias until the domain is pointed.

## Done

- [x] Audit of both legacy sites → [`docs/audit/`](docs/audit/)
- [x] Centralized content layer (`src/lib/content/*`) — single source of truth for all business facts
      (NAP, pricing, specs)
- [x] **Two-lane IA** — Studio + Gear as co-equal lanes; production services removed.
      Nav: Studio · Gear · Memberships · Pricing
- [x] **42 prerendered routes**, including a dynamic `/[slug]` route → 14 landing pages
      (7 gear categories + 7 studio SEO pages). Studio SEO pages stay live for SEO — linked from the
      footer and `/studio`, intentionally out of the top nav
- [x] **Full gear catalog** transcribed from the legacy WP rate card into grouped, per-item priced
      catalogs (`gear-data.ts`)
- [x] Hybrid dark+light design system (Fraunces + Geist, tungsten accent), reduced-motion-aware
- [x] **All 4 legacy Gravity Forms rebuilt natively**, posting to `/api/inquiry`:
      `/request-estimate`, `/register` (renter vetting → staff email, no public auth),
      `/no-insurance` (Stripe manual-capture card hold), `/insurance` (COI requirements + upload)
- [x] **Integrations wired:** Resend email (graceful log-fallback), Cloudflare Turnstile on every form,
      private Vercel Blob uploads (`/api/blob/upload`), Stripe card hold (`/api/stripe/hold`),
      Acuity booking embed
- [x] **Real "shot here" gallery** — 18 images wired into `/studio` (replaced the portfolio placeholders)
- [x] ~40 WordPress 301s + legacy `photospace.studio` domain redirect (`src/proxy.ts`)
- [x] JSON-LD (Organization/LocalBusiness/Service/Breadcrumb/FAQ), per-page metadata + branded OG,
      sitemap/robots
- [x] `/studio-facts` + `/studio-facts.json` for AI/search discovery
- [x] Green: lint · typecheck · build (Next 16, 0 warnings) · committed + pushed

## Before / at launch

- [ ] **Domain cutover** — add `photospacedenver.com` (+ `www`) and `photospace.studio` (+ `www`) to the
      Vercel project, then point DNS so the new build and the legacy 301s go live
- [ ] **Env keys → Preview + verify on deploy** — Stripe / Turnstile / Resend keys are set
      **Production-only** and are **Sensitive** (they pull back empty, so they can't be tested from
      pulled env locally). Add them to Preview so preview/PR deploys work, and verify each integration on
      a deployed build. Turnstile must allow the current host (`photospacedenver.vercel.app`)
- [ ] **Confirm Resend is sending** — set/verify `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`,
      `INQUIRY_FROM_EMAIL` in Production (today submissions are accepted + logged if unset)
- [ ] **Confirm business facts** (flagged `TODO(confirm)`): canonical email, card fee %, multi-day rate,
      member rates/terms, founding year, "John" role, whether the podcast offering is real,
      testimonial/logo permission. See REBUILD_REPORT §9
- [ ] **Remaining photography** — gear and OG imagery still lean on placeholder/stock in places; pull real
      assets where the now-wired studio gallery isn't already covering

## Next

- [ ] **Membership payment + e-signature** — `/memberships/apply` still collects + emails the application;
      wire the agreement → e-sign → Stripe (keep keys server-side per SECURITY_RULES; verify webhooks).
      The `/no-insurance` card hold already proved the Stripe path
- [ ] **Analytics** — set `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_CLARITY_ID` / `NEXT_PUBLIC_META_PIXEL_ID`;
      CTA/form `data-*` hooks are already in place
- [ ] **Per-page dynamic OG images** (currently one branded default)
- [ ] **Accessibility + Lighthouse pass** on the deployed build; consider `trg-production-readiness`

## Growth

- [ ] Expand the gear catalog further from the full audited rate card
      (`docs/audit/photospacedenver-inventory.md`)
- [ ] Build out the podcast/interview offering once turnkey lighting/audio/sets are confirmed
- [ ] Resources/blog for SEO equity (only the evergreen "Assistant Kit" post is worth salvaging)
- [ ] Conversion experiments on the primary CTAs

## Conventions (keep)

- All business facts live in `src/lib/content/*` — never hard-code NAP, pricing, or specs in components.
- Two-lane IA: don't reintroduce production services or menu-link the studio SEO pages.
- Follow `DESIGN.md`, `COMPONENT_SOURCES.md`, `SECURITY_RULES.md` and the shared TRG standards.
