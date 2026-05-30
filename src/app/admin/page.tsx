import { Calendar, Users, Tag, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function AdminHomePage() {
  const sb = supabaseAdmin();
  const now = new Date();
  const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Single round-trip — parallel reads
  const [bookingsAll, bookingsUpcoming, bookingsPending, members, coupons] =
    await Promise.all([
      sb.from("bookings").select("id", { count: "exact", head: true }),
      sb
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("status", "confirmed")
        .gte("start_at", now.toISOString())
        .lt("start_at", inSevenDays.toISOString()),
      sb
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_payment"),
      sb
        .from("members")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
      sb
        .from("coupons")
        .select("id", { count: "exact", head: true })
        .eq("active", true),
    ]);

  const stats = [
    {
      label: "All-time bookings",
      value: bookingsAll.count ?? 0,
      icon: Calendar,
      href: "/admin/bookings",
    },
    {
      label: "Confirmed in next 7 days",
      value: bookingsUpcoming.count ?? 0,
      icon: Calendar,
      href: "/admin/bookings?status=confirmed",
    },
    {
      label: "Pending payment",
      value: bookingsPending.count ?? 0,
      icon: AlertCircle,
      href: "/admin/bookings?status=pending_payment",
    },
    {
      label: "Active members",
      value: members.count ?? 0,
      icon: Users,
      href: "/admin/members",
    },
    {
      label: "Active coupons",
      value: coupons.count ?? 0,
      icon: Tag,
      href: "/admin/coupons",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="glass-card glass-card-hover rounded-card p-5 block"
            >
              <div className="flex items-start justify-between">
                <span className="icon-chip" aria-hidden>
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <span className="font-display text-3xl">{s.value}</span>
              </div>
              <div className="text-sm text-muted mt-2">{s.label}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
