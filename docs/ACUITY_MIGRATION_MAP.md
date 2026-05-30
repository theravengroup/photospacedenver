# Acuity → Native — Migration Map

Reverse-engineered source of truth for how Acuity currently behaves on photospace Denver.

Legend: ⛔ TBD · ✅ captured · ⚠️ ambiguous · 🆕 native improvement opportunity

**Source-of-truth inputs received:**
- 2026-05-29 batch 1 — Select Appointment list · Date & Time (2h + 10h) · Checkout
- 2026-05-29 batch 2 — Your Information step · 4 transactional emails · Coupons list · Calendar config · Availability · Member benefits · Pain points · Customer-data decision
- 2026-05-29 batch 3 — 10 open decisions resolved + platform-direction inputs (Stripe Embedded Elements, Supabase ready, GCal walkthrough requested)

**Phase 0 status:** ✅ effectively closed — only 2 small tier-price sub-questions + the Google Calendar setup remain before Phase 1.

---

## Observed user flow

`Select Appointment` → `Date & Time` (add-ons + calendar + time slot) → `Your Information` (intake) → `Checkout` (Stripe card + coupon + Pay & Confirm). 4 linear steps. No basket / no edit-after-confirm.

## A. Appointment / session types — ✅ confirmed

| Acuity name | Duration | Base price | Notes |
|---|---|---|---|
| Studio Tour (free) | 20 min | $0 | Separate group at top |
| 2 Hours | 2 hr | $200 | Minimum hourly |
| 3 Hours | 3 hr | $295 | |
| 4 Hours | 4 hr | $390 | |
| 5 Hours (halfday) | 5 hr | $485 | Marketed as half-day |
| 6 Hours | 6 hr | $575 | |
| 7 Hours | 7 hr | $665 | |
| 8 Hours | 8 hr | $755 | |
| 9 Hours | 9 hr | $840 | |
| 10 Hours (full day) | 10 hr | $925 | Full-day cap begins |
| 11 Hours (full day) | 11 hr | $925 | Flat |
| 12 Hours (full day) | 12 hr | $925 | Flat |

Existing `src/lib/content/pricing-data.ts::ACUITY_LADDER` matches exactly.

## B. Intake fields ("Your Information") — ✅ confirmed

| Field | Type | Required | Native plan |
|---|---|---|---|
| First name | text | ✅ | keep |
| Last name | text | ✅ | keep |
| Phone | tel (intl, default +1) | ✅ | keep |
| Email | email (comma-separated multi) | ✅ | **KEEP** — Dan: "could be a photographer booking for their client and clients needs confirmation emails also, or a producer booking for a photographer." Send confirmation + reminder + cancel emails to **every** address listed. |
| Custom Gear Request | textarea | optional | keep (helper copy preserved) |
| ToS + SMS-consent checkbox | combo | ✅ | **drop SMS line** (Acuity-specific). Replace with our own ToS/Privacy. |
| Policies acceptance | checkbox | ✅ | keep — surface refund summary inline before checkbox |

## C. Add-ons — ✅ resolved (with 2 small tier-price follow-ups)

| Acuity label | Price | Native data — resolved |
|---|---|---|
| A. Strobe: Level One | $110 | ✅ keep |
| B. Strobe: Level Two | $180 | ✅ |
| C. Strobe: Level Three | $200 | ✅ |
| D. Strobe: Level Four | $270 | ✅ |
| E. Strobe: Level Pro | $300 | ✅ |
| F. Video Lighting: Level One | $135 | ✅ |
| G. Video Lighting: Level Two | $225 | ✅ |
| H. Video Lighting: Level Three | $375 | ✅ |
| I. Video Lighting: Pro | $575 | ✅ |
| Paint Cyc Wall (white) | $175 | ✅ |
| Paint Cyc Wall (custom color) | $600 | ✅ **72 hrs in advance** (resolved — was 48h in native; updated to 72h to match Acuity + Dan) |
| Studio Digital Tech | (per tier) | ✅ **2 tiers** — **1-5 hr (halfday) $575** + **6-12 hr (fullday) $875** |
| Studio Grip/Light Tech | (per tier) | ✅ **2 tiers** — **1-5 hr (halfday) $475** + **6-12 hr (fullday) $675** |

Add-ons configured INSIDE Acuity. Same list for every appointment duration. Native v1 will likely show tier dynamically based on selected appointment duration (e.g. a 2-hr booking only shows the 1-5h tier as the eligible option).

## D. Coupons — ✅ confirmed · Stackable: ❌ NO

