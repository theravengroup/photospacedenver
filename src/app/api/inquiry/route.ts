import { SITE } from "@/lib/content/site-config";

/**
 * Receives estimate / membership / contact form submissions and emails them.
 *
 * Uses the Resend REST API (no SDK dependency) when RESEND_API_KEY is set;
 * otherwise it accepts and logs the submission so forms work end-to-end before
 * email is wired up. Configure in production:
 *   RESEND_API_KEY, INQUIRY_TO_EMAIL, INQUIRY_FROM_EMAIL
 */

type Payload = Record<string, string> & { type?: string; name?: string; email?: string; company_website?: string };

const LABELS: Record<string, string> = { estimate: "estimate request", membership: "membership application", contact: "contact" };

export async function POST(req: Request) {
  let data: Payload | null = null;
  try {
    data = (await req.json()) as Payload;
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (data.company_website) return Response.json({ ok: true });

  const { type = "contact", name, email } = data;
  if (!name?.trim() || !email?.trim()) {
    return Response.json({ ok: false, error: "Name and email are required." }, { status: 422 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ ok: false, error: "Please enter a valid email." }, { status: 422 });
  }

  const subject = `New ${LABELS[type] ?? "inquiry"} — ${name}`;
  const body = Object.entries(data)
    .filter(([k, v]) => k !== "company_website" && v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL ?? SITE.contact.email;
  const from = process.env.INQUIRY_FROM_EMAIL ?? "photospace Denver <onboarding@resend.dev>";

  if (apiKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, reply_to: email, subject, text: body }),
    });
    if (!res.ok) {
      console.error("Resend send failed", res.status, await res.text());
      return Response.json({ ok: false, error: "We couldn't send that just now — please call us." }, { status: 502 });
    }
    return Response.json({ ok: true, delivered: true });
  }

  // TODO(env): set RESEND_API_KEY in production to actually deliver these.
  console.info(`[inquiry] (no RESEND_API_KEY) ${subject}\n${body}`);
  return Response.json({ ok: true, delivered: false });
}
