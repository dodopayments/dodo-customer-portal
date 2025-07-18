"use client";

import { Row } from "@tanstack/react-table";
import {
  cancelSubscription,
  cancelSubscriptionLegacy,
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
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { toast } from "sonner";
import { BillingDetailsDialog } from "./billing-details-dialog";
import { CancelSubscriptionDialog } from "./cancel-subscription-dialog";
import { BillingDetailsFormValues } from "./subscription-form-schema";
import { selectBusiness } from "@/redux/slice/business/businessSlice";

interface SubscriptionActionsProps {
  row: Row<SubscriptionResponse>;
  isActive: boolean;
  isOnDemand: boolean;
}

export function SubscriptionActions({
  row,
  isActive,
  isOnDemand,
}: SubscriptionActionsProps) {
  const dispatch = useAppDispatch();
  const selectedBusiness = useAppSelector(selectBusiness);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpdateBillingDialog, setShowUpdateBillingDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const cancelAtNextBillingDate =
    row.original.cancel_at_next_billing_date || false;

  const handleCancelSubscription = async () => {
    try {
      if (!selectedBusiness?.business_id) {
        toast.error("Business information not available");
        return;
      }

      await dispatch(
        cancelSubscription({
          selectedId: selectedBusiness.business_id,
          subscription_id: row.original.subscription_id,
          nextBillingDate: false,
        })
      ).unwrap();

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

  const handleSubmit = async ({
    nextBillingDate,
    revoke,
  }: {
    nextBillingDate: boolean;
    revoke?: boolean;
  }) => {
    try {
      setLoading(true);

      if (!nextBillingDate && !revoke) {
        await dispatch(
          cancelSubscriptionLegacy(row.original.subscription_id)
        ).unwrap();
        toast.success("Your subscription has been cancelled immediately.");
      } else {
        if (!selectedBusiness?.business_id) {
          toast.error("Business information not available");
          return;
        }

        await dispatch(
          cancelSubscription({
            selectedId: selectedBusiness.business_id,
            subscription_id: row.original.subscription_id,
            nextBillingDate,
            revoke,
          })
        ).unwrap();

        if (revoke) {
          toast.success(
            "Subscription cancellation has been revoked successfully."
          );
        } else {
          toast.success(
            "Subscription will be cancelled at the end of the billing period."
          );
        }
      }

      await dispatch(
        fetchSubscriptions({
          pageSize: 10,
          pageNumber: 0,
        })
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update subscription. Please try again.");
    } finally {
      setLoading(false);
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

  if (
    row.original.status &&
    ["failed", "cancelled", "expired", "pending"].includes(row.original.status)
  ) {
    return "-";
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsThreeVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setShowUpdateBillingDialog(true)}>
            Update Billing Details
          </DropdownMenuItem>
          {isActive && (
            <>
              <DropdownMenuItem
                onClick={() => handleSubmit({ nextBillingDate: false })}
                disabled={loading}
              >
                Cancel Immediately
              </DropdownMenuItem>
              {cancelAtNextBillingDate ? (
                <DropdownMenuItem
                  onClick={() =>
                    handleSubmit({ nextBillingDate: false, revoke: true })
                  }
                  disabled={loading}
                >
                  Revoke Cancellation
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleSubmit({ nextBillingDate: true })}
                  disabled={loading}
                >
                  {isOnDemand
                    ? "Cancel at Next Charge"
                    : "Cancel at End of Period"}
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <BillingDetailsDialog
        open={showUpdateBillingDialog}
        onOpenChange={setShowUpdateBillingDialog}
        subscriptionId={row.original.subscription_id}
        initialData={row.original}
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
