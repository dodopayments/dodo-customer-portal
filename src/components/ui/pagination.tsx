import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

export type PaginationLinkProps = Pick<ButtonProps, "size"> & {
  isActive?: boolean;
  href?: string;
  children?: React.ReactNode;
  className?: string;
  "aria-disabled"?: boolean;
  "aria-label"?: string;
};

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  href,
  children,
  ...props
}: PaginationLinkProps) => {
  const baseClassName = cn(
    buttonVariants({
      variant: isActive ? "secondary" : "ghost",
      size,
    }),
    className,
  );

  // Render as span for disabled/placeholder links (href is "#" or missing)
  if (!href || href === "#") {
    return (
      <span
        aria-current={isActive ? "page" : undefined}
        className={baseClassName}
        {...props}
      >
        {children}
      </span>
    );
  }

  // Render as Next.js Link for active navigation
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={baseClassName}
      {...props}
    >
      {children}
    </Link>
  );
};
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = (props: PaginationLinkProps) => {
  const { className, ...restProps } = props;
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 bg-bg-secondary text-text-primary pl-2.5", className)}
      {...restProps}
    >
      <ChevronLeft className="h-4 w-4 " />
      <span>Previous</span>
    </PaginationLink>
  );
};
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = (props: PaginationLinkProps) => {
  const { className, ...restProps } = props;
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 bg-bg-secondary text-text-primary pr-2.5", className)}
      {...restProps}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
};
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
