"use client";

import React, { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  CurrencyCode,
  decodeCurrency,
  formatCurrency,
} from "@/lib/currency-helper";
import { PlanPreview } from "./plan-preview";
import type {
  ProductCollectionData,
  ProductCollectionProduct,
} from "@/app/session/subscriptions/[id]/types";
import type { AddOn } from "@/app/session/subscriptions/[id]/types";

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
  includeIntervalSuffix: boolean = true,
) {
  const currency = asCurrencyCode(product.currency);
  const formatted = formatCurrency(
    decodeCurrency(product.price, currency),
    currency,
  );
  if (!includeIntervalSuffix) return formatted;
  return `${formatted}${getIntervalSuffix(product.price_detail)}`;
}

type ViewState = "select" | "preview";

interface ChangePlanSheetProps {
  currentProductId?: string;
  subscriptionId: string;
  currentAddons: AddOn[];
  currentQuantity: number;
  productCollection?: ProductCollectionData | null;
}

function QuantitySelector({
  quantity,
  minQuantity = 0,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  minQuantity?: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="border border-border-secondary rounded-lg p-1 w-fit flex items-center gap-2">
      <Button
        variant="secondary"
        size="icon"
        className="h-6 w-6 rounded-md"
        onClick={onDecrease}
        disabled={quantity <= minQuantity}
      >
        <Minus className="h-2 w-2" />
      </Button>
      <p className="text-xs text-text-secondary">{quantity}</p>
      <Button
        variant="secondary"
        size="icon"
        className="h-6 w-6 rounded-md"
        onClick={onIncrease}
      >
        <Plus className="h-2 w-2" />
      </Button>
    </div>
  );
}

