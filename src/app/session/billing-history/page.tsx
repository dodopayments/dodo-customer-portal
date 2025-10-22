import { Suspense } from "react";
import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import BaseDataTable from "@/components/custom/base-data-table";
import { PaymentColumn } from "@/components/session/payments-column";
import { RefundColumn } from "@/components/session/refunds-column";
import { fetchPayments, fetchRefunds, fetchBusiness } from "./actions";
import ServerFilterControls from "@/components/common/server-filter-controls";
import ClientPagination from "@/components/common/client-pagination";

export interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    showRefunds?: string;
  }>;
}

export default async function BillingHistoryPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Parse URL parameters
  const pageNumber = parseInt(params.page || '0');
  const status = params.status;
  const dateFrom = params.dateFrom;
  const dateTo = params.dateTo;
  const showRefunds = params.showRefunds === 'true';

  // Fetch data server-side based on URL params
  const [paymentsData, refundsData, business] = await Promise.all([
    fetchPayments({
      pageSize: 10,
      pageNumber,
      created_at_gte: dateFrom,
      created_at_lte: dateTo,
      status: status,
    }),
    showRefunds ? fetchRefunds({
      pageSize: 10,
      pageNumber: 0, // Reset refunds pagination when filtering
      created_at_gte: dateFrom,
      created_at_lte: dateTo,
      status: status,
    }) : Promise.resolve({ data: [], hasNext: false }),
    fetchBusiness(),
  ]);

  const shouldShowRefunds = showRefunds || refundsData.data.length > 0;

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
      <PageHeader
        title="Billing History"
        description={`View all your orders with ${business?.name || 'your business'}`}
        actions={
          !shouldShowRefunds && (
            <ServerFilterControls
              currentPage={pageNumber}
              currentStatus={status}
              currentDateFrom={dateFrom}
              currentDateTo={dateTo}
            />
          )
        }
      />
      <Separator className="my-6" />

      <div className="flex flex-col">
        {/* Payments Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-display font-medium text-lg">Payments</span>
            {shouldShowRefunds && (
              <ServerFilterControls
                currentPage={pageNumber}
                currentStatus={status}
                currentDateFrom={dateFrom}
                currentDateTo={dateTo}
                showRefundsOption={true}
              />
            )}
          </div>
          <div className="flex flex-col">
            <BaseDataTable data={paymentsData.data || []} columns={PaymentColumn} />
            <Suspense fallback={<div>Loading pagination...</div>}>
              <ClientPagination
                currentPage={pageNumber}
                hasNextPage={paymentsData.hasNext || false}
                baseUrl={`?${new URLSearchParams({
                  ...(status && { status }),
                  ...(dateFrom && { dateFrom }),
                  ...(dateTo && { dateTo }),
                  ...(shouldShowRefunds && { showRefunds: 'true' }),
                }).toString()}`}
              />
            </Suspense>
          </div>
        </div>

        {/* Refunds Section */}
        {shouldShowRefunds && (
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center justify-between">
              <span className="font-display font-medium text-lg">Refunds</span>
              <ServerFilterControls
                currentPage={0}
                currentStatus={status}
                currentDateFrom={dateFrom}
                currentDateTo={dateTo}
                showRefundsOption={true}
              />
            </div>
            <div className="flex flex-col">
              <BaseDataTable data={refundsData.data || []} columns={RefundColumn} />
              <Suspense fallback={<div>Loading pagination...</div>}>
                <ClientPagination
                  currentPage={0}
                  hasNextPage={refundsData.hasNext || false}
                  baseUrl={`?${new URLSearchParams({
                    showRefunds: 'true',
                    ...(status && { status }),
                    ...(dateFrom && { dateFrom }),
                    ...(dateTo && { dateTo }),
                  }).toString()}`}
                />
              </Suspense>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
