"use client";
import React, { useState, useEffect } from "react";
import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import BaseDataTable from "@/components/custom/base-data-table";
import { LicenseColumn } from "@/components/session/license-coloumn";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { fetchLicenses } from "@/redux/slice/license/licenseSlice";
import TablePagination from "@/components/ui/dodo/TablePagination";
import Loading from "@/components/loading";
import { FilterControls } from "@/components/custom/filter-controls";
import { DateRange } from "react-day-picker";

const Page = () => {
  const dispatch = useAppDispatch();
  const { licenses } = useAppSelector((state) => state.license);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchLicensesData = async () => {
      setIsLoading(true);
      const params = {
        pageSize: 10,
        pageNumber,
        status: statusFilter[0],
        created_at_gte: dateFilter?.from,
        created_at_lte: dateFilter?.to,
      };
      await dispatch(fetchLicenses(params));
      setIsLoading(false);
    };
    fetchLicensesData();
  }, [dispatch, pageNumber, statusFilter, dateFilter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 flex flex-col h-full">
      <PageHeader
        title="License Keys"
        description="View all your license keys shared by Marketly"
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
                { label: "Expired", value: "expired" },
              ]}
            />
          </div>
        }
      />
      <Separator className="my-6" />
      <div className="flex flex-col">
        <BaseDataTable data={licenses.data} columns={LicenseColumn} />
        <TablePagination
          currentPage={pageNumber}
          pageSize={10}
          currentPageItems={licenses.data.length}
          hasNextPage={licenses.data.length >= 10}
          onPageChange={setPageNumber}
        />
      </div>
    </div>
  );
};

export default Page;
