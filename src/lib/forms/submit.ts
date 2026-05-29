export type FormStatus = "idle" | "sending" | "ok" | "error";

/**
 * Shared client submit for all inquiry-style forms. Posts a flat
 * string payload to /api/inquiry; throws with a user-facing message on failure.
 */
export async function submitInquiry(payload: Record<string, string>): Promise<void> {
  const res = await fetch("/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok || !json.ok) {
    throw new Error(json.error || "Something went wrong. Please try again or call us.");
  }
}
