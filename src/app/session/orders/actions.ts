"use server";

import {
  makeAuthenticatedRequest,
  FilterParams,
} from "@/lib/server-actions";
import parseError from "@/lib/serverErrorHelper";

export async function fetchSubscriptions(filters: FilterParams = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.created_at_gte)
      params.set("created_at_gte", filters.created_at_gte);
    if (filters.created_at_lte)
      params.set("created_at_lte", filters.created_at_lte);

    const response = await makeAuthenticatedRequest(
      `/customer-portal/subscriptions?${params}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch subscriptions: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data.items || [],
      totalCount: data.total_count || 0,
      hasNext: data.has_next || false,
    };
  } catch (error) {
    parseError(error, "Failed to fetch subscriptions");
    return { data: [], totalCount: 0, hasNext: false };
  }
}

export async function fetchBusiness() {
  try {
    const response = await makeAuthenticatedRequest(
      "/customer-portal/business"
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch business: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    parseError(error, "Failed to fetch business");
    return null;
  }
}

export async function fetchPayments(
  pageNumber: number = 0,
  pageSize: number = 50,
) {
  try {
    const params = new URLSearchParams();
    params.set("page_size", pageSize.toString());
    params.set("page_number", pageNumber.toString());

    const response = await makeAuthenticatedRequest(
      `/customer-portal/payments?${params}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch one-time: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data.items || [],
      totalCount: data.total_count ?? data.items?.length ?? 0,
      hasNext: data.has_next || false,
    };
  } catch (error) {
    parseError(error, "Failed to fetch payments");
    return { data: [], totalCount: 0, hasNext: false };
  }
}

export async function fetchRefunds(
  pageNumber: number = 0,
  pageSize: number = 50,
) {
  try {
    const params = new URLSearchParams();
    params.set("page_size", pageSize.toString());
    params.set("page_number", pageNumber.toString());

    const response = await makeAuthenticatedRequest(
      `/customer-portal/refunds?${params}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch refunds: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data.items || [],
      totalCount: data.total_count ?? data.items?.length ?? 0,
      hasNext: data.has_next || false,
    };
  } catch (error) {
    parseError(error, "Failed to fetch refunds");
    return { data: [], totalCount: 0, hasNext: false };
  }
}

export async function getProductCart(payment_id: string) {
  try {
    const response = await makeAuthenticatedRequest(
      `/customer-portal/payments/${payment_id}/product-cart`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch product cart: ${response.status}`);
    }
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    parseError(error, "Failed to fetch product cart");
    return null;
  }
}
