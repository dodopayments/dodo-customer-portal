"use server";

import { makeAuthenticatedRequest, getToken } from "@/lib/server-actions";
import {
  SubscriptionDetailsData,
  CancelSubscriptionParams,
  UpdateBillingDetailsParams,
  ChangeSubscriptionPlanParams,
  ChangeSubscriptionPlanPreviewParams,
  ChangeSubscriptionPlanPreviewResponse,
  ProductCollectionData,
} from "./types";
import { PaymentMethodItem } from "@/app/session/payment-methods/type";
import parseError from "@/lib/serverErrorHelper";

export async function getSessionToken(): Promise<string | null> {
  return await getToken();
}

export async function cancelSubscription({
  subscription_id,
  cancelAtNextBillingDate,
  revokeCancelation,
}: CancelSubscriptionParams) {
  try {
    let url = `/customer-portal/subscriptions/${subscription_id}`;
    let options: RequestInit;

    if (revokeCancelation) {
      options = {
        method: "PATCH",
        body: JSON.stringify({ cancel_at_next_billing_date: false }),
      };
    } else if (cancelAtNextBillingDate === true) {
      options = {
        method: "PATCH",
        body: JSON.stringify({
          cancel_at_next_billing_date: true,
        }),
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
  } catch (error) {
    // Error will be caught and handled by client component
    throw error;
  }
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
    parseError(error, "Failed to fetch subscription");
    return null;
  }
}

export async function updateBillingDetails(params: UpdateBillingDetailsParams) {
  try {
    const { subscription_id, data } = params;

    const patchData = {
      billing: data.billing,
      customer_name: data.customer.name,
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
  } catch (error) {
    // Error will be caught and handled by client component
    throw error;
  }
}

export async function changeSubscriptionPlan(
  params: ChangeSubscriptionPlanParams,
) {
  try {
    const { subscription_id, data } = params;

    const response = await makeAuthenticatedRequest(
      `/customer-portal/subscriptions/${subscription_id}/change-plan`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      let errorMessage = "";

      // Try to parse JSON error response
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorText;
      } catch {
        errorMessage = errorText;
      }

      if (response.status === 403) {
        errorMessage = errorMessage || "Products not in the same collection";
      } else if (response.status === 404) {
        errorMessage = errorMessage || "Subscription not found";
      } else if (response.status === 422) {
        errorMessage =
          errorMessage || "Invalid request - subscription cannot be changed";
      } else {
        errorMessage = `HTTP ${response.status}`;
      }

      throw new Error(errorMessage);
    }

    try {
      const text = await response.text();
      return text && text.trim() ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  } catch (error) {
    // Error will be caught and handled by client component
    throw error;
  }
}

export async function changeSubscriptionPlanPreview(
  params: ChangeSubscriptionPlanPreviewParams,
): Promise<ChangeSubscriptionPlanPreviewResponse> {
  try {
    const { subscription_id, data } = params;

    const response = await makeAuthenticatedRequest(
      `/customer-portal/subscriptions/${subscription_id}/change-plan/preview`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      let errorMessage = "";

      // Try to parse JSON error response
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorText;
      } catch {
        errorMessage = errorText;
      }

      if (response.status === 403) {
        errorMessage = errorMessage || "Products not in the same collection";
      } else if (response.status === 404) {
        errorMessage = errorMessage || "Subscription not found";
      } else if (response.status === 422) {
        errorMessage =
          errorMessage || "Invalid request - subscription cannot be changed";
      }

      throw new Error(errorMessage || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Error will be caught and handled by client component
    throw error;
  }
}

export async function fetchInvoiceHistory(
  subscriptionId: string,
  pageNumber: number = 0,
  pageSize: number = 50,
) {
  try {
    const params = new URLSearchParams();
    params.set("subscription_id", subscriptionId);
    params.set("page_size", pageSize.toString());
    params.set("page_number", pageNumber.toString());

    const response = await makeAuthenticatedRequest(
      `/customer-portal/payments?${params}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch invoice history: ${response.status}`);
    }
    const data = await response.json();
    return {
      data: data.items || [],
      totalCount: data.total_count || 0,
      hasNext: data.has_next || false,
    };
  } catch (error) {
    parseError(error, "Failed to fetch invoice history");
    return { data: [], totalCount: 0, hasNext: false };
  }
}

export async function fetchUsageHistory(
  subscriptionId: string,
  pageNumber: number = 0,
  pageSize: number = 50,
) {
  try {
    const params = new URLSearchParams();
    params.set("page_size", pageSize.toString());
    params.set("page_number", pageNumber.toString());

    const response = await makeAuthenticatedRequest(
      `/customer-portal/subscriptions/${subscriptionId}/usage-history?${params}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch usage history: ${response.status}`);
    }
    const data = await response.json();
    return {
      data: data.items || [],
      totalCount: data.total_count || 0,
      hasNext: data.has_next || false,
    };
  } catch (error) {
    parseError(error, "Failed to fetch usage history");
    return { data: [], totalCount: 0, hasNext: false };
  }
}

export async function fetchEligiblePaymentMethods(
  subscriptionId: string,
): Promise<{ items: PaymentMethodItem[] }> {
  try {
    const response = await makeAuthenticatedRequest(
      `/customer-portal/subscriptions/${subscriptionId}/eligible-payment-methods`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch eligible payment methods: ${response.status}`,
      );
    }

    const data = await response.json();
    return { items: data.items as PaymentMethodItem[] };
  } catch (error) {
    // Error will be caught and handled by client component
    throw error;
  }
}

export async function fetchProductCollection(
  id: string,
): Promise<ProductCollectionData | null> {
  try {
    const response = await makeAuthenticatedRequest(
      `/customer-portal/product-collections/${id}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch product collection: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    parseError(error, "Failed to fetch product collection");
    return null;
  }
}

export async function fetchProductCollectionByProductId(
  productId: string,
): Promise<ProductCollectionData | null> {
  try {
    const response = await makeAuthenticatedRequest(
      `/customer-portal/products/${productId}/collection`,
    );
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(
        `Failed to fetch product collection by product ID: ${response.status}`,
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    parseError(error, "Failed to fetch product collection by product ID");
    return null;
  }
}
