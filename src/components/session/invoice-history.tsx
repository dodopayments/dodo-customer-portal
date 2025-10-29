"use client";

import { BaseDataGrid } from "../table/BaseDataGrid";
import { ColumnDef } from "@tanstack/react-table";
import { InvoiceHistoryResponse } from "./subscription-tabs-table";
import { useMemo, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { getBadge } from "@/lib/badge-helper";
import { formatCurrency, decodeCurrency } from "@/lib/currency-helper";
import { Download } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { SelectNative } from "../ui/select-native";
import InvoiceFillDetails from "./invoice-fill-details";

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
        return invoiceHistory;
    }, [invoiceHistory]);
    return <BaseDataGrid tableId="invoice-history" data={data} columns={InvoiceColumn} />
}

function DownloadButton({ url }: { url: string }) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isFillDetailsOpen, setIsFillDetailsOpen] = useState(false);

    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <Button variant="secondary">
                    <Download className="w-4 h-4 mr-2" /> Invoice
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-4">
                <SheetHeader>
                    <SheetTitle className="text-left font-['Hanken_Grotesk'] font-semibold text-base leading-tight tracking-normal" style={{ leadingTrim: 'cap-height' } as React.CSSProperties}>{isFillDetailsOpen ? 'Fill Details' : 'Generate Invoice'}</SheetTitle>
                </SheetHeader>
                <Separator className="my-3" />
                {isFillDetailsOpen ? (
                    <InvoiceFillDetails url={url} />
                ) : (
                    <>
                
                <Card className="p-5">
                    <CardContent className="p-0">
                        <CardTitle className="font-['Hanken_Grotesk'] font-medium text-sm tracking-normal" style={{ leadingTrim: 'cap-height' } as React.CSSProperties}>Download with existing address details</CardTitle>
                        <CardDescription className="font-body font-normal text-xs leading-5 tracking-normal" style={{ leadingTrim: 'cap-height' } as React.CSSProperties}>
                            This invoice will include only your zip code and country as provided during the checkout process.
                        </CardDescription>
                    </CardContent>
                    <CardFooter className="p-0 mt-4">
                        <Button variant="secondary" onClick={() => window.open(url, '_blank')}>
                            <Download className="w-4 h-4 mr-2" /> Download Invoice
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="p-5">
                    <CardContent className="p-0">
                        <CardTitle className="font-['Hanken_Grotesk'] font-medium text-sm tracking-normal" style={{ leadingTrim: 'cap-height' } as React.CSSProperties}>Download with full address details</CardTitle>
                        <CardDescription className="font-body font-normal text-xs leading-5 tracking-normal" style={{ leadingTrim: 'cap-height' } as React.CSSProperties}>
                            This invoice will include your complete address. Please ensure you fill in all the details before downloading.
                        </CardDescription>
                    </CardContent>
                    <CardFooter className="p-0 mt-4">
                        <Button variant="secondary" onClick={() => setIsFillDetailsOpen(true)}>
                            Fill Details
                        </Button>
                    </CardFooter>
                </Card>
                </>)}
            </SheetContent>
        </Sheet>
    );
}
