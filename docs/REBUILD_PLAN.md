# PhotoSpace Denver — Rebuild Plan

> Pre-code planning deliverable. Produced **2026-05-28**, before any application code is written, per the project brief.
> Stack: **Next.js 16 (App Router) · React 19 · Tailwind 4 · TypeScript**, React Compiler on, deployed on **Vercel**.
> Canonical domain: **https://photospacedenver.com**. Legacy domain to fold in + redirect: **https://photospace.studio**.

This document covers brief deliverables **3–10**. Deliverables **1–2** (content inventories) live in:
- [`docs/audit/photospacedenver-inventory.md`](audit/photospacedenver-inventory.md) — old WordPress site (47 pages + 12 posts)
- [`docs/audit/photospace-studio-inventory.md`](audit/photospace-studio-inventory.md) — photospace.studio (homepage + `/apply`)

---

## 0. Strategic summary

**Two sites, one business, one location.** photospacedenver.com (WordPress) carries the operational depth: gear catalog, services, policies, rental process. photospace.studio (Next.js) carries the newer, premium, cinematic brand voice + reusable FAQ/JSON-LD/testimonials. The rebuild **marries the studio site's voice and polish with the WordPress site's depth**, under one canonical domain.

**Positioning:** *Denver's Creative Production Hub.* Five co-equal pillars — **Studio Rental · Memberships · Gear Rental · Podcast/Interview Studio · Production Services.** Studio rental and gear rental are the bread-and-butter; memberships are the strategic recurring-revenue play; hourly 2–4 hr bookings (commercial photographers, content creators, e-commerce, agencies, podcasters) are an explicit conversion focus.

**Design north star:** cinematic, editorial, industrial-modern, premium-but-approachable. Serif display + grotesk UI. Matte-black / charcoal / warm-white palette with restrained tungsten-amber accent. Motion is slow, weighted, intentional. "Real working studio," not influencer fantasyland. (Full system in §7.)

---

## 1. Confirmed business facts (single source of truth)

These become `src/lib/content/site-config.ts` + `studio-data.ts` + `pricing-data.ts`. **Items marked ⚠ need owner confirmation** (see §16).

**NAP / identity**
- Name: **PhotoSpace** (brand) / **PhotoSpace Denver** (trading). alternateName "PhotoSpace Studio".
- Address: **209 Kalamath St, Unit 1, Denver, CO 80223** — Sun Valley neighborhood; entrance around the corner on W 2nd Ave; off I-25, minutes from downtown.
- Phone: **(303) 284-6057** (`tel:+13032846057`)
- Email: ⚠ **canonical TBD** — old WP used `inquiries@` and `contact@photospacedenver.com`; studio used `hello@photospace.studio`. Recommend **hello@photospacedenver.com**.
- Hours: pickup/dropoff **Mon–Fri 8:30am–5:30pm by appointment**; studio bookable/accessible **24/7**; event venue 7am–midnight.
- Founded: **2008**. ⚠ ("20+ years experience" copy on location-scouting refers to owner experience, not company age — keep schema foundingDate 2008.)
- Owner: **Dan Jahn**. Team also references **John** (⚠ role TBD).
- Geo: lat **39.7339**, lng **-105.0096** (⚠ sanity-check). Instagram: instagram.com/photospacestudio.

**Studio specs**
- **2,400 ft² total**, **1,900 ft² shooting floor**, purpose-built (not a converted warehouse).
- **Real cyclorama wall — 20'w × 17'd × 15'h**, repainted between campaigns.
- Giant windows with **individually controllable blinds**; blackout capable.
- **8 × 20-amp dedicated circuits** (aluminum wall plates either side of cyc).
- Tether station: **Capture One, Lightroom, Phocus** (+ Resolve, Photoshop); second monitor in lounge for art directors; wired + WiFi.
- Backdrops: chroma green & blue muslin, seamless paper, white/black V-flats; **motor-controlled** backdrop system.
- Amenities: client lounge (sofa, monitor, espresso), entry "bookshop" (teak treads, leather chairs, editorial library), **working kitchen**, make-up station, changing room, **outdoor deck**, **load-in ramp**, **free parking** (unlimited side-street; 2-hr on Kalamath), sound dampening, 5-zone mini-split HVAC, **UniFi door access** (24/7).

