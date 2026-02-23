import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    const cookieStore = await cookies();

    cookieStore.delete("session_token");
    cookieStore.delete("session_expiry");
    cookieStore.delete("business_token");
    cookieStore.delete("business_expiry");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 });
  }
}
