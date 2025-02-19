/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import IDTooltip from "../custom/turnacate-tooltip";
import { Badge } from "../ui/badge";
import { CurrencyCode, formatCurrency } from "@/lib/currency-helper";
import parseIso from "@/lib/date-helper";
import { getBadge } from "@/lib/badge-helper";

type RefundTableType = {
  RefundId: string;
  AssociatedPayment: string;
  Status: string;
  Currency: CurrencyCode;
  TimeStamp: string;
  Amount: string;
};
export const RefundColumn: ColumnDef<RefundTableType>[] = [
  {
    accessorKey: "RefundId",
    header: "Refund Id",
    cell: ({ row }) => <IDTooltip idValue={row.getValue("RefundId")} />,
  },
  {
    accessorKey: "AssociatedPayment",
    header: "Associated Payment",
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <IDTooltip idValue={row.getValue("AssociatedPayment")} />
      </div>
    ),
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("Status") as string;
      const { color, message } = getBadge(status);
      return (
        <Badge dot={false} variant={color as any}>
          {message}
        </Badge>
      );
    },
  },

  {
    accessorKey: "TimeStamp",
    header: "Date",
    cell: (info) => {
      const dateStr = info.getValue<string>();
      return parseIso(dateStr);
    },
  },
  {
    accessorKey: "Amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("Amount"));
      const formatted = formatCurrency(amount, row.original.Currency);
      return <div className="text-left">{formatted}</div>;
    },
  },
];
