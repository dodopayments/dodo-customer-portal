/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import IDTooltip from "../custom/turnacate-tooltip";
import { Badge } from "../ui/badge";
import { CurrencyCode, formatCurrency } from "@/lib/currency-helper";
import parseIso from "@/lib/date-helper";
import { getBadge } from "@/lib/badge-helper";

type PaymentTableType = {
  ID: string;
  Status: string;
  Currency: CurrencyCode;
  PricingType: string;
  Amount: string;
  TimeStamp: string;
  PaymentMethod: string;
  CustomerName: string;
};
export const PaymentColumn: ColumnDef<PaymentTableType>[] = [
  {
    accessorKey: "ID",
    header: "Payment ID",
    cell: ({ row }) => <IDTooltip idValue={row.getValue("ID")} />,
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("Status") as string;
      const { color, message } = getBadge(status, false, true);
      return (
        <Badge id="step6" dot={false} variant={color as any}>
          {message}
        </Badge>
      );
    },
  },
  {
    accessorKey: "PricingType",
    header: "Pricing Type",
    cell: ({ row }) => {
      const status = row.getValue("PricingType") as string;
      const { color, message } = getBadge(status, false, true);
      if (
        row.getValue("Amount") == 0 &&
        row.getValue("PricingType") == "Subscription"
      ) {
        return (
          <Badge dot={false} variant={"default"}>
            {"Mandate"}
          </Badge>
        );
      }
      return (
        <Badge dot={false} variant={color as any}>
          {message}
        </Badge>
      );
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
  {
    accessorKey: "TimeStamp",
    header: "Date (UTC)",
    cell: ({ row }) => {
      const dateStr = row.getValue("TimeStamp") as string;
      return (
        <div className="w-full">
          <div className="max-w-24">{parseIso(dateStr)}</div>
        </div>
      );
    },
  },

  {
    accessorKey: "PaymentMethod",
    header: "Payment Method",
  },

  {
    accessorKey: "CustomerName",
    header: "Customer Name",
  },
];
