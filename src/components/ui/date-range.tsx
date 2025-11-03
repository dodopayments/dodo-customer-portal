"use client";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDots } from "@phosphor-icons/react";

export default function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(
    null,
  );

  const presets = [
    {
      label: "Today",
      dates: { from: new Date(), to: new Date() },
    },
    {
      label: "Yesterday",
      dates: { from: addDays(new Date(), -1), to: addDays(new Date(), -1) },
    },
    {
      label: "Last 7 days",
      dates: { from: addDays(new Date(), -6), to: new Date() },
    },
    {
      label: "Last 30 days",
      dates: { from: addDays(new Date(), -29), to: new Date() },
    },
    {
      label: "This week",
      dates: { from: startOfWeek(new Date()), to: endOfWeek(new Date()) },
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
  ];

  const onPresetSelect = (preset: { label: string; dates: DateRange }) => {
    setDate(preset.dates);
    setSelectedPreset(preset.label);
  };

  const onCalendarSelect = (newDate: DateRange | undefined) => {
    setDate(newDate);
    setSelectedPreset(null);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"secondary"}
            className={cn(
              "w-[250px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarDots className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex">
            <ScrollArea className="h-[300px] w-[150px] bg-bg-primary border-r">
              <div className="p-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    onClick={() => onPresetSelect(preset)}
                    variant={
                      selectedPreset === preset.label ? "default" : "ghost"
                    }
                    className="w-full justify-start font-normal"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <div className="flex flex-col">
              <div className="flex">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={onCalendarSelect}
                  numberOfMonths={1}
                />
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={
                    date?.to || addDays(date?.from || new Date(), 31)
                  }
                  selected={date}
                  onSelect={onCalendarSelect}
                  numberOfMonths={1}
                />
              </div>
              {selectedPreset && (
                <div className="px-3 py-2 text-center text-sm text-muted-foreground">
                  {selectedPreset} selected
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
