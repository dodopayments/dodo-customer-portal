"use client";

import BaseDataTable from "@/components/custom/base-data-table";
import { createSubscriptionColumns } from "@/components/session/subscription-column";

interface SubscriptionsTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}

export default function SubscriptionsTable({ data }: SubscriptionsTableProps) {
  return (
    <BaseDataTable
      data={data}
      columns={createSubscriptionColumns()}
    />
  );
}
