import { NextRequest, NextResponse } from "next/server";
import { locales, LOCALE_COOKIE_OPTIONS } from "@/i18n/config";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Normalize BCP 47 tags (e.g. "en-US" → "en") and persist as cookie.
  const rawForceLanguage = searchParams.get("forceLanguage");
  const forceLanguage = rawForceLanguage?.toLowerCase().split("-")[0];
  const isValidLocale =
    !!forceLanguage &&
    locales.includes(forceLanguage as (typeof locales)[number]);

  // Apply cookie to all response branches, including auth redirects.
  const withLocaleCookie = (res: NextResponse): NextResponse => {
    if (isValidLocale) {
      res.cookies.set("NEXT_LOCALE", forceLanguage!, LOCALE_COOKIE_OPTIONS);
    }
    return res;
  };

  // Session token guards
  if (pathname.startsWith("/session/")) {
    const sessionToken = request.cookies.get("session_token");
    if (!sessionToken?.value) {
      return withLocaleCookie(
        NextResponse.redirect(new URL("/expired", request.url))
      );
    }
  }

  if (pathname.startsWith("/businesses")) {
    const businessToken = request.cookies.get("business_token");
    if (!businessToken?.value) {
      return withLocaleCookie(
        NextResponse.redirect(new URL("/expired", request.url))
      );
    }
  }

  return withLocaleCookie(NextResponse.next());
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
