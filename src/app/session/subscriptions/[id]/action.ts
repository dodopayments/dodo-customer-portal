"use server";

import { makeAuthenticatedRequest } from "@/lib/server-actions";
import { SubscriptionDetailsData } from "./types";

export interface CancelSubscriptionParams {
  selectedId: string;
  subscription_id: string;
  nextBillingDate?: boolean;
  revoke?: boolean;
}

export interface UpdateBillingDetailsParams {
  subscription_id: string;
  data: {
    customer: {
      name: string;
      email: string;
      phone_number: string;
    };
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
  const {
    selectedId,
    subscription_id,
    nextBillingDate = false,
    revoke = false,
  } = params;

  const response = await makeAuthenticatedRequest(
    `/customer-portal/subscriptions/cancel`,
    {
      method: "POST",
      body: JSON.stringify({
        business_id: selectedId,
        subscription_id,
        cancel_at_next_billing_date: nextBillingDate,
        revoke,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to cancel subscription: ${error}`);
  }

  return response.json();
}

export async function cancelSubscriptionLegacy(subscriptionId: string) {
  const response = await makeAuthenticatedRequest(
    `/customer-portal/subscriptions/${subscriptionId}/cancel`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to cancel subscription: ${error}`);
  }

  return response.json();
}

export async function fetchSubscription(
  id: string,
): Promise<SubscriptionDetailsData | null> {
  try {
    const response = await makeAuthenticatedRequest(
      `/customer-portal/subscriptions/${id}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch subscription: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}

export async function updateBillingDetails(params: UpdateBillingDetailsParams) {
  const { subscription_id, data } = params;
  console.log("dataaaaaaa", data);

  const patchData = {
    billing: data.billing,
    customer_name: data.customer.name,
    customer_email: data.customer.email,
    phone_number: data.customer.phone_number,
    tax_id: data.tax_id === "" ? null : data.tax_id,
  };

  const response = await makeAuthenticatedRequest(
    `/customer-portal/subscriptions/${subscription_id}`,
    {
      method: "PATCH",
      body: JSON.stringify(patchData),
    },
  );

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorText = await response.text();
      if (errorText && errorText.trim()) {
        errorMessage += `: ${errorText}`;
      } else {
        errorMessage += ` (${response.statusText || "Unknown error"})`;
      }
    } catch {
      errorMessage += ` (${response.statusText || "Unknown error"})`;
    }
    throw new Error(`Failed to update billing details: ${errorMessage}`);
  }

  return response.json();
}

export async function fetchInvoiceHistory(subscriptionId: string) {
  try {
    const response = await makeAuthenticatedRequest(
      `/customer-portal/payments?subscription_id=${subscriptionId}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch invoice history: ${response.status}`);
    }
    const data = await response.json();
    console.log(data.items);
    return data;
  } catch (error) {
    console.error("Error fetching invoice history:", error);
    return null;
  }
}

export async function fetchUsageHistory(subscriptionId: string) {
  try {
    const response = await makeAuthenticatedRequest(
      `/customer-portal/subscriptions/${subscriptionId}/usage-history`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch usage history: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching usage history:", error);
    return null;
  }
}
