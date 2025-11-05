"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { UsageHistoryMeter } from "./subscription-tabs-table";
import { getCurrencySymbol, decodeFloatCurrency } from "@/lib/currency-helper";

export function UsageHistoryColumns(): ColumnDef<UsageHistoryMeter>[] {
  return [
    {
      id: "name",
      header: ({ column }) => (
        <DataGridColumnHeader
          title="Meter Name"
          visibility={true}
          column={column}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium text-text-primary">
            {row.original.name}
          </div>
        );
      },
      enableSorting: true,
      enableColumnFilter: true,
      size: 200,
    },
    {
      id: "consumed_units",
      header: ({ column }) => (
        <DataGridColumnHeader
          title="Consumed Units"
          visibility={true}
          column={column}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium text-text-primary">
            {row.original.consumed_units}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
      size: 150,
    },
    {
      id: "chargeable_units",
      header: ({ column }) => (
        <DataGridColumnHeader
          title="Chargeable Units"
          visibility={true}
          column={column}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium text-text-primary">
            {row.original.chargeable_units}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
      size: 120,
    },
    {
      id: "free_threshold",
      header: ({ column }) => (
        <DataGridColumnHeader
          title="Free Threshold"
          visibility={true}
          column={column}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium text-text-primary">
            {row.original.free_threshold} units
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
      size: 120,
    },
    {
      id: "price_per_unit",
      header: ({ column }) => (
        <DataGridColumnHeader
          title="Unit Price"
          visibility={true}
          column={column}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium text-text-primary">
            {getCurrencySymbol(row.original.currency)}{" "}
            {decodeFloatCurrency({
              value: Number(row.original.price_per_unit),
              currency: row.original.currency,
            })}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
      size: 120,
    },
    {
      id: "total_price",
      header: ({ column }) => (
        <DataGridColumnHeader
          title="Total Cost"
          visibility={true}
          column={column}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium text-text-primary">
            {getCurrencySymbol(row.original.currency)}{" "}
            {decodeFloatCurrency({
              value: Number(row.original.total_price),
              currency: row.original.currency,
            })}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
      size: 120,
    },
  ];
}

