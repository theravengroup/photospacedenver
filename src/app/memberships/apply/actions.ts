"use server";

import { AGREEMENT_CLAUSES } from "@/lib/content/membership-agreement";
import { sendEmail } from "@/lib/forms/email";

type Result = { ok: true; delivered: boolean } | { ok: false; error: string };

export async function submitApplication(formData: FormData): Promise<Result> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const firstName = get("firstName");
  const lastName = get("lastName");
  const business = get("business");
  const street = get("street");
  const street2 = get("street2");
  const city = get("city");
  const state = get("state");
  const zip = get("zip");
  const email = get("email");
  const phone = get("phone");
  const agreementsRaw = String(formData.get("agreements") ?? "{}");
  const signature = String(formData.get("signature") ?? "");

  if (!firstName || !lastName || !street || !city || !state || !zip || !email || !phone) {
    return { ok: false, error: "Please fill every required field." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return { ok: false, error: "Please enter a valid phone number." };
  }

  let agreements: Record<string, boolean> = {};
  try {
    agreements = JSON.parse(agreementsRaw);
  } catch {
    return { ok: false, error: "Could not read your agreements." };
  }
  const missing = AGREEMENT_CLAUSES.filter((c) => !agreements[c.id]).map((c) => c.title);
  if (missing.length > 0) {
    return { ok: false, error: `Please agree to: ${missing.join(", ")}` };
  }

  // Signature must be a non-empty PNG data URL (this is an e-signature, not card data).
  if (!signature.startsWith("data:image/") || signature.length < 200) {
    return { ok: false, error: "Please sign before submitting." };
  }

  const name = `${firstName} ${lastName}`;
  const text = [
    `Name: ${name}`,
    business ? `Business: ${business}` : null,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Address: ${[street, street2, `${city}, ${state} ${zip}`].filter(Boolean).join(", ")}`,
    "",
    `Agreement: all ${AGREEMENT_CLAUSES.length} clauses accepted`,
    "Signature: attached (PNG)",
    `Submitted: ${new Date().toISOString()}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const base64 = signature.includes(",") ? signature.split(",")[1] : "";
  const attachments = base64
    ? [{ filename: `signature-${firstName}-${lastName}.png`.replace(/\s+/g, "-").toLowerCase(), content: base64 }]
    : undefined;

  const sent = await sendEmail({
    subject: `New membership application — ${name}`,
    text,
    replyTo: email,
    attachments,
  });

  if (!sent.ok) {
    return { ok: false, error: sent.error ?? "Could not submit your application. Please call us." };
  }
  return { ok: true, delivered: sent.delivered };
}
