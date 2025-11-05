"use client";

import { WalletLedgerItem } from "@/app/session/profile/types";
import { BaseDataGrid } from "@/components/table/BaseDataGrid";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { formatCurrency, decodeCurrency, CurrencyCode } from "@/lib/currency-helper";

export function WalletTable({
  walletLedger,
}: {
  walletLedger: WalletLedgerItem[];
}) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const WalletColumn: ColumnDef<any>[] = [
    {
      accessorKey: "event_type",
      header: "Type",
      cell: ({ row }) => {
        const eventType = row.original.event_type;
        return <div className="text-left text-text-secondary">{eventType || "-"}</div>;
      },
    },
    {
      accessorKey: "description",
      header: "Reason",
      cell: ({ row }) => {
        const description = row.original.description;
        return <div className="text-left text-text-secondary">{description || "-"}</div>;
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

  return (
    <BaseDataGrid tableId="wallet-table" data={data} columns={WalletColumn} />
  );
}
