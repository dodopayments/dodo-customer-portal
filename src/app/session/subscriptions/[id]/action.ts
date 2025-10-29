"use server";

import { makeAuthenticatedRequest, PaginatedResponse, FilterParams } from "@/lib/server-actions";
import { SubscriptionResponse } from "@/types/subscription";

export interface CancelSubscriptionParams {
  selectedId: string;
  subscription_id: string;
  nextBillingDate?: boolean;
  revoke?: boolean;
}

export interface UpdateBillingDetailsParams {
  subscription_id: string;
  data: {
    billing: {
      city: string;
      country: string;
      state: string;
      street: string;
      zipcode: string;
    };
    tax_id?: string | null;
  };
}

export async function cancelSubscription(params: CancelSubscriptionParams) {
  const { selectedId, subscription_id, nextBillingDate = false, revoke = false } = params;

  const response = await makeAuthenticatedRequest(`/customer-portal/subscriptions/cancel`, {
    method: 'POST',
    body: JSON.stringify({
      business_id: selectedId,
      subscription_id,
      cancel_at_next_billing_date: nextBillingDate,
      revoke,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to cancel subscription: ${error}`);
  }

  return response.json();
}

export async function cancelSubscriptionLegacy(subscriptionId: string) {
  const response = await makeAuthenticatedRequest(`/customer-portal/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to cancel subscription: ${error}`);
  }

  return response.json();
}

export async function fetchBusiness() {
  try {
    const response = await makeAuthenticatedRequest('/customer-portal/business');
    return response.json();
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchSubscriptions(filters: FilterParams = {}): Promise<PaginatedResponse<any>> {
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

export async function fetchSubscription(id: string): Promise<SubscriptionResponse | null> {
    try {
        const allSubscriptions = await fetchSubscriptions();
        const subscription = allSubscriptions.data.find((subscription: any) => subscription.subscription_id === id);
        if (subscription) {
            return subscription;
        }
        return null;
    } catch (error) {
        console.error('Error fetching subscription:', error);
        throw new Error('Failed to fetch subscription');
    }
}

export async function updateBillingDetails(params: UpdateBillingDetailsParams) {
  const { subscription_id, data } = params;

  const patchData = {
    billing: data.billing,
    tax_id: data.tax_id === "" ? null : data.tax_id,
  };

  const response = await makeAuthenticatedRequest(`/customer-portal/subscriptions/${subscription_id}`, {
    method: 'PATCH',
    body: JSON.stringify(patchData),
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorText = await response.text();
      if (errorText && errorText.trim()) {
        errorMessage += `: ${errorText}`;
      } else {
        errorMessage += ` (${response.statusText || 'Unknown error'})`;
      }
    } catch {
      errorMessage += ` (${response.statusText || 'Unknown error'})`;
    }
    throw new Error(`Failed to update billing details: ${errorMessage}`);
  }

  return response.json();
}

export async function fetchInvoiceHistory(subscriptionId: string) {
  try {
    const response = await makeAuthenticatedRequest(`/customer-portal/payments?subscription_id=${subscriptionId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch invoice history: ${response.status}`);
    }
    const data = await response.json();
    console.log(data.items);
    return data;
  } catch (error) {
    console.error('Error fetching invoice history:', error);
    return null;
  }
}