**Pricing** (verbatim from audits)

| Item | Price |
|---|---|
| Studio hourly | **$100/hr**, 2-hr min, same rate 24/7 |
| Half day (5 hrs) | **$485** |
| Full day (10 hrs) | **$925** (Acuity caps 10–12 hrs at $925) |
| Acuity hourly ladder | 2h $200 · 3h $295 · 4h $390 · 5h $485 · 6h $575 · 7h $665 · 8h $755 · 9h $840 · 10–12h $925 |
| Studio Tour | **Free**, 20 min |
| Overtime | $65/hr (waived multi-day) |
| Cyc repaint | $150 labor + paint at cost |
| Event venue | $1,125/day (7am–midnight) |
| Membership extra hours | $65/hr |
| Camera cleaning | $95 (1-day) / $85 (2-day) / $75 (3-day) per kit; +$20/lens; +$25 large sensor; firmware $29 |
| Drone | Fly&Shoot $150/hr · Fly,You-Shoot $250/hr · Edited video $350/min · Retouched stills $125/img (+mileage) |
| ShootPod van | $175/day; 100 mi free then $0.55/mi; WiFi data $20–$125 |
| Studio lighting kits (book-online add-ons) | Strobe $110–$300 · Video $135–$375 |
| Card fee | ⚠ **3% vs 3.5%** (policies vs estimate form) — confirm. ACH 1%. |
| Multi-day rate | ⚠ **studio "4×" vs gear "3×" daily** — confirm rule per product |
| Deposit | 50% if rental > $3,000; min rental $100 |
| Full gear rate card | See WordPress inventory (cameras/flash/continuous/modifiers/grip/supplies/accessories — hundreds of line items) |

**Memberships** (monthly)

| Tier | Hrs/mo | Price | Effective $/hr | Positioning |
|---|---|---|---|---|
| **Spark** | 5 | $425 | $85 | "Perfect for starting out" |
| **Creator** | 10 | $895 | $89.50 | "Best balance" / most popular |
| **Visionary** | 20 | $1,495 | $74.75 | "Maximum access" |

All tiers: 24/7 private access · everything in standard rental · more Profoto strobes · more LED kits · modifiers · backdrops (incl. chroma) · fog/haze · discounted cameras/lenses + premium add-ons. Terms (from WP /memberships): billed every 30 days, **90-day minimum**, auto-renews until cancelled **in writing 30 days prior**, **hours don't roll over**. ⚠ Member hourly/add-on rates never published — confirm.

**Included with every studio rental:** strobe + continuous LED lighting, modifiers, grip, tether station. No setup fees, no equipment surcharges, no per-person crew fee.

**Cancellation (rentals):** full credit if ≥72 hrs out; inside 72 hrs non-refundable but rebookable 60 days; members more flexible.

**Brands carried (gear):** Profoto, Phase One, Hasselblad, Fujifilm, Canon, Nikon, Blackmagic, Sony, Sigma, Arri, Nanlux, Kino Flo, Aputure, Astera, Quasar, Creamsource, LitePanel, Lowel, Fiilex, Chimera, Westcott, SunBounce, Photek, Elinchrom, Bron, Matthews, Avenger, Manfrotto, Gitzo, Benro, PocketWizard, Zacuto, Wooden Camera, SmallHD, Zoom, Rode, Sennheiser, Comica, Azden, DJI, GoPro, Mevo, Eizo, Apple.

**Conversion infrastructure (existing):** Studio booking + tours = **Acuity Scheduling** (owner 20797727; `app.acuityscheduling.com/schedule/3ce2128a`). Membership = native `/apply` 4-step (info → agreement → e-signature → payment). Payments = **Stripe** (confirmed on /no-insurance). Door = UniFi Access. ⚠ Gear "studio quick-book" widget platform on old /book-online unconfirmed.

