import { getStripe } from "@/lib/stripe/server";

/**
 * Creates a manual-capture PaymentIntent = an authorization HOLD (not a charge)
 * for an equipment rental's replacement value. The client confirms the card with
 * Stripe Elements; staff capture or release the hold later. Card data never
 * touches this server. Returns 503 until STRIPE_SECRET_KEY is set.
 */
const MAX_HOLD_DOLLARS = 100_000;

export async function POST(req: Request): Promise<Response> {
  const stripe = getStripe();
  if (!stripe) {
    return Response.json(
      { error: "Card holds aren't set up yet — please submit a Certificate of Insurance or call us." },
      { status: 503 },
    );
  }

  let data: Record<string, unknown>;
  try {
    data = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const dollars = Number(data.amount);
  if (!Number.isFinite(dollars) || dollars <= 0) {
    return Response.json({ error: "Enter a valid replacement value." }, { status: 422 });
  }
  if (dollars > MAX_HOLD_DOLLARS) {
    return Response.json({ error: "That replacement value is too high to hold online — please call us." }, { status: 422 });
  }
  const amount = Math.round(dollars * 100);

  try {
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      capture_method: "manual",
      payment_method_types: ["card"],
      description: `Replacement-value hold — invoice ${String(data.invoice_number ?? "n/a")}`,
      metadata: {
        kind: "replacement_value_hold",
        invoice_number: String(data.invoice_number ?? ""),
        name: String(data.name ?? ""),
        email: String(data.email ?? ""),
        organization: String(data.organization ?? ""),
      },
    });
    return Response.json({ clientSecret: intent.client_secret });
  } catch (e) {
    console.error("Stripe hold failed", e);
    return Response.json({ error: e instanceof Error ? e.message : "Couldn't start the hold." }, { status: 502 });
  }
}
