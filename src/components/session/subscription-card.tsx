"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SubscriptionData } from "./subscriptions/subscriptions";
import { Badge, type BadgeVariant } from "../ui/badge";
import { getBadge } from "@/lib/badge-helper";
import { useRouter } from "next/navigation";
import {
  CurrencyCode,
  decodeCurrency,
  formatCurrency,
} from "@/lib/currency-helper";
import { renderSubscriptionBadges } from "./subscription-utils";
import ProductMarkdownDescription from "../common/product-markdown-description";
import { CreditCard } from "lucide-react";
import { PaymentMethodItem } from "@/app/session/payment-methods/type";
import { getPaymentMethodLogoUrl } from "./payment-methods/payment-method-logo";
import { SubscriptionNotes } from "./subscription-notes";
import { useBusiness } from "@/hooks/use-business";

interface SubscriptionCardProps {
  item: SubscriptionData;
  cardClassName?: string;
  /**
   * "detail" - Full card with image, description, badges (used on subscription list page)
   * "compact" - Minimal card for overview page with payment method display
   */
  variant?: "detail" | "compact";
  /**
   * Payment method to display (only used in compact variant)
   */
  paymentMethod?: PaymentMethodItem;
}

// Helper to get payment method display info
const getPaymentMethodDisplay = (paymentMethod?: PaymentMethodItem) => {
  if (!paymentMethod) return null;

  const logo = getPaymentMethodLogoUrl(
    paymentMethod.payment_method_type,
    paymentMethod.payment_method,
    paymentMethod.card?.card_network,
    paymentMethod.card?.card_type
  );

  return {
    logo,
    label: paymentMethod.card?.last4_digits
      ? `•••• ${paymentMethod.card.last4_digits}`
      : paymentMethod.payment_method_type === "apple_pay"
        ? "Apple Pay"
        : paymentMethod.payment_method_type === "google_pay"
          ? "Google Pay"
          : paymentMethod.payment_method,
  };
};

export const SubscriptionCard = ({
  item,
  cardClassName,
  variant = "detail",
  paymentMethod,
}: SubscriptionCardProps) => {
  const router = useRouter();
  const { business } = useBusiness();

  // Compact variant - minimal design for overview
  if (variant === "compact") {
    const paymentDisplay = getPaymentMethodDisplay(paymentMethod);

    return (
      <div>
        <Card className={`relative z-10 shadow-[0px_2px_12px_0px_rgba(68,81,104,0.1)] ${cardClassName}`}>
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
              <div>
                <p className="text-sm text-text-secondary mb-0.5">
                  {item.product.name}
                </p>
                <p className="text-lg sm:text-xl font-display font-semibold text-text-primary">
                  {formatCurrency(
                    decodeCurrency(
                      item.recurring_pre_tax_amount,
                      item.currency as CurrencyCode
                    ),
                    item.currency as CurrencyCode
                  )}
                  <span className="text-sm sm:text-base font-normal text-text-primary">
                    /{item.payment_frequency_interval}
                  </span>
                </p>
              </div>

              {paymentDisplay && (
                <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 border border-border-secondary rounded-lg self-start sm:self-auto">
                  {paymentDisplay.logo?.type === "url" && paymentDisplay.logo.url ? (
                    <Image
                      src={paymentDisplay.logo.url}
                      alt="Payment method"
                      width={36}
                      height={24}
                      className="object-contain w-7 sm:w-9"
                      unoptimized
                    />
                  ) : paymentDisplay.logo?.type === "icon" && paymentDisplay.logo.Icon ? (
                    <paymentDisplay.logo.Icon size={24} className="text-text-primary" weight="regular" />
                  ) : (
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary" />
                  )}
                  <span className="text-sm sm:text-base text-text-primary font-medium">
                    {paymentMethod?.card?.card_network ? `${paymentMethod.card.card_network} ` : ""}{paymentDisplay.label}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() =>
                  router.push(`/session/subscriptions/${item.subscription_id}`)
                }
              >
                Manage subscription
              </Button>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-xs font-medium">
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-bg-secondary rounded-md text-text-secondary">
                  renews on {item.next_billing_date
                    ? new Date(item.next_billing_date).toLocaleDateString("en-GB")
                    : "N/A"}
                </span>
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-bg-secondary rounded-md text-text-secondary">
                  valid till {item.next_billing_date
                    ? new Date(item.next_billing_date).toLocaleDateString("en-GB")
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <SubscriptionNotes
          subscription={item}
          businessName={business?.name || undefined}
          className="-mt-3 relative z-0"
          maxNotes={1}
        />
      </div>
    );
  }

  // Detail variant - full design with image, description, badges
  return (
    <div>
      <Card className={`relative z-10 ${cardClassName}`}>
        <CardContent className="flex flex-col sm:flex-row items-start px-0 gap-4 pb-0 sm:pb-6">
          {item.product.image && (
            <Image
              src={item.product.image}
              alt={item.product.name}
              width={64}
              height={64}
              className="rounded-lg flex-none aspect-square object-cover"
            />
          )}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 w-full">
              <div className="flex flex-row flex-wrap gap-2 min-w-0">
                <CardTitle className="font-display font-semibold text-base leading-5 break-words">
                  {item.product.name}
                </CardTitle>
                <Badge
                  variant={getBadge(item.status).color as BadgeVariant}
                  dot={false}
                  className="rounded-sm border-sm"
                >
                  {getBadge(item.status).message}
                </Badge>
              </div>
              <div className="font-display font-semibold text-base leading-5 text-right sm:text-left shrink-0">
                {formatCurrency(
                  decodeCurrency(
                    item.recurring_pre_tax_amount,
                    item.currency as CurrencyCode
                  ),
                  item.currency as CurrencyCode,
                )}
              </div>
            </div>
            <CardDescription className="font-body font-normal text-sm pt-4 leading-[21px] text-text-secondary self-stretch">
              <ProductMarkdownDescription
                description={item.product.description}
              />
            </CardDescription>
          </div>
        </CardContent>
        <Separator className="mb-4" />
        <CardFooter className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-0">
          <Button
            variant="secondary"
            className="w-full md:w-auto"
            onClick={() =>
              router.push(`/session/subscriptions/${item.subscription_id}`)
            }
          >
            View details
          </Button>
          <div className="flex flex-wrap gap-2">
            {renderSubscriptionBadges(item, "rounded-sm border-sm")}
          </div>
        </CardFooter>
      </Card>
      <SubscriptionNotes
        subscription={item}
        businessName={business?.name || undefined}
        className="-mt-3 relative z-0"
      />
    </div>
  );
};
