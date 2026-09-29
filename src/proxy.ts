import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "./lib/auth";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api")) {
    if (
      pathname.startsWith("/dashboard") &&
      !pathname.startsWith("/dashboard/login") &&
      !(await isAuthorized(request))
    ) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
