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
import { getCurrentMember } from "@/lib/supabase/server";
import { getMemberHoursAvailable } from "@/lib/booking/member-hours";
import type { PaymentMethod, MemberTier } from "@/lib/booking/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type QuoteBody = {
  appointmentTypeSlug?: string;
  startAt?: string;
  endAt?: string;
  /** For multi-day: YYYY-MM-DD start + end dates (interpreted in Denver). */
  multiDayStartDate?: string;
  multiDayEndDate?: string;
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

  const isMultiDay = appt.slug === "multi-day";

  // Multi-day: compute start/end from the date range (Denver midnight bounds).
  // Hourly: take startAt/endAt as-is.
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
    end = denverMidnight(body.multiDayEndDate, /*addDay*/ 1); // exclusive end at next midnight
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

  // Filter add-ons. Multi-day v1 skips add-ons entirely — customers describe
  // crew / lighting / paint needs in the notes field instead.
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

  // Availability (so the UI knows if the slot is even bookable)
  const availability = await checkAvailability({ start, end });

  // Preliminary subtotal for coupon math
  const preliminaryBase = isMultiDay
    ? // multi-day base resolves inside calculatePricing — for the coupon
      // pre-check we need an estimate; do a quick calc here
      // (calculatePricing repeats the math authoritatively below)
      (
        await import("@/lib/booking/multi-day")
      ).countBillableDays(body.multiDayStartDate!, body.multiDayEndDate!).subtotalCents
    : appt.basePriceCents;
  const preliminarySubtotal =
    preliminaryBase + resolvedAddons.reduce((s, a) => s + a.priceCents, 0);

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

  // Authenticated member? Look up their tier + remaining free hours so the
  // pricing engine can apply the discount in the live preview. NEVER trust
  // an unauthenticated tier — only resolve via the auth-cookie-derived user.
  let memberInput: { hoursAvailable: number; tier: MemberTier } | null = null;
  let memberPreview: {
    signedIn: boolean;
    email: string | null;
    tier: MemberTier | null;
    hoursAvailable: number;
  } = { signedIn: false, email: null, tier: null, hoursAvailable: 0 };
  try {
    const member = await getCurrentMember();
    if (member) {
      const balance = await getMemberHoursAvailable({
        memberEmail: member.email,
        tier: member.tier,
      });
      memberInput = { hoursAvailable: balance.hoursAvailable, tier: member.tier };
      memberPreview = {
        signedIn: true,
        email: member.email,
        tier: member.tier,
        hoursAvailable: balance.hoursAvailable,
      };
    } else {
      // signed in but not a member → still note signed-in state for the UI
      const { getCurrentUser } = await import("@/lib/supabase/server");
      const user = await getCurrentUser();
      if (user?.email) {
        memberPreview = {
          signedIn: true,
          email: user.email,
          tier: null,
          hoursAvailable: 0,
        };
      }
    }
  } catch (err) {
    console.warn("[quote] member lookup failed (continuing as non-member):", err);
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

  return NextResponse.json({
    appointment: { slug: appt.slug, label: appt.label, hours: appt.hours },
    availability,
    couponError,
    pricing,
    member: memberPreview,
  });
}

/**
 * Convert a YYYY-MM-DD string (interpreted as Denver-local) to its UTC
 * midnight Date. Optionally add days (useful for end-of-day = next-midnight).
 */
function denverMidnight(dateISO: string, addDay = 0): Date {
  const [y, m, d] = dateISO.split("-").map(Number);
  // Same offset-extraction approach used by /api/booking/slots
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
