import {
  PaymentMethodType,
  PaymentMethod,
} from "../../../app/session/payment-methods/type";
import type { Icon } from "@phosphor-icons/react";
import {
  CreditCard,
  Wallet,
  Bank,
  CurrencyCircleDollar,
  Receipt,
  Gift,
  DeviceMobile,
  ArrowSquareOut,
  Clock,
  Coins,
  Lightning,
  QrCode,
} from "@phosphor-icons/react/dist/ssr";

const PAYMENT_LOGOS_BASE_URL =
  "https://raw.githubusercontent.com/datatrans/payment-logos/master/assets";

export interface LogoResult {
  type: "url" | "icon";
  url?: string;
  Icon?: Icon;
}

/**
 * Get payment method logo URL or icon component
 * Priority: Local files > Datatrans repository > Generic Phosphor icons
 */
export function getPaymentMethodLogoUrl(
  paymentMethodType?: PaymentMethodType,
  paymentMethod?: PaymentMethod,
  cardNetwork?: string,
  cardType?: string
): LogoResult | null {
  // 1. Check PaymentMethodType first (local files > datatrans > generic)
  if (paymentMethodType) {
    const result = getLogoFromPaymentMethodType(paymentMethodType);
    if (result) return result;
  }

  // 2. Check card network
  if (cardNetwork) {
    const network = cardNetwork.toLowerCase();
    const cardLogos: Record<string, LogoResult> = {
      mastercard: {
        type: "url",
        url: `${PAYMENT_LOGOS_BASE_URL}/cards/mastercard.svg`,
      },
      visa: {
        type: "url",
        url: `${PAYMENT_LOGOS_BASE_URL}/cards/visa.svg`,
      },
      "american-express": {
        type: "url",
        url: `${PAYMENT_LOGOS_BASE_URL}/cards/american-express.svg`,
      },
      "american express": {
        type: "url",
        url: `${PAYMENT_LOGOS_BASE_URL}/cards/american-express.svg`,
      },
      discover: {
        type: "url",
        url: `${PAYMENT_LOGOS_BASE_URL}/cards/discover.svg`,
      },
      diners: {
        type: "url",
        url: `${PAYMENT_LOGOS_BASE_URL}/cards/diners.svg`,
      },
      jcb: {
        type: "url",
        url: `${PAYMENT_LOGOS_BASE_URL}/cards/jcb.svg`,
      },
      unionpay: {
        type: "url",
        url: `${PAYMENT_LOGOS_BASE_URL}/cards/unionpay.svg`,
      },
      maestro: {
        type: "url",
        url: `${PAYMENT_LOGOS_BASE_URL}/cards/maestro.svg`,
      },
    };

    if (cardLogos[network]) return cardLogos[network];
  }

  // 3. Check card type (credit/debit)
  if (cardType) {
    const type = cardType.toLowerCase();
    if (type === "credit" || type === "debit") {
      return {
        type: "icon",
        Icon: CreditCard,
      };
    }
  }

  // 4. Fallback to PaymentMethod with generic icons
  if (paymentMethod) {
    return getLogoFromPaymentMethod(paymentMethod);
  }

  // 5. Ultimate fallback
  return {
    type: "icon",
    Icon: CreditCard,
  };
}

/**
 * Get logo for PaymentMethodType - checks local files first, then datatrans, then generic icons
 */
function getLogoFromPaymentMethodType(
  type: PaymentMethodType
): LogoResult | null {
  // Priority 1: Check local files first
  const localFiles: Record<string, string> = {
    affirm: "/images/payment-methods/affirm.svg",
    afterpay_clearpay: "/images/payment-methods/afterpay.svg",
    cashapp: "/images/payment-methods/cashapp.svg",
    upi_collect: "/images/payment-methods/upi.svg",
    upi_intent: "/images/payment-methods/upi.svg",
  };

  if (localFiles[type]) {
    return {
      type: "url",
      url: localFiles[type],
    };
  }

  // Priority 2: Check datatrans repository
  const datatransLogos: Record<string, string> = {
    // Wallets
    apple_pay: `${PAYMENT_LOGOS_BASE_URL}/wallets/apple-pay.svg`,
    google_pay: `${PAYMENT_LOGOS_BASE_URL}/wallets/google-pay.svg`,
    samsung_pay: `${PAYMENT_LOGOS_BASE_URL}/apm/samsung-pay.svg`,

    // Alternative Payment Methods
    amazon_pay: `${PAYMENT_LOGOS_BASE_URL}/apm/amazon-pay.svg`,
    paypal: `${PAYMENT_LOGOS_BASE_URL}/apm/paypal.svg`,
    klarna: `${PAYMENT_LOGOS_BASE_URL}/apm/klarna.svg`,
    bancontact_card: `${PAYMENT_LOGOS_BASE_URL}/apm/bancontact.svg`,
    eps: `${PAYMENT_LOGOS_BASE_URL}/apm/eps.svg`,
    ideal: `${PAYMENT_LOGOS_BASE_URL}/apm/ideal.svg`,
    przelewy24: `${PAYMENT_LOGOS_BASE_URL}/apm/przelewy24.svg`,
    sepa: `${PAYMENT_LOGOS_BASE_URL}/apm/sepa.svg`,
  };

  if (datatransLogos[type]) {
    return {
      type: "url",
      url: datatransLogos[type],
    };
  }

  // Priority 3: Generic icons for credit/debit
  if (type === "credit" || type === "debit") {
    return {
      type: "icon",
      Icon: CreditCard,
    };
  }

  // Priority 4: Generic icons for other types
  if (type === "ach") {
    return {
      type: "icon",
      Icon: Bank,
    };
  }

  return null;
}

/**
 * Get logo for PaymentMethod - uses generic Phosphor icons
 */
function getLogoFromPaymentMethod(method: PaymentMethod): LogoResult {
  const iconMap: Record<PaymentMethod, Icon> = {
    card: CreditCard,
    card_redirect: ArrowSquareOut,
    pay_later: Clock,
    wallet: Wallet,
    bank_redirect: Bank,
    bank_transfer: Bank,
    crypto: Coins,
    bank_debit: Bank,
    reward: CurrencyCircleDollar,
    real_time_payment: Lightning,
    upi: QrCode,
    voucher: Receipt,
    gift_card: Gift,
    open_banking: Bank,
    mobile_payment: DeviceMobile,
  };

  const IconComponent = iconMap[method];
  if (IconComponent) {
    return {
      type: "icon",
      Icon: IconComponent,
    };
  }

  // Fallback to generic card icon
  return {
    type: "icon",
    Icon: CreditCard,
  };
}

/**
 * Format a payment method type string for display
 * Converts snake_case to Title Case
 */
export function formatPaymentMethodType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get human-readable display name for a payment method
 */
export function getPaymentMethodDisplayName(paymentMethod: {
  payment_method_type?: string;
  payment_method?: string;
}): string {
  if (paymentMethod.payment_method_type === "apple_pay") return "Apple Pay";
  if (paymentMethod.payment_method_type === "google_pay") return "Google Pay";
  return formatPaymentMethodType(paymentMethod.payment_method || "Unknown");
}
