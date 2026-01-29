"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchPayments } from "@/app/session/orders/actions";
import { OrderData } from "@/components/session/orders/orders";
import { Orders } from "@/components/session/orders/orders";
import { SessionPageLayout } from "@/components/session/session-page-layout";

const DEFAULT_PAGE_SIZE = 50;
const PAGE_PARAM_KEY = "order_page";
const SIZE_PARAM_KEY = "page_size";

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ordersData, setOrdersData] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Get pagination params from URL
  const currentPage = parseInt(searchParams.get(PAGE_PARAM_KEY) || "0", 10);
  const pageSize = parseInt(searchParams.get(SIZE_PARAM_KEY) || DEFAULT_PAGE_SIZE.toString(), 10);

  // Fetch orders when page/size changes
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPayments(currentPage, pageSize);
        setOrdersData(data.data as OrderData[]);
        setHasNextPage(data.hasNext);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrdersData([]);
        setHasNextPage(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(PAGE_PARAM_KEY, newPage.toString());
    router.push(`/session/orders?${params.toString()}`);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(PAGE_PARAM_KEY, "0"); // Reset to first page
    params.set(SIZE_PARAM_KEY, newSize.toString());
    router.push(`/session/orders?${params.toString()}`);
  };

  return (
    <SessionPageLayout title="Orders" backHref="/session/overview">
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-text-secondary">Loading orders...</div>
        </div>
      ) : (
        <Orders
          cardClassName="w-full p-4 gap-4"
          ordersData={ordersData}
          currentPage={currentPage}
          pageSize={pageSize}
          hasNextPage={hasNextPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </SessionPageLayout>
  );
}
