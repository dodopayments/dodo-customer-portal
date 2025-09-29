/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import IDTooltip from "../custom/turnacate-tooltip";
import parseIso from "@/lib/date-helper";
import { UsageHistoryResponse } from "@/redux/slice/subscription/subscriptoinSlice";
import { CurrencyCode } from "@/lib/currency-helper";
import { formatDecodedFloatCurrency } from "@/lib/currency-helper-float";

export const UsageHistoryColumn: ColumnDef<UsageHistoryResponse>[] = [
  {
    accessorKey: "meter_id",
    header: "Meter name",
    cell: ({ row }) => (
      <div className="flex flex-col items-start gap-1">
        <span className="text-text-primary pl-1 text-sm">
          {row.original.meter_name}
        </span>
        <IDTooltip idValue={row.getValue("meter_id")} />
      </div>
    ),
  },
  {
    accessorKey: "consumed_units",
    header: "Consumed Units",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.original.consumed_units}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "chargeable_units",
    header: "Chargeable Units",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.original.chargeable_units}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "free_threshold",
    header: "Free Threshold",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">{row.original.free_threshold}</div>
      );
    },
  },
  {
    accessorKey: "price_per_unit",
    header: "Price Per Unit",
    cell: ({ row }) => {
      const currency = row.original.currency as CurrencyCode;
      return (
        <div className="flex items-center">
          {formatDecodedFloatCurrency(
            Number(row.original.price_per_unit),
            currency
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "total_price",
    header: "Total Price",
    cell: ({ row }) => {
      const currency = row.original.currency as CurrencyCode;
      return (
        <div className="flex items-center">
          {formatDecodedFloatCurrency(
            Number(row.original.total_price),
            currency
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "last_submitted_event_timestamp",
    header: "Last Event",
    cell: ({ row }) => {
      return (
        <div className="pl-3">
          {row.original.last_submitted_event_timestamp
            ? parseIso(row.original.last_submitted_event_timestamp)
            : "-"}
        </div>
      );
    },
  },
];
