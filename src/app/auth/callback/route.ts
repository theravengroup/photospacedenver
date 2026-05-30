/**
 * GET /auth/callback
 *
 * Supabase Auth magic-link landing pad. The auth email contains a link of
 * the form `/auth/callback?code=...&next=/book-studio`. We exchange the
 * code for a session, set the cookie, then redirect the user back to
 * `next` (or `/book-studio` by default).
 */

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/book-studio";

  if (!code) {
    return NextResponse.redirect(
      new URL(`/book-studio?auth_error=missing_code`, req.url),
    );
  }

  const sb = await supabaseServer();
  const { error } = await sb.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(
        `/book-studio?auth_error=${encodeURIComponent(error.message)}`,
        req.url,
      ),
    );
  }

  // Avoid double-encoding "next" — if it's already a path, redirect directly.
  const safeNext = next.startsWith("/") ? next : "/book-studio";
  return NextResponse.redirect(new URL(safeNext, req.url));
}
