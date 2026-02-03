"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { fetchPayments } from "@/app/session/orders/actions";
import { OrderData } from "@/components/session/orders/orders";
import { Orders } from "@/components/session/orders/orders";
import { SessionPageLayout } from "@/components/session/session-page-layout";

const DEFAULT_PAGE_SIZE = 50;
const PAGE_PARAM_KEY = "order_page";
const SIZE_PARAM_KEY = "page_size";

function OrdersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ordersData, setOrdersData] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get pagination params from URL with validation
  const parsedPage = parseInt(searchParams.get(PAGE_PARAM_KEY) || "0", 10);
  const parsedSize = parseInt(searchParams.get(SIZE_PARAM_KEY) || DEFAULT_PAGE_SIZE.toString(), 10);
  const currentPage = isNaN(parsedPage) || parsedPage < 0 ? 0 : parsedPage;
  const pageSize = isNaN(parsedSize) || parsedSize < 1 ? DEFAULT_PAGE_SIZE : parsedSize;

  // Fetch orders when page/size changes
  useEffect(() => {
    const controller = new AbortController();
    const loadOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPayments(currentPage, pageSize);
        // Only update state if request wasn't aborted
        if (!controller.signal.aborted) {
          setOrdersData(data.data as OrderData[]);
          setHasNextPage(data.hasNext);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to fetch orders:", error);
          setError("Failed to load orders. Please try again.");
          setOrdersData([]);
          setHasNextPage(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      controller.abort();
    };
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
      {error ? (
        <div className="flex flex-col justify-center items-center py-12 gap-3">
          <div className="text-text-primary font-medium">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-text-secondary hover:text-text-primary underline"
          >
            Refresh page
          </button>
        </div>
      ) : isLoading ? (
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

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <SessionPageLayout title="Orders" backHref="/session/overview">
        <div className="flex justify-center items-center py-12">
          <div className="text-text-secondary">Loading orders...</div>
        </div>
      </SessionPageLayout>
    }>
      <OrdersPageContent />
    </Suspense>
  );
}
