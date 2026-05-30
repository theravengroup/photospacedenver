import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { appointmentTypeBySlug } from "@/lib/booking/appointment-types";
import { RescheduleShell } from "./RescheduleShell";

/**
 * /booking/manage/[id]/reschedule
 *
 * Customer-facing reschedule UI. Bearer = booking UUID (same as cancel).
 * Renders the appropriate picker (hourly slot picker or multi-day range
 * picker) for the booking's appointment type.
 */

export const metadata: Metadata = {
  title: "Reschedule your booking — photospace Denver",
  robots: { index: false, follow: false },
};

export default async function ReschedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id || !/^[0-9a-f-]{32,}$/i.test(id)) notFound();

  const sb = supabaseAdmin();
  const { data } = await sb
    .from("bookings")
    .select(
      "id, status, appointment_type_slug, start_at, end_at, customer_first_name",
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const appt = appointmentTypeBySlug(data.appointment_type_slug);
  if (!appt) notFound();

  const isMultiDay = appt.slug === "multi-day";

  return (
    <Section tone="dark">
      <Container>
        <div className="book-shell">
          <RescheduleShell
            bookingId={data.id}
            status={data.status}
            appointmentSlug={appt.slug}
            appointmentLabel={appt.label}
            appointmentHours={appt.hours}
            isMultiDay={isMultiDay}
            currentStartAt={data.start_at}
            currentEndAt={data.end_at}
            customerFirstName={data.customer_first_name}
          />
        </div>
      </Container>
    </Section>
  );
}