export function ChangePlanSheet({
  currentProductId,
  subscriptionId,
  currentAddons,
  currentQuantity,
  productCollection,
}: ChangePlanSheetProps) {
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>("select");
  const [selectedPlan, setSelectedPlan] = useState<string>(
    currentProductId || "",
  );
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedProduct, setSelectedProduct] =
    useState<ProductCollectionProduct | null>(null);
  const [currentProduct, setCurrentProduct] =
    useState<ProductCollectionProduct | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const availableGroups = (productCollection?.groups ?? []).filter(
    (g) => g.status !== false,
  );
  const availableProducts = availableGroups.flatMap((g) =>
    (g.products ?? []).filter((p) => p.status !== false),
  );

  // Find the group that contains the current product
  const tabWithCurrentProduct = React.useMemo(() => {
    if (!currentProductId || availableGroups.length === 0) {
      return availableGroups[0]?.group_id || "";
    }
    const groupWithCurrent = availableGroups.find((group) =>
      group.products?.some((p) => p.product_id === currentProductId),
    );
    return groupWithCurrent?.group_id || availableGroups[0]?.group_id || "";
  }, [availableGroups, currentProductId]);

  const [activeTab, setActiveTab] = useState<string>(tabWithCurrentProduct);

  useEffect(() => {
    if (!open) return;
    if (tabWithCurrentProduct) {
      setActiveTab(tabWithCurrentProduct);
    }
  }, [open, tabWithCurrentProduct]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setActiveTab(tabWithCurrentProduct);
    } else {
      setCurrentView("select");
      setSelectedProduct(null);
      setCurrentProduct(null);
      setSelectedQuantity(1);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setQuantities((prev) => {
      const updated = { ...prev };

      if (selectedPlan && selectedPlan !== planId) {
        updated[selectedPlan] = 0;
      }

      updated[planId] = 1;
      return updated;
    });

    setSelectedPlan(planId);
  };

  const handleQuantityChange = (productId: string, value: number) => {
    const minQuantity = productId === selectedPlan ? 1 : 0;
    const nextValue = Math.max(value, minQuantity);
    setQuantities((prev) => ({
      ...prev,
      [productId]: nextValue,
    }));
  };

  const handleProceed = () => {
    const nextSelected =
      availableProducts.find((p) => p.product_id === selectedPlan) ?? null;
    const nextCurrent =
      (currentProductId
        ? (availableProducts.find((p) => p.product_id === currentProductId) ??
          null)
        : null) ?? null;

    const qty = quantities[selectedPlan] || 1;

    setSelectedProduct(nextSelected);
    setCurrentProduct(nextCurrent);
    setSelectedQuantity(qty);
    setCurrentView("preview");
  };

  const renderGroupProducts = (group: {
    group_id: string;
    group_name: string | null;
    products: ProductCollectionProduct[];
  }) => (
    <div className="flex flex-col gap-3">
      <RadioGroup
        value={selectedPlan}
        onValueChange={handlePlanSelect}
        className="space-y-2"
      >
        {group.products
          ?.filter((p) => p.status !== false)
          .map((product) => {
            const isCurrent = product.product_id === currentProductId;
            return (
              <Card key={product.product_id} className="border-border-secondary">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isCurrent ? (
                            <span className="text-text-primary font-medium text-sm">
                              {product.name}
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                value={product.product_id}
                                id={product.product_id}
                              />
                              <label
                                htmlFor={product.product_id}
                                className="text-text-primary font-medium cursor-pointer text-sm"
                              >
                                {product.name}
                              </label>
                            </div>
                          )}
                          {isCurrent && (
                            <Badge variant="green" type="default">
                              Current plan
                            </Badge>
                          )}
                        </div>
                        <span className="text-text-primary font-medium text-sm">
                          {formatPlanPrice(product, true)}
                        </span>
                      </div>
                      {!!product.description && (
                        <>
                          <div className="h-px w-full bg-border-secondary" />
                          <p className="text-text-secondary text-sm leading-relaxed">
                            {product.description}
                          </p>
                        </>
                      )}
                      {!isCurrent && (
                        <QuantitySelector
                          quantity={quantities[product.product_id] || 0}
                          minQuantity={product.product_id === selectedPlan ? 1 : 0}
                          onDecrease={() =>
                            handleQuantityChange(
                              product.product_id,
                              (quantities[product.product_id] || 0) - 1,
                            )
                          }
                          onIncrease={() =>
                            handleQuantityChange(
                              product.product_id,
                              (quantities[product.product_id] || 0) + 1,
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </RadioGroup>
      <Button
        className="w-full"
        onClick={handleProceed}
        disabled={!selectedPlan || selectedPlan === currentProductId}
      >
        Proceed
      </Button>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="secondary">Change Plan</Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        floating
        className="m-6 gap-0 rounded-xl border p-0 border-border-secondary sm:max-w-4xl flex flex-col overflow-hidden"
      >
        {currentView === "select" ? (
          <div className="flex flex-col h-full min-h-0">
            <SheetHeader className="border-b border-border-secondary p-4 flex-shrink-0">
              <SheetTitle className="mr-auto">Select a new plan</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 flex flex-col gap-4">
                {availableGroups.length === 0 ? (
                  <p className="text-text-secondary text-sm">
                    No subscription products available.
                  </p>
                ) : availableGroups.length === 1 ? (
                  renderGroupProducts(availableGroups[0])
                ) : (
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="w-full justify-start">
                      {availableGroups.map((group) => (
                        <TabsTrigger
                          key={group.group_id}
                          value={group.group_id}
                          className="data-[state=active]:bg-bg-secondary rounded-lg !after:content-none !after:h-0 !after:absolute !after:inset-x-0 !after:bottom-0 !border-b-0"
                        >
                          {group.group_name || "Unnamed Group"}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {availableGroups.map((group) => (
                      <TabsContent
                        key={group.group_id}
                        value={group.group_id}
                        className="mt-4"
                      >
                        {renderGroupProducts(group)}
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <PlanPreview
            selectedProduct={selectedProduct}
            currentProduct={currentProduct}
            quantity={selectedQuantity}
            currentQuantity={currentQuantity}
            subscriptionId={subscriptionId}
            currentAddons={currentAddons}
            onBackClick={() => setCurrentView("select")}
            onConfirm={() => {
              setOpen(false);
              setCurrentView("select");
            }}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
