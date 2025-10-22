import { Suspense } from "react";
import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { fetchLicenses, fetchBusiness } from "./actions";
import ServerFilterControls from "@/components/common/server-filter-controls";
import ClientPagination from "@/components/common/client-pagination";
import LicenseKeysTable from "./license-keys-table";

export interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function LicenseKeysPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const pageNumber = parseInt(params.page || '0');
  const status = params.status;
  const dateFrom = params.dateFrom;
  const dateTo = params.dateTo;

  const [licensesData, business] = await Promise.all([
    fetchLicenses({
      pageSize: 10,
      pageNumber,
      created_at_gte: dateFrom,
      created_at_lte: dateTo,
      status: status,
    }),
    fetchBusiness(),
  ]);

  const LICENSE_STATUS_OPTIONS = [
    { label: "Active", value: "active" },
    { label: "Disabled", value: "disabled" },
    { label: "Expired", value: "expired" },
  ];

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
      <PageHeader
        title="License Keys"
        description={`View all your license keys shared by ${business?.name || 'your business'}`}
        actions={
          <ServerFilterControls
            currentPage={pageNumber}
            currentStatus={status}
            currentDateFrom={dateFrom}
            currentDateTo={dateTo}
            statusOptions={LICENSE_STATUS_OPTIONS}
          />
        }
      />
      <Separator className="my-6" />

      {licensesData.data.length === 0 ? (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-20rem)]">
          <span className="text-text-primary p-3 mb-3 bg-bg-secondary rounded-full text-2xl">
            🔑
          </span>
          <span className="text-base font-display text-center tracking-wide text-text-secondary">
            No Active License Keys
          </span>
        </div>
      ) : (
        <div className="flex flex-col">
          <LicenseKeysTable data={licensesData.data} />
          <Suspense fallback={<div>Loading pagination...</div>}>
            <ClientPagination
              currentPage={pageNumber}
              hasNextPage={licensesData.hasNext || false}
              baseUrl={`?${new URLSearchParams({
                ...(status && { status }),
                ...(dateFrom && { dateFrom }),
                ...(dateTo && { dateTo }),
              }).toString()}`}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