---

## 2. Information architecture / sitemap (deliverable 3)

21 canonical routes. **Pillar pages** in bold. SEO landing pages grouped. "Source" = where the content comes from.

| Route | Type | Purpose / H1 intent | Primary keyword | Primary CTA | Content source |
|---|---|---|---|---|---|
| `/` | **Hub** | Denver's Creative Production Hub — 5 pillars | production studio Denver | Book / Tour | both homepages |
| `/studio` | **Pillar** | The studio: specs, space, what's included | studio rental Denver | Check Availability | studio.studio + WP /studio |
| `/memberships` | **Pillar** | Membership sales page → apply | studio membership Denver | View Memberships / Apply | WP /memberships + studio |
| `/gear-rental` | **Pillar** | Gear catalog hub (7 categories) | gear rental Denver | Request an Estimate | WP /gear + subcats |
| `/podcast-studio-denver` | **Pillar/SEO** | Podcast & interview studio | podcast studio Denver | Book / Tour | NEW ⚠ |
| `/productions` | Pillar | Full-service production support | production services Denver | Request an Estimate | WP production-mgmt, shootpod, resources |
| `/services` | Hub | Services hub → detail pages | production services Denver | Request an Estimate | WP /services |
| `/pricing` | Conversion | All pricing in one place | studio rental pricing Denver | Book / Compare | pricing-data |
| `/book` | Conversion | Book the studio (Acuity) + how-to | book photo studio Denver | Check Availability | studio Acuity + WP how-to-rent/book-online |
| `/request-estimate` | Conversion | Gear/production estimate form | — (noindex form) | Submit estimate | WP estimate/request-estimate |
| `/photo-studio-rental-denver` | SEO landing | Photo studio intent | photo studio rental Denver | Book / Tour | studio specs |
| `/video-studio-rental-denver` | SEO landing | Video/film intent | video studio rental Denver | Book / Tour | studio specs |
| `/cyclorama-wall-denver` | SEO landing | Cyc wall intent | cyclorama wall Denver / cyc wall studio Denver | Book / Tour | cyc specs |
| `/product-photography-studio-denver` | SEO landing | Product/e-comm/food | product photography studio Denver | Book / Tour | studio + kitchen |
| `/content-creator-studio-denver` | SEO landing | Creator content days | content creator studio Denver | Book membership | studio + LifeSpace ⚠ |
| `/commercial-photo-studio-denver` | SEO landing | Brand/agency campaigns | commercial photo studio Denver | Book / Tour | client logos + studio |
| `/about` | Trust | Story, team (Dan/John), since 2008 | about PhotoSpace Denver | Book a Tour | WP internship/join + studio |
| `/contact` | Trust/local | NAP, map, directions, hours | PhotoSpace Denver location | Get directions / Call | WP /location (404 today) |
| `/faq` | Support/SEO | Reusable Q&A + rental FAQ | studio rental FAQ Denver | Book / Estimate | studio FAQ (12) + WP policies |
| `/policies` | Legal | Rental/studio/insurance/cancellation terms | — | — | WP policies/insurance/waiver |
| `/studio-facts` | AI/LLM | Plain structured facts page | — | — | all data (+ JSON export) |

**Service detail pages (recommendation, ⚠ decide §16):** keep individually for SEO equity — `/services/location-scouting`, `/services/production-management`, `/services/camera-cleaning`, `/services/drone-services`, `/services/retouching`. Each maps from an old WP URL with real keyword value (e.g. "drone services Denver", "camera cleaning Denver").

**Gear category anchors:** `/gear-rental` renders all 7 categories (cameras-lenses, flash, continuous, modifiers, grip, accessories, production-supplies) as in-page sections with `#anchors`; old `/gear/<cat>/` URLs 301 to `/gear-rental#<cat>`. (Alternative: real subroutes `/gear-rental/<cat>` — ⚠ decide; in-page is leaner, subroutes are stronger SEO. Recommend subroutes only if we have unique copy per category.)

