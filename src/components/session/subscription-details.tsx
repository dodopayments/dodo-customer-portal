import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { parseIsoDateDMY } from "@/lib/date-helper";
import {
  CurrencyCode,
  formatCurrency,
  decodeCurrency,
} from "@/lib/currency-helper";
import {
  AddOn,
  SubscriptionDetailsData,
} from "@/app/session/subscriptions/[id]/types";
import { Button } from "../ui/button";

export function SubscriptionDetails({
  subscription,
}: {
  subscription: SubscriptionDetailsData;
}) {
  console.log("subscription", subscription);
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-3 p-6 flex flex-col gap-4">
          <CardHeader className="flex flex-col gap-2 p-0">
            <p className="text-text-secondary text-sm">
              {subscription.product.name}
            </p>
            <CardTitle>
              {formatCurrency(
                decodeCurrency(
                  subscription.recurring_pre_tax_amount,
                  subscription.currency as CurrencyCode,
                ),
                subscription.currency as CurrencyCode,
              )}
              /{subscription.payment_frequency_interval.toLowerCase()}
            </CardTitle>
            <CardDescription className="text-text-secondary text-sm">
              {subscription.product.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-0">
            <div className="flex flex-row gap-2">
              <Badge
                variant="default"
                dot={false}
                className="rounded-sm border-sm"
              >
                renews on {parseIsoDateDMY(subscription.next_billing_date)}
              </Badge>
              <Badge
                variant="default"
                dot={false}
                className="rounded-sm border-sm"
              >
                valid until {parseIsoDateDMY(subscription.next_billing_date)}
              </Badge>
            </div>
            <AddOns addons={subscription.addons} />
          </CardContent>
        </Card>
        <Card className="col-span-1 p-6 flex flex-col gap-4">
          <CardHeader className="flex flex-col gap-2 p-0">
            <p className="text-sm">Payment Method</p>
            <Separator />
          </CardHeader>
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
          className="font-['Hanken_Grotesk'] font-medium my-auto text-md leading-5 tracking-normal"
          style={{ leadingTrim: "cap-height" } as React.CSSProperties}
        >
          Addons
        </CardTitle>
        <Button variant="secondary" className="w-fit my-auto">
          Update
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2 p-0">
        {addons.map((addon) => (
          <Card key={addon.addon_id} className="p-4 flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <CardTitle className="font-['Hanken_Grotesk'] font-medium my-auto text-md leading-5 tracking-normal">
                {addon.addon_id}
              </CardTitle>
            </div>
            <div className="flex flex-row gap-2">
              <CardDescription className="font-['Inter'] font-normal text-sm leading-[21px] text-text-secondary self-stretch">
                {addon.quantity}
              </CardDescription>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
