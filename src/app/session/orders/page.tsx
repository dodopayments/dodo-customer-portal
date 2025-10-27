import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import BaseDataTable from "@/components/custom/base-data-table";
import { PaymentColumn } from "@/components/session/payments-column";
import { RefundColumn } from "@/components/session/refunds-column";
import { fetchPayments, fetchRefunds, fetchBusiness } from "@/app/session/orders/actions";
import Filters from "@/components/common/filters";
import ServerPagination from "@/components/common/server-pagination";
import { SessionTabs } from "@/components/session/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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

    const shouldShowRefunds =
        refundsData.data.length > 0 ||
        Boolean(refundDateFrom) ||
        Boolean(refundDateTo) ||
        Boolean(refundStatus);

    return (
        <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
            <PageHeader>
                <SessionTabs items={[{ value: 'payments', label: 'One-time purchases', link: '/session/orders' }, { value: 'subscriptions', label: 'Subscriptions', link: '/session/orders/subscriptions' }]} />
            </PageHeader>

            <div className="flex flex-col mt-6">
            </div>
        </div>
    );
}
