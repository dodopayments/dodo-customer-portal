import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface PrefixedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixClassName?: string;
}

const PrefixedInput = React.forwardRef<HTMLInputElement, PrefixedInputProps>(
  ({ className, value = "", onChange, prefixClassName, ...props }, ref) => {
    // Ensure value is a string and strip the prefix if it exists
    const displayValue =
      typeof value === "string" && value.startsWith("https://")
        ? value.slice("https://".length)
        : value;

    // Handle the change event to ensure prefix is consistently added
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      const prefixedValue = newValue.startsWith("https://")
        ? newValue // Avoid adding the prefix again
        : `https://${newValue}`;

      if (onChange) {
        // Create a new event with the modified value
        const newEvent = {
          ...e,
          target: {
            ...e.target,
            value: prefixedValue,
          },
        };
        onChange(newEvent as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <div className="flex rounded-lg shadow-sm shadow-black/[.04]">
        <span
          className={cn(
            "inline-flex items-center rounded-s-lg border border-border-primary bg-bg-primary px-3 text-sm text-text-placeholder",
            prefixClassName,
          )}
        >
          https://
        </span>
        <Input
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          className={cn("-ms-px rounded-s-none shadow-none", className)}
          {...props}
        />
      </div>
    );
  },
);

PrefixedInput.displayName = "PrefixedInput";

export { PrefixedInput };
