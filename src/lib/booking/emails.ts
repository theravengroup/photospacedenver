import "server-only";
import { sendEmail } from "@/lib/forms/email";
import { SITE, CANONICAL_DOMAIN } from "@/lib/content/site-config";
import { renderBrandedEmail } from "@/lib/emails/branded";

/**
 * Booking transactional emails — sent to the customer when their booking
 * confirms or cancels. Wrapped in the branded HTML layout (dark ink, logo,
 * tungsten accents) with a plain-text fallback for clients that refuse HTML.
 *
 * - sendBookingConfirmation → customer (every email in their intake list)
 *                             + admin notify to the studio inbox (plain text)
 * - sendBookingCancellation → same pattern, includes refund line
 *
 * All times rendered in America/Denver.
 */

const TZ = "America/Denver";

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});
const TIME_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

function dollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function whereLine(): string {
  return `${SITE.address.line1}, ${SITE.address.city} ${SITE.address.region} ${SITE.address.postalCode}`;
}

export async function sendBookingConfirmation(input: {
  toEmails: string[];
  /** Pass the appointment slug too — copy + amenities differ between a Tour
   *  (greeted in person, no keyless access) and a real rental (keyless 24/7). */
  appointmentSlug: string;
  appointmentLabel: string;
  startAt: Date;
  endAt: Date;
  totalCents: number;
  bookingId: string;
  customerFirstName: string;
}): Promise<void> {
  const date = DATE_FMT.format(input.startAt);
  const time = `${TIME_FMT.format(input.startAt)} – ${TIME_FMT.format(input.endAt)}`;
  const whenShort = `${date} · ${time}`;
  const isTour = input.appointmentSlug === "tour";
  const manageUrl = `${CANONICAL_DOMAIN}/booking/manage/${input.bookingId}`;
  const mapsUrl = SITE.address.mapsHref;

  // Tour vs rental amenity line — for tours, a staff member greets them in
  // person; for rentals, 24/7 keyless access applies.
  const amenityCopyText = isTour
    ? `A photospace team member will meet you at the door at the time of your tour. ${SITE.address.directionsNote}`
    : `Easy in, easy out — 24/7 keyless access. ${SITE.address.directionsNote}`;
  const amenityCopyHtml = isTour
    ? `One of us will meet you at the door at the time of your tour. ${escapeText(SITE.address.directionsNote)}`
    : `Easy in, easy out — 24/7 keyless access (door code lands in a follow-up email). ${escapeText(SITE.address.directionsNote)}`;

  // ─── Customer email (branded HTML + plain text fallback) ──────────
  const customerSubject = isTour
    ? `Your studio tour is confirmed — ${whenShort}`
    : `Your studio session is confirmed — ${whenShort}`;

  const customerText = [
    `Hi ${input.customerFirstName},`,
    ``,
    isTour
      ? `Your studio tour at photospace is confirmed.`
      : `Your studio session at photospace is confirmed.`,
    ``,
    `What:  ${input.appointmentLabel}`,
    `When:  ${whenShort}`,
    `Where: ${whereLine()}`,
    `       ${mapsUrl}`,
    `Total: ${dollars(input.totalCents)}`,
    ``,
    amenityCopyText,
    ``,
    `Manage or cancel your booking: ${manageUrl}`,
    `Questions? ${SITE.contact.email} · ${SITE.contact.phone}`,
    ``,
    `See you at the studio.`,
    `— photospace Denver`,
  ].join("\n");

  const customerHtml = renderBrandedEmail({
    preheader: `${input.appointmentLabel} · ${whenShort}`,
    eyebrow: "Confirmed",
    heading: isTour
      ? `Your tour is booked, ${input.customerFirstName}.`
      : `You're booked, ${input.customerFirstName}.`,
    intro: isTour
      ? `See you at the studio. Here are the details — same info is at the bottom of this email if you need to pull it up later.`
      : `Your studio session is locked in. Here are the details — same info is at the bottom of this email if you ever need to pull it up later.`,
    details: [
      { label: "Session", value: escapeText(input.appointmentLabel) },
      { label: "Date", value: escapeText(date) },
      { label: "Time", value: escapeText(time) },
      {
        label: "Where",
        value: `${escapeText(whereLine())}<br><a href="${escapeText(mapsUrl)}" style="color:#c8842b;text-decoration:none;font-size:13px;">Get directions →</a>`,
      },
      { label: "Total", value: escapeText(dollars(input.totalCents)) },
      {
        label: "Confirmation #",
        value: `<code style="font-family:ui-monospace,'SF Mono','Cascadia Mono',Menlo,monospace;font-size:12px;">${escapeText(input.bookingId)}</code>`,
      },
    ],
    bodyHtml: `
      <p style="margin:6px 0 18px 0;color:#b7afa2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.6;">
        ${amenityCopyHtml}
      </p>`,
    cta: { label: "Manage your booking", href: manageUrl },
    footnote: `Need to change or cancel? Use the button above (no account required), or reply to this email.`,
  });

  await sendEmail({
    to: input.toEmails,
    subject: customerSubject,
    text: customerText,
    html: customerHtml,
  });

  // ─── Admin notify (plain text — internal ops, no need to brand) ───
  await sendEmail({
    subject: `[BOOKING confirmed] ${input.appointmentLabel} — ${whenShort}`,
    text: [
      `New confirmed booking.`,
      ``,
      `Customer: ${input.customerFirstName}`,
      `Recipients: ${input.toEmails.join(", ")}`,
      `When:  ${whenShort}`,
      `Total: ${dollars(input.totalCents)}`,
      `Booking ID: ${input.bookingId}`,
    ].join("\n"),
  });
}

