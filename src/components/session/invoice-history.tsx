"use client";

import { BaseDataGrid } from "../table/BaseDataGrid";
import { ColumnDef } from "@tanstack/react-table";
import { InvoiceHistoryResponse } from "./subscription-tabs-table";
import { useMemo } from "react";
import { Badge } from "../ui/badge";
import { getBadge } from "@/lib/badge-helper";
import { formatCurrency, decodeCurrency } from "@/lib/currency-helper";
import { CircleSlash } from "lucide-react";
import ServerPagination from "@/components/common/server-pagination";
import InvoiceDownloadSheet from "./invoice-download-sheet";

/* eslint-disable @typescript-eslint/no-explicit-any */
const InvoiceColumn: ColumnDef<any>[] = [
  {
    accessorKey: "payment_id",
    header: "Payment ID",
    cell: ({ row }) => {
      return (
        <div className="text-left text-text-secondary">
          {row.original.payment_id}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return (
        <div className="text-left text-text-secondary">
          {new Date(row.original.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return (
        <div className="text-left text-text-secondary">
          {formatCurrency(
            decodeCurrency(row.original.amount, row.original.currency),
            row.original.currency
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      return (
        <Badge variant={getBadge(row.original.status).color as any}>
          {getBadge(row.original.status).message}
        </Badge>
      );
    },
  },
  {
    accessorKey: "download",
    header: "Download",
    cell: ({ row }) => {
      return (
        <InvoiceDownloadSheet
          key={row.original.payment_id}
          paymentId={row.original.payment_id}
          downloadUrl={row.original.download_url}
        />
      );
    },
  },
];

export function InvoiceHistory({
  invoiceHistory,
  currentPage,
  pageSize,
  currentPageItems,
  hasNextPage,
  baseUrl,
  pageParamKey,
}: {
  invoiceHistory: InvoiceHistoryResponse[];
  currentPage: number;
  pageSize: number;
  currentPageItems: number;
  hasNextPage: boolean;
  baseUrl: string;
  pageParamKey?: string;
}) {
  const data = useMemo(() => {
    return invoiceHistory;
  }, [invoiceHistory]);

  const isEmpty = invoiceHistory.length === 0;
  const emptyMessage =
    currentPage > 0
      ? "No invoices found on this page"
      : "No invoices at the moment";

  return (
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
          tableId="invoice-history"
          data={data}
          columns={InvoiceColumn}
          disablePagination
          manualPagination
          initialPageSize={pageSize}
        />
      )}
      {(!isEmpty || currentPage !== 0) && (
        <ServerPagination
          currentPage={currentPage}
          pageSize={pageSize}
          currentPageItems={currentPageItems}
          hasNextPage={hasNextPage}
          baseUrl={baseUrl}
          pageParamKey={pageParamKey}
        />
      )}
    </div>
  );
}