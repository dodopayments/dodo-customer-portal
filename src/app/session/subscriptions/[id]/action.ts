"use server";

import { makeAuthenticatedRequest } from "@/lib/server-actions";
import { SubscriptionDetailsData } from "./types";

export interface CancelSubscriptionParams {
  subscription_id: string;
  cancelAtNextBillingDate?: boolean;
  revokeCancelation?: boolean;
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

export async function cancelSubscription({
  subscription_id,
  cancelAtNextBillingDate,
  revokeCancelation,
}: CancelSubscriptionParams) {
  let url = `/customer-portal/subscriptions/${subscription_id}`;
  let options: RequestInit;

  if (cancelAtNextBillingDate !== undefined) {
    options = {
      method: "PATCH",
      body: JSON.stringify({
        cancel_at_next_billing_date: !!cancelAtNextBillingDate,
      }),
    };
  } else if (revokeCancelation) {
    options = {
      method: "PATCH",
      body: JSON.stringify({ cancel_at_next_billing_date: false }),
    };
  } else {
    url += "/cancel";
    options = {
      method: "POST",
      body: JSON.stringify({}),
    };
  }

  const response = await makeAuthenticatedRequest(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    let operation = "cancel subscription";
    if (cancelAtNextBillingDate) {
      operation = "set cancel at next billing date";
    } else if (revokeCancelation) {
      operation = "revoke cancelation";
    } else {
      operation = "cancel subscription immediately";
    }
    throw new Error(`Failed to ${operation}: ${errorText}`);
  }

  return response.json();
}

export async function fetchSubscription(
  id: string
): Promise<SubscriptionDetailsData | null> {
  try {
    const response = await makeAuthenticatedRequest(
      `/customer-portal/subscriptions/${id}`
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
    }
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
      `/customer-portal/payments?subscription_id=${subscriptionId}`
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
      `/customer-portal/subscriptions/${subscriptionId}/usage-history`
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
