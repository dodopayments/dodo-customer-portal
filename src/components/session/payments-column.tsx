/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import IDTooltip from "../custom/truncate-tooltip";
import { Badge } from "../ui/badge";
import {
  CurrencyCode,
  decodeCurrency,
  formatCurrency,
} from "@/lib/currency-helper";
import parseIso from "@/lib/date-helper";
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
    header: t("paymentId"),
    cell: ({ row }) => <IDTooltip idValue={row.getValue("payment_id")} />,
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
    accessorKey: "payment_method",
    header: t("paymentMethod"),
    cell: ({ row }) => {
      return (
        <div className="text-left">
          {row.original.payment_method
            ? (row.getValue("payment_method") as string).toUpperCase()
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: t("amount"),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_amount"));
      const currency = row.original.currency as CurrencyCode;
      const formatted = formatCurrency(
        decodeCurrency(amount, currency),
        currency,
      );
      return <div className="text-left">{formatted}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: t("date"),
    cell: ({ row }) => {
      const dateStr = row.getValue("created_at") as string;
      return (
        <div className="w-full">
          <div className="max-w-24">{parseIso(dateStr)}</div>
        </div>
      );
    },
  },

  {
    accessorKey: "actions",
    header: t("invoice"),
    cell: ({ row }) => {
      return (
        <div className="text-left">
          <Button variant={"secondary"} key={row.original.payment_id} asChild>
            <Link
              target="_blank"
              href={`${api_url}/invoices/payments/${row.original.payment_id}`}
            >
              <DownloadSimple className="w-4 h-4 mr-2" /> {t("invoiceButtonLabel")}
            </Link>
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "digital_products_delivered",
    header: t("files"),
    cell: ({ row }) => {
      if (row.original.digital_products_delivered) {
        return (
          <DigitalDeliveryDialog
            key={row.original.payment_id}
            payment_id={row.original.payment_id}
          />
        );
      } else {
        return <div className="text-left">-</div>;
      }
    },
  },
  ];
}
