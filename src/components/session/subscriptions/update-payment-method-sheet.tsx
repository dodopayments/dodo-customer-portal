"use client";

import { useState, useEffect, useCallback, useId } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PaymentMethodItem } from "@/app/session/payment-methods/type";
import { getPaymentMethodLogoUrl } from "../payment-methods/payment-method-logo";
import {
  fetchEligiblePaymentMethods,
  getSessionToken,
} from "@/app/session/subscriptions/[id]/action";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import parseError from "@/lib/parseError";
import { api } from "@/lib/http";
import {
  UpdatePaymentMethodParams,
  UpdatePaymentMethodResponse,
} from "@/app/session/subscriptions/[id]/types";

// TypeScript Interfaces
interface UpdatePaymentMethodSheetProps {
  subscription_id: string;
  variant?: "secondary" | "default";
}

interface PaymentMethodOptionProps {
  paymentMethod: PaymentMethodItem;
  baseId: string;
  value: string;
  selectedPaymentMethodId: SelectedPaymentMethod;
}

type SelectedPaymentMethod = string | "new" | null;

// Client-side API function
async function updatePaymentMethod(
  params: UpdatePaymentMethodParams
): Promise<UpdatePaymentMethodResponse> {
  const { subscription_id, type, payment_method_id, return_url } = params;

  let requestBody: {
    type: string;
    payment_method_id?: string;
    return_url?: string | null;
  };

  if (type === "new") {
    requestBody = {
      type: "new",
      ...(return_url !== undefined && { return_url }),
    };
  } else {
    if (!payment_method_id) {
      throw new Error(
        "payment_method_id is required for existing payment method"
      );
    }
    requestBody = {
      type: "existing",
      payment_method_id,
    };
  }

  const token = await getSessionToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await api.post<UpdatePaymentMethodResponse>(
    `/customer-portal/subscriptions/${subscription_id}/update-payment-method`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

// Helper Functions
function formatPaymentMethodType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getPaymentMethodDisplayName(paymentMethod: PaymentMethodItem): string {
  const connectorMethods = Object.values(
    paymentMethod.connector_payment_methods
  );
  for (const method of connectorMethods) {
    if (method.payment_method_type === "apple_pay") return "Apple Pay";
    if (method.payment_method_type === "google_pay") return "Google Pay";
  }
  return formatPaymentMethodType(paymentMethod.payment_method);
}

// Subcomponents
function PaymentMethodOption({
  paymentMethod,
  baseId,
  selectedPaymentMethodId,
  value,
}: PaymentMethodOptionProps) {
  const itemId = `${baseId}-${value}`;
  const connectorMethods = Object.values(
    paymentMethod.connector_payment_methods
  );
  const paymentMethodType =
    connectorMethods.length > 0
      ? connectorMethods[0].payment_method_type
      : undefined;

  const logo = getPaymentMethodLogoUrl(
    paymentMethodType,
    paymentMethod.payment_method,
    paymentMethod.card?.card_network,
    paymentMethod.card?.card_type
  );

  const displayName = getPaymentMethodDisplayName(paymentMethod);
  const isCard = paymentMethod.payment_method === "card";
  const card = paymentMethod.card;

  return (
    <div
      className={cn(
        "relative flex w-full items-start gap-2 rounded-lg border border-border-secondary p-4 shadow-xs outline-none has-data-[state=checked]:border-accent",
        selectedPaymentMethodId === value && "border-accent"
      )}
    >
      <RadioGroupItem
        value={value}
        id={itemId}
        className="order-1 after:absolute after:inset-0"
      />
      <div className="flex grow items-start gap-3">
        <div className="shrink-0 border border-border-secondary rounded-md p-2 py-1 flex items-center justify-center w-12 h-9">
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
            <logo.Icon
              size={32}
              className="text-text-primary"
              weight="regular"
            />
          ) : (
            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">
                {displayName.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="grid grow pt-1">
          <Label
            htmlFor={itemId}
            className="text-text-primary font-display font-medium text-sm leading-tight tracking-normal cursor-pointer"
          >
            {displayName}
          </Label>
          {isCard && card && (
            <div className="flex flex-row items-center gap-2 flex-wrap mt-1">
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
    </div>
  );
}

// Main Component
export function UpdatePaymentMethodSheet({
  subscription_id,
  variant = "secondary",
}: UpdatePaymentMethodSheetProps) {
  const baseId = useId();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState<SelectedPaymentMethod>(null);
  const [eligiblePaymentMethods, setEligiblePaymentMethods] = useState<
    PaymentMethodItem[] | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch eligible payment methods before opening sheet
  const handleOpenSheet = useCallback(async () => {
    setLoadingData(true);
    try {
      const data = await fetchEligiblePaymentMethods(subscription_id);
      setEligiblePaymentMethods(data.items);
      setOpen(true);
    } catch (error) {
      parseError(error, "Failed to load payment methods. Please try again.");
      setEligiblePaymentMethods(null);
    } finally {
      setLoadingData(false);
    }
  }, [subscription_id]);

  // Reset state when sheet closes
  useEffect(() => {
    if (!open) {
      setSelectedPaymentMethodId(null);
      setEligiblePaymentMethods(null);
    }
  }, [open]);

  // Select first payment method on initial load
  useEffect(() => {
    if (
      eligiblePaymentMethods &&
      eligiblePaymentMethods.length > 0 &&
      !selectedPaymentMethodId
    ) {
      setSelectedPaymentMethodId(eligiblePaymentMethods[0].payment_method_id);
    }
  }, [eligiblePaymentMethods, selectedPaymentMethodId]);

  const handleSubmit = useCallback(
    async ({ type }: { type: "existing" | "new" }) => {
      if (type === "existing" && !selectedPaymentMethodId) {
        toast.error("Please select a payment method");
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await updatePaymentMethod({
          subscription_id,
          type: type === "existing" ? "existing" : "new",
          ...(type === "existing" && {
            payment_method_id: selectedPaymentMethodId ?? undefined,
          }),
        });

        // If the API returns a payment_link, redirect to it
        if (type === "new" && result.payment_link) {
          window.open(result.payment_link, "_blank", "noopener,noreferrer");
          return;
        }

        toast.success(
          type === "existing"
            ? "Payment method updated successfully"
            : "Payment method setup initiated"
        );
        router.refresh();
        setOpen(false);
      } catch (error) {
        parseError(error, "Failed to update payment method. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedPaymentMethodId, subscription_id, router]
  );

  const handleValueChange = useCallback((value: string) => {
    setSelectedPaymentMethodId(value);
  }, []);

  const handleAddNewPaymentMethod = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const result = await updatePaymentMethod({
        subscription_id,
        type: "new",
        return_url: typeof window !== "undefined" ? window.location.href : null,
      });

      // If the API returns a payment_link, redirect to it
      if (result.payment_link) {
        window.location.href = result.payment_link;
        return;
      }

      toast.success("Payment method setup initiated");
      router.refresh();
      setOpen(false);
    } catch (error) {
      parseError(error, "Failed to add new payment method. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [subscription_id, router]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!loadingData) {
        setOpen(newOpen);
      }
    },
    [loadingData]
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <Button
        onClick={handleOpenSheet}
        loading={loadingData}
        variant={variant}
        className="my-auto"
      >
        Edit
      </Button>
      <SheetContent className="flex flex-col p-0 overflow-y-auto">
        <SheetHeader className="border-b p-6 border-border-secondary pb-4">
          <SheetTitle className="text-left font-display font-semibold text-base leading-tight tracking-normal">
            Edit Payment Method
          </SheetTitle>
        </SheetHeader>
        <div className="grid border-b border-border-secondary auto-rows-min gap-6 p-6">
          {eligiblePaymentMethods && eligiblePaymentMethods.length > 0 ? (
            <>
              <RadioGroup
                className="gap-4"
                value={selectedPaymentMethodId || undefined}
                onValueChange={handleValueChange}
              >
                {eligiblePaymentMethods.map((paymentMethod) => (
                  <PaymentMethodOption
                    key={paymentMethod.payment_method_id}
                    paymentMethod={paymentMethod}
                    baseId={baseId}
                    value={paymentMethod.payment_method_id}
                    selectedPaymentMethodId={selectedPaymentMethodId}
                  />
                ))}
              </RadioGroup>
              <div className="flex justify-start items-center w-full">
                <Button
                  variant="secondary"
                  className="w-fit"
                  onClick={() => handleSubmit({ type: "new" })}
                >
                  Add Payment Method
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <p className="text-text-secondary text-sm">
                No eligible payment methods found.
              </p>
              <Button
                variant="secondary"
                className="w-fit"
                onClick={handleAddNewPaymentMethod}
              >
                Add Payment Method
              </Button>
            </div>
          )}
        </div>
        <SheetFooter className="flex flex-col gap-4 p-6">
          <Button
            type="button"
            onClick={() => handleSubmit({ type: "existing" })}
            className="w-full"
            disabled={isSubmitting || !selectedPaymentMethodId}
          >
            {isSubmitting ? "Updating..." : "Confirm Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
