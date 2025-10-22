"use server";

import { makeAuthenticatedRequest, PaginatedResponse, FilterParams } from "@/lib/server-actions";

export interface PaymentFilters extends FilterParams {}

export interface RefundFilters extends FilterParams {}

export async function fetchPayments(filters: PaymentFilters = {}): Promise<PaginatedResponse<any>> {
  try {
    const params = new URLSearchParams();
    if (filters.pageSize) params.set('page_size', filters.pageSize.toString());
    if (filters.pageNumber !== undefined) params.set('page_number', filters.pageNumber.toString());
    if (filters.created_at_gte) params.set('created_at_gte', filters.created_at_gte);
    if (filters.created_at_lte) params.set('created_at_lte', filters.created_at_lte);
    if (filters.status) params.set('status', filters.status);

    const response = await makeAuthenticatedRequest(`/customer-portal/payments?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch payments: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data.items || [],
      totalCount: data.total_count || 0,
      hasNext: data.has_next || false
    };
  } catch (error) {
    console.error('Error fetching payments:', error);
    return { data: [], totalCount: 0, hasNext: false };
  }
}

export async function fetchRefunds(filters: RefundFilters = {}): Promise<PaginatedResponse<any>> {
  try {
    const params = new URLSearchParams();
    if (filters.pageSize) params.set('page_size', filters.pageSize.toString());
    if (filters.pageNumber !== undefined) params.set('page_number', filters.pageNumber.toString());
    if (filters.created_at_gte) params.set('created_at_gte', filters.created_at_gte);
    if (filters.created_at_lte) params.set('created_at_lte', filters.created_at_lte);
    if (filters.status) params.set('status', filters.status);

    const response = await makeAuthenticatedRequest(`/customer-portal/refunds?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch refunds: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data.items || [],
      totalCount: data.total_count || 0,
      hasNext: data.has_next || false
    };
  } catch (error) {
    console.error('Error fetching refunds:', error);
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
