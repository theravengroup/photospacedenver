import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Calendar,
  CalendarCheck,
  CalendarClock,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getCurrentUser } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { appointmentTypeBySlug } from "@/lib/booking/appointment-types";

/**
 * /account/bookings
 *
 * Authenticated customer "my bookings" page. Shows the signed-in user's
 * upcoming + past bookings, keyed by their auth email (matched against
 * bookings.customer_email).
 *
 * Auth gate: redirects to /book-studio?signin=1 if not signed in. The
 * member sign-in panel at the top of /book-studio handles the magic-link
 * round-trip, then we land them back here.
 */

export const metadata: Metadata = {
  title: "Your bookings — photospace Denver",
  robots: { index: false, follow: false },
};

// Same dynamic-only treatment as the admin pages: auth-gated, request-time
// Supabase, no prerender at build.
export const dynamic = "force-dynamic";

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
});

function dollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

type Row = {
  id: string;
  status: string;
  appointment_type_slug: string;
  start_at: string;
  end_at: string;
  total_cents: number;
};

export default async function MyBookingsPage() {
  const user = await getCurrentUser();
  if (!user?.email) {
    redirect("/book-studio?signin=1");
  }

  // Server-side fetch via admin client + .eq("customer_email", user.email)
  // so we serve only the signed-in user's rows. (Adding RLS to the
  // bookings table is the longer-term fix; this server-side filter is
  // safe in the meantime since no untrusted code path can reach this
  // function — it's gated by getCurrentUser above.)
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("bookings")
    .select(
      "id, status, appointment_type_slug, start_at, end_at, total_cents",
    )
    .eq("customer_email", user.email.toLowerCase())
    .order("start_at", { ascending: false });

  const all = (data ?? []) as Row[];
  // Server component renders on every request — Date.now() at render time
  // is fine here, not a hooks-purity concern. Lint rule is for client
  // components; we disable it inline.
  // eslint-disable-next-line react-hooks/purity
  const nowMs = Date.now();
  const upcoming = all.filter((b) => new Date(b.start_at).getTime() > nowMs);
  const past = all.filter((b) => new Date(b.start_at).getTime() <= nowMs);

  return (
    <Section tone="dark">
      <Container>
        <div className="book-shell max-w-4xl mx-auto space-y-10">
          <header>
            <div className="inline-flex items-center gap-2 text-tungsten uppercase tracking-[0.16em] text-sm font-medium">
              <Calendar className="w-4 h-4" strokeWidth={1.75} aria-hidden />
              Your account
            </div>
            <h1 className="font-display text-3xl sm:text-4xl mt-2">Your bookings</h1>
            <p className="text-base sm:text-lg text-muted mt-2">
              All bookings made with <strong className="text-current">{user.email}</strong>.
              Click any row to manage, reschedule, or cancel.
            </p>
          </header>

          <Section2 title="Upcoming" icon={CalendarCheck} count={upcoming.length}>
            {upcoming.length === 0 ? (
              <Empty
                text="No upcoming bookings."
                ctaLabel="Book the studio"
                ctaHref="/book-studio"
              />
            ) : (
              <BookingList rows={upcoming} />
            )}
          </Section2>

          <Section2 title="Past" icon={CalendarClock} count={past.length}>
            {past.length === 0 ? (
              <Empty text="No past bookings yet." />
            ) : (
              <BookingList rows={past} />
            )}
          </Section2>

          <div className="flex items-center justify-between pt-4 border-t border-hairline">
            <Link
              href="/book-studio"
              className="text-base text-muted hover:text-current underline underline-offset-4"
            >
              ← Back to booking
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-base text-muted hover:text-current underline underline-offset-4"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function Section2({
  title,
  icon: Icon,
  count,
  children,
}: {
  title: string;
  icon: typeof Calendar;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-tungsten font-medium">
        <Icon className="w-4 h-4" strokeWidth={1.75} aria-hidden />
        {title}
        <span className="text-muted normal-case tracking-normal">· {count}</span>
      </h2>
      {children}
    </section>
  );
}

function BookingList({ rows }: { rows: Row[] }) {
  return (
    <ul className="space-y-2">
      {rows.map((r) => {
        const appt = appointmentTypeBySlug(r.appointment_type_slug);
        const start = new Date(r.start_at);
        const end = new Date(r.end_at);
        return (
          <li key={r.id}>
            <Link
              href={`/booking/manage/${r.id}`}
              className="glass-card glass-card-hover rounded-card p-4 flex items-center gap-4 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-base font-medium">
                    {appt?.label ?? r.appointment_type_slug}
                  </span>
                  <StatusPill status={r.status} />
                </div>
                <div className="text-sm text-muted mt-1">
                  {DATE_FMT.format(start)} · {TIME_FMT.format(start)} – {TIME_FMT.format(end)}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display text-lg">{dollars(r.total_cents)}</div>
                <div className="text-xs text-tungsten flex items-center gap-1 justify-end mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                  Manage <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
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

function Empty({
  text,
  ctaLabel,
  ctaHref,
}: {
  text: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="glass-card rounded-card p-6 flex flex-wrap items-center justify-between gap-4">
      <p className="text-base text-muted">{text}</p>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 text-base font-medium text-tungsten hover:text-tungsten-soft"
        >
          <CalendarCheck className="w-4 h-4" />
          {ctaLabel} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}
