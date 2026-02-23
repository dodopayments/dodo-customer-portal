"use server";

import { cookies } from "next/headers";
import { cache } from "react";
import parseError from "./serverErrorHelper";
import { ssrProxyFetch } from "./ssr-proxy";

type ProxyMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function resolveMethod(method: string | undefined): ProxyMethod {
  const normalized = method?.toUpperCase();
  if (
    normalized === "GET" ||
    normalized === "POST" ||
    normalized === "PUT" ||
    normalized === "PATCH" ||
    normalized === "DELETE"
  ) {
    return normalized;
  }
  return "GET";
}

export async function getToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("session_token")?.value || null;
  } catch {
    return null;
  }
}

export async function getBusinessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("business_token")?.value || null;
  } catch {
    return null;
  }
}

export async function makeAuthenticatedRequest(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");

  return ssrProxyFetch({
    path: endpoint,
    method: resolveMethod(options.method),
    body: options.body,
    cache: "no-store",
    headers,
  });
}

export async function makeAuthenticatedBusinessRequest(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getBusinessToken();
  if (!token) {
    throw new Error("No business authentication token found");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");

  return ssrProxyFetch({
    path: endpoint,
    method: resolveMethod(options.method),
    body: options.body,
    cache: "no-store",
    headers,
  });
}


export interface FilterParams {
  pageSize?: number;
  pageNumber?: number;
  created_at_gte?: string;
  created_at_lte?: string;
  status?: string;
}

const fetchBusinessUncached = async () => {
  try {
    const token = await getToken();
    if (!token) return null;

    const headers = new Headers();
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("Content-Type", "application/json");

    const response = await ssrProxyFetch({
      path: "/customer-portal/business",
      method: "GET",
      cache: "no-store",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch business: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    parseError(error, "Failed to fetch business");
    return null;
  }
};

export const fetchBusiness = cache(fetchBusinessUncached);

export async function logout() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete("session_token");
    cookieStore.delete("session_expiry");
    cookieStore.delete("business_token");
    cookieStore.delete("business_expiry");
    cookieStore.delete("theme_mode");

    return { success: true };
  } catch (error) {
    parseError(error, "Server logout failed");
    return { success: false, error: "Failed to logout" };
  }
}
