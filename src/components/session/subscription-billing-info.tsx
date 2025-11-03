import { SubscriptionDetailsData } from "@/app/session/subscriptions/[id]/types";
import { Card, CardContent, CardFooter } from "../ui/card";
import SubscriptionBillingEdit from "./subscription-billing-edit";

export function SubscriptionBillingInfo({
  subscription,
}: {
  subscription: SubscriptionDetailsData;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-text-primary text-lg font-medium">
        Billing Information
      </h4>
      <Card className="p-6 flex flex-col items-start gap-4 flex-none order-1 self-stretch flex-grow-0">
        <CardContent className="flex flex-row gap-8 px-0">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-text-secondary text-sm">Name</p>
              <p className="text-text-primary text-sm">
                {subscription.customer.name}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-text-secondary text-sm">Phone number</p>
              <p className="text-text-primary text-sm">
                {subscription.customer.phone_number || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-text-secondary text-sm">Email</p>
              <p className="text-text-primary text-sm">
                {subscription.customer.email}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-text-secondary text-sm">Billing Address </p>
              <p className="text-text-primary text-sm">
                {subscription.billing.street}, {subscription.billing.city},{" "}
                {subscription.billing.state}, {subscription.billing.zipcode}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row gap-2 p-0">
          <SubscriptionBillingEdit subscription={subscription} />
        </CardFooter>
      </Card>
    </div>
  );
}
