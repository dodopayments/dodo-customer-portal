"use server";

import { makeAuthenticatedRequest } from "@/lib/server-actions";
import { PaymentMethodItem } from "./type";
import parseError from "@/lib/serverErrorHelper";

export async function fetchPaymentMethods(): Promise<
  PaymentMethodItem[] | null
> {
  try {
    const response = await makeAuthenticatedRequest(
      "/customer-portal/payment-methods"
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch payment methods: ${response.status}`);
    }
    const data = await response.json();
    return data.items;
  } catch (error) {
    parseError(error, "Failed to fetch payment methods");
    return null;
  }
}

export async function deletePaymentMethod(
  paymentMethodId: string
): Promise<void> {
  const response = await makeAuthenticatedRequest(
    `/customer-portal/payment-methods/${paymentMethodId}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    let errorMessage = "Failed to remove payment method";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorText;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }
}
