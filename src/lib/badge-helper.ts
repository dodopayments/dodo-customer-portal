type BadgeResponse = {
  color: string;
  message: string;
};

export function getBadge(
  status: string | null,
  isVerification?: boolean,
  isPayment?: boolean,
): BadgeResponse {
  if (status === null) {
    if (isVerification) {
      return { color: "red", message: "Pending" };
    } else if (isPayment) {
      return { color: "default", message: "Not Initiated" };
    } else {
      return { color: "default", message: "No Status" };
    }
  }

  const statusMap: Record<string, BadgeResponse> = {
    // Payment Statuses
    succeeded: { color: "green", message: "Successful" },
    failed: { color: "red", message: "Failed" },
    cancelled: { color: "red", message: "Cancelled" },
    expired: { color: "red", message: "Expired" },
    processing: { color: "yellow", message: "In Progress" },
    requires_customer_action: { color: "yellow", message: "Pending" },
    requires_payment_method: { color: "default", message: "Not initated" },
    requires_merchant_action: { color: "orange", message: "On Hold" },
    requires_confirmation: { color: "orange", message: "On Hold" },
    requires_capture: { color: "orange", message: "On Hold" },
    partially_captured: { color: "orange", message: "On Hold" },
    partially_captured_and_capturable: { color: "orange", message: "On Hold" },

    // Dispute Stages
    pre_dispute: { color: "yellow", message: "Pre-Dispute" },
    dispute: { color: "orange", message: "Dispute" },
    pre_arbitration: { color: "orange", message: "Pre-Arbitration" },

    // Dispute Statuses
    dispute_opened: { color: "yellow", message: "Dispute Opened" },
    dispute_expired: { color: "red", message: "Dispute Expired" },
    dispute_accepted: { color: "green", message: "Dispute Accepted" },
    dispute_cancelled: { color: "red", message: "Dispute Cancelled" },
    dispute_challenged: { color: "yellow", message: "Dispute Challenged" },
    dispute_won: { color: "green", message: "Dispute Won" },
    dispute_lost: { color: "red", message: "Dispute Lost" },

    // Generic Statuses
    Fail: { color: "red", message: "Failed" },
    Review: { color: "yellow", message: "In Review" },
    Hold: { color: "yellow", message: "On Hold" },
    Success: { color: "green", message: "Verified" },

    // pricing type
    One_time: { color: "blue", message: "One Time" },
    Subscription: { color: "purple", message: "Subscription" },

    // License Status
    active: { color: "green", message: "Active" },
    disabled: { color: "yellow", message: "Disabled" },
  };

  // Return matched status or default fallback
  return (
    statusMap[status] || {
      color: "default",
      message:
        status.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()) ||
        "Unknown",
    }
  );
}
