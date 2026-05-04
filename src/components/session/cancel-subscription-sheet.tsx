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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cancelSubscription } from "@/app/session/subscriptions/[id]/action";
import { CancellationFeedback } from "@/app/session/subscriptions/[id]/types";
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
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const CANCELLATION_REASONS: { value: CancellationFeedback; label: string }[] =
  [
    { value: "too_expensive", label: "Too expensive" },
    { value: "missing_features", label: "Missing features" },
    { value: "switched_service", label: "Switched to another service" },
    { value: "unused", label: "Not using it enough" },
    { value: "customer_service", label: "Poor customer service" },
    { value: "low_quality", label: "Low quality" },
    { value: "too_complex", label: "Too complex" },
    { value: "other", label: "Other" },
  ];

interface CancelSubscriptionSheetProps {
  subscription: SubscriptionDetailsData;
  subscriptionId: string;
}

export function CancelSubscriptionSheet({
  subscription,
  subscriptionId,
}: CancelSubscriptionSheetProps) {
  const t = useTranslations("CancelSubscriptionSheet");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancellingAtNextBilling, setIsCancellingAtNextBilling] =
    useState(false);
  const [addonsOpen, setAddonsOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] =
    useState<CancellationFeedback | "">("");
  const [comment, setComment] = useState("");
  const router = useRouter();

  const handleCancelSubscription = async (cancelAtNextBillingDate = false) => {
    try {
      setIsLoading(true);
      setIsCancellingAtNextBilling(cancelAtNextBillingDate);
      const result = await cancelSubscription({
        subscription_id: subscriptionId,
        cancelAtNextBillingDate,
        cancellation_feedback: selectedFeedback || null,
        cancellation_comment: comment.trim() || null,
      });
      if (!result.success) {
        toast.error(t("cancelFailed"));
        return;
      }
      toast.success(
        cancelAtNextBillingDate ? t("cancelScheduled") : t("cancelSuccess")
      );
      router.refresh();
      setOpen(false);
    } catch (error) {
      parseError(error, t("cancelFailed"));
    } finally {
      setIsLoading(false);
      setIsCancellingAtNextBilling(false);
    }
  };

  const handleRevokeCancellation = async () => {
    try {
      setIsLoading(true);
      const result = await cancelSubscription({
        subscription_id: subscriptionId,
        revokeCancelation: true,
      });
      if (!result.success) {
        toast.error(result.error || t("revokeFailed"));
        return;
      }
      toast.success(t("revokeSuccess"));
      router.refresh();
      setOpen(false);
    } catch (error) {
      parseError(error, t("revokeFailed"));
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
    <Sheet
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setSelectedFeedback("");
          setComment("");
        }
      }}
    >
      <SheetTrigger asChild>
        <Button
          variant={
            subscription.cancel_at_next_billing_date ? "default" : "secondary"
          }
        >
          {subscription.cancel_at_next_billing_date
            ? t("triggerRevoke")
            : t("triggerCancel")}
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex flex-col gap-6 overflow-y-auto border-border-secondary rounded-xl border m-6"
        side="right"
        floating
      >
        <SheetHeader className="border-b border-border-secondary pb-4">
          <SheetTitle className="text-left font-display font-semibold text-base leading-tight tracking-normal">
            {t("sheetTitle")}
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
                    "border-b border-border-secondary pb-3"
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

              {subscription.addons.length > 0 && (
                <Collapsible open={addonsOpen} onOpenChange={setAddonsOpen}>
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                      <p className="font-display font-normal text-[13px] leading-[28px] text-text-primary">
                        {t("addOns", { count: subscription.addons.length })}
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
                            {addon.name || addon.addon_id}
                          </p>
                          <p className="font-body font-normal text-sm text-text-secondary">
                            {t("quantity", { value: addon.quantity })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </div>

          {!subscription.cancel_at_next_billing_date && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <p className="font-body font-normal text-[13px] leading-[20px] text-text-secondary">
                  {t("feedbackLabel")}{" "}
                  <span className="text-red-500">*</span>
                </p>
                <Select
                  value={selectedFeedback}
                  onValueChange={(val) =>
                    setSelectedFeedback(val as CancellationFeedback)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("feedbackPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {CANCELLATION_REASONS.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="font-body font-normal text-[13px] leading-[20px] text-text-secondary">
                  {t("commentLabel")}
                </p>
                <textarea
                  className="w-full rounded-lg border border-border-secondary bg-transparent px-3 py-2 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-border-primary resize-none"
                  rows={3}
                  maxLength={500}
                  placeholder={t("commentPlaceholder")}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <p className="text-xs text-text-tertiary text-right">
                  {comment.length}/500
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-border-secondary">
          {subscription.cancel_at_next_billing_date ? (
            <>
              <div className="p-3 rounded-lg bg-warning-primary border border-warning-secondary">
                <p className="font-body font-normal text-sm text-text-primary">
                  {t("scheduledCancellationWarning")}
                </p>
              </div>
              <Button
                variant="default"
                className="w-full h-10"
                onClick={handleRevokeCancellation}
                disabled={isLoading}
              >
                {isLoading ? t("revoking") : t("revokeCancellation")}
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              className="w-full h-10"
              onClick={() => handleCancelSubscription(true)}
              disabled={isLoading || !selectedFeedback}
            >
              {isLoading && isCancellingAtNextBilling
                ? t("cancelling")
                : t("cancelAtNextBilling")}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
