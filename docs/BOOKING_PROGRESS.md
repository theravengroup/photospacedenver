# Booking System — Progress Log

A running log of meaningful changes. Append a new entry after every commit, design decision, or feature-pass flip. Newest first.

Format:
```
## YYYY-MM-DD — short title
- area: details
- commit: <sha> (if applicable)
- features flipped: <FEATURE-IDs> (if applicable)
- notes:
```

---

## 2026-05-30 — Phase 2 (booking brain) shipped end-to-end ✅
- area: phase-2 (pure logic + DB-aware modules + tests)
- new modules (server-only where DB/GCal is touched):
  - `types.ts` — shared booking types (PricingInput/Result, BusyWindow, AvailabilityResult, Coupon, MemberTier, …)
  - `appointment-types.ts` — Acuity ladder verbatim (12 entries incl. free tour)
  - `addons.ts` — 14 add-ons w/ duration-aware filter (covers the resolved 2-tier tech splits)
  - `pricing.ts` — pure: appointment + add-ons + member + coupon + payment-method → itemized cents
  - `slots.ts` — pure: range + duration + busy + buffer + lead + advance → labeled hourly slots
  - `coupons.ts` — server-only: code → discount via DB + per-user usage check + email allowlist (kills FAM* honor-system)
  - `member-hours.ts` — server-only: per-member rolling-30d bucket; getMemberHoursAvailable (read) + consumeMemberHours (write); retires the `2026MEMBERPS*` codes
  - `availability.ts` — server-only: parallel fetch of GCal + bookings + holds + manual_blocks + buffer + lead → AvailabilityResult
- deps + config: `vitest` 4.1 + `test` / `test:watch` scripts + `vitest.config.ts`
- tests: **41/41 pass** in `pricing.test.ts` + `slots.test.ts` — full Acuity ladder smoke, member free-hours (Spark/Creator/Visionary across full-coverage, partial-overage, exhausted-bucket, add-ons-not-discounted), coupon math (% + fixed-cents both capped), buffer enforcement, lead-time labeling, max-advance blocking, granularity alignment, line-items sum to total
- build + lint: ✅ green
- features flipped to passes:true (with documented test evidence): PRICE-001/002/003/006/007/008, ADDON-001/003, COUP-002, AVAIL-006, SEC-002
- left at passes:false (need DB/integration tests, or out-of-scope for v1): PRICE-004 (multi-day deferred), PRICE-005 (no surcharge per spec), ADDON-002 (no admin UI yet), COUP-001/003/004 (logic complete, need DB-integration test), AUTH-*/HOLD-*/PAY-*/CAL-*/APPR-*/POL-*/NOTIF-*/ADMIN-*/A11Y-*/PARA-* (later phases)
- next (Phase 3): holds + Stripe Embedded Elements payment + webhook + GCal write-back. Behind a feature-flag — Acuity remains live.

## 2026-05-30 — Phase 1 fully verified end-to-end ✅
- area: phase-1 verification
- migration applied to live Supabase via MCP `apply_migration` — 7 tables created, all RLS-enabled, advisor warning on `set_updated_at` fixed with pinned `search_path` (second migration `harden_set_updated_at_search_path`).
- bug found + fixed: original route at `/api/_booking/healthcheck` returned the 404 page because Next treats `_`-prefixed folders as private (excluded from routing). Renamed to `/api/booking/healthcheck`; token-gate keeps it private (commit `7ef46d8`).
- healthcheck against production returned `{ok:true, supabase:{ok:true, bookings_count:0}, gcal:{ok:true, busy_windows_next_24h:2}}` — both subsystems reachable; the GCal "2 busy windows" are existing Acuity events, which means parallel-test won't double-book over them.
- features flipped: **AVAIL-001 → passes:true** (GCal FreeBusy fetch verified against live calendar).
- residual advisor warnings: 1 pre-existing Supabase-installed `rls_auto_enable` SECURITY DEFINER function — not from our migration, leaving as-is.
- next (Phase 2): server-only pricing engine + server-only availability resolver, both with tests.