**Footer/utility:** `/sitemap.xml`, `/robots.txt`, `/thank-you` (form success), legal sub-pages folded into `/policies` with `#anchors`.

---

## 3. Redirect map (deliverable 4) — all 301

Source of truth: `src/lib/content/redirect-map.ts`, consumed by `next.config.ts` `redirects()` (path-level) and `middleware.ts` (host-level for the legacy domain).

**A. photospacedenver.com path redirects (old WP → new)**

| Old | New (301) |
|---|---|
| `/studio/` | `/studio` |
| `/gear/` | `/gear-rental` |
| `/gear/cameras-lenses/` | `/gear-rental#cameras` |
| `/gear/flash-lighting/` | `/gear-rental#flash` |
| `/gear/continuous-lighting/` | `/gear-rental#continuous` |
| `/gear/lighting-modifiers/` | `/gear-rental#modifiers` |
| `/gear/grip/` | `/gear-rental#grip` |
| `/gear/production-supplies/` | `/gear-rental#production-supplies` |
| `/gear/photo-and-video-accessories/` | `/gear-rental#accessories` |
| `/shootpod/` | `/productions` |
| `/services/` | `/services` |
| `/location-scouting/` | `/services/location-scouting` |
| `/production-management/` | `/services/production-management` |
| `/camera-cleaning/` | `/services/camera-cleaning` |
| `/drone-services/` | `/services/drone-services` |
| `/retouching/` | `/services/retouching` |
| `/memberships/` | `/memberships` |
| `/membership-payment/` | `/memberships` |
| `/membership-conversation` | `/memberships` (old APPLY destination) |
| `/how-to-rent/` | `/book` |
| `/book-online/` | `/book` |
| `/estimate/` | `/request-estimate` |
| `/request-estimate/` | `/request-estimate` |
| `/booking/` | `/request-estimate` |
| `/register/`, `/registration-conversation`, `/registered/`, `/update-information/` | `/book` (account flow) ⚠ |
| `/location/` | `/contact` |
| `/policies/`, `/insurance/`, `/no-insurance/`, `/liability-waiver/`, `/privacy-statement-us/`, `/disclaimer/`, `/imprint/` | `/policies` (+ `#anchor`) |
| `/resources/` | `/productions` |
| `/lifespace/` | `/content-creator-studio-denver` ⚠ (or `/studio`) |
| `/internship/`, `/join/` | `/about` (⚠ `/join` is **crew recruitment**, NOT membership — do not send to /memberships) |
| `/workshops/`, `/workshop/`, `/workshop-casting/` | `/` (410 candidates; low value) |
| `/blog/` + 12 posts | `/` (410 candidates; salvage "Assistant Kit" only if desired) |
| `/mj-test/`, `/sitemap/`, `/opt-out-preferences/` | `/` / drop (junk/utility) |
| `/thank-you/` | keep as `/thank-you` |

**B. photospace.studio (legacy domain) → photospacedenver.com**
- Add `photospace.studio` + `www.photospace.studio` as domains on the Vercel project.
- `middleware.ts` (or Vercel domain redirect): if host is `(www.)photospace.studio` → **301 to `https://photospacedenver.com<mapped-path>`**.
  - `/` → `/studio` (the studio site is studio-centric; ⚠ alt: `/` homepage — recommend `/studio`)
  - `/apply` → `/memberships` (then to application)
  - `…/membership-application-photospace/` (dead) → `/memberships`
  - all other paths → `/`

**Rules:** never bulk-redirect to home where a specific page fits; preserve trailing-slash→no-slash; emit 410 only for confirmed-junk; keep a regression test asserting each old URL resolves.

---

## 4. Shared content / data model (deliverable 6)

All repeated facts come from typed modules — **no hard-coded pricing, phone, address, or business facts in components.** Under `src/lib/content/`:

