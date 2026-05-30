import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { MemberTier } from "./types";

/**
 * Member free-hours engine — replaces the honor-system `2026MEMBERPS*`
 * coupons. Each member tier has a monthly allowance enforced server-side via
 * the `member_buckets` table.
 *
 * - `getMemberHoursAvailable` is the *read* path used by the pricing-quote
 *   endpoint. Does not mutate.
 * - `consumeMemberHours` is the *write* path called at booking confirmation
 *   (after payment succeeds). Lazily creates a bucket if none exists for
 *   this member's current cycle.
 *
 * The cycle boundary is a **rolling 30 days** from the member's first booking
 * (or first bucket creation) — matches `MEMBERSHIP_TERMS.billingCycleDays:30`
 * and what Stripe Subscriptions track natively (industry standard).
 *
 * IMPORTANT: `tier` must come from the authenticated member's record once
 * Supabase Auth is wired in 1.3 — never trust an unauthenticated tier claim,
 * or anyone gets a Visionary bucket by asserting it.
 */

const TIER_ALLOWANCE: Record<MemberTier, number> = {
  spark: 5,
  creator: 10,
  visionary: 20,
};

const CYCLE_LENGTH_MS = 30 * 86_400_000;

export type MemberHoursResolution = {
  hoursAvailable: number;
  tier: MemberTier;
  bucketId: string | null;
  cycleEnd: Date | null;
};

export async function getMemberHoursAvailable(input: {
  memberEmail: string;
  tier: MemberTier;
}): Promise<MemberHoursResolution> {
  const sb = supabaseAdmin();
  const email = input.memberEmail.toLowerCase().trim();
  const nowIso = new Date().toISOString();

  const { data: bucket } = await sb
    .from("member_buckets")
    .select("*")
    .eq("member_email", email)
    .lte("cycle_start", nowIso)
    .gte("cycle_end", nowIso)
    .maybeSingle();

  if (!bucket) {
    return {
      hoursAvailable: TIER_ALLOWANCE[input.tier],
      tier: input.tier,
      bucketId: null,
      cycleEnd: null,
    };
  }

  const remaining = Math.max(
    0,
    Number(bucket.hours_allowance) - Number(bucket.hours_used),
  );
  return {
    hoursAvailable: remaining,
    tier: input.tier,
    bucketId: bucket.id,
    cycleEnd: new Date(bucket.cycle_end),
  };
}

export async function consumeMemberHours(input: {
  memberEmail: string;
  tier: MemberTier;
  hoursUsed: number;
}): Promise<{ ok: true; bucketId: string } | { ok: false; reason: string }> {
  if (input.hoursUsed <= 0) return { ok: false, reason: "no_hours_to_consume" };
  const sb = supabaseAdmin();
  const email = input.memberEmail.toLowerCase().trim();
  const now = new Date();
  const nowIso = now.toISOString();

  const { data: bucket } = await sb
    .from("member_buckets")
    .select("*")
    .eq("member_email", email)
    .lte("cycle_start", nowIso)
    .gte("cycle_end", nowIso)
    .maybeSingle();

  if (bucket) {
    const newUsed = Number(bucket.hours_used) + input.hoursUsed;
    const { error } = await sb
      .from("member_buckets")
      .update({ hours_used: newUsed })
      .eq("id", bucket.id);
    if (error) return { ok: false, reason: error.message };
    return { ok: true, bucketId: bucket.id };
  }

  const cycleEnd = new Date(now.getTime() + CYCLE_LENGTH_MS);
  const { data: newBucket, error } = await sb
    .from("member_buckets")
    .insert({
      member_email: email,
      tier: input.tier,
      cycle_start: nowIso,
      cycle_end: cycleEnd.toISOString(),
      hours_allowance: TIER_ALLOWANCE[input.tier],
      hours_used: input.hoursUsed,
    })
    .select("id")
    .single();
  if (error || !newBucket) {
    return { ok: false, reason: error?.message ?? "insert_failed" };
  }
  return { ok: true, bucketId: newBucket.id };
}
