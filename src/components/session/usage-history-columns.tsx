"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { UsageHistoryMeter } from "./subscription-tabs-table";
import { getCurrencySymbol, decodeFloatCurrency } from "@/lib/currency-helper";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function UsageHistoryColumns({ sub_id }: { sub_id: string }): ColumnDef<UsageHistoryMeter>[] {
  const router = useRouter();
  const t = useTranslations("UsageHistoryColumns");
  return [
    {
      id: "name",
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("meterName")}
          visibility={true}
          column={column}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium text-text-primary">
            {row.original.name}
          </div>
        );
      },
      enableSorting: true,
      enableColumnFilter: true,
      size: 200,
    },
    {
      id: "id",
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("meterId")}
          visibility={true}
          column={column}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium text-text-primary">
            {row.original.id}
          </div>
        );
      },
      enableSorting: true,
      enableColumnFilter: true,
      size: 200,
    },
    {
      id: "consumed_units",
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("consumedUnits")}
          visibility={true}
          column={column}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium text-text-primary">
            {row.original.consumed_units}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
      size: 150,
    },
    {
      id: "chargeable_units",
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("chargeableUnits")}
          visibility={true}
          column={column}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium text-text-primary">
            {row.original.chargeable_units}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
      size: 120,
    },
    {
      id: "free_threshold",
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("freeThreshold")}
          visibility={true}
          column={column}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium text-text-primary">
            {row.original.free_threshold} {t("units")}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
      size: 120,
    },
    {
      id: "price_per_unit",
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("unitPrice")}
          visibility={true}
          column={column}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium text-text-primary">
            {getCurrencySymbol(row.original.currency)}{" "}
            {decodeFloatCurrency({
              value: Number(row.original.price_per_unit),
              currency: row.original.currency,
            })}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
      size: 120,
    },
    {
      id: "total_price",
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("totalCost")}
          visibility={true}
          column={column}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium text-text-primary">
            {getCurrencySymbol(row.original.currency)}{" "}
            {decodeFloatCurrency({
              value: Number(row.original.total_price),
              currency: row.original.currency,
            })}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
      size: 120,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataGridColumnHeader
          title={t("actions")}
          visibility={true}
          column={column}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium text-text-primary">
            <Button variant="secondary" onClick={() => {
              router.push(`/session/subscriptions/${sub_id}/${row.original.id}`);
            }}>
              {t("view")}
            </Button>
          </div>
        );
      },
    },
  ];
}

