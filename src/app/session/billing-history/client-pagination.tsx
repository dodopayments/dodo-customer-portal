"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ClientPaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  baseUrl: string;
}

export default function ClientPagination({
  currentPage,
  hasNextPage,
  baseUrl,
}: ClientPaginationProps) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${newPage}`;
    router.push(url);
  };

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <span className="text-sm text-muted-foreground">
          Page {currentPage + 1}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
