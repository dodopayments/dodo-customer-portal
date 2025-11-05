"use client";

import { BaseDataGrid } from "../table/BaseDataGrid";
import { UsageHistoryMeter } from "./subscription-tabs-table";
import { UsageHistoryColumns } from "./usage-history-columns";
import Loading from "../loading";

interface UsageHistoryDetailsProps {
  sub_id: string;
  usageHistory: UsageHistoryMeter[];
  pageSize: number;
  isLoading: boolean;
}

export function UsageHistoryDetails({
  sub_id,
  usageHistory,
  pageSize,
  isLoading,
}: UsageHistoryDetailsProps) {
  const columns = UsageHistoryColumns({ sub_id });
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
          manualPagination={true}
          manualSorting={false}
          disablePagination={true}
          initialPageSize={Math.max(pageSize, usageHistory.length)}
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
