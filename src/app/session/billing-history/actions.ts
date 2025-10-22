"use server";

import { cookies } from "next/headers";
import { api_url } from "@/lib/http";

export interface PaymentFilters {
  pageSize?: number;
  pageNumber?: number;
  created_at_gte?: string;
  created_at_lte?: string;
  status?: string;
}

export interface RefundFilters {
  pageSize?: number;
  pageNumber?: number;
  created_at_gte?: string;
  created_at_lte?: string;
  status?: string;
}

async function getToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('session_token')?.value || null;
  } catch {
    return null;
  }
}

export async function fetchPayments(filters: PaymentFilters = {}) {
  try {
    const token = await getToken();
    if (!token) throw new Error('No token found');

    const params = new URLSearchParams();
    if (filters.pageSize) params.set('page_size', filters.pageSize.toString());
    if (filters.pageNumber !== undefined) params.set('page_number', filters.pageNumber.toString());
    if (filters.created_at_gte) params.set('created_at_gte', filters.created_at_gte);
    if (filters.created_at_lte) params.set('created_at_lte', filters.created_at_lte);
    if (filters.status) params.set('status', filters.status);

    const response = await fetch(`${api_url}/customer-portal/payments?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

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

export async function fetchRefunds(filters: RefundFilters = {}) {
  try {
    const token = await getToken();
    if (!token) throw new Error('No token found');

    const params = new URLSearchParams();
    if (filters.pageSize) params.set('page_size', filters.pageSize.toString());
    if (filters.pageNumber !== undefined) params.set('page_number', filters.pageNumber.toString());
    if (filters.created_at_gte) params.set('created_at_gte', filters.created_at_gte);
    if (filters.created_at_lte) params.set('created_at_lte', filters.created_at_lte);
    if (filters.status) params.set('status', filters.status);

    const response = await fetch(`${api_url}/customer-portal/refunds?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

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
    const token = await getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${api_url}/customer-portal/business`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch business: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
}
