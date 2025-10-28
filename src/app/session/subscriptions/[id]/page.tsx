import PageHeader from "@/components/page-header";
import { fetchSubscription } from "./action";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SubscriptionDetails } from "@/components/session/subscription-details";
import { SubscriptionBillingInfo } from "@/components/session/subscription-billing-info";
import { SubscriptionTabsTable } from "@/components/session/subscription-tabs-table";

export interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function SubscriptionPage({ params }: PageProps) {
    const { id } = await params;
    const subscription = await fetchSubscription(id);
    console.log(subscription);
    if (!subscription) {
        return notFound();
    }

    return (
        <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full gap-8">
            <TopButtons />
            <SubscriptionDetails subscription={subscription} />
            <SubscriptionBillingInfo subscription={subscription} />
            <SubscriptionTabsTable subscriptionId={id} subscription={subscription} />
        </div>
    );
}

function TopButtons() {
    return (
        <PageHeader showSeparator={false}>
            <Link href="/session/orders?orderType=subscriptions">
                <Button variant="secondary">
                    <ArrowLeft className="w-4 h-4" />
                </Button>
            </Link>
            <div className="flex flex-row gap-2">
                <Button variant="secondary">
                    Change Plan
                </Button>
                <Button variant="secondary" className="text-red-500">
                    Cancel Subscription
                </Button>
            </div>
        </PageHeader>
    )
}