"use client";

import { RefreshCcw } from "lucide-react";
import ServerPagination from "@/components/common/server-pagination";
import { BusinessCard } from "./business-card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export interface BusinessData {
  business_id: string;
  country: string;
  logo: string;
  name: string;
}

interface ItemCardProps {
  businessData: BusinessData[];
  dataIndex?: number;
  currentPage: number;
  pageSize: number;
  currentPageItems: number;
  hasNextPage: boolean;
  baseUrl: string;
  pageParamKey?: string;
}

export const Businesses = ({
  businessData,
  currentPage,
  pageSize,
  currentPageItems,
  hasNextPage,
  baseUrl,
  pageParamKey,
}: ItemCardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const isEmpty = businessData.length === 0;
  const emptyMessage =
    currentPage > 0
      ? "No businesses found on this page"
      : "No businesses found";

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search businesses"
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isEmpty ? (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-20rem)] my-auto">
          <span className="text-text-primary p-3 mb-3 bg-bg-secondary rounded-full text-2xl">
            <RefreshCcw />
          </span>
          <span className="text-sm font-display text-center tracking-wide text-text-secondary">
            {emptyMessage}
          </span>
        </div>
      ) : (
        businessData
          .filter((item: BusinessData) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item: BusinessData, index: number) => (
            <BusinessCard key={index} business={item} />
          ))
      )}
      {(!isEmpty || currentPage !== 0 || pageSize !== 50) && (
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
