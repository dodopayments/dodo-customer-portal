import { Card, CardContent } from "@/components/ui/card";
import { fetchPaymentMethods } from "./action";
import { PaymentMethodItem } from "./type";
import { CircleSlash } from "lucide-react";
import { SessionPageLayout } from "@/components/session/session-page-layout";
import { PaymentMethodCard } from "@/components/session/payment-methods/payment-method-card";

export const dynamic = "force-dynamic";

export default async function PaymentMethodsPage() {
  let paymentMethods: PaymentMethodItem[] | null = null;
  try {
    paymentMethods = await fetchPaymentMethods();
  } catch (error) {
    console.error("Failed to fetch payment methods:", error);
  }

  const isEmpty = !paymentMethods || paymentMethods.length === 0;
  const emptyMessage = "No payment methods found";

  return (
    <SessionPageLayout>
      <div className="flex flex-col gap-3">
        <h4 className="text-text-primary text-lg font-medium">
          Your payment methods
        </h4>
        <Card className="p-6 flex flex-col items-start gap-4 flex-none order-1 self-stretch flex-grow-0">
          {isEmpty ? (
            <div className="flex flex-col justify-center items-center min-h-[200px] my-auto w-full">
              <span className="text-text-primary p-3 mb-3 bg-bg-secondary rounded-full text-2xl">
                <CircleSlash />
              </span>
              <span className="text-sm font-display text-center tracking-wide text-text-secondary">
                {emptyMessage}
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              {paymentMethods && paymentMethods.map((paymentMethod) => (
                <PaymentMethodCard
                  key={paymentMethod.payment_method_id}
                  paymentMethod={paymentMethod}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </SessionPageLayout>
  );
}
