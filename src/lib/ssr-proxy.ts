import "server-only";

import { getServerMode } from "@/lib/server-http";

export type ProxyTargetBackend = "live" | "test" | "internal" | "affiliates";
export type ProxyMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface SsrProxyRequestOptions {
  path: string;
  method: ProxyMethod;
  targetBackend?: ProxyTargetBackend;
  headers?: HeadersInit;
  body?: BodyInit | object | null;
  cache?: RequestCache;
}

function readRequiredEnv(name: "SSR_PROXY_BASE_URL" | "SSR_PROXY_SECRET"): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required for server-side SSR proxy requests`);
  }
  return value;
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function normalizeProxyBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

async function resolveTargetBackend(
  override?: ProxyTargetBackend,
): Promise<ProxyTargetBackend> {
  if (override) {
    return override;
  }

  const mode = await getServerMode();
  return mode === "live" ? "live" : "test";
}

function resolveBodyAndHeaders(
  body: SsrProxyRequestOptions["body"],
  headers: Headers,
): BodyInit | undefined {
  if (body == null) {
    return undefined;
  }

  if (
    typeof body === "string" ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    body instanceof ReadableStream
  ) {
    return body;
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return JSON.stringify(body);
}

export async function ssrProxyFetch({
  path,
  method,
  targetBackend,
  headers,
  body,
  cache,
}: SsrProxyRequestOptions): Promise<Response> {
  const proxyBaseUrl = normalizeProxyBaseUrl(readRequiredEnv("SSR_PROXY_BASE_URL"));
  const proxySecret = readRequiredEnv("SSR_PROXY_SECRET");
  const resolvedTargetBackend = await resolveTargetBackend(targetBackend);

  const requestHeaders = new Headers(headers);
  requestHeaders.set("X-Proxy-Secret", proxySecret);
  requestHeaders.set("X-Target-Backend", resolvedTargetBackend);

  const resolvedBody = resolveBodyAndHeaders(body, requestHeaders);

  return fetch(`${proxyBaseUrl}${normalizePath(path)}`, {
    method,
    headers: requestHeaders,
    body: resolvedBody,
    cache,
  });
}
