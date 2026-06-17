"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TimeTooltipProps {
  timeStamp: string;
  className?: string;
  showyear?: boolean;
}

function formatDateTime(dateString: string, timeZone: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone,
  });
}

function TimeTriggerFormat(dateString: string, showyear?: boolean): string {
  const date = new Date(dateString);
  if (showyear) {
    return date.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

function getTimestamp(dateString: string): string {
  return new Date(dateString).getTime().toString();
}

interface TimeRowProps {
  label: string;
  value: string;
  onCopy: () => void;
}

function TimeRow({ label, value, onCopy }: TimeRowProps) {
  return (
    <div
      onClick={onCopy}
      className="flex items-center justify-between gap-8 text-xs cursor-pointer rounded px-2 py-1 transition-colors hover:bg-bg-secondary"
    >
      <span className="text-text-secondary font-display">{label}:</span>
      <span className="text-text-primary">{value}</span>
    </div>
  );
}

let sharedInterval: NodeJS.Timeout | null = null;
const subscribers = new Set<() => void>();
let intervalCount = 0;

function subscribeToInterval(callback: () => void) {
  subscribers.add(callback);
  intervalCount++;

  if (!sharedInterval) {
    sharedInterval = setInterval(() => {
      subscribers.forEach((cb) => cb());
    }, 30000);
  }

  return () => {
    subscribers.delete(callback);
    intervalCount--;

    if (intervalCount === 0 && sharedInterval) {
      clearInterval(sharedInterval);
      sharedInterval = null;
    }
  };
}

export function TimeTooltip({
  timeStamp,
  className,
  showyear,
}: TimeTooltipProps) {
  const [relativeTime, setRelativeTime] = useState(() =>
    formatRelativeTime(timeStamp)
  );

  const deviceTz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );

  const localTime = useMemo(
    () => formatDateTime(timeStamp, deviceTz),
    [timeStamp, deviceTz]
  );

  const utcTime = useMemo(() => formatDateTime(timeStamp, "UTC"), [timeStamp]);

  const timestamp = useMemo(() => getTimestamp(timeStamp), [timeStamp]);

  const displayTime = useMemo(
    () => TimeTriggerFormat(timeStamp, showyear),
    [timeStamp, showyear]
  );

  useEffect(() => {
    const updateRelativeTime = () => {
      setRelativeTime(formatRelativeTime(timeStamp));
    };

    updateRelativeTime();

    const unsubscribe = subscribeToInterval(updateRelativeTime);

    return unsubscribe;
  }, [timeStamp]);

  const handleCopy = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  }, []);

  const handleCopyLocal = useCallback(
    () => handleCopy(localTime),
    [handleCopy, localTime]
  );
  const handleCopyUtc = useCallback(
    () => handleCopy(utcTime),
    [handleCopy, utcTime]
  );
  const handleCopyRelative = useCallback(
    () => handleCopy(relativeTime),
    [handleCopy, relativeTime]
  );
  const handleCopyTimestamp = useCallback(
    () => handleCopy(timestamp),
    [handleCopy, timestamp]
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger
          className={cn(
            "hover:decoration-dotted hover:underline decoration-text-primary underline-offset-2 flex items-center justify-start min-w-28",
            className
          )}
        >
          {displayTime}
        </TooltipTrigger>
        <TooltipContent
          className="max-w-md w-full p-3 rounded-md border border-border-primary shadow-lg bg-bg-primary"
          sideOffset={5}
        >
          <div className="flex flex-col gap-2">
            <TimeRow
              label={deviceTz}
              value={localTime}
              onCopy={handleCopyLocal}
            />
            <TimeRow label="UTC" value={utcTime} onCopy={handleCopyUtc} />
            <TimeRow
              label="Relative"
              value={relativeTime}
              onCopy={handleCopyRelative}
            />
            <TimeRow
              label="Timestamp"
              value={timestamp}
              onCopy={handleCopyTimestamp}
            />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default TimeTooltip;
