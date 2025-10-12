/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import parseIso from "@/lib/date-helper";
import { UsageHistoryResponseByMeterId } from "@/redux/slice/subscription/subscriptoinSlice";

export const UsageHistoryByMeterIdColumn: ColumnDef<UsageHistoryResponseByMeterId>[] = [
  {
    accessorKey: "event_id",
    header: "Event ID",
    cell: ({ row }) => (
      <div className="flex flex-col items-start gap-1">
        {row.original.event_id}
      </div>
    ),
  },
  {
    accessorKey: "event_name",
    header: "Event Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.original.event_name}</span>
        </div>
      );
    },
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
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      return (
        <div className="pl-3">
          {row.original.timestamp ? parseIso(row.original.timestamp) : "-"}
        </div>
      );
    },
  },
];
