import { cache } from "react";
import { fetchSubscriptions } from "../subscriptions/actions";
import { fetchPaymentMethods } from "../payment-methods/action";
import { fetchPayments } from "../orders/actions";
import { fetchUser, fetchWallets, fetchWalletLedger } from "../profile/actions";
import { OverviewContent } from "@/components/session/overview/overview-content";
import { SubscriptionData } from "@/components/session/subscriptions/subscriptions";
import { OrderData } from "@/components/session/orders/orders";
import { PaymentMethodItem } from "../payment-methods/type";
import { WalletItem, WalletLedgerItem } from "../profile/types";

const getCachedSubscriptions = cache(fetchSubscriptions);
const getCachedPaymentMethods = cache(fetchPaymentMethods);
const getCachedPayments = cache(fetchPayments);
const getCachedUser = cache(fetchUser);
const getCachedWallets = cache(fetchWallets);

export const dynamic = "force-dynamic";

const WALLET_TRANSACTIONS_SIZE = 10;
const OVERVIEW_SUBSCRIPTIONS_SIZE = 100;
const BILLING_PAGE_PARAM = "billingPage";
const OVERVIEW_BILLING_PAGE_SIZE = 25;

interface OverviewPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OverviewPage({ searchParams }: OverviewPageProps) {
    const params = await searchParams;

    const parsedBillingPage = parseInt(params[BILLING_PAGE_PARAM] as string || "0", 10);
    const billingPage = isNaN(parsedBillingPage) || parsedBillingPage < 0 ? 0 : parsedBillingPage;

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

    let subscriptionsData, paymentMethods, billingHistoryData, user, walletsResult;

    try {
        [
            subscriptionsData,
            paymentMethods,
            billingHistoryData,
            user,
            walletsResult
        ] = await Promise.all([
            getCachedSubscriptions(0, OVERVIEW_SUBSCRIPTIONS_SIZE),
            getCachedPaymentMethods(),
            getCachedPayments(billingPage, OVERVIEW_BILLING_PAGE_SIZE),
            getCachedUser(),
            fetchWalletsWithLedger(),
        ]);
    } catch (error) {
        console.error("Failed to fetch overview data:", error);
        subscriptionsData = { data: [], totalCount: 0, hasNext: false };
        paymentMethods = null;
        billingHistoryData = { data: [], totalCount: 0, hasNext: false };
        user = null;
        walletsResult = { walletItems: [] as WalletItem[], walletLedgerByCurrency: {} as Record<string, WalletLedgerItem[]> };
    }

    const safePaymentMethods = (paymentMethods || []) as PaymentMethodItem[];
    const walletItems = walletsResult.walletItems;
    const walletLedgerByCurrency = walletsResult.walletLedgerByCurrency;

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
            user={user ? { name: user.name, email: user.email } : null}
            wallets={walletItems}
            walletLedgerByCurrency={walletLedgerByCurrency}
        />
    );
}
