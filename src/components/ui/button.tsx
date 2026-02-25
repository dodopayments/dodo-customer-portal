"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Loading from "../loading";

const buttonVariants = cva(
  "inline-flex items-center font-display justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed focus-visible:ring-offset-2 ease-in-out duration-300 relative [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] active:translate-y-[0.5px] touch-manipulation select-none",
  {
    variants: {
      variant: {
        default:
          "bg-button-primary-bg text-button-primary-text hover:bg-button-primary-bg-hover hover:text-button-primary-fg-hover hover:border-border-primary border border-transparent disabled:bg-bg-secondary disabled:text-text-tertiary disabled:border-border-tertiary disabled:pointer-events-none",
        destructive: "bg-bg-error-solid text-white",
        outline:
          "border border-border-primary bg-bg-primary hover:bg-bg-secondary hover:text-text-secondary",
        secondary:
          "bg-button-secondary-bg text-button-secondary-text hover:bg-button-secondary-bg-hover disabled:text-neutral-400 dark:disabled:text-text-disabled disabled:hover:bg-button-secondary-bg disabled:hover:text-button-secondary-text disabled:hover:text-text-disabled hover:text-button-secondary-text-hover",
        ghost: "hover:bg-bg-secondary hover:text-text-secondary",
        link: "text-button-clink underline-offset-4 hover:underline hover:text-button-clink-hover",
      },
      effect: {
        expandIcon: "group gap-0 relative",
        ringHover:
          "transition-all duration-300 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2",
        shine:
          "before:animate-shine relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-no-repeat background-position_0s_ease",
        shineHover:
          "relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] before:duration-1000",
        gooeyRight:
          "relative z-0 overflow-hidden transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r from-white/40 before:transition-transform before:duration-1000  hover:before:translate-x-[0%] hover:before:translate-y-[0%]",
        gooeyLeft:
          "relative z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-white/40 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%]",
        underline:
          "relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300",
        hoverUnderline:
          "relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface IconProps {
  icon: React.ReactNode;
  iconPlacement: "left" | "right";
}

interface IconRefProps {
  icon?: never;
  iconPlacement?: undefined;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  align?: "left" | "center" | "right";
}

export type ButtonIconProps = IconProps | IconRefProps;

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & ButtonIconProps
>(
  (
    {
      className,
      variant,
      align = "center",
      effect,
      size,
      icon: Icon,
      iconPlacement,
      asChild = false,
      loading = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const [isPressed, setIsPressed] = React.useState(false);

    const handlePointerDown = () => {
      setIsPressed(true);
    };

    const handlePointerUp = () => {
      setIsPressed(false);
    };

    const handlePointerLeave = () => {
      setIsPressed(false);
    };

    const contents = (
      <>
        <span
          className={cn(
            "inline-flex items-center gap-1 w-full justify-center",
            "transition-all duration-200",
            loading
              ? "opacity-0 transform -translate-y-2"
              : "opacity-100 transform translate-y-0",
            isPressed && "scale-[0.98] translate-y-[0.5px]",
            align === "left"
              ? "justify-start"
              : align === "right"
                ? "justify-end"
                : "justify-center",
            "text-left",
          )}
        >
          {Icon &&
            iconPlacement === "left" &&
            (effect === "expandIcon" ? (
              <div className="w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-100 group-hover:pr-2 group-hover:opacity-100">
                {Icon}
              </div>
            ) : (
              Icon
            ))}
          <Slottable>{children}</Slottable>
          {Icon &&
            iconPlacement === "right" &&
            (effect === "expandIcon" ? (
              <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
                {Icon}
              </div>
            ) : (
              Icon
            ))}
        </span>
        {loading && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "transition-all duration-200",
              loading
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-2",
            )}
          >
            <Loading />
          </div>
        )}
      </>
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, effect, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        {...props}
      >
        {asChild ? children : contents}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
