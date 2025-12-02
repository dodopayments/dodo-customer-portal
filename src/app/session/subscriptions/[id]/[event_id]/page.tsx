import PageHeader from "@/components/page-header";
import { BackButton } from "../../../../../components/custom/back-button";
import { BaseDataGrid } from "@/components/table/BaseDataGrid";
import { fetchMeterEvents } from "./action";
import { EventsColumn } from "@/components/session/subscriptions/events-coloumn";
import { extractPaginationParams } from "@/lib/pagination-utils";
import ServerPagination from "@/components/common/server-pagination";
import { CircleSlash } from "lucide-react";

const DEFAULT_PAGE_SIZE = 50;
const METER_EVENTS_PAGE_PARAM_KEY = "meter_events_page";

export interface PageProps {
  params: Promise<{ id: string; event_id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function EventPage({ params, searchParams }: PageProps) {
  const { id, event_id } = await params;
  
  const paginationParams = await extractPaginationParams(
    searchParams,
    DEFAULT_PAGE_SIZE,
    METER_EVENTS_PAGE_PARAM_KEY
  );

  const meterEvents = await fetchMeterEvents(
    event_id,
    id,
    paginationParams.currentPage,
    paginationParams.pageSize
  );

  const isEmpty = meterEvents.data.length === 0;
  const emptyMessage =
    paginationParams.currentPage > 0
      ? "No meter events found on this page"
      : "No meter events at the moment";

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full gap-8">
      <PageHeader showSeparator={false}>
        <div className="flex flex-row gap-2 w-fit items-center">
          <BackButton fallbackUrl={`/session/subscriptions/${id}`} />
          <p className="text-text-primary text-lg font-medium">Meter Events</p>
        </div>
      </PageHeader>
      <div className="flex flex-col gap-4">
        {isEmpty ? (
          <div className="flex flex-col justify-center items-center min-h-[200px] my-auto">
            <span className="text-text-primary p-3 mb-3 bg-bg-secondary rounded-full text-2xl">
              <CircleSlash />
            </span>
            <span className="text-sm font-display text-center tracking-wide text-text-secondary">
              {emptyMessage}
            </span>
          </div>
        ) : (
          <BaseDataGrid
            tableId="meter-events-table"
            data={meterEvents.data}
            columns={EventsColumn}
            disablePagination
            manualPagination
            initialPageSize={paginationParams.pageSize}
          />
        )}
        {(!isEmpty || paginationParams.currentPage !== 0) && (
        <ServerPagination
          currentPage={paginationParams.currentPage}
          pageSize={paginationParams.pageSize}
          currentPageItems={meterEvents.data.length}
          hasNextPage={meterEvents.hasNext}
          baseUrl={paginationParams.baseUrl}
          pageParamKey={METER_EVENTS_PAGE_PARAM_KEY}
        />
        )}
      </div>
    </div>
  );
}
