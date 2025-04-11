import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

const SelectNative = ({ className, children, ...props }: React.ComponentProps<"select">) => {
  return (
    <div className="relative flex">
      <select

        data-slot="select-native"
        style={{
            appearance: "none",
        }}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-start text-sm text-text-primary shadow-sm shadow-black/5 focus:border-border-brand focus:outline-none focus:ring-[2px] focus:ring-border-brand disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-text-placeholder [&>span]:min-w-0",
          props.multiple ? "[&_option:checked]:bg-accent py-1 *:px-3 *:py-1" : "h-9 ps-3 pe-8",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {!props.multiple && (
        <span className="text-text-secondary/80 peer-aria-invalid:text-destructive/80 pointer-events-none absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center peer-disabled:opacity-50">
          <ChevronDownIcon size={16} aria-hidden="true" />
        </span>
      )}
    </div>
  );
};

export { SelectNative };