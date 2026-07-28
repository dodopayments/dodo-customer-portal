"use client";

import { WalletLedgerItem } from "@/app/session/profile/types";
import { BaseDataGrid } from "@/components/table/BaseDataGrid";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import {
  formatCurrency,
  decodeCurrency,
  CurrencyCode,
} from "@/lib/currency-helper";
import ServerPagination from "@/components/common/server-pagination";
import { CircleSlash } from "lucide-react";
import { useTranslations } from "next-intl";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";

export function WalletTable({
  walletLedger,
  currentPage,
  pageSize,
  currentPageItems,
  hasNextPage,
  baseUrl,
  pageParamKey,
}: {
  walletLedger: WalletLedgerItem[];
  currentPage: number;
  pageSize: number;
  currentPageItems: number;
  hasNextPage: boolean;
  baseUrl: string;
  pageParamKey?: string;
}) {
  const t = useTranslations("ProfileWallet");

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const WalletColumn: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: "event_type",
        header: ({ column }) => (
          <DataGridColumnHeader title={t("tableType")} column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-text-secondary">
            {row.original.event_type || "-"}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataGridColumnHeader title={t("tableReason")} column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-text-secondary">
            {row.original.reason || row.original.description || "-"}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataGridColumnHeader title={t("tableAmount")} column={column} />
        ),
        cell: ({ row }) => {
          const currency = row.original.currency as CurrencyCode;
          return (
            <span className="text-text-secondary">
              {formatCurrency(
                decodeCurrency(row.original.amount, currency),
                currency
              )}
            </span>
          );
        },
        enableSorting: true,
      },
    ],
    [t]
  );

  const data = useMemo(() => {
    return walletLedger;
  }, [walletLedger]);

  const isEmpty = walletLedger.length === 0;
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
          tableId="wallet-table"
          data={data}
          columns={WalletColumn}
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
