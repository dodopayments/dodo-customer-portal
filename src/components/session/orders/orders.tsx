"use client";

import { cn } from "@/lib/utils";
import { CircleSlash } from "lucide-react";
import { OrderCard } from "./order-card";
import ServerPagination from "@/components/common/server-pagination";
import { Card, CardContent } from "@/components/ui/card";
import { BaseDataGrid } from "@/components/table/BaseDataGrid";
import { BillingHistoryColumns } from "./billing-history-columns";

export interface OrderData {
  brand_id: string;
  created_at: string;
  currency: string;
  customer: {
    customer_id: string;
    email: string;
    name: string;
    phone_number: string;
  };
  digital_products_delivered: boolean;
  has_license_key: boolean;
  payment_id: string;
  payment_method: string;
  payment_method_type: string;
  status: string;
  subscription_id: string | null;
  total_amount: number;
}

interface OrdersProps {
  cardClassName?: string;
  ordersData: OrderData[];
  /**
   * "detail" - Card list with expandable details (for /orders page)
   * "overview" - Table view for billing history section
   */
  variant?: "detail" | "overview";
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  currentPageItems?: number;
  totalCount?: number;
  // For detail variant (link-based pagination)
  baseUrl?: string;
  pageParamKey?: string;
  // For overview variant (callback-based pagination)
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showPagination?: boolean;
}

export const Orders = ({
  cardClassName,
  ordersData,
  currentPage,
  pageSize,
  hasNextPage,
  currentPageItems,
  totalCount: externalTotalCount,
  baseUrl,
  pageParamKey,
  onPageChange,
  onPageSizeChange,
  variant = "detail",
  showPagination = true,
}: OrdersProps) => {

  const OVERVIEW_PAGE_SIZE = 25;

  const totalCount = externalTotalCount ?? ordersData.length;
  const isEmpty = ordersData.length === 0;
  const emptyMessage =
    currentPage > 0
      ? "No purchases found on this page"
      : "No purchases at the moment";

  const shouldShowPagination = showPagination;

  if (variant === "overview") {
    const shouldShowOverviewPagination = showPagination && totalCount > OVERVIEW_PAGE_SIZE;

    return (
      <section id="billing-history">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-medium text-text-primary">
            Billing History
          </h2>
        </div>

        {isEmpty ? (
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-bg-secondary rounded-full mb-4">
                  <CircleSlash className="w-6 h-6 text-text-secondary" />
                </div>
                <p className="text-text-secondary text-sm">
                  No billing history available
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <BaseDataGrid
            tableId="billing-history-overview"
            data={ordersData}
            columns={BillingHistoryColumns}
            // recordCount={totalCount}
            manualPagination
            initialPageSize={OVERVIEW_PAGE_SIZE}
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
            disablePagination={!shouldShowOverviewPagination}
            emptyStateMessage="No billing history available"
          />
        )}
      </section>
    );
  }

  // Detail variant - original card list view
  return (
    <div className="flex flex-col gap-4">
      {isEmpty ? (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-20rem)] my-auto">
          <span className="text-text-primary p-3 mb-3 bg-bg-secondary rounded-full text-2xl">
            <CircleSlash />
          </span>
          <span className="text-sm font-display text-center tracking-wide text-text-secondary">
            {emptyMessage}
          </span>
        </div>
      ) : (
        ordersData.map((item: OrderData, index: number) => (
          <OrderCard
            key={index}
            item={item}
            cardClassName={cn("border-b", cardClassName)}
          />
        ))
      )}
      {shouldShowPagination && (totalCount > 0 || currentPage > 0) && baseUrl && pageParamKey && (
        <ServerPagination
          currentPage={currentPage}
          pageSize={pageSize}
          currentPageItems={currentPageItems ?? ordersData.length}
          hasNextPage={hasNextPage}
          baseUrl={baseUrl}
          pageParamKey={pageParamKey}
        />
      )}
    </div>
  );
};
