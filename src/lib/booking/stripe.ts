import "server-only";
import Stripe from "stripe";

/**
 * Stripe wrapper for the booking system — server-only. Creates the
 * PaymentIntent, verifies webhook signatures, and supports refunds.
 *
 * Idempotency: PaymentIntent creation keys on the booking id, so a duplicate
 * /checkout request never produces two charges.
 *
 * Signature verification: REQUIRED before trusting any webhook body — without
 * it anyone could POST to /api/booking/webhook and confirm bookings for free.
 */

function getStripe(): Stripe {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(secret, { typescript: true });
}

export type CreateBookingIntentInput = {
  amountCents: number;
  bookingId: string;
  customerEmail: string;
  description: string;
  metadata?: Record<string, string>;
};

export async function createBookingPaymentIntent(
  input: CreateBookingIntentInput,
): Promise<{ id: string; clientSecret: string }> {
  if (input.amountCents <= 0) {
    throw new Error("createBookingPaymentIntent: amount must be > 0");
  }
  const stripe = getStripe();
  const intent = await stripe.paymentIntents.create(
    {
      amount: input.amountCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: input.customerEmail,
      description: input.description,
      metadata: {
        booking_id: input.bookingId,
        ...(input.metadata ?? {}),
      },
    },
    { idempotencyKey: `booking-intent-${input.bookingId}` },
  );
  if (!intent.client_secret) {
    throw new Error("Stripe returned no client_secret");
  }
  return { id: intent.id, clientSecret: intent.client_secret };
}

/**
 * Verify the Stripe webhook signature and return the parsed event.
 * Throws if the signature doesn't match — the route handler catches and
 * responds 400 without touching the DB.
 */
export function constructStripeEvent(rawBody: string, signature: string): Stripe.Event {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}

/** Refund a charge (full or partial). Used by admin cancel flow. */
export async function refundCharge(
  chargeId: string,
  amountCents?: number,
): Promise<Stripe.Refund> {
  const stripe = getStripe();
  return stripe.refunds.create({
    charge: chargeId,
    ...(amountCents !== undefined ? { amount: amountCents } : {}),
  });
}
