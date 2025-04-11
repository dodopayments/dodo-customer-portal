"use client";

import { useState } from "react";
import { Warning } from "@phosphor-icons/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function CancelSubscriptionDialog({
  open,
  onOpenChange,
  onConfirm,
}: CancelSubscriptionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] rounded-lg sm:max-w-[480px]">
        <div className="space-y-2">
          <DialogHeader className="mb-3 space-y-0">
            <div className="bg-bg-error-secondary p-3 w-fit h-fit rounded-full text-border-error dark:text-[#FECDCA]">
              <Warning className="w-6 h-6" />
            </div>
            <DialogTitle className="pt-4">
              Are you certain you want to cancel your subscription to this
              service?
            </DialogTitle>
            <DialogDescription>
              Once you proceed, you will lose access to all associated
              benefits and this action cannot be reversed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 flex flex-row pt-4 w-full sm:gap-0">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Cancelling..." : "Cancel"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
} 