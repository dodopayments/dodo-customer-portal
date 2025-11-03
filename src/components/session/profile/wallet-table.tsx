"use client";

import { WalletLedgerItem } from "@/app/session/profile/types";
import { BaseDataGrid } from "@/components/table/BaseDataGrid";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export function WalletTable({
  walletLedger,
}: {
  walletLedger: WalletLedgerItem[];
}) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const WalletColumn: ColumnDef<any>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        return <div className="text-left text-text-secondary"></div>;
      },
    },
    {
      accessorKey: "Reason",
      header: "Reason",
      cell: ({ row }) => {
        return <div className="text-left text-text-secondary"></div>;
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return;
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
