"use client";

import { AlertCircle, Clock, Zap, Info } from "lucide-react";
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
                "This subscription has failed. Please contact support for assistance.",
            icon: <AlertCircle className="w-4 h-4 flex-shrink-0" />,
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

    // Trial period info
    if (subscription.trial_period_days > 0 && subscription.status === "pending") {
        notes.push({
            type: "info",
            message: `You're currently in a ${subscription.trial_period_days}-day trial period.`,
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

interface SubscriptionNoteDisplayProps {
    note: SubscriptionNote;
}

/**
 * Renders a single subscription note with appropriate styling based on type.
 */
export function SubscriptionNoteDisplay({ note }: SubscriptionNoteDisplayProps) {
    const styles = {
        warning: {
            container: "bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-700",
            text: "text-amber-800 dark:text-amber-200",
        },
        error: {
            container: "bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-700",
            text: "text-red-800 dark:text-red-200",
        },
        info: {
            container: "bg-slate-100 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-600",
            text: "text-slate-700 dark:text-slate-300",
        },
    };

    const style = styles[note.type];

    return (
        <div className={`px-4 pt-6 pb-3 rounded-b-xl ${style.container}`}>
            <p className={`text-sm ${style.text}`}>{note.message}</p>
        </div>
    );
}

interface SubscriptionNotesProps {
    subscription: SubscriptionData;
    businessName?: string;
    className?: string;
    maxNotes?: number;
}

/**
 * Renders all applicable notes for a subscription.
 */
export function SubscriptionNotes({
    subscription,
    businessName,
    className = "",
    maxNotes,
}: SubscriptionNotesProps) {
    const notes = getSubscriptionNotes(subscription, businessName);

    if (notes.length === 0) return null;

    const displayNotes = maxNotes ? notes.slice(0, maxNotes) : notes;

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {displayNotes.map((note, index) => (
                <SubscriptionNoteDisplay key={index} note={note} />
            ))}
        </div>
    );
}
