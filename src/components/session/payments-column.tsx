"use client";

import { ColumnDef } from "@tanstack/react-table";
import IDTooltip from "../custom/truncate-tooltip";
import { Badge, type BadgeVariant } from "../ui/badge";
import { TimeTooltip } from "../custom/time-tooltip";
import { DataGridColumnHeader } from "../ui/data-grid-column-header";
import {
  CurrencyCode,
  decodeCurrency,
  formatCurrency,
} from "@/lib/currency-helper";
import { getBadge } from "@/lib/badge-helper";

interface PaymentResponse {
  created_at: string;
  currency: string;
  customer: {
    customer_id: string;
    email: string;
    name: string;
  };
  metadata: object;
  payment_id: string;
  brand_id: string;
  digital_products_delivered: boolean;
  payment_method: string;
  payment_method_type: string;
  status: string;
  subscription_id: string;
  total_amount: number;
}
import { Button } from "../ui/button";
import { DownloadSimple } from "@phosphor-icons/react";
import Link from "next/link";
import { api_url } from "@/lib/http";
import DigitalDeliveryDialog from "./digital-delivery-dialog";

export function getPaymentColumns(
  tBadge: (key: string) => string,
  t: (key: string) => string,
): ColumnDef<PaymentResponse>[] {
  return [
    {
      accessorKey: "payment_id",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("paymentId")} column={column} />
      ),
      cell: ({ row }) => <IDTooltip idValue={row.getValue("payment_id")} />,
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
          <Badge dot={false} variant={color as BadgeVariant}>
            {tBadge(messageKey)}
          </Badge>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "payment_method",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("paymentMethod")} column={column} />
      ),
      cell: ({ row }) =>
        row.original.payment_method
          ? (row.getValue("payment_method") as string).toUpperCase()
          : "-",
      enableSorting: true,
    },
    {
      accessorKey: "total_amount",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("amount")} column={column} />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total_amount"));
        const currency = row.original.currency as CurrencyCode;
        return formatCurrency(decodeCurrency(amount, currency), currency);
      },
      enableSorting: true,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataGridColumnHeader title={t("date")} column={column} />
      ),
      cell: ({ row }) => (
        <TimeTooltip timeStamp={row.getValue("created_at") as string} />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "actions",
      header: t("invoice"),
      cell: ({ row }) => (
        <Button variant={"secondary"} key={row.original.payment_id} asChild>
          <Link
            target="_blank"
            href={`${api_url}/invoices/payments/${row.original.payment_id}`}
          >
            <DownloadSimple className="w-4 h-4 mr-2" />{" "}
            {t("invoiceButtonLabel")}
          </Link>
        </Button>
      ),
    },
    {
      accessorKey: "digital_products_delivered",
      header: t("files"),
      cell: ({ row }) =>
        row.original.digital_products_delivered ? (
          <DigitalDeliveryDialog
            key={row.original.payment_id}
            payment_id={row.original.payment_id}
          />
        ) : (
          "-"
        ),
    },
  ];
}
