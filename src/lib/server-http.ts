import { headers } from "next/headers";

type Mode = "live" | "test";

type HeaderLike = { get(name: string): string | null };

// Server-side mode resolution from headers
export function resolveModeFromHost(h: HeaderLike): Mode {
  const host = h.get("host") || "";
  
  // Check for localhost ports
  if (host.includes("localhost:3000")) {
    return "live";
  }
  if (host.includes("localhost:3001")) {
    return "live";
  }
  
  // Check subdomain convention: 'customer' subdomain means live; otherwise test
  const subdomain = host.split(".")[0];
  return subdomain === "customer" ? "live" : "test";
}

export function getOrigin(h: HeaderLike): string {
  const proto =
    h.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const host = h.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}

export async function getServerHeaders() {
  // Small helper to get a snapshot of headers in server context (Next 15: async)
  return await headers();
}

export async function getServerApiUrl(): Promise<string> {
  const h = await getServerHeaders();
  const mode = resolveModeFromHost(h);
  return mode === "live"
    ? process.env.NEXT_PUBLIC_LIVE_URL!
    : process.env.NEXT_PUBLIC_TEST_URL!;
}

export async function getServerMode(): Promise<Mode> {
  const h = await getServerHeaders();
  return resolveModeFromHost(h);
}
