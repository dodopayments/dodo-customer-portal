"use server";

import { makeAuthenticatedRequest } from "@/lib/server-actions";
import { UserResponse } from "./types";

export async function fetchUser(): Promise<UserResponse> {
  const response = await makeAuthenticatedRequest("/customer-portal/profile");

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }

  return response.json();
}

export async function fetchWallets() {
  try {
    const response = await makeAuthenticatedRequest("/customer-portal/wallets");
    if (!response.ok) {
      throw new Error(`Failed to fetch wallets: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return null;
  }
}

export async function fetchWalletLedger({
  currency,
  pageNumber = 0,
  pageSize = 50,
}: {
  currency: string;
  pageNumber?: number;
  pageSize?: number;
}) {
  try {
    const params = new URLSearchParams();
    params.set("currency", currency);
    params.set("page_size", pageSize.toString());
    params.set("page_number", pageNumber.toString());

    const response = await makeAuthenticatedRequest(
      `/customer-portal/wallets/ledger-entries?${params}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch wallet ledger: ${response.status}`);
    }
    const data = await response.json();
    return {
      data: data.items || [],
      totalCount: data.total_count || 0,
      hasNext: data.has_next || false,
    };
  } catch (error) {
    console.error("Error fetching wallet ledger:", error);
    return { data: [], totalCount: 0, hasNext: false };
  }
}
