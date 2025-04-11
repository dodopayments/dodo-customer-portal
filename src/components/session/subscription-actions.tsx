"use client";

import { Row } from "@tanstack/react-table";
import {
  cancelSubscription,
  SubscriptionResponse,
  fetchSubscriptions,
  updateBillingDetails,
} from "@/redux/slice/subscription/subscriptoinSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useState } from "react";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { toast } from "sonner";
import { BillingDetailsDialog } from "./billing-details-dialog";
import { CancelSubscriptionDialog } from "./cancel-subscription-dialog";
import { BillingDetailsFormValues } from "./subscription-form-schema";

interface SubscriptionActionsProps {
  row: Row<SubscriptionResponse>;
  isActive: boolean;
}

export function SubscriptionActions({
  row,
  isActive,
}: SubscriptionActionsProps) {
  const dispatch = useAppDispatch();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpdateBillingDialog, setShowUpdateBillingDialog] = useState(false);

  const handleCancelSubscription = async () => {
    try {
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
    }
  };

  const onBillingSubmit = async (data: BillingDetailsFormValues) => {
    try {
      await dispatch(
        updateBillingDetails({
          subscription_id: row.original.subscription_id,
          data: {
            billing: {
              city: data.city,
              country: data.country,
              state: data.state,
              street: data.addressLine,
              zipcode: data.postalCode,
            },
            tax_id: data.taxId || null,
          },
        })
      ).unwrap();
      toast.success("Billing details updated successfully");
      setShowUpdateBillingDialog(false);
    } catch {
      return;
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
          <DropdownMenuItem onClick={() => setShowUpdateBillingDialog(true)}>
            Update Billing Details
          </DropdownMenuItem>
          {isActive && (
            <DropdownMenuItem onClick={() => setShowCancelDialog(true)}>
              Cancel Subscription
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <BillingDetailsDialog
        open={showUpdateBillingDialog}
        onOpenChange={setShowUpdateBillingDialog}
        subscriptionId={row.original.subscription_id}
        initialName={row.original.customer.name}
        onSubmit={onBillingSubmit}
      />

      <CancelSubscriptionDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={handleCancelSubscription}
      />
    </>
  );
}
