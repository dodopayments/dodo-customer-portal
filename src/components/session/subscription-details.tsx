import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { renderSubscriptionBadges } from "./subscription-utils";
import {
  CurrencyCode,
  formatCurrency,
  decodeCurrency,
  getCurrencySymbol,
  decodeFloatCurrency,
} from "@/lib/currency-helper";
import {
  AddOn,
  SubscriptionDetailsData,
  Meter,
} from "@/app/session/subscriptions/[id]/types";
import ProductMarkdownDescription from "../common/product-markdown-description";
import { Gauge } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { UpdatePaymentMethodSheet } from "./subscriptions/update-payment-method-sheet";
import { fetchPaymentMethods } from "@/app/session/payment-methods/action";
import { PaymentMethodItem } from "@/app/session/payment-methods/type";
import { getPaymentMethodLogoUrl } from "./payment-methods/payment-method-logo";
import Image from "next/image";

function formatPaymentMethodType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getPaymentMethodDisplayName(paymentMethod: PaymentMethodItem): string {
  if (paymentMethod.payment_method_type === "apple_pay") return "Apple Pay";
  if (paymentMethod.payment_method_type === "google_pay") return "Google Pay";
  return formatPaymentMethodType(paymentMethod.payment_method);
}

export async function SubscriptionDetails({
  subscription,
}: {
  subscription: SubscriptionDetailsData;
}) {
  const paymentMethods = await fetchPaymentMethods();
  const currentPaymentMethod = subscription.payment_method_id
    ? paymentMethods?.find(
        (pm) => pm.payment_method_id === subscription.payment_method_id
      )
    : null;
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4">
        <Card className="w-full p-6 flex justify-between gap-4">
          <section className="flex flex-col gap-4">
            <CardHeader className="flex flex-col gap-2 p-0">
              <p className="text-text-secondary text-sm">
                {subscription.product.name}
              </p>
              <CardTitle>
                {formatCurrency(
                  decodeCurrency(
                    subscription.recurring_pre_tax_amount,
                    subscription.currency as CurrencyCode
                  ),
                  subscription.currency as CurrencyCode
                )}
                /{subscription.payment_frequency_interval.toLowerCase()}
              </CardTitle>
              <CardDescription className="text-text-secondary text-sm">
                <ProductMarkdownDescription
                  description={subscription.product.description}
                />
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-0">
              <div className="flex flex-row gap-2">
                {renderSubscriptionBadges(subscription)}
              </div>
              {subscription.addons.length > 0 && (
                <AddOns addons={subscription.addons} />
              )}
              {subscription.meters.length > 0 && (
                <MetersCart meters={subscription.meters} />
              )}
            </CardContent>
          </section>
          {subscription.status === "active" && (
            <div className="flex border border-border-secondary rounded-lg p-4 items-end gap-6 my-auto">
              {currentPaymentMethod && (
                <CurrentPaymentMethod paymentMethod={currentPaymentMethod} />
              )}
              <UpdatePaymentMethodSheet
                subscription_id={subscription.subscription_id}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function AddOns({ addons }: { addons: AddOn[] }) {
  return (
    <Card className="p-6 flex flex-col gap-4">
      <CardHeader className="flex flex-row gap-2 p-0 justify-between">
        <CardTitle
          className="font-display font-medium my-auto text-md leading-5 tracking-normal"
          style={{ leadingTrim: "cap-height" } as React.CSSProperties}
        >
          Addons
        </CardTitle>
        {/* <Button variant="secondary" className="w-fit my-auto">
          Update
        </Button> */}
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2 p-0">
        {addons.map((addon) => (
          <Card key={addon.addon_id} className="p-4 flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <CardTitle className="font-display font-medium my-auto text-md leading-5 tracking-normal">
                {addon.addon_id}
              </CardTitle>
            </div>
            <div className="flex flex-row gap-2">
              <CardDescription className="font-body font-normal text-sm leading-[21px] text-text-secondary self-stretch">
                {addon.quantity}
              </CardDescription>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

function MetersCart({
  meters,
  className,
}: {
  meters: Meter[];
  className?: string;
}) {
  if (!meters || meters.length === 0) return null;

  return (
    <Card className={cn("p-6 flex flex-col gap-4", className)}>
      <CardHeader className="flex flex-row gap-2 p-0 justify-between">
        <CardTitle
          className="font-display font-medium my-auto text-md leading-5 tracking-normal"
          style={{ leadingTrim: "cap-height" } as React.CSSProperties}
        >
          Meters
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2 p-0">
        <section className={cn("w-full space-y-2 grid grid-cols-1")}>
          {meters.map((meter, index) => {
            const currency = meter.currency as CurrencyCode;
            return (
              <div
                key={meter.meter_id + index}
                className="w-full text-sm text-text-secondary gap-3 flex flex-col"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full gap-3">
                  <div className="flex flex-col gap-2 items-start h-full justify-center sm:flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4" />
                      <span className="font-semibold text-text-primary text-sm font-display break-words truncate max-w-full">
                        {meter.name}
                      </span>
                    </div>
                    {meter.description && (
                      <span className="text-sm break-words truncate max-w-full">
                        {meter.description}
                      </span>
                    )}
                  </div>
                  <Separator className="sm:hidden" />
                  <div className="flex flex-col gap-2 h-full justify-center sm:flex-shrink-0 sm:text-right">
                    <span className="text-sm break-words truncate max-w-full">
                      {getCurrencySymbol(currency)}
                      {decodeFloatCurrency({
                        value: Number(meter.price_per_unit || "0"),
                        currency,
                      })}{" "}
                      per {meter.measurement_unit}
                    </span>
                    {meter.free_threshold && (
                      <span className="text-sm break-words truncate max-w-full">
                        Free Threshold : {meter.free_threshold}{" "}
                        {meter.measurement_unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </CardContent>
    </Card>
  );
}

function CurrentPaymentMethod({
  paymentMethod,
}: {
  paymentMethod: PaymentMethodItem;
}) {
  const logo = getPaymentMethodLogoUrl(
    paymentMethod.payment_method_type,
    paymentMethod.payment_method,
    paymentMethod.card?.card_network,
    paymentMethod.card?.card_type
  );

  const displayName = getPaymentMethodDisplayName(paymentMethod);
  const isCard = paymentMethod.payment_method === "card";
  const card = paymentMethod.card;

  return (
    <div className="flex flex-row items-center gap-3">
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
          <logo.Icon size={32} className="text-text-primary" weight="regular" />
        ) : (
          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">
              {displayName.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-text-primary text-sm font-display font-medium leading-tight">
          {displayName}
        </p>
        {isCard && card && (
          <div className="flex flex-row items-center gap-2 flex-wrap">
            {card.card_network && (
              <span className="text-text-secondary text-xs">
                {card.card_network}
              </span>
            )}
            {card.last4_digits && (
              <>
                {card.card_network && (
                  <span className="text-text-secondary text-xs">|</span>
                )}
                <span className="text-text-secondary text-xs">
                  •••• {card.last4_digits}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
