"use server";

import { makeAuthenticatedRequest } from "@/lib/server-actions";

export interface UserResponse {
  business_id: string;
  created_at: string;
  customer_id: string;
  email: string;
  name: string;
  phone_number: string;
}

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

export async function fetchWalletLedger() {
  try {
    const response = await makeAuthenticatedRequest(
      `/customer-portal/wallets/ledger-entries`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch wallet ledger: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching wallet ledger:", error);
    return null;
  }
}
