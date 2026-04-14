"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "../ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../ui/card";
import InvoiceFillDetails from "./invoice-fill-details";
import { useTranslations } from "next-intl";

interface InvoiceDownloadSheetProps {
  paymentId: string;
  downloadUrl: string;
  buttonClassName?: string;
  variant?: "default" | "icon";
  disabled?: boolean;
}

export function InvoiceDownloadSheet({
  paymentId,
  downloadUrl,
  buttonClassName,
  variant = "default",
  disabled = false,
}: InvoiceDownloadSheetProps) {
  const t = useTranslations("InvoiceDownloadSheet");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isFillDetailsOpen, setIsFillDetailsOpen] = useState(false);

  const handleDownloadComplete = () => {
    setIsSheetOpen(false);
    setIsFillDetailsOpen(false);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setIsFillDetailsOpen(false);
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="secondary"
            size="icon"
            className={cn("h-8 w-8", buttonClassName)}
            title={disabled ? t("notAvailable") : t("downloadInvoice")}
            disabled={disabled}
          >
            <Download className="w-4 h-4" />
          </Button>
        ) : (
          <Button variant="secondary" className={buttonClassName} disabled={disabled}>
            <Download className="w-4 h-4 mr-2" /> {t("invoice")}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 border-border-secondary rounded-xl border m-6" floating side="right">
        <SheetHeader>
          <SheetTitle className="text-left font-display font-semibold text-base leading-tight tracking-normal">
            {isFillDetailsOpen ? t("fillDetailsTitle") : t("generateInvoice")}
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-3" />
        {isFillDetailsOpen ? (
          <InvoiceFillDetails
            url={paymentId}
            onDownloadComplete={handleDownloadComplete}
          />
        ) : (
          <>
            <Card className="p-5">
              <CardContent className="p-0">
                <CardTitle className="font-display font-medium text-sm tracking-normal">
                  {t("existingAddressTitle")}
                </CardTitle>
                <CardDescription className="font-body font-normal text-xs leading-5 tracking-normal">
                  {t("existingAddressDescription")}
                </CardDescription>
              </CardContent>
              <CardFooter className="p-0 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    window.open(downloadUrl, "_blank");
                    handleDownloadComplete();
                  }}
                >
                  <Download className="w-4 h-4 mr-2" /> {t("downloadInvoice")}
                </Button>
              </CardFooter>
            </Card>
            <Card className="p-5">
              <CardContent className="p-0">
                <CardTitle className="font-display font-medium text-sm tracking-normal">
                  {t("fullAddressTitle")}
                </CardTitle>
                <CardDescription className="font-body font-normal text-xs leading-5 tracking-normal">
                  {t("fullAddressDescription")}
                </CardDescription>
              </CardContent>
              <CardFooter className="p-0 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setIsFillDetailsOpen(true)}
                >
                  {t("fillDetails")}
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default InvoiceDownloadSheet;


