"use client";

import { SubscriptionData, Subscriptions } from "../subscriptions/subscriptions";
import { OrderData, Orders } from "../orders/orders";
import { PaymentMethodItem } from "@/app/session/payment-methods/type";
import { WalletItem, WalletLedgerItem, CreditEntitlementItem, CreditLedgerItem } from "@/app/session/profile/types";
import { PaymentMethodsSection } from "./payment-methods-section";
import { WalletsSection } from "./wallets-section";
import { CreditsSection } from "./credits-section";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { RefundResponse } from "../refunds-column";
import { RefundsTable } from "../refunds-table";
import { SessionPageLayout } from "../session-page-layout";

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
    wallets,
    walletLedgerByCurrency,
    creditEntitlements,
    creditLedgerByEntitlement,
    paginationBasePath = DEFAULT_PAGINATION_BASE_PATH,
}: OverviewContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pushPage = useCallback((paramKey: string, newPage: number) => {
        const currentBaseQuery = refundHistoryPagination.baseUrl || "?";
        const params = new URLSearchParams(
            currentBaseQuery.startsWith("?") ? currentBaseQuery.slice(1) : currentBaseQuery
        );
        params.set(paramKey, newPage.toString());
        router.push(`${paginationBasePath}?${params.toString()}`);
    }, [paginationBasePath, refundHistoryPagination.baseUrl, router]);

    const handleBillingPageChange = useCallback((newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(BILLING_PAGE_PARAM, newPage.toString());
        router.push(`${paginationBasePath}?${params.toString()}`);
    }, [router, searchParams, paginationBasePath]);

    const handleRefundPageChange = useCallback((newPage: number) => {
        pushPage(REFUND_PAGE_PARAM, newPage);
    }, [pushPage]);

    return (
        <SessionPageLayout>
            <div className="space-y-8">
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
        </SessionPageLayout>
    );
}
