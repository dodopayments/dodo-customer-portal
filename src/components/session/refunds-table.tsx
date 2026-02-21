"use client";

import { CircleSlash } from "lucide-react";
import { BaseDataGrid } from "@/components/table/BaseDataGrid";
import { Card, CardContent } from "@/components/ui/card";
import ServerPagination from "@/components/common/server-pagination";
import { RefundColumn, RefundResponse } from "@/components/session/refunds-column";

interface RefundsTableProps {
  refundsData: RefundResponse[];
  tableId?: string;
  title?: string;
  titleClassName?: string;
  showTitle?: boolean;
  currentPage?: number;
  pageSize?: number;
  currentPageItems?: number;
  hasNextPage?: boolean;
  totalCount?: number;
  baseUrl?: string;
  pageParamKey?: string;
  showPagination?: boolean;
  paginationMode?: "server" | "grid";
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function RefundsTable({
  refundsData,
  tableId = "refund-history",
  title = "Refund History",
  titleClassName = "text-lg font-display font-medium text-text-primary",
  showTitle = true,
  currentPage = 0,
  pageSize = 25,
  currentPageItems = 0,
  hasNextPage = false,
  totalCount = 0,
  baseUrl = "?",
  pageParamKey = "refund_page",
  showPagination = true,
  paginationMode = "server",
  onPageChange,
  onPageSizeChange,
}: RefundsTableProps) {
  const isEmpty = refundsData.length === 0;
  const shouldShowGridPagination = showPagination && totalCount > pageSize;

  return (
    <section id="refund-history">
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h2 className={titleClassName}>{title}</h2>
        </div>
      )}

      {isEmpty ? (
        <Card>
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-bg-secondary rounded-full mb-4">
                <CircleSlash className="w-6 h-6 text-text-secondary" />
              </div>
              <p className="text-text-secondary text-sm">No refunds available</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <BaseDataGrid
          tableId={tableId}
          data={refundsData}
          columns={RefundColumn}
          disablePagination={paginationMode === "server" || !shouldShowGridPagination}
          manualPagination
          initialPageSize={pageSize}
          onPaginationChange={(pagination) => {
            if (pagination.pageIndex !== currentPage && onPageChange) {
              onPageChange(pagination.pageIndex);
            }
            if (pagination.pageSize !== pageSize && onPageSizeChange) {
              onPageSizeChange(pagination.pageSize);
            }
          }}
          tableLayout={{
            autoWidth: false,
            columnsPinnable: false,
            columnsResizable: false,
            columnsMovable: false,
            columnsVisibility: false,
            disableRowPerPage: true,
          }}
        />
      )}

      {paginationMode === "server" &&
        showPagination &&
        (hasNextPage || totalCount > 0 || currentPage > 0) && (
        <ServerPagination
          currentPage={currentPage}
          pageSize={pageSize}
          currentPageItems={currentPageItems}
          hasNextPage={hasNextPage}
          baseUrl={baseUrl}
          pageParamKey={pageParamKey}
        />
      )}
    </section>
  );
}
