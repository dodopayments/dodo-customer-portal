/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import IDTooltip from "../custom/turnacate-tooltip";
import { Badge } from "../ui/badge";
import { getBadge } from "@/lib/badge-helper";
import parseIso from "@/lib/date-helper";
import { SubscriptionResponse } from "@/redux/slice/subscription/subscriptoinSlice";
import {
  CurrencyCode,
  decodeCurrency,
  formatCurrency,
} from "@/lib/currency-helper";

import { SubscriptionActions } from "./subscription-actions";

export const SubscriptionColumn: ColumnDef<SubscriptionResponse>[] = [
  {
    accessorKey: "subscription_id",
    header: "Subscription ID",
    cell: ({ row }) => (
      <div className="flex items-center">
        <IDTooltip idValue={row.getValue("subscription_id")} />
      </div>
    ),
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
    accessorKey: "recurring_pre_tax_amount",
    header: "Amount",
    cell: ({ row }) => {
      const recurring_pre_tax_amount = row.getValue(
        "recurring_pre_tax_amount"
      ) as number;
      const currency = row.original.currency as CurrencyCode;
      return (
        <div className="flex items-center">
          {formatCurrency(
            decodeCurrency(recurring_pre_tax_amount, currency),
            currency
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "payment_frequency_interval",
    header: "Frequency",
    cell: ({ row }) => {
      const count = row.original.payment_frequency_count;
      const interval = row.original.payment_frequency_interval;
      return (
        <div className="flex items-center">
          <span className="text-text-secondary">
            Every {count} {interval + (count > 1 ? "s" : "")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "next_billing_date",
    header: "Renews On",
    cell: ({ row }) => {
      const next_billing_date = row.getValue("next_billing_date") as string;
      return <div className="pl-3">{parseIso(next_billing_date)}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return row.original.status === "active" ? (
        <div className="flex items-center">
          <SubscriptionActions row={row} />
        </div>
      ) : (
        <div className="flex  w-full items-center pl-[13px] justify-start">
          <span className="text-text-secondary">-</span>
        </div>
      );
    },
  },
];
