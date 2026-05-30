import "server-only";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client bound to the **request's auth cookies**.
 *
 * Use this in route handlers / server components when you need to know
 * whether the visitor is signed in. It respects RLS (queries run as the
 * authenticated user), so server-only writes that need to bypass RLS must
 * still go through `supabaseAdmin`.
 */
export async function supabaseServer(): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "supabaseServer: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in env.",
    );
  }

  const cookieStore = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Server Components can't mutate cookies — safe to ignore here;
          // the middleware refresh path handles those cases.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // see above
        }
      },
    },
  });
}

/** Convenience: returns the authenticated user record, or null. */
export async function getCurrentUser() {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  return user;
}

export type MemberRow = {
  id: string;
  user_id: string | null;
  email: string;
  tier: "spark" | "creator" | "visionary";
  status: "active" | "paused" | "cancelled";
  display_name: string | null;
};

/**
 * Look up the active member record for the currently-authenticated user.
 * Returns null if not signed in, no member row exists, or status is not
 * `active`.
 */
export async function getCurrentMember(): Promise<MemberRow | null> {
  const user = await getCurrentUser();
  if (!user?.email) return null;
  const sb = await supabaseServer();
  const { data } = await sb
    .from("members")
    .select("id, user_id, email, tier, status, display_name")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();
  if (data) return data as MemberRow;

  // Fall back to an email-based lookup so admin can seed members BEFORE
  // they've ever signed in (and we still resolve them after first sign-in).
  const { data: byEmail } = await sb
    .from("members")
    .select("id, user_id, email, tier, status, display_name")
    .eq("email", user.email.toLowerCase())
    .eq("status", "active")
    .maybeSingle();
  return (byEmail as MemberRow | null) ?? null;
}
