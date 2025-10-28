"use client";

import { Separator } from "../ui/separator";
import { SessionTabs } from "./tabs";
import { SubscriptionResponse } from "@/types/subscription";
import { useSearchParams } from "next/navigation";

export function SubscriptionTabsTable({ subscriptionId, subscription }: { subscriptionId: string, subscription: SubscriptionResponse }) {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'invoice-history';
    return (
        <div className="flex flex-col">
            <SessionTabs className="w-full" items={[{ value: 'invoice-history', label: 'Invoice History', link: `/session/subscriptions/${subscriptionId}?tab=invoice-history` }, { value: 'usage-summary', label: 'Usage Summary', link: `/session/subscriptions/${subscriptionId}?tab=usage-summary` }]} currentTab="invoice-history" />
            <Separator className="my-0" />

        </div>
    )
}