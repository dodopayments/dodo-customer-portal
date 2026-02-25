"use client";

import { SubscriptionData, Subscriptions } from "../subscriptions/subscriptions";
import { OrderData, Orders } from "../orders/orders";
import { PaymentMethodItem } from "@/app/session/payment-methods/type";
import { WalletItem, WalletLedgerItem, CreditEntitlementItem, CreditLedgerItem } from "@/app/session/profile/types";
import { LeftPanel } from "./left-panel";
import { PaymentMethodsSection } from "./payment-methods-section";
import { WalletsSection } from "./wallets-section";
import { SessionHeader } from "../session-header";
import { CreditsSection } from "./credits-section";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { RefundResponse } from "../refunds-column";
import { RefundsTable } from "../refunds-table";

interface BillingHistoryPagination {
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    totalCount: number;
}

interface RefundHistoryPagination {
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    totalCount: number;
    baseUrl: string;
    pageParamKey: string;
}

interface OverviewContentProps {
    subscriptions: SubscriptionData[];
    subscriptionsTotalCount?: number;
    paymentMethods: PaymentMethodItem[];
    billingHistory: OrderData[];
    billingHistoryPagination: BillingHistoryPagination;
    refundHistory: RefundResponse[];
    refundHistoryPagination: RefundHistoryPagination;
    user: { name: string; email: string } | null;
    wallets: WalletItem[];
    walletLedgerByCurrency: Record<string, WalletLedgerItem[]>;
    creditEntitlements: CreditEntitlementItem[];
    creditLedgerByEntitlement: Record<string, CreditLedgerItem[]>;
    /** Base path for billing history pagination (default: /session/overview) */
    paginationBasePath?: string;
}

const BILLING_PAGE_PARAM = "billingPage";
const REFUND_PAGE_PARAM = "refundPage";
const OVERVIEW_PAGE_SIZE = 25;

const DEFAULT_PAGINATION_BASE_PATH = "/session/overview";

export function OverviewContent({
    subscriptions,
    subscriptionsTotalCount,
    paymentMethods,
    billingHistory,
    billingHistoryPagination,
    refundHistory,
    refundHistoryPagination,
    user,
    wallets,
    walletLedgerByCurrency,
    creditEntitlements,
    creditLedgerByEntitlement,
    paginationBasePath = DEFAULT_PAGINATION_BASE_PATH,
}: OverviewContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const handleBillingPageChange = useCallback((newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(BILLING_PAGE_PARAM, newPage.toString());
        router.push(`${paginationBasePath}?${params.toString()}`);
    }, [router, searchParams, paginationBasePath]);

    const handleRefundPageChange = useCallback((newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(REFUND_PAGE_PARAM, newPage.toString());
        router.push(`/session/overview?${params.toString()}`);
    }, [router, searchParams]);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full bg-bg-primary">
            <LeftPanel />

            <div className="flex-1 flex flex-col overflow-hidden">
                <SessionHeader user={user} showUserMenu={true} showBusinessSwitcher={true} />

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
                        {paymentMethods.length > 0 && (
                            <PaymentMethodsSection paymentMethods={paymentMethods} />
                        )}

                        {wallets.length > 0 && (
                            <WalletsSection
                                wallets={wallets}
                                walletLedgerByCurrency={walletLedgerByCurrency}
                            />
                        )}
                        {creditEntitlements.length > 0 && (
                            <CreditsSection
                                entitlements={creditEntitlements}
                                creditLedgerByEntitlement={creditLedgerByEntitlement}
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
                            onPageSizeChange={() => { }}
                            showPagination={true}
                        />
                        {(refundHistoryPagination.totalCount > 0 || refundHistory.length > 0) && (
                            <RefundsTable
                                refundsData={refundHistory}
                                tableId="refund-history-overview"
                                currentPage={refundHistoryPagination.currentPage}
                                pageSize={refundHistoryPagination.pageSize}
                                currentPageItems={refundHistory.length}
                                hasNextPage={refundHistoryPagination.hasNextPage}
                                totalCount={refundHistoryPagination.totalCount}
                                baseUrl={refundHistoryPagination.baseUrl}
                                pageParamKey={refundHistoryPagination.pageParamKey}
                                showPagination={true}
                                paginationMode="grid"
                                onPageChange={handleRefundPageChange}
                                onPageSizeChange={() => { }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
