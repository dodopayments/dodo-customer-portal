"use client";

import { cn } from "@/lib/utils"
import { CircleSlash, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { OneTimePurchaseCard } from "./one-time-purchase-card";
import { SubscriptionCard } from "./subscription-card";

export interface Product {
    product_id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    image_url: string;
    created_at: string;
    updated_at: string;
}

export interface OneTimeData {
    payment_id: string;
    status: string;
    total_amount: number;
    currency: string;
    payment_method: string | null;
    payment_method_type: string | null;
    created_at: string;
    digital_products_delivered: boolean;
    product: Product;
}

export interface SubscriptionData {
    subscription_id: string;
    recurring_pre_tax_amount: number;
    tax_inclusive: boolean;
    currency: string;
    status: string;
    created_at: string;
    product_id: string;
    quantity: number;
    trial_period_days: number;
    subscription_period_interval: string;
    payment_frequency_interval: string;
    subscription_period_count: number;
    payment_frequency_count: number;
    next_billing_date: string;
    previous_billing_date: string;
    customer: object;
    tax_id: string | null;
    metadata: object;
    discount_id: string | null;
    discount_cycles_remaining: number | null;
    cancelled_at: string | null;
    cancel_at_next_billing_date: boolean;
    billing: object;
    on_demand: boolean;
    product: Product;
}

interface ItemCardProps {
    cardClassName?: string;
    searchPlaceholder?: string;
    orderType: 'one-time' | 'subscriptions';
    oneTimeData: OneTimeData[];
    subscriptionData: SubscriptionData[];
    dataIndex?: number;
}

export const ItemSection = ({ cardClassName, searchPlaceholder, orderType, oneTimeData, subscriptionData, dataIndex = 0 }: ItemCardProps) => {
    const [search, setSearch] = useState("");
    if ((orderType === "one-time" && oneTimeData.length === 0) || (orderType === "subscriptions" && subscriptionData.length === 0)) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-20rem)]">
            <span className="text-text-primary p-3 mb-3 bg-bg-secondary rounded-full text-2xl">
              <CircleSlash />
            </span>
            <span className="text-sm font-display text-center tracking-wide text-text-secondary">
              No Active License Keys
            </span>
          </div>
        )
    }
    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary border-border-secondary" />
                    <Input type="text" placeholder={searchPlaceholder} className="pl-10 border-border-secondary" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>
            <div className="mt-6 flex flex-col gap-4">
                {orderType === "one-time" && oneTimeData.map((item: OneTimeData, index: number) => (
                    <OneTimePurchaseCard
                        key={index}
                        item={item}
                        cardClassName={cn("border-b", cardClassName)}
                    />
                ))}
                {orderType === "subscriptions" && subscriptionData.map((item: SubscriptionData, index: number) => (
                    <SubscriptionCard
                        key={index}
                        item={item}
                        cardClassName={cn("border-b", cardClassName)}
                    />
                ))}
            </div>
        </>
    )
}