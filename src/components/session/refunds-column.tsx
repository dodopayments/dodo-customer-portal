"use client";

import { ColumnDef } from "@tanstack/react-table";
import IDTooltip from "../custom/truncate-tooltip";
import { Badge, type BadgeVariant } from "../ui/badge";
import { DataGridColumnHeader } from "../ui/data-grid-column-header";
import {
  CurrencyCode,
  decodeCurrency,
  formatCurrency,
} from "@/lib/currency-helper";
import { getBadge } from "@/lib/badge-helper";
import { TimeTooltip } from "../custom/time-tooltip";

export interface RefundResponse {
  amount: number | null;
  business_id: string;
  created_at: string;
  currency: string | null;
  payment_id: string;
  reason: string | null;
  refund_id: string;
  status: string;
}

type TFunction = (key: string) => string;

export function getRefundColumns(
  t: TFunction,
  tBadge: TFunction
): ColumnDef<RefundResponse>[] {
  return [
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("date")} column={column} />
      ),
      cell: ({ row }) => (
        <TimeTooltip
          timeStamp={row.original.created_at}
          className="text-sm text-text-primary font-medium"
          showyear
        />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("status")} column={column} />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const badge = getBadge(status);
        return (
          <Badge dot={false} variant={badge.color as BadgeVariant}>
            {tBadge(badge.messageKey)}
          </Badge>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("amount")} column={column} />
      ),
      cell: ({ row }) => {
        const amount = row.original.amount;
        const currency = row.original.currency;
        if (amount === null || currency === null) return "-";
        const currencyCode = currency as CurrencyCode;
        return formatCurrency(
          decodeCurrency(amount, currencyCode),
          currencyCode
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "refund_id",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("refundId")} column={column} />
      ),
      cell: ({ row }) => <IDTooltip idValue={row.getValue("refund_id")} />,
      enableSorting: true,
    },
    {
      accessorKey: "payment_id",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("associatedPayment")} column={column} />
      ),
      cell: ({ row }) => <IDTooltip idValue={row.getValue("payment_id")} />,
      enableSorting: true,
    },
  ];
}
