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
import { pauseSubscription } from "@/app/session/subscriptions/[id]/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import parseError from "@/lib/clientErrorHelper";
import {
  CurrencyCode,
  formatCurrency,
  decodeCurrency,
} from "@/lib/currency-helper";
import ProductMarkdownDescription from "../common/product-markdown-description";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * API error `code` values mapped to their translation key under
 * `PauseSubscriptionSheet.errors`. Any code outside this map falls back to the
 * generic failure copy.
 */
const ERROR_CODE_KEYS: Record<string, string> = {
  SUBSCRIPTION_ALREADY_PAUSED: "alreadyPaused",
  SUBSCRIPTION_PAUSE_ALREADY_PENDING: "pausePending",
  SUBSCRIPTION_NOT_ELIGIBLE_FOR_PAUSE: "notEligible",
  SUBSCRIPTION_PAUSE_REQUIRES_PAYMENT_METHOD: "requiresPaymentMethod",
  SUBSCRIPTION_NOT_PAUSED: "notPaused",
  SUBSCRIPTION_CUSTOMER_PAUSE_DISABLED: "customerPauseDisabled",
  BUSINESS_SETTINGS_UNAVAILABLE: "settingsUnavailable",
  INVALID_REQUEST_BODY: "invalidRequest",
};

interface PauseSubscriptionSheetProps {
  subscription: SubscriptionDetailsData;
  subscriptionId: string;
  /** Business disallows pausing from the portal */
  disabled?: boolean;
}

export function PauseSubscriptionSheet({
  subscription,
  subscriptionId,
  disabled = false,
}: PauseSubscriptionSheetProps) {
  const t = useTranslations("PauseSubscriptionSheet");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isPaused = subscription.status === "paused";

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const result = await pauseSubscription({
        subscription_id: subscriptionId,
        pause: !isPaused,
      });

      if (!result.success) {
        const key = ERROR_CODE_KEYS[result.error];
        toast.error(
          key
            ? t(`errors.${key}` as Parameters<typeof t>[0])
            : t(isPaused ? "resumeFailed" : "pauseFailed"),
        );
        return;
      }

      toast.success(t(isPaused ? "resumeSuccess" : "pauseSuccess"));
      router.refresh();
      setOpen(false);
    } catch (error) {
      parseError(error, t(isPaused ? "resumeFailed" : "pauseFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  // Only an active subscription can be paused, and only a paused one resumed.
  // Every other status has no pause action to offer.
  if (!isPaused && subscription.status !== "active") {
    return null;
  }

  // The business disallows pausing, so hide the trigger outright rather than
  // showing it disabled. The API keeps a 403 as its own backstop.
  //
  // The resume trigger is deliberately exempt. A customer can always resume a
  // pause they started themselves, and this response shape carries no
  // `paused_at` or initiator, so the portal cannot tell a customer-started
  // pause from a merchant-started one. The API is the authority: it rejects a
  // resume the customer may not perform with a 403, which `handleSubmit`
  // surfaces as the `customerPauseDisabled` message.
  if (disabled && !isPaused) {
    return null;
  }

  const formattedPrice = formatCurrency(
    decodeCurrency(
      subscription.recurring_pre_tax_amount,
      subscription.currency as CurrencyCode,
    ),
    subscription.currency as CurrencyCode,
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={isPaused ? "default" : "secondary"}>
          {isPaused ? t("triggerResume") : t("triggerPause")}
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex flex-col gap-6 overflow-y-auto border-border-secondary rounded-xl border m-6"
        side="right"
        floating
      >
        <SheetHeader className="border-b border-border-secondary pb-4">
          <SheetTitle className="text-left font-display font-semibold text-base leading-tight tracking-normal">
            {isPaused ? t("resumeSheetTitle") : t("pauseSheetTitle")}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-4">
            <p className="font-body font-normal text-[13px] leading-[20px] text-text-secondary">
              {t("currentPlan")}
            </p>

            <div className="border border-border-secondary rounded-lg p-4 flex flex-col gap-4">
              <div
                className={cn(
                  "flex items-center justify-between",
                  subscription.product.description &&
                    "border-b border-border-secondary pb-3",
                )}
              >
                <p className="font-display font-medium text-[13px] leading-[20px] text-text-primary">
                  {subscription.product.name}
                </p>
                <p className="font-display font-medium text-[13px] leading-[20px] text-text-primary">
                  {formattedPrice}/
                  {subscription.payment_frequency_interval.toLowerCase()}
                </p>
              </div>

              {subscription.product.description && (
                <ProductMarkdownDescription
                  description={subscription.product.description}
                />
              )}
            </div>
          </div>

          {/* Losing access is the consequence a customer is least likely to
              expect, so it leads, above the billing-date explanation. */}
          {!isPaused && (
            <div
              className={cn(
                "flex gap-3 p-3 rounded-lg border",
                badgeVariants["red"],
              )}
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="font-body font-normal text-sm">
                {t("pauseAccessWarning")}
              </p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-warning-primary border border-warning-secondary">
            <p className="font-body font-normal text-sm text-text-primary">
              {isPaused ? t("resumeExplanation") : t("pauseExplanation")}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-border-secondary">
          <Button
            variant={isPaused ? "default" : "secondary"}
            className="w-full h-10"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading
              ? t(isPaused ? "resuming" : "pausing")
              : t(isPaused ? "confirmResume" : "confirmPause")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
