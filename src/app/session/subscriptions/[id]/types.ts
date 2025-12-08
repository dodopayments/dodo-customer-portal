export interface Customer {
  customer_id: string;
  email: string;
  name: string;
  phone_number: string;
}

export interface AddOn {
  addon_id: string;
  quantity: number;
}

export interface Billing {
  city: string;
  country: string;
  state: string;
  street: string;
  zipcode: string;
}

export interface Meter {
  currency: string;
  description: string;
  free_threshold: number;
  measurement_unit: string;
  meter_id: string;
  name: string;
  price_per_unit: string;
}

export interface Product {
  description: string;
  id: string;
  image: string;
  name: string;
}

export interface SubscriptionDetailsData {
  billing: Billing;
  addons: AddOn[];
  cancel_at_next_billing_date: boolean;
  cancelled_at: string;
  created_at: string;
  currency: string;
  customer: Customer;
  discount_cycles_remaining: number;
  discount_id: string;
  expires_at: string;
  payment_method_id?: string;
  metadata: Record<string, string>;
  meters: Meter[];
  next_billing_date: string;
  on_demand: boolean;
  payment_frequency_count: number;
  payment_frequency_interval: string;
  previous_billing_date: string;
  product: Product;
  quantity: number;
  recurring_pre_tax_amount: number;
  status: string;
  subscription_id: string;
  subscription_period_count: number;
  subscription_period_interval: string;
  tax_id: string;
  tax_inclusive: boolean;
  trial_period_days: number;
}

export interface CancelSubscriptionParams {
  subscription_id: string;
  cancelAtNextBillingDate?: boolean;
  revokeCancelation?: boolean;
}

export interface UpdateBillingDetailsParams {
  subscription_id: string;
  data: {
    customer: {
      name: string;
    };
    billing: {
      city: string;
      country: string;
      state: string;
      street: string;
      zipcode: string;
    };
    tax_id?: string | null;
  };
}

export interface UpdatePaymentMethodParams {
  subscription_id: string;
  type: "new" | "existing";
  payment_method_id?: string;
  return_url?: string | null;
}

export interface UpdatePaymentMethodResponse {
  client_secret: string | null;
  expires_on: string | null;
  payment_id: string | null;
  payment_link: string | null;
}

export interface InvoiceDetailsPayload {
  street: string | null;
  state: string | null;
  city: string | null;
  zipcode: string | null;
}