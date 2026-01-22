"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SheetHeader } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CurrencyCode,
  decodeCurrency,
  formatCurrency,
  getCurrencySymbol,
  decodeFloatCurrency,
} from "@/lib/currency-helper";
import type {
  AddOn,
  ProrationBillingMode,
  ProductCollectionProduct,
  ChangeSubscriptionPlanPreviewResponse,
  LineItem,
} from "@/app/session/subscriptions/[id]/types";
import {
  changeSubscriptionPlan,
  changeSubscriptionPlanPreview,
} from "@/app/session/subscriptions/[id]/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import parseError from "@/lib/clientErrorHelper";
import Loading from "@/components/loading";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlanPreviewProps {
  onBackClick: () => void;
  onConfirm: () => void;
  subscriptionId: string;
  selectedProduct: ProductCollectionProduct | null;
  currentProduct: ProductCollectionProduct | null;
  quantity: number;
  currentQuantity: number;
  currentAddons: AddOn[];
}

const asCurrencyCode = (
  currency: string | null | undefined,
): CurrencyCode | null => {
  return (currency ?? null) as CurrencyCode | null;
};

const getIntervalSuffix = (priceDetail: unknown) => {
  if (!priceDetail || typeof priceDetail !== "object") return "";
  const detail = priceDetail as {
    payment_frequency_count?: number;
    payment_frequency_interval?: string;
  };
  const interval = detail.payment_frequency_interval?.toLowerCase();
  const count =
    typeof detail.payment_frequency_count === "number"
      ? detail.payment_frequency_count
      : undefined;
  if (!interval) return "";
  if (!count || count === 1) return `/${interval}`;
  const plural = interval.endsWith("s") ? interval : `${interval}s`;
  return `/${count} ${plural}`;
};

function formatPlanPrice(
  product: ProductCollectionProduct,
  includeIntervalSuffix = true,
) {
  const currency = asCurrencyCode(product.currency);
  const formatted = formatCurrency(
    decodeCurrency(product.price, currency),
    currency,
  );
  if (!includeIntervalSuffix) return formatted;
  return `${formatted}${getIntervalSuffix(product.price_detail)}`;
}

const formatDecodedCurrency = (
  amount: number,
  currency: CurrencyCode | null | undefined,
): string => {
  if (!currency) return "—";
  const decoded = decodeCurrency(amount, currency);
  return formatCurrency(decoded, currency);
};

