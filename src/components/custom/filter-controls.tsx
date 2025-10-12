import { DateRange } from "react-day-picker";
import DateFilter from "./date-filter";
import FilterButton from "./filter-dropdown";

export const FilterControls = ({
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter,
  setPageNumber,
  options,
  disableFilter,
}: {
  dateFilter: DateRange | undefined;
  setDateFilter: (range: DateRange | undefined) => void;
  statusFilter?: string[];
  disableFilter?: boolean;
  setStatusFilter?: (value: string[]) => void;
  setPageNumber: (page: number) => void;
  options?: { label: string; value: string }[];
}) => (
  <div className="flex items-center gap-2">
    <DateFilter
      dateFilter={dateFilter}
      setPageNumber={setPageNumber}
      setDateFilter={setDateFilter}
    />
    {!disableFilter && (
      <FilterButton
        filters={statusFilter?.[0]}
        setFilters={(value) => setStatusFilter?.(value ? [value] : [])}
        setPageNumber={setPageNumber}
        label="Status"
        options={options ?? []}
      />
    )}
  </div>
);
