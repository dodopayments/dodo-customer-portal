export interface Customer {
  customer_id: string;
  email: string;
  name: string;
  phone_number: string;
}

export interface AddOn {
  addon_id: string;
  quantity: number;
  name?: string;
}

export type ProrationBillingMode =
  | "prorated_immediately"
  | "full_immediately"
  | "difference_immediately";

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

export interface ChangeSubscriptionPlanParams {
  subscription_id: string;
  data: {
    addons: AddOn[] | null;
    metadata: Record<string, string> | null;
    product_id: string;
    proration_billing_mode: ProrationBillingMode;
    quantity: number;
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

export interface ProductCollectionProduct {
  addons_count: number;
  currency: string | null;
  description: string;
  files_count: number;
  id: string;
  is_recurring: boolean;
  license_key_enabled: boolean;
  meters_count: number;
  name: string;
  price: number;
  price_detail: unknown | null;
  product_id: string;
  status: boolean;
  tax_category: unknown | null;
  tax_inclusive: boolean;
}

export interface ProductCollectionGroup {
  group_id: string;
  group_name: string | null;
  products: ProductCollectionProduct[];
  status: boolean;
}

export interface ProductCollectionData {
  brand_id: string;
  created_at: string;
  description: string;
  groups: ProductCollectionGroup[];
  id: string;
  image: string;
  name: string;
  updated_at: string;
}

export interface ChangeSubscriptionPlanPreviewParams {
  subscription_id: string;
  data: {
    addons: AddOn[] | null;
    metadata: Record<string, string> | null;
    product_id: string;
    proration_billing_mode: ProrationBillingMode;
    quantity: number;
  };
}

export interface LineItem {
  currency: string;
  description: string;
  id: string;
  name: string;
  product_id?: string;
  proration_factor: number;
  quantity: number;
  tax: number;
  tax_inclusive: boolean;
  tax_rate: number;
  type: "subscription" | "addon" | "meter";
  unit_price: number;
  tax_category?: string;
  chargeable_units?: string;
  free_threshold?: number;
  price_per_unit?: string;
  subtotal?: number;
  units_consumed?: string;
}

export interface ChargeSummary {
  currency: string;
  customer_credits: number;
  settlement_amount: number;
  settlement_currency: string;
  settlement_tax: number;
  tax: number;
  total_amount: number;
}

export interface ImmediateCharge {
  line_items: LineItem[];
  summary: ChargeSummary;
}

export interface CustomFieldResponse {
  key: string;
  value: string;
}

export interface NewPlan {
  addons: AddOn[];
  billing: Billing;
  cancel_at_next_billing_date: boolean;
  cancelled_at: string;
  created_at: string;
  currency: string;
  custom_field_responses: CustomFieldResponse[];
  customer: Customer & {
    metadata?: Record<string, string>;
  };
  discount_cycles_remaining: number;
  discount_id: string;
  expires_at: string;
  metadata: Record<string, string>;
  meters: Meter[];
  next_billing_date: string;
  on_demand: boolean;
  payment_frequency_count: number;
  payment_frequency_interval: string;
  payment_method_id: string;
  previous_billing_date: string;
  product_id: string;
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

export interface ChangeSubscriptionPlanPreviewResponse {
  immediate_charge: ImmediateCharge;
  new_plan: NewPlan;
}