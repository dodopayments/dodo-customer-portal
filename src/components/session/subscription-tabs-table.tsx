import { Separator } from "../ui/separator";
import { SessionTabs } from "./tabs";
import { InvoiceHistory } from "./invoice-history";
import {
  fetchInvoiceHistory,
  fetchUsageHistory,
} from "@/app/session/subscriptions/[id]/action";
import { fetchRefunds } from "@/app/session/orders/actions";
import { getServerApiUrl } from "@/lib/server-http";
import { UsageSummary } from "./usage-summary";
import { SubscriptionDetailsData } from "@/app/session/subscriptions/[id]/types";
import { CurrencyCode } from "@/lib/currency-helper";
import { RefundResponse } from "./refunds-column";
import { RefundsTable } from "./refunds-table";

export interface InvoiceHistoryResponse {
  payment_id: string;
  subscription_id: string;
  created_at: string;
  total_amount: number;
  currency: string;
  status: string;
  digital_products_delivered: boolean;
  download_url: string;
}

export interface UsageHistoryMeter {
  id: string;
  name: string;
  consumed_units: string;
  chargeable_units: string;
  currency: CurrencyCode;
  free_threshold: number;
  price_per_unit: string;
  total_price: number;
}

export interface UsageHistoryItem {
  start_date: string;
  end_date: string;
  meters: UsageHistoryMeter[];
}

