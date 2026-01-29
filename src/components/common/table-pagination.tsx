"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

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
        onPageSizeChange(newSize); // This callback should handle page reset
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border-secondary">
            {/* Rows per page */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Rows per page:</span>
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

            {/* Page info and navigation */}
            <div className="flex items-center gap-4">
                {/* Page info */}
                <span className="text-sm text-text-secondary">
                    {totalCount > 0
                        ? `${startItem}-${endItem} of ${totalCount}`
                        : `Page ${displayPage}`
                    }
                </span>

                {/* Navigation buttons */}
                <div className="flex items-center gap-1">
                    {/* First page */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onPageChange(0)}
                        disabled={!canPreviousPage}
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </Button>

                    {/* Previous page */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!canPreviousPage}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {/* Next page */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!canNextPage}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>

                    {/* Last page */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onPageChange(totalPages - 1)}
                        disabled={!canNextPage}
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default TablePagination;
