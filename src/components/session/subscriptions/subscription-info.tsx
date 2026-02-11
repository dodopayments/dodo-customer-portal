import { SubscriptionDetailsData } from "@/app/session/subscriptions/[id]/types";
import IconColors from "@/components/custom/icon-colors";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Info } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { UpdatePaymentMethodSheet } from "./update-payment-method-sheet";

const SubscriptionInfo = ({
  subscription,
}: {
  subscription: SubscriptionDetailsData;
}) => {
  if (subscription.status != "on_hold") {
    return null;
  }
  return (
    <div
      className={cn(
        "flex items-center justify-start p-4 rounded-xl gap-4",
        badgeVariants["orange2"]
      )}
    >
      <IconColors color="orange" icon={<Info size={14} />} />
      <div className="flex w-full flex-col gap-1">
        <p className="text-text-primary text-sm font-medium">
          Your subscription is currently on hold
        </p>
        <p className="text-text-primary font-[200] text-sm">
          Please update your payment method to resume this subscription
        </p>
      </div>
      <UpdatePaymentMethodSheet
        variant="default"
        subscription_id={subscription.subscription_id}
      />
    </div>
  );
};

export default SubscriptionInfo;
