import React from "react";
import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Page = () => {
  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 flex flex-col h-full">
      <PageHeader title="Profile" description="View your profile information" />
      <Separator className="my-6" />
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input disabled value="John Doe" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input disabled value="john.doe@example.com" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input disabled value="+1234567890" />
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Input disabled value="John Doe" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
