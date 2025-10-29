"use client";

import { BaseDataGrid } from "../table/BaseDataGrid";
import { ColumnDef } from "@tanstack/react-table";
import { UsageHistoryMeter, UsageHistoryResponse } from "./subscription-tabs-table";
import { useMemo } from "react";
import { CurrencyCode, decodeCurrency, formatCurrency } from "@/lib/currency-helper";


const UsageSummaryColumn: ColumnDef<any>[] = [{
    accessorKey: 'start_date',
    header: 'Date',
    cell: ({ row }) => {
        return <div className="text-left text-text-secondary">{new Date(row.original.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "2-digit",
        })}</div>;
    },
}, {
    accessorKey: 'meter',
    header: 'Meter',
    cell: ({ row }) => {
        return <div className="text-left text-text-secondary">{row.original.name}</div>;
    },
}, {
    accessorKey: 'threshold_units',
    header: 'Threshold Units',
    cell: ({ row }) => {
        return <div className="text-left text-text-secondary">{row.original.free_threshold}</div>;
    },
}, {
    accessorKey: 'unit_price',
    header: 'Unit Price',
    cell: ({ row }) => {
        return <div className="text-left text-text-secondary">{row.original.price_per_unit}</div>;
    },
}, {
    accessorKey: 'fixed_fee',
    header: 'Fixed Fee',
    cell: ({ row }) => {
        return <div className="text-left text-text-secondary">{row.original.chargeable_units}</div>;
    },
}, {
    accessorKey: 'usage',
    header: 'Usage (units & $)',
    cell: ({ row }) => {
        return <div className="flex flex-col text-left text-text-secondary">
            <div className="text-left text-text-primary">{formatCurrency(decodeCurrency(row.original.total_price, row.original.currency as CurrencyCode | null | undefined), row.original.currency as CurrencyCode | null | undefined)}</div>
            <div className="text-left text-text-secondary">{row.original.consumed_units} units</div>
        </div>;
    },
}];

export function UsageSummary({ usageHistory }: { usageHistory: UsageHistoryResponse[] }) {

    const data = useMemo(() => {
        return usageHistory;
    }, [usageHistory]);
    return <BaseDataGrid tableId="usage-summary" data={data} columns={UsageSummaryColumn} />
}
