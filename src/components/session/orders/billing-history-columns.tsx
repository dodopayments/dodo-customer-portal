"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { getBadge } from "@/lib/badge-helper";
import InvoiceDownloadSheet from "../invoice-download-sheet";
import { api_url } from "@/lib/http";
import { OrderData } from "./orders";
import { EntitlementsCell } from "./entitlements-cell";
import { TimeTooltip } from "@/components/custom/time-tooltip";

export const BillingHistoryColumns: ColumnDef<OrderData>[] = [
    {
        id: "date",
        accessorKey: "created_at",
        header: "Date",
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
        header: "Status",
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
        id: "pricing-type",
        accessorKey: "subscription_id",
        header: "Pricing Type",
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
        header: "Entitlements",
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
        header: () => <div className="text-right">Invoice</div>,
        cell: ({ row }) => {
            return (
                <div className="flex justify-end">
                    <InvoiceDownloadSheet
                        paymentId={row.original.payment_id}
                        downloadUrl={`${api_url}/invoices/payments/${row.original.payment_id}`}
                        variant="icon"
                    />
                </div>
            );
        },
    },
];
