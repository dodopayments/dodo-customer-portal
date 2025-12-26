import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getServerApiUrl } from "@/lib/server-http";
import parseError from "@/lib/serverErrorHelper";

async function validateToken(token: string) {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
  const api_url = await getServerApiUrl();

  const response = await fetch(`${api_url}/customer-portal/business`, {
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

  return { success: true, redirect: "/session/subscriptions" };
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
