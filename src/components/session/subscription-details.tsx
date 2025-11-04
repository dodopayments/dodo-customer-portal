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
} from "@/lib/currency-helper";
import {
  AddOn,
  SubscriptionDetailsData,
} from "@/app/session/subscriptions/[id]/types";
import ProductMarkdownDescription from "../common/product-markdown-description";

export function SubscriptionDetails({
  subscription,
}: {
  subscription: SubscriptionDetailsData;
}) {
  console.log("subscription", subscription);
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4">
        <Card className="w-full p-6 flex flex-col gap-4">
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
          </CardContent>
        </Card>
        {/* <Card className="col-span-1 p-6 flex flex-col gap-4">
          <CardHeader className="flex flex-col gap-2 p-0">
            <p className="text-sm">Payment Method</p>
            <Separator />
          </CardHeader>
        </Card> */}
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
