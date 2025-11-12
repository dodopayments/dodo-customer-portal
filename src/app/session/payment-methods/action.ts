import { makeAuthenticatedRequest } from "@/lib/server-actions";
import { PaymentMethodItem } from "./type";

export async function fetchPaymentMethods(): Promise<
  PaymentMethodItem[] | null
> {
  try {
    const response = await makeAuthenticatedRequest(
      "/customer-portal/payment-methods"
    );
    if (!response.ok) {
      console.error("Failed to fetch wallets:", JSON.stringify(response));
      throw new Error(`Failed to fetch wallets: ${response.status}`);
    }
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return null;
  }
}
