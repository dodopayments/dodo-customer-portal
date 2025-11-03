import React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const colorVariants = {
  group1: "bg-[#D7EAFF] text-[#1264FF] dark:bg-[#1264FF] dark:text-[#B9DCFF]",
  group2: "bg-[#EBE9FE] text-[#6938EF] dark:bg-[#3E1C96] dark:text-[#BDB4FE]",
  group3: "bg-[#FCE7F6] text-[#DD2590] dark:bg-[#851651] dark:text-[#FAA7E0]",
  group4: "bg-[#F6FFC4] text-[#618B00] dark:bg-[#81B700] dark:text-[#F6FFC4]",
};

const getColorGroup = (initials: string) => {
  const sumOfCharCodes = initials
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const groupIndex = sumOfCharCodes % 4;

  switch (groupIndex) {
    case 0:
      return "group1";
    case 1:
      return "group2";
    case 2:
      return "group3";
    case 3:
    default:
      return "group4";
  }
};

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square rounded-full h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  name: string;
  singleInitials?: boolean;
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, name, singleInitials = false, ...props }, ref) => {
  if (!name) {
    name = "Dodo";
  }
  const initials = React.useMemo(() => {
    const nameParts = name.split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(
      0,
    )}`.toUpperCase();
  }, [name]);

  const colorClass = React.useMemo(() => {
    const group = getColorGroup(initials);
    return colorVariants[group];
  }, [initials]);

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full font-semibold",
        colorClass,
        className,
      )}
      {...props}
    >
      {singleInitials ? initials.charAt(0) : initials}
    </AvatarPrimitive.Fallback>
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
