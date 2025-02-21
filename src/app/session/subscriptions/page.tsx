import React from "react";
import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import BaseDataTable from "@/components/custom/base-data-table";
import { LicenseColumn } from "@/components/session/license-coloumn";

const Page = () => {
  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 flex flex-col h-full">
      <PageHeader
        title="Subscriptions"
        description="View all your active subscriptions with Marketly"
        actions={
          <div className="flex items-center gap-2">
            <button className="grid grid-cols-2 text-sm font-display overflow-hidden text-basefont-medium items-center gap-2 border border-border-secondary rounded-lg ">
              <span className="bg-button-secondary-bg py-2 w-24">Active</span>
              <span className="py-2 w-24">On Hold</span>
            </button>
          </div>
        }
      />
      <Separator className="my-6" />
      <div className="flex flex-col">
        <BaseDataTable data={[]} columns={LicenseColumn} />
      </div>
    </div>
  );
};

export default Page;
