"use client";
import React, { useState, useEffect } from "react";
import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import BaseDataTable from "@/components/custom/base-data-table";
import { PaymentColumn } from "@/components/session/payments-coloumn";
import { RefundColumn } from "@/components/session/refunds-coloumn";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  fetchPayments,
  fetchRefunds,
} from "@/redux/slice/transaction/transactionSlice";
import TablePagination from "@/components/ui/dodo/TablePagination";
import FilterButton from "@/components/custom/filter-dropdown";
import { DateRange } from "react-day-picker";
import DateFilter from "@/components/custom/date-filter";

const STATUS_OPTIONS = [
  { label: "In Progress", value: "processing" },
  { label: "Successful", value: "succeeded" },
  { label: "Failed", value: "failed" },
  { label: "Not Initiated", value: "requires_payment_method" },
];

const FilterControls = ({
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter,
  setPageNumber,
}: {
  dateFilter: DateRange | undefined;
  setDateFilter: (range: DateRange | undefined) => void;
  statusFilter: string[];
  setStatusFilter: (value: string[]) => void;
  setPageNumber: (page: number) => void;
}) => (
  <div className="flex items-center gap-2">
    <DateFilter
      dateFilter={dateFilter}
      setPageNumber={setPageNumber}
      setDateFilter={setDateFilter}
    />
    <FilterButton
      filters={statusFilter[0]}
      setFilters={(value) => setStatusFilter(value ? [value] : [])}
      setPageNumber={setPageNumber}
      label="Status"
      options={STATUS_OPTIONS}
    />
  </div>
);

const Page = () => {
  const dispatch = useAppDispatch();
  const { payments, refunds } = useAppSelector((state) => state.transaction);
  
  // Payments state
  const [pageNumberPayments, setPageNumberPayments] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>();
  
  // Refunds state
  const [pageNumberRefunds, setPageNumberRefunds] = useState(0);
  const [statusFilterRefunds, setStatusFilterRefunds] = useState<string[]>([]);
  const [dateFilterRefunds, setDateFilterRefunds] = useState<DateRange | undefined>();

  // Fetch payments
  useEffect(() => {
    const params = {
      pageSize: 10,
      pageNumber: pageNumberPayments,
      created_at_gte: dateFilter?.from,
      created_at_lte: dateFilter?.to,
      status: statusFilter[0],
    };
    dispatch(fetchPayments(params));
  }, [dispatch, pageNumberPayments, dateFilter, statusFilter]);

  // Fetch refunds
  useEffect(() => {
    const params = {
      pageSize: 10,
      pageNumber: pageNumberRefunds,
      created_at_gte: dateFilterRefunds?.from,
      created_at_lte: dateFilterRefunds?.to,
      status: statusFilterRefunds[0],
    };
    dispatch(fetchRefunds(params));
  }, [dispatch, pageNumberRefunds, dateFilterRefunds, statusFilterRefunds]);

  const showRefunds = refunds.data.length != 0 || dateFilterRefunds || statusFilterRefunds;

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6  flex flex-col h-full">
      <PageHeader
        title="Billing History"
        description="View all your orders with Turbo Repo"
        actions={
          !showRefunds && (
            <FilterControls
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              setPageNumber={setPageNumberPayments}
            />
          )
        }
      />
      <Separator className="my-6" />
      
      {/* Payments Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-display font-medium text-lg">Payments</span>
          {showRefunds && (
            <FilterControls
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              setPageNumber={setPageNumberPayments}
            />
          )}
        </div>
        <div className="flex flex-col">
          <BaseDataTable data={payments.data} columns={PaymentColumn} />
          <TablePagination
            currentPage={pageNumberPayments}
            pageSize={10}
            currentPageItems={payments.data.length}
            hasNextPage={payments.data.length >= 10}
            onPageChange={setPageNumberPayments}
          />
        </div>
      </div>

      {/* Refunds Section */}
      {showRefunds && (
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex items-center justify-between">
            <span className="font-display font-medium text-lg">Refunds</span>
            <FilterControls
              dateFilter={dateFilterRefunds}
              setDateFilter={setDateFilterRefunds}
              statusFilter={statusFilterRefunds}
              setStatusFilter={setStatusFilterRefunds}
              setPageNumber={setPageNumberRefunds}
            />
          </div>
          <div className="flex flex-col">
            <BaseDataTable data={refunds.data} columns={RefundColumn} />
            <TablePagination
              currentPage={pageNumberRefunds}
              pageSize={10}
              currentPageItems={refunds.data.length}
              hasNextPage={refunds.data.length >= 10}
              onPageChange={setPageNumberRefunds}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
