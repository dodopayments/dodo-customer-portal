export type BadgeResponse = {
  color: string;
  messageKey: string;
};

export function getBadge(
  status: string | null,
  isVerification?: boolean,
  isPayment?: boolean,
): BadgeResponse {
  if (status === null) {
    if (isVerification) {
      return { color: "red", messageKey: "pending" };
    } else if (isPayment) {
      return { color: "default", messageKey: "notInitiated" };
    } else {
      return { color: "default", messageKey: "noStatus" };
    }
  }

  const statusMap: Record<string, BadgeResponse> = {
    // Payment Statuses
    succeeded: { color: "green", messageKey: "succeeded" },
    failed: { color: "red", messageKey: "failed" },
    cancelled: { color: "red", messageKey: "cancelled" },
    expired: { color: "red", messageKey: "expired" },
    processing: { color: "yellow", messageKey: "processing" },
    pending: { color: "yellow", messageKey: "pending" },
    review: { color: "yellow", messageKey: "review" },
    requires_customer_action: { color: "yellow", messageKey: "pending" },
    requires_payment_method: { color: "default", messageKey: "notInitiated" },
    requires_merchant_action: { color: "orange", messageKey: "onHold" },
    requires_confirmation: { color: "orange", messageKey: "onHold" },
    requires_capture: { color: "orange", messageKey: "onHold" },
    partially_captured: { color: "orange", messageKey: "onHold" },
    partially_captured_and_capturable: { color: "orange", messageKey: "onHold" },

    // Dispute Stages
    pre_dispute: { color: "yellow", messageKey: "preDispute" },
    dispute: { color: "orange", messageKey: "dispute" },
    pre_arbitration: { color: "orange", messageKey: "preArbitration" },

    // Dispute Statuses
    dispute_opened: { color: "yellow", messageKey: "disputeOpened" },
    dispute_expired: { color: "red", messageKey: "disputeExpired" },
    dispute_accepted: { color: "green", messageKey: "disputeAccepted" },
    dispute_cancelled: { color: "red", messageKey: "disputeCancelled" },
    dispute_challenged: { color: "yellow", messageKey: "disputeChallenged" },
    dispute_won: { color: "green", messageKey: "disputeWon" },
    dispute_lost: { color: "red", messageKey: "disputeLost" },

    // Generic Statuses
    Fail: { color: "red", messageKey: "failed" },
    Review: { color: "yellow", messageKey: "review" },
    Hold: { color: "yellow", messageKey: "onHold" },
    Success: { color: "green", messageKey: "verified" },

    // Pricing type
    One_time: { color: "blue", messageKey: "oneTime" },
    Subscription: { color: "purple", messageKey: "subscription" },

    // License Status
    active: { color: "green", messageKey: "active" },
    disabled: { color: "yellow", messageKey: "disabled" },
  };

  return (
    statusMap[status] ?? {
      color: "default",
      messageKey: "unknown",
    }
  );
}
