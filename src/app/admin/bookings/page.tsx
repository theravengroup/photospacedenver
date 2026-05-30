import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { appointmentTypeBySlug } from "@/lib/booking/appointment-types";

const TZ = "America/Denver";
const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  month: "short",
  day: "numeric",
  year: "numeric",
});
const TIME_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour: "numeric",
  minute: "2-digit",
});

function dollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

const STATUSES = [
  "all",
  "confirmed",
  "pending_payment",
  "pending_approval",
  "cancelled",
  "expired",
] as const;
type StatusFilter = (typeof STATUSES)[number];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const status: StatusFilter = (STATUSES as readonly string[]).includes(sp.status ?? "all")
    ? (sp.status as StatusFilter)
    : "all";
  const q = (sp.q ?? "").trim();

  const sb = supabaseAdmin();
  let query = sb
    .from("bookings")
    .select(
      "id, status, appointment_type_slug, start_at, end_at, customer_first_name, customer_last_name, customer_email, total_cents",
    )
    .order("start_at", { ascending: false })
    .limit(200);

  if (status !== "all") query = query.eq("status", status);
  if (q) {
    // Simple OR across email + last name. Server-side, indexed-by-default.
    query = query.or(`customer_email.ilike.%${q}%,customer_last_name.ilike.%${q}%`);
  }

  const { data } = await query;
  const rows = data ?? [];

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">Bookings</h2>
          <p className="text-sm text-muted mt-1">
            Showing {rows.length} of latest 200 · sorted by start time (newest first)
          </p>
        </div>
      </header>

      {/* Filters — plain GET form so the page is fully server-rendered */}
      <form className="glass-card rounded-card p-4 flex flex-wrap gap-3 items-end">
        <label className="block min-w-[10rem]">
          <span className="block text-xs uppercase tracking-[0.16em] text-muted mb-1">Status</span>
          <select
            name="status"
            defaultValue={status}
            className="FIELD"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block flex-1 min-w-[14rem]">
          <span className="block text-xs uppercase tracking-[0.16em] text-muted mb-1">Search</span>
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="email or last name"
            className="FIELD"
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-medium bg-tungsten text-ink hover:bg-tungsten-soft transition-colors"
        >
          Apply
        </button>
        <Link
          href="/admin/bookings"
          className="text-base text-muted hover:text-current underline underline-offset-4"
        >
          Reset
        </Link>
      </form>

      {/* Table */}
      <div className="glass-card rounded-card overflow-x-auto">
        <table className="w-full text-base">
          <thead className="text-xs uppercase tracking-[0.12em] text-muted">
            <tr className="border-b border-hairline">
              <th className="text-left p-3 font-medium">When</th>
              <th className="text-left p-3 font-medium">Customer</th>
              <th className="text-left p-3 font-medium">Session</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-right p-3 font-medium">Total</th>
              <th className="text-right p-3 font-medium" aria-label="actions" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted text-sm">
                  No bookings match.
                </td>
              </tr>
            )}
            {rows.map((row) => {
              const start = new Date(row.start_at);
              const end = new Date(row.end_at);
              const appt = appointmentTypeBySlug(row.appointment_type_slug);
              return (
                <tr
                  key={row.id}
                  className="border-b border-hairline last:border-0 hover:bg-tungsten/5 transition-colors"
                >
                  <td className="p-3 align-top">
                    <div>{DATE_FMT.format(start)}</div>
                    <div className="text-muted text-sm">
                      {TIME_FMT.format(start)}–{TIME_FMT.format(end)}
                    </div>
                  </td>
                  <td className="p-3 align-top">
                    <div>
                      {row.customer_first_name} {row.customer_last_name}
                    </div>
                    <div className="text-muted text-sm">{row.customer_email}</div>
                  </td>
                  <td className="p-3 align-top text-sm">
                    {appt?.label ?? row.appointment_type_slug}
                  </td>
                  <td className="p-3 align-top">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="p-3 align-top text-right">{dollars(row.total_cents)}</td>
                  <td className="p-3 align-top text-right">
                    <Link
                      href={`/admin/bookings/${row.id}`}
                      className="inline-flex items-center gap-1 text-tungsten hover:text-tungsten-soft text-sm"
                    >
                      Open <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "cancelled"
      ? "border-amber-400/40 text-amber-400"
      : status === "confirmed"
        ? "border-tungsten/40 text-tungsten"
        : status === "pending_payment"
          ? "border-bone/40 text-bone"
          : "border-hairline text-muted";
  return (
    <span
      className={`inline-flex items-center text-xs uppercase tracking-[0.14em] font-medium px-2 py-0.5 rounded-full border ${tone}`}
    >
      {status}
    </span>
  );
}
