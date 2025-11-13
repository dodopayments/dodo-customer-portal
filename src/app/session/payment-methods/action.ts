import { makeAuthenticatedRequest } from "@/lib/server-actions";
import { PaymentMethodItem } from "./type";
import parseError from "@/lib/parseError";

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
