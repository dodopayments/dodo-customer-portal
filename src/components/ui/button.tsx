import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center font-display justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed focus-visible:ring-offset-2 ease-in-out duration-300",
  {
    variants: {
      variant: {
        default: "bg-button-primary-bg text-white dark:text-black hover:bg-button-primary-bg-hover hover:text-button-primary-fg-hover hover:border-border-primary border border-transparent disabled:bg-bg-secondary disabled:text-text-tertiary disabled:border-border-tertiary disabled:pointer-events-none ",
        destructive: "bg-bg-error-solid text-white",
        outline: "border border-border-primary bg-bg-primary hover:bg-bg-secondary hover:text-text-secondary",
        secondary: "bg-button-secondary-bg text-button-secondary-text hover:bg-button-secondary-bg-hover disabled:text-neutral-400 dark:disabled:text-text-disabled disabled:hover:bg-button-secondary-bg disabled:hover:text-button-secondary-text disabled:hover:text-text-disabled hover:text-button-secondary-text-hover",
        ghost: "hover:bg-bg-secondary hover:text-text-secondary",
        link: "text-button-clink underline-offset-4 hover:underline hover:text-button-clink-hover",
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
  }
)


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }