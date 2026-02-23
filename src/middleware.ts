import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  return NextResponse.next();
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

