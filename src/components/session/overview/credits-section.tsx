"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditEntitlementItem, CreditLedgerItem } from "@/app/session/profile/types";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CreditsSectionProps {
    entitlements: CreditEntitlementItem[];
    creditLedgerByEntitlement: Record<string, CreditLedgerItem[]>;
}

export function CreditsSection({
    entitlements,
    creditLedgerByEntitlement,
}: CreditsSectionProps) {
    const [selectedId, setSelectedId] = useState<string>(
        entitlements[0]?.credit_entitlement_id || ""
    );

    const selectedEntitlement = entitlements.find(
        (e) => e.credit_entitlement_id === selectedId
    );
    const creditLedger = creditLedgerByEntitlement[selectedId] || [];

    if (!entitlements || entitlements.length === 0) {
        return null;
    }

    const balance = Number(selectedEntitlement?.balance || 0);
    const overage = Number(selectedEntitlement?.overage || 0);
    const isOverage = balance === 0 && overage > 0;

    if (balance <= 0 && overage <= 0 && creditLedger.length === 0) {
        return null;
    }

    return (
        <section id="credits">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-medium text-text-primary">
                    Credits
                </h2>
            </div>

            {entitlements.length > 1 && (
                <div className="mb-6">
                    <Select
                        value={selectedId}
                        onValueChange={setSelectedId}
                    >
                        <SelectTrigger className="w-fit min-w-[140px]">
                            <SelectValue placeholder="Select credit entitlement" />
                        </SelectTrigger>
                        <SelectContent>
                            {entitlements.map((entitlement) => (
                                <SelectItem
                                    key={entitlement.credit_entitlement_id}
                                    value={entitlement.credit_entitlement_id}
                                >
                                    {entitlement.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <Card>
                <CardContent className="p-4 sm:p-6 md:p-8">
                    <div className="text-center py-4 sm:py-6 mb-6 sm:mb-8">
                        <p
                            className={cn(
                                "text-2xl sm:text-4xl font-display font-semibold mb-2",
                                isOverage
                                    ? "text-red-500"
                                    : "text-text-success-primary"
                            )}
                        >
                            {isOverage
                                ? `${overage} ${selectedEntitlement?.unit || ""}`
                                : `${balance} ${selectedEntitlement?.unit || ""}`}
                        </p>
                        <p className="text-sm text-text-secondary">
                            {isOverage
                                ? "Overage balance"
                                : "Available credit balance"}
                        </p>
                    </div>

                    <div className="border border-border-secondary rounded-lg overflow-hidden">
                        <div className="hidden sm:grid grid-cols-12 gap-4 px-4 sm:px-6 py-3 bg-bg-secondary/50 border-b border-border-secondary">
                            <div className="col-span-2 text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Type
                            </div>
                            <div className="col-span-7 text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Description
                            </div>
                            <div className="col-span-3 text-xs font-medium text-text-secondary uppercase tracking-wider text-right">
                                Amount
                            </div>
                        </div>

                        <div className="divide-y divide-border-secondary">
                            {creditLedger.length === 0 ? (
                                <div className="px-4 sm:px-6 py-12 text-center">
                                    <p className="text-sm text-text-secondary">
                                        No transactions yet
                                    </p>
                                </div>
                            ) : (
                                creditLedger.map((ledgerItem) => (
                                    <div
                                        key={ledgerItem.id}
                                        className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-bg-secondary/30 transition-colors"
                                    >
                                        <div className="flex items-center justify-between sm:hidden">
                                            <Badge
                                                variant={ledgerItem.is_credit ? "green" : "red"}
                                                className="capitalize"
                                            >
                                                {ledgerItem.is_credit ? "Credit" : "Debit"}
                                            </Badge>
                                            <span className={cn(
                                                "text-sm font-medium",
                                                ledgerItem.is_credit
                                                    ? "text-text-success-primary"
                                                    : "text-text-error-primary"
                                            )}>
                                                {ledgerItem.is_credit ? "+" : "-"}
                                                {ledgerItem.amount} {selectedEntitlement?.unit || ""}
                                            </span>
                                        </div>

                                        <div className="sm:hidden">
                                            <span className="text-sm text-text-primary">
                                                {ledgerItem.description ||
                                                    ledgerItem.transaction_type?.replace(/_/g, " ")}
                                            </span>
                                        </div>

                                        <div className="hidden sm:block sm:col-span-2">
                                            <Badge
                                                variant={ledgerItem.is_credit ? "green" : "red"}
                                                className="capitalize"
                                            >
                                                {ledgerItem.is_credit ? "Credit" : "Debit"}
                                            </Badge>
                                        </div>

                                        <div className="hidden sm:block sm:col-span-7">
                                            <span className="text-sm text-text-primary">
                                                {ledgerItem.description ||
                                                    ledgerItem.transaction_type?.replace(/_/g, " ")}
                                            </span>
                                        </div>

                                        <div className="hidden sm:block sm:col-span-3 text-right">
                                            <span className={cn(
                                                "text-sm font-medium",
                                                ledgerItem.is_credit
                                                    ? "text-text-success-primary"
                                                    : "text-text-error-primary"
                                            )}>
                                                {ledgerItem.is_credit ? "+" : "-"}
                                                {ledgerItem.amount} {selectedEntitlement?.unit || ""}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
