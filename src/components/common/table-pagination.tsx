"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";

export interface TablePaginationProps {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    pageSizeOptions?: number[];
}

export function TablePagination({
    currentPage,
    pageSize,
    totalCount,
    hasNextPage,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 30, 50],
}: TablePaginationProps) {
    const displayPage = currentPage + 1; // 0-indexed to 1-indexed
    const startItem = currentPage * pageSize + 1;
    const endItem = Math.min(startItem + pageSize - 1, totalCount || startItem + pageSize - 1);

    // Calculate total pages
    const totalPages = totalCount > 0
        ? Math.ceil(totalCount / pageSize)
        : (hasNextPage ? displayPage + 1 : displayPage);

    const canPreviousPage = currentPage > 0;
    const canNextPage = hasNextPage;

    const handlePageSizeChange = (value: string) => {
        const newSize = parseInt(value, 10);
        onPageSizeChange(newSize);
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
            <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-text-secondary">Rows per page:</span>
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={pageSize.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                        {pageSizeOptions.map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                <span className="text-xs sm:text-sm text-text-secondary">
                    {totalCount > 0
                        ? `${startItem}-${endItem} of ${totalCount}`
                        : `Page ${displayPage}`
                    }
                </span>

                <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="hidden sm:inline-flex h-9 w-9"
                        onClick={() => onPageChange(0)}
                        disabled={!canPreviousPage}
                        aria-label="First page"
                    >
                        <ChevronFirst className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!canPreviousPage}
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!canNextPage}
                        aria-label="Next page"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="secondary"
                        size="icon"
                        className="hidden sm:inline-flex h-9 w-9"
                        onClick={() => onPageChange(totalPages - 1)}
                        disabled={!canNextPage}
                        aria-label="Last page"
                    >
                        <ChevronLast className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default TablePagination;
