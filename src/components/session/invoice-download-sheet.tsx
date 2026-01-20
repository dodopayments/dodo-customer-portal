"use client";

import { useState } from "react";
import { Button } from "../ui/button";
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

interface InvoiceDownloadSheetProps {
  paymentId: string;
  downloadUrl: string;
  buttonClassName?: string;
}

export function InvoiceDownloadSheet({
  paymentId,
  downloadUrl,
  buttonClassName,
}: InvoiceDownloadSheetProps) {
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
        <Button variant="secondary" className={buttonClassName}>
          <Download className="w-4 h-4 mr-2" /> Invoice
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 border-border-secondary rounded-xl border m-6" floating side="right">
        <SheetHeader>
          <SheetTitle className="text-left font-display font-semibold text-base leading-tight tracking-normal">
            {isFillDetailsOpen
              ? "Enter full address of customer"
              : "Generate Invoice"}
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
                  Download with existing address details
                </CardTitle>
                <CardDescription className="font-body font-normal text-xs leading-5 tracking-normal">
                  This invoice will include only your zip code and country as
                  provided during the checkout process.
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
                  <Download className="w-4 h-4 mr-2" /> Download Invoice
                </Button>
              </CardFooter>
            </Card>
            <Card className="p-5">
              <CardContent className="p-0">
                <CardTitle className="font-display font-medium text-sm tracking-normal">
                  Download with full address details
                </CardTitle>
                <CardDescription className="font-body font-normal text-xs leading-5 tracking-normal">
                  This invoice will include the complete address of the
                  customer. Please ensure you fill in all the details before
                  downloading.
                </CardDescription>
              </CardContent>
              <CardFooter className="p-0 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setIsFillDetailsOpen(true)}
                >
                  Fill Details
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


