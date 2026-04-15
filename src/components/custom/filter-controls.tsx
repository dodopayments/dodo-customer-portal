"use client";
import { DateRange } from "react-day-picker";
import DateFilter from "./date-filter";
import FilterButton from "./filter-dropdown";
import { useTranslations } from "next-intl";

export const FilterControls = ({
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter,
  setPageNumber,
  options,
}: {
  dateFilter: DateRange | undefined;
  setDateFilter: (range: DateRange | undefined) => void;
  statusFilter: string[];
  setStatusFilter: (value: string[]) => void;
  setPageNumber: (page: number) => void;
  options: { label: string; value: string }[];
}) => {
  const t = useTranslations("FilterControls");
  return (
    <div className="flex items-center gap-2">
      <DateFilter
        dateFilter={dateFilter}
        setPageNumber={setPageNumber}
        setDateFilter={setDateFilter}
      />
      <FilterButton
        filters={statusFilter[0]}
        setFilters={(value) => setStatusFilter(value ? [value] : [])}
        setPageNumber={setPageNumber}
        label={t("statusLabel")}
        options={options}
      />
    </div>
  );
};
