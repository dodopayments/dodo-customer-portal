"use client";

import { cn } from "@/lib/utils";
import { RefreshCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SubscriptionCard } from "../subscription-card";

export interface SubscriptionData {
  billing: {
    city: string;
    country: string;
    state: string;
    street: string;
    zipcode: string;
  };
  cancel_at_next_billing_date: boolean;
  cancelled_at: string;
  created_at: string;
  currency: string;
  customer: {
    customer_id: string;
    email: string;
    name: string;
    phone_number: string;
  };
  discount_cycles_remaining: 1073741824;
  discount_id: string;
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
  };
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

interface ItemCardProps {
  cardClassName?: string;
  searchPlaceholder?: string;
  subscriptionData: SubscriptionData[];
  dataIndex?: number;
}

export const Subscriptions = ({
  cardClassName,
  searchPlaceholder,
  subscriptionData,
}: ItemCardProps) => {
  const [search, setSearch] = useState("");

  if (subscriptionData.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-20rem)]">
        <span className="text-text-primary p-3 mb-3 bg-bg-secondary rounded-full text-2xl">
          <RefreshCcw />
        </span>
        <span className="text-sm font-display text-center tracking-wide text-text-secondary">
          No active subscriptions at the moment
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary border-border-secondary" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            className="pl-10 border-border-secondary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {subscriptionData.map((item: SubscriptionData, index: number) => (
          <SubscriptionCard
            key={index}
            item={item}
            cardClassName={cn("border-b", cardClassName)}
          />
        ))}
      </div>
    </>
  );
};