export async function SubscriptionTabsTable({
  subscriptionId,
  subscription,
  searchParams,
  invoicePagination,
  usagePagination,
  refundPagination,
}: {
  subscriptionId: string;
  subscription: SubscriptionDetailsData;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  invoicePagination: {
    currentPage: number;
    pageSize: number;
    baseUrl: string;
    pageParamKey: string;
  };
  usagePagination: {
    currentPage: number;
    pageSize: number;
    baseUrl: string;
    pageParamKey: string;
  };
  refundPagination: {
    currentPage: number;
    pageSize: number;
    baseUrl: string;
    pageParamKey: string;
  };
}) {
  const params = await searchParams;
  const tabParam = Array.isArray(params?.tab) ? params.tab[0] : params?.tab;
  const normalizedTabParam = typeof tabParam === "string" ? tabParam : "";
  const isUsageBased = subscription.meters.length > 0;

  const PAGINATION_SAFETY_LIMIT = 20;

  const subscriptionPaymentIds = new Set<string>();
  let invoicePage = 0;
  let hasNextInvoicePage = true;
  while (hasNextInvoicePage && invoicePage < PAGINATION_SAFETY_LIMIT) {
    const invoicePageData = await fetchInvoiceHistory(subscriptionId, invoicePage, 100);
    for (const payment of invoicePageData.data as InvoiceHistoryResponse[]) {
      subscriptionPaymentIds.add(payment.payment_id);
    }
    hasNextInvoicePage = invoicePageData.hasNext;
    invoicePage += 1;
  }

  let allRefunds: RefundResponse[] = [];
  if (subscriptionPaymentIds.size > 0) {
    let page = 0;
    let hasNext = true;
    while (hasNext && page < PAGINATION_SAFETY_LIMIT) {
      const refundsPage = await fetchRefunds(page, 100, subscriptionId);
      allRefunds = allRefunds.concat(refundsPage.data as RefundResponse[]);
      hasNext = refundsPage.hasNext;
      page += 1;
    }
  }
  const allSubscriptionRefunds = allRefunds.filter((refund) =>
    subscriptionPaymentIds.has(refund.payment_id)
  );
  const hasRefunds = allSubscriptionRefunds.length > 0;

  const isValidTab =
    normalizedTabParam === "invoice-history" ||
    (hasRefunds && normalizedTabParam === "refund-history") ||
    (isUsageBased && normalizedTabParam === "usage-summary");
  const tab = isValidTab ? normalizedTabParam : "invoice-history";

  const api_url = await getServerApiUrl();
  let invoiceHistoryData: InvoiceHistoryResponse[] = [];
  let invoiceHasNextPage = false;
  if (tab === "invoice-history") {
    const invoiceHistory = await fetchInvoiceHistory(
      subscriptionId,
      invoicePagination.currentPage,
      invoicePagination.pageSize
    );
    invoiceHistoryData =
      invoiceHistory?.data?.map((item: InvoiceHistoryResponse) => ({
        payment_id: item.payment_id,
        subscription_id: subscriptionId,
        date: item.created_at,
        amount: item.total_amount,
        currency: item.currency,
        status: item.status,
        digital_products_delivered: item.digital_products_delivered,
        download_url: `${api_url}/invoices/payments/${item.payment_id}`,
      })) || [];
    invoiceHasNextPage = invoiceHistory.hasNext;
  }

  let usageHistoryData: UsageHistoryItem[] = [];
  let usageHasNextPage = false;
  if (tab === "usage-summary" && isUsageBased) {
    const usageHistory = await fetchUsageHistory(
      subscriptionId,
      usagePagination.currentPage,
      usagePagination.pageSize
    );
    usageHistoryData =
      usageHistory?.data?.map((item: UsageHistoryItem) => ({
        start_date: item.start_date,
        end_date: item.end_date,
        meters: item.meters.map((meter: UsageHistoryMeter) => ({
          chargeable_units: meter.chargeable_units,
          consumed_units: meter.consumed_units,
          currency: meter.currency as CurrencyCode,
          free_threshold: meter.free_threshold,
          id: meter.id,
          name: meter.name,
          price_per_unit: meter.price_per_unit,
          total_price: meter.total_price,
        })),
      })) || [];
    usageHasNextPage = usageHistory.hasNext;
  }

  let subscriptionRefundsData: RefundResponse[] = [];
  const allSubscriptionRefundsCount = allSubscriptionRefunds.length;
  let hasNextRefundPage = false;
  if (tab === "refund-history") {
    const refundStartIndex =
      refundPagination.currentPage * refundPagination.pageSize;
    subscriptionRefundsData = allSubscriptionRefunds.slice(
      refundStartIndex,
      refundStartIndex + refundPagination.pageSize
    );
    hasNextRefundPage =
      refundStartIndex + subscriptionRefundsData.length <
      allSubscriptionRefundsCount;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <SessionTabs
          className="w-full"
          items={[
            {
              value: "invoice-history",
              label: "Billing History",
              link: `/session/subscriptions/${subscriptionId}?tab=invoice-history`,
            },
            ...(hasRefunds ? [
              {
                value: "refund-history",
                label: "Refund History",
                link: `/session/subscriptions/${subscriptionId}?tab=refund-history`,
              },
            ] : []),
            ...(isUsageBased ? [
              {
                value: "usage-summary",
                label: "Usage Summary",
                link: `/session/subscriptions/${subscriptionId}?tab=usage-summary`,
              },
            ] : []),
          ]}
          currentTab={tab}
        />
        <Separator className="my-0" />
      </div>

      {tab === "invoice-history" && (
        <InvoiceHistory
          invoiceHistory={invoiceHistoryData}
          currentPage={invoicePagination.currentPage}
          pageSize={invoicePagination.pageSize}
          currentPageItems={invoiceHistoryData.length}
          hasNextPage={invoiceHasNextPage}
          baseUrl={invoicePagination.baseUrl}
          pageParamKey={invoicePagination.pageParamKey}
        />
      )}
      {tab === "refund-history" && (
        <RefundsTable
          refundsData={subscriptionRefundsData}
          tableId="refund-history-subscription"
          showTitle={false}
          currentPage={refundPagination.currentPage}
          pageSize={refundPagination.pageSize}
          currentPageItems={subscriptionRefundsData.length}
          hasNextPage={hasNextRefundPage}
          totalCount={allSubscriptionRefundsCount}
          baseUrl={refundPagination.baseUrl}
          pageParamKey={refundPagination.pageParamKey}
          showPagination={true}
        />
      )}
      {isUsageBased && tab === "usage-summary" && (
        <UsageSummary
          usageHistory={usageHistoryData}
          subscriptionId={subscriptionId}
          currentPage={usagePagination.currentPage}
          pageSize={usagePagination.pageSize}
          currentPageItems={usageHistoryData.length}
          hasNextPage={usageHasNextPage}
          baseUrl={usagePagination.baseUrl}
          pageParamKey={usagePagination.pageParamKey}
        />
      )}
    </div>
  );
}
