import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Stripe from "stripe";

/**
 * Tests for Stripe webhook signature verification. We use Stripe's own helper
 * `generateTestHeaderString` to forge a valid signature, then prove the
 * verifier accepts it and rejects tampered variants. No network or DB.
 */

const SECRET = "whsec_unit_test_secret_xyz123";
const TEST_KEY = "sk_test_unit";

const PAYLOAD = JSON.stringify({
  id: "evt_test_1",
  type: "payment_intent.succeeded",
  data: { object: { id: "pi_test_1", metadata: { booking_id: "abc" } } },
});

const originalSecret = process.env.STRIPE_SECRET_KEY;
const originalWebhook = process.env.STRIPE_WEBHOOK_SECRET;

beforeAll(() => {
  process.env.STRIPE_SECRET_KEY = TEST_KEY;
  process.env.STRIPE_WEBHOOK_SECRET = SECRET;
});
afterAll(() => {
  process.env.STRIPE_SECRET_KEY = originalSecret;
  process.env.STRIPE_WEBHOOK_SECRET = originalWebhook;
});

describe("constructStripeEvent — webhook signature verification", () => {
  it("accepts a valid signature and returns the parsed event", async () => {
    const { constructStripeEvent } = await import("./stripe");
    const stripe = new Stripe(TEST_KEY);
    const header = stripe.webhooks.generateTestHeaderString({
      payload: PAYLOAD,
      secret: SECRET,
    });
    const event = constructStripeEvent(PAYLOAD, header);
    expect(event.type).toBe("payment_intent.succeeded");
    expect(event.id).toBe("evt_test_1");
  });

  it("rejects a bogus signature", async () => {
    const { constructStripeEvent } = await import("./stripe");
    expect(() => constructStripeEvent(PAYLOAD, "t=1,v1=deadbeef")).toThrow();
  });

  it("rejects when the payload was tampered after signing", async () => {
    const { constructStripeEvent } = await import("./stripe");
    const stripe = new Stripe(TEST_KEY);
    const header = stripe.webhooks.generateTestHeaderString({
      payload: PAYLOAD,
      secret: SECRET,
    });
    const tampered = PAYLOAD.replace("pi_test_1", "pi_attacker_1");
    expect(() => constructStripeEvent(tampered, header)).toThrow();
  });

  it("rejects when the wrong secret is configured", async () => {
    const prev = process.env.STRIPE_WEBHOOK_SECRET;
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_wrong_secret";
    try {
      const { constructStripeEvent } = await import("./stripe");
      const stripe = new Stripe(TEST_KEY);
      const header = stripe.webhooks.generateTestHeaderString({
        payload: PAYLOAD,
        secret: SECRET, // signed with original
      });
      expect(() => constructStripeEvent(PAYLOAD, header)).toThrow();
    } finally {
      process.env.STRIPE_WEBHOOK_SECRET = prev;
    }
  });
});
