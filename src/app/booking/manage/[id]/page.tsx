import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { appointmentTypeBySlug } from "@/lib/booking/appointment-types";
import { ManageBookingShell } from "./ManageBookingShell";

/**
 * /booking/manage/[id]
 *
 * Customer-facing booking management. The booking UUID in the URL is the
 * bearer — anyone with the confirmation-email link can manage. (UUIDs are
 * unguessable; if the customer is worried about a forwarded email, the
 * cancellation is reversible by support.)
 *
 * v1 actions: view + cancel. Reschedule = contact us (until we build the
 * rescheduling UI proper).
 */

export const metadata: Metadata = {
  title: "Manage your booking — photospace Denver",
  robots: { index: false, follow: false },
};

export default async function ManageBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id || !/^[0-9a-f-]{32,}$/i.test(id)) {
    notFound();
  }

  const sb = supabaseAdmin();
  const { data } = await sb
    .from("bookings")
    .select(
      "id, status, appointment_type_slug, start_at, end_at, customer_first_name, customer_email, total_cents",
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const appt = appointmentTypeBySlug(data.appointment_type_slug);

  return (
    <Section tone="dark">
      <Container>
        <div className="book-shell">
          <ManageBookingShell
            bookingId={data.id}
            status={data.status}
            appointmentLabel={appt?.label ?? data.appointment_type_slug}
            startAt={data.start_at}
            endAt={data.end_at}
            customerFirstName={data.customer_first_name}
            customerEmail={data.customer_email}
            totalCents={data.total_cents}
            isTour={appt?.slug === "tour"}
          />
        </div>
      </Container>
    </Section>
  );
}
