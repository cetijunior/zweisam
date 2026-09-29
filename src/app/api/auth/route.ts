import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  getDashboardPassword,
  safeEqual,
  sessionToken,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  const expected = getDashboardPassword();
  if (!expected) {
    return NextResponse.json(
      { error: "DASHBOARD_PASSWORD is not configured" },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const password = String(body.password ?? "");
  if (!safeEqual(password, expected)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, await sessionToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
