import * as React from "react";
import {
  addDays,
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarDots, X } from "@phosphor-icons/react";

interface DateFilterProps {
  className?: string;
  dateFilter: DateRange | undefined;
  setDateFilter: (dateFilter: DateRange | undefined) => void;
  setPageNumber: (pageNumber: number) => void;
}

export default function DateFilter({
  className,
  dateFilter,
  setDateFilter,
  setPageNumber,
}: DateFilterProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: dateFilter?.from,
    to: dateFilter?.to,
  });

  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(
    null
  );
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(true);

  const presets = [
    { label: "Today", dates: { from: new Date(), to: new Date() } },
    {
      label: "Yesterday",
      dates: { from: addDays(new Date(), -1), to: addDays(new Date(), -1) },
    },
    {
      label: "This week",
      dates: { from: startOfWeek(new Date()), to: endOfWeek(new Date()) },
    },
    {
      label: "Last week",
      dates: {
        from: startOfWeek(addDays(new Date(), -7)),
        to: endOfWeek(addDays(new Date(), -7)),
      },
    },
    {
      label: "This month",
      dates: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
    },
    {
      label: "Last month",
      dates: {
        from: startOfMonth(subMonths(new Date(), 1)),
        to: endOfMonth(subMonths(new Date(), 1)),
      },
    },
    {
      label: "This year",
      dates: {
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(new Date().getFullYear(), 11, 31),
      },
    },
    {
      label: "Last year",
      dates: {
        from: new Date(new Date().getFullYear() - 1, 0, 1),
        to: new Date(new Date().getFullYear() - 1, 11, 31),
      },
    },
    {
      label: "All time",
      dates: {
        from: new Date(2020, 0, 1),
        to: new Date(),
      },
    },
  ];

  const onPresetSelect = (preset: { label: string; dates: DateRange }) => {
    setDate(preset.dates);
    setSelectedPreset(preset.label);
  };

  const onCalendarSelect = (newDate: DateRange | undefined) => {
    setDate(newDate);
    setSelectedPreset(null);
  };

  const handleFilter = () => {
    if (date?.from && date?.to) {
      Promise.all([
        setPageNumber(0),
        setDateFilter({ from: date.from, to: date.to }),
      ]);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Dialog>
        {date?.from && date?.to ? (
          <Button variant="secondary" onClick={() => {
            setDateFilter(undefined)
            setDate({from: undefined, to: undefined})
            setPageNumber(0)
          }}>
            <CalendarDots className="w-5 h-5 mr-1" />
            <>
              <span>
                {format(date.from, "MMM d, yyyy")} -{" "}
                {format(date.to, "MMM d, yyyy")}
              </span>
              <X
                className="w-4 h-4 ml-2"
              />
            </>
          </Button>
        ) : (
          <DialogTrigger asChild>
            <Button variant="secondary">
              <CalendarDots className="w-5 h-5 mr-1" />
              Select Date Range
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="p-0 w-full overflow-y-auto py-5 sm:py-0 h-[100dvh] md:h-fit sm:min-h-fit sm:max-w-[90vw] md:max-w-[855px]">
          <DialogHeader className="p-4 pb-0 space-y-2">
            <div className="bg-bg-secondary w-fit rounded-full p-3">
              <CalendarDots className="w-5 h-5" />
            </div>
            <DialogTitle>Select Date Range</DialogTitle>
            <DialogDescription>
              Select the date range to filter the data
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col w-fulls sm:flex-row mx-4 mt-2">
            {/* Mobile View Toggle */}
            <div className="sm:hidden flex space-x-2 mb-4">
              <Button
                variant={!isCalendarOpen ? "secondary" : "ghost"}
                className="flex-1"
                onClick={() => setIsCalendarOpen(false)}
              >
                Presets
              </Button>
              <Button
                variant={isCalendarOpen ? "secondary" : "ghost"}
                className="flex-1"
                onClick={() => setIsCalendarOpen(true)}
              >
                Calendar
              </Button>
            </div>

            {/* Presets Section - Hidden on mobile when calendar is open */}
            <div
              className={cn(
                "sm:block",
                { hidden: isCalendarOpen },
                "sm:w-[200px]"
              )}
            >
              <div className=" border rounded-md sm:rounded-r-none border-border-secondary h-full border-r-0">
                <ScrollArea className="h-[350px] w-full">
                  <div className="p-3">
                    {presets.map((preset) => (
                      <Button
                        key={preset.label}
                        onClick={() => onPresetSelect(preset)}
                        variant={
                          selectedPreset === preset.label
                            ? "secondary"
                            : "ghost"
                        }
                        className="w-full justify-start font-normal mb-1"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Calendar Section - Hidden on mobile when presets are open */}
            <div
              className={cn(
                "sm:block border rounded-md sm:rounded-l-none border-border-secondary sm:border-l",
                { hidden: !isCalendarOpen },
                "flex-1"
              )}
            >
              <div className="p-3 pb-0">
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={onCalendarSelect}
                    numberOfMonths={1}
                    className="w-full rounded-md border"
                  />
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={addDays(date?.from || new Date(), 31)}
                    selected={date}
                    onSelect={onCalendarSelect}
                    numberOfMonths={1}
                    className="w-full rounded-md border"
                  />
                </div>
                {date?.from && date?.to && (
                  <div className="flex flex-wrap items-center gap-2 text-sm py-4">
                    <div className="rounded-md border shadow-sm px-3 py-2">
                      {format(date.from, "MMM d, yyyy")}
                    </div>
                    <span>–</span>
                    <div className="rounded-md shadow-sm border px-3 py-2">
                      {format(date.to, "MMM d, yyyy")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between  items-center p-4 pt-2 w-full">
            <div className="w-full">
              <DialogClose asChild>
                <Button variant="secondary" className="w-full">
                  Cancel
                </Button>
              </DialogClose>
            </div>
            <DialogClose asChild>
              <Button onClick={handleFilter} className="w-full">
                Apply Filter
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
