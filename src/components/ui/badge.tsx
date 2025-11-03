import { cn } from "@/lib/utils";
import React, { ForwardedRef, HTMLAttributes } from "react";

export type BadgeVariant =
  | "default"
  | "red"
  | "yellow"
  | "green"
  | "purple"
  | "blue"
  | "pink"
  | "orange"
  | "orange2"
  | "generic";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  type?: "default" | "icon";
}

const badgeVariants: Record<BadgeVariant, string> = {
  default:
    "bg-[#F9FAFB] text-[#344054] border-[#E4E7EC] dark:bg-[#161B26] dark:text-[#CECFD2] dark:border-[#333741]",
  red: "bg-[#FEF3F2] text-[#B42318] border-[#FECDCA] dark:bg-[#55160C] dark:text-[#FDA29B] dark:border-[#912018]",
  yellow:
    "bg-[#FFFAEB] text-[#B54708] border-[#FEDF89] dark:bg-[#4E1D09] dark:text-[#FEC84B] dark:border-[#93370D]",
  green:
    "bg-[#ECFDF3] text-[#067647] border-[#ABEFC6] dark:bg-[#053321] dark:text-[#75E0A7] dark:border-[#085D3A]",
  purple:
    "bg-[#F4F3FF] text-[#5925DC] border-[#D9D6FE] dark:bg-[#27115F] dark:text-[#BDB4FE] dark:border-[#4A1FB8]",
  blue: "bg-[#F0F9FF] text-[#175CD3] border-[#B9E6FE] dark:bg-[#102A56] dark:text-[#84CAFF] dark:border-[#1849A9]",
  pink: "bg-[#FDF2F8] text-[#C11574] border-[#FCCEEE] dark:bg-[#4E0D30] dark:text-[#FAA7E0] dark:border-[#9E165F]",
  orange:
    "dark:bg-[#4E1D09] bg-[#EF6820] dark:text-[#F79009] text-white border dark:border-[#932F19] border-[#EF6820]",
  orange2:
    "dark:bg-[#4E1D09] bg-[#FEF6EE] dark:text-[#F79009] text-[#B93815] dark:border-[#932F19] border-[#F9DBAF]",
  generic:
    "bg-[#F9FAFB] text-[#344054] border-[#E4E7EC] dark:bg-[#161B26] dark:text-[#CECFD2] dark:border-[#333741] px-2 rounded-md",
};

const circleColors: Record<BadgeVariant, string> = {
  default: "text-[#667085] dark:text-[#85888E]",
  red: "text-red-500 dark:text-red-400",
  yellow: "text-yellow-500 dark:text-[#F79009]",
  green: "text-green-500 dark:text-[#17B26A]",
  purple: "text-purple-500 dark:text-[#7A5AF8]",
  blue: "text-blue-500 dark:text-[#2E90FA]",
  pink: "text-pink-500 dark:text-[#EE46BC]",
  orange: "dark:text-[#EF6820] text-white",
  orange2: "dark:text-[#EF6820] text-[#B93815]",
  generic: "text-[#667085] dark:text-[#85888E]",
};

const badgeTypes = {
  default:
    "inline-flex font-body text-nowrap w-fit border-[1px] text-xs items-center rounded-md px-2 py-0.5 font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  icon: "p-[5px] rounded-md border",
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className = "",
      variant = "default",
      dot = false,
      type = "default",
      children,
      ...props
    },
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(badgeTypes[type], badgeVariants[variant], className)}
        {...props}
      >
        {dot && (
          <span
            className={`mr-2 h-1.5 w-1.5  rounded-full ${circleColors[variant]}`}
          ></span>
        )}

        {children}
      </div>
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants, circleColors };