| Code | Discount | Native enforcement |
|---|---|---|
| `2026MEMBERPS05` | 100% | **RETIRED in native** — replaced by member free-hours engine (§ O) |
| `2026MEMBERPS10` | 100% | RETIRED — § O |
| `2026MEMBERPS20` | 100% | RETIRED — § O |
| `DANJAHNOWNER` | 100% | Email-allowlist bound to Dan's email; unlimited |
| `FAM100` | 100% | Email-allowlist bound to Dan-supplied allowlist; unlimited per allowed user |
| `FAMFORTY` | 40% | Same — email-allowlist |
| `FAMTWENTY` | 20% | Same — email-allowlist |
| `WORKSHOP30` | 30% | `1_per_user` enforced by tracked email |

🆕 **Native coupon engine** = code + type (`percent`/`fixed`) + value + usage limits (`unlimited`/`n_total`/`1_per_user`/`n_per_user`) + optional `email_allowlist[]` + expiry + `applies_to[]` appointment types + per-redemption audit log + `stackable: false`.

## E. Calendar — ✅ confirmed

- **Single Google Workspace calendar** named **"photospace: studio"** on the Google account `hello@photospacedenver.com`.
- Native setup = Google Cloud service account → calendar shared with it at `Make changes to events` → calendar ID stored in env. See § Q for step-by-step.

## F. Business hours / availability — ✅ confirmed

- ✅ **24/7 availability** — no fixed business hours, no holidays, no recurring closures.
- ✅ **Min self-book lead time: 12 hours.**
- ✅ **<12h lead = request-only** (admin-approval path, as little as 2 hours).
- ✅ **2-hour buffer** between bookings (enforced server-side).
- ✅ **Slot granularity: hourly.**
- ✅ **Max advance booking: 90 days.**

## G. Confirmation language — ✅ captured (rebuild visually)

| Email | Trigger | Native plan |
|---|---|---|
| Confirmation | on payment success | Rebuild branded; real address `209 Kalamath St Unit 1, Denver CO 80223`; include policy + refund summary; send to **every** email in the intake (multi-email support). |
| Reminder | **24h before** booking start | Branded rebuild; same. |
| Cancellation | on cancel | Branded rebuild; include refund status (cash refund issued / non-refundable per policy). |
| Reschedule | on time change | Branded rebuild; show Old → New clearly. |

Acuity-isms to drop: `[call in info or location]`, "powered by Acuity Scheduling", reCAPTCHA, SMS opt-in line, "photosapce" typo.

## H. Cancellation / refund policy — ✅ resolved (per `/policies`)

From `/policies` § Cancellation & rescheduling:
- **≥72 hours before start time** → full credit on file (rebookable 60 days)
- **<72 hours** → non-refundable, but rebookable for up to 60 days
- **Members** → "more flexible window — full details in membership terms" (⛔ Dan to specify exact member rules when we wire member enforcement)

🆕 **Native interpretation for v1** (please confirm):
- **≥72h cancel:** full cash refund back to original card via Stripe (simpler than "credit on file"; admin can manually override to a credit instead if customer prefers). All hold + GCal event released.
- **<72h cancel:** no automatic refund; booking marked cancelled; admin has a button to issue a manual refund or rebook within 60 days; customer email explains "non-refundable per policy; reach out within 60 days to rebook."
- **Members:** v1 = admin discretion (no auto-policy variation); v2 can add member-specific rules.
- **Surface at checkout** (best practice): a 3-bullet inline policy summary right above the "I accept" checkbox, linking to `/policies` for full text.

## I. Payments — ✅ resolved

