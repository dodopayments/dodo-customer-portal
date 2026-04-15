"use client";

import { useState, useEffect, useCallback } from "react";
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
import { useTranslations, useLocale } from "next-intl";

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
    const t = useTranslations("Entitlements");
    const tBadge = useTranslations("BadgeStatus");
    const locale = useLocale();
    const [visibleById, setVisibleById] = useState<Record<string, boolean>>({});

    const toggleVisibility = (id: string) =>
        setVisibleById((prev) => ({ ...prev, [id]: !prev[id] }));

    const fetchProductCartData = useCallback(async (): Promise<ProductCartItem[]> => {
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
            parseError(error, t("fetchCartFailed"));
            setProductCart([]);
            return [];
        } finally {
            setProductCartLoading(false);
        }
    }, [productCart, productCartLoading, paymentId, t]);

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
        fetchProductCartData,
    ]);

    const fetchDigitalProducts = useCallback(async () => {
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
                setDigitalProductsError(t("loadFailed"));
            }
        } catch (error) {
            parseError(error, t("fetchDigitalFailed"));
            setDigitalProductsError(t("loadFailed"));
        } finally {
            setDigitalProductsLoading(false);
        }
    }, [paymentId, t]);

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
        fetchDigitalProducts,
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
                            {t("licenseKeyButton")}
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-md mx-auto border-border-secondary rounded-xl border m-6" floating side="right">
                        <SheetHeader>
                            <SheetTitle>{t("licenseKeysTitle")}</SheetTitle>
                        </SheetHeader>
                        <Separator className="my-4" />
                        {productCartLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span className="text-sm text-text-secondary">{t("loadingLicenseKeys")}</span>
                                </div>
                            </div>
                        ) : allLicenseKeys.length > 0 ? (
                            <div className="space-y-4">
                                {allLicenseKeys.map((licenseKey: LicenseKeyResponse) => {
                                    const isVisible = !!visibleById[licenseKey.id];
                                    return (
                                        <Card key={licenseKey.id} className="p-4">
                                            <CardHeader className="p-0 pb-3">
                                                <CardTitle className="text-base">{t("licenseKeyCardTitle")}</CardTitle>
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
                                                                {t("clickToView")}
                                                            </span>
                                                        )}
                                                    </p>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-text-secondary"
                                                        onClick={() => toggleVisibility(licenseKey.id)}
                                                        aria-label={isVisible ? t("hideLicenseKey") : t("showLicenseKey")}
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
                                                    {tBadge(getBadge(licenseKey.status, false, true).messageKey)}
                                                </Badge>
                                                <p className="text-sm text-text-secondary">
                                                    {t("expires")} {parseIsoDate(licenseKey.expires_at, locale)}
                                                </p>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-text-secondary">{t("noLicenseKeys")}</p>
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
                            {t("attachmentButton")}
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-md mx-auto border-border-secondary rounded-xl border m-6" floating side="right">
                        <SheetHeader>
                            <SheetTitle>{t("digitalProductsTitle")}</SheetTitle>
                            <SheetDescription>
                                {t("digitalProductsDescription")}
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
                                                {t("noDigitalProducts")}
                                            </p>
                                        );
                                    }

                                    return (
                                        <div className="space-y-6">
                                            {hasFiles && (
                                                <div>
                                                    <h4 className="font-medium mb-2">{t("filesSection")}</h4>
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
                                                    <h4 className="font-medium mb-2">{t("externalLink")}</h4>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => window.open(externalUrl, "_blank")}
                                                    >
                                                        {t("open")}
                                                    </Button>
                                                </div>
                                            )}

                                            {instructions && (
                                                <div>
                                                    <h4 className="font-medium mb-2">{t("instructionsSection")}</h4>
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
