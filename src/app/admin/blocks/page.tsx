import { supabaseAdmin } from "@/lib/supabase/admin";
import { BlocksForm } from "./BlocksForm";

type BlockRow = {
  id: string;
  start_at: string;
  end_at: string;
  reason: string | null;
  created_at: string;
};

const TZ = "America/Denver";
const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default async function AdminBlocksPage() {
  const sb = supabaseAdmin();
  const now = new Date().toISOString();
  const { data: upcoming } = await sb
    .from("manual_blocks")
    .select("id, start_at, end_at, reason, created_at")
    .gte("end_at", now)
    .order("start_at", { ascending: true });

  const rows = (upcoming ?? []) as BlockRow[];

  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-2xl">Manual blocks</h2>
        <p className="text-sm text-muted mt-1">
          Mark the studio unavailable for a window. Blocks act exactly like
          confirmed bookings in availability checks — no one can book over
          them. Use for personal use, maintenance, repaint days, etc.
        </p>
      </header>

      <BlocksForm />

      <div>
        <h3 className="text-xs uppercase tracking-[0.16em] text-tungsten font-medium mb-3">
          Upcoming blocks · {rows.length}
        </h3>
        <div className="glass-card rounded-card overflow-x-auto">
          <table className="w-full text-base">
            <thead className="text-xs uppercase tracking-[0.12em] text-muted">
              <tr className="border-b border-hairline">
                <th className="text-left p-3 font-medium">Start</th>
                <th className="text-left p-3 font-medium">End</th>
                <th className="text-left p-3 font-medium">Reason</th>
                <th className="text-right p-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted text-sm">
                    No upcoming blocks.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-hairline last:border-0 hover:bg-tungsten/5 transition-colors"
                >
                  <td className="p-3 text-sm">{DATE_FMT.format(new Date(row.start_at))}</td>
                  <td className="p-3 text-sm">{DATE_FMT.format(new Date(row.end_at))}</td>
                  <td className="p-3 text-sm">{row.reason ?? "—"}</td>
                  <td className="p-3 text-right text-xs text-muted">
                    {new Date(row.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
