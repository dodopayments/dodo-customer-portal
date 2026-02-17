import { fetchSubscriptions } from "./actions";
import { Subscriptions } from "@/components/session/subscriptions/subscriptions";
import { extractPaginationParams } from "@/lib/pagination-utils";
import { SessionPageLayout } from "@/components/session/session-page-layout";

interface SubscriptionsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const DEFAULT_PAGE_SIZE = 50;
const PAGE_PARAM_KEY = "subscription_page";

export default async function SubscriptionsPage({
  searchParams,
}: SubscriptionsPageProps) {
  const { currentPage, pageSize, baseUrl } = await extractPaginationParams(
    searchParams,
    DEFAULT_PAGE_SIZE,
    PAGE_PARAM_KEY,
  );

  let subscriptionsData = { data: [], totalCount: 0, hasNext: false };
  try {
    subscriptionsData = await fetchSubscriptions(currentPage, pageSize);
  } catch (error) {
    console.error("Failed to fetch subscriptions:", error);
  }

  return (
    <SessionPageLayout backHref="/session/overview">
      <Subscriptions
        cardClassName="w-full p-4 gap-4"
        subscriptionData={subscriptionsData.data}
        currentPage={currentPage}
        pageSize={pageSize}
        currentPageItems={subscriptionsData.data.length}
        hasNextPage={subscriptionsData.hasNext}
        baseUrl={baseUrl}
        pageParamKey={PAGE_PARAM_KEY}
      />
    </SessionPageLayout>
  );
}
