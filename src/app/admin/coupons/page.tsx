import { supabaseAdmin } from "@/lib/supabase/admin";

type Row = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  usage_limit: string;
  max_uses_per_user: number | null;
  email_allowlist: string[] | null;
  active: boolean;
  notes: string | null;
  created_at: string;
};

function formatDiscount(row: Row): string {
  return row.type === "percent" ? `${row.value}%` : `$${(row.value / 100).toFixed(2)}`;
}

export default async function AdminCouponsPage() {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("coupons")
    .select("code, type, value, usage_limit, max_uses_per_user, email_allowlist, active, notes, created_at")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as Row[];

  // Also pull redemption counts so admin sees per-coupon usage.
  const { data: redemptions } = await sb
    .from("coupon_redemptions")
    .select("coupon_code");
  const useCounts = new Map<string, number>();
  for (const r of redemptions ?? []) {
    const code = (r as { coupon_code: string }).coupon_code;
    useCounts.set(code, (useCounts.get(code) ?? 0) + 1);
  }

  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-2xl">Coupons</h2>
        <p className="text-sm text-muted mt-1">
          {rows.length} configured. Add / edit via Supabase Dashboard for now —
          a write UI lands in a follow-up.
        </p>
      </header>

      <div className="glass-card rounded-card overflow-x-auto">
        <table className="w-full text-base">
          <thead className="text-xs uppercase tracking-[0.12em] text-muted">
            <tr className="border-b border-hairline">
              <th className="text-left p-3 font-medium">Code</th>
              <th className="text-left p-3 font-medium">Discount</th>
              <th className="text-left p-3 font-medium">Usage</th>
              <th className="text-left p-3 font-medium">Redemptions</th>
              <th className="text-left p-3 font-medium">Allowlist</th>
              <th className="text-left p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted text-sm">
                  No coupons yet.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr
                key={row.code}
                className="border-b border-hairline last:border-0 hover:bg-tungsten/5 transition-colors"
              >
                <td className="p-3">
                  <code className="font-mono text-sm">{row.code}</code>
                  {row.notes && (
                    <div className="text-xs text-muted mt-0.5 max-w-[18rem]">
                      {row.notes}
                    </div>
                  )}
                </td>
                <td className="p-3 font-display text-lg text-tungsten">
                  {formatDiscount(row)}
                </td>
                <td className="p-3 text-sm">
                  {row.usage_limit}
                  {row.max_uses_per_user ? ` · ${row.max_uses_per_user}/user` : ""}
                </td>
                <td className="p-3 text-sm">{useCounts.get(row.code) ?? 0}</td>
                <td className="p-3 text-sm text-muted">
                  {row.email_allowlist && row.email_allowlist.length > 0
                    ? row.email_allowlist.join(", ")
                    : "—"}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center text-xs uppercase tracking-[0.14em] font-medium px-2 py-0.5 rounded-full border ${
                      row.active
                        ? "border-tungsten/40 text-tungsten"
                        : "border-hairline text-muted"
                    }`}
                  >
                    {row.active ? "active" : "off"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
