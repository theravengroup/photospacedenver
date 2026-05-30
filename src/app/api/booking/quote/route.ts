/**
 * POST /api/booking/quote
 *
 * Public, read-only pricing + availability preview. Never writes to the DB.
 * Used by the future booking UI to show the customer an itemized total
 * before they commit. The numbers shown here are advisory; /checkout
 * recomputes everything server-side before charging.
 */

import { NextResponse } from "next/server";
import { appointmentTypeBySlug } from "@/lib/booking/appointment-types";
import { addonBySlug, addonsForDuration } from "@/lib/booking/addons";
import { calculatePricing } from "@/lib/booking/pricing";
import { checkAvailability } from "@/lib/booking/availability";
import { resolveCoupon } from "@/lib/booking/coupons";
import type { PaymentMethod } from "@/lib/booking/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type QuoteBody = {
  appointmentTypeSlug?: string;
  startAt?: string;
  endAt?: string;
  addonSlugs?: string[];
  couponCode?: string | null;
  customerEmail?: string | null;
  paymentMethod?: PaymentMethod;
};

export async function POST(req: Request) {
  let body: QuoteBody;
  try {
    body = (await req.json()) as QuoteBody;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const appt = body.appointmentTypeSlug
    ? appointmentTypeBySlug(body.appointmentTypeSlug)
    : undefined;
  if (!appt) return NextResponse.json({ error: "invalid_appointment_type" }, { status: 400 });

  const start = body.startAt ? new Date(body.startAt) : null;
  const end = body.endAt ? new Date(body.endAt) : null;
  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return NextResponse.json({ error: "invalid_dates" }, { status: 400 });
  }

  // Filter add-ons by duration eligibility (tech tiers); ignore unknown slugs.
  const validAddons = addonsForDuration(appt.hours);
  const validSlugs = new Set(validAddons.map((a) => a.slug));
  const resolvedAddons = (body.addonSlugs ?? [])
    .filter((s) => validSlugs.has(s))
    .map((s) => addonBySlug(s)!)
    .map((a) => ({ slug: a.slug, label: a.label, priceCents: a.priceCents }));

  // Availability (so the UI knows if the slot is even bookable)
  const availability = await checkAvailability({ start, end });

  // Preliminary subtotal for coupon math
  const preliminarySubtotal =
    appt.basePriceCents + resolvedAddons.reduce((s, a) => s + a.priceCents, 0);

  // Coupon resolution requires an email (allowlist + per-user limits hinge on it)
  let resolvedCoupon: { code: string; type: "percent" | "fixed"; value: number } | null = null;
  let couponError: string | null = null;
  if (body.couponCode) {
    if (!body.customerEmail) {
      couponError = "missing_customer_email_for_coupon";
    } else {
      const res = await resolveCoupon({
        code: body.couponCode,
        customerEmail: body.customerEmail,
        appointmentTypeSlug: appt.slug,
        subtotalCents: preliminarySubtotal,
      });
      if (res.ok) {
        resolvedCoupon = { code: res.coupon.code, type: res.coupon.type, value: res.coupon.value };
      } else {
        couponError = res.reason;
      }
    }
  }

  const pricing = calculatePricing({
    appointment: { slug: appt.slug, hours: appt.hours, basePriceCents: appt.basePriceCents },
    addons: resolvedAddons,
    member: null, // members come in once Supabase Auth wires (Phase 4)
    coupon: resolvedCoupon,
    paymentMethod: body.paymentMethod ?? "card",
  });

  return NextResponse.json({
    appointment: { slug: appt.slug, label: appt.label, hours: appt.hours },
    availability,
    couponError,
    pricing,
  });
}
