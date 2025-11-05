"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { buildPageUrl } from "@/lib/pagination-utils";
import { useMemo } from "react";

export interface ServerPaginationProps {
  currentPage: number;
  pageSize: number;
  currentPageItems: number;
  hasNextPage: boolean;
  baseUrl: string;
  pageParamKey?: string;
}

export default function ServerPagination({
  currentPage,
  pageSize,
  currentPageItems,
  hasNextPage,
  baseUrl,
  pageParamKey = "page",
}: ServerPaginationProps) {
  const normalizedPage = Math.max(0, Math.floor(currentPage));
  const displayPage = normalizedPage + 1;
  const canPreviousPage = normalizedPage > 0;
  const canNextPage = currentPageItems === pageSize;

  const totalPages = useMemo(() => {
    return hasNextPage ? displayPage + 1 : displayPage;
  }, [hasNextPage, displayPage]);

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    const currentPageIndex = displayPage;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPageIndex > 3) {
        pages.push("...");
      }

      for (
        let i = Math.max(2, currentPageIndex - 1);
        i <= Math.min(totalPages - 1, currentPageIndex + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPageIndex < totalPages - 2) {
        pages.push("...");
      }

      if (currentPageIndex !== totalPages) {
        pages.push(totalPages);
      }
    }

    return Array.from(new Set(pages));
  }, [totalPages, displayPage]);

  const previousPageUrl = useMemo(
    () => buildPageUrl(baseUrl, normalizedPage - 1, pageParamKey),
    [baseUrl, normalizedPage, pageParamKey],
  );

  const nextPageUrl = useMemo(
    () => buildPageUrl(baseUrl, normalizedPage + 1, pageParamKey),
    [baseUrl, normalizedPage, pageParamKey],
  );

  return (
    <div className="flex items-center w-full p-4">
      <Pagination>
        <PaginationContent className="w-full flex items-center justify-between">
          <PaginationItem>
            {canPreviousPage ? (
              <PaginationPrevious
                href={previousPageUrl}
                className="hover:text-text-primary transition-opacity"
              />
            ) : (
              <PaginationPrevious
                href="#"
                className="opacity-50 cursor-not-allowed pointer-events-none"
                aria-disabled={true}
              />
            )}
          </PaginationItem>
          <div className="flex items-center gap-2 w-fit">
            {pageNumbers.map((page, index) => (
              <PaginationItem key={`${page}-${index}`}>
                {page === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href={buildPageUrl(
                      baseUrl,
                      Number(page) - 1,
                      pageParamKey,
                    )}
                    isActive={displayPage === page}
                    className="transition-colors"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
          </div>
          <PaginationItem>
            {canNextPage ? (
              <PaginationNext
                href={nextPageUrl}
                className="hover:text-text-primary transition-opacity"
              />
            ) : (
              <PaginationNext
                href="#"
                className="opacity-50 cursor-not-allowed pointer-events-none"
                aria-disabled={true}
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