| File | Exports | Notes |
|---|---|---|
| `site-config.ts` | `SITE` (name, domains, NAP, hours, geo, socials, founded, owner), `NAV`, `FOOTER`, `BOOKING` (Acuity URL, apply URL, Stripe), `SERVICE_AREAS` | canonical domain + metadataBase live here |
| `studio-data.ts` | `STUDIO` (sqft, cyc dims, circuits, amenities[], included[], tether stack, access) | feeds /studio, SEO pages, /studio-facts, schema amenityFeature |
| `pricing-data.ts` | `STUDIO_PRICING`, `ACUITY_LADDER`, `ADD_ONS`, `MEMBERSHIP_TIERS`, `SERVICE_PRICING`, `FEES` | feeds /pricing, /memberships, schema makesOffer |
| `gear-data.ts` | `GEAR_CATEGORIES[]` → items[] (name, brand, dailyRate?, kit?) | the full WP rate card; powers GearGrid + estimate |
| `service-pages.ts` | `SERVICES[]` (slug, title, h1, intro, bullets, pricing?, seo) | drives `/services/[slug]` from one template |
| `seo-pages.ts` | `SEO_LANDING[]` (slug, h1, intent copy blocks, faqs, relatedSlugs, schema) | drives the 6 high-intent landing pages from one template |
| `faqs.ts` | `FAQS[]` (q, a, tags) | studio's 12 + rental FAQs; powers /faq + FAQ schema |
| `testimonials.ts` | `TESTIMONIALS[]` (quote, name, role, company, featured?) | 11 attributed; ⚠ dedupe Lincoln/Paul; ⚠ usage permission |
| `clients.ts` | `CLIENTS[]` (name, logo) | 19 brand logos |
| `redirect-map.ts` | `REDIRECTS[]`, `LEGACY_HOST_REDIRECTS[]` | consumed by next.config + middleware + tests |
| `metadata.ts` | `pageMeta()` helper | builds per-page Metadata from a small input |

`/public/studio-facts.json` generated from `studio-data` + `pricing-data` (build script `scripts/gen-studio-facts.ts`, or a `/studio-facts.json` route) to prevent drift.

---

## 5. Shared component plan (deliverable 5)

Under `src/components/`. Every service & SEO page is composed from shared parts — **no one-off page layouts.**

**Layout / chrome:** `SiteHeader` (sticky, transparent→solid on scroll), `SiteFooter`, `MobileStickyCTA` (Book · Tour · Call), `Breadcrumbs`, `Container`, `Section`.

**Page sections:** `HeroSection` (home), `ServiceHero` (SEO/service pages, with breadcrumb + 1 H1), `SEOPageLayout` (wraps ServiceHero + body + RelatedPages + FAQ + FinalCTA), `PricingCards`, `MembershipCards`, `GearGrid` (category + items, from gear-data), `IncludedFeaturesGrid`, `StudioSpecsSection`, `TestimonialsSection`, `ClientLogoWall`, `FAQSection` (renders + emits FAQ schema), `ImageGallery` (cinematic reveal), `VideoEmbedSection`, `RelatedPagesSection`, `FinalCTASection`.

**CTAs (shared, tracked):** `BookingCTA`, `TourCTA`, `EstimateCTA`, `Button` (variants). All CTAs carry `data-cta-location`, `data-cta-type`, `data-page`, `data-service` (see §11).

**SEO/schema (server components emitting JSON-LD):** `OrganizationSchema`, `LocalBusinessSchema` (+ ProfessionalService), `ServiceSchema`, `BreadcrumbSchema`, `VideoObjectSchema`, `FAQSchema`. One `<JsonLd data={…}/>` primitive; typed builders in `src/lib/schema.ts`. **No AggregateRating / fake reviews.**

---

## 6. (reserved)

---

## 7. Design system

Translates the brief's mood/type/color/motion into tokens (replaces the current warm-paper light theme in `globals.css`).

**Theme:** ⚠ **decide dark-dominant vs light-with-cinematic-dark-sections.** Brief mood ("matte black, backstage darkness, monitor light, cinematic haze") leans **dark-dominant**; existing premium studio site is warm-light. Recommendation: **dark-dominant hero/immersive sections + light editorial reading sections** (hybrid), or commit fully dark. Needs sign-off.

