"use server";

import { makeAuthenticatedRequest, PaginatedResponse, FilterParams } from "@/lib/server-actions";

export interface SubscriptionFilters extends FilterParams {}

export async function fetchSubscriptions(filters: SubscriptionFilters = {}): Promise<PaginatedResponse<any>> {
  try {
    const params = new URLSearchParams();
    if (filters.pageSize) params.set('page_size', filters.pageSize.toString());
    if (filters.pageNumber !== undefined) params.set('page_number', filters.pageNumber.toString());
    if (filters.created_at_gte) params.set('created_at_gte', filters.created_at_gte);
    if (filters.created_at_lte) params.set('created_at_lte', filters.created_at_lte);
    if (filters.status) params.set('status', filters.status);

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
