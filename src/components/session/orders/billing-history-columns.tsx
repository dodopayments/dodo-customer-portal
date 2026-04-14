"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { getBadge } from "@/lib/badge-helper";
import InvoiceDownloadSheet from "../invoice-download-sheet";
import { api_url } from "@/lib/http";
import { OrderData } from "./orders";
import { EntitlementsCell } from "./entitlements-cell";
import { TimeTooltip } from "@/components/custom/time-tooltip";
import { CurrencyCode, decodeCurrency, formatCurrency } from "@/lib/currency-helper";

type TFunction = (key: string) => string;

export function getBillingHistoryColumns(t: TFunction): ColumnDef<OrderData>[] {
  return [
    {
        id: "date",
        accessorKey: "created_at",
        header: t("date"),
        cell: ({ row }) => {
            return (
                <TimeTooltip
                    timeStamp={row.original.created_at}
                    className="text-sm text-text-primary font-medium"
                    triggerFormat="shortDate"
                />
            );
        },
    },
    {
        id: "status",
        accessorKey: "status",
        header: t("status"),
        cell: ({ row }) => {
            const badge = getBadge(row.original.status);
            return (
                <Badge
                    variant={badge.color as BadgeVariant}
                    dot={false}
                    className="rounded-sm text-xs"
                >
                    {badge.message}
                </Badge>
            );
        },
    },
    {
        id: "amount",
        accessorKey: "total_amount",
        header: t("amount"),
        cell: ({ row }) => {
            const currency = row.original.currency as CurrencyCode;
            const formatted = formatCurrency(
                decodeCurrency(row.original.total_amount, currency),
                currency,
            );
            return <div className="text-left">{formatted}</div>;
        },
    },
    {
        id: "pricing-type",
        accessorKey: "subscription_id",
        header: t("pricingType"),
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
                    {badge.message}
                </Badge>
            );
        },
    },
    {
        id: "entitlements",
        accessorKey: "digital_products_delivered",
        header: t("entitlements"),
        cell: ({ row }) => {
            return (
                <EntitlementsCell
                    paymentId={row.original.payment_id}
                    hasDigitalProducts={row.original.digital_products_delivered}
                    hasLicenseKeys={row.original.has_license_key}
                />
            );
        },
    },
    {
        id: "invoice",
        header: () => <div className="text-right">{t("invoice")}</div>,
        cell: ({ row }) => {
            const invoiceAvailable = row.original.total_amount > 0;
            return (
                <div className="flex justify-end">
                    <InvoiceDownloadSheet
                        paymentId={row.original.payment_id}
                        downloadUrl={`${api_url}/invoices/payments/${row.original.payment_id}`}
                        variant="icon"
                        disabled={!invoiceAvailable}
                    />
                </div>
            );
        },
    },
  ];
}
