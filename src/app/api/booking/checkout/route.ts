/**
 * POST /api/booking/checkout
 *
 * Server-authoritative booking creation. Recomputes EVERY price input
 * server-side (never trusts client-supplied totals), runs the availability
 * check, atomically creates a hold + a `pending_payment` booking row,
 * creates a Stripe PaymentIntent keyed by the booking id (idempotent), and
 * returns the client_secret for Stripe Elements to mount on the client.
 *
 * Phase 3 — no UI yet. This route is callable via curl / Postman / a
 * forthcoming public booking form.
 */

import { NextResponse } from "next/server";
import { appointmentTypeBySlug } from "@/lib/booking/appointment-types";
import { addonBySlug, addonsForDuration } from "@/lib/booking/addons";
import { calculatePricing } from "@/lib/booking/pricing";
import { checkAvailability } from "@/lib/booking/availability";
import { resolveCoupon } from "@/lib/booking/coupons";
import { createBookingHold } from "@/lib/booking/holds";
import { createBookingPaymentIntent } from "@/lib/booking/stripe";
import { confirmBooking } from "@/lib/booking/confirm";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getCurrentMember } from "@/lib/supabase/server";
import { getMemberHoursAvailable } from "@/lib/booking/member-hours";
import type { PaymentMethod, MemberTier } from "@/lib/booking/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CheckoutBody = {
  appointmentTypeSlug?: string;
  startAt?: string;
  endAt?: string;
  /** For multi-day: YYYY-MM-DD start + end dates (interpreted in Denver). */
  multiDayStartDate?: string;
  multiDayEndDate?: string;
  addonSlugs?: string[];
  couponCode?: string | null;
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  customerAdditionalEmails?: string[];
  customerPhone?: string;
  customGearRequest?: string | null;
  paymentMethod?: PaymentMethod;
  policiesAccepted?: boolean;
};

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  // Required-field guard
  if (
    !body.customerFirstName?.trim() ||
    !body.customerLastName?.trim() ||
    !body.customerEmail?.trim() ||
    !body.customerPhone?.trim()
  ) {
    return NextResponse.json({ error: "missing_required_fields" }, { status: 400 });
  }
  if (!body.policiesAccepted) {
    return NextResponse.json({ error: "policies_not_accepted" }, { status: 400 });
  }

  const appt = body.appointmentTypeSlug
    ? appointmentTypeBySlug(body.appointmentTypeSlug)
    : undefined;
  if (!appt) {
    return NextResponse.json({ error: "invalid_appointment_type" }, { status: 400 });
  }

  const isMultiDay = appt.slug === "multi-day";

  // Resolve the window: multi-day uses date range (Denver midnight bounds);
  // hourly uses the startAt/endAt timestamps as provided.
  let start: Date | null = null;
  let end: Date | null = null;
  if (isMultiDay) {
    if (!body.multiDayStartDate || !body.multiDayEndDate) {
      return NextResponse.json({ error: "missing_multi_day_dates" }, { status: 400 });
    }
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(body.multiDayStartDate) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(body.multiDayEndDate)
    ) {
      return NextResponse.json({ error: "invalid_multi_day_dates" }, { status: 400 });
    }
    start = denverMidnight(body.multiDayStartDate);
    end = denverMidnight(body.multiDayEndDate, /*addDay*/ 1);
  } else {
    start = body.startAt ? new Date(body.startAt) : null;
    end = body.endAt ? new Date(body.endAt) : null;
  }
  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return NextResponse.json({ error: "invalid_dates" }, { status: 400 });
  }
  if (end.getTime() <= start.getTime()) {
    return NextResponse.json({ error: "end_before_start" }, { status: 400 });
  }

  // Hourly: duration must match appointment type. Multi-day: skipped — the
  // range is the booking.
  if (!isMultiDay) {
    const actualHours = (end.getTime() - start.getTime()) / 3_600_000;
    if (Math.abs(actualHours - appt.hours) > 0.01) {
      return NextResponse.json({ error: "duration_mismatch" }, { status: 400 });
    }
  }

  // Live availability re-check (vs. customer-side preview which may be stale).
  // Multi-day uses the same code path — the buffer + lead-time + max-advance
  // rules apply across the entire range.
  const availability = await checkAvailability({ start, end });
  if (!availability.available) {
    return NextResponse.json({ error: "not_available", availability }, { status: 409 });
  }
  if (availability.requiresApproval) {
    return NextResponse.json(
      { error: "requires_approval", reasons: availability.reasons },
      { status: 409 },
    );
  }

  // Filter add-ons by duration eligibility, ignore unknown slugs.
  // Multi-day skips add-ons entirely in v1 (custom requests go in the notes
  // field; admin can append crew/lighting after the fact).
  const resolvedAddons = isMultiDay
    ? []
    : (() => {
        const validAddons = addonsForDuration(appt.hours);
        const validSlugs = new Set(validAddons.map((a) => a.slug));
        return (body.addonSlugs ?? [])
          .filter((s) => validSlugs.has(s))
          .map((s) => addonBySlug(s)!)
          .map((a) => ({ slug: a.slug, label: a.label, priceCents: a.priceCents }));
      })();

  // Coupon (server-side recompute; never trust client total)
  let resolvedCoupon: { code: string; type: "percent" | "fixed"; value: number } | null = null;
  const preliminaryBase = isMultiDay
    ? (await import("@/lib/booking/multi-day")).countBillableDays(
        body.multiDayStartDate!,
        body.multiDayEndDate!,
      ).subtotalCents
    : appt.basePriceCents;
  const preliminarySubtotal =
    preliminaryBase + resolvedAddons.reduce((s, a) => s + a.priceCents, 0);
  if (body.couponCode) {
    const res = await resolveCoupon({
      code: body.couponCode,
      customerEmail: body.customerEmail,
      appointmentTypeSlug: appt.slug,
      subtotalCents: preliminarySubtotal,
    });
    if (!res.ok) {
      return NextResponse.json({ error: "coupon_invalid", reason: res.reason }, { status: 400 });
    }
    resolvedCoupon = {
      code: res.coupon.code,
      type: res.coupon.type,
      value: res.coupon.value,
    };
  }

  // Resolve the authenticated member (if any) + their remaining hours
  // server-side. Same rule as quote — never trust a client-claimed tier.
  // The actual consumption happens later in confirmBooking (which re-reads
  // the member from the row's customer_email at confirm time), so we don't
  // need to thread the member email through the hold here.
  let memberInput: { hoursAvailable: number; tier: MemberTier } | null = null;
  try {
    const member = await getCurrentMember();
    if (member) {
      const balance = await getMemberHoursAvailable({
        memberEmail: member.email,
        tier: member.tier,
      });
      memberInput = { hoursAvailable: balance.hoursAvailable, tier: member.tier };
    }
  } catch (err) {
    console.warn("[checkout] member lookup failed (continuing as non-member):", err);
  }

  const pricing = calculatePricing({
    appointment: { slug: appt.slug, hours: appt.hours, basePriceCents: appt.basePriceCents },
    multiDay: isMultiDay
      ? { startDateISO: body.multiDayStartDate!, endDateISO: body.multiDayEndDate! }
      : undefined,
    addons: resolvedAddons,
    member: memberInput,
    coupon: resolvedCoupon,
    paymentMethod: body.paymentMethod ?? "card",
  });

  // Atomic hold + booking row
  const hold = await createBookingHold({
    appointmentTypeSlug: appt.slug,
    startAt: start,
    endAt: end,
    customer: {
      firstName: body.customerFirstName.trim(),
      lastName: body.customerLastName.trim(),
      email: body.customerEmail.trim(),
      additionalEmails: body.customerAdditionalEmails ?? [],
      phone: body.customerPhone.trim(),
      customGearRequest: body.customGearRequest ?? null,
    },
    pricing,
    policiesAcceptedAt: new Date(),
  });

  if (!hold.ok) {
    const status = hold.reason === "db_error" ? 500 : 409;
    return NextResponse.json({ error: hold.reason }, { status });
  }

  const sb = supabaseAdmin();

  // $0 bookings (free tour, 100%-off coupon, etc.) skip Stripe and confirm immediately.
  // confirmBooking() handles status flip + hold consumption + GCal write + emails —
  // the same side-effects the webhook fires for paid bookings.
  if (pricing.totalCents === 0) {
    const result = await confirmBooking({ bookingId: hold.bookingId });
    if (!result.ok) {
      return NextResponse.json(
        { error: "confirm_failed", details: result.reason },
        { status: 500 },
      );
    }
    return NextResponse.json({
      ok: true,
      requiresPayment: false,
      bookingId: hold.bookingId,
      total: 0,
    });
  }

  // Stripe PaymentIntent (idempotency key = booking id, so retries are safe)
  let intent: { id: string; clientSecret: string };
  try {
    intent = await createBookingPaymentIntent({
      amountCents: pricing.totalCents,
      bookingId: hold.bookingId,
      customerEmail: body.customerEmail.trim(),
      description: `${appt.label} — photospace Denver`,
      metadata: { appointment_slug: appt.slug, start_at: start.toISOString() },
    });
  } catch (err) {
    // Roll back: delete the booking + hold so the slot is freed
    await sb.from("bookings").delete().eq("id", hold.bookingId);
    return NextResponse.json(
      { error: "stripe_error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }

  // Persist intent id so the webhook can find the booking
  await sb
    .from("bookings")
    .update({ stripe_intent_id: intent.id })
    .eq("id", hold.bookingId);

  return NextResponse.json({
    ok: true,
    requiresPayment: true,
    bookingId: hold.bookingId,
    holdId: hold.holdId,
    expiresAt: hold.expiresAt.toISOString(),
    clientSecret: intent.clientSecret,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    total: pricing.totalCents,
    pricing,
  });
}

/** YYYY-MM-DD (interpreted in America/Denver) → UTC Date at local midnight. */
function denverMidnight(dateISO: string, addDay = 0): Date {
  const [y, m, d] = dateISO.split("-").map(Number);
  const utcMidnight = Date.UTC(y, m - 1, d + addDay);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    timeZoneName: "shortOffset",
    year: "numeric",
  });
  const parts = fmt.formatToParts(new Date(utcMidnight));
  const off = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT-7";
  const match = /GMT([+-]\d+)/.exec(off);
  const hoursOffset = match ? Number(match[1]) : -7;
  return new Date(utcMidnight - hoursOffset * 60 * 60 * 1000);
}
