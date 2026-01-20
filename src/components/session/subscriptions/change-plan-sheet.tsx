"use client";

import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Sheet,
    SheetTitle,
    SheetDescription,
    SheetHeader,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/currency-helper";
import { PlanPreview } from "./plan-preview";
import { DUMMY_PRODUCTS, type DummyProduct } from "./dummy-products";

type ViewState = "select" | "preview";

interface ChangePlanSheetProps {
    currentProductId?: string;
}

// Quantity Selector Component
function QuantitySelector({
    quantity,
    onDecrease,
    onIncrease,
}: {
    quantity: number;
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
                disabled={quantity < 1}
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

export function ChangePlanSheet({ currentProductId }: ChangePlanSheetProps) {
    const [open, setOpen] = useState(false);
    const [currentView, setCurrentView] = useState<ViewState>("select");
    const [selectedPlan, setSelectedPlan] = useState<string>(
        currentProductId || ""
    );
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [selectedProduct, setSelectedProduct] = useState<DummyProduct | null>(
        null,
    );
    const [currentProduct, setCurrentProduct] = useState<DummyProduct | null>(
        null,
    );
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) {
            setCurrentView("select");
            setSelectedProduct(null);
            setCurrentProduct(null);
            setSelectedQuantity(1);
        }
    };

    const handlePlanSelect = (planId: string) => {
        // Update quantities: new selected plan -> 1, previous selected plan -> 0
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
        if (value < 0) {
            return;
        }
        setQuantities((prev) => ({
            ...prev,
            [productId]: value,
        }));
    };

    const formatRecurringPrice = (
        product: DummyProduct,
        includeIntervalSuffix: boolean = false
    ) => {
        const formatted = formatCurrency(product.price, product.currency);

        if (!includeIntervalSuffix) {
            return formatted;
        }

        const intervalSuffix = product.payment_frequency_interval
            ? `/${product.payment_frequency_interval.toLowerCase()}`
            : "";

        return `${formatted}${intervalSuffix}`;
    };

    const handleProceed = () => {
        const nextSelected = DUMMY_PRODUCTS.find((p) => p.product_id === selectedPlan) ?? null;
        const nextCurrent =
            (currentProductId
                ? DUMMY_PRODUCTS.find((p) => p.product_id === currentProductId) ?? null
                : null) ?? null;

        const qty = quantities[selectedPlan] || 1;

        setSelectedProduct(nextSelected);
        setCurrentProduct(nextCurrent);
        setSelectedQuantity(qty);
        setCurrentView("preview");
    };

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
                            <SheetTitle className="mr-auto">Select new subscription</SheetTitle>
                            <SheetDescription className="text-text-secondary">
                                Select a subscription from list to replace the existing
                            </SheetDescription>
                        </SheetHeader>
                        <ScrollArea className="flex-1 min-h-0">
                            <div className="p-4 flex flex-col gap-4">
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-sm font-medium text-text-secondary">
                                        Available subscription products:
                                    </h3>
                                    <RadioGroup
                                        value={selectedPlan}
                                        onValueChange={handlePlanSelect}
                                        className="space-y-2"
                                    >
                                        {DUMMY_PRODUCTS.map((product) => {
                                            const isCurrent = product.product_id === currentProductId;
                                            return (
                                                <Card
                                                    key={product.product_id}
                                                    className="border-border-secondary"
                                                >
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
                                                                        {formatRecurringPrice(product, true)}
                                                                    </span>
                                                                </div>
                                                                {product.description && (
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
                                                                        onDecrease={() =>
                                                                            handleQuantityChange(
                                                                                product.product_id,
                                                                                (quantities[product.product_id] || 0) - 1
                                                                            )
                                                                        }
                                                                        onIncrease={() =>
                                                                            handleQuantityChange(
                                                                                product.product_id,
                                                                                (quantities[product.product_id] || 0) + 1
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
                            </div>
                        </ScrollArea>
                    </div>
                ) : (
                    <PlanPreview
                        selectedProduct={selectedProduct}
                        currentProduct={currentProduct}
                        quantity={selectedQuantity}
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
