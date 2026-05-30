# Native Booking System — Spec

**Status:** Planning · awaiting Dan's approval before any code work
**Replaces:** Acuity Scheduling (run in parallel until QA passes)
**Timezone (canonical):** `America/Denver`
**Tech baseline:** Next.js 16 (App Router) · TypeScript · Tailwind · Supabase · Stripe · Google Calendar API · Resend · Vercel

---

## 1. Purpose

Move studio bookings off Acuity onto a native flow that we fully own — so we can extend pricing, add-ons, coupons, holds, approval workflows, calendar logic, and admin tooling without Acuity's limits.

## 2. Scope (in)

- Public booking flow for the photo/video studio
  - Hourly bookings
  - Full-day bookings
  - Overnight bookings (spans midnight)
  - Multi-day bookings (with approval)
- Server-priced add-ons (lighting kits, assistants, paint cyc, etc.)
- Server-priced assistance (digital techs, grip/light techs)
- Coupons (codes, fixed or percent, expiry, usage limits)
- Stripe payment (Checkout or PaymentIntent, decided in design phase)
- Google Calendar availability (FreeBusy read) + write-back (event create/update/cancel)
- Supabase Postgres database (bookings, holds, coupons, add-ons, blocks, users)
- Admin dashboard (auth-gated; manage bookings, blocks, pricing, coupons, approvals)
- Temporary holds with TTL (e.g. 15 min) during checkout
- Approval workflow (multi-day + admin-only types)
- Explicit policy acceptance gate before payment
- Transactional email (confirm, admin notify, reminder, cancel)

## 2a. Scope (out — for now)

- Gear-rental checkout (gear is its own quote flow)
- SMS reminders (could add later via Twilio)
- Customer self-serve reschedule UI (admin-driven first)
- Recurring/standing bookings for members (handled by membership system)

## 3. Constraints / non-negotiables

- All pricing recomputed **server-side** on every state change; client prices are display-only.
- Availability resolved **server-side** against GCal + DB holds + DB confirmed bookings; never trust client.
- All times normalized to `America/Denver` and stored as `timestamptz` in UTC.
- Stripe webhook signatures **verified**; secret keys only in server env.
- Service-role Supabase key **never** reaches the browser.
- Customer PII not logged.
- RLS on every table; customers see only their own bookings.
- Idempotency: Stripe webhook handler + booking creation both idempotent.
- Acuity stays live until the native flow passes QA and parallel tests.

## 4. Personas / roles

| Role | Capabilities |
|---|---|
| Anonymous visitor | Browse availability, start a booking, complete payment as guest |
| Customer (authenticated) | Same as anon + view their bookings |
| Admin | Everything: see all bookings, create manual blocks, manage coupons/add-ons/pricing, approve multi-day requests, refund/cancel |

## 5. High-level architecture

```
Browser
  └── Next.js (App Router) — public booking UI + admin UI
       ├── Server Actions / Route Handlers (pricing, hold, intent, webhook)
       ├── Supabase (Postgres + Auth + RLS) — bookings, holds, coupons, add-ons, blocks
       ├── Stripe (Checkout or PaymentIntent) — payment + webhooks
       ├── Google Calendar API (service account) — FreeBusy + event CRUD
       └── Resend — confirm/admin/reminder/cancel emails
```

## 6. Booking lifecycle (states)

`draft` → `held` → `pending_payment` → `confirmed`
                              ↘ `pending_approval` → `confirmed` (multi-day)
`confirmed` → `cancelled` (refund per policy)
Any → `expired` (hold TTL elapsed without payment)

## 7. Key invariants

- A confirmed booking has exactly one paid Stripe charge or recorded comp.
- No two confirmed bookings overlap on the same resource.
- A `held` row blocks new holds for the same window but does not appear on the calendar.
- `pending_approval` does not block availability for paid customers? **OPEN — confirm with Dan.**
- All event durations end-exclusive; midnight handled correctly for overnight.

## 8. Open questions

Tracked in `ACUITY_MIGRATION_MAP.md` (Section: Questions for Dan / Acuity screenshots).

## 9. Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-05-29 | Goal accepted, planning phase started | Dan set session goal |
| 2026-05-29 | TZ = America/Denver canonical | Single source of truth, no client TZ math |
| 2026-05-29 | Parallel-run with Acuity until QA passes | Zero-downtime cutover |

## 10. Acceptance / done-ness

The system is "done" when **every feature in `BOOKING_FEATURE_LIST.json` has `passes: true`**, every gate in `BOOKING_QA_CHECKLIST.md` is signed off, and at least **5 real bookings** have been completed end-to-end through the native flow without incident while Acuity was also live.
