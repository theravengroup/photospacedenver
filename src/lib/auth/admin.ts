import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";

/**
 * Admin gate — pulled out of every admin page so the check lives in one
 * place. ADMIN_EMAILS is a comma-separated env list of allowed admin
 * emails (case-insensitive). Anyone signed in with one of those emails
 * gets through; everyone else gets redirected to /book-studio.
 *
 * Future: replace with a proper roles table (members.role = 'admin' or
 * dedicated admins table) once we have more than two admins.
 */

const FALLBACK_ADMINS = ["hello@danjahn.com", "hello@photospacedenver.com"];

export function adminEmails(): string[] {
  const fromEnv = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : FALLBACK_ADMINS;
}

export async function requireAdmin(): Promise<{ email: string }> {
  const user = await getCurrentUser();
  if (!user?.email) {
    redirect("/book-studio?signin=1&next=/admin");
  }
  const email = user.email.toLowerCase();
  if (!adminEmails().includes(email)) {
    redirect("/book-studio?forbidden=1");
  }
  return { email };
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user?.email && adminEmails().includes(user.email.toLowerCase());
}
