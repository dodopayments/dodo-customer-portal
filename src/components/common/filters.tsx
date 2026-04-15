"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import { useState, useEffect } from "react";
import { FilterControls } from "@/components/custom/filter-controls";
import { useTranslations } from "next-intl";

interface StatusOption {
  label: string;
  value: string;
}

interface FiltersProps {
  statusOptions: StatusOption[];
  showRefundsOption?: boolean;
  isRefundSection?: boolean;
}

export default function Filters({
  statusOptions,
  showRefundsOption = false,
  isRefundSection = false,
}: FiltersProps) {
  const t = useTranslations("BadgeStatus");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(() => {
    const dateFrom = searchParams.get(
      isRefundSection ? "refundDateFrom" : "dateFrom",
    );
    const dateTo = searchParams.get(
      isRefundSection ? "refundDateTo" : "dateTo",
    );
    if (dateFrom || dateTo) {
      return {
        from: dateFrom ? new Date(dateFrom) : undefined,
        to: dateTo ? new Date(dateTo) : undefined,
      };
    }
    return undefined;
  });

  const [statusFilter, setStatusFilter] = useState<string[]>(() => {
    const status = searchParams.get(
      isRefundSection ? "refundStatus" : "status",
    );
    return status ? [status] : [];
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }

    const params = new URLSearchParams();

    if (isRefundSection) {
      params.set("refundPage", "0");
    } else {
      params.set("page", "0");
    }

    if (dateFilter?.from) {
      params.set(
        isRefundSection ? "refundDateFrom" : "dateFrom",
        dateFilter.from.toISOString().split("T")[0],
      );
    }
    if (dateFilter?.to) {
      params.set(
        isRefundSection ? "refundDateTo" : "dateTo",
        dateFilter.to.toISOString().split("T")[0],
      );
    }
    if (statusFilter[0]) {
      params.set(isRefundSection ? "refundStatus" : "status", statusFilter[0]);
    }

    const newUrl = `?${params.toString()}`;
    const currentSearch = window.location.search;

    if (newUrl !== currentSearch) {
      router.replace(newUrl, { scroll: false });
    }
  }, [dateFilter, statusFilter, router, isRefundSection, isInitialized]);

  const handleSetPageNumber = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(isRefundSection ? "refundPage" : "page", page.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const options =
    statusOptions.length > 0
      ? statusOptions
      : showRefundsOption
        ? [
            { label: t("succeeded"), value: "succeeded" },
            { label: t("failed"), value: "failed" },
            { label: t("pending"), value: "pending" },
            { label: t("review"), value: "review" },
          ]
        : [
            { label: t("succeeded"), value: "succeeded" },
            { label: t("failed"), value: "failed" },
            { label: t("notInitiated"), value: "requires_payment_method" },
            { label: t("processing"), value: "processing" },
          ];

  return (
    <FilterControls
      dateFilter={dateFilter}
      setDateFilter={setDateFilter}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      setPageNumber={handleSetPageNumber}
      options={options}
    />
  );
}