## 2026-05-30 — Phase 1.2: initial DB migration + integration smoke endpoint
- area: phase-1 scaffolding
- new: `supabase/migrations/20260530000001_init_booking.sql` — v1 schema (7 tables: bookings · holds · coupons · coupon_redemptions · manual_blocks · member_buckets · audit_log), all with RLS enabled + deny-anon stub policies (real customer-aware policies land in 1.3 with Auth). Indexes for availability + per-user coupon enforcement + member bucket lookups. `bookings.updated_at` auto-trigger.
- new: `src/app/api/_booking/healthcheck` — GET endpoint gated by `BOOKING_HEALTHCHECK_TOKEN`. Runs one Supabase HEAD query + one GCal FreeBusy call and returns 200 only if both connect. Internal-only (no UI surface).
- env added: `BOOKING_HEALTHCHECK_TOKEN` (Production). Local copy stashed at `.claude/booking-healthcheck-token` (gitignored).
- build + lint: ✅ green.
- pending Dan: **apply the migration** — either (a) Supabase CLI: `npx supabase link --project-ref yntydittiviajizolmqu && npx supabase db push`, or (b) open Supabase → SQL Editor → New query → paste the .sql file → Run.
- after migration applied: curl the healthcheck → both subsystems should report `ok:true` → that proves Phase 1 wiring works end-to-end.
- features flipped: none (still no end-to-end booking behavior — pricing/availability/holds come in Phase 2).

## 2026-05-29 — Phase 1.1: SDKs + client wrappers (scaffolding only)
- area: phase-1 scaffolding
- deps added: `@supabase/supabase-js` 2.106, `@supabase/ssr` 0.10, `googleapis` 173, `server-only` (build-time guard).
- new files:
  - `src/lib/supabase/admin.ts` — server-only service-role client (RLS-bypassing); throws if envs missing.
  - `src/lib/supabase/client.ts` — browser anon client via `@supabase/ssr` (cookie-ready for future auth).
  - `src/lib/google/calendar.ts` — service-account-authed Calendar client; surfaces `getFreeBusy`, `createEvent`, `updateEvent`, `cancelEvent`; America/Denver TZ baked in.
- not yet wired: no migrations, no routes, no UI — these modules are inert until imported by a route/handler.
- build + lint: ✅ green.
- features flipped: none (still no end-to-end behavior to test).
- next (Phase 1.2): initial Supabase migration (booking schema + RLS) + integration smoke-test endpoint to prove SDK connections.

## 2026-05-29 — All Phase-0 env vars wired in Production
- area: platform setup
- Supabase ✓ wired (URL + publishable key + secret key) — *new key format (`sb_publishable_*` / `sb_secret_*`); works identically to legacy anon/service_role*.
- Google Calendar ✓ wired (service-account JSON base64-encoded + Calendar ID = primary `hello@photospacedenver.com`, renamed "photospace: studio").
- All other env (Stripe, Resend, Turnstile, Blob) ✓ confirmed.
- ⛔ housekeeping pending Dan: (1) **rotate the Supabase secret key** — it was pasted in chat so transcript carries it; rotation is a 30-sec UI click. (2) **delete the local JSON** at `~/Desktop/photospace-booking-0dbcd10caef5.json`. (3) **confirm calendar share** to service-account email at "Make changes to events".
- Phase 0 is officially **closed** pending those 3 housekeeping items + Dan's green light to start Phase 1.

## 2026-05-29 — Phase 0 spec is closed
- area: discovery
- final answers: refund interp = full cash refund ≥72h with admin credit-override (Dan: "Yes OK"); **no deposits** ever (Dan: overrides /policies "50% over $3k" — page needs update); Digital Tech 1-5h = $575; Grip/Light Tech 1-5h = $475.
- Dan logged into Google Cloud (existing project "Google Review Slider" under photospacedenver.com org) — Dan chose to **create a fresh "photospace-booking" project** for clean separation (recommended).
- next: walk Dan through new-project creation → Calendar API enable → service account → key → calendar share → calendar ID → drop in Vercel.

## 2026-05-29 — Phase 0 effectively closed (3 tiny follow-ups left)
- area: discovery
- inputs received: all 10 open decisions answered + platform directions.
- decisions locked:
  - cyc paint lead time: **72 h** · Digital Tech: **2 tiers (1-5h + 6-12h $875)** · Grip/Light Tech: **2 tiers (1-5h + 6-12h $675)** · max advance: **90 days** · reminder: **24 h before** · multi-email intake: **keep** (with rationale) · processing fee: **passed to client (3% card / 1% ACH)** · calendar: **hello@photospacedenver.com** confirmed · refund: **OK per /policies (≥72h credit, <72h non-refundable rebookable 60d)** · member cycle boundary: **rolling 30 days from billing anchor** (best-practice recommendation).
  - platform: **Stripe Embedded Elements (themed)** · Supabase project ready · GCal needs walk-through.
