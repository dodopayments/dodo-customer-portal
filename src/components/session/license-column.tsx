/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import IDTooltip from "../custom/truncate-tooltip";
import { Badge } from "../ui/badge";
import { getBadge } from "@/lib/badge-helper";
import parseIso from "@/lib/date-helper";

interface LicenseResponse {
  activations_limit: number;
  business_id: string;
  created_at: string;
  customer_id: string;
  expires_at: string;
  id: string;
  instances_count: number;
  key: string;
  payment_id: string;
  product_id: string;
  status: string;
  subscription_id: string;
}

export const LicenseColumn: ColumnDef<LicenseResponse>[] = [
  {
    accessorKey: "key",
    header: "License Key",
    cell: ({ row }) => (
      <div className="flex items-center">
        <IDTooltip idValue={row.getValue("key")} />
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
    accessorKey: "product_id",
    header: "Product Id",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <IDTooltip idValue={row.getValue("product_id")} />
        </div>
      );
    },
  },
  {
    accessorKey: "expires_at",
    header: "Expiry (UTC)",
    cell: ({ row }) => {
      const isoDate = row.getValue("expires_at") as string;
      if (isoDate == "Never Expires" || isoDate == "Same as Subscripton") {
        return <div className="pl-3">{isoDate}</div>;
      }
      return <div className="pl-3">{parseIso(isoDate)}</div>;
    },
  },
  {
    accessorKey: "instances_count",
    header: "Activations used",
  },
  {
    accessorKey: "payment_id",
    header: "Payment Id",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <IDTooltip idValue={row.getValue("payment_id")} />
        </div>
      );
    },
  },
];
