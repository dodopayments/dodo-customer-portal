"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import BaseDataTable from "@/components/custom/base-data-table";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  fetchUsageHistoryByMeterId,
  UsageHistoryResponseByMeterId,
} from "@/redux/slice/subscription/subscriptoinSlice";
import TablePagination from "@/components/ui/dodo/TablePagination";
import Loading from "@/components/loading";
import { selectBusiness } from "@/redux/slice/business/businessSlice";
import { Repeat } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import { UsageHistoryByMeterIdColumn } from "@/components/session/usage-history-by-meterId-coloumn";
import { FilterControls } from "@/components/custom/filter-controls";

const Page = ({ params }: { params: Promise<{ meter_id: string }> }) => {
  const resolvedParams = React.use(params);
  const searchParams = useSearchParams();
  const subscription_id = searchParams.get("sub_id");
  const dispatch = useAppDispatch();
  const [usageHistory, setUsageHistory] = useState<
    UsageHistoryResponseByMeterId[]
  >([]);
  const business = useAppSelector(selectBusiness);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchUsageHistoryData = async () => {
      try {
        setIsLoading(true);
        const params = {
          pageSize: 10,
          pageNumber,
          start: dateFilter?.from?.toISOString(),
          end: dateFilter?.to?.toISOString(),
          subscription_id: subscription_id ?? "",
          meter_id: resolvedParams.meter_id,
        };
        const response = await dispatch(
          fetchUsageHistoryByMeterId(params)
        ).unwrap();
        setUsageHistory(response.items);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (subscription_id && resolvedParams.meter_id) {
      fetchUsageHistoryData();
    }
  }, [
    dispatch,
    pageNumber,
    dateFilter,
    subscription_id,
    resolvedParams.meter_id,
  ]);

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
          columns={UsageHistoryByMeterIdColumn}
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
        title={`Usage for ${resolvedParams.meter_id}`}
        description={`View all your usage details with ${business?.name}`}
        actions={
          <div className="flex items-center gap-2">
            <FilterControls
              dateFilter={dateFilter}
              disableFilter
              setDateFilter={setDateFilter}
              setPageNumber={setPageNumber}
            />
          </div>
        }
      />
      <Separator className="my-6" />
      {renderContent()}
    </div>
  );
};

export default Page;
