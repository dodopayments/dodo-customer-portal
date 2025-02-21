"use client";

import { Row } from "@tanstack/react-table";
import {
  cancelSubscription,
  SubscriptionResponse,
} from "@/redux/slice/subscription/subscriptoinSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { DotsThreeVertical, Warning } from "@phosphor-icons/react";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { fetchSubscriptions } from "@/redux/slice/subscription/subscriptoinSlice";
import { toast } from "sonner";
interface SubscriptionActionsProps {
  row: Row<SubscriptionResponse>;
}

export function SubscriptionActions({ row }: SubscriptionActionsProps) {
  const dispatch = useAppDispatch();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      await dispatch(cancelSubscription(row.original.subscription_id));
      await dispatch(
        fetchSubscriptions({
          pageSize: 10,
          pageNumber: 0,
        })
      );
      toast.info("Subscription cancelled successfully");
      setShowCancelDialog(false);
    } catch (error) {
      toast.error("Error cancelling subscription");
      console.error("Error cancelling subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsThreeVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowCancelDialog(true)}>
            Cancel Subscription
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-[95vw] rounded-lg  sm:max-w-[480px]">
          <div className="space-y-2">
            <DialogHeader className="mb-3 space-y-0">
              <div className="bg-bg-error-secondary p-3 w-fit h-fit rounded-full text-border-error dark:text-[#FECDCA]">
                <Warning className="w-6 h-6" />
                {/* <SmileySad className="w-6 h-6" /> */}
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
                onClick={() => setShowCancelDialog(false)}
              >
                Close
              </Button>
              <Button
                variant={"destructive"}
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
    </>
  );
}
