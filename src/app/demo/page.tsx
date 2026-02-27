import { OverviewContent } from "@/components/session/overview/overview-content";
import {
  DEMO_USER,
  DEMO_SUBSCRIPTIONS,
  DEMO_PAYMENT_METHODS,
  DEMO_BILLING_HISTORY,
  DEMO_WALLETS,
  DEMO_WALLET_LEDGER,
  DEMO_CREDIT_ENTITLEMENTS,
  DEMO_CREDIT_LEDGER,
  DEMO_BILLING_PAGE_SIZE,
} from "./dummy-data";
import { buildPaginationBaseUrl } from "@/lib/pagination-utils";

const BILLING_PAGE_PARAM = "billingPage";
const REFUND_PAGE_PARAM = "refundPage";
const DEMO_REFUND_PAGE_SIZE = 25;

interface DemoPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DemoPage({ searchParams }: DemoPageProps) {
  const params = await searchParams;
  const parsedBillingPage = parseInt(
    (params[BILLING_PAGE_PARAM] as string) || "0",
    10
  );
  const billingPage =
    isNaN(parsedBillingPage) || parsedBillingPage < 0 ? 0 : parsedBillingPage;

  const totalCount = DEMO_BILLING_HISTORY.length;
  const start = billingPage * DEMO_BILLING_PAGE_SIZE;
  const billingHistory = DEMO_BILLING_HISTORY.slice(
    start,
    start + DEMO_BILLING_PAGE_SIZE
  );
  const hasNextPage = start + DEMO_BILLING_PAGE_SIZE < totalCount;

  const refundBaseUrl = buildPaginationBaseUrl(params, REFUND_PAGE_PARAM);

  return (
    <OverviewContent
      subscriptions={DEMO_SUBSCRIPTIONS}
      subscriptionsTotalCount={DEMO_SUBSCRIPTIONS.length}
      paymentMethods={DEMO_PAYMENT_METHODS}
      billingHistory={billingHistory}
      billingHistoryPagination={{
        currentPage: billingPage,
        pageSize: DEMO_BILLING_PAGE_SIZE,
        hasNextPage,
        totalCount,
      }}
      refundHistory={[]}
      refundHistoryPagination={{
        currentPage: 0,
        pageSize: DEMO_REFUND_PAGE_SIZE,
        hasNextPage: false,
        totalCount: 0,
        baseUrl: refundBaseUrl,
        pageParamKey: REFUND_PAGE_PARAM,
      }}
      user={DEMO_USER}
      wallets={DEMO_WALLETS}
      walletLedgerByCurrency={DEMO_WALLET_LEDGER}
      creditEntitlements={DEMO_CREDIT_ENTITLEMENTS}
      creditLedgerByEntitlement={DEMO_CREDIT_LEDGER}
      paginationBasePath="/demo"
    />
  );
}
