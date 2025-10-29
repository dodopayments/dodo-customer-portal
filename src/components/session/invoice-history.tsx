"use client";

import { BaseDataGrid } from "../table/BaseDataGrid";
import { ColumnDef } from "@tanstack/react-table";
import { InvoiceHistoryResponse } from "./subscription-tabs-table";
import { useMemo } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { getBadge } from "@/lib/badge-helper";
import { formatCurrency, decodeCurrency } from "@/lib/currency-helper";
import { Download } from "lucide-react";

const InvoiceColumn: ColumnDef<any>[] = [{
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
        return <div className="text-left text-text-secondary">{new Date(row.original.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "2-digit",
        })}</div>;
    },
}, {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
        return <div className="text-left text-text-secondary">{formatCurrency(decodeCurrency(row.original.amount, row.original.currency), row.original.currency)}</div>;
    },
}, {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
        return <Badge variant={getBadge(row.original.status).color as any}>{getBadge(row.original.status).message}</Badge>;
    },
}, {
    accessorKey: 'download',
    header: 'Download',
    cell: ({ row }) => {
        return <DownloadButton url={row.original.download_url} />;
    },
}];

export function InvoiceHistory({ invoiceHistory }: { invoiceHistory: InvoiceHistoryResponse[] }) {

    const data = useMemo(() => {
        return invoiceHistory.map((item) => ({
            ...item,
            download: <DownloadButton url={item.download_url} />,
        }));
    }, [invoiceHistory]);
    return <BaseDataGrid tableId="invoice-history" data={data} columns={InvoiceColumn} />
}

function DownloadButton({ url }: { url: string }) {
    return <Button variant="secondary" onClick={() => window.open(url, '_blank')}>
        <Download className="w-4 h-4 mr-2" /> Invoice
    </Button>;
}
