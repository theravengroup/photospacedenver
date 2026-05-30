import { describe, it, expect } from "vitest";
import { calculatePricing } from "./pricing";
import type { PricingInput } from "./types";

// 5-hr halfday @ $485 = the round-number baseline for most tests
const HALFDAY: PricingInput = {
  appointment: { slug: "hourly-5-halfday", hours: 5, basePriceCents: 48500 },
  addons: [],
  member: null,
  coupon: null,
  paymentMethod: "card",
};

describe("calculatePricing — base case", () => {
  it("non-member, no add-ons, card: $485 base + 3% fee = $499.55", () => {
    const r = calculatePricing(HALFDAY);
    expect(r.basePriceCents).toBe(48500);
    expect(r.addonsTotalCents).toBe(0);
    expect(r.memberHoursApplied).toBe(0);
    expect(r.memberDiscountCents).toBe(0);
    expect(r.couponDiscountCents).toBe(0);
    expect(r.subtotalCents).toBe(48500);
    expect(r.processingFeeCents).toBe(1455); // 3% of 48500
    expect(r.totalCents).toBe(49955);
    expect(r.currency).toBe("usd");
  });

  it("ACH = 1% fee", () => {
    const r = calculatePricing({ ...HALFDAY, paymentMethod: "ach" });
    expect(r.processingFeeCents).toBe(485);
    expect(r.totalCents).toBe(48985);
  });

  it("comp (no fee)", () => {
    const r = calculatePricing({ ...HALFDAY, paymentMethod: "comp" });
    expect(r.processingFeeCents).toBe(0);
    expect(r.totalCents).toBe(48500);
  });
});

describe("calculatePricing — add-ons", () => {
  it("sums multiple add-ons into addonsTotalCents", () => {
    const r = calculatePricing({
      ...HALFDAY,
      addons: [
        { slug: "strobe-2", label: "Strobe: Level Two", priceCents: 18000 },
        { slug: "cyc-white", label: "Paint Cyc Wall (white)", priceCents: 17500 },
      ],
    });
    expect(r.addonsTotalCents).toBe(35500);
    expect(r.subtotalCents).toBe(48500 + 35500);
    expect(r.processingFeeCents).toBe(Math.round((48500 + 35500) * 0.03));
    expect(r.totalCents).toBe(r.subtotalCents + r.processingFeeCents);
  });
});

describe("calculatePricing — member free hours", () => {
  it("Spark (5h available) booking 5-hr halfday: fully free, total $0", () => {
    const r = calculatePricing({
      ...HALFDAY,
      member: { hoursAvailable: 5, tier: "spark" },
      paymentMethod: "comp",
    });
    expect(r.memberHoursApplied).toBe(5);
    expect(r.memberDiscountCents).toBe(48500);
    expect(r.subtotalCents).toBe(0);
    expect(r.totalCents).toBe(0);
  });

  it("Spark (5h) booking 7-hr block: 2hr overage × $65 = $130 base", () => {
    const r = calculatePricing({
      appointment: { slug: "hourly-7", hours: 7, basePriceCents: 66500 },
      addons: [],
      member: { hoursAvailable: 5, tier: "spark" },
      coupon: null,
      paymentMethod: "comp",
    });
    expect(r.memberHoursApplied).toBe(5);
    expect(r.memberDiscountCents).toBe(66500 - 13000);
    expect(r.subtotalCents).toBe(13000);
    expect(r.totalCents).toBe(13000);
  });

  it("Creator (10h) booking 10-hr fullday: fully free", () => {
    const r = calculatePricing({
      appointment: { slug: "hourly-10-fullday", hours: 10, basePriceCents: 92500 },
      addons: [],
      member: { hoursAvailable: 10, tier: "creator" },
      coupon: null,
      paymentMethod: "comp",
    });
    expect(r.subtotalCents).toBe(0);
    expect(r.totalCents).toBe(0);
  });

  it("Member with bucket exhausted (0h): all hours are overage", () => {
    // 5-hr booking × $65 = $325 base (instead of canonical $485)
    const r = calculatePricing({
      ...HALFDAY,
      member: { hoursAvailable: 0, tier: "creator" },
      paymentMethod: "comp",
    });
    expect(r.memberHoursApplied).toBe(0);
    expect(r.memberDiscountCents).toBe(48500 - 32500);
    expect(r.subtotalCents).toBe(32500);
    expect(r.totalCents).toBe(32500);
  });

  it("Add-ons are NOT discounted for members", () => {
    const r = calculatePricing({
      ...HALFDAY,
      addons: [{ slug: "strobe-1", label: "Strobe: Level One", priceCents: 11000 }],
      member: { hoursAvailable: 5, tier: "spark" },
      paymentMethod: "comp",
    });
    // base is free, but $110 add-on still charged
    expect(r.subtotalCents).toBe(11000);
    expect(r.totalCents).toBe(11000);
  });
});

