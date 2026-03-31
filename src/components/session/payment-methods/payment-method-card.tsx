"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import parseError from "@/lib/clientErrorHelper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { PaymentMethodItem } from "@/app/session/payment-methods/type";
import {
  getPaymentMethodLogoUrl,
  getPaymentMethodDisplayName,
} from "./payment-method-logo";
import { deletePaymentMethod } from "@/app/session/payment-methods/action";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethodItem;
}

export function PaymentMethodCard({ paymentMethod }: PaymentMethodCardProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const logo = getPaymentMethodLogoUrl(
    paymentMethod.payment_method_type,
    paymentMethod.payment_method,
    paymentMethod.card?.card_network,
    paymentMethod.card?.card_type,
  );
  const displayName = getPaymentMethodDisplayName(paymentMethod);
  const isCard = paymentMethod.payment_method === "card";
  const card = paymentMethod.card;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deletePaymentMethod(paymentMethod.payment_method_id);
      toast.success("Payment method removed");
      setOpen(false);
      router.refresh();
    } catch (error) {
      parseError(error, "Failed to remove payment method");
      setOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-bg-secondary/30 transition-colors group">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Logo */}
              <div className="border border-border-secondary rounded-md p-2 flex items-center justify-center w-12 h-9 bg-bg-primary">
                {logo?.type === "url" && logo.url ? (
                  <Image
                    src={logo.url}
                    alt={displayName}
                    width={32}
                    height={24}
                    className="object-contain"
                    unoptimized
                  />
                ) : logo?.type === "icon" && logo.Icon ? (
                  <logo.Icon
                    size={28}
                    className="text-text-primary"
                    weight="regular"
                  />
                ) : (
                  <div className="w-8 h-6 bg-muted rounded flex items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground">
                      {displayName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-primary">
                  {displayName}
                  {isCard && card?.card_network && (
                    <span className="text-text-secondary ml-2">
                      {card.card_network}
                    </span>
                  )}
                </span>
                {isCard && card?.last4_digits && (
                  <span className="text-xs text-text-secondary">
                    •••• {card.last4_digits}
                  </span>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(true)}
              title="Remove payment method"
              className="flex-shrink-0 h-7 w-7 text-text-tertiary hover:text-text-primary hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove payment method</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this payment method? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
