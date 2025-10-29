import { Separator } from "../ui/separator";
import { SessionTabs } from "./tabs";
import { SubscriptionResponse } from "@/types/subscription";
import { InvoiceHistory } from "./invoice-history";
import { fetchInvoiceHistory } from "@/app/session/subscriptions/[id]/action";
import { api_url } from "@/lib/http";

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

export async function SubscriptionTabsTable({
    subscriptionId,
    subscription,
    searchParams
}: {
    subscriptionId: string,
    subscription: SubscriptionResponse,
    searchParams: Promise<{ tab?: string }>
}) {
    const params = await searchParams;
    const tab = params?.tab || 'invoice-history';
    const invoiceHistory = await fetchInvoiceHistory(subscriptionId);
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
    return (
        <div className="flex flex-col gap-8">
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
            {tab === 'invoice-history' && <InvoiceHistory invoiceHistory={invoiceHistoryData} />}
        </div>
    )
}