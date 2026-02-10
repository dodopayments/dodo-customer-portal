"use client";

import { AlertCircle, Clock, Zap, Info } from "lucide-react";
import type { BadgeVariant } from "@/components/ui/badge";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SubscriptionData } from "./subscriptions/subscriptions";

export type SubscriptionNoteType = "warning" | "error" | "info";

export interface SubscriptionNote {
    type: SubscriptionNoteType;
    message: string;
    icon: React.ReactNode;
}

/**
 * Generates contextual notes for a subscription based on its state.
 * Notes are prioritized: errors > warnings > info
 */
export function getSubscriptionNotes(
    subscription: SubscriptionData,
    businessName?: string
): SubscriptionNote[] {
    const notes: SubscriptionNote[] = [];

    // On Hold - failed payment
    if (subscription.status === "on_hold") {
        notes.push({
            type: "error",
            message:
                "Your subscription is currently on hold due to a failed payment. Please update your payment method to resume this subscription",
            icon: <AlertCircle className="w-4 h-4 flex-shrink-0" />,
        });
    }

    // Failed subscription
    if (subscription.status === "failed") {
        notes.push({
            type: "error",
            message:
                "This subscription has failed. Please try again.",
            icon: <AlertCircle className="w-4 h-4 flex-shrink-0" />,
        });
    }

    // Pending - payment not completed (incomplete checkout)
    if (
        subscription.status === "pending"
    ) {
        notes.push({
            type: "info",
            message:
                "Your payment wasn't completed and checkout was left unfinished. If you'd like to subscribe, please try again.",
            icon: <Info className="w-4 h-4 flex-shrink-0" />,
        });
    }

    // Scheduled for cancellation
    if (
        subscription.cancel_at_next_billing_date &&
        subscription.status !== "cancelled"
    ) {
        const cancellationDate = subscription.next_billing_date
            ? new Date(subscription.next_billing_date).toLocaleDateString("en-GB")
            : "the next billing date";

        notes.push({
            type: "warning",
            message: `Your subscription is currently scheduled for cancellation on ${cancellationDate}.`,
            icon: <Clock className="w-4 h-4 flex-shrink-0" />,
        });
    }

    // Flexible/On-demand pricing info
    if (subscription.on_demand && subscription.status === "active") {
        const name = businessName || "the merchant";
        notes.push({
            type: "info",
            message: `This is a flexible subscription, so ${name} may adjust the price for your next billing cycle.`,
            icon: <Zap className="w-4 h-4 flex-shrink-0" />,
        });
    }

    // Active discount applied
    if (
        subscription.discount_id &&
        subscription.discount_cycles_remaining &&
        subscription.discount_cycles_remaining > 0
    ) {
        notes.push({
            type: "info",
            message: `Discount applied for ${subscription.discount_cycles_remaining} more billing cycle${subscription.discount_cycles_remaining > 1 ? "s" : ""}.`,
            icon: <Info className="w-4 h-4 flex-shrink-0" />,
        });
    }


    // Cancellation date info
    if (subscription.status === "cancelled" && subscription.cancelled_at) {
        const cancelledDate = new Date(subscription.cancelled_at).toLocaleDateString("en-GB");
        notes.push({
            type: "error",
            message: `This subscription was cancelled on ${cancelledDate}.`,
            icon: <Clock className="w-4 h-4 flex-shrink-0" />,
        });
    }

    // Expiration info
    if (subscription.status === "expired") {
        notes.push({
            type: "info",
            message: "This subscription has expired.",
            icon: <Clock className="w-4 h-4 flex-shrink-0" />,
        });
    }

    return notes;
}

const INFO_STYLE_OVERRIDE = "bg-bg-secondary text-text-primary border-t border-border-secondary";

interface SubscriptionNoteDisplayProps {
    note: SubscriptionNote;
    /** When true, info notes use bg-bg-secondary and text-text-primary instead of the badge default. */
    infoStyleOverride?: boolean;
}

const noteTypeToBadgeVariant: Record<SubscriptionNoteType, BadgeVariant> = {
    warning: "yellow",
    error: "red",
    info: "default",
};

/**
 * Renders a single subscription note with appropriate styling based on type.
 */
export function SubscriptionNoteDisplay({
    note,
    infoStyleOverride = false,
}: SubscriptionNoteDisplayProps) {
    const variant = noteTypeToBadgeVariant[note.type];
    const useOverride = note.type === "info" && infoStyleOverride;

    return (
        <div
            className={cn(
                "px-4 pt-6 pb-3 rounded-b-xl",
                useOverride ? INFO_STYLE_OVERRIDE : badgeVariants[variant],
                !useOverride && "border-t"
            )}
        >
            <p className="text-sm">{note.message}</p>
        </div>
    );
}

interface SubscriptionNotesProps {
    subscription: SubscriptionData;
    businessName?: string;
    className?: string;
    maxNotes?: number;
    /** When true, info notes use bg-bg-secondary and text-text-primary instead of the badge default. */
    infoStyleOverride?: boolean;
}

/**
 * Renders all applicable notes for a subscription.
 */
export function SubscriptionNotes({
    subscription,
    businessName,
    className = "",
    maxNotes,
    infoStyleOverride = false,
}: SubscriptionNotesProps) {
    const notes = getSubscriptionNotes(subscription, businessName);

    if (notes.length === 0) return null;

    const displayNotes = maxNotes ? notes.slice(0, maxNotes) : notes;

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {displayNotes.map((note, index) => (
                <SubscriptionNoteDisplay
                    key={index}
                    note={note}
                    infoStyleOverride={infoStyleOverride}
                />
            ))}
        </div>
    );
}
