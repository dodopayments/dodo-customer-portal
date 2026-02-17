"use client";

import { CreditEntitlementItem, CreditLedgerItem } from "@/app/session/profile/types";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditsTable } from "./credits-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function Credits({
  entitlements,
  allEntitlements,
  tab,
  creditLedger,
  currentPage,
  pageSize,
  currentPageItems,
  hasNextPage,
  baseUrl,
  pageParamKey,
}: {
  entitlements: CreditEntitlementItem[];
  allEntitlements: { value: string; label: string; link: string }[];
  tab: string;
  creditLedger: CreditLedgerItem[];
  currentPage: number;
  pageSize: number;
  currentPageItems: number;
  hasNextPage: boolean;
  baseUrl: string;
  pageParamKey?: string;
}) {
  const router = useRouter();

  if (allEntitlements.length === 0) {
    return <p className="text-text-secondary text-sm">No credits found</p>;
  }

  const selectedEntitlement = entitlements.find(
    (e) => e.credit_entitlement_id === tab
  ) || entitlements[0];

  const ledgerItems = creditLedger || [];
  const balance = Number(selectedEntitlement?.balance || 0);
  const overage = Number(selectedEntitlement?.overage || 0);
  const isOverage = balance === 0 && overage > 0;

  const handleEntitlementChange = (value: string) => {
    const selected = allEntitlements.find((e) => e.value === value);
    if (selected) {
      router.push(selected.link);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {entitlements.length > 1 && (
        <div>
          <Select value={tab} onValueChange={handleEntitlementChange}>
            <SelectTrigger className="w-fit min-w-[160px]">
              <SelectValue placeholder="Select credit entitlement" />
            </SelectTrigger>
            <SelectContent>
              {allEntitlements.map((entitlement) => (
                <SelectItem key={entitlement.value} value={entitlement.value}>
                  {entitlement.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <Card className="p-6 flex flex-col gap-4">
        <CardHeader className="flex flex-col gap-1 p-3 items-center">
          <CardTitle
            className={cn(
              "text-text-primary text-lg md:text-2xl font-medium text-center",
              isOverage ? "text-red-500" : "text-green-500"
            )}
          >
            {isOverage
              ? `${overage} ${selectedEntitlement?.unit || ""}`
              : `${balance} ${selectedEntitlement?.unit || ""}`}
          </CardTitle>
          <CardDescription className="text-text-secondary text-sm text-center">
            {isOverage ? "Overage balance" : "Available credit balance"}
          </CardDescription>
        </CardHeader>
        <Separator className="my-0" />
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="flex flex-col gap-2">
            <p className="text-sm">Recent Transactions</p>
            <CreditsTable
              creditLedger={ledgerItems}
              unit={selectedEntitlement?.unit || "credits"}
              currentPage={currentPage}
              pageSize={pageSize}
              currentPageItems={currentPageItems}
              hasNextPage={hasNextPage}
              baseUrl={baseUrl}
              pageParamKey={pageParamKey}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
