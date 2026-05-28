# PhotoSpace Denver — Rebuild Report

> Final report for the ground-up rebuild + consolidation of photospace.studio into photospacedenver.com.
> Date: 2026-05-28 · Stack: Next.js 16 (App Router, Turbopack) · React 19 · Tailwind 4 · TypeScript · Vercel.
> Plan: [`docs/REBUILD_PLAN.md`](REBUILD_PLAN.md) · Audits: [`docs/audit/`](audit/).

## 1. Files changed

- **Config:** `next.config.ts` (301 redirects from redirect-map), `package.json` (+`motion`, +`typecheck` script), `.gitignore` (+`!.env.example`), **new** `.env.example`.
- **App shell:** `src/app/layout.tsx` (Fraunces + Geist, config-driven metadata, site-wide schema, header/footer/sticky/analytics), `src/app/globals.css` (hybrid dark+light token system), `src/proxy.ts` (legacy-domain 301), `sitemap.ts`, `robots.ts`, `opengraph-image.tsx` + `icon.tsx` + `apple-icon.tsx` (re-branded, Node runtime).
- **Removed:** the entire prior `src/app/(home)/` route group (20 components + 7 data files) — superseded; all useful content extracted into the new data layer.
- **New:** `src/lib/content/*` (12 modules), `src/lib/schema.ts`, 30+ components, 20+ route files (below), `docs/*`.
- **Filled:** `DESIGN.md` with the real PhotoSpace brand (was an empty TRG template).

## 2. Pages created (37 prerendered routes)

- **Core:** `/` (5-pillar hub), `/studio`, `/pricing`, `/memberships`, `/gear-rental`.
- **SEO landing (one template, `/[slug]`):** `/photo-studio-rental-denver`, `/video-studio-rental-denver`, `/cyclorama-wall-denver`, `/product-photography-studio-denver`, `/content-creator-studio-denver`, `/commercial-photo-studio-denver`, `/podcast-studio-denver`.
- **Services:** `/services` + `/services/[slug]` → location-scouting, production-management, drone-services, camera-cleaning, retouching.
- **Trust/support:** `/productions`, `/about`, `/contact` (with map), `/faq`, `/policies`.
- **Conversion:** `/book` (Acuity embed), `/request-estimate` (form), `/memberships/apply` (form).
- **AI/LLM:** `/studio-facts` (human) + `/studio-facts.json` (machine, static).
- **Infra routes:** `/api/inquiry` (form handler), `sitemap.xml`, `robots.txt`, OG/icon images.

## 3. Components created

