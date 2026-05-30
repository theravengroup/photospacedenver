import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BookingWizard } from "./BookingWizard";

/**
 * /book-native — public-facing booking flow that replaces Acuity.
 *
 * Phase 4: deliberately unlisted (no nav link, no internal links from
 * marketing pages). You reach it by typing the URL. After parallel testing
 * lands a few real bookings, we flip the Book CTAs site-wide.
 */

export const metadata: Metadata = {
  title: "Book the studio — photospace Denver",
  description:
    "Reserve photospace's daylight photo studio in Denver. Hourly, half-day, or full-day. 24/7 keyless access. No deposits.",
  // Keep the parallel-test page out of search index
  robots: { index: false, follow: false },
};

export default function BookNativePage() {
  return (
    <Section tone="dark">
      <Container>
        <BookingWizard />
      </Container>
    </Section>
  );
}
