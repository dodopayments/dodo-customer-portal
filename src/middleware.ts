import { NextRequest, NextResponse } from "next/server";
import { locales } from "@/i18n/config";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const response = NextResponse.next();

  // Persist forceLanguage query param as a cookie (used in iframes / Safari fallback)
  const forceLanguage = searchParams.get("forceLanguage")?.toLowerCase();
  if (forceLanguage && locales.includes(forceLanguage as (typeof locales)[number])) {
    response.cookies.set("NEXT_LOCALE", forceLanguage, {
      sameSite: "none",
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  // Session token guards
  if (pathname.startsWith("/session/")) {
    const sessionToken = request.cookies.get("session_token");
    if (!sessionToken?.value) {
      return NextResponse.redirect(new URL("/expired", request.url));
    }
  }

  if (pathname.startsWith("/businesses")) {
    const businessToken = request.cookies.get("business_token");
    if (!businessToken?.value) {
      return NextResponse.redirect(new URL("/expired", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/session/overview/:path*",
    "/session/orders/:path*",
    "/session/subscriptions/:path*",
    "/session/payment-methods/:path*",
    "/session/profile/:path*",
    "/businesses/:path*",
  ],
};
