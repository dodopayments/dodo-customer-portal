export interface AddOn {
    addon_id: string;
    quantity: number;
}

interface billing {
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

export interface SubscriptionDetailsData {
    addons: AddOn[];
    cancel_at_next_billing_date: boolean;
    cancelled_at: string;
    created_at: string;
    currency: string;
    customer: {
        customer_id: string;
        email: string;
        name: string;
        phone_number: string;
    },
    discount_cycles_remaining: number;
    discount_id: string;
    expires_at: string;
    metadata: Record<string, string>;
    meters: Meter[];
    next_billing_date: string;
    on_demand: boolean;
    payment_frequency_count: number;
    payment_frequency_interval: string;
    previous_billing_date: string;
    product: {
        description: string;
        id: string;
        image: string;
        name: string;
    },
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