# DESIGN.md

## Brand Personality

PhotoSpace Denver is **Denver's creative production hub** — a real working studio built by
production professionals, since 2008. The brand is cinematic, editorial, and industrial-modern:
premium but approachable, technical without feeling cold. It should feel like the backstage of a
fashion campaign or a commercial set before call time — "serious productions happen here," not an
influencer fantasyland.

## Audience

- **Commercial & headshot photographers** needing a controlled, client-ready space.
- **Content creators / influencers** batching a month of content in one afternoon.
- **E-commerce & small brands** shooting product, founders, and social assets.
- **Agencies & brand teams** running multi-look campaign days.
- **Podcast / interview creators** recording multi-camera in a sound-dampened set.
- Plus gear-rental and production-services clients across Denver & the Front Range.

## Business Goal

Drive four conversions: **book the studio**, **book a tour**, **apply for membership**, and
**request an estimate**. Strategic priority is recurring **membership** revenue; hourly/half-day
bookings are the bread-and-butter. Secondary: local-SEO dominance and AI-search discoverability.

## Visual Direction

Hybrid **dark + light**: a matte-black cinematic base for immersive/hero sections, warm-white
editorial surfaces for dense reading (gear catalog, policies, FAQ). Restrained, weighted, premium.

- Palette: matte black `#0e0e0d`, graphite, charcoal, concrete/fog grays, warm white `#f6f4ef`;
  single restrained accent — **tungsten amber** `#c8842b`. No loud gradients, no startup-blue,
  no SaaS-purple, no glassmorphism.
- Tokens live in `src/app/globals.css` (`@theme`) and surface themes (`.surface-dark` / `.surface-light`).

## Typography

- **Display:** Fraunces (editorial serif) — hero/section headlines, tight leading, high contrast.
- **UI / body:** Geist (grotesk sans) — nav, pricing, specs, body, labels, eyebrows.
- Strong hierarchy, generous whitespace, constrained measure (`.measure`). Eyebrows are uppercase
  tungsten; one `<h1>` per page (via `PageHero` / homepage hero).

## Layout

Generous spacing, clean grids, strong dark/light section breaks, mobile-first. Cards only when they
aid comprehension (pricing, memberships, use-cases). Avoid clutter, unnecessary icons, overanimation,
generic SaaS gradients, fake metrics, low-contrast text, and cramped mobile sections.

## Motion

Subtle, premium, purposeful — section reveals (`Reveal`, Framer Motion), header transition, hover
states, and a paused-on-hover logo marquee. Respects `prefers-reduced-motion` (renders static). No
scroll-jacking, distracting parallax, or animated backgrounds that hurt readability.

## Components

Custom React/Tailwind components built in-project (per COMPONENT_SOURCES.md priority #3) — the
bespoke cinematic brand is not well served by stock library styling. Reusable section components
live in `src/components/sections/`; primitives in `src/components/ui/`. All business facts come from
`src/lib/content/*` — never hard-code NAP, pricing, or specs in components.
