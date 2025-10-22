"use client";
import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import BaseDataTable from "@/components/custom/base-data-table";
import { createSubscriptionColumns } from "@/components/session/subscription-column";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { fetchSubscriptions } from "@/redux/slice/subscription/subscriptoinSlice";
import TablePagination from "@/components/ui/dodo/TablePagination";
import Loading from "@/components/loading";
import { FilterControls } from "@/components/custom/filter-controls";
import { DateRange } from "react-day-picker";
import { selectBusiness } from "@/redux/slice/business/businessSlice";
import { Repeat } from "@phosphor-icons/react";

const Page = () => {
  const dispatch = useAppDispatch();
  const { subscriptions, updateBilling } = useAppSelector(
    (state) => state.subscription
  );
  const business = useAppSelector(selectBusiness);
  const [pageNumber, setPageNumber] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(
    undefined
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchSubscriptionsData = useCallback(async () => {
    const params = {
      pageSize: 10,
      pageNumber,
      status: statusFilter[0],
      created_at_gte: dateFilter?.from,
      created_at_lte: dateFilter?.to,
    };
    await dispatch(fetchSubscriptions(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pageNumber, statusFilter, dateFilter, refreshTrigger]);

  useEffect(() => {
    fetchSubscriptionsData();
  }, [fetchSubscriptionsData]);

  useEffect(() => {
    if (updateBilling.loading === false && !updateBilling.error) {
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [updateBilling.loading, updateBilling.error]);

  const renderContent = () => {
    if (subscriptions.loading) {
      return (
        <div className="flex justify-center items-center min-h-[calc(100vh-20rem)]">
          <Loading />
        </div>
      );
    }
    if (
      subscriptions.data.length === 0 &&
      !subscriptions.loading &&
      !Boolean(dateFilter) &&
      statusFilter.length === 0
    ) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-20rem)]">
          <span className="text-text-primary p-3 mb-3 bg-bg-secondary rounded-full">
            <Repeat className="w-6 h-6" />
          </span>
          <span className="text-base font-display text-center tracking-wide text-text-secondary">
            No Active Subscriptions
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <BaseDataTable
          data={subscriptions.data}
          columns={createSubscriptionColumns()}
        />
        <TablePagination
          currentPage={pageNumber}
          pageSize={10}
          currentPageItems={subscriptions.data.length}
          hasNextPage={subscriptions.data.length >= 10}
          onPageChange={setPageNumber}
        />
      </div>
    );
  };

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16  flex flex-col h-full">
      <PageHeader
        title="Subscriptions"
        description={`View all your subscriptions with ${business?.name}`}
        actions={
          <div className="flex items-center gap-2">
            <FilterControls
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              setPageNumber={setPageNumber}
              options={[
                { label: "Active", value: "active" },
                { label: "On Hold", value: "on_hold" },
                { label: "Cancelled", value: "cancelled" },
                { label: "Pending", value: "pending" },
                { label: "Expired", value: "expired" },
                { label: "Failed", value: "failed" },
              ]}
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