- ✅ **Stripe Embedded Elements** — use `@stripe/react-stripe-js` `<Elements>` + `<PaymentElement>` themed to match the photospace design system (already installed; keys in Vercel env).
- ✅ **No deposits — full rental cost billed at booking, every time** (Dan: overrides the /policies page text about "50% deposit for rentals over $3,000"). ⚠️ The site's `/policies` page still has the old deposit clause and should be updated separately so policy and behavior match.
- ✅ **Processing fee passed to customer at checkout**: **3% for card, 1% for ACH** (per `/policies`). Added as a line item ("Processing fee — 3%") on the order summary.
- ✅ **Coupon field** at checkout.
- ✅ **Spam protection:** Cloudflare Turnstile (already configured).
- ✅ No sales tax (Acuity didn't show one; not adding unless required).

## J. Multi-day — Dan's pain point #1 — **native v1 must solve**

Acuity has no multi-day. v1 = native multi-day booking + admin approval workflow.

## K. Overnight — implicit only today

Long bookings starting late span midnight. v1 should expose clearly.

## L. Limitations / Dan's top 3 pain points

1. No native multi-day.
2. Add-on display + UX should be better.
3. Membership free-hours not enforced — replace honor-system.

## M. Native v1 priorities (locked)

1. Real multi-day bookings + admin approval.
2. Better add-on display/UX (with duration-aware visibility).
3. Enforced member free-hours engine (§ O).
4. Coupon email-allowlist binding + per-user limits.
5. Member-aware pricing surfaced inline.
6. Refund policy summary inline at checkout.
7. Branded rebuilt transactional emails (via Resend, multi-recipient).

## N. Customer data import — ✅ start fresh

No historical Acuity import.

## O. Membership free-hours engine — ✅ resolved (cycle = billing anchor)

| Tier | Old coupon | Native bucket |
|---|---|---|
| Spark | `2026MEMBERPS05` | 5 free studio-hours / billing cycle |
| Creator | `2026MEMBERPS10` | 10 hrs / cycle |
| Visionary | `2026MEMBERPS20` | 20 hrs / cycle |

**Cycle boundary (recommended best practice):** **rolling 30 days from each member's billing-cycle anchor** (i.e. their subscription `current_period_start` → `current_period_end`). Rationale: matches `MEMBERSHIP_TERMS.billingCycleDays = 30`; matches how Stripe Subscriptions track periods; avoids unfair edge cases (someone signing up Jan 28 would otherwise get full 5 hrs for 3 days then 5 more on Feb 1 if calendar-month boundary). Industry standard for usage-based memberships.

Rules:
- Logged-in member's bucket auto-applies first to any booking's hours.
- Overflow hours billed at canonical (or member) rate.
- UI shows "X hrs free remaining this cycle, applied automatically."
- Cycle clock starts at membership Stripe-subscription `current_period_start`; resets on each renewal.
- The three `2026MEMBERPS*` codes are **retired** in native.

## P. 🆕 Native env vars / platform inventory

| Service | Status | Native env vars needed |
|---|---|---|
| Supabase | project ready, keys to generate | `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` · `SUPABASE_SERVICE_ROLE_KEY` (server-only) |
| Stripe | keys already in Vercel | (already in place) `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + `STRIPE_SECRET_KEY` + new `STRIPE_WEBHOOK_SECRET` (when we add the booking webhook) |
| Google Calendar | needs service account + calendar share (walk-through below) | `GOOGLE_SERVICE_ACCOUNT_KEY_B64` (base64-encoded JSON) · `GOOGLE_CALENDAR_ID` |
| Resend | live + verified domain | (already in place) `RESEND_API_KEY` · `INQUIRY_TO_EMAIL` · `INQUIRY_FROM_EMAIL` |
| Cloudflare Turnstile | live | (already in place) `NEXT_PUBLIC_TURNSTILE_KEY` · `TURNSTILE_SECRET_KEY` |

## Q. 🆕 Google Calendar setup — step-by-step (see assistant response for the walkthrough)

Dan walks the GCal owner (hello@photospacedenver.com) through:
1. Google Cloud project + enable Calendar API
2. Create service account → download JSON key
3. Share the "photospace: studio" calendar with the service-account email at `Make changes to events`
4. Grab the Calendar ID from "Integrate calendar"
5. Base64-encode the JSON key, paste into Vercel `GOOGLE_SERVICE_ACCOUNT_KEY_B64` (Production + Preview)
6. Paste Calendar ID into Vercel `GOOGLE_CALENDAR_ID`

---

## Remaining tiny follow-ups

All blocking items resolved 2026-05-29.

- ✅ Digital Tech 1-5h = **$575**
- ✅ Grip/Light Tech 1-5h = **$475**
- ✅ **No deposits** — full cost billed at booking (overrides /policies page; page needs separate update)
- ✅ **Refund interpretation:** ≥72h = full cash refund to original card via Stripe; admin can override to "credit on file" if customer requests
- ⛔ **Member-specific cancellation flexibility** — deferred to member-enforcement build (defaults to admin discretion until specified)
- ⛔ **/policies page** — Dan to update separately to remove the "50% deposit over $3,000" clause (site copy task, not blocking the booking system)

**Spec is closed.** Awaiting: (1) Dan's Google Cloud / GCal setup output (service-account JSON + Calendar ID), (2) Supabase keys, (3) green light → Phase 1 begins.
