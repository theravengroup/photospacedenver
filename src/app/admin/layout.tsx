import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Tag,
  CalendarOff,
  LogOut,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { requireAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Admin — photospace Denver",
  robots: { index: false, follow: false },
};

// Admin pages are auth-gated + use the service-role Supabase client at
// request time. They must not be prerendered at build (no env in CI).
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/blocks", label: "Blocks", icon: CalendarOff },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { email } = await requireAdmin();

  return (
    <Section tone="dark">
      <Container size="wide">
        <div className="book-shell">
          <header className="flex flex-wrap items-baseline justify-between gap-4 pb-6 border-b border-hairline">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-tungsten font-medium">
                Admin
              </div>
              <h1 className="font-display text-2xl sm:text-3xl mt-1">
                photospace Denver
              </h1>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted">{email}</span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 text-muted hover:text-current"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </form>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[12rem_1fr] gap-8 mt-8">
            <nav aria-label="Admin sections">
              <ul className="space-y-1">
                {NAV.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-card text-base text-muted hover:text-bone hover:bg-tungsten/5 transition-colors"
                      >
                        <Icon className="w-4 h-4" strokeWidth={1.75} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
