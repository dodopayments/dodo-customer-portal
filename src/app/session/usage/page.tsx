"use client";
import React, { useState, useEffect } from "react";
import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import BaseDataTable from "@/components/custom/base-data-table";

import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  fetchUsageHistory,
  UsageHistoryResponse,
} from "@/redux/slice/subscription/subscriptoinSlice";
import TablePagination from "@/components/ui/dodo/TablePagination";
import Loading from "@/components/loading";
import { selectBusiness } from "@/redux/slice/business/businessSlice";
import { Repeat } from "@phosphor-icons/react";
import { UsageHistoryColumn } from "@/components/session/usage-history-coloumn";
import { useRouter } from "next/navigation";

const Page = () => {
  const dispatch = useAppDispatch();
  const [usageHistory, setUsageHistory] = useState<UsageHistoryResponse[]>([]);
  const business = useAppSelector(selectBusiness);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUsageHistoryData = async () => {
      setIsLoading(true);
      const params = {
        pageSize: 10,
        pageNumber,
      };
      const response = await dispatch(fetchUsageHistory(params)).unwrap();
      setUsageHistory(response.items);
      setIsLoading(false);
    };
    fetchUsageHistoryData();
  }, [dispatch, pageNumber]);

  const handleRowClick = (row: UsageHistoryResponse) => {
    router.push(`/session/usage/${row.meter_id}?sub_id=${row.subscription_id}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[calc(100vh-20rem)]">
          <Loading />
        </div>
      );
    }
    if (usageHistory.length === 0 && !isLoading && usageHistory.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-20rem)]">
          <span className="text-text-primary p-3 mb-3 bg-bg-secondary rounded-full">
            <Repeat className="w-6 h-6" />
          </span>
          <span className="text-base font-display text-center tracking-wide text-text-secondary">
            No Usage History
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <BaseDataTable
          data={usageHistory}
          onRowClick={handleRowClick}
          columns={UsageHistoryColumn}
        />
        <TablePagination
          currentPage={pageNumber}
          pageSize={10}
          currentPageItems={usageHistory.length}
          hasNextPage={usageHistory.length >= 10}
          onPageChange={setPageNumber}
        />
      </div>
    );
  };

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16  flex flex-col h-full">
      <PageHeader
        title="Usage"
        description={`View all your usage details with ${business?.name}`}
      />
      <Separator className="my-6" />
      {renderContent()}
    </div>
  );
};

export default Page;
