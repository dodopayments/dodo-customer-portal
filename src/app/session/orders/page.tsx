import { fetchPayments } from "@/app/session/orders/actions";
import { OrderData } from "@/components/session/orders/orders";
import { Orders } from "@/components/session/orders/orders";
import { extractPaginationParams } from "@/lib/pagination-utils";
import { SessionPageLayout } from "@/components/session/session-page-layout";

interface OrdersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const DEFAULT_PAGE_SIZE = 50;
const PAGE_PARAM_KEY = "order_page";

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const { currentPage, pageSize, baseUrl } = await extractPaginationParams(
    searchParams,
    DEFAULT_PAGE_SIZE,
    PAGE_PARAM_KEY,
  );

  const ordersData = await fetchPayments(currentPage, pageSize);

  return (
    <SessionPageLayout title="Orders" backHref="/session/overview">
      <Orders
        cardClassName="w-full p-4 gap-4"
        ordersData={ordersData.data as OrderData[]}
        currentPage={currentPage}
        pageSize={pageSize}
        currentPageItems={ordersData.data.length}
        hasNextPage={ordersData.hasNext}
        totalCount={ordersData.totalCount}
        baseUrl={baseUrl}
        pageParamKey={PAGE_PARAM_KEY}
      />
    </SessionPageLayout>
  );
}
