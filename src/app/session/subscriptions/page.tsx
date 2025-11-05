import { fetchSubscriptions } from "./actions";
import { Subscriptions } from "@/components/session/subscriptions/subscriptions";
import { extractPaginationParams } from "@/lib/pagination-utils";

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

  const subscriptionsData = await fetchSubscriptions(currentPage, pageSize);

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
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
    </div>
  );
}
