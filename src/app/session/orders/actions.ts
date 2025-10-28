"use server";

import { makeAuthenticatedRequest, PaginatedResponse, FilterParams } from "@/lib/server-actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchSubscriptions(filters: FilterParams = {}): Promise<PaginatedResponse<any>> {
  try {
    const params = new URLSearchParams();
    if (filters.created_at_gte) params.set('created_at_gte', filters.created_at_gte);
    if (filters.created_at_lte) params.set('created_at_lte', filters.created_at_lte);

    const response = await makeAuthenticatedRequest(`/customer-portal/subscriptions?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch subscriptions: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data.items || [],
      totalCount: data.total_count || 0,
      hasNext: data.has_next || false
    };
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return { data: [], totalCount: 0, hasNext: false };
  }
}

export async function fetchBusiness() {
  try {
    const response = await makeAuthenticatedRequest('/customer-portal/business');

    if (!response.ok) {
      throw new Error(`Failed to fetch business: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
}

export async function fetchOneTime(filters: FilterParams = {}): Promise<PaginatedResponse<any>> {
  try {
    const params = new URLSearchParams();
    if (filters.created_at_gte) params.set('created_at_gte', filters.created_at_gte);
    if (filters.created_at_lte) params.set('created_at_lte', filters.created_at_lte);

    const response = await makeAuthenticatedRequest(`/customer-portal/payments?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch one-time: ${response.status}`);
    }

    const data = await response.json();
    console.log("data", data);
    return {
      data: data.items || [],
      totalCount: data.items.filter((item: any) => item.subscription_id === null).length || 0,
      hasNext: data.has_next || false
    };
  } catch (error) {
    console.error('Error fetching one-time:', error);
    return { data: [], totalCount: 0, hasNext: false };
  }
}