import { Separator } from "../ui/separator";
import { SessionTabs } from "./tabs";
import { InvoiceHistory } from "./invoice-history";
import { fetchInvoiceHistory, fetchUsageHistory } from "@/app/session/subscriptions/[id]/action";
import { api_url } from "@/lib/http";
import { UsageSummary } from "./usage-summary";
import { SubscriptionDetailsData } from "@/app/session/subscriptions/[id]/types";

export interface InvoiceHistoryResponse {
    payment_id: string;
    subscription_id: string;
    created_at: string;
    total_amount: number;
    currency: string;
    status: string;
    digital_products_delivered: boolean;
    download_url: string;
}

export interface UsageHistoryMeter {
    id: string;
    date: string; // date
    name: string; // meter name
    free_threshold: number;  // threshold units
    price_per_unit: string; // unit price
    chargeable_units: string; // fixed fee
    consumed_units: string; // consumed units
    currency: string; // currency
    total_price: number; // total price
}

export interface UsageHistoryResponse {
    end_date: string;
    meters: UsageHistoryMeter[];
    start_date: string;
}

export async function SubscriptionTabsTable({
    subscriptionId,
    searchParams
}: {
    subscriptionId: string,
    subscription: SubscriptionDetailsData,
    searchParams: Promise<{ tab?: string }>
}) {
    const params = await searchParams;
    const invoiceHistory = await fetchInvoiceHistory(subscriptionId);
    const usageHistory = await fetchUsageHistory(subscriptionId);

    const hasUsage = Array.isArray(usageHistory?.items) && usageHistory.items.length > 0;
    const tab = !hasUsage
        ? 'invoice-history'
        : (params?.tab === 'usage-summary' || params?.tab === 'invoice-history'
            ? params.tab
            : 'invoice-history');

    const invoiceHistoryData: InvoiceHistoryResponse[] = invoiceHistory?.items?.map((item: InvoiceHistoryResponse) => ({
        payment_id: item.payment_id,
        subscription_id: subscriptionId,
        date: item.created_at,
        amount: item.total_amount,
        currency: item.currency,
        status: item.status,
        digital_products_delivered: item.digital_products_delivered,
        download_url: `${api_url}/invoices/payments/${item.payment_id}`,
    }));

    const usageHistoryData: UsageHistoryResponse[] = hasUsage ? usageHistory.items.map((item: UsageHistoryResponse) => ({
        start_date: item.start_date,
        end_date: item.end_date,
        meters: item.meters.map((meter: UsageHistoryMeter) => ({
            date: item.start_date,
            chargeable_units: meter.chargeable_units,
            consumed_units: meter.consumed_units,
            currency: meter.currency,
            free_threshold: meter.free_threshold,
            id: meter.id,
            name: meter.name,
            price_per_unit: meter.price_per_unit,
            total_price: meter.total_price,
        })),
    })) : [];

    return (
        <div className="flex flex-col gap-8">
            {hasUsage && (
                <div className="flex flex-col">
                    <SessionTabs
                        className="w-full"
                        items={[{
                            value: 'invoice-history',
                            label: 'Invoice History',
                            link: `/session/subscriptions/${subscriptionId}?tab=invoice-history`
                        }, {
                            value: 'usage-summary',
                            label: 'Usage Summary',
                            link: `/session/subscriptions/${subscriptionId}?tab=usage-summary`
                        }]}
                        currentTab={tab}
                    />
                    <Separator className="my-0" />
                </div>
            )}
            {tab === 'invoice-history' && <InvoiceHistory invoiceHistory={invoiceHistoryData} />}
            {hasUsage && tab === 'usage-summary' && <UsageSummary usageHistory={usageHistoryData} />}
        </div>
    )
}