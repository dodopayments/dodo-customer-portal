"use client";

import { cn } from "@/lib/utils";
import { CircleSlash, Search } from "lucide-react";
import { Input } from "../../ui/input";
import { useState } from "react";
import { OrderCard } from "./order-card";

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
  searchPlaceholder?: string;
  ordersData: OrderData[];
}

export const Orders = ({
  cardClassName,
  searchPlaceholder,
  ordersData,
}: ItemCardProps) => {
  const [search, setSearch] = useState("");
  if (ordersData.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-20rem)] my-auto">
        <span className="text-text-primary p-3 mb-3 bg-bg-secondary rounded-full text-2xl">
          <CircleSlash />
        </span>
        <span className="text-sm font-display text-center tracking-wide text-text-secondary">
          No purchases at the moment
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary border-border-secondary" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            className="pl-10 border-border-secondary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {ordersData.map((item: OrderData, index: number) => (
          <OrderCard
            key={index}
            item={item}
            cardClassName={cn("border-b", cardClassName)}
          />
        ))}
      </div>
    </>
  );
};
