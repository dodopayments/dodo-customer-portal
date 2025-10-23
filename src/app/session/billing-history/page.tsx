import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import BaseDataTable from "@/components/custom/base-data-table";
import { PaymentColumn } from "@/components/session/payments-column";
import { RefundColumn } from "@/components/session/refunds-column";
import { fetchPayments, fetchRefunds, fetchBusiness } from "./actions";
import ClientFilters from "./client-filters";
import ServerPagination from "@/components/common/server-pagination";

export interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    refundPage?: string;
    refundStatus?: string;
    refundDateFrom?: string;
    refundDateTo?: string;
  }>;
}

export default async function BillingHistoryPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const pageNumber = parseInt(params.page || '0');
  const status = params.status;
  const dateFrom = params.dateFrom;
  const dateTo = params.dateTo;

  const refundPageNumber = parseInt(params.refundPage || '0');
  const refundStatus = params.refundStatus;
  const refundDateFrom = params.refundDateFrom;
  const refundDateTo = params.refundDateTo;

  const [paymentsData, refundsData, business] = await Promise.all([
    fetchPayments({
      pageSize: 10,
      pageNumber,
      created_at_gte: dateFrom,
      created_at_lte: dateTo,
      status: status,
    }),
    fetchRefunds({
      pageSize: 10,
      pageNumber: refundPageNumber,
      created_at_gte: refundDateFrom,
      created_at_lte: refundDateTo,
      status: refundStatus,
    }),
    fetchBusiness(),
  ]);

  const shouldShowRefunds =
    refundsData.data.length > 0 ||
    Boolean(refundDateFrom) ||
    Boolean(refundDateTo) ||
    Boolean(refundStatus);

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
      <PageHeader
        title="Billing History"
        description={`View all your orders with ${business?.name || 'your business'}`}
      />
      <Separator className="my-6" />

      <div className="flex flex-col">
        {/* Payments Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-display font-medium text-lg">Payments</span>
            <ClientFilters />
          </div>
          <div className="flex flex-col">
            <BaseDataTable data={paymentsData.data || []} columns={PaymentColumn} />
            <ServerPagination
              currentPage={pageNumber}
              pageSize={10}
              currentPageItems={paymentsData.data?.length || 0}
              hasNextPage={paymentsData.hasNext || false}
              baseUrl={`?${new URLSearchParams({
                ...(status && { status }),
                ...(dateFrom && { dateFrom }),
                ...(dateTo && { dateTo }),
              }).toString()}`}
            />
          </div>
        </div>

        {/* Refunds Section */}
        {shouldShowRefunds && (
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center justify-between">
              <span className="font-display font-medium text-lg">Refunds</span>
              <ClientFilters
                showRefundsOption={true}
                isRefundSection={true}
              />
            </div>
            <div className="flex flex-col">
              <BaseDataTable data={refundsData.data || []} columns={RefundColumn} />
              <ServerPagination
                currentPage={refundPageNumber}
                pageSize={10}
                currentPageItems={refundsData.data?.length || 0}
                hasNextPage={refundsData.hasNext || false}
                baseUrl={`?${new URLSearchParams({
                  ...(status && { status }),
                  ...(dateFrom && { dateFrom }),
                  ...(dateTo && { dateTo }),
                  ...(refundStatus && { refundStatus }),
                  ...(refundDateFrom && { refundDateFrom }),
                  ...(refundDateTo && { refundDateTo }),
                }).toString()}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
