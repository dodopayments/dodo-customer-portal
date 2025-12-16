import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { BUSINESS_TOKEN_COOKIE_NAME, BUSINESS_TOKEN_EXPIRY_COOKIE_NAME } from "@/lib/token-helper";
import { getServerApiUrl } from "@/lib/server-http";
import parseError from "@/lib/serverErrorHelper";
import { checkBotId } from "botid/server";

async function validateBusinessToken(token: string) {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
  const api_url = await getServerApiUrl();

  const response = await fetch(`${api_url}/unified-customer-portal/businesses`, {
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

  return { success: true, redirect: "/businesses" };
}

export async function POST(request: NextRequest) {
  const verification = await checkBotId();
 
  if (verification.isBot) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const token = body.token;

    if (!token) {
      return NextResponse.json(
        { success: false, redirect: "/expired" },
        { status: 400 }
      );
    }

    const result = await validateBusinessToken(token);
    
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

  const verification = await checkBotId();
 
  if (verification.isBot) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  if (!token) {
    return NextResponse.redirect(new URL("/expired", request.url));
  }

  try {
    const result = await validateBusinessToken(token);
    
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
