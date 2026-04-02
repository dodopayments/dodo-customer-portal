import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { BUSINESS_TOKEN_COOKIE_NAME, BUSINESS_TOKEN_EXPIRY_COOKIE_NAME } from "@/lib/token-helper";
import parseError from "@/lib/serverErrorHelper";
import { ssrProxyFetch } from "@/lib/ssr-proxy";

async function validateBusinessToken(token: string, nextUrl?: string | null) {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

  const response = await ssrProxyFetch({
    path: "/unified-customer-portal/businesses",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      return { success: false, redirect: "/expired" };
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(BUSINESS_TOKEN_COOKIE_NAME, token, {
    expires: new Date(expiresAt),
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  cookieStore.set(BUSINESS_TOKEN_EXPIRY_COOKIE_NAME, expiresAt.toString(), {
    expires: new Date(expiresAt),
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  const redirectUrl = nextUrl && nextUrl.startsWith("/") ? nextUrl : "/businesses";

  return { success: true, redirect: redirectUrl };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body.token;
    const next = body.next;

    if (!token) {
      return NextResponse.json(
        { success: false, redirect: "/expired" },
        { status: 400 }
      );
    }

    const result = await validateBusinessToken(token, next);
    
    return NextResponse.json(result);
  } catch (error) {
    parseError(error, "Token validation failed");
    return NextResponse.json(
      { success: false, redirect: "/expired" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const next = searchParams.get("next");

  if (!token) {
    return NextResponse.redirect(new URL("/expired", request.url));
  }

  try {
    const result = await validateBusinessToken(token, next);
    
    if (result.success) {
      return NextResponse.redirect(
        new URL(result.redirect, request.url)
      );
    } else {
      return NextResponse.redirect(new URL(result.redirect, request.url));
    }
  } catch (error) {
    parseError(error, "Token validation failed");
    return NextResponse.redirect(new URL("/expired", request.url));
  }
}
