"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { House, Copy, Check, Laptop } from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TimeTooltipProps {
  timeStamp: string; // ISO string
  className?: string;
}

function getDeviceTimezoneOffset(): string {
  const offset = -new Date().getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const hours = Math.floor(Math.abs(offset) / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (Math.abs(offset) % 60).toString().padStart(2, "0");
  return `UTC${sign}${hours}:${minutes}`;
}

function formatDateTime(dateString: string, timeZone: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    weekday: "short",
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

function TimeTriggerFormat(dateString: string): string {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
  return formattedDate;
}

interface TimeDisplayProps {
  icon: React.ReactNode;
  title: string;
  timezone: string;
  time: string;
  bold?: boolean;
  onCopy: () => void;
  isCopied: boolean;
}

function TimeDisplay({
  icon,
  title,
  bold,
  timezone,
  time,
  onCopy,
  isCopied,
}: TimeDisplayProps) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex flex-col items-start gap-1.5">
        <div className="flex items-center gap-2">
          {icon}
          <span
            className={cn(
              "text-sm text-text-secondary font-semibold",
              bold && "text-text-primary"
            )}
          >
            {title}
          </span>
          <span className="text-[13px] text-text-secondary">{timezone}</span>
        </div>
        <span className="text-[13px] text-text-secondary">{time}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onCopy}
        aria-label={`Copy ${title.toLowerCase()} time`}
      >
        {isCopied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}

export function TimeTooltip({ timeStamp, className }: TimeTooltipProps) {
  const [copied, setCopied] = useState<"device" | "project" | null>(null);
  const deviceTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const deviceOffset = getDeviceTimezoneOffset();
  const deviceTime = formatDateTime(timeStamp, deviceTz);
  const displayTime = TimeTriggerFormat(timeStamp);
  const utcTime = formatDateTime(timeStamp, "UTC");

  function handleCopy(value: string, type: "device" | "project") {
    navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger
          className={cn(
            "hover:underline flex items-center justify-start min-w-28",
            className
          )}
        >
          {displayTime}
        </TooltipTrigger>
        <TooltipContent
          className="max-w-md w-full p-0 rounded-lg border shadow-lg bg-bg-primary"
          sideOffset={5}
        >
          <div className="px-4 pt-4 pb-2">
            <h3 className="font-medium font-display text-base">
              Timezone conversion
            </h3>
          </div>
          <Separator className="my-1" />
          <div className="flex flex-col gap-4 pt-2 px-4 pb-4">
            <TimeDisplay
              icon={<Laptop className="w-5 h-5 text-text-secondary" />}
              title="Your device"
              bold={true}
              timezone={deviceOffset}
              time={deviceTime}
              onCopy={() => handleCopy(deviceTime, "device")}
              isCopied={copied === "device"}
            />
            <TimeDisplay
              icon={<House className="w-5 h-5 text-text-secondary" />}
              title="System"
              timezone="UTC"
              time={utcTime}
              onCopy={() => handleCopy(utcTime, "project")}
              isCopied={copied === "project"}
            />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default TimeTooltip;
