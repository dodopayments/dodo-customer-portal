import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface TablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems?: number;
  currentPageItems: number;
  hasNextPage: boolean;
  onPageChange: (newPage: number) => void;
}

const TablePagination = ({
  currentPage,
  pageSize,
  totalItems,
  currentPageItems,
  hasNextPage,
  onPageChange,
}: TablePaginationProps) => {
  // Convert 0-based index to 1-based for display
  const displayPage = currentPage + 1;
  const canPreviousPage = currentPage > 0;
  const canNextPage = hasNextPage && currentPageItems === pageSize;

  // Calculate estimated total pages based on current information
  const calculateTotalPages = () => {
    if (totalItems) {
      return Math.ceil(totalItems / pageSize);
    }
    // If we don't have total items, estimate based on current page and next page availability
    return hasNextPage ? displayPage + 1 : displayPage;
  };

  const totalPages = calculateTotalPages();

  // Modify the generatePageNumbers function for better page number display
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Increased for better navigation
    const currentPageIndex = displayPage;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPageIndex > 3) {
        pages.push("...");
      }

      // Show pages around current page
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

      // Always show last page if there are more pages
      if (currentPageIndex !== totalPages) {
        pages.push(totalPages);
      }
    }

    return [...new Set(pages)]; // Remove any duplicates
  };

  // Add disabled state to pagination buttons
  const isPreviousDisabled = !canPreviousPage;
  const isNextDisabled = !canNextPage;

  return (
    <div className="flex items-center w-full p-4 border border-border-secondary shadow-sm border-t-0 rounded-b-xl">
      <Pagination>
        <PaginationContent className="w-full flex items-center justify-between">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (!isPreviousDisabled) {
                  onPageChange(currentPage - 1);
                }
              }}
              className={`${
                isPreviousDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-text-primary"
              } transition-opacity`}
              aria-disabled={isPreviousDisabled}
            />
          </PaginationItem>
          <div className="flex items-center gap-2 w-fit">
            {generatePageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={displayPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(Number(page) - 1);
                    }}
                    className="transition-colors"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
          </div>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (!isNextDisabled) {
                  onPageChange(currentPage + 1);
                }
              }}
              className={`${
                isNextDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-text-primary"
              } transition-opacity`}
              aria-disabled={isNextDisabled}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TablePagination;
