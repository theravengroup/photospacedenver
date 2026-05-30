import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SuccessShell } from "./SuccessShell";

/**
 * /book-studio/success — Stripe redirects here after confirmPayment.
 *
 * The webhook fires asynchronously, so the booking may not yet be `confirmed`
 * by the time the user lands. SuccessShell polls /api/booking/status until
 * the status flips (with a short timeout fallback).
 */

export const metadata: Metadata = {
  title: "Booking confirmed — photospace Denver",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ booking_id?: string }>;
}) {
  const params = await searchParams;
  const bookingId = params.booking_id ?? "";

  return (
    <Section tone="dark">
      <Container>
        <SuccessShell bookingId={bookingId} />
      </Container>
    </Section>
  );
}
