"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Manual-block create form. POSTs to /api/admin/blocks which validates
 * the window + inserts the row + invalidates the listing.
 */
export function BlocksForm() {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("17:00");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/blocks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          startDate,
          startTime,
          endDate: endDate || startDate,
          endTime,
          reason: reason || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErr(json.error ?? "Couldn't create block");
        setSubmitting(false);
        return;
      }
      // Hard-reload so the upcoming list re-fetches server-side
      window.location.reload();
    } catch {
      setErr("Network error — try again");
      setSubmitting(false);
    }
  }

  const canSubmit = !!startDate && !submitting;

  return (
    <form onSubmit={submit} className="glass-card rounded-card p-5 space-y-4">
      <h3 className="text-xs uppercase tracking-[0.16em] text-tungsten font-medium">
        Add a block
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-sm text-muted mb-1">Start date</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="FIELD"
          />
        </label>
        <label className="block">
          <span className="block text-sm text-muted mb-1">Start time</span>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="FIELD"
          />
        </label>
        <label className="block">
          <span className="block text-sm text-muted mb-1">End date</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="defaults to start date"
            className="FIELD"
          />
        </label>
        <label className="block">
          <span className="block text-sm text-muted mb-1">End time</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="FIELD"
          />
        </label>
      </div>
      <label className="block">
        <span className="block text-sm text-muted mb-1">Reason (optional)</span>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. cyc repaint, personal use, maintenance"
          className="FIELD"
          maxLength={120}
        />
      </label>
      {err && (
        <p className="text-sm text-amber-400" role="alert">{err}</p>
      )}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-medium transition-colors",
            canSubmit
              ? "bg-tungsten text-ink hover:bg-tungsten-soft"
              : "bg-panel text-muted border border-hairline cursor-not-allowed",
          )}
        >
          <Plus className="w-4 h-4" />
          {submitting ? "Blocking…" : "Block this window"}
        </button>
      </div>
    </form>
  );
}
