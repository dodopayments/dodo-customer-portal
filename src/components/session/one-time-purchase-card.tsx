"use client";

import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBadge } from "@/lib/badge-helper";
import { Download, File, ExternalLink } from "lucide-react";
import { api_url } from "@/lib/http";
import { CurrencyCode, formatCurrency } from "@/lib/currency-helper";
import { OneTimeData } from "./item-section";
import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { getToken } from "@/lib/server-actions";

interface DigitalProductResponse {
    product_id: string;
    name: string;
    description?: string;
    deliverable: {
        files?: Array<{
            file_id: string;
            file_name: string;
            url: string;
        }>;
        external_url?: string;
        instructions?: string;
    };
}

interface OneTimePurchaseCardProps {
    item: OneTimeData;
    cardClassName?: string;
}

export const OneTimePurchaseCard = ({ item, cardClassName }: OneTimePurchaseCardProps) => {
    const [isAttachmentsSheetOpen, setIsAttachmentsSheetOpen] = useState(false);
    const [digitalProducts, setDigitalProducts] = useState<DigitalProductResponse | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAttachmentsSheetOpen && item.digital_products_delivered && !digitalProducts) {
            fetchDigitalProducts();
        }
    }, [isAttachmentsSheetOpen, item.digital_products_delivered, digitalProducts]);

    const fetchDigitalProducts = async () => {
        try {
            const token = await getToken();
            if (!token) {
                throw new Error('No authentication token found');
            }
            setLoading(true);
            const response = await fetch(`${api_url}/customer-portal/payments/${item.payment_id}/digital-product-deliverables`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDigitalProducts(data.items[0]);
            }
        } catch (error) {
            console.error('Failed to fetch digital products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className={cardClassName}>
            <CardContent className="flex flex-row items-center px-0 gap-2">
                <Image src={'/images/login/login-img.png'} alt={'Product Image'} width={56} height={56} className="rounded-lg flex-none aspect-square object-cover" />
                <div className="flex flex-col gap-2 flex-1">
                    <div className="flex flex-row justify-between items-start gap-4">
                        <CardTitle className="font-['Hanken_Grotesk'] font-semibold text-base leading-5 flex-none">{"example product name"}</CardTitle>
                        <div className="font-['Hanken_Grotesk'] font-semibold text-base leading-5 flex-none">{"$22.00"}</div>
                    </div>
                    <CardDescription className="font-['Inter'] font-normal text-sm leading-[21px] text-text-secondary self-stretch">{"example product description"}</CardDescription>
                </div>
            </CardContent>
            <Separator className="mb-4" />
            <CardFooter className="flex flex-row justify-between p-0">
                <div className="flex flex-row gap-2">
                    {item.digital_products_delivered && (
                        <Sheet open={isAttachmentsSheetOpen} onOpenChange={setIsAttachmentsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="secondary" className="w-full">
                                    <File />
                                    Attachments
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="sm:max-w-md mx-auto">
                                <SheetHeader>
                                    <SheetTitle>Digital Products</SheetTitle>
                                    <SheetDescription>
                                        Download your digital products for 
                                    </SheetDescription>
                                </SheetHeader>
                                <Separator className="mt-4" />
                                <div className="py-4">
                                    {loading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="flex items-center space-x-2">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                                <span className="text-sm text-muted-foreground">Loading digital products...</span>
                                            </div>
                                        </div>
                                    ) : digitalProducts ? (
                                        <div className="space-y-4">
                                            {digitalProducts.deliverable?.files && digitalProducts.deliverable.files.length > 0 && (
                                                <div>
                                                    <h4 className="font-medium mb-2">Files</h4>
                                                    <div className="space-y-2">
                                                        {digitalProducts.deliverable.files.map((file) => (
                                                            <div key={file.file_id} className="flex items-center justify-between p-2 border rounded">
                                                                <div className="flex items-center gap-2">
                                                                    <File className="w-4 h-4" />
                                                                    <span className="text-sm">{file.file_name}</span>
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => window.open(file.url, '_blank')}
                                                                >
                                                                    <Download className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No digital products available.</p>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    )}
                    <Button variant="secondary" className="w-full" onClick={() => window.open(`${api_url}/invoices/payments/${item.payment_id}`, '_blank')}>
                        <Download />
                        Invoice
                    </Button>
                </div>
                <Badge variant={getBadge(item.status).color as any} dot={false} className="rounded-sm border-sm">
                    {getBadge(item.status).message}
                </Badge>
            </CardFooter>
        </Card>
    );
};
