# Booking System — QA Gate Checklist

This is the **launch gate**. The native flow does **not** replace Acuity until every box here is signed off (date + initials) and every feature in `BOOKING_FEATURE_LIST.json` is `passes:true`.

Use `[x]` to sign off; add date + initials in the trailing comment.

---

## A. Concurrency & data integrity
- [ ] Two browsers attempting to hold the same slot at the same instant — exactly one succeeds <!-- date / initials -->
- [ ] Hold expiry actually releases the slot (cron + lazy cleanup both verified)
- [ ] No two `confirmed` bookings ever overlap on the same resource (DB constraint or exclusion index verified)
- [ ] Approval flow (`pending_approval`) does not silently double-block availability
- [ ] DST forward + DST back tested for hourly bookings crossing the boundary

## B. Pricing trust
- [ ] Pricing endpoint recomputes from canonical inputs only (no client-supplied totals trusted)
- [ ] Coupon application recomputed server-side before Stripe intent created
- [ ] Tamper test: client sends modified amount → server still charges canonical amount
- [ ] Round-trip total in confirmation email matches DB row matches Stripe charge

## C. Payments
- [ ] Stripe webhook signature verified; unsigned/garbage request → 400, no DB write
- [ ] Webhook handler idempotent (same event id replayed → no duplicate booking, no duplicate email)
- [ ] Failed payment → hold released, no orphan `pending_payment` rows after TTL
- [ ] Refund (full + partial) reflected in DB + email
- [ ] Test card flows (3DS, declined, insufficient funds) all degrade gracefully

## D. Calendar integration
- [ ] Confirmed booking → GCal event appears with title, time, customer, notes
- [ ] Cancel → GCal event removed (or marked cancelled)
- [ ] GCal API outage → booking still completes; sync queued with admin alert
- [ ] Manual GCal event (external) — FreeBusy still blocks our flow from double-booking it

## E. Auth & RLS
- [ ] Customer A cannot read Customer B's bookings (RLS verified with anon key)
- [ ] Non-admin cannot read/write `manual_blocks`, `coupons`, admin-only tables
- [ ] Admin role enforced via Supabase Auth claim, not URL or header
- [ ] Service-role key absent from any client bundle (`grep` build output)

## F. Secrets & data handling
- [ ] No secret keys in `NEXT_PUBLIC_*` env (`grep -r NEXT_PUBLIC_ src/`)
- [ ] Emails contain no card details, no full PII beyond name/email/booking summary
- [ ] Logs redact email + phone (or omit)
- [ ] No customer PII in Sentry/console errors

## G. Accessibility
- [ ] Booking flow operable with keyboard only (Tab/Shift+Tab/Enter/Esc)
- [ ] Calendar grid: arrow-key navigation, aria-labels, focus visible
- [ ] All form errors announced via aria-live region
- [ ] Color contrast ≥ AA on every state (idle, hover, error, disabled)
- [ ] Modals trap focus + restore on close

## H. Resilience
- [ ] Supabase outage → graceful "try again" UI, no orphan Stripe charges
- [ ] Stripe outage → user sees real message, hold preserved up to TTL
- [ ] GCal outage → booking completes, sync retried
- [ ] Resend outage → email queued; admin notified of delivery failures

## I. Admin tooling
- [ ] Admin can create a manual block that immediately removes availability
- [ ] Admin can refund a booking; customer sees update + email
- [ ] Admin can edit add-on prices; new bookings reflect new prices; in-flight holds keep their locked price
- [ ] Audit log records who-did-what-when on every admin mutation

## J. Notifications
- [ ] Customer confirm email sent within 30s of payment
- [ ] Admin notify email sent within 30s of payment
- [ ] 24h reminder sent at the right local time (`America/Denver`)
- [ ] Cancellation email reflects refund status correctly

## K. Parallel-test gate (must pass before Acuity sunset)
- [ ] ≥5 real end-to-end bookings via native flow while Acuity remained live
- [ ] Zero double-bookings observed during the parallel-test window
- [ ] No customer complaints / no support escalations from parallel-test bookings
- [ ] All confirmation/cancellation emails delivered to test recipients
- [ ] Stripe + GCal + DB triple-reconciled (every confirmed booking matches every Stripe charge matches every GCal event)

## L. Cutover
- [ ] Acuity left live, but its public link removed from site navigation
- [ ] Native flow promoted to primary booking entry point
- [ ] Two-week observation period with both systems available
- [ ] Final sunset of Acuity scheduled + announced internally
