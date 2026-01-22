import PageHeader from "@/components/page-header";
import { fetchProductCollectionByProductId, fetchSubscription } from "./action";
import { notFound } from "next/navigation";
import { SubscriptionDetails } from "@/components/session/subscription-details";
import { SubscriptionBillingInfo } from "@/components/session/subscription-billing-info";
import { SubscriptionTabsTable } from "@/components/session/subscription-tabs-table";
import { CancelSubscriptionSheet } from "@/components/session/cancel-subscription-sheet";
import { SubscriptionDetailsData } from "./types";
import { extractPaginationParams } from "@/lib/pagination-utils";
import { BackButton } from "../../../../components/custom/back-button";
import SubscriptionInfo from "@/components/session/subscriptions/subscription-info";
import { ChangePlanSheet } from "@/components/session/subscriptions/change-plan-sheet";
import { ProductCollectionData } from "./types";

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

  const productCollection = await fetchProductCollectionByProductId(subscription.product.id);

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
      <TopButtons
        subscription={subscription}
        subscriptionId={id}
        productCollection={productCollection}
      />
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
  productCollection,
}: {
  subscription: SubscriptionDetailsData;
  subscriptionId: string;
  productCollection: ProductCollectionData | null;
}) {

  return (
    <PageHeader showSeparator={false}>
      <BackButton fallbackUrl={`/session/subscriptions`} />
      <div className="flex flex-row gap-2">
        {productCollection && (
          <ChangePlanSheet
            currentProductId={subscription.product.id}
            subscriptionId={subscriptionId}
            currentAddons={subscription.addons ?? []}
            currentQuantity={subscription.quantity ?? 1}
            productCollection={productCollection ?? null}
          />
        )}
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
