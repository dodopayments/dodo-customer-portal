"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { getBadge } from "@/lib/badge-helper";
import InvoiceDownloadSheet from "../invoice-download-sheet";
import { api_url } from "@/lib/http";
import { OrderData } from "./orders";
import { TimeTooltip } from "@/components/custom/time-tooltip";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { CurrencyCode, decodeCurrency, formatCurrency } from "@/lib/currency-helper";

type TFunction = (key: string) => string;

export function getBillingHistoryColumns(
  t: TFunction,
  tBadge: TFunction
): ColumnDef<OrderData>[] {
  return [
    {
      id: "date",
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
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("status")} column={column} />
      ),
      cell: ({ row }) => {
        const badge = getBadge(row.original.status);
        return (
          <Badge
            variant={badge.color as BadgeVariant}
            dot={false}
            className="rounded-sm text-xs"
          >
            {tBadge(badge.messageKey)}
          </Badge>
        );
      },
      enableSorting: true,
    },
    {
      id: "amount",
      accessorKey: "total_amount",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("amount")} column={column} />
      ),
      cell: ({ row }) => {
        const currency = row.original.currency as CurrencyCode;
        return formatCurrency(
          decodeCurrency(row.original.total_amount, currency),
          currency
        );
      },
      enableSorting: true,
    },
    {
      id: "pricing-type",
      accessorKey: "subscription_id",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("pricingType")} column={column} />
      ),
      cell: ({ row }) => {
        const pricingType = row.original.subscription_id
          ? "Subscription"
          : "One_time";
        const badge = getBadge(pricingType, false, true);
        return (
          <Badge
            variant={badge.color as BadgeVariant}
            dot={false}
            className="rounded-sm text-xs"
          >
            {tBadge(badge.messageKey)}
          </Badge>
        );
      },
      enableSorting: true,
    },
    {
      id: "invoice",
      header: t("invoice"),
      cell: ({ row }) => {
        const invoiceAvailable = row.original.total_amount > 0;
        return (
          <InvoiceDownloadSheet
            paymentId={row.original.payment_id}
            downloadUrl={`${api_url}/invoices/payments/${row.original.payment_id}`}
            disabled={!invoiceAvailable}
          />
        );
      },
    },
  ];
}
