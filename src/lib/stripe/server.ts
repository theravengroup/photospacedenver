import Stripe from "stripe";

/**
 * Lazily-instantiated server Stripe client. Returns null when STRIPE_SECRET_KEY
 * is unset so card-hold routes can degrade gracefully before keys are provisioned.
 */
let client: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!client) client = new Stripe(key);
  return client;
}
