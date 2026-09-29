import type { NextRequest } from "next/server";

export const AUTH_COOKIE = "studio_auth";

/** The dev-only "studio" default is never accepted in production. */
export function getDashboardPassword(): string | null {
  const configured = process.env.DASHBOARD_PASSWORD;
  if (configured) return configured;
  return process.env.NODE_ENV === "production" ? null : "studio";
}

/** Cookie value derived from the password, so the password itself never sits in the browser. */
export async function sessionToken(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`klick-dashboard:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function isAuthorized(req: NextRequest): Promise<boolean> {
  const password = getDashboardPassword();
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!password || !token) return false;
  return safeEqual(token, await sessionToken(password));
}
