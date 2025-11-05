"use server";

import { cookies } from "next/headers";
import { getServerApiUrl } from "./server-http";

export async function getToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("session_token")?.value || null;
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

  const api_url = await getServerApiUrl();
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");

  return fetch(`${api_url}${endpoint}`, {
    ...options,
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

export async function fetchBusiness() {
  try {
    const response = await makeAuthenticatedRequest(
      "/customer-portal/business",
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch business: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching business:", error);
    return null;
  }
}
