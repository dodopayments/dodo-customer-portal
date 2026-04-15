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

export function getLicenseColumns(
  tBadge: (key: string) => string,
  t: (key: string) => string,
): ColumnDef<LicenseResponse>[] {
  return [
  {
    accessorKey: "key",
    header: t("licenseKey"),
    cell: ({ row }) => (
      <div className="flex items-center">
        <IDTooltip idValue={row.getValue("key")} />
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: t("status"),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const { color, messageKey } = getBadge(status, false, true);
      return (
        <Badge dot={false} variant={color as any}>
          {tBadge(messageKey)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "product_id",
    header: t("productId"),
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
    header: t("expiry"),
    cell: ({ row }) => {
      const isoDate = row.getValue("expires_at") as string;
      if (isoDate === "Never Expires" || isoDate === "Same as Subscripton") {
        return <div className="pl-3">{t("neverExpires")}</div>;
      }
      return <div className="pl-3">{parseIso(isoDate)}</div>;
    },
  },
  {
    accessorKey: "instances_count",
    header: t("activationsUsed"),
  },
  {
    accessorKey: "payment_id",
    header: t("paymentId"),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <IDTooltip idValue={row.getValue("payment_id")} />
        </div>
      );
    },
  },
  ];
}
