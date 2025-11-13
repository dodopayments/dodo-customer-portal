import PageHeader from "@/components/page-header";
import { fetchSubscription } from "./action";
import { notFound } from "next/navigation";
import { SubscriptionDetails } from "@/components/session/subscription-details";
import { SubscriptionBillingInfo } from "@/components/session/subscription-billing-info";
import { SubscriptionTabsTable } from "@/components/session/subscription-tabs-table";
import { CancelSubscriptionSheet } from "@/components/session/cancel-subscription-sheet";
import { SubscriptionDetailsData } from "./types";
import { extractPaginationParams } from "@/lib/pagination-utils";
import { BackButton } from "../../../../components/custom/back-button";
import SubscriptionInfo from "@/components/session/subscriptions/subscription-info";

const DEFAULT_PAGE_SIZE = 50;
const INVOICE_PAGE_PARAM_KEY = "invoice_page";
const USAGE_PAGE_PARAM_KEY = "usage_page";

export interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SubscriptionPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const subscription = await fetchSubscription(id);
  if (!subscription) {
    return notFound();
  }

  const invoiceParams = await extractPaginationParams(
    searchParams,
    DEFAULT_PAGE_SIZE,
    INVOICE_PAGE_PARAM_KEY
  );

  const usageParams = await extractPaginationParams(
    searchParams,
    DEFAULT_PAGE_SIZE,
    USAGE_PAGE_PARAM_KEY
  );

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full gap-8">
      <TopButtons subscription={subscription} subscriptionId={id} />
      <SubscriptionInfo subscription={subscription} />
      <SubscriptionDetails subscription={subscription} />
      <SubscriptionBillingInfo subscription={subscription} />
      <SubscriptionTabsTable
        subscriptionId={id}
        subscription={subscription}
        searchParams={searchParams}
        invoicePagination={{
          currentPage: invoiceParams.currentPage,
          pageSize: invoiceParams.pageSize,
          baseUrl: invoiceParams.baseUrl,
          pageParamKey: INVOICE_PAGE_PARAM_KEY,
        }}
        usagePagination={{
          currentPage: usageParams.currentPage,
          pageSize: usageParams.pageSize,
          baseUrl: usageParams.baseUrl,
          pageParamKey: USAGE_PAGE_PARAM_KEY,
        }}
      />
    </div>
  );
}

function TopButtons({
  subscription,
  subscriptionId,
}: {
  subscription: SubscriptionDetailsData;
  subscriptionId: string;
}) {
  return (
    <PageHeader showSeparator={false}>
      <BackButton fallbackUrl={`/session/subscriptions`} />
      <div className="flex flex-row gap-2">
        {/* <Button variant="secondary">Change Plan</Button> */}
        {subscription.status != "cancelled" && (
          <CancelSubscriptionSheet
            subscription={subscription}
            subscriptionId={subscriptionId}
          />
        )}
      </div>
    </PageHeader>
  );
}
