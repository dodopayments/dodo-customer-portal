"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CaretDown } from "@phosphor-icons/react";
import { UsageHistoryItem } from "./subscription-tabs-table";
import { TimeTooltip } from "../custom/time-tooltip";
import { UsageHistoryDetails } from "./usage-history-details";
import ServerPagination from "@/components/common/server-pagination";
import { CircleSlash } from "lucide-react";

interface UsageSummaryProps {
  usageHistory: UsageHistoryItem[];
  subscriptionId?: string;
  currentPage: number;
  pageSize: number;
  currentPageItems: number;
  hasNextPage: boolean;
  baseUrl: string;
  pageParamKey?: string;
}

export function UsageSummary({
  usageHistory,
  subscriptionId,
  currentPage,
  pageSize,
  currentPageItems,
  hasNextPage,
  baseUrl,
  pageParamKey,
}: UsageSummaryProps) {
  const isEmpty = usageHistory.length === 0;
  const emptyMessage =
    currentPage > 0
      ? "No usage history found on this page"
      : "No usage history at the moment";

  return (
    <div className="flex flex-col gap-4">
      {isEmpty ? (
        <div className="flex flex-col justify-center items-center min-h-[200px] my-auto">
          <span className="text-text-primary p-3 mb-3 bg-bg-secondary rounded-full text-2xl">
            <CircleSlash />
          </span>
          <span className="text-sm font-display text-center tracking-wide text-text-secondary">
            {emptyMessage}
          </span>
        </div>
      ) : (
        <>
          {usageHistory.map((usage) => (
            <Collapsible key={usage.start_date} defaultOpen>
              <CollapsibleTrigger className="w-full border-b border-border-secondary py-2 flex items-center justify-between">
                <span className="text-text-primary flex items-center gap-4 w-full font-display font-medium text-base">
                  <TimeTooltip
                    className="w-fit min-w-0"
                    timeStamp={usage.start_date}
                  />{" "}
                  -
                  <TimeTooltip className="w-fit" timeStamp={usage.end_date} />
                </span>
                <CaretDown className="h-4 w-4 data-[state=open]:rotate-180 transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <UsageHistoryDetails
                  sub_id={subscriptionId || ""}
                  usageHistory={usage.meters}
                  setUsageHistoryPageNumber={() => {}}
                  pageSize={pageSize}
                  setPageSize={() => {}}
                  isLoading={false}
                />
              </CollapsibleContent>
            </Collapsible>
          ))}
          <ServerPagination
            currentPage={currentPage}
            pageSize={pageSize}
            currentPageItems={currentPageItems}
            hasNextPage={hasNextPage}
            baseUrl={baseUrl}
            pageParamKey={pageParamKey}
          />
        </>
      )}
    </div>
  );
}
