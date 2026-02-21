import { fetchProductCollectionByProductId, fetchSubscription } from "./action";
import { notFound } from "next/navigation";
import { SubscriptionDetails } from "@/components/session/subscription-details";
import { SubscriptionBillingInfo } from "@/components/session/subscription-billing-info";
import { SubscriptionTabsTable } from "@/components/session/subscription-tabs-table";
import { CancelSubscriptionSheet } from "@/components/session/cancel-subscription-sheet";
import { SubscriptionDetailsData } from "./types";
import { extractPaginationParams } from "@/lib/pagination-utils";
import SubscriptionInfo from "@/components/session/subscriptions/subscription-info";
import { ChangePlanSheet } from "@/components/session/subscriptions/change-plan-sheet";
import { ProductCollectionData } from "./types";
import { SessionPageLayout } from "@/components/session/session-page-layout";
import { fetchBusiness } from "@/lib/server-actions";

const DEFAULT_PAGE_SIZE = 50;
const INVOICE_PAGE_PARAM_KEY = "invoice_page";
const USAGE_PAGE_PARAM_KEY = "usage_page";
const REFUND_PAGE_PARAM_KEY = "refund_page";

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
  const business = await fetchBusiness();
  const canChangePlan = business?.allow_customer_portal_sub_change_plan ?? false;

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

  const refundParams = await extractPaginationParams(
    searchParams,
    DEFAULT_PAGE_SIZE,
    REFUND_PAGE_PARAM_KEY
  );

// Header actions for the page
  const headerActions = (
    <HeaderActions
      subscription={subscription}
      subscriptionId={id}
      productCollection={productCollection}
      canChangePlan={canChangePlan}
    />
  );

  return (
    <SessionPageLayout
      backHref="/session/subscriptions"
      headerActions={headerActions}
    >
      <div className="flex flex-col gap-8">
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
          refundPagination={{
            currentPage: refundParams.currentPage,
            pageSize: refundParams.pageSize,
            baseUrl: refundParams.baseUrl,
            pageParamKey: REFUND_PAGE_PARAM_KEY,
          }}
        />
      </div>
    </SessionPageLayout>
  );
}

function HeaderActions({
  subscription,
  subscriptionId,
  productCollection,
  canChangePlan,
}: {
  subscription: SubscriptionDetailsData;
  subscriptionId: string;
  productCollection: ProductCollectionData | null;
  canChangePlan: boolean;
}) {
  return (
    <>
      {productCollection && canChangePlan && (
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
    </>
  );
}
