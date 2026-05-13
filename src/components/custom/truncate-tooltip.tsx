"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { CopyButton } from "../animate-ui/buttons/copy";

interface IDTooltipProps {
  idValue: string;
  className?: string;
}

const COPY_BUTTON_SPACE = 28;
const SUFFIX_LEN = 4;
const MONO_FONT =
  '13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

let sharedCanvas: HTMLCanvasElement | null = null;
function measureText(text: string): number {
  if (!sharedCanvas) sharedCanvas = document.createElement("canvas");
  const ctx = sharedCanvas.getContext("2d");
  if (!ctx) return text.length * 8;
  ctx.font = MONO_FONT;
  return ctx.measureText(text).width;
}

const IDTooltip: React.FC<IDTooltipProps> = ({ idValue, className }) => {
  const [copied, setCopied] = useState(false);
  const [parentWidth, setParentWidth] = useState(0);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = elRef.current?.parentElement;
    if (!parent) return;

    const update = () => setParentWidth(parent.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(idValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [idValue]);

  const usable = parentWidth - COPY_BUTTON_SPACE - 8;
  const fullWidth = measureText(idValue);
  const needsTruncation = parentWidth > 0 && fullWidth > usable;

  let displayValue = idValue;
  if (needsTruncation) {
    const charWidth = fullWidth / idValue.length;
    const maxChars = Math.floor(usable / charWidth);
    const prefixLen = Math.max(4, maxChars - SUFFIX_LEN - 1);
    displayValue = `${idValue.slice(0, prefixLen)}…${idValue.slice(-SUFFIX_LEN)}`;
  }

  const content = (
    <div ref={elRef} className="group/id flex items-center gap-0.5 min-w-0">
      <span
        className={cn("whitespace-nowrap font-mono text-[13px]", className)}
      >
        {displayValue}
      </span>
      <div
        data-no-row-click
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="shrink-0 opacity-0 group-hover/id:opacity-100 transition-opacity duration-150"
      >
        <CopyButton
          isCopied={copied}
          onCopyChange={setCopied}
          onClick={handleCopy}
          variant="ghost"
          size="sm"
          className="h-5 w-5 [&_svg]:size-3"
        />
      </div>
    </div>
  );

  if (!needsTruncation && !copied) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent className="bg-bg-primary max-w-md w-fit px-3 py-1.5 rounded-lg border-border-primary shadow-md">
          <p className="font-mono text-xs break-all">
            {copied ? "Copied!" : idValue}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default IDTooltip;
