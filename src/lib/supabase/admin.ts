import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the **service-role** key.
 *
 * Bypasses Row Level Security — use ONLY in server actions, route handlers,
 * and other server-side code (never reference from a client component, never
 * pass to the browser). Imported under "server-only" so a stray client import
 * fails the build instead of silently leaking the key.
 *
 * For session-aware (RLS-respecting) reads/writes done on behalf of a logged-in
 * customer, use the @supabase/ssr server client (added when we wire auth).
 */
export function supabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error(
      "supabaseAdmin: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in env.",
    );
  }
  return createClient(url, serviceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
