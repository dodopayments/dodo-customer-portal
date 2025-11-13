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

export function SubscriptionDetails({
  subscription,
}: {
  subscription: SubscriptionDetailsData;
}) {
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
          {subscription.status !== "on_hold" && (
            <UpdatePaymentMethodSheet
              subscription_id={subscription.subscription_id}
            />
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