**Color tokens:** `--ink` matte black `#0E0E0D` · `--graphite` `#1B1916` · `--charcoal` `#2A2723` · `--concrete` `#6B6358` · `--fog` `#B7AFA2` · `--paper`/warm-white `#F6F4EF` · accents `--tungsten` muted amber `#C8852B`-ish · `--bronze` · `--studio-red` (sparingly). No loud gradients, no startup-blue, no SaaS-purple, no glassmorphism overload.

**Type:** Headline editorial **serif** (recommend **Fraunces** — free, variable, optical sizing; paid upgrade path: PP Editorial New / Canela). Body/UI **grotesk sans** (recommend **Geist** — already installed; alt Inter/Satoshi; paid: Suisse Intl / Neue Montreal). Large cinematic headlines, tight line-height, strong whitespace, high-contrast hierarchy, constrained measure. ⚠ Confirm fonts (licensing).

**Motion:** add **`motion`** (Framer Motion) for orchestrated, weighted reveals + slow parallax + crossfades; keep CSS for marquees. Rules: support hierarchy not distract, slower durations, natural easing, no bounce/spin/float, respect `prefers-reduced-motion`. Don't hide important content behind animation-only interactions.

**Anti-references (hard avoid):** coworking/WeWork, influencer selfie studio, Peerspace-listing cheapness, template agency, SaaS dashboard, neon/gamer, EDM/nightclub, hustle-culture, Gen-Z playful, fake luxury, AI-generic modernism, blobs, oversized rounded corners, thin-gray unreadable type, fake handwriting, autoplay audio.

---

## 8. SEO metadata plan (deliverable 7)

Per-page `generateMetadata()` via `pageMeta()` helper → unique **title**, **meta description**, **canonical**, **OG title/description/image**, **Twitter card**. Rules: exactly **one H1**, clean heading hierarchy, descriptive `alt` on every image, internal links to related pages, breadcrumbs, structured data where appropriate. Dynamic OG image route (`app/[…]/opengraph-image.tsx`) per template, like the studio site's generated 1200×630.

**Primary keyword targets** (page → target): see §2 table. Plus: photo studio rental Denver, video studio rental Denver, cyclorama/cyc wall studio Denver, podcast studio Denver, product photography studio Denver, commercial photo studio Denver, content creator studio Denver, studio membership Denver, gear rental Denver, production studio Denver.

**Reusable assets to carry over:** studio site's title pattern, meta description, keyword set, 12-item FAQ, and 9 JSON-LD blocks (high-value SEO equity). **No thin pages** — every SEO landing page gets unique intent copy, real proof (logos/testimonials/specs), and its own FAQ subset + related-pages block.

`sitemap.ts` lists all canonical routes (rebuild the existing one); `robots.ts` allows all, points to sitemap.

---

## 9. Schema plan (deliverable 9)

JSON-LD via reusable components, **matching visible content**:
- **Organization** + **LocalBusiness/ProfessionalService** — site-wide (in layout or home), with PostalAddress, GeoCoordinates, openingHoursSpecification (M–F pickup + 24/7 studio), priceRange `$$`, areaServed Denver+Colorado, amenityFeature[] (from studio-data), makesOffer[] (from pricing-data), parentOrganization.
- **Service** — one per service detail + SEO landing page (photo/video/commercial/content/product/podcast studio rental, location scouting, drone, etc.), provider → #business.
- **BreadcrumbList** — every non-home page.
- **FAQPage** — `/faq` + any page with a FAQ block.
- **VideoObject** — only where real video is embedded.
- **Event/Article** — only if workshops/blog actually return.
- **Do NOT** add AggregateRating/Review without a compliant verified source. No invented ratings.

---

## 10. AI / LLM discovery (deliverable 8)

- `/studio-facts` — plain, highly readable, structured facts page: business name, exact location, service area, studio overview + size, cyc details, rental types, hourly/half/full rates, membership tiers, included amenities + gear, add-ons, parking, load-in, booking + tour process, policies summary, ideal use cases, contact, and links to every major page.
- `/public/studio-facts.json` — machine-readable export of the same, generated from shared data. For future internal AI/retrieval tools. No other gimmicky AI-SEO files.

