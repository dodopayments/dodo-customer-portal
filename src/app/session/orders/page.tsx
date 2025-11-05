import { fetchPayments } from "@/app/session/orders/actions";
import { OrderData } from "@/components/session/orders/orders";
import { Orders } from "@/components/session/orders/orders";
import { extractPaginationParams } from "@/lib/pagination-utils";

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
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
      <Orders
        cardClassName="w-full p-4 gap-4"
        ordersData={ordersData.data as OrderData[]}
        currentPage={currentPage}
        pageSize={pageSize}
        currentPageItems={ordersData.data.length}
        hasNextPage={ordersData.hasNext}
        baseUrl={baseUrl}
        pageParamKey={PAGE_PARAM_KEY}
      />
    </div>
  );
}
