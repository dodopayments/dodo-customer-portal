import { Card, CardContent } from "@/components/ui/card";
import { fetchPaymentMethods } from "./action";
import { PaymentMethodItem } from "./type";
import Image from "next/image";
import { getPaymentMethodLogoUrl } from "../../../components/session/payment-methods/payment-method-logo";

function formatPaymentMethodType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getPaymentMethodDisplayName(paymentMethod: PaymentMethodItem): string {
  const connectorMethods = Object.values(
    paymentMethod.connector_payment_methods
  );
  for (const method of connectorMethods) {
    if (method.payment_method_type === "apple_pay") return "Apple Pay";
    if (method.payment_method_type === "google_pay") return "Google Pay";
  }
  return formatPaymentMethodType(paymentMethod.payment_method);
}

export default async function PaymentMethodsPage() {
  const paymentMethods = await fetchPaymentMethods();
  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
      <div className="flex flex-col gap-3">
        <h4 className="text-text-primary text-lg font-medium">
          Your payment methods
        </h4>
        <Card className="p-6 flex flex-col items-start gap-4 flex-none order-1 self-stretch flex-grow-0">
          <div className="flex flex-col gap-4 w-full">
            {paymentMethods?.map((paymentMethod) => (
              <PaymentMethodCard
                key={paymentMethod.payment_method_id}
                paymentMethod={paymentMethod}
              />
            ))}
          </div>
          {/* <div className="flex">
            <AddPaymentMethodSheet />
          </div> */}
        </Card>
      </div>
    </div>
  );
}

function PaymentMethodCard({
  paymentMethod,
}: {
  paymentMethod: PaymentMethodItem;
}) {
  // Get the first connector payment method type if available
  const connectorMethods = Object.values(
    paymentMethod.connector_payment_methods
  );
  const paymentMethodType =
    connectorMethods.length > 0
      ? connectorMethods[0].payment_method_type
      : undefined;

  const logo = getPaymentMethodLogoUrl(
    paymentMethodType,
    paymentMethod.payment_method,
    paymentMethod.card?.card_network,
    paymentMethod.card?.card_type
  );

  const displayName = getPaymentMethodDisplayName(paymentMethod);
  const isCard = paymentMethod.payment_method === "card";
  const card = paymentMethod.card;

  return (
    <Card className="w-full">
      <CardContent className="flex flex-row items-center justify-between gap-4 p-4">
        <div className="flex flex-row items-center gap-4 flex-1">
          <div className="border border-border-secondary rounded-md p-2 py-1 flex-shrink-0 flex items-center justify-center w-12 h-9">
            {logo?.type === "url" && logo.url ? (
              <Image
                src={logo.url}
                alt={displayName}
                width={32}
                height={32}
                className="object-contain"
                unoptimized
              />
            ) : logo?.type === "icon" && logo.Icon ? (
              <logo.Icon
                size={32}
                className="text-text-primary"
                weight="regular"
              />
            ) : (
              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">
                  {displayName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-text-primary text-base font-display font-medium leading-tight">
              {displayName}
            </p>
            {isCard && card && (
              <div className="flex flex-row items-center gap-2 flex-wrap">
                {card.card_network && (
                  <span className="text-text-secondary text-sm">
                    {card.card_network}
                  </span>
                )}
                {card.last4_digits && (
                  <>
                    {card.card_network && (
                      <span className="text-text-secondary text-sm">|</span>
                    )}
                    <span className="text-text-secondary text-sm">
                      •••• {card.last4_digits}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