describe("calculatePricing — coupons", () => {
  it("FAMTWENTY (20%) on $485: discount $97, subtotal $388", () => {
    const r = calculatePricing({
      ...HALFDAY,
      coupon: { code: "FAMTWENTY", type: "percent", value: 20 },
    });
    expect(r.couponDiscountCents).toBe(9700);
    expect(r.subtotalCents).toBe(48500 - 9700);
    expect(r.processingFeeCents).toBe(Math.round((48500 - 9700) * 0.03));
    expect(r.totalCents).toBe(r.subtotalCents + r.processingFeeCents);
  });

  it("FAMFORTY (40%)", () => {
    const r = calculatePricing({
      ...HALFDAY,
      coupon: { code: "FAMFORTY", type: "percent", value: 40 },
      paymentMethod: "comp",
    });
    expect(r.couponDiscountCents).toBe(19400);
    expect(r.totalCents).toBe(48500 - 19400);
  });

  it("FAM100 (100%) zeroes subtotal AND fee", () => {
    const r = calculatePricing({
      ...HALFDAY,
      coupon: { code: "FAM100", type: "percent", value: 100 },
    });
    expect(r.couponDiscountCents).toBe(48500);
    expect(r.subtotalCents).toBe(0);
    expect(r.processingFeeCents).toBe(0);
    expect(r.totalCents).toBe(0);
  });

  it("fixed-amount coupon (cents) capped at subtotal", () => {
    const r = calculatePricing({
      ...HALFDAY,
      coupon: { code: "MEGA", type: "fixed", value: 99999 }, // $999.99 > subtotal
      paymentMethod: "comp",
    });
    expect(r.couponDiscountCents).toBe(48500);
    expect(r.totalCents).toBe(0);
  });

  it("fixed-amount coupon partial: $50 off $485 = $435 subtotal", () => {
    const r = calculatePricing({
      ...HALFDAY,
      coupon: { code: "FIFTYOFF", type: "fixed", value: 5000 },
      paymentMethod: "comp",
    });
    expect(r.couponDiscountCents).toBe(5000);
    expect(r.subtotalCents).toBe(43500);
    expect(r.totalCents).toBe(43500);
  });
});

describe("calculatePricing — coupon + member stacked", () => {
  it("Spark 5h booking 7h with FAMTWENTY: member first → $130 base, then 20% off", () => {
    const r = calculatePricing({
      appointment: { slug: "hourly-7", hours: 7, basePriceCents: 66500 },
      addons: [],
      member: { hoursAvailable: 5, tier: "spark" },
      coupon: { code: "FAMTWENTY", type: "percent", value: 20 },
      paymentMethod: "comp",
    });
    expect(r.subtotalCents).toBe(Math.round(13000 * 0.8)); // 13000 → 10400
    expect(r.totalCents).toBe(10400);
  });
});

describe("calculatePricing — line items integrity", () => {
  it("sum of line items equals total", () => {
    const r = calculatePricing({
      ...HALFDAY,
      addons: [{ slug: "strobe-1", label: "Strobe: Level One", priceCents: 11000 }],
      coupon: { code: "FAMTWENTY", type: "percent", value: 20 },
    });
    const sum = r.lineItems.reduce((s, l) => s + l.amountCents, 0);
    expect(sum).toBe(r.totalCents);
  });

  it("includes appointment, every addon, coupon (negative), and fee (positive)", () => {
    const r = calculatePricing({
      ...HALFDAY,
      addons: [{ slug: "strobe-1", label: "Strobe: Level One", priceCents: 11000 }],
      coupon: { code: "FAMTWENTY", type: "percent", value: 20 },
    });
    const labels = r.lineItems.map((l) => l.label);
    expect(labels[0]).toMatch(/Studio booking/);
    expect(labels).toContain("Strobe: Level One");
    expect(labels.some((l) => l.includes("FAMTWENTY"))).toBe(true);
    expect(labels.some((l) => l.includes("Processing fee"))).toBe(true);
  });

  it("hides member line when no member is applied", () => {
    const r = calculatePricing(HALFDAY);
    expect(r.lineItems.find((l) => l.key === "member-hours")).toBeUndefined();
  });

  it("hides coupon line when no coupon", () => {
    const r = calculatePricing(HALFDAY);
    expect(r.lineItems.find((l) => l.key.startsWith("coupon"))).toBeUndefined();
  });
});

describe("calculatePricing — full Acuity ladder smoke", () => {
  const ladder: Array<[number, number]> = [
    [2, 20000], [3, 29500], [4, 39000], [5, 48500], [6, 57500],
    [7, 66500], [8, 75500], [9, 84000], [10, 92500], [11, 92500], [12, 92500],
  ];
  for (const [hours, cents] of ladder) {
    it(`${hours}h non-member card price = $${(cents / 100).toFixed(2)} + 3% fee`, () => {
      const r = calculatePricing({
        appointment: { slug: `hourly-${hours}`, hours, basePriceCents: cents },
        addons: [],
        member: null,
        coupon: null,
        paymentMethod: "card",
      });
      expect(r.basePriceCents).toBe(cents);
      expect(r.processingFeeCents).toBe(Math.round(cents * 0.03));
      expect(r.totalCents).toBe(cents + Math.round(cents * 0.03));
    });
  }
});
