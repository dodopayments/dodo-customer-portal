"use client";

import { BaseDataGrid } from "../table/BaseDataGrid";
import { UsageHistoryMeter } from "./subscription-tabs-table";
import { UsageHistoryColumns } from "./usage-history-columns";
import Loading from "../loading";

interface UsageHistoryDetailsProps {
  usageHistory: UsageHistoryMeter[];
  setUsageHistoryPageNumber: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  isLoading: boolean;
  sub_id: string;
}

export function UsageHistoryDetails({
  usageHistory,
  setUsageHistoryPageNumber,
  pageSize,
  setPageSize,
  isLoading,
}: UsageHistoryDetailsProps) {
  const columns = UsageHistoryColumns();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 mt-8">
        <div className="h-40 flex items-center justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="flex pt-4 pb-10 flex-col gap-4">
      <div className="flex flex-col">
        <BaseDataGrid
          tableId="subscription-usage-history-table"
          columns={columns}
          data={usageHistory}
          manualPagination={false}
          manualSorting={false}
          disablePagination={true}
          recordCount={usageHistory.length}
          tableLayout={{
            autoWidth: true,
            columnsPinnable: true,
            columnsResizable: true,
            columnsMovable: true,
            columnsVisibility: false,
          }}
        />
      </div>
    </div>
  );
}

