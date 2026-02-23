"use server";

import { makeAuthenticatedRequest } from "@/lib/server-actions";
import { UserResponse, CreditEntitlementItem, CreditLedgerItem } from "./types";
import parseError from "@/lib/serverErrorHelper";

export async function fetchUser(): Promise<UserResponse | null> {
  try {
    const response = await makeAuthenticatedRequest("/customer-portal/profile");

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    parseError(error, "Failed to fetch user");
    return null;
  }
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
    parseError(error, "Failed to fetch wallets");
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
    parseError(error, "Failed to fetch wallet ledger");
    return { data: [], totalCount: 0, hasNext: false };
  }
}


export async function fetchCreditEntitlements(): Promise<{
  items: CreditEntitlementItem[];
} | null> {
  try {
    const response = await makeAuthenticatedRequest(
      "/customer-portal/credit-entitlements"
    );
    if (response.status === 404) {
      return { items: [] };
    }
    if (!response.ok) {
      throw new Error(
        `Failed to fetch credit entitlements: ${response.status}`
      );
    }
    const data = await response.json();
    return { items: data.items || [] };
  } catch (error) {
    parseError(error, "Failed to fetch credit entitlements");
    return null;
  }
}

export async function fetchCreditEntitlementLedger({
  creditEntitlementId,
  pageNumber = 0,
  pageSize = 50,
}: {
  creditEntitlementId: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<{
  data: CreditLedgerItem[];
  totalCount: number;
  hasNext: boolean;
}> {
  try {
    const params = new URLSearchParams();
    params.set("page_size", pageSize.toString());
    params.set("page_number", pageNumber.toString());

    const response = await makeAuthenticatedRequest(
      `/customer-portal/credit-entitlements/${creditEntitlementId}/ledger?${params}`
    );
    if (response.status === 404) {
      return { data: [], totalCount: 0, hasNext: false };
    }
    if (!response.ok) {
      throw new Error(
        `Failed to fetch credit entitlement ledger: ${response.status}`
      );
    }
    const data = await response.json();
    const items = data.items || [];
    return {
      data: items,
      totalCount: items.length,
      hasNext: items.length === pageSize,
    };
  } catch (error) {
    parseError(error, "Failed to fetch credit entitlement ledger");
    return { data: [], totalCount: 0, hasNext: false };
  }
}
