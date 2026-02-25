import type { SubscriptionData } from "@/components/session/subscriptions/subscriptions";
import type { OrderData } from "@/components/session/orders/orders";
import type { PaymentMethodItem } from "@/app/session/payment-methods/type";
import type {
  WalletItem,
  WalletLedgerItem,
  CreditEntitlementItem,
  CreditLedgerItem,
} from "@/app/session/profile/types";

const DEMO_CUSTOMER = {
  customer_id: "cust_demo_001",
  email: "demo@example.com",
  name: "Demo User",
  phone_number: "+15550001234",
};

export const DEMO_USER = {
  name: "Demo User",
  email: "demo@example.com",
};

export const DEMO_SUBSCRIPTIONS: SubscriptionData[] = [
  {
    billing: {
      city: "San Francisco",
      country: "US",
      state: "CA",
      street: "123 Demo St",
      zipcode: "94102",
    },
    cancel_at_next_billing_date: false,
    cancelled_at: "",
    created_at: "2024-01-15T10:00:00Z",
    currency: "USD",
    customer: DEMO_CUSTOMER,
    discount_cycles_remaining: 1073741824,
    discount_id: "",
    next_billing_date: "2025-03-15",
    on_demand: false,
    payment_frequency_count: 1,
    payment_frequency_interval: "month",
    previous_billing_date: "2025-02-15",
    product: {
      description: "Premium plan with full access",
      id: "prod_demo_001",
      image: "",
      name: "Premium Monthly",
    },
    quantity: 1,
    recurring_pre_tax_amount: 2999,
    status: "active",
    subscription_id: "sub_demo_001",
    subscription_period_count: 1,
    subscription_period_interval: "month",
    tax_id: "",
    tax_inclusive: false,
    trial_period_days: 0,
    payment_method_id: "pm_demo_001",
  },
  {
    billing: {
      city: "San Francisco",
      country: "US",
      state: "CA",
      street: "123 Demo St",
      zipcode: "94102",
    },
    cancel_at_next_billing_date: false,
    cancelled_at: "",
    created_at: "2024-06-01T10:00:00Z",
    currency: "USD",
    customer: DEMO_CUSTOMER,
    discount_cycles_remaining: 1073741824,
    discount_id: "",
    next_billing_date: "2025-03-01",
    on_demand: false,
    payment_frequency_count: 1,
    payment_frequency_interval: "month",
    previous_billing_date: "2025-02-01",
    product: {
      description: "Add-on storage",
      id: "prod_demo_002",
      image: "",
      name: "Storage 50GB",
    },
    quantity: 1,
    recurring_pre_tax_amount: 999,
    status: "active",
    subscription_id: "sub_demo_002",
    subscription_period_count: 1,
    subscription_period_interval: "month",
    tax_id: "",
    tax_inclusive: false,
    trial_period_days: 0,
    payment_method_id: "pm_demo_001",
  },
];

export const DEMO_PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    card: {
      card_network: "visa",
      card_type: "credit",
      expiry_month: "12",
      expiry_year: "2027",
      last4_digits: "4242",
    },
    last_used_at: "2025-02-20T14:30:00Z",
    payment_method: "card",
    payment_method_type: "credit",
    payment_method_id: "pm_demo_001",
    recurring_enabled: true,
  },
  {
    card: {
      card_network: "mastercard",
      card_type: "debit",
      expiry_month: "06",
      expiry_year: "2026",
      last4_digits: "5555",
    },
    payment_method: "card",
    payment_method_type: "debit",
    payment_method_id: "pm_demo_002",
    recurring_enabled: false,
  },
];

