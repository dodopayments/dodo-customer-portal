import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { fetchSubscriptions } from "./actions";
import { fetchBusiness } from "@/lib/server-actions";
import Filters from "@/components/common/filters";
import ServerPagination from "@/components/common/server-pagination";
import SubscriptionsTable from "./subscriptions-table";

export interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function SubscriptionsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const pageNumber = parseInt(params.page || '0');
  const status = params.status;
  const dateFrom = params.dateFrom;
  const dateTo = params.dateTo;

  const [subscriptionsData, business] = await Promise.all([
    fetchSubscriptions({
      pageSize: 10,
      pageNumber,
      created_at_gte: dateFrom,
      created_at_lte: dateTo,
      status: status,
    }),
    fetchBusiness(),
  ]);

  const SUBSCRIPTION_STATUS_OPTIONS = [
    { label: "Active", value: "active" },
    { label: "On Hold", value: "on_hold" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Pending", value: "pending" },
    { label: "Expired", value: "expired" },
    { label: "Failed", value: "failed" },
  ];

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
      <PageHeader
        title="Subscriptions"
        description={`View all your subscriptions with ${business?.name || 'your business'}`}
        actions= {
          <div className="flex items-center justify-between mb-4">
          <Filters
            statusOptions={SUBSCRIPTION_STATUS_OPTIONS}
          />
        </div>
        }
      />
      <Separator className="my-6" />

      {subscriptionsData.data.length === 0 ? (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-20rem)]">
          <span className="text-text-primary p-3 mb-3 bg-bg-secondary rounded-full text-2xl">
            📋
          </span>
          <span className="text-base font-display text-center tracking-wide text-text-secondary">
            No Active Subscriptions
          </span>
        </div>
      ) : (
        <div className="flex flex-col">
          <SubscriptionsTable data={subscriptionsData.data} />
          <ServerPagination
            currentPage={pageNumber}
            pageSize={10}
            currentPageItems={subscriptionsData.data?.length || 0}
            hasNextPage={subscriptionsData.hasNext || false}
            baseUrl={`?${new URLSearchParams({
              ...(status && { status }),
              ...(dateFrom && { dateFrom }),
              ...(dateTo && { dateTo }),
            }).toString()}`}
          />
        </div>
      )}
    </div>
  );
}
