import PageHeader from "@/components/page-header";
import { fetchOneTime, fetchSubscriptions } from "@/app/session/orders/actions";
import { SessionTabs } from "@/components/session/tabs";
import { ItemSection } from "@/components/session/item-section";

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

export default async function OrdersPage({ searchParams }: PageProps) {
    const params = await searchParams;
    console.log("params", params);
    const orderType = params?.orderType || 'one-time'; // one-time or subscription

    const pageNumber = parseInt(params.page || '0');
    const status = params.status;
    const dateFrom = params.dateFrom;
    const dateTo = params.dateTo;
    let data = [];
    let product = null;

    if (orderType === 'subscriptions') {
        const subscriptionsData = await fetchSubscriptions({
            created_at_gte: dateFrom,
            created_at_lte: dateTo,
        });
        console.log("subscriptionsData", subscriptionsData);
        data = subscriptionsData.data;
    } else {
        const oneTimeData = await fetchOneTime();
        console.log("oneTimeData", oneTimeData);
        data = oneTimeData.data;
    }


    return (
        <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
            <PageHeader>
                <SessionTabs items={[{ value: 'one-time', label: 'One-time purchases', link: '/session/orders?orderType=one-time' }, { value: 'subscriptions', label: 'Subscriptions', link: '/session/orders?orderType=subscriptions' }]} currentTab={orderType} />
            </PageHeader>
            <ItemSection
                orderType={orderType}
                cardClassName="w-full p-4 gap-4"
                imageUrl="/images/login/login-img.png"
                title="Mirage - Framer template"
                description="Mirage is a bold, conversion-focused Framer template for AI startups."
                amount="$100.00"
                searchPlaceholder="Search by order ID"
                data={data}
            >
            </ItemSection>
        </div>
    );
}