function PlanAddons({
  title,
  addons,
  isOpen,
  onOpenChange,
}: {
  title: string;
  addons: AddOn[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger className="flex w-full items-center justify-between bg-button-secondary-bg px-4 py-2 rounded-lg">
        <span className="text-text-secondary text-sm">{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-3">
        {addons.length === 0 ? (
          <p className="text-text-secondary text-sm">No addons</p>
        ) : (
          <div className="flex flex-col gap-2">
            {addons.map((addon) => (
              <div
                key={addon.addon_id}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="text-text-secondary break-words">
                  {addon.addon_id}
                </span>
                <span className="text-text-primary whitespace-nowrap">
                  Qty: {addon.quantity}
                </span>
              </div>
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

interface LineItemsCardProps {
  lineItems: LineItem[];
  currency: CurrencyCode | null;
  customerCredits?: number;
}

function LineItemRow({
  item,
  isLast,
}: {
  item: LineItem;
  isLast: boolean;
}) {
  const formatAmount = (amount: number) => {
    return formatDecodedCurrency(amount, item.currency as CurrencyCode);
  };

  // Format quantity to avoid floating point precision issues
  const formatQuantity = (qty: number) => {
    // Round to 4 decimal places
    const rounded = Math.round(qty * 10000) / 10000;
    // Format with up to 4 decimal places, removing trailing zeros
    const formatted = rounded.toFixed(4);
    return formatted.replace(/\.?0+$/, "");
  };

  // Calculate values based on proration factor
  // Quantity = quantity * sign of proration_factor
  const displayQuantity = item.quantity * Math.sign(item.proration_factor);

  // Tax = tax * proration_factor
  const displayTax = item.tax * item.proration_factor;

  // Unit price = abs(unit_price * proration_factor)
  const displayUnitPrice = Math.abs(item.unit_price * item.proration_factor);

  // Calculate total: (unit_price * quantity) + tax
  const lineTotal = displayUnitPrice * displayQuantity + displayTax;

  // Handle meter type items
  if (item.type === "meter") {
    return (
      <>
        <div className="grid grid-cols-5 gap-4 py-3">
          <div className="flex items-center">
            <span className="text-text-primary text-sm font-medium break-words">
              {item.name}
            </span>
          </div>
          <div className="flex items-center justify-end">
            <span className="text-text-primary text-sm whitespace-nowrap">
              {item.units_consumed || item.chargeable_units || "-"}
            </span>
          </div>
          <div className="flex items-center justify-end">
            <span className="text-text-primary text-sm whitespace-nowrap">
              {item.price_per_unit
                ? `${getCurrencySymbol(item.currency as CurrencyCode)}${decodeFloatCurrency({
                  value: Number(item.price_per_unit),
                  currency: item.currency as CurrencyCode,
                })}`
                : "-"}
            </span>
          </div>
          <div className="flex items-center justify-end">
            <span className="text-text-primary text-sm whitespace-nowrap">
              {formatAmount(displayTax)}
            </span>
          </div>
          <div className="flex items-center justify-end">
            <span className="text-text-primary text-sm whitespace-nowrap">
              {item.subtotal !== undefined
                ? formatAmount(item.subtotal + item.tax)
                : formatAmount(lineTotal)}
            </span>
          </div>
        </div>
        {!isLast && <div className="h-px w-full bg-border-secondary" />}
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-5 gap-4 py-3">
        {/* Item Name */}
        <div className="flex items-center">
          <span className="text-text-primary text-sm font-medium break-words">
            {item.name}
          </span>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-end">
          <span className="text-text-primary text-sm whitespace-nowrap">
            {formatQuantity(displayQuantity)}
          </span>
        </div>

        {/* Unit Price */}
        <div className="flex items-center justify-end">
          <span className="text-text-primary text-sm whitespace-nowrap">
            {formatAmount(displayUnitPrice)}
          </span>
        </div>

        {/* Tax */}
        <div className="flex items-center justify-end">
          <span className="text-text-primary text-sm whitespace-nowrap">
            {formatAmount(displayTax)}
          </span>
        </div>

        {/* Total */}
        <div className="flex items-center justify-end">
          <span className="text-text-primary text-sm whitespace-nowrap">
            {formatAmount(lineTotal)}
          </span>
        </div>
      </div>
      {!isLast && <div className="h-px w-full bg-border-secondary" />}
    </>
  );
}

function CustomerCreditRow({
  creditAmount,
  currency,
  isLast,
}: {
  creditAmount: number;
  currency: CurrencyCode | null;
  isLast: boolean;
}) {
  const formatAmount = (amount: number) => {
    return formatDecodedCurrency(amount, currency);
  };

  const formatQuantity = (qty: number) => {
    const rounded = Math.round(qty * 10000) / 10000;
    const formatted = rounded.toFixed(4);
    return formatted.replace(/\.?0+$/, "");
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-4 py-3">
        {/* Item Name with Description */}
        <div className="flex flex-col gap-1">
          <span className="text-text-primary text-sm font-medium break-words">
            Credit to Balance
          </span>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 cursor-help text-text-secondary flex-shrink-0" />
                </TooltipTrigger>
                <TooltipContent className="max-w-md">
                  <p className="text-xs">
                    Credit will be used to pay off future payments
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-end">
          <span className="text-text-primary text-sm whitespace-nowrap">
            {formatQuantity(1)}
          </span>
        </div>

        {/* Unit Price */}
        <div className="flex items-center justify-end">
          <span className="text-text-primary text-sm whitespace-nowrap">
            {formatAmount(creditAmount)}
          </span>
        </div>

        {/* Tax */}
        <div className="flex items-center justify-end">
          <span className="text-text-primary text-sm whitespace-nowrap">
            {formatAmount(0)}
          </span>
        </div>

        {/* Total */}
        <div className="flex items-center justify-end">
          <span className="text-text-primary text-sm whitespace-nowrap">
            {formatAmount(creditAmount)}
          </span>
        </div>
      </div>
      {!isLast && <div className="h-px w-full bg-border-secondary" />}
    </>
  );
}

function LineItemsCard({
  lineItems,
  currency,
  customerCredits = 0,
}: LineItemsCardProps) {
  const hasCustomerCredits = customerCredits !== 0;

  if (lineItems.length === 0 && !hasCustomerCredits) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <Card className="border-border-secondary">
        <CardContent className="p-4 rounded-lg">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 pb-3 border-b border-border-secondary">
            <div>
              <span className="text-text-secondary text-sm font-medium">
                Item
              </span>
            </div>
            <div className="flex justify-end">
              <span className="text-text-secondary text-sm font-medium">
                Quantity
              </span>
            </div>
            <div className="flex justify-end">
              <span className="text-text-secondary text-sm font-medium">
                Unit Price
              </span>
            </div>
            <div className="flex justify-end">
              <span className="text-text-secondary text-sm font-medium">
                Tax
              </span>
            </div>
            <div className="flex justify-end">
              <span className="text-text-secondary text-sm font-medium">
                Total
              </span>
            </div>
          </div>

          {/* Line Items */}
          <div className="flex flex-col">
            {lineItems.map((item, index) => (
              <LineItemRow
                key={item.id + index}
                item={item}
                isLast={index === lineItems.length - 1 && !hasCustomerCredits}
              />
            ))}
            {hasCustomerCredits && (
              <CustomerCreditRow
                creditAmount={customerCredits}
                currency={currency || (lineItems[0]?.currency as CurrencyCode | null) || null}
                isLast={true}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PlanPreview({
  onBackClick,
  onConfirm,
  subscriptionId,
  selectedProduct,
  currentProduct,
  quantity,
  currentQuantity,
  currentAddons,
}: PlanPreviewProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [billingMode] = useState<ProrationBillingMode>("prorated_immediately");
  const [isCurrentAddonsOpen, setIsCurrentAddonsOpen] = useState(false);
  const [isNewAddonsOpen, setIsNewAddonsOpen] = useState(false);
  const [previewData, setPreviewData] =
    useState<ChangeSubscriptionPlanPreviewResponse | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsConfirming(false);
  }, [selectedProduct?.product_id]);

  useEffect(() => {
    const fetchPreview = async () => {
      if (!selectedProduct) {
        setPreviewData(null);
        return;
      }

      setIsLoadingPreview(true);
      try {
        const preview = await changeSubscriptionPlanPreview({
          subscription_id: subscriptionId,
          data: {
            product_id: selectedProduct.product_id,
            quantity: Math.max(quantity, 1),
            proration_billing_mode: billingMode,
            addons: selectedProduct.addons_count > 0 ? currentAddons : null,
            metadata: null,
          },
        });
        setPreviewData(preview);
      } catch (error) {
        parseError(error, "Failed to load preview");
        onBackClick(); // Close the screen on error
      } finally {
        setIsLoadingPreview(false);
      }
    };

    fetchPreview();
  }, [
    subscriptionId,
    selectedProduct,
    quantity,
    billingMode,
    currentAddons,
    onBackClick,
  ]);

  if (!selectedProduct) {
    return (
      <>
        <SheetHeader className="border-b border-border-secondary p-4 gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 p-0 border border-border-secondary rounded-lg"
              onClick={onBackClick}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h4 className="text-lg font-semibold text-foreground">
              Confirm Plan Change
            </h4>
          </div>
        </SheetHeader>
        <div className="p-4">
          <p className="text-text-secondary text-sm">No plan selected</p>
        </div>
      </>
    );
  }

  const currency = previewData
    ? asCurrencyCode(previewData.immediate_charge.summary.currency)
    : asCurrencyCode(selectedProduct?.currency);

  const settlementCurrency = previewData
    ? asCurrencyCode(previewData.immediate_charge.summary.settlement_currency)
    : currency;

  const summary = previewData?.immediate_charge?.summary;

  const formatSettlementAmount = (amount: number) => {
    if (!settlementCurrency) return "—";
    return formatDecodedCurrency(amount, settlementCurrency);
  };

  const handleConfirmChangePlan = async () => {
    try {
      setIsConfirming(true);
      await changeSubscriptionPlan({
        subscription_id: subscriptionId,
        data: {
          product_id: selectedProduct.product_id,
          quantity: Math.max(quantity, 1),
          proration_billing_mode: billingMode,
          addons: selectedProduct.addons_count > 0 ? currentAddons : [],
          metadata: null,
        },
      });
      toast.success("Plan changed successfully");
      router.refresh();
      onConfirm();
    } catch (error) {
      parseError(error, "Failed to change plan. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      <SheetHeader className="border-b border-border-secondary p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 p-0 border border-border-secondary rounded-lg"
            onClick={onBackClick}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h4 className="text-base sm:text-lg font-semibold text-foreground">
            Confirm Plan Change
          </h4>
        </div>
      </SheetHeader>

      {isLoadingPreview ? (
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="flex flex-col items-center gap-3">
            <Loading />
            <p className="text-text-secondary text-sm">Loading preview...</p>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 flex flex-col gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <span className="text-text-primary font-normal text-sm">
                  Current
                </span>
                <Card className="border-border-secondary">
                  <CardContent className="p-4 flex flex-col gap-3">
                    {currentProduct ? (
                      <>
                        <div className="flex justify-between gap-2">
                          <span className="text-text-primary text-sm font-medium">
                            {currentProduct.name}
                          </span>
                          <div className="flex items-end flex-col gap-1">
                            <span className="text-text-primary text-sm">
                              {formatPlanPrice(currentProduct)}
                            </span>
                            <span className="text-text-secondary text-xs">
                              Qty: {Math.max(currentQuantity, 0)}
                            </span>
                          </div>
                        </div>
                        {currentProduct.description && (
                          <p className="text-text-secondary text-sm leading-relaxed">
                            {currentProduct.description}
                          </p>
                        )}
                        <div className="h-px w-full bg-border-secondary" />
                        <PlanAddons
                          title="View add-ons"
                          addons={currentAddons}
                          isOpen={isCurrentAddonsOpen}
                          onOpenChange={setIsCurrentAddonsOpen}
                        />
                      </>
                    ) : (
                      <p className="text-text-secondary text-sm">—</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-text-primary font-normal text-sm">
                  Updated
                </span>
                <Card className="border-border-secondary">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between gap-2">
                      <span className="text-text-primary text-sm font-medium">
                        {selectedProduct.name}
                      </span>
                      <div className="flex items-end flex-col gap-1">
                        <span className="text-text-primary text-sm">
                          {formatPlanPrice(selectedProduct)}
                        </span>
                        <span className="text-text-secondary text-xs">
                          Qty: {Math.max(quantity, 0)}
                        </span>
                      </div>
                    </div>
                    {selectedProduct.description && (
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    )}
                    <div className="h-px w-full bg-border-secondary" />
                    <PlanAddons
                      title="View add-ons"
                      addons={
                        previewData?.new_plan.addons ||
                        (selectedProduct.addons_count > 0 ? currentAddons : [])
                      }
                      isOpen={isNewAddonsOpen}
                      onOpenChange={setIsNewAddonsOpen}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {previewData && (
              <LineItemsCard
                lineItems={previewData.immediate_charge.line_items}
                currency={settlementCurrency}
                customerCredits={previewData.immediate_charge.summary.customer_credits}
              />
            )}

            <div className="flex flex-col gap-3">
              <Card className="border-border-secondary">
                <CardContent className="p-4 flex flex-col gap-0 bg-button-secondary-bg rounded-lg">
                  {[
                    {
                      label: "Total",
                      value:
                        previewData && summary
                          ? Math.abs(summary.settlement_amount || 0)
                          : null,
                      showSeparator: true,
                    },
                    {
                      label: "Tax",
                      value:
                        previewData && summary
                          ? Math.abs(summary.settlement_tax || 0)
                          : null,
                      showSeparator: true,
                    },
                    {
                      label: "Amount due now",
                      value:
                        previewData && summary
                          ? Math.abs(
                            (summary.settlement_amount || 0) +
                            (summary.settlement_tax || 0)
                          )
                          : null,
                      isBold: true,
                      showSeparator: false,
                    },
                  ].map((item, index) => (
                    <div key={index}>
                      <div
                        className={`flex items-center justify-between text-sm gap-2 ${item.isBold ? "" : "flex-wrap"
                          }`}
                      >
                        <span
                          className={
                            item.isBold
                              ? "text-text-primary break-words"
                              : "text-text-secondary break-words"
                          }
                        >
                          {item.label}
                        </span>
                        <span
                          className={`whitespace-nowrap ${item.isBold
                            ? "text-text-primary font-semibold text-base"
                            : "text-text-primary"
                            }`}
                        >
                          {item.value !== null
                            ? formatSettlementAmount(item.value)
                            : "—"}
                        </span>
                      </div>
                      {item.showSeparator && (
                        <div className="h-px w-full bg-border-secondary my-2" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Button
              className="w-full"
              onClick={handleConfirmChangePlan}
              disabled={isConfirming || isLoadingPreview || !previewData}
              loading={isConfirming}
            >
              {previewData && summary
                ? `Pay ${formatSettlementAmount(
                  Math.abs(
                    (summary.settlement_amount || 0) +
                    (summary.settlement_tax || 0)
                  )
                )}`
                : "Confirm Plan Change"}
            </Button>
          </div>
        </ScrollArea>
      )}
    </>
  );
}
