# PhotoSpace Denver — Roadmap

Status as of **2026-05-28**. The ground-up rebuild + photospace.studio consolidation is **complete and
deployed** (commit `d506c05` on `main`). Detail: [`docs/REBUILD_REPORT.md`](docs/REBUILD_REPORT.md) ·
plan: [`docs/REBUILD_PLAN.md`](docs/REBUILD_PLAN.md).

## Done

- [x] Audit of both legacy sites → [`docs/audit/`](docs/audit/)
- [x] Centralized content layer (`src/lib/content/*`) — single source of truth for all business facts
- [x] 37 prerendered routes (core pillars, 7 SEO landing pages, 5 service pages, trust + conversion pages)
- [x] Hybrid dark+light design system (Fraunces + Geist, tungsten accent), reduced-motion-aware
- [x] ~40 WordPress 301s + legacy `photospace.studio` domain redirect (`src/proxy.ts`)
- [x] JSON-LD (Organization/LocalBusiness/Service/Breadcrumb/FAQ), per-page metadata + branded OG, sitemap/robots
- [x] Conversion: Acuity booking embed, estimate + membership forms → `/api/inquiry`, mobile sticky CTA
- [x] `/studio-facts` + `/studio-facts.json` for AI/search discovery
- [x] Green: lint · typecheck · build (0 warnings) · committed + pushed

## Before / at launch

- [ ] **Photography** — pull studio + gear photos and the floor-plan PDF from the legacy media libraries
      (the studio site has full-res `-scaled.webp` assets); 9 gear photos already in `public/images/`.
      Wire into `PageHero`, gallery, gear, and OG. *(biggest visible gap)*
- [ ] **Resend** — set `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL` in Vercel so form
      submissions actually email (today they're accepted + logged). See [`.env.example`](.env.example).
- [ ] **Vercel domains** — add `photospace.studio` (+ `www`) to the project so the legacy 301 fires in prod.
- [ ] **Confirm business facts** (flagged `TODO(confirm)`): canonical email, card fee (3% vs 3.5%),
      multi-day rate (3× vs 4×), member rates, membership terms still current, founding year, "John" role,
      whether the podcast offering is real, testimonial/logo permission. See REBUILD_REPORT §9.

## Next

- [ ] **Membership payment + e-signature** — native `/apply` agreement → e-sign → Stripe (keep keys server-side
      per SECURITY_RULES; verify webhooks). Today `/memberships/apply` collects + emails the application.
- [ ] **Analytics** — set `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_CLARITY_ID` / `NEXT_PUBLIC_META_PIXEL_ID`;
      CTA/form `data-*` hooks are already in place.
- [ ] **Per-page dynamic OG images** (currently one branded default).
- [ ] **Accessibility + Lighthouse pass** on the deployed build; consider `trg-production-readiness`.

## Growth

- [ ] Expand the gear catalog from the full audited rate card (hundreds of SKUs in
      `docs/audit/photospacedenver-inventory.md`).
- [ ] Build out the podcast/interview offering once turnkey lighting/audio/sets are confirmed.
- [ ] Resources/blog for SEO equity (only the evergreen "Assistant Kit" post is worth salvaging).
- [ ] Decide LifeSpace / lifestyle sets (today → `/content-creator-studio-denver`).
- [ ] Conversion experiments on the four primary CTAs.

## Conventions (keep)

- All business facts live in `src/lib/content/*` — never hard-code NAP, pricing, or specs in components.
- Follow `DESIGN.md`, `COMPONENT_SOURCES.md`, `SECURITY_RULES.md` and the shared TRG standards.
