import "server-only";
import { sendEmail } from "@/lib/forms/email";
import { SITE } from "@/lib/content/site-config";

/**
 * Booking transactional emails — text-only first pass (Resend renders plain
 * text fine; brand HTML rebuild is a Phase 4 polish task per the migration
 * map). All times rendered in America/Denver.
 *
 * - sendBookingConfirmation → to customer (every email in their intake list)
 *                             + admin notify to the studio inbox
 * - sendBookingCancellation → same pattern, includes refund line
 */

const TZ = "America/Denver";

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});
const TIME_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

function fmtRange(start: Date, end: Date): string {
  return `${DATE_FMT.format(start)} · ${TIME_FMT.format(start)} – ${TIME_FMT.format(end)}`;
}

function dollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export async function sendBookingConfirmation(input: {
  toEmails: string[];
  appointmentLabel: string;
  startAt: Date;
  endAt: Date;
  totalCents: number;
  bookingId: string;
  customerFirstName: string;
}): Promise<void> {
  const when = fmtRange(input.startAt, input.endAt);

  // Customer-facing
  const customerSubject = `Your studio session is confirmed — ${when}`;
  const customerText = [
    `Hi ${input.customerFirstName},`,
    ``,
    `Your studio session at photospace is confirmed.`,
    ``,
    `What:  ${input.appointmentLabel}`,
    `When:  ${when}`,
    `Where: ${SITE.address.line1}, ${SITE.address.city} ${SITE.address.region} ${SITE.address.postalCode}`,
    `Total: ${dollars(input.totalCents)}`,
    ``,
    `Easy in, easy out — 24/7 keyless access. ${SITE.address.directionsNote}`,
    ``,
    `Need to change or cancel? Reach us at ${SITE.contact.email} or ${SITE.contact.phone}.`,
    ``,
    `See you at the studio.`,
    `— photospace Denver`,
  ].join("\n");

  await sendEmail({
    to: input.toEmails,
    subject: customerSubject,
    text: customerText,
  });

  // Admin notify
  await sendEmail({
    subject: `[BOOKING confirmed] ${input.appointmentLabel} — ${when}`,
    text: [
      `New confirmed booking.`,
      ``,
      `Customer: ${input.customerFirstName}`,
      `Recipients: ${input.toEmails.join(", ")}`,
      `When:  ${when}`,
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
  const when = DATE_FMT.format(input.startAt) + " · " + TIME_FMT.format(input.startAt);
  const refundLine =
    input.refundedCents > 0
      ? `A refund of ${dollars(input.refundedCents)} has been issued to your original payment method.`
      : `Per the cancellation policy, this booking is non-refundable. Reach out within 60 days to rebook the credit.`;

  await sendEmail({
    to: input.toEmails,
    subject: `Your studio session is cancelled — ${when}`,
    text: [
      `Your studio session at photospace has been cancelled.`,
      ``,
      `What: ${input.appointmentLabel}`,
      `When: ${when}`,
      ``,
      refundLine,
      ``,
      `Questions? ${SITE.contact.email} · ${SITE.contact.phone}`,
      ``,
      `— photospace Denver`,
    ].join("\n"),
  });

  await sendEmail({
    subject: `[BOOKING cancelled] ${input.appointmentLabel} — ${when}`,
    text: [
      `Booking cancelled.`,
      ``,
      `When: ${when}`,
      `Refund: ${input.refundedCents > 0 ? dollars(input.refundedCents) : "none"}`,
      `Booking ID: ${input.bookingId}`,
    ].join("\n"),
  });
}
