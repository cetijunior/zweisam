import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api")) {
    if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/login")) {
      const token = request.cookies.get("studio_auth")?.value;
      const expected = process.env.DASHBOARD_PASSWORD ?? "studio";
      if (token !== expected) {
        return NextResponse.redirect(new URL("/dashboard/login", request.url));
      }
    }
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
