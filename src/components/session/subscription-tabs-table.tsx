import { Separator } from "../ui/separator";
import { SessionTabs } from "./tabs";
import { InvoiceHistory } from "./invoice-history";
import {
  fetchInvoiceHistory,
  fetchUsageHistory,
} from "@/app/session/subscriptions/[id]/action";
import { getServerApiUrl } from "@/lib/server-http";
import { UsageSummary } from "./usage-summary";
import { SubscriptionDetailsData } from "@/app/session/subscriptions/[id]/types";
import { CurrencyCode } from "@/lib/currency-helper";

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
}) {
  const params = await searchParams;
  const tabParam = Array.isArray(params?.tab) ? params.tab[0] : params?.tab;

  const invoiceHistory = await fetchInvoiceHistory(
    subscriptionId,
    invoicePagination.currentPage,
    invoicePagination.pageSize
  );
  const usageHistory = await fetchUsageHistory(
    subscriptionId,
    usagePagination.currentPage,
    usagePagination.pageSize
  );

  const hasUsage =
    Array.isArray(usageHistory?.data) && usageHistory.data.length > 0;

  const isUsageBased = subscription.meters.length > 0;

  const tab = !isUsageBased
    ? "invoice-history"
    : tabParam === "usage-summary" || tabParam === "invoice-history"
    ? tabParam
    : "invoice-history";

  const api_url = await getServerApiUrl();
  const invoiceHistoryData: InvoiceHistoryResponse[] =
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

  const usageHistoryData: UsageHistoryItem[] = hasUsage
    ? usageHistory.data.map((item: UsageHistoryItem) => ({
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
      }))
    : [];

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
          hasNextPage={invoiceHistory.hasNext}
          baseUrl={invoicePagination.baseUrl}
          pageParamKey={invoicePagination.pageParamKey}
        />
      )}
      {isUsageBased && tab === "usage-summary" && (
        <UsageSummary
          usageHistory={usageHistoryData}
          subscriptionId={subscriptionId}
          currentPage={usagePagination.currentPage}
          pageSize={usagePagination.pageSize}
          currentPageItems={usageHistoryData.length}
          hasNextPage={usageHistory.hasNext}
          baseUrl={usagePagination.baseUrl}
          pageParamKey={usagePagination.pageParamKey}
        />
      )}
    </div>
  );
}
