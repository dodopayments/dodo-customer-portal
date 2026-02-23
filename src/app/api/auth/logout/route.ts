import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete("session_token");
  cookieStore.delete("session_expiry");
  cookieStore.delete("business_token");
  cookieStore.delete("business_expiry");

  return NextResponse.json({ success: true });
}