- **ui/**: Container, Section (dark/light surfaces), Button (+ tracked CTA attrs, submit/disabled), Breadcrumbs, Reveal (Framer Motion, reduced-motion aware).
- **layout/**: SiteHeader (sticky, dropdowns, mobile menu), SiteFooter, MobileStickyCTA (Book·Tour·Call).
- **sections/**: PageHero, SectionHeading, SpecList, PricingCards, MembershipCards, IncludedGrid, GearGrid, Testimonials, ClientLogoWall, UseCaseGrid, Steps, FaqList, FinalCTA, RelatedPages.
- **cta/**: BookingCTA, TourCTA, EstimateCTA, MembershipCTA. **forms/**: Fields (+ Checkbox, Honeypot), InquiryForm. Plus JsonLd, Analytics.

## 4. Redirects created (all 301)

- **~40 old WordPress paths** → new routes via `src/lib/content/redirect-map.ts` → `next.config.ts`. Bare paths emit a clean 301; trailing-slash URLs normalize then 301 (verified resolving to 200). Gear subcategories map to `#anchors`; legal pages to `/policies#anchor`; junk to `/`. Notably `/join/` → `/about` (crew recruitment, **not** membership).
- **Legacy domain:** `(www.)photospace.studio/*` → `photospacedenver.com` via `src/proxy.ts` — `/`→`/studio`, `/apply`→`/memberships`, else `/` (verified 301).

## 5. Schema added (JSON-LD, via `src/lib/schema.ts` + `<JsonLd>`)

- **Organization** + **LocalBusiness/ProfessionalService** (site-wide, in layout) with PostalAddress, GeoCoordinates, opening hours, amenityFeature[], makesOffer[] (studio + membership offers), areaServed.
- **BreadcrumbList** on every interior page.
- **Service** on studio, memberships, gear-rental, productions, all 7 SEO pages, all 5 service pages.
- **FAQPage** on /faq and every page with a FAQ block. No AggregateRating/Review (no verified source) — per the brief.

## 6. SEO metadata added

Per-page unique title, meta description, canonical, Open Graph, and Twitter cards via `pageMeta()`; layout sets defaults + template + branded dynamic OG image. One `<h1>` per page (verified), clean heading hierarchy, breadcrumbs, internal linking (RelatedPages, cross-links). Forms (`/request-estimate`, `/memberships/apply`) are `noindex`. Sitemap lists all canonical routes; robots allows all + points to sitemap.

## 7. Commands run

- `npm install motion` — Framer Motion for restrained reveals (user-approved; powers the site-wide reveal system, not a one-off flourish; reduced-motion respected).
- `npm run lint` → **clean**. `npm run typecheck` (`tsc --noEmit`, added) → **clean**. `npm run build` → **clean, 37 static pages**.
- `npm audit` → 2 moderate, both a **transitive `postcss` advisory inside Next.js's own dependency** (`node_modules/next/node_modules/postcss`); the only offered fix downgrades Next to 9.3.3 (destructive) — **not actionable**, left as-is pending an upstream Next patch.
- Smoke tests: `/api/inquiry` (valid → ok; missing field → 422; honeypot → dropped), redirect chains → 200, `/studio-facts.json` → 200 JSON, homepage console → 0 errors. Browser QA (desktop + mobile) on home/studio/estimate.

## 8. Known TODOs

- **Images** — no photography yet; sections are designed to look intentional without it (type/space/hairlines), and the logo wall renders brand names as type. Pull studio/gear photos + the floor-plan PDF from the WP/studio media libraries (studio site has full-res `-scaled.webp` assets) and drop into `/public/images/` + the client logos into `/public/images/clients/`.
- **Membership payment + e-signature** — `/memberships/apply` collects the application and emails it; native agreement e-sign + Stripe payment is a follow-up (needs keys + decision). Marked `TODO(Stripe + e-sign)`.
- **Email delivery** — set `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL` in production (see `.env.example`); forms accept + log without it today.
- **Analytics** — prepared but inert; set `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_CLARITY_ID` / `NEXT_PUBLIC_META_PIXEL_ID` to activate. CTA/form `data-*` attributes are already in place.
- **Vercel** — add `photospace.studio` (+ www) as domains so the proxy host-redirect fires in production.
- Optional: single-hop 301s for trailing-slash legacy URLs (currently 308→301) via `skipTrailingSlashRedirect` + catch-all if desired; per-page dynamic OG images.

## 9. Content needing manual confirmation (do not invent)

Flagged in code as `TODO(confirm)` and in [`REBUILD_PLAN.md`](REBUILD_PLAN.md) §16:

1. **Canonical email** (used `hello@photospacedenver.com`).
2. **Card processing fee** — 3% vs 3.5% (used 3%).
3. **Multi-day rate** — studio "4×" vs gear "3×" daily.
4. **Member hourly + premium add-on rates** (never published).
5. **Membership terms still current?** — 90-day minimum, auto-renew, no rollover.
6. **Founding year 2008** for schema/About; **"John"** team role.
7. **Podcast/interview** — is a turnkey podcast offering real, or aspirational? (`/podcast-studio-denver` copy is conservative.)
8. **Testimonials** — permission to reuse the 10 attributed quotes; the Lincoln Phillips / Paul Trantow duplicate was dropped (kept Lincoln).
9. **Client logos** — marks/permission for the 19 brands.
10. **LifeSpace / lifestyle sets** — currently redirected to `/content-creator-studio-denver`; confirm direction.
11. **Mini-sessions** — excluded from positioning (per owner steer); confirm.
12. **Geo coordinates** (39.7339, -105.0096) — sanity-check.

## 10. Verification status

✅ Lint · ✅ Typecheck · ✅ Build (37 static pages, 0 warnings) · ✅ Redirects resolve to 200 · ✅ Legacy-host 301 · ✅ Form API (validation + honeypot) · ✅ JSON export · ✅ One H1/page · ✅ Mobile + sticky CTA · ✅ 0 console errors. Conforms to the TRG Master Design, Animation, Component, and Security standards.
