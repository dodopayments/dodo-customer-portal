"use client";

import { AlertCircle, Clock, Zap, Info } from "lucide-react";
import type { BadgeVariant } from "@/components/ui/badge";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SubscriptionData } from "./subscriptions/subscriptions";
import { useTranslations, useLocale } from "next-intl";

export type SubscriptionNoteType = "warning" | "error" | "info";

export interface SubscriptionNote {
  type: SubscriptionNoteType;
  messageKey: string;
  messageValues?: Record<string, string | number>;
  icon: React.ReactNode;
}

export function getSubscriptionNotes(
  subscription: SubscriptionData,
  businessName?: string,
  locale: string = "en"
): SubscriptionNote[] {
  const notes: SubscriptionNote[] = [];

  if (subscription.status === "on_hold") {
    notes.push({
      type: "error",
      messageKey: "onHold",
      icon: <AlertCircle className="w-4 h-4 flex-shrink-0" />,
    });
  }

  if (subscription.status === "failed") {
    notes.push({
      type: "error",
      messageKey: "failed",
      icon: <AlertCircle className="w-4 h-4 flex-shrink-0" />,
    });
  }

  if (subscription.status === "pending") {
    notes.push({
      type: "info",
      messageKey: "pending",
      icon: <Info className="w-4 h-4 flex-shrink-0" />,
    });
  }

  if (
    subscription.cancel_at_next_billing_date &&
    subscription.status !== "cancelled"
  ) {
    if (subscription.next_billing_date) {
      const cancellationDate = new Date(
        subscription.next_billing_date
      ).toLocaleDateString(locale, { dateStyle: "medium" });
      notes.push({
        type: "warning",
        messageKey: "scheduledCancellation",
        messageValues: { date: cancellationDate },
        icon: <Clock className="w-4 h-4 flex-shrink-0" />,
      });
    } else {
      notes.push({
        type: "warning",
        messageKey: "scheduledCancellationNoDate",
        icon: <Clock className="w-4 h-4 flex-shrink-0" />,
      });
    }
  }

  if (subscription.on_demand && subscription.status === "active") {
    if (businessName) {
      notes.push({
        type: "info",
        messageKey: "flexibleSubscription",
        messageValues: { name: businessName },
        icon: <Zap className="w-4 h-4 flex-shrink-0" />,
      });
    } else {
      notes.push({
        type: "info",
        messageKey: "flexibleSubscriptionUnknownMerchant",
        icon: <Zap className="w-4 h-4 flex-shrink-0" />,
      });
    }
  }

  if (
    subscription.discount_id &&
    subscription.discount_cycles_remaining &&
    subscription.discount_cycles_remaining > 0
  ) {
    notes.push({
      type: "info",
      messageKey: "discountApplied",
      messageValues: { count: subscription.discount_cycles_remaining },
      icon: <Info className="w-4 h-4 flex-shrink-0" />,
    });
  }

  if (subscription.status === "cancelled" && subscription.cancelled_at) {
    const cancelledDate = new Date(
      subscription.cancelled_at
    ).toLocaleDateString(locale, { dateStyle: "medium" });
    notes.push({
      type: "error",
      messageKey: "cancelledOn",
      messageValues: { date: cancelledDate },
      icon: <Clock className="w-4 h-4 flex-shrink-0" />,
    });
  }

  if (subscription.status === "expired") {
    notes.push({
      type: "info",
      messageKey: "expired",
      icon: <Clock className="w-4 h-4 flex-shrink-0" />,
    });
  }

  return notes;
}

const INFO_STYLE_OVERRIDE =
  "!bg-bg-secondary dark:!bg-bg-secondary text-text-primary dark:!text-text-primary border-t border-border-secondary";

interface SubscriptionNoteDisplayProps {
  note: SubscriptionNote;
  infoStyleOverride?: boolean;
}

const noteTypeToBadgeVariant: Record<SubscriptionNoteType, BadgeVariant> = {
  warning: "yellow",
  error: "red",
  info: "default",
};

export function SubscriptionNoteDisplay({
  note,
  infoStyleOverride = false,
}: SubscriptionNoteDisplayProps) {
  const t = useTranslations("SubscriptionNotes");
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
      <p
        className={cn(
          "text-sm",
          useOverride && "text-text-primary dark:text-text-primary"
        )}
      >
        {t(note.messageKey as Parameters<typeof t>[0], note.messageValues)}
      </p>
    </div>
  );
}

interface SubscriptionNotesProps {
  subscription: SubscriptionData;
  businessName?: string;
  className?: string;
  maxNotes?: number;
  infoStyleOverride?: boolean;
}

export function SubscriptionNotes({
  subscription,
  businessName,
  className = "",
  maxNotes,
  infoStyleOverride = false,
}: SubscriptionNotesProps) {
  const locale = useLocale();
  const notes = getSubscriptionNotes(subscription, businessName, locale);

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
