"use client";
import React from "react";
import { Copy } from "lucide-react";
import { Check } from "@phosphor-icons/react";
import { TooltipProvider } from "../ui/tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Button } from "../ui/button";

interface IDTooltipProps {
  idValue: string;
}

const IDTooltip: React.FC<IDTooltipProps> = ({ idValue }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(idValue);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <div className="flex items-center">
          <TooltipTrigger className="truncate px-1 max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
            <span>{idValue}</span>
          </TooltipTrigger>

          <TooltipContent className="bg-bg-primary max-w-md flex items-center w-fit px-2 py-1 rounded-lg border-border-secondary shadow-md">
            {idValue}
            <Button
              variant="ghost"
              className="ml-2 hover:bg-transparent p-0"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="w-3 text-text-success-primary h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </TooltipContent>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
};

export default IDTooltip;


