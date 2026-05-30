/**
 * POST /auth/signout
 *
 * Server-side sign-out. Clears the Supabase auth cookies and redirects back
 * to /book-native. POST-only so links/buttons can't trigger sign-out via a
 * stray prefetch.
 */

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const sb = await supabaseServer();
  await sb.auth.signOut();
  return NextResponse.redirect(new URL("/book-native", req.url), { status: 303 });
}
