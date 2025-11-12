export type PaymentMethodType =
  | "credit"
  | "debit"
  | "upi_collect"
  | "upi_intent"
  | "apple_pay"
  | "cashapp"
  | "google_pay"
  | "multibanco"
  | "bancontact_card"
  | "eps"
  | "ideal"
  | "przelewy24"
  | "paypal"
  | "affirm"
  | "klarna"
  | "sepa"
  | "ach"
  | "amazon_pay"
  | "afterpay_clearpay";

export type PaymentMethod =
  | "card"
  | "card_redirect"
  | "pay_later"
  | "wallet"
  | "bank_redirect"
  | "bank_transfer"
  | "crypto"
  | "bank_debit"
  | "reward"
  | "real_time_payment"
  | "upi"
  | "voucher"
  | "gift_card"
  | "open_banking"
  | "mobile_payment";

export interface Card {
  card_issuing_country?: string;
  card_network?: string;
  card_type?: string;
  expiry_month?: string;
  expiry_year?: string;
  last4_digits?: string;
}

export interface ConnectorPaymentMethod {
  connector_mandate_id: string;
  original_payment_authorized_amount: number;
  original_payment_authorized_currency: string;
  payment_method_type: PaymentMethodType;
}

export interface PaymentMethodItem {
  card?: Card;
  connector_payment_methods: Record<string, ConnectorPaymentMethod>;
  last_used_at?: string;
  payment_method: PaymentMethod;
  payment_method_id: string;
  profile_map: Record<string, unknown>;
  recurring_enabled?: boolean;
}
