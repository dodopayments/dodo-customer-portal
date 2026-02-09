"use client";

import { SubscriptionData, Subscriptions } from "../subscriptions/subscriptions";
import { OrderData, Orders } from "../orders/orders";
import { PaymentMethodItem } from "@/app/session/payment-methods/type";
import { WalletItem, WalletLedgerItem } from "@/app/session/profile/types";
import { LeftPanel } from "./left-panel";
import { PaymentMethodsSection } from "./payment-methods-section";
import { WalletsSection } from "./wallets-section";
import { UserNav } from "./user-nav";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface BillingHistoryPagination {
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    totalCount: number;
}

interface OverviewContentProps {
    subscriptions: SubscriptionData[];
    subscriptionsTotalCount?: number;
    paymentMethods: PaymentMethodItem[];
    billingHistory: OrderData[];
    billingHistoryPagination: BillingHistoryPagination;
    user: { name: string; email: string } | null;
    wallets: WalletItem[];
    walletLedgerByCurrency: Record<string, WalletLedgerItem[]>;
}

const BILLING_PAGE_PARAM = "billingPage";
const OVERVIEW_PAGE_SIZE = 25;

export function OverviewContent({
    subscriptions,
    subscriptionsTotalCount,
    paymentMethods,
    billingHistory,
    billingHistoryPagination,
    user,
    wallets,
    walletLedgerByCurrency,
}: OverviewContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const handleBillingPageChange = useCallback((newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(BILLING_PAGE_PARAM, newPage.toString());
        router.push(`/session/overview?${params.toString()}`);
    }, [router, searchParams]);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-bg-primary">
            <LeftPanel />

            <div className="flex-1 flex flex-col overflow-hidden">
                <UserNav user={user} />

                <div className="flex-1 px-4 md:px-8 lg:px-12 py-6 md:py-8 overflow-y-auto">
                    <div className="max-w-5xl space-y-8">
                        {subscriptions.length > 0 && (
                            <Subscriptions
                                subscriptionData={subscriptions}
                                variant="overview"
                                paymentMethods={paymentMethods}
                                totalCount={subscriptionsTotalCount}
                            />
                        )}

                        <Orders
                            ordersData={billingHistory}
                            variant="overview"
                            currentPage={billingHistoryPagination.currentPage}
                            pageSize={OVERVIEW_PAGE_SIZE}
                            hasNextPage={billingHistoryPagination.hasNextPage}
                            totalCount={billingHistoryPagination.totalCount}
                            onPageChange={handleBillingPageChange}
                            onPageSizeChange={() => {}}
                            showPagination={true}
                        />

                        {paymentMethods.length > 0 && (
                            <PaymentMethodsSection paymentMethods={paymentMethods} />
                        )}

                        {wallets.length > 0 && (
                            <WalletsSection
                                wallets={wallets}
                                walletLedgerByCurrency={walletLedgerByCurrency}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
