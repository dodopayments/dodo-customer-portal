"use client";

import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";
import { SubscriptionCard } from "../subscription-card";
import ServerPagination from "@/components/common/server-pagination";
import { PaymentMethodItem } from "@/app/session/payment-methods/type";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

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

interface SubscriptionsProps {
    cardClassName?: string;
    subscriptionData: SubscriptionData[];
    dataIndex?: number;
    /**
     * "detail" - Full list with detail cards and pagination (for /subscriptions page)
     * "overview" - Compact section for overview page with header and link
     */
    variant?: "detail" | "overview";
    /** Payment methods for overview variant */
    paymentMethods?: PaymentMethodItem[];
    /** Pagination props - required for detail variant */
    currentPage?: number;
    pageSize?: number;
    currentPageItems?: number;
    hasNextPage?: boolean;
    baseUrl?: string;
    pageParamKey?: string;
}

export const Subscriptions = ({
    cardClassName,
    subscriptionData,
    currentPage = 0,
    pageSize = 10,
    currentPageItems = 0,
    hasNextPage = false,
    baseUrl = "",
    pageParamKey,
    variant = "detail",
    paymentMethods = [],
}: SubscriptionsProps) => {
    const router = useRouter();
    const isEmpty = subscriptionData.length === 0;
    const emptyMessage =
        currentPage > 0
            ? "No subscriptions found on this page"
            : "No active subscriptions at the moment";

    // Overview variant with section header
    if (variant === "overview") {
        return (
            <section id="active-subscriptions">
                <div className="mb-4">
                    <h2 className="text-lg font-display font-medium text-text-primary">
                        Active subscriptions
                    </h2>
                </div>

                {isEmpty ? (
                    <Card className="p-12">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="p-4 bg-bg-secondary rounded-full mb-4">
                                <RefreshCcw className="w-6 h-6 text-text-secondary" />
                            </div>
                            <p className="text-text-secondary text-sm">
                                {emptyMessage}
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {subscriptionData.map((item: SubscriptionData) => (
                            <SubscriptionCard
                                key={item.subscription_id}
                                item={item}
                                variant="compact"
                                paymentMethod={paymentMethods[0]}
                                cardClassName={cardClassName}
                            />
                        ))}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => router.push("/session/subscriptions")}
                                className="text-sm font-medium font-display text-text-secondary hover:text-text-primary transition-colors"
                            >
                                View all subscriptions({subscriptionData.length})
                            </button>
                        </div>
                    </div>
                )}
            </section>
        );
    }

    // Detail variant - original full list view
    return (
        <div className="flex flex-col gap-4">
            {isEmpty ? (
                <div className="flex flex-col justify-center items-center min-h-[calc(100vh-20rem)] my-auto">
                    <span className="text-text-primary p-3 mb-3 bg-bg-secondary rounded-full text-2xl">
                        <RefreshCcw />
                    </span>
                    <span className="text-sm font-display text-center tracking-wide text-text-secondary">
                        {emptyMessage}
                    </span>
                </div>
            ) : (
                subscriptionData.map((item: SubscriptionData) => (
                    <SubscriptionCard
                        key={item.subscription_id}
                        item={item}
                        variant="detail"
                        cardClassName={cn("border-b", cardClassName)}
                    />
                ))
            )}
            {(!isEmpty || currentPage !== 0) && (
                <ServerPagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    currentPageItems={currentPageItems}
                    hasNextPage={hasNextPage}
                    baseUrl={baseUrl}
                    pageParamKey={pageParamKey}
                />
            )}
        </div>
    );
};
