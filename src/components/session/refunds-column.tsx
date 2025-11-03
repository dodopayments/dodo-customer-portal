/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import IDTooltip from "../custom/turnacate-tooltip";
import { Badge } from "../ui/badge";
import {
  CurrencyCode,
  decodeCurrency,
  formatCurrency,
} from "@/lib/currency-helper";
import parseIso from "@/lib/date-helper";
import { getBadge } from "@/lib/badge-helper";

interface RefundResponse {
  amount: number;
  business_id: string;
  created_at: string;
  currency: string;
  payment_id: string;
  reason: string;
  refund_id: string;
  status: string;
}

export const RefundColumn: ColumnDef<RefundResponse>[] = [
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
    accessorKey: "created_at",
    header: "Date",
    cell: (info) => {
      const dateStr = info.getValue<string>();
      return parseIso(dateStr);
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const currency = row.original.currency as CurrencyCode;
      const formatted = formatCurrency(
        decodeCurrency(amount, currency),
        currency,
      );
      return <div className="text-left">{formatted}</div>;
    },
  },
];
