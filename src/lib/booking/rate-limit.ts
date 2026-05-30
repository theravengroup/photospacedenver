import "server-only";

/**
 * Tiny in-memory token-bucket rate limiter for the public booking APIs.
 *
 * Why in-memory: Vercel Fluid Compute reuses function instances across
 * concurrent requests, so a Map of buckets in module scope survives across
 * the warm window. Cold starts reset state, which is fine — a fresh
 * instance gives the abuser ~10 attempts before being throttled again.
 *
 * Why not Upstash/Redis: this is the parallel-test window. We get 95% of
 * the protection for 0% of the operational overhead. Swap to Upstash if
 * we see attack volume.
 *
 * IP detection: x-forwarded-for first hop, falls back to remote address.
 * For real abuse prevention you'd want Vercel BotID, but for accidental
 * spammy clients this is the right tool.
 */

type Bucket = {
  /** Float number of tokens; decremented per request, refilled over time. */
  tokens: number;
  /** Last time we touched this bucket (ms epoch). */
  lastRefill: number;
};

const buckets = new Map<string, Bucket>();

/** Best-effort housekeeping to keep the map from growing forever. */
const MAX_BUCKETS = 5000;
function maybeEvict() {
  if (buckets.size <= MAX_BUCKETS) return;
  // Drop the oldest 25%.
  const entries = [...buckets.entries()].sort((a, b) => a[1].lastRefill - b[1].lastRefill);
  for (let i = 0; i < Math.floor(entries.length * 0.25); i++) {
    buckets.delete(entries[i][0]);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  /** Whole-number tokens left at the moment of this call. */
  remaining: number;
  /** ms until full refill. */
  resetMs: number;
};

/**
 * Check + decrement.
 * @param key  unique per-client identifier (typically the IP)
 * @param limit  max burst
 * @param refillPerSec  steady-state allowed rate (tokens / sec)
 */
export function rateLimit(
  key: string,
  limit: number,
  refillPerSec: number,
  now = Date.now(),
): RateLimitResult {
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { tokens: limit, lastRefill: now };
    buckets.set(key, bucket);
    maybeEvict();
  } else {
    const elapsedSec = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(limit, bucket.tokens + elapsedSec * refillPerSec);
    bucket.lastRefill = now;
  }

  if (bucket.tokens < 1) {
    const resetMs = ((1 - bucket.tokens) / refillPerSec) * 1000;
    return { allowed: false, remaining: 0, resetMs };
  }

  bucket.tokens -= 1;
  return {
    allowed: true,
    remaining: Math.floor(bucket.tokens),
    resetMs: ((limit - bucket.tokens) / refillPerSec) * 1000,
  };
}

/** Pull the client IP out of a Request. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/** Standard "you've been rate-limited" headers + 429 response builder. */
export function rateLimitHeaders(result: RateLimitResult, limit: number): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "Retry-After": String(Math.ceil(result.resetMs / 1000)),
  };
}
