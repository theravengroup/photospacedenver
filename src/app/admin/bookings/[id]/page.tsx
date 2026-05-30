import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { appointmentTypeBySlug } from "@/lib/booking/appointment-types";

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

function dollars(cents: number | null | undefined): string {
  return `$${((cents ?? 0) / 100).toFixed(2)}`;
}

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id || !/^[0-9a-f-]{32,}$/i.test(id)) notFound();

  const sb = supabaseAdmin();
  const { data } = await sb.from("bookings").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  const appt = appointmentTypeBySlug(data.appointment_type_slug);
  const start = new Date(data.start_at);
  const end = new Date(data.end_at);

  return (
    <div className="space-y-5">
      <Link
        href="/admin/bookings"
        className="inline-flex items-center gap-1.5 text-base text-muted hover:text-current"
      >
        <ArrowLeft className="w-4 h-4" /> All bookings
      </Link>

      <header>
        <div className="text-xs uppercase tracking-[0.16em] text-tungsten font-medium">
          Booking · {data.status}
        </div>
        <h2 className="font-display text-2xl mt-1">
          {appt?.label ?? data.appointment_type_slug} ·{" "}
          {data.customer_first_name} {data.customer_last_name}
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Customer">
          <Row k="Name" v={`${data.customer_first_name} ${data.customer_last_name}`} />
          <Row k="Email" v={data.customer_email} />
          {Array.isArray(data.customer_emails) && data.customer_emails.length > 0 && (
            <Row k="Cc emails" v={data.customer_emails.join(", ")} />
          )}
          <Row k="Phone" v={data.customer_phone} />
        </Card>

        <Card title="Session">
          <Row k="Type" v={appt?.label ?? data.appointment_type_slug} />
          <Row
            k="When"
            v={
              <>
                {DATE_FMT.format(start)}
                <br />
                <span className="text-muted">
                  {TIME_FMT.format(start)} – {TIME_FMT.format(end)}
                </span>
              </>
            }
          />
          {data.custom_gear_request && (
            <Row
              k="Notes"
              v={
                <span className="block whitespace-pre-line text-muted">
                  {data.custom_gear_request}
                </span>
              }
            />
          )}
        </Card>

        <Card title="Pricing">
          <Row k="Base" v={dollars(data.base_price_cents)} />
          {Number(data.member_hours_applied ?? 0) > 0 && (
            <Row
              k="Member hours"
              v={`${data.member_hours_applied} hr · −${dollars(data.member_discount_cents)}`}
            />
          )}
          {data.coupon_code && (
            <Row
              k={`Coupon ${data.coupon_code}`}
              v={`−${dollars(data.coupon_discount_cents)}`}
            />
          )}
          {Number(data.processing_fee_cents ?? 0) > 0 && (
            <Row k="Processing fee" v={dollars(data.processing_fee_cents)} />
          )}
          <Row k="Total" v={<strong>{dollars(data.total_cents)}</strong>} />
        </Card>

        <Card title="System">
          <Row k="ID" v={<code className="text-xs">{data.id}</code>} />
          {data.stripe_intent_id && (
            <Row k="Stripe intent" v={<code className="text-xs">{data.stripe_intent_id}</code>} />
          )}
          {data.stripe_charge_id && (
            <Row k="Stripe charge" v={<code className="text-xs">{data.stripe_charge_id}</code>} />
          )}
          {data.gcal_event_id && (
            <Row k="GCal event" v={<code className="text-xs">{data.gcal_event_id}</code>} />
          )}
          <Row k="Created" v={new Date(data.created_at).toLocaleString()} />
          <Row k="Updated" v={new Date(data.updated_at).toLocaleString()} />
          {data.reminder_sent_at && (
            <Row k="Reminder sent" v={new Date(data.reminder_sent_at).toLocaleString()} />
          )}
        </Card>
      </div>

      <div className="glass-card rounded-card p-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-muted">
          Customer-facing management:
        </p>
        <Link
          href={`/booking/manage/${data.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-tungsten hover:text-tungsten-soft underline underline-offset-4"
        >
          Open /booking/manage/{data.id.slice(0, 8)}… ↗
        </Link>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-card p-5">
      <h3 className="text-xs uppercase tracking-[0.16em] text-tungsten font-medium mb-3">
        {title}
      </h3>
      <dl className="space-y-2 text-sm">{children}</dl>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-3">
      <dt className="text-muted">{k}</dt>
      <dd className="min-w-0 break-words">{v}</dd>
    </div>
  );
}
