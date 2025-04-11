import { cn } from "@/lib/utils";
import React from "react";

export const getIconColor = (color: string) => {
  switch (color) {
    case "green":
      return "bg-[#079455] text-[#ABEFC6]";
    case "orange":
      return "bg-[#DC6803] text-[#FEDF89]";
    case "yellow":
      return "text-[#F79009] bg-[#FEF0C7]";
    case "red":
      return "bg-[#D92D20] text-[#FECDCA]";
    default:
      return "bg-bg-secondary text-text-primary";
  }
};
const IconColors = ({
  icon,
  className,
  color = "default",
}: {
  icon: React.ReactNode;
  color?: "green" | "orange" | "red" | "yellow" | "default";
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "rounded-full w-fit p-3 flex items-center justify-center",
        getIconColor(color),
        className
      )}
    >
      {icon}
    </div>
  );
};
export default IconColors;
