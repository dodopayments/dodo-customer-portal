import PageHeader from "@/components/page-header";
import { fetchOneTime, fetchSubscriptions } from "@/app/session/orders/actions";
import { SessionTabs } from "@/components/session/tabs";
import { ItemSection, OneTimeData, SubscriptionData } from "@/components/session/item-section";

export interface PageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
        refundPage?: string;
        refundStatus?: string;
        refundDateFrom?: string;
        refundDateTo?: string;
        orderType?: string;
    }>;
}

const oneTimeData: OneTimeData[] = [{
    payment_id: 'pay_WxkxhuwJjeLzvqvAoJKrw',
    status: 'requires_payment_method',
    total_amount: 2200,
    currency: 'USD',
    payment_method: null,
    payment_method_type: null,
    created_at: '2025-10-06T10:01:06.398332Z',
    digital_products_delivered: true,
    product: {
        product_id: 'prod_WxkxhuwJjeLzvqvAoJKrw',
        name: 'Product 1',
        description: 'Product 1 description',
        price: 2200,
        currency: 'USD',
        image_url: '/images/login/login-img.png',
        created_at: '2025-10-06T10:01:06.398332Z',
        updated_at: '2025-10-06T10:01:06.398332Z',
    },
}]

export default async function OrdersPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const orderType = params?.orderType || 'one-time'; // one-time or subscription

    let data = [];

    if (orderType === 'subscriptions') {
        const subscriptionsData = await fetchSubscriptions();
        data = subscriptionsData.data;
    } else {
        const oneTimeData = await fetchOneTime();
        data = oneTimeData.data;
    }

    return (
        <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
            <PageHeader>
                <SessionTabs items={[{ value: 'one-time', label: 'One-time purchases', link: '/session/orders?orderType=one-time' }, { value: 'subscriptions', label: 'Subscriptions', link: '/session/orders?orderType=subscriptions' }]} currentTab={orderType} />
            </PageHeader>
            <ItemSection
                orderType={orderType as 'one-time' | 'subscriptions'}
                cardClassName="w-full p-4 gap-4"
                searchPlaceholder="Search by order ID"
                oneTimeData={data as OneTimeData[]}
                subscriptionData={data as SubscriptionData[]}
                dataIndex={0}
            />
        </div>
    );
}
