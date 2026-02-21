import { cache } from "react";
import { fetchSubscriptions } from "../subscriptions/actions";
import { fetchPaymentMethods } from "../payment-methods/action";
import { fetchPayments, fetchRefunds } from "../orders/actions";
import { fetchUser, fetchWallets, fetchWalletLedger, fetchCreditEntitlements, fetchCreditEntitlementLedger } from "../profile/actions";
import { OverviewContent } from "@/components/session/overview/overview-content";
import { SubscriptionData } from "@/components/session/subscriptions/subscriptions";
import { OrderData } from "@/components/session/orders/orders";
import { PaymentMethodItem } from "../payment-methods/type";
import { WalletItem, WalletLedgerItem, CreditEntitlementItem, CreditLedgerItem } from "../profile/types";
import { RefundResponse } from "@/components/session/refunds-column";
import { buildPaginationBaseUrl } from "@/lib/pagination-utils";

const getCachedSubscriptions = cache(fetchSubscriptions);
const getCachedPaymentMethods = cache(fetchPaymentMethods);
const getCachedPayments = cache(fetchPayments);
const getCachedRefunds = cache(fetchRefunds);
const getCachedUser = cache(fetchUser);
const getCachedWallets = cache(fetchWallets);
const getCachedCreditEntitlements = cache(fetchCreditEntitlements);

export const dynamic = "force-dynamic";

const WALLET_TRANSACTIONS_SIZE = 10;
const CREDIT_TRANSACTIONS_SIZE = 10;
const OVERVIEW_SUBSCRIPTIONS_SIZE = 100;
const BILLING_PAGE_PARAM = "billingPage";
const OVERVIEW_BILLING_PAGE_SIZE = 25;
const REFUND_PAGE_PARAM = "refundPage";
const OVERVIEW_REFUND_PAGE_SIZE = 25;

interface OverviewPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OverviewPage({ searchParams }: OverviewPageProps) {
    const params = await searchParams;

    const parsedBillingPage = parseInt(params[BILLING_PAGE_PARAM] as string || "0", 10);
    const billingPage = isNaN(parsedBillingPage) || parsedBillingPage < 0 ? 0 : parsedBillingPage;
    const parsedRefundPage = parseInt(params[REFUND_PAGE_PARAM] as string || "0", 10);
    const refundPage = isNaN(parsedRefundPage) || parsedRefundPage < 0 ? 0 : parsedRefundPage;

    async function fetchWalletsWithLedger() {
        const walletsData = await getCachedWallets();
        const items = (walletsData?.items || []) as WalletItem[];
        const ledger: Record<string, WalletLedgerItem[]> = {};

        if (items.length > 0) {
            await Promise.all(
                items.map(async (wallet) => {
                    try {
                        const ledgerData = await fetchWalletLedger({
                            currency: wallet.currency,
                            pageNumber: 0,
                            pageSize: WALLET_TRANSACTIONS_SIZE,
                        });
                        ledger[wallet.currency] =
                            ledgerData.data as WalletLedgerItem[];
                    } catch (error) {
                        console.error(
                            `Failed to fetch wallet ledger for ${wallet.currency}:`,
                            error
                        );
                        ledger[wallet.currency] = [];
                    }
                })
            );
        }

        return { walletItems: items, walletLedgerByCurrency: ledger };
    }

    async function fetchCreditsWithLedger() {
        const creditsData = await getCachedCreditEntitlements();
        const items = (creditsData?.items || []) as CreditEntitlementItem[];
        const ledger: Record<string, CreditLedgerItem[]> = {};

        if (items.length > 0) {
            await Promise.all(
                items.map(async (entitlement) => {
                    try {
                        const ledgerData = await fetchCreditEntitlementLedger({
                            creditEntitlementId: entitlement.credit_entitlement_id,
                            pageNumber: 0,
                            pageSize: CREDIT_TRANSACTIONS_SIZE,
                        });
                        ledger[entitlement.credit_entitlement_id] =
                            ledgerData.data as CreditLedgerItem[];
                    } catch (error) {
                        console.error(
                            `Failed to fetch credit ledger for ${entitlement.name}:`,
                            error
                        );
                        ledger[entitlement.credit_entitlement_id] = [];
                    }
                })
            );
        }

        return { creditEntitlements: items, creditLedgerByEntitlement: ledger };
    }

    let subscriptionsData, paymentMethods, billingHistoryData, refundHistoryData, user, walletsResult, creditsResult;

    try {
        [
            subscriptionsData,
            paymentMethods,
            billingHistoryData,
            refundHistoryData,
            user,
            walletsResult,
            creditsResult
        ] = await Promise.all([
            getCachedSubscriptions(0, OVERVIEW_SUBSCRIPTIONS_SIZE),
            getCachedPaymentMethods(),
            getCachedPayments(billingPage, OVERVIEW_BILLING_PAGE_SIZE),
            getCachedRefunds(refundPage, OVERVIEW_REFUND_PAGE_SIZE),
            getCachedUser(),
            fetchWalletsWithLedger(),
            fetchCreditsWithLedger(),
        ]);
    } catch (error) {
        console.error("Failed to fetch overview data:", error);
        subscriptionsData = { data: [], totalCount: 0, hasNext: false };
        paymentMethods = null;
        billingHistoryData = { data: [], totalCount: 0, hasNext: false };
        refundHistoryData = { data: [], totalCount: 0, hasNext: false };
        user = null;
        walletsResult = { walletItems: [] as WalletItem[], walletLedgerByCurrency: {} as Record<string, WalletLedgerItem[]> };
        creditsResult = { creditEntitlements: [] as CreditEntitlementItem[], creditLedgerByEntitlement: {} as Record<string, CreditLedgerItem[]> };
    }

    const safePaymentMethods = (paymentMethods || []) as PaymentMethodItem[];
    const walletItems = walletsResult.walletItems;
    const walletLedgerByCurrency = walletsResult.walletLedgerByCurrency;
    const creditEntitlements = creditsResult.creditEntitlements;
    const creditLedgerByEntitlement = creditsResult.creditLedgerByEntitlement;

    return (
        <OverviewContent
            subscriptions={subscriptionsData.data as SubscriptionData[]}
            subscriptionsTotalCount={subscriptionsData.totalCount}
            paymentMethods={safePaymentMethods}
            billingHistory={billingHistoryData.data as OrderData[]}
            billingHistoryPagination={{
                currentPage: billingPage,
                pageSize: OVERVIEW_BILLING_PAGE_SIZE,
                hasNextPage: billingHistoryData.hasNext,
                totalCount: billingHistoryData.totalCount,
            }}
            refundHistory={refundHistoryData.data as RefundResponse[]}
            refundHistoryPagination={{
                currentPage: refundPage,
                pageSize: OVERVIEW_REFUND_PAGE_SIZE,
                hasNextPage: refundHistoryData.hasNext,
                totalCount: refundHistoryData.totalCount,
                baseUrl: buildPaginationBaseUrl(params, REFUND_PAGE_PARAM),
                pageParamKey: REFUND_PAGE_PARAM,
            }}
            user={user ? { name: user.name, email: user.email } : null}
            wallets={walletItems}
            walletLedgerByCurrency={walletLedgerByCurrency}
            creditEntitlements={creditEntitlements}
            creditLedgerByEntitlement={creditLedgerByEntitlement}
        />
    );
}
