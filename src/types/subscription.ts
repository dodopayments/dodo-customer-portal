export interface SubscriptionResponse {
  created_at: string;
  currency: string;
  customer: {
    customer_id: string;
    phone_number: string | null;
    email: string;
    name: string;
  };
  billing: {
    city: string;
    country: string;
    state: string;
    street: string;
    zipcode: string;
  };
  discount_id: string;
  metadata: object;
  next_billing_date: string;
  on_demand: boolean;
  payment_frequency_count: number;
  payment_frequency_interval: string;
  product_id: string;
  quantity: number;
  recurring_pre_tax_amount: number;
  status: string;
  subscription_id: string;
  subscription_period_count: number;
  subscription_period_interval: string;
  tax_inclusive: boolean;
  tax_id?: string;
  trial_period_days: number;
  cancel_at_next_billing_date?: boolean;
}
