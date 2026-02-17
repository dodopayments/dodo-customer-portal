"use client";

import { CreditLedgerItem } from "@/app/session/profile/types";
import { BaseDataGrid } from "@/components/table/BaseDataGrid";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import ServerPagination from "@/components/common/server-pagination";
import { CircleSlash } from "lucide-react";

export function CreditsTable({
  creditLedger,
  unit,
  currentPage,
  pageSize,
  currentPageItems,
  hasNextPage,
  baseUrl,
  pageParamKey,
}: {
  creditLedger: CreditLedgerItem[];
  unit: string;
  currentPage: number;
  pageSize: number;
  currentPageItems: number;
  hasNextPage: boolean;
  baseUrl: string;
  pageParamKey?: string;
}) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const CreditColumn: ColumnDef<any>[] = [
    {
      accessorKey: "transaction_type",
      header: "Type",
      cell: ({ row }) => {
        const transactionType = row.original.transaction_type;
        const formatted = transactionType
          ? transactionType.replace(/_/g, " ")
          : "-";
        return (
          <div className="text-left text-text-secondary capitalize">
            {formatted}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.description;
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
        const isCredit = row.original.is_credit;
        return (
          <div
            className={`text-left ${
              isCredit ? "text-green-600" : "text-red-500"
            }`}
          >
            {isCredit ? "+" : "-"}
            {amount} {unit}
          </div>
        );
      },
    },
  ];

  const data = useMemo(() => {
    return creditLedger;
  }, [creditLedger]);

  const isEmpty = creditLedger.length === 0;
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
          tableId="credits-table"
          data={data}
          columns={CreditColumn}
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
