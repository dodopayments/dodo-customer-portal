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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const WalletColumn: ColumnDef<any>[] = [
    {
      accessorKey: "event_type",
      header: "Type",
      cell: ({ row }) => {
        const eventType = row.original.event_type;
        return (
          <div className="text-left text-text-secondary">
            {eventType || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Reason",
      cell: ({ row }) => {
        const description = row.original.reason || row.original.description;
        return (
          <div className="text-left text-text-secondary">
            {description || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.original.amount;
        const currency = row.original.currency as CurrencyCode;
        const decodedAmount = decodeCurrency(amount, currency);
        return (
          <div className="text-left text-text-secondary">
            {formatCurrency(decodedAmount, currency)}
          </div>
        );
      },
    },
  ];

  const data = useMemo(() => {
    return walletLedger;
  }, [walletLedger]);

  const isEmpty = walletLedger.length === 0;
  const emptyMessage =
    currentPage > 0
      ? "No transactions found on this page"
      : "No transactions at the moment";

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
