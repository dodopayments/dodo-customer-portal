import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ServerPaginationProps {
  currentPage: number;
  pageSize: number;
  currentPageItems: number;
  hasNextPage: boolean;
  baseUrl: string;
}

export default function ServerPagination({
  currentPage,
  pageSize,
  currentPageItems,
  hasNextPage,
  baseUrl,
}: ServerPaginationProps) {
  const displayPage = currentPage + 1;
  const canPreviousPage = currentPage > 0;
  const canNextPage = hasNextPage && currentPageItems === pageSize;

  const calculateTotalPages = () => {
    return hasNextPage ? displayPage + 1 : displayPage;
  };

  const totalPages = calculateTotalPages();

  const generatePageNumbers = () => {
    const pages = [];
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

    return [...new Set(pages)];
  };

  return (
    <div className="flex items-center w-full p-4 border border-border-secondary shadow-sm border-t-0 rounded-b-xl">
      <Pagination>
        <PaginationContent className="w-full flex items-center justify-between">
          <PaginationItem>
            {canPreviousPage ? (
              <PaginationPrevious
                href={`${baseUrl}&page=${currentPage - 1}`}
                className="hover:text-text-primary transition-opacity"
              />
            ) : (
              <PaginationPrevious
                className="opacity-50 cursor-not-allowed pointer-events-none"
                aria-disabled={true}
              />
            )}
          </PaginationItem>
          <div className="flex items-center gap-2 w-fit">
            {generatePageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href={`${baseUrl}&page=${Number(page) - 1}`}
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
                href={`${baseUrl}&page=${currentPage + 1}`}
                className="hover:text-text-primary transition-opacity"
              />
            ) : (
              <PaginationNext
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
