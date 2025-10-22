"use client";

import BaseDataTable from "@/components/custom/base-data-table";
import { createSubscriptionColumns } from "@/components/session/subscription-column";

interface SubscriptionsTableProps {
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
