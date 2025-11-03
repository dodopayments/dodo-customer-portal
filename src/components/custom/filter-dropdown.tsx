import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useId } from "react";
import { Sliders } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterButtonProps {
  filters: string | undefined;
  setFilters: (filters: string | undefined) => void;
  options: FilterOption[];
  label: string;
  className?: string;
  setPageNumber: (pageNumber: number) => void;
  buttonText?: string;
}

const FilterButton = ({
  filters,
  setFilters,
  options,
  label,
  buttonText = "Filters",
  className = "",
  setPageNumber,
}: FilterButtonProps) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<string | undefined>(filters);

  const handleCheckboxChange = (value: string) => {
    setTempFilters(tempFilters === value ? undefined : value);
  };

  const handleClear = () => {
    setTempFilters(undefined);
  };

  const handleApply = () => {
    Promise.all([setFilters(tempFilters), setPageNumber(0), setOpen(false)]);
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (isOpen) {
            setTempFilters(filters);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="secondary" className="flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            <span>{buttonText}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="end"
          className="w-44 p-3 border-border-secondary"
        >
          <div className="space-y-3">
            <div className="text-xs border-b border-border-secondary pb-2 font-medium text-text-secondary">
              Filter by :
            </div>
            <span className="text-xs py-3 font-normal text-text-secondary">
              {label}
            </span>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              {options.map((option, index) => (
                <div
                  key={option.value}
                  className="flex items-center justify-start gap-4"
                >
                  <Checkbox
                    id={`${id}-${index}`}
                    checked={tempFilters === option.value}
                    onCheckedChange={() => handleCheckboxChange(option.value)}
                  />
                  <Label
                    htmlFor={`${id}-${index}`}
                    className="font-normal text-sm"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
              <div
                role="separator"
                aria-orientation="horizontal"
                className="-mx-3 my-1 h-px bg-border-secondary"
              />
              <div className="flex justify-between gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-7 text-xs px-5"
                  onClick={handleClear}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-7 text-xs px-5"
                  onClick={handleApply}
                >
                  Filter
                </Button>
              </div>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterButton;
