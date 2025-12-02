"use client";

import { cn } from "@/lib/utils";
import { CircleSlash } from "lucide-react";
import { OrderCard } from "./order-card";
import ServerPagination from "@/components/common/server-pagination";

export interface OrderData {
  brand_id: string;
  created_at: string;
  currency: string;
  customer: {
    customer_id: string;
    email: string;
    name: string;
    phone_number: string;
  };
  digital_products_delivered: boolean;
  payment_id: string;
  payment_method: string;
  payment_method_type: string;
  status: string;
  subscription_id: string | null;
  total_amount: number;
}

interface ItemCardProps {
  cardClassName?: string;
  ordersData: OrderData[];
  currentPage: number;
  pageSize: number;
  currentPageItems: number;
  hasNextPage: boolean;
  baseUrl: string;
  pageParamKey?: string;
}

export const Orders = ({
  cardClassName,
  ordersData,
  currentPage,
  pageSize,
  currentPageItems,
  hasNextPage,
  baseUrl,
  pageParamKey,
}: ItemCardProps) => {
  const isEmpty = ordersData.length === 0;
  const emptyMessage =
    currentPage > 0
      ? "No purchases found on this page"
      : "No purchases at the moment";

  return (
    <div className="flex flex-col gap-4">
      {isEmpty ? (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-20rem)] my-auto">
          <span className="text-text-primary p-3 mb-3 bg-bg-secondary rounded-full text-2xl">
            <CircleSlash />
          </span>
          <span className="text-sm font-display text-center tracking-wide text-text-secondary">
            {emptyMessage}
          </span>
        </div>
      ) : (
        ordersData.map((item: OrderData, index: number) => (
          <OrderCard
            key={index}
            item={item}
            cardClassName={cn("border-b", cardClassName)}
          />
        ))
      )}
      {(!isEmpty || currentPage !== 0) && (
        <ServerPagination
          currentPage={currentPage}
          pageSize={pageSize}
          currentPageItems={currentPageItems}
          hasNextPage={hasNextPage}
          baseUrl={baseUrl}
          pageParamKey={pageParamKey}
        />
      )}
    </div>
  );
};
