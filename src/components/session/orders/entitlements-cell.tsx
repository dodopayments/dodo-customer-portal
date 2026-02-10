"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { KeyRound, FileMinus, Loader2, Download, Eye, EyeOff } from "lucide-react";
import { getProductCart } from "@/app/session/orders/actions";
import { ProductCartItem, LicenseKeyResponse, DigitalProductResponse } from "../product";
import { getToken } from "@/lib/server-actions";
import { api_url } from "@/lib/http";
import parseError from "@/lib/clientErrorHelper";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { getBadge } from "@/lib/badge-helper";
import { Badge, BadgeVariant } from "@/components/ui/badge";
import { parseIsoDate } from "@/lib/date-helper";
import Loading from "@/components/loading";
import { FileText } from "@phosphor-icons/react";

interface EntitlementsCellProps {
    paymentId: string;
    hasDigitalProducts: boolean;
    hasLicenseKeys: boolean;
}

export const EntitlementsCell = ({
    paymentId,
    hasDigitalProducts,
    hasLicenseKeys,
}: EntitlementsCellProps) => {
    const [productCartLoading, setProductCartLoading] = useState(false);
    const [productCart, setProductCart] = useState<ProductCartItem[] | null>(null);
    const [isLicenseSheetOpen, setIsLicenseSheetOpen] = useState(false);
    const [isAttachmentsSheetOpen, setIsAttachmentsSheetOpen] = useState(false);
    const [digitalProducts, setDigitalProducts] = useState<DigitalProductResponse | null>(null);
    const [digitalProductsLoading, setDigitalProductsLoading] = useState(false);
    const [digitalProductsError, setDigitalProductsError] = useState<string | null>(null);
    const [visibleById, setVisibleById] = useState<Record<string, boolean>>({});

    const toggleVisibility = (id: string) =>
        setVisibleById((prev) => ({ ...prev, [id]: !prev[id] }));

    const fetchProductCartData = async (): Promise<ProductCartItem[]> => {
        if (productCart) {
            return productCart;
        }

        if (productCartLoading) {
            return [];
        }

        setProductCartLoading(true);
        try {
            const cart = await getProductCart(paymentId);
            const safeCart = cart || [];
            setProductCart(safeCart);
            return safeCart;
        } catch (error) {
            parseError(error, "Failed to fetch product cart");
            setProductCart([]);
            return [];
        } finally {
            setProductCartLoading(false);
        }
    };

    useEffect(() => {
        if (!hasLicenseKeys) {
            return;
        }

        if (!isLicenseSheetOpen) {
            return;
        }

        if (!productCart && !productCartLoading) {
            fetchProductCartData();
        }
    }, [
        hasLicenseKeys,
        isLicenseSheetOpen,
        paymentId,
        productCart,
        productCartLoading,
    ]);

    const fetchDigitalProducts = async () => {
        try {
            const token = await getToken();
            if (!token) {
                throw new Error("No authentication token found");
            }
            setDigitalProductsLoading(true);
            const response = await fetch(
                `${api_url}/customer-portal/payments/${paymentId}/digital-product-deliverables`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setDigitalProducts(data.items[0]);
                setDigitalProductsError(null);
            } else {
                setDigitalProductsError("Failed to load digital products.");
            }
        } catch (error) {
            parseError(error, "Failed to fetch digital products");
            setDigitalProductsError("Failed to load digital products.");
        } finally {
            setDigitalProductsLoading(false);
        }
    };

    const allLicenseKeys: LicenseKeyResponse[] =
        productCart?.flatMap((p) => p.license_keys || []) || [];

    useEffect(() => {
        if (!isAttachmentsSheetOpen) {
            return;
        }

        if (hasDigitalProducts && !digitalProducts && !digitalProductsLoading) {
            fetchDigitalProducts();
        }
    }, [
        isAttachmentsSheetOpen,
        hasDigitalProducts,
        digitalProducts,
        digitalProductsLoading,
    ]);

    if (!hasLicenseKeys && !hasDigitalProducts) {
        return <span className="text-xs text-text-tertiary">-</span>;
    }

    return (
        <div className="flex items-center gap-2">
            {/* License Keys Button & Sheet */}
            {hasLicenseKeys && (
                <Sheet open={isLicenseSheetOpen} onOpenChange={setIsLicenseSheetOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-auto py-1.5 px-3 text-xs"
                        >
                            <KeyRound className="w-3.5 h-3.5" />
                            License key
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-md mx-auto border-border-secondary rounded-xl border m-6" floating side="right">
                        <SheetHeader>
                            <SheetTitle>License Keys</SheetTitle>
                        </SheetHeader>
                        <Separator className="my-4" />
                        {productCartLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span className="text-sm text-text-secondary">Loading license keys...</span>
                                </div>
                            </div>
                        ) : allLicenseKeys.length > 0 ? (
                            <div className="space-y-4">
                                {allLicenseKeys.map((licenseKey: LicenseKeyResponse) => {
                                    const isVisible = !!visibleById[licenseKey.id];
                                    return (
                                        <Card key={licenseKey.id} className="p-4">
                                            <CardHeader className="p-0 pb-3">
                                                <CardTitle className="text-base">License Key</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
                                                    <p className="text-sm font-medium text-text-secondary">
                                                        {isVisible ? (
                                                            <span className="font-mono text-text-primary">
                                                                {licenseKey.key}
                                                            </span>
                                                        ) : (
                                                            <span className="italic">
                                                                Click to view license key
                                                            </span>
                                                        )}
                                                    </p>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-text-secondary"
                                                        onClick={() => toggleVisibility(licenseKey.id)}
                                                        aria-label={isVisible ? "Hide license key" : "Show license key"}
                                                    >
                                                        {isVisible ? (
                                                            <EyeOff className="w-5 h-5" />
                                                        ) : (
                                                            <Eye className="w-5 h-5" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="flex flex-row justify-between p-0 pt-3">
                                                <Badge
                                                    variant={getBadge(licenseKey.status, false, true).color as BadgeVariant}
                                                >
                                                    {getBadge(licenseKey.status, false, true).message}
                                                </Badge>
                                                <p className="text-sm text-text-secondary">
                                                    Expires {parseIsoDate(licenseKey.expires_at)}
                                                </p>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-text-secondary">No license keys available.</p>
                        )}
                    </SheetContent>
                </Sheet>
            )}

            {hasDigitalProducts && (
                <Sheet open={isAttachmentsSheetOpen} onOpenChange={setIsAttachmentsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-auto py-1.5 px-3 text-xs"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            Attachment
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-md mx-auto border-border-secondary rounded-xl border m-6" floating side="right">
                        <SheetHeader>
                            <SheetTitle>Digital Products</SheetTitle>
                            <SheetDescription>
                                Download your digital products
                            </SheetDescription>
                        </SheetHeader>
                        <Separator className="mt-4" />
                        <div className="py-4">
                            {digitalProductsError && (
                                <p className="text-sm text-destructive mb-3">{digitalProductsError}</p>
                            )}
                            {digitalProductsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                  <Loading />
                                </div>
                            ) : (
                                (() => {
                                    const deliverable = digitalProducts?.deliverable;
                                    const files = deliverable?.files ?? [];
                                    const hasFiles = files.length > 0;
                                    const externalUrl = deliverable?.external_url;
                                    const instructions = deliverable?.instructions;

                                    if (!digitalProducts || (!hasFiles && !externalUrl && !instructions)) {
                                        return (
                                            <p className="text-sm text-text-secondary">
                                                No digital products available.
                                            </p>
                                        );
                                    }

                                    return (
                                        <div className="space-y-6">
                                            {hasFiles && (
                                                <div>
                                                    <h4 className="font-medium mb-2">Files</h4>
                                                    <div className="space-y-2">
                                                        {files.map((file) => (
                                                            <div
                                                                key={file.file_id}
                                                                className="flex items-center justify-between p-2 border rounded"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <FileMinus className="w-4 h-4" />
                                                                    <span className="text-sm">{file.file_name}</span>
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => window.open(file.url, "_blank")}
                                                                >
                                                                    <Download className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {externalUrl && (
                                                <div>
                                                    <h4 className="font-medium mb-2">External link</h4>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => window.open(externalUrl, "_blank")}
                                                    >
                                                        Open
                                                    </Button>
                                                </div>
                                            )}

                                            {instructions && (
                                                <div>
                                                    <h4 className="font-medium mb-2">Instructions</h4>
                                                    <p className="text-sm text-text-secondary whitespace-pre-line">
                                                        {instructions}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    );
};