- /policies cross-ref: 50% deposit required for rentals > $3k; 3% card fee / 1% ACH fee; 72h cancel window with rebookable 60d.
- 🆕 native interpretation captured in map: refund = full cash refund ≥72h (admin can override to credit); deposit flow for >$3k rentals (balance-later behavior TBD).
- still-open follow-ups (tiny — don't block Phase 1 start): Digital Tech 1-5h price, Grip/Light Tech 1-5h price, deposit-balance flow detail, member-specific cancel rules, refund-as-cash interpretation confirm.
- features flipped: none (no code yet).
- next: Dan completes GCal setup (walkthrough in conversation) → Supabase key handoff → Dan green-lights Phase 1.

## 2026-05-29 — Acuity migration: second batch — Phase 0 ~95% complete
- area: discovery
- inputs received: 5 more screenshots (Your Information, Confirmation, Reminder, Cancellation, Reschedule emails) + answers on coupons, calendar, availability, member benefits, customer data, top pain points.
- locked-in facts:
  - **Intake fields:** First name, Last name, Phone (intl), Email (comma-sep multi), Custom Gear Request (textarea), Policies checkbox. Drop Acuity's SMS opt-in line.
  - **Coupons (8 codes):** non-stackable. 3 member-tier (100% off honor-system), 1 owner (100% unlimited), 3 friends-family (100/40/20% unlimited, honor-system), 1 workshop (30%, 1-use-per-recipient unenforced).
  - **Calendar:** single Google Workspace calendar "photospace: studio" on hello@photospacedenver.com (typo "photospacenbver" assumed).
  - **Availability:** 24/7, 12h min self-book lead, 2h buffer, no holidays/closures. <12h-lead = request-only path.
  - **Customer data:** start fresh (no import).
  - **Member benefit:** 5/10/20 free studio hrs per cycle per tier — currently honor-system coupons; **must be enforced natively**.
  - **Pain points (top 3):** multi-day, add-on display/UX, membership enforcement.
- 🆕 design proposals captured in migration map:
  - Native coupon engine with **email-allowlist binding** (kills FAM* / WORKSHOP30 honor-system).
  - Native **member free-hours engine** (auto-applied per cycle; retires `2026MEMBERPS*` coupons entirely).
  - Refund policy summary surfaced inline at checkout per best practices.
  - Branded rebuild of all 4 transactional emails via Resend.
- still open (10 small decisions in migration map): 3 add-on discrepancies (carry-over), max-advance window, reminder timing, multi-email keep/drop, processing-fee pass-through, member-cycle boundary, calendar-account email typo confirm, refund-window specifics.
- features flipped: none.
- next: Dan resolves the 10 decisions → spec finalized → green-light Phase 1.

## 2026-05-29 — Acuity migration: first screenshot batch captured
- area: discovery
- inputs received: 4 Acuity screenshots — (1) Select Appointment list, (2) Date & Time / 2-hour, (3) Date & Time / 10-hour with all add-ons expanded, (4) Checkout.
- confirmed: full price ladder ($200/$295/$390/$485/$575/$665/$755/$840/$925×3), full add-on list (13 items), Stripe inline checkout with coupon field, full charge at booking, no tax line, hourly time-slot granularity, TZ = America/Denver, 4-step flow.
- discovered limitations: no native multi-day, no explicit overnight UX, add-on hour-range labels not enforced.
- discrepancies vs existing pricing-data.ts: (a) custom cyc paint lead time 72h (Acuity) vs 48h (native), (b) Studio Digital Tech tiers: 1 in Acuity vs 2 in native, (c) Grip/Light Tech hour range 6-12 (Acuity) vs 6-10 (native). 3 decisions logged in ACUITY_MIGRATION_MAP.md.
- still blocking: Your Information step screenshot, Acuity coupons admin, GCal config, business-hours config, confirmation/reminder/cancellation email copy, refund policy, member-rate handling, customer data export decision, top-3 pain points.
- features flipped: none (no code yet).
- next: receive remaining inputs → finalize ACUITY_MIGRATION_MAP.md → kick off `booking-architect` agent for domain model.

## 2026-05-29 — Planning phase started
- meta: Session goal accepted (replace Acuity with native flow, parallel test before sunset).
- docs: scaffolded `BOOKING_SYSTEM_SPEC.md`, `ACUITY_MIGRATION_MAP.md`, `BOOKING_FEATURE_LIST.json`, `BOOKING_PROGRESS.md`, `BOOKING_QA_CHECKLIST.md`.
- agents: plan drafted — 8 specialist roles + harness rules in `BOOKING_SYSTEM_SPEC.md`.
- blockers: waiting on Acuity screenshots + answers to the 18 questions in `ACUITY_MIGRATION_MAP.md` before architecture decisions are finalized.
- features flipped: none (everything `passes:false` by design).
- next: Dan provides Acuity inputs → `acuity-migration-analyst` agent fills migration map → `booking-architect` finalizes domain model.
