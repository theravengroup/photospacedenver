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
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { PaymentMethod } from "@/lib/booking/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CheckoutBody = {
  appointmentTypeSlug?: string;
  startAt?: string;
  endAt?: string;
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

  const start = body.startAt ? new Date(body.startAt) : null;
  const end = body.endAt ? new Date(body.endAt) : null;
  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return NextResponse.json({ error: "invalid_dates" }, { status: 400 });
  }
  if (end.getTime() <= start.getTime()) {
    return NextResponse.json({ error: "end_before_start" }, { status: 400 });
  }

  // Duration must match the appointment type (prevents arbitrary windows).
  const actualHours = (end.getTime() - start.getTime()) / 3_600_000;
  if (Math.abs(actualHours - appt.hours) > 0.01) {
    return NextResponse.json({ error: "duration_mismatch" }, { status: 400 });
  }

  // Live availability re-check (vs. customer-side preview which may be stale)
  const availability = await checkAvailability({ start, end });
  if (!availability.available) {
    return NextResponse.json({ error: "not_available", availability }, { status: 409 });
  }
  if (availability.requiresApproval) {
    // <12h leads must go through the request-only path (multi-day modal today).
    return NextResponse.json(
      { error: "requires_approval", reasons: availability.reasons },
      { status: 409 },
    );
  }

  // Filter add-ons by duration eligibility, ignore unknown slugs
  const validAddons = addonsForDuration(appt.hours);
  const validSlugs = new Set(validAddons.map((a) => a.slug));
  const resolvedAddons = (body.addonSlugs ?? [])
    .filter((s) => validSlugs.has(s))
    .map((s) => addonBySlug(s)!)
    .map((a) => ({ slug: a.slug, label: a.label, priceCents: a.priceCents }));

  // Coupon (server-side recompute; never trust client total)
  let resolvedCoupon: { code: string; type: "percent" | "fixed"; value: number } | null = null;
  const preliminarySubtotal =
    appt.basePriceCents + resolvedAddons.reduce((s, a) => s + a.priceCents, 0);
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

  const pricing = calculatePricing({
    appointment: { slug: appt.slug, hours: appt.hours, basePriceCents: appt.basePriceCents },
    addons: resolvedAddons,
    member: null, // Phase 4
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
  if (pricing.totalCents === 0) {
    await sb.from("bookings").update({ status: "confirmed" }).eq("id", hold.bookingId);
    await sb.from("holds").delete().eq("id", hold.holdId);
    // Note: GCal write + emails happen via a manual reconciliation here OR (cleaner)
    // we trigger an internal "confirmed" handler. Phase 3 keeps this simple — call
    // out as a follow-up so the free-tour path still produces calendar event + email.
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
