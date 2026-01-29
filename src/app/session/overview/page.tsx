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
const DEFAULT_BILLING_PAGE_SIZE = 10;
const BILLING_PAGE_PARAM = "billingPage";
const BILLING_SIZE_PARAM = "billingPageSize";

interface OverviewPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OverviewPage({ searchParams }: OverviewPageProps) {
    const params = await searchParams;

    const billingPage = parseInt(params[BILLING_PAGE_PARAM] as string || "0", 10);
    const billingPageSize = parseInt(params[BILLING_SIZE_PARAM] as string || DEFAULT_BILLING_PAGE_SIZE.toString(), 10);

    const [
        subscriptionsData,
        paymentMethods,
        billingHistoryData,
        user,
        wallets
    ] = await Promise.all([
        fetchSubscriptions(0, 5),
        fetchPaymentMethods(),
        fetchPayments(billingPage, billingPageSize),
        fetchUser(),
        fetchWallets(),
    ]);

    const walletItems = (wallets?.items || []) as WalletItem[];
    let walletLedger: WalletLedgerItem[] = [];

    if (walletItems.length > 0) {
        const firstCurrency = walletItems[0].currency;
        const ledgerData = await fetchWalletLedger({
            currency: firstCurrency,
            pageNumber: 0,
            pageSize: WALLET_TRANSACTIONS_SIZE,
        });
        walletLedger = ledgerData.data as WalletLedgerItem[];
    }

    return (
        <OverviewContent
            subscriptions={subscriptionsData.data as SubscriptionData[]}
            paymentMethods={(paymentMethods || []) as PaymentMethodItem[]}
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
