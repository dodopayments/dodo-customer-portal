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
import { PaymentResponse } from "@/redux/slice/transaction/transactionSlice";
import { Button } from "../ui/button";
import { DownloadSimple } from "@phosphor-icons/react";
import Link from "next/link";
import { api_url } from "@/lib/http";

export const PaymentColumn: ColumnDef<PaymentResponse>[] = [
  {
    accessorKey: "payment_id",
    header: "Payment ID",
    cell: ({ row }) => <IDTooltip idValue={row.getValue("payment_id")} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const { color, message } = getBadge(status, false, true);
      return (
        <Badge dot={false} variant={color as any}>
          {message}
        </Badge>
      );
    },
  },
  {
    accessorKey: "payment_method",
    header: "Payment Method",
    cell: ({ row }) => {
      return (
        <div className="text-left">
          {row.original.payment_method
            ? (row.getValue("payment_method") as string).toUpperCase()
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_amount"));
      const currency = row.original.currency as CurrencyCode;
      const formatted = formatCurrency(
        decodeCurrency(amount, currency),
        currency
      );
      return <div className="text-left">{formatted}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Date (UTC)",
    cell: ({ row }) => {
      const dateStr = row.getValue("created_at") as string;
      return (
        <div className="w-full">
          <div className="max-w-24">{parseIso(dateStr)}</div>
        </div>
      );
    },
  },

  {
    accessorKey: "actions",
    header: "Invoice",
    cell: ({ row }) => {
      return (
        <div className="text-left">
          <Button variant={"secondary"} key={row.original.payment_id} asChild>
            <Link
              target="_blank"
              href={`${api_url}/invoices/payments/${row.original.payment_id}`}
            >
              <DownloadSimple className="w-4 h-4 mr-2" /> Invoice
            </Link>
          </Button>
        </div>
      );
    },
  },
];
