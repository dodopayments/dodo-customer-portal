"use client";

import { useState } from "react";
import { SubscriptionDetailsData } from "@/app/session/subscriptions/[id]/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cancelSubscription } from "@/app/session/subscriptions/[id]/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import parseError from "@/lib/clientErrorHelper";
import {
  CurrencyCode,
  formatCurrency,
  decodeCurrency,
} from "@/lib/currency-helper";
import ProductMarkdownDescription from "../common/product-markdown-description";

interface CancelSubscriptionSheetProps {
  subscription: SubscriptionDetailsData;
  subscriptionId: string;
}

export function CancelSubscriptionSheet({
  subscription,
  subscriptionId,
}: CancelSubscriptionSheetProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancellingAtNextBilling, setIsCancellingAtNextBilling] =
    useState(false);
  const [addonsOpen, setAddonsOpen] = useState(false);
  const router = useRouter();

  const handleCancelSubscription = async (cancelAtNextBillingDate = false) => {
    try {
      setIsLoading(true);
      setIsCancellingAtNextBilling(cancelAtNextBillingDate);
      await cancelSubscription({
        subscription_id: subscriptionId,
        cancelAtNextBillingDate,
      });
      toast.success(
        cancelAtNextBillingDate
          ? "Subscription will be cancelled at next billing date"
          : "Subscription cancelled successfully"
      );
      router.refresh();
      setOpen(false);
    } catch (error) {
      parseError(error, "Failed to cancel subscription. Please try again.");
    } finally {
      setIsLoading(false);
      setIsCancellingAtNextBilling(false);
    }
  };

  const handleRevokeCancellation = async () => {
    try {
      setIsLoading(true);
      await cancelSubscription({
        subscription_id: subscriptionId,
        revokeCancelation: true,
      });
      toast.success("Subscription cancellation revoked successfully");
      router.refresh();
      setOpen(false);
    } catch (error) {
      parseError(error, "Failed to revoke cancellation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formattedPrice = formatCurrency(
    decodeCurrency(
      subscription.recurring_pre_tax_amount,
      subscription.currency as CurrencyCode
    ),
    subscription.currency as CurrencyCode
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant={
            subscription.cancel_at_next_billing_date
              ? "default"
              : "destructive"
          }
        >
          {subscription.cancel_at_next_billing_date
            ? "Cancel/Revoke Subscription"
            : "Cancel Subscription"}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-6 overflow-y-auto">
        <SheetHeader className="border-b border-border-secondary pb-4">
          <SheetTitle className="text-left font-display font-semibold text-base leading-tight tracking-normal">
            We&apos;re sorry to see you go...
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-4">
            <p className="font-body font-normal text-[13px] leading-[20px] text-text-secondary">
              Current plan
            </p>

            <div className="border border-border-secondary rounded-lg p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border-secondary pb-3">
                <p className="font-display font-medium text-[13px] leading-[20px] text-text-primary">
                  {subscription.product.name}
                </p>
                <p className="font-display font-medium text-[13px] leading-[20px] text-text-primary">
                  {formattedPrice}/
                  {subscription.payment_frequency_interval.toLowerCase()}
                </p>
              </div>

              <ProductMarkdownDescription
                description={subscription.product.description}
              />

              {subscription.addons.length > 0 && (
                <Collapsible open={addonsOpen} onOpenChange={setAddonsOpen}>
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                      <p className="font-display font-normal text-[13px] leading-[28px] text-text-primary">
                        {subscription.addons.length} add-on
                        {subscription.addons.length !== 1 ? "s" : ""}
                      </p>
                      <ChevronDown
                        className={`h-4 w-4 text-text-secondary transition-transform ${
                          addonsOpen ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <div className="flex flex-col gap-2">
                      {subscription.addons.map((addon) => (
                        <div
                          key={addon.addon_id}
                          className="flex flex-col gap-1 p-2 rounded"
                        >
                          <p className="font-display font-medium text-sm text-text-primary">
                            {addon.addon_id}
                          </p>
                          <p className="font-body font-normal text-sm text-text-secondary">
                            Quantity: {addon.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-border-secondary">
          {subscription.cancel_at_next_billing_date ? (
            <>
              <div className="p-3 rounded-lg bg-warning-primary border border-warning-secondary">
                <p className="font-body font-normal text-sm text-text-primary">
                  This subscription is scheduled to be cancelled at the next
                  billing date.
                </p>
              </div>
              <Button
                variant="default"
                className="w-full h-10"
                onClick={handleRevokeCancellation}
                disabled={isLoading}
              >
                {isLoading ? "Revoking..." : "Revoke Cancellation"}
              </Button>
              <Button
                variant="destructive"
                className="w-full h-10"
                onClick={() => handleCancelSubscription(false)}
                disabled={isLoading}
              >
                {isLoading && !isCancellingAtNextBilling
                  ? "Cancelling..."
                  : "Cancel Immediately"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                className="w-full h-10"
                onClick={() => handleCancelSubscription(true)}
                disabled={isLoading}
              >
                {isLoading && isCancellingAtNextBilling
                  ? "Cancelling..."
                  : "Cancel at next billing date"}
              </Button>
              <Button
                variant="destructive"
                className="w-full h-10"
                onClick={() => handleCancelSubscription(false)}
                disabled={isLoading}
              >
                {isLoading && !isCancellingAtNextBilling
                  ? "Cancelling..."
                  : "Cancel now"}
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
