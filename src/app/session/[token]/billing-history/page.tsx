import React from "react";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BaseDataTable from "@/components/custom/base-data-table";
import { PaymentColumn } from "@/components/session/payments-coloumn";
import { RefundColumn } from "@/components/session/refunds-coloumn";

const Page = () => {
  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 flex flex-col h-full">
      <PageHeader
        title="Billing History"
        description="View all your orders with Turbo Repo"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary"> Download CSV</Button>
            <Button variant="secondary"> Filter</Button>
          </div>
        }
      />
      <Separator className="my-6" />
      <div className="flex flex-col gap-4">
        <span className=" font-display font-medium text-lg">Payments</span>
        <div className="flex flex-col">
          <BaseDataTable data={[]} columns={PaymentColumn} />
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-6">
        <span className=" font-display font-medium text-lg">Refunds</span>
        <div className="flex flex-col">
          <BaseDataTable data={[]} columns={RefundColumn} />
        </div>
      </div>
    </div>
  );
};

export default Page;