---

## 11. Conversion & analytics plan (deliverables 11 & 15)

**Four primary actions:** Book studio · Book tour · Apply for membership · Request estimate.

**CTA labels:** Check Availability · Book the Studio · Book a Studio Tour · View Memberships · Request an Estimate · Compare Rental Options.

**Data attributes on every CTA/form:** `data-cta-location`, `data-cta-type`, `data-page`, `data-service`.

**Mobile sticky CTA bar:** Book · Tour · Call (`tel:`).

**Analytics:** do **not** install new analytics unless infra exists (⚠ none found — confirm). Prepare for GA4 / Google Ads / Meta Pixel / Microsoft Clarity via a single `<Analytics/>` slot + clean data attributes. Recommended events: `view_pricing`, `click_book_studio`, `click_book_tour`, `click_call`, `click_email`, `start_booking`, `submit_booking`, `view_memberships`, `start_membership_application`, `submit_membership_application`, `request_estimate`, `submit_contact_form`.

**Booking/forms backend (⚠ key decision §16):** Studio booking → keep **Acuity** embed on `/book` (holds the 2–12 hr ladder + free Tour). Membership → port `/apply` (info→agreement→e-sign→payment) or link to existing. Estimate/register/contact forms need a destination — recommend **Next.js Route Handler + Resend** (transactional email) or a form service; payments via **Stripe** (already in use). Confirm.

---

## 12. Membership page plan (deliverable 12)

`/memberships` is a **sales page first**, not a legal application. Sections: hero + value prop → tier comparison (Spark/Creator/Visionary, included hours, **effective $/hr**, 24/7 access) → who it's for / who it's not → what's included (gear, access, discounts) → how billing works (30-day billing, **90-day minimum** ⚠, auto-renew, no rollover) → member expectations → FAQ → final CTA. The `/apply` flow (agreement + e-signature + payment) stays separate or embeds **below** the explained offer.

---

## 13. Content & tone direction (deliverable 13)

Premium · clear · local · commercial · creator-friendly. Concrete over vague: "1,900 ft² shooting floor," "cyclorama wall," "included lighting and grip," "24/7 member access," "free parking," "load-in ramp," "content days," "walk in and shoot." **Banned phrases:** creative playground, game-changing, unlock your creativity, take it to the next level, state-of-the-art (unless spec-backed). Frame around **outcomes** ("Shoot an entire month of content in one afternoon," "Production-ready studio for fast commercial shoots") — especially for the 2–4 hr segments (commercial photographers, content creators, e-commerce, agencies, podcasters). Reuse the studio site's "Four Frames" and "Built for the work" voice. **Lean away from mini-sessions** (dilutes premium positioning) ⚠.

---

## 14. Technical requirements (deliverable 14)

`next/image` everywhere (pull real studio/gear photos from WP media + reuse studio site `-scaled.webp` assets). Real anchor links for nav (crawlable). Semantic HTML, keyboard nav, labeled form controls, focus-visible, sufficient contrast (watch dark-theme thin type), reduced-motion support. Core Web Vitals: server components by default, minimal client JS, font `display: swap`, sized images, avoid layout shift. Rebuild `sitemap.ts` + `robots.ts`. No content hidden behind animation-only interaction.

---

## 15. Implementation sequence (deliverable 9)

**Phase 1 — Foundation:** `src/lib/content/*` data modules + `site-config`; design tokens in `globals.css`; fonts; `SiteHeader`/`SiteFooter`/`Container`/`Section`; `redirect-map.ts` → `next.config.ts` redirects + `middleware.ts` legacy-host redirect; `sitemap.ts` + `robots.ts`; schema primitives + Org/LocalBusiness.

**Phase 2 — Core pages:** `/` (5-pillar hub) · `/studio` · `/pricing` · `/memberships` · `/gear-rental`. Shared section + CTA components built here.

