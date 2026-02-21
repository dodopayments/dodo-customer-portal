/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import IDTooltip from "../custom/truncate-tooltip";
import { Badge } from "../ui/badge";
import {
  CurrencyCode,
  decodeCurrency,
  formatCurrency,
} from "@/lib/currency-helper";
import { getBadge } from "@/lib/badge-helper";
import { TimeTooltip } from "../custom/time-tooltip";

export interface RefundResponse {
  amount: number | null;
  business_id: string;
  created_at: string;
  currency: string | null;
  payment_id: string;
  reason: string | null;
  refund_id: string;
  status: string;
}

export const RefundColumn: ColumnDef<RefundResponse>[] = [
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      return (
        <TimeTooltip
          timeStamp={row.original.created_at}
          className="text-sm text-text-primary font-medium"
          triggerFormat="shortDate"
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const { color, message } = getBadge(status);
      return (
        <Badge dot={false} variant={color as any}>
          {message}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      const currency = row.original.currency;
      if (amount === null || currency === null) {
        return <div className="text-left">-</div>;
      }
      const currencyCode = currency as CurrencyCode;
      const formatted = formatCurrency(
        decodeCurrency(amount, currencyCode),
        currencyCode,
      );
      return <div className="text-left">{formatted}</div>;
    },
  },
  {
    accessorKey: "refund_id",
    header: "Refund Id",
    cell: ({ row }) => <IDTooltip idValue={row.getValue("refund_id")} />,
  },
  {
    accessorKey: "payment_id",
    header: "Associated Payment",
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <IDTooltip idValue={row.getValue("payment_id")} />
      </div>
    ),
  },
];
