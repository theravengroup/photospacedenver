import { supabaseAdmin } from "@/lib/supabase/admin";

const TIER_ALLOWANCE: Record<string, number> = {
  spark: 5,
  creator: 10,
  visionary: 20,
};

export default async function AdminMembersPage() {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("members")
    .select("id, email, tier, status, display_name, billing_anchor_date, notes, created_at")
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-2xl">Members</h2>
        <p className="text-sm text-muted mt-1">
          {rows.length} record{rows.length === 1 ? "" : "s"}. Insert / edit via
          Supabase Dashboard for now — a write UI lands in a follow-up.
        </p>
      </header>

      <div className="glass-card rounded-card overflow-x-auto">
        <table className="w-full text-base">
          <thead className="text-xs uppercase tracking-[0.12em] text-muted">
            <tr className="border-b border-hairline">
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Tier</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Hours / cycle</th>
              <th className="text-left p-3 font-medium">Anchor</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted text-sm">
                  No members yet.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-hairline last:border-0 hover:bg-tungsten/5 transition-colors"
              >
                <td className="p-3">
                  {row.display_name ?? "—"}
                  {row.notes && (
                    <div className="text-xs text-muted mt-0.5 truncate max-w-[14rem]">
                      {row.notes}
                    </div>
                  )}
                </td>
                <td className="p-3 text-sm">{row.email}</td>
                <td className="p-3">
                  <span className="inline-flex items-center text-xs uppercase tracking-[0.14em] font-medium px-2 py-0.5 rounded-full border border-tungsten/40 text-tungsten">
                    {row.tier}
                  </span>
                </td>
                <td className="p-3 text-sm">{row.status}</td>
                <td className="p-3 text-sm">{TIER_ALLOWANCE[row.tier] ?? "—"} hr</td>
                <td className="p-3 text-sm text-muted">{row.billing_anchor_date ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
