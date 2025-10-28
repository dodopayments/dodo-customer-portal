import PageHeader from "@/components/page-header";
import { fetchPayments, fetchRefunds, fetchBusiness } from "@/app/session/orders/actions";
import { SessionTabs } from "@/components/session/tabs";
import { ItemCard } from "@/components/session/item-card";

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
    }>;
}

export default async function OrdersPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const pageNumber = parseInt(params.page || '0');
    const status = params.status;
    const dateFrom = params.dateFrom;
    const dateTo = params.dateTo;

    const refundPageNumber = parseInt(params.refundPage || '0');
    const refundStatus = params.refundStatus;
    const refundDateFrom = params.refundDateFrom;
    const refundDateTo = params.refundDateTo;

    const [paymentsData, refundsData, business] = await Promise.all([
        fetchPayments({
            pageSize: 10,
            pageNumber,
            created_at_gte: dateFrom,
            created_at_lte: dateTo,
            status: status,
        }),
        fetchRefunds({
            pageSize: 10,
            pageNumber: refundPageNumber,
            created_at_gte: refundDateFrom,
            created_at_lte: refundDateTo,
            status: refundStatus,
        }),
        fetchBusiness(),
    ]);

    return (
        <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
            <PageHeader>
                <SessionTabs items={[{ value: 'payments', label: 'One-time purchases', link: '/session/orders' }, { value: 'subscriptions', label: 'Subscriptions', link: '/session/orders/subscriptions' }]} />
            </PageHeader>
            <ItemCard
                cardClassName="w-full p-4 gap-4"
                imageUrl="/images/login/login-img.png"
                title="Mirage - Framer template"
                description="Mirage is a bold, conversion-focused Framer template for AI startups."
                amount="$100.00"
                searchPlaceholder="Search by order ID"
            >
            </ItemCard>
        </div>
    );
}
