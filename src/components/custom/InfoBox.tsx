import React from "react";

import { IconProps, Info } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { BadgeVariant, badgeVariants, circleColors } from "../ui/badge";

const InfoBox = ({
  message,
  Icon,
  iconClassName,
  className,
  color = "blue",
}: {
  message: string;
  Icon?: React.ComponentType<IconProps>;
  iconClassName?: string;
  color?: BadgeVariant;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        `w-full rounded-xl font-display border text-sm font-normal gap-2 hover:opacity-90 transition-opacity ease-in-out duration-200 flex items-center justify-start px-[12px] py-[14px]`,
        badgeVariants[color],
        className
      )}
    >
      {(Icon && (
        <Icon
          className={cn(
            `w-5 h-5 shrink-0 ${circleColors[color]}`,
            iconClassName
          )}
        />
      )) || <Info className={`w-5 h-5 shrink-0 ${circleColors[color]}`} />}
      <span className="leading-tight">{message}</span>
    </div>
  );
};

export default InfoBox;
