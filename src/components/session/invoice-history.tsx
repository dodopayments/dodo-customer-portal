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
import { useTranslations, useLocale } from "next-intl";

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
  const t = useTranslations("InvoiceHistory");
  const tBadge = useTranslations("BadgeStatus");
  const locale = useLocale();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const InvoiceColumn: ColumnDef<any>[] = useMemo(() => [
    {
      accessorKey: "payment_id",
      header: t("paymentId"),
      cell: ({ row }: { row: any }) => (
        <div className="text-left">{row.original.payment_id}</div>
      ),
    },
    {
      accessorKey: "date",
      header: t("date"),
      cell: ({ row }: { row: any }) => (
        <div className="text-left">
          {new Date(row.original.date).toLocaleDateString(locale, {
            day: "numeric",
            month: "short",
            year: "2-digit",
          })}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: t("amount"),
      cell: ({ row }: { row: any }) => (
        <div className="text-left">
          {formatCurrency(
            decodeCurrency(row.original.amount, row.original.currency),
            row.original.currency
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }: { row: any }) => (
        <Badge variant={getBadge(row.original.status).color as any}>
          {tBadge(getBadge(row.original.status).messageKey)}
        </Badge>
      ),
    },
    {
      accessorKey: "download",
      header: t("download"),
      cell: ({ row }: { row: any }) => (
        <InvoiceDownloadSheet
          key={row.original.payment_id}
          paymentId={row.original.payment_id}
          downloadUrl={row.original.download_url}
          disabled={!(row.original.amount > 0)}
        />
      ),
    },
  ], [t, tBadge, locale]);

  const data = useMemo(() => invoiceHistory, [invoiceHistory]);

  const isEmpty = invoiceHistory.length === 0;
  const emptyMessage = currentPage > 0 ? t("emptyPage") : t("emptyAll");

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
