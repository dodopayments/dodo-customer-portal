"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SheetHeader } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency-helper";
import type { DummyProduct } from "./dummy-products";

type BillingMode =
    | "prorated_immediately"
    | "full_immediately"
    | "difference_immediately";

interface PlanPreviewProps {
    onBackClick: () => void;
    onConfirm: () => void;
    selectedProduct: DummyProduct | null;
    currentProduct: DummyProduct | null;
    quantity: number;
}

function formatPlanPrice(product: DummyProduct, includeIntervalSuffix = true) {
    const formatted = formatCurrency(product.price, product.currency);
    if (!includeIntervalSuffix) return formatted;
    return `${formatted}/${product.payment_frequency_interval}`;
}

function computeDummyCharge({
    currentProduct,
    selectedProduct,
    quantity,
    billingMode,
}: {
    currentProduct: DummyProduct | null;
    selectedProduct: DummyProduct | null;
    quantity: number;
    billingMode: BillingMode;
}) {
    if (!selectedProduct) {
        return {
            charge: 0,
            tax: 0,
            dueNow: 0,
            creditLine: null as null | { label: string; amount: number },
            chargeLine: null as null | { label: string; amount: number },
        };
    }

    const newAmount = selectedProduct.price * Math.max(quantity, 0);
    const currentAmount = currentProduct ? currentProduct.price * 1 : 0;

    const difference = Math.max(newAmount - currentAmount, 0);
    const prorated = difference * 0.5; // dummy proration factor

    const charge =
        billingMode === "full_immediately"
            ? newAmount
            : billingMode === "difference_immediately"
                ? difference
                : prorated;

    const tax = charge * 0.1; // dummy tax
    const dueNow = charge + tax;

    return {
        charge,
        tax,
        dueNow,
        creditLine: currentProduct
            ? { label: `Credit: ${currentProduct.name}`, amount: -currentAmount }
            : null,
        chargeLine: { label: `Charge: ${selectedProduct.name}`, amount: newAmount },
    };
}

export function PlanPreview({
    onBackClick,
    onConfirm,
    selectedProduct,
    currentProduct,
    quantity,
}: PlanPreviewProps) {
    const [billingMode] = useState<BillingMode>(
        "prorated_immediately",
    );
    const [isConfirming, setIsConfirming] = useState(false);

    const currency = selectedProduct?.currency ?? currentProduct?.currency ?? "USD";

    const summary = useMemo(() => {
        return computeDummyCharge({
            currentProduct,
            selectedProduct,
            quantity,
            billingMode,
        });
    }, [billingMode, currentProduct, quantity, selectedProduct]);

    useEffect(() => {
        setIsConfirming(false);
    }, [selectedProduct?.product_id]);

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
                        Confirm new plan
                    </h4>
                </div>
            </SheetHeader>

            <ScrollArea className="flex-1 min-h-0">
                <div className="p-4 flex flex-col gap-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card className="border-border-secondary">
                            <CardContent className="p-4 flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-2">
                                    <h5 className="text-text-primary font-medium text-sm">
                                        Current plan
                                    </h5>
                                    <Badge variant="green" type="default">
                                        Current
                                    </Badge>
                                </div>
                                {currentProduct ? (
                                    <>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex flex-col">
                                                <span className="text-text-primary text-sm font-medium">
                                                    {currentProduct.name}
                                                </span>
                                                <span className="text-text-secondary text-sm">
                                                    {formatPlanPrice(currentProduct)}
                                                </span>
                                            </div>
                                            <span className="text-text-secondary text-sm">
                                                Qty: 1
                                            </span>
                                        </div>
                                        {currentProduct.description && (
                                            <p className="text-text-secondary text-sm leading-relaxed">
                                                {currentProduct.description}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-text-secondary text-sm">—</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-border-secondary">
                            <CardContent className="p-4 flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-2">
                                    <h5 className="text-text-primary font-medium text-sm">
                                        Updated plan
                                    </h5>
                                    <Badge variant="blue" type="default">
                                        New
                                    </Badge>
                                </div>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-text-primary text-sm font-medium">
                                            {selectedProduct.name}
                                        </span>
                                        <span className="text-text-secondary text-sm">
                                            {formatPlanPrice(selectedProduct)}
                                        </span>
                                    </div>
                                    <span className="text-text-secondary text-sm">
                                        Qty: {Math.max(quantity, 0)}
                                    </span>
                                </div>
                                {selectedProduct.description && (
                                    <p className="text-text-secondary text-sm leading-relaxed">
                                        {selectedProduct.description}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-border-secondary">
                        <CardContent className="p-4 flex flex-col gap-3 bg-button-secondary-bg rounded-lg">
                            <h5 className="text-text-primary font-medium text-sm">
                                Line items (dummy)
                            </h5>
                            <div className="flex flex-col gap-2">
                                {summary.creditLine && (
                                    <div className="flex items-center justify-between text-sm gap-2">
                                        <span className="text-text-secondary">
                                            {summary.creditLine.label}
                                        </span>
                                        <span className="text-text-primary whitespace-nowrap">
                                            {formatCurrency(summary.creditLine.amount, currency)}
                                        </span>
                                    </div>
                                )}
                                {summary.chargeLine && (
                                    <div className="flex items-center justify-between text-sm gap-2">
                                        <span className="text-text-secondary">
                                            {summary.chargeLine.label}
                                        </span>
                                        <span className="text-text-primary whitespace-nowrap">
                                            {formatCurrency(summary.chargeLine.amount, currency)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border-secondary">
                        <CardContent className="p-4 flex flex-col gap-0 bg-button-secondary-bg rounded-lg">
                            {[
                                { label: "Total", value: summary.charge, sep: true },
                                { label: "Tax", value: summary.tax, sep: true },
                                { label: "Amount due now", value: summary.dueNow, sep: false, bold: true },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex items-center justify-between text-sm gap-2">
                                        <span
                                            className={
                                                item.bold
                                                    ? "text-text-primary break-words"
                                                    : "text-text-secondary break-words"
                                            }
                                        >
                                            {item.label}
                                        </span>
                                        <span
                                            className={
                                                item.bold
                                                    ? "text-text-primary font-semibold text-base whitespace-nowrap"
                                                    : "text-text-primary whitespace-nowrap"
                                            }
                                        >
                                            {formatCurrency(item.value, currency)}
                                        </span>
                                    </div>
                                    {item.sep && <div className="h-px w-full bg-border-secondary my-2" />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Button
                        className="w-full"
                        onClick={() => {
                            setIsConfirming(true);
                            onConfirm();
                        }}
                        loading={isConfirming}
                    >
                        Pay now
                    </Button>
                </div>
            </ScrollArea>
        </>
    );
}


