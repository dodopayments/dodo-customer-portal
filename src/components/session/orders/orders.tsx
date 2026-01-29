"use client";

import { cn } from "@/lib/utils";
import { CircleSlash, Download, FileText } from "lucide-react";
import { OrderCard } from "./order-card";
import TablePagination from "@/components/common/table-pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBadge } from "@/lib/badge-helper";
import {
  CurrencyCode,
  decodeCurrency,
  formatCurrency,
} from "@/lib/currency-helper";
import { useRouter } from "next/navigation";
import InvoiceDownloadSheet from "../invoice-download-sheet";
import { api_url } from "@/lib/http";
import { useState, useMemo } from "react";

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
  /** Client-side pagination props */
  initialPageSize?: number;
  /** Server-side pagination props (controlled mode) */
  currentPage?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  /** Show pagination (default true for both variants) */
  showPagination?: boolean;
}

export const Orders = ({
  cardClassName,
  ordersData,
  initialPageSize = 10,
  currentPage: externalCurrentPage,
  pageSize: externalPageSize,
  hasNextPage: externalHasNextPage,
  totalCount: externalTotalCount,
  onPageChange: externalOnPageChange,
  onPageSizeChange: externalOnPageSizeChange,
  variant = "detail",
  showPagination = true,
}: OrdersProps) => {
  const router = useRouter();

  // Determine if we're in controlled mode (server-side) or uncontrolled mode (client-side)
  const isControlled = externalCurrentPage !== undefined && externalOnPageChange !== undefined;

  // Internal state for client-side pagination
  const [internalCurrentPage, setInternalCurrentPage] = useState(0);
  const [internalPageSize, setInternalPageSize] = useState(initialPageSize);

  // Use external or internal values
  const currentPage = isControlled ? externalCurrentPage : internalCurrentPage;
  const pageSize = isControlled ? (externalPageSize ?? initialPageSize) : internalPageSize;

  // Calculate paginated data for client-side mode
  const paginatedData = useMemo(() => {
    if (isControlled) {
      // In controlled mode, data is already paginated from server
      return ordersData;
    }
    // In uncontrolled mode, paginate client-side
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return ordersData.slice(startIndex, endIndex);
  }, [ordersData, currentPage, pageSize, isControlled]);

  const totalCount = isControlled
    ? (externalTotalCount ?? ordersData.length)
    : ordersData.length;

  const hasNextPage = isControlled
    ? (externalHasNextPage ?? false)
    : (currentPage + 1) * pageSize < ordersData.length;

  const isEmpty = paginatedData.length === 0;
  const emptyMessage =
    currentPage > 0
      ? "No purchases found on this page"
      : "No purchases at the moment";

  // Pagination callbacks
  const handlePageChange = isControlled
    ? externalOnPageChange!
    : setInternalCurrentPage;

  const handlePageSizeChange = isControlled
    ? externalOnPageSizeChange!
    : setInternalPageSize;

  // Default showPagination based on variant
  const shouldShowPagination = showPagination;

  // Overview variant - table view for billing history
  if (variant === "overview") {
    return (
      <section id="billing-history">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-medium text-text-primary">
            Billing History
          </h2>
        </div>

        <Card>
          <CardContent className="p-0">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-bg-secondary rounded-full mb-4">
                  <CircleSlash className="w-6 h-6 text-text-secondary" />
                </div>
                <p className="text-text-secondary text-sm">
                  No billing history available
                </p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-6 px-6 py-4 bg-bg-secondary/50 border-b border-border-secondary text-xs font-medium text-text-secondary uppercase tracking-wider">
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-3">Items</div>
                  <div className="col-span-2">Entitlements</div>
                  <div className="col-span-2 text-right">Amount</div>
                  <div className="col-span-1 text-right">Invoice</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-border-secondary">
                  {paginatedData.map((order) => {
                    const badge = getBadge(order.status);

                    return (
                      <div
                        key={order.payment_id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-6 px-6 py-6 items-center hover:bg-bg-secondary/30 transition-colors"
                      >
                        <div className="md:col-span-2">
                          <span className="text-sm text-text-primary font-medium">
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "short",
                              year: "2-digit",
                            })}
                          </span>
                          <span className="md:hidden text-xs text-text-secondary ml-2">
                            {formatCurrency(
                              decodeCurrency(order.total_amount, order.currency as CurrencyCode),
                              order.currency as CurrencyCode
                            )}
                          </span>
                        </div>

                        <div className="md:col-span-2">
                          <Badge
                            variant={badge.color as BadgeVariant}
                            dot={false}
                            className="rounded-sm text-xs"
                          >
                            {badge.message}
                          </Badge>
                        </div>

                        <div className="md:col-span-3 flex items-center gap-2">
                          <span className="text-sm text-text-primary truncate">
                            {order.subscription_id
                              ? "Subscription Payment"
                              : "One-time Purchase"}
                          </span>
                        </div>

                        <div className="md:col-span-2 flex items-center gap-2">
                          {order.digital_products_delivered ? (
                            <div className="flex items-center gap-1 text-xs text-text-success-primary">
                              <FileText className="w-3.5 h-3.5" />
                              <span>Delivered</span>
                            </div>
                          ) : (
                            <span className="text-xs text-text-tertiary">-</span>
                          )}
                        </div>

                        <div className="hidden md:block md:col-span-2 text-right">
                          <span className="text-sm font-medium text-text-primary">
                            {formatCurrency(
                              decodeCurrency(order.total_amount, order.currency as CurrencyCode),
                              order.currency as CurrencyCode
                            )}
                          </span>
                        </div>

                        <div className="md:col-span-1 flex justify-end">
                          <InvoiceDownloadSheet
                            paymentId={order.payment_id}
                            downloadUrl={`${api_url}/invoices/payments/${order.payment_id}`}
                            variant="icon"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {shouldShowPagination && (
                  <TablePagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalCount={totalCount}
                    hasNextPage={hasNextPage}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
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
        paginatedData.map((item: OrderData, index: number) => (
          <OrderCard
            key={index}
            item={item}
            cardClassName={cn("border-b", cardClassName)}
          />
        ))
      )}
      {shouldShowPagination && !isEmpty && (
        <Card>
          <CardContent className="p-0">
            <TablePagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalCount={totalCount}
              hasNextPage={hasNextPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
