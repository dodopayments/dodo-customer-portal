import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { api_url } from "@/lib/http";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/expired', request.url));
  }

  try {
    const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

    const response = await fetch(`${api_url}/customer-portal/business`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.redirect(new URL('/expired', request.url));
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
      expires: new Date(expiresAt),
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });

    cookieStore.set('session_expiry', expiresAt.toString(), {
      expires: new Date(expiresAt),
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });

    return NextResponse.redirect(new URL('/session/billing-history', request.url));
  } catch (error) {
    console.error('Token validation failed:', error);
    return NextResponse.redirect(new URL('/expired', request.url));
  }
}
