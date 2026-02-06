"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletItem, WalletLedgerItem } from "@/app/session/profile/types";
import {
    CurrencyCode,
    decodeCurrency,
    formatCurrency,
} from "@/lib/currency-helper";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletsSectionProps {
    wallets: WalletItem[];
    walletLedger: WalletLedgerItem[];
}

export function WalletsSection({ wallets, walletLedger }: WalletsSectionProps) {
    const [selectedCurrency, setSelectedCurrency] = useState<string>(
        wallets[0]?.currency || "USD"
    );

    const selectedWallet = wallets.find(
        (w) => w.currency === selectedCurrency
    );

    if (!wallets || wallets.length === 0) {
        return null;
    }

    const selectedBalance = selectedWallet?.balance ?? 0;
    if (selectedBalance <= 0 && walletLedger.length === 0) {
        return null;
    }

    return (
        <section id="wallets">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-medium text-text-primary">
                    Wallet
                </h2>
            </div>

            {wallets.length > 1 && (
                <div className="mb-6">
                    <div className="relative inline-block">
                        <select
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                            className="appearance-none bg-bg-secondary border border-border-secondary rounded-lg px-4 py-2 pr-10 text-sm font-medium text-text-primary cursor-pointer hover:bg-bg-focused transition-colors"
                        >
                            {wallets.map((wallet) => (
                                <option key={wallet.currency} value={wallet.currency}>
                                    {wallet.currency} wallet
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                    </div>
                </div>
            )}

            <Card>
                <CardContent className="p-4 sm:p-6 md:p-8">
                    <div className="text-center py-4 sm:py-6 mb-6 sm:mb-8">
                        <p className="text-2xl sm:text-4xl font-display font-semibold text-text-success-primary mb-2">
                            {selectedWallet
                                ? formatCurrency(
                                    decodeCurrency(
                                        selectedWallet.balance || 0,
                                        selectedWallet.currency as CurrencyCode
                                    ),
                                    selectedWallet.currency as CurrencyCode
                                )
                                : "$0.00"}
                        </p>
                        <p className="text-sm text-text-secondary">
                            Available balance
                        </p>
                    </div>

                    <div className="border border-border-secondary rounded-lg overflow-hidden">
                        <div className="hidden sm:grid grid-cols-12 gap-4 px-4 sm:px-6 py-3 bg-bg-secondary/50 border-b border-border-secondary">
                            <div className="col-span-2 text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Type
                            </div>
                            <div className="col-span-7 text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Reason
                            </div>
                            <div className="col-span-3 text-xs font-medium text-text-secondary uppercase tracking-wider text-right">
                                Amount
                            </div>
                        </div>

                        <div className="divide-y divide-border-secondary">
                            {walletLedger.length === 0 ? (
                                <div className="px-4 sm:px-6 py-12 text-center">
                                    <p className="text-sm text-text-secondary">
                                        No transactions yet
                                    </p>
                                </div>
                            ) : (
                                walletLedger.map((ledgerItem) => (
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
                                                {formatCurrency(
                                                    decodeCurrency(
                                                        Math.abs(ledgerItem.amount),
                                                        ledgerItem.currency as CurrencyCode
                                                    ),
                                                    ledgerItem.currency as CurrencyCode
                                                )}
                                            </span>
                                        </div>

                                        <div className="sm:hidden">
                                            <span className="text-sm text-text-primary">
                                                {ledgerItem.description || ledgerItem.event_type}
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
                                                {ledgerItem.description || ledgerItem.event_type}
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
                                                {formatCurrency(
                                                    decodeCurrency(
                                                        Math.abs(ledgerItem.amount),
                                                        ledgerItem.currency as CurrencyCode
                                                    ),
                                                    ledgerItem.currency as CurrencyCode
                                                )}
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
