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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { SubscriptionActions } from "./subscription-actions";
import { Info } from "@phosphor-icons/react";

export const createSubscriptionColumns = (): ColumnDef<SubscriptionResponse>[] => [
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
      const cancel_at_next_billing_date =
        row.original.cancel_at_next_billing_date;
      if (
        cancel_at_next_billing_date &&
        !["failed", "cancelled", "expired", "pending"].includes(status)
      ) {
        return (
          <Badge dot={false} variant="default">
            Scheduled for cancellation
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
    accessorKey: "recurring_pre_tax_amount",
    header: "Subscription Amount",
    cell: ({ row }) => {
      const recurring_pre_tax_amount = row.getValue(
        "recurring_pre_tax_amount"
      ) as number;
      const currency = row.original.currency as CurrencyCode;
      if (row.original.on_demand) {
        return (
          <div className="flex items-center gap-2">
            <span className="text-text-secondary">Billed On Demand</span>
            <Popover>
              <PopoverTrigger asChild>
                <Info className="w-3 h-3 text-text-primary hover:text-text-secondary cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="w-[360px] rounded-xl flex flex-col gap-2 p-3">
                <span className="font-semibold text-sm">
                  On Demand Subscription
                </span>
                <ul className="list-disc text-text-secondary pl-4 text-xs space-y-2">
                  <li>
                    By choosing this on-demand subscription, you&apos;ll be
                    charged for what you use by your merchant—no fixed payment
                    and schedule.
                  </li>
                  <li>
                    You can check all charges and invoices in Billing History.
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        );
      }
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
            {row.original.on_demand
              ? "-"
              : `Every ${count} ${interval + (count > 1 ? "s" : "")}`}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "next_billing_date",
    header: "Next Billing Date",
    cell: ({ row }) => {
      const next_billing_date = row.getValue("next_billing_date") as string;
      return (
        <div className="pl-3">
          {row.original.on_demand ? "-" : parseIso(next_billing_date)}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <SubscriptionActions
            isOnDemand={row.original.on_demand}
            isActive={row.original.status === "active"}
            row={row}
          />
        </div>
      );
    },
  },
];

// Default export for backward compatibility
export const SubscriptionColumn = createSubscriptionColumns();