**Phase 3 — SEO surface:** 6 high-intent landing pages (one template, `seo-pages.ts`) · `/services` + `/services/[slug]` · `/productions` · `/podcast-studio-denver` · `/about` · `/contact` · `/faq` · `/policies` · `/studio-facts` + JSON · per-page schema + internal linking + breadcrumbs.

**Phase 4 — Conversion:** `/book` (Acuity) · `/request-estimate` (form + backend) · membership apply · `MobileStickyCTA` · CTA data attributes + analytics-ready slot.

**Phase 5 — QA:** `npm run lint`, typecheck, `npm run build`; redirect regression tests; one-H1 / metadata / broken-link / image / schema validation; mobile + sticky-CTA + form accessibility pass; Lighthouse/CWV check. Final report (files/pages/components/redirects/schema/metadata/commands/TODOs/manual-confirm list).

> **Checkpoint:** owner sign-off on this plan + the §16 confirmations **before Phase 1 coding begins.**

---

## 16. Risks & unknowns — needs owner confirmation (deliverable 10)

> **Resolved 2026-05-28 (owner):** Theme = **hybrid dark + light**. Fonts = **Fraunces (display) + Geist (UI/body)**, free. Booking/forms = **reuse Acuity embed + native /apply + Resend serverless email + Stripe**. Build proceeds on plan defaults; unconfirmed business facts (items 11–16, 19) ride as visible `TODO`s in code + a running list, surfaced for owner resolution before launch. Items 1–10 are settled by the above + plan recommendations.

**Design decisions**
1. **Theme:** dark-dominant vs light-with-dark-cinematic-sections (hybrid).
2. **Fonts:** confirm headline serif (Fraunces free vs PP Editorial/Canela paid) + body sans (Geist vs Suisse/Neue Montreal paid) — licensing.
3. **Motion library:** approve adding `motion` (Framer Motion).

**Functional / integrations**
4. **Studio booking:** keep Acuity embed (recommended) vs build native.
5. **Forms backend:** where do estimate/register/contact submissions go? (Recommend Route Handler + Resend + Stripe.) Is there an existing rental SaaS to integrate? Old `/book-online` widget platform unconfirmed.
6. **Membership `/apply`:** port the native 4-step (agreement + e-signature + payment) or keep existing? Payment processor on it?
7. **Analytics:** no existing analytics infra found — confirm GA4/Ads/Pixel/Clarity IDs (or "prepare only").
8. **Gear rate card:** publish full per-item daily prices on `/gear-rental` (transparency, SEO) vs gate behind estimate? (Recommend publish.)
9. **Service detail pages:** keep 5 individual SEO pages (recommended) vs one hub.
10. **Gear categories:** in-page anchors vs real subroutes.

**Business facts (conflicts to resolve)**
11. **Canonical email** (recommend hello@photospacedenver.com).
12. **Card fee 3% vs 3.5%.**
13. **Multi-day rate: studio 4× vs gear 3×** — confirm per product.
14. **Member hourly + add-on rates** (never published).
15. **Membership terms** (90-day min / auto-renew / no rollover still current? full legal text from `/apply` agreement).
16. **Founding year 2008** for schema/About; "John" team role.

**Content gaps**
17. **Podcast/interview studio:** does turnkey podcast lighting/audio/sets exist yet, or is `/podcast-studio-denver` aspirational? Affects how concretely it's written.
18. **LifeSpace / lifestyle sets:** launch now as `/content-creator-studio-denver`, fold into `/studio`, or omit?
19. **Testimonials & client logos:** confirm permission to reuse; dedupe Lincoln Phillips / Paul Trantow identical quote.
20. **Images:** floor-plan PDF + studio/gear photos must be pulled from WP media library (JS-lazy, not captured) before the WP site is decommissioned; reuse studio site `-scaled.webp` assets.
21. **Mini-sessions:** confirm excluded from positioning (recommended).
22. **Workshops/blog:** 410 the stale set, or salvage "Assistant Kit" as an evergreen resource?
