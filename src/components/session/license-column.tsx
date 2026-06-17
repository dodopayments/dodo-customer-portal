/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import IDTooltip from "../custom/truncate-tooltip";
import { Badge } from "../ui/badge";
import { DataGridColumnHeader } from "../ui/data-grid-column-header";
import { TimeTooltip } from "../custom/time-tooltip";
import { getBadge } from "@/lib/badge-helper";

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
      header: ({ column }) => (
        <DataGridColumnHeader title={t("licenseKey")} column={column} />
      ),
      cell: ({ row }) => <IDTooltip idValue={row.getValue("key")} />,
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("status")} column={column} />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const { color, messageKey } = getBadge(status, false, true);
        return (
          <Badge dot={false} variant={color as any}>
            {tBadge(messageKey)}
          </Badge>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "product_id",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("productId")} column={column} />
      ),
      cell: ({ row }) => <IDTooltip idValue={row.getValue("product_id")} />,
      enableSorting: true,
    },
    {
      accessorKey: "expires_at",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("expiry")} column={column} />
      ),
      cell: ({ row }) => {
        const isoDate = row.getValue("expires_at") as string;
        if (isoDate === "Never Expires" || isoDate === "Same as Subscripton") {
          return t("neverExpires");
        }
        return <TimeTooltip timeStamp={isoDate} showyear />;
      },
      enableSorting: true,
    },
    {
      accessorKey: "instances_count",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("activationsUsed")} column={column} />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "payment_id",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("paymentId")} column={column} />
      ),
      cell: ({ row }) => <IDTooltip idValue={row.getValue("payment_id")} />,
      enableSorting: true,
    },
  ];
}
