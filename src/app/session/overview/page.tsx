import { fetchSubscriptions } from "../subscriptions/actions";
import { fetchPaymentMethods } from "../payment-methods/action";
import { fetchPayments } from "../orders/actions";
import { fetchUser, fetchWallets, fetchWalletLedger } from "../profile/actions";
import { OverviewContent } from "@/components/session/overview/overview-content";
import { SubscriptionData } from "@/components/session/subscriptions/subscriptions";
import { OrderData } from "@/components/session/orders/orders";
import { PaymentMethodItem } from "../payment-methods/type";
import { WalletItem, WalletLedgerItem } from "../profile/types";

export const dynamic = "force-dynamic";

const WALLET_TRANSACTIONS_SIZE = 10;
const OVERVIEW_SUBSCRIPTIONS_SIZE = 3;
const DEFAULT_BILLING_PAGE_SIZE = 10;
const BILLING_PAGE_PARAM = "billingPage";
const BILLING_SIZE_PARAM = "billingPageSize";

interface OverviewPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OverviewPage({ searchParams }: OverviewPageProps) {
    const params = await searchParams;

    const parsedBillingPage = parseInt(params[BILLING_PAGE_PARAM] as string || "0", 10);
    const parsedBillingPageSize = parseInt(params[BILLING_SIZE_PARAM] as string || DEFAULT_BILLING_PAGE_SIZE.toString(), 10);
    const billingPage = isNaN(parsedBillingPage) || parsedBillingPage < 0 ? 0 : parsedBillingPage;
    const billingPageSize = isNaN(parsedBillingPageSize) || parsedBillingPageSize < 1 ? DEFAULT_BILLING_PAGE_SIZE : parsedBillingPageSize;

    let subscriptionsData, paymentMethods, billingHistoryData, user, wallets;

    try {
        [
            subscriptionsData,
            paymentMethods,
            billingHistoryData,
            user,
            wallets
        ] = await Promise.all([
            fetchSubscriptions(0, OVERVIEW_SUBSCRIPTIONS_SIZE),
            fetchPaymentMethods(),
            fetchPayments(billingPage, billingPageSize),
            fetchUser(),
            fetchWallets(),
        ]);
    } catch (error) {
        console.error("Failed to fetch overview data:", error);
        // Provide safe defaults if fetch fails
        subscriptionsData = { data: [], totalCount: 0, hasNext: false };
        paymentMethods = null;
        billingHistoryData = { data: [], totalCount: 0, hasNext: false };
        user = null;
        wallets = { items: [] };
    }

    // Ensure paymentMethods is always an array
    const safePaymentMethods = (paymentMethods || []) as PaymentMethodItem[];

    const walletItems = (wallets?.items || []) as WalletItem[];
    let walletLedger: WalletLedgerItem[] = [];

    if (walletItems.length > 0) {
        try {
            const firstCurrency = walletItems[0].currency;
            const ledgerData = await fetchWalletLedger({
                currency: firstCurrency,
                pageNumber: 0,
                pageSize: WALLET_TRANSACTIONS_SIZE,
            });
            walletLedger = ledgerData.data as WalletLedgerItem[];
        } catch (error) {
            console.error("Failed to fetch wallet ledger:", error);
            walletLedger = [];
        }
    }

    return (
        <OverviewContent
            subscriptions={subscriptionsData.data as SubscriptionData[]}
            subscriptionsTotalCount={subscriptionsData.totalCount}
            paymentMethods={safePaymentMethods}
            billingHistory={billingHistoryData.data as OrderData[]}
            billingHistoryPagination={{
                currentPage: billingPage,
                pageSize: billingPageSize,
                hasNextPage: billingHistoryData.hasNext,
                totalCount: billingHistoryData.totalCount,
            }}
            user={user}
            wallets={walletItems}
            walletLedger={walletLedger}
        />
    );
}