export async function sendBookingCancellation(input: {
  toEmails: string[];
  appointmentLabel: string;
  startAt: Date;
  bookingId: string;
  refundedCents: number;
}): Promise<void> {
  const date = DATE_FMT.format(input.startAt);
  const time = TIME_FMT.format(input.startAt);
  const whenShort = `${date} · ${time}`;
  const refundedFull = input.refundedCents > 0 ? dollars(input.refundedCents) : null;

  const refundLine = refundedFull
    ? `A refund of ${refundedFull} has been issued to your original payment method.`
    : `Per the cancellation policy, this booking is non-refundable. Reach out within 60 days to rebook the credit.`;

  // ─── Customer email ───────────────────────────────────────────────
  const customerText = [
    `Your studio session at photospace has been cancelled.`,
    ``,
    `What: ${input.appointmentLabel}`,
    `When: ${whenShort}`,
    ``,
    refundLine,
    ``,
    `Questions? ${SITE.contact.email} · ${SITE.contact.phone}`,
    ``,
    `— photospace Denver`,
  ].join("\n");

  const customerHtml = renderBrandedEmail({
    preheader: `${input.appointmentLabel} · ${whenShort}`,
    eyebrow: "Cancelled",
    heading: "Your session has been cancelled.",
    intro: refundedFull
      ? `A refund of ${refundedFull} has been issued to your original payment method — it usually clears within 5 business days.`
      : `Per our cancellation policy, this booking is non-refundable. You can rebook the credit within the next 60 days — just reply to this email and we'll set it up.`,
    details: [
      { label: "Session", value: escapeText(input.appointmentLabel) },
      { label: "Was scheduled", value: escapeText(whenShort) },
      { label: "Refund", value: refundedFull ? escapeText(refundedFull) : "—" },
      { label: "Cancellation #", value: `<code style="font-family:ui-monospace,'SF Mono','Cascadia Mono',Menlo,monospace;font-size:12px;">${escapeText(input.bookingId)}</code>` },
    ],
    cta: { label: "Start a new booking", href: `${CANONICAL_DOMAIN}/book-native` },
    footnote: `Questions? Just reply — or call us at ${SITE.contact.phone}.`,
  });

  await sendEmail({
    to: input.toEmails,
    subject: `Your studio session is cancelled — ${whenShort}`,
    text: customerText,
    html: customerHtml,
  });

  // ─── Admin notify ─────────────────────────────────────────────────
  await sendEmail({
    subject: `[BOOKING cancelled] ${input.appointmentLabel} — ${whenShort}`,
    text: [
      `Booking cancelled.`,
      ``,
      `When: ${whenShort}`,
      `Refund: ${refundedFull ?? "none"}`,
      `Booking ID: ${input.bookingId}`,
    ].join("\n"),
  });
}

/** Local html-escape for values we inject into the branded template. */
function escapeText(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
