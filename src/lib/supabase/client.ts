"use client";
import { createBrowserClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client using the **publishable (anon)** key.
 *
 * Safe to use in client components. Respects Row Level Security — only sees
 * what RLS policies allow for the current (possibly-anonymous) session. Uses
 * @supabase/ssr's createBrowserClient so cookie-based auth sessions are
 * automatically wired when we add Supabase Auth later.
 */
let _client: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "supabaseBrowser: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in env.",
    );
  }
  // CookieOptions are only used when auth sessions need them; safe to leave default here.
  _client = createBrowserClient(url, anon);
  return _client;
}

// Silence unused-import lint until we add explicit cookie-aware paths.
export type { CookieOptions };
