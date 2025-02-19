/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import IDTooltip from "../custom/turnacate-tooltip";
import { Badge } from "../ui/badge";
import { getBadge } from "@/lib/badge-helper";
import parseIso from "@/lib/date-helper";

type LicenseTableType = {
  LicenseId: string;
  Status: string;
  ProductId: string;
  Expiry: string;
  ProductType: string;
  CustomerId: string;
};

export const LicenseColumn: ColumnDef<LicenseTableType>[] = [
  {
    accessorKey: "LicenseId",
    header: "License ID",
    cell: ({ row }) => (
      <div className="flex items-center">
        <IDTooltip idValue={row.getValue("LicenseId")} />
      </div>
    ),
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("Status") as string;
      const { color, message } = getBadge(status, false, true);
      return (
        <Badge dot={false} variant={color as any}>
          {message}
        </Badge>
      );
    },
  },
  {
    accessorKey: "ProductId",
    header: "Product Id",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <IDTooltip idValue={row.getValue("ProductId")} />
        </div>
      );
    },
  },
  {
    accessorKey: "Expiry",
    header: "Expiry (UTC)",
    cell: ({ row }) => {
      const isoDate = row.getValue("Expiry") as string;
      if (isoDate == "Never Expires" || isoDate == "Same as Subscripton") {
        return <div className="pl-3">{isoDate}</div>;
      }
      return <div className="pl-3">{parseIso(isoDate)}</div>;
    },
  },
  {
    accessorKey: "ProductType",
    header: "Product Type",
    cell: ({ row }) => {
      const status = row.getValue("ProductType") as string;
      const { color, message } = getBadge(status, false, true);
      return (
        <Badge dot={false} variant={color as any}>
          {message}
        </Badge>
      );
    },
  },
  {
    accessorKey: "CustomerId",
    header: "Customer Id",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <IDTooltip idValue={row.getValue("CustomerId")} />
        </div>
      );
    },
  },
];
