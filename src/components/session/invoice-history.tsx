"use client";

import { BaseDataGrid } from "../table/BaseDataGrid";
import { ColumnDef } from "@tanstack/react-table";
import { InvoiceHistoryResponse } from "./subscription-tabs-table";
import { useMemo } from "react";
import { getBadge } from "@/lib/badge-helper";
import { formatCurrency, decodeCurrency } from "@/lib/currency-helper";
import { CircleSlash } from "lucide-react";
import ServerPagination from "@/components/common/server-pagination";
import InvoiceDownloadSheet from "./invoice-download-sheet";
import IDTooltip from "../custom/truncate-tooltip";
import { Badge, type BadgeVariant } from "../ui/badge";
import { TimeTooltip } from "../custom/time-tooltip";
import { DataGridColumnHeader } from "../ui/data-grid-column-header";
import { useTranslations } from "next-intl";

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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const InvoiceColumn: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: "payment_id",
        header: ({ column }) => (
          <DataGridColumnHeader title={t("paymentId")} column={column} />
        ),
        cell: ({ row }: { row: any }) => (
          <IDTooltip idValue={row.original.payment_id} />
        ),
        enableSorting: true,
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <DataGridColumnHeader title={t("date")} column={column} />
        ),
        cell: ({ row }: { row: any }) => (
          <TimeTooltip timeStamp={row.original.date} />
        ),
        enableSorting: true,
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataGridColumnHeader title={t("amount")} column={column} />
        ),
        cell: ({ row }: { row: any }) =>
          formatCurrency(
            decodeCurrency(row.original.amount, row.original.currency),
            row.original.currency
          ),
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataGridColumnHeader title={t("status")} column={column} />
        ),
        cell: ({ row }: { row: any }) => (
          <Badge
            dot={false}
            variant={getBadge(row.original.status).color as BadgeVariant}
          >
            {tBadge(getBadge(row.original.status).messageKey)}
          </Badge>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "download",
        header: t("invoice"),
        cell: ({ row }: { row: any }) => (
          <InvoiceDownloadSheet
            key={row.original.payment_id}
            paymentId={row.original.payment_id}
            downloadUrl={row.original.download_url}
            disabled={!(row.original.amount > 0)}
          />
        ),
      },
    ],
    [t, tBadge]
  );

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
