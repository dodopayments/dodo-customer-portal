import React from "react";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BaseDataTable from "@/components/custom/base-data-table";
import { LicenseColumn } from "@/components/session/license-coloumn";

const Page = () => {
  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 flex flex-col h-full">
      <PageHeader
        title="License Keys"
        description="View all your license keys shared by Marketly"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary"> Download CSV</Button>
            <Button variant="secondary"> Filter</Button>
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
