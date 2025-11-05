"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CaretDown } from "@phosphor-icons/react";
import { UsageHistoryItem } from "./subscription-tabs-table";
import { TimeTooltip } from "../custom/time-tooltip";
import { UsageHistoryDetails } from "./usage-history-details";
import TablePagination from "@/components/ui/dodo/TablePagination";

interface UsageSummaryProps {
  usageHistory: UsageHistoryItem[];
  subscriptionId?: string;
}

export function UsageSummary({
  usageHistory,
  subscriptionId,
}: UsageSummaryProps) {
  const [usageHistoryPageNumber, setUsageHistoryPageNumber] = useState(0);
  const [usageHistoryPageSize, setUsageHistoryPageSize] = useState(10);

  const paginatedUsageHistory = usageHistory.slice(
    usageHistoryPageNumber * usageHistoryPageSize,
    (usageHistoryPageNumber + 1) * usageHistoryPageSize
  );

  return (
    <div className="flex flex-col gap-4">
      {usageHistory.length > 0 ? (
        <>
          {paginatedUsageHistory.map((usage) => (
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
                  setUsageHistoryPageNumber={setUsageHistoryPageNumber}
                  pageSize={usageHistoryPageSize}
                  setPageSize={setUsageHistoryPageSize}
                  isLoading={false}
                />
              </CollapsibleContent>
            </Collapsible>
          ))}
          <TablePagination
            currentPage={usageHistoryPageNumber}
            pageSize={usageHistoryPageSize}
            currentPageItems={paginatedUsageHistory.length}
            hasNextPage={
              usageHistory.length >
              (usageHistoryPageNumber + 1) * usageHistoryPageSize
            }
            onPageChange={setUsageHistoryPageNumber}
          />
        </>
      ) : (
        <div className="h-40 flex items-center justify-center">
          <span className="text-text-secondary text-base">
            No usage history found
          </span>
        </div>
      )}
    </div>
  );
}