export const DEMO_BILLING_HISTORY: OrderData[] = [
  {
    brand_id: "brand_demo",
    created_at: "2025-02-15T09:00:00Z",
    currency: "USD",
    customer: DEMO_CUSTOMER,
    digital_products_delivered: false,
    has_license_key: false,
    payment_id: "pay_demo_001",
    payment_method: "card",
    payment_method_type: "credit",
    status: "succeeded",
    subscription_id: "sub_demo_001",
    total_amount: 2999,
  },
  {
    brand_id: "brand_demo",
    created_at: "2025-02-01T09:00:00Z",
    currency: "USD",
    customer: DEMO_CUSTOMER,
    digital_products_delivered: false,
    has_license_key: false,
    payment_id: "pay_demo_002",
    payment_method: "card",
    payment_method_type: "credit",
    status: "succeeded",
    subscription_id: "sub_demo_002",
    total_amount: 999,
  },
  {
    brand_id: "brand_demo",
    created_at: "2025-01-15T09:00:00Z",
    currency: "USD",
    customer: DEMO_CUSTOMER,
    digital_products_delivered: false,
    has_license_key: false,
    payment_id: "pay_demo_003",
    payment_method: "card",
    payment_method_type: "credit",
    status: "succeeded",
    subscription_id: "sub_demo_001",
    total_amount: 2999,
  },
];

export const DEMO_WALLETS: WalletItem[] = [
  {
    balance: 5000,
    created_at: "2024-01-01T00:00:00Z",
    currency: "USD",
    customer_id: DEMO_CUSTOMER.customer_id,
    updated_at: "2025-02-20T00:00:00Z",
  },
  {
    balance: 2500,
    created_at: "2024-06-01T00:00:00Z",
    currency: "EUR",
    customer_id: DEMO_CUSTOMER.customer_id,
    updated_at: "2025-02-18T00:00:00Z",
  },
];

export const DEMO_WALLET_LEDGER: Record<string, WalletLedgerItem[]> = {
  USD: [
    {
      after_balance: 5000,
      amount: 1000,
      before_balance: 4000,
      business_id: "demo",
      created_at: "2025-02-20T12:00:00Z",
      currency: "USD",
      description: "Top-up",
      event_type: "credit",
      id: "wl_usd_001",
      is_credit: true,
      usd_equivalent_amount: 1000,
    },
    {
      after_balance: 4000,
      amount: -999,
      before_balance: 4999,
      business_id: "demo",
      created_at: "2025-02-15T09:00:00Z",
      currency: "USD",
      description: "Subscription payment",
      event_type: "debit",
      id: "wl_usd_002",
      is_credit: false,
      usd_equivalent_amount: -999,
    },
  ],
  EUR: [
    {
      after_balance: 2500,
      amount: 500,
      before_balance: 2000,
      business_id: "demo",
      created_at: "2025-02-18T10:00:00Z",
      currency: "EUR",
      description: "Refund",
      event_type: "credit",
      id: "wl_eur_001",
      is_credit: true,
      usd_equivalent_amount: 540,
    },
  ],
};

const CREDIT_ENTITLEMENT_ID = "ce_demo_001";

export const DEMO_CREDIT_ENTITLEMENTS: CreditEntitlementItem[] = [
  {
    credit_entitlement_id: CREDIT_ENTITLEMENT_ID,
    name: "API Credits",
    unit: "credits",
    balance: "1500",
    overage: "0",
    description: "Monthly API usage credits",
  },
];

export const DEMO_CREDIT_LEDGER: Record<string, CreditLedgerItem[]> = {
  [CREDIT_ENTITLEMENT_ID]: [
    {
      id: "cl_001",
      business_id: "demo",
      customer_id: DEMO_CUSTOMER.customer_id,
      credit_entitlement_id: CREDIT_ENTITLEMENT_ID,
      transaction_type: "usage",
      amount: "-100",
      is_credit: false,
      balance_before: "1600",
      balance_after: "1500",
      overage_before: "0",
      overage_after: "0",
      created_at: "2025-02-20T08:00:00Z",
      description: "API call usage",
    },
    {
      id: "cl_002",
      business_id: "demo",
      customer_id: DEMO_CUSTOMER.customer_id,
      credit_entitlement_id: CREDIT_ENTITLEMENT_ID,
      transaction_type: "grant",
      amount: "2000",
      is_credit: true,
      balance_before: "0",
      balance_after: "2000",
      overage_before: "0",
      overage_after: "0",
      created_at: "2025-02-01T00:00:00Z",
      description: "Monthly grant",
    },
  ],
};

export const DEMO_BILLING_PAGE_SIZE = 25;
