import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import parseError from "@/lib/serverErrorHelper";
import { ssrProxyFetch } from "@/lib/ssr-proxy";

async function validateToken(token: string) {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

  const response = await ssrProxyFetch({
    path: "/customer-portal/business",
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

  // Parse business data to extract theme_mode
  let themeMode: string | undefined;
  try {
    const businessData = await response.json();
    themeMode = businessData?.theme_mode;
  } catch {
    // If body parsing fails, proceed without theme_mode cookie
  }

  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    expires: new Date(expiresAt),
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  cookieStore.set("session_expiry", expiresAt.toString(), {
    expires: new Date(expiresAt),
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  // Store theme_mode so the root layout can set forcedTheme without an API call
  if (themeMode === "light" || themeMode === "dark" || themeMode === "system") {
    cookieStore.set("theme_mode", themeMode, {
      expires: new Date(expiresAt),
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });
  }

  return { success: true, redirect: "/session/overview" };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body.token;

    if (!token) {
      return NextResponse.json(
        { success: false, redirect: "/expired" },
        { status: 400 }
      );
    }

    const result = await validateToken(token);
    
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

  if (!token) {
    return NextResponse.redirect(new URL("/expired", request.url));
  }

  try {
    const result = await validateToken(token);
    
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
