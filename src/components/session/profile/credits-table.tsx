"use client";

import { CreditLedgerItem } from "@/app/session/profile/types";
import { BaseDataGrid } from "@/components/table/BaseDataGrid";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import ServerPagination from "@/components/common/server-pagination";
import { CircleSlash } from "lucide-react";
import { useTranslations } from "next-intl";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";

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
  const t = useTranslations("ProfileCredits");

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const CreditColumn: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: "transaction_type",
        header: ({ column }) => (
          <DataGridColumnHeader title={t("tableType")} column={column} />
        ),
        cell: ({ row }) => {
          const transactionType = row.original.transaction_type;
          const formatted = transactionType
            ? transactionType.replace(/_/g, " ")
            : "-";
          return (
            <span className="text-text-secondary capitalize">{formatted}</span>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataGridColumnHeader title={t("tableDescription")} column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-text-secondary">
            {row.original.description || "-"}
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
          const amount = row.original.amount;
          const isCredit = row.original.is_credit;
          return (
            <span className={isCredit ? "text-green-600" : "text-red-500"}>
              {isCredit ? "+" : "-"}
              {amount} {unit}
            </span>
          );
        },
        enableSorting: true,
      },
    ],
    [t, unit]
  );

  const data = useMemo(() => {
    return creditLedger;
  }, [creditLedger]);

  const isEmpty = creditLedger.length === 0;
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
