"use client";

/**
 * BaseDataGrid - A reusable data grid component with localStorage persistence
 *
 * @example
 * // Basic usage with server-side pagination
 * <BaseDataGrid
 *   tableId="products-table"
 *   data={products}
 *   columns={productColumns}
 *   manualPagination={true}
 *   onPaginationChange={(pagination) => fetchData(pagination)}
 * />
 *
 * @example
 * // Client-side table with all features
 * <BaseDataGrid
 *   tableId="customers-table"
 *   data={customers}
 *   columns={customerColumns}
 *   showResetButton={true}
 *   onRowClick={(row) => navigate(`/customer/${row.original.id}`)}
 * />
 */

import { useEffect, useMemo, useState, useRef } from "react";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  Table,
} from "@tanstack/react-table";
import TableLocalStorage, { TableState } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BaseDataGridProps<TData = any> {
  // Required props
  tableId: string;
  data: TData[];
  columns: ColumnDef<TData>[];

  // Optional configuration
  customEmptyMessage?: string;
  isLoading?: boolean;
  recordCount?: number;
  pageCount?: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
  disablePagination?: boolean;
  // Event handlers
  onRowClick?: (row: TData) => void;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;

  // Initial state overrides
  initialPageSize?: number;
  initialSorting?: SortingState;

  // Layout options
  tableLayout?: {
    autoWidth?: boolean;
    columnsPinnable?: boolean;
    columnsResizable?: boolean;
    columnsMovable?: boolean;
    columnsVisibility?: boolean;
    disableRowPerPage?: boolean;
  };

  // UI customization
  showResetButton?: boolean;
  resetButtonText?: string;
  emptyStateMessage?: string;

  // Additional props
  className?: string;

  // Table instance for external use
  onTableReady?: (table: Table<TData>) => void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function BaseDataGrid<TData = any>({
  tableId,
  data,
  columns,
  customEmptyMessage,
  recordCount,
  pageCount,
  disablePagination = false,
  manualPagination = false,
  manualSorting = false,
  onRowClick,
  onPaginationChange,
  onSortingChange,
  initialPageSize = 10,
  initialSorting = [],
  tableLayout = {
    autoWidth: false,
    columnsPinnable: true,
    columnsResizable: true,
    columnsMovable: true,
    disableRowPerPage: false,
    columnsVisibility: true,
  },
  showResetButton = false,
  resetButtonText = "Reset Table",
  emptyStateMessage = "No data available",
  className = "",
  onTableReady,
}: BaseDataGridProps<TData>) {
  // Hydration guard to prevent SSR/client mismatch
  const [isHydrated, setIsHydrated] = useState(false);

  // Track if we've initialized the column order to prevent infinite loops
  const hasInitializedColumnOrder = useRef(false);

  // Initialize all state with default values to ensure SSR/client consistency
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});

  const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Load saved state from localStorage after hydration
  useEffect(() => {
    setIsHydrated(true);

    const savedTableState = TableLocalStorage.getTableState(tableId);

    // Batch all state updates to prevent multiple re-renders
    if (savedTableState) {
      if (savedTableState.pagination?.pageSize) {
        setPagination((prev) => ({
          ...prev,
          pageSize: savedTableState.pagination.pageSize,
        }));
      }

      if (savedTableState.sorting) {
        setSorting(savedTableState.sorting);
      }

      if (savedTableState.columnOrder) {
        setColumnOrder(savedTableState.columnOrder);
        hasInitializedColumnOrder.current = true;
      }

      if (savedTableState.columnVisibility) {
        setColumnVisibility(savedTableState.columnVisibility);
      }

      if (savedTableState.columnSizing) {
        setColumnSizing(savedTableState.columnSizing);
      }

      if (savedTableState.filters) {
        setColumnFilters(savedTableState.filters);
      }
    }
  }, [tableId]); // Only depend on tableId to prevent infinite loops

  // Initialize column order from columns if not set or when columns change
  useEffect(() => {
    if (
      isHydrated &&
      columns.length > 0 &&
      !hasInitializedColumnOrder.current
    ) {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const defaultColumnOrder = columns.map((column) => (column as any).id || (column as any).accessorKey);
      setColumnOrder(defaultColumnOrder);
      hasInitializedColumnOrder.current = true;
    }
  }, [isHydrated, columns]);

  // Calculate estimated page count for server-side pagination
  const estimatedPageCount = useMemo(() => {
    if (pageCount !== undefined) return pageCount;
    if (!manualPagination) return Math.ceil(data.length / pagination.pageSize);

    // For manual pagination, estimate based on current data
    if (!data || data.length === 0) return 1;

    if (data.length === pagination.pageSize) {
      return pagination.pageIndex + 2; // Assume more pages exist
    } else {
      return pagination.pageIndex + 1; // This is likely the last page
    }
  }, [
    data,
    pagination.pageSize,
    pagination.pageIndex,
    pageCount,
    manualPagination,
  ]);

  // Calculate record count
  const totalRecordCount = useMemo(() => {
    if (recordCount !== undefined) return recordCount;
    if (!manualPagination) return data.length;

    // For manual pagination, estimate based on current data
    if (!data || data.length === 0) return 0;

    if (data.length === pagination.pageSize) {
      return (pagination.pageIndex + 1) * pagination.pageSize + 1; // At least one more record
    } else {
      return pagination.pageIndex * pagination.pageSize + data.length;
    }
  }, [
    data,
    pagination.pageSize,
    pagination.pageIndex,
    recordCount,
    manualPagination,
  ]);

  // React Table configuration
  const table = useReactTable({
    columns,
    data: data || [],
    pageCount: estimatedPageCount,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    getRowId: (row: any, index) =>
      (row?.id || row?.productId || index).toString(),
    state: {
      pagination,
      sorting,
      columnOrder,
      columnVisibility,
      columnSizing,
      columnFilters,
    },
    columnResizeMode: "onChange",
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      setPagination(newPagination);
      onPaginationChange?.(newPagination);
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
      onSortingChange?.(newSorting);
    },
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination,
    manualSorting,
  });

  // Notify when table is ready
  useEffect(() => {
    if (isHydrated && onTableReady) {
      onTableReady(table);
    }
  }, [isHydrated, table, onTableReady]);

  // Save table state to localStorage whenever it changes (exclude pageIndex)
  // Only save after hydration to prevent unnecessary operations during SSR
  useEffect(() => {
    if (!isHydrated) return;

    const tableState: TableState = {
      pagination: {
        pageSize: pagination.pageSize, // Only save page size, not page index
      },
      sorting,
      columnOrder,
      columnVisibility,
      columnSizing,
      filters: columnFilters,
    };
    TableLocalStorage.setTableState(tableId, tableState);
  }, [
    isHydrated,
    tableId,
    pagination.pageSize,
    sorting,
    columnOrder,
    columnVisibility,
    columnSizing,
    columnFilters,
  ]);

  // Reset table state function
  const resetTableState = () => {
    const defaultPagination = {
      pageIndex: 0,
      pageSize: initialPageSize,
    };

    setPagination(defaultPagination);
    setSorting(initialSorting);
    setColumnOrder([]);
    setColumnVisibility({});
    setColumnSizing({});
    setColumnFilters([]);
    hasInitializedColumnOrder.current = false; // Reset initialization flag
    TableLocalStorage.clearTableState(tableId);

    // Call callbacks if provided
    onPaginationChange?.(defaultPagination);
    onSortingChange?.(initialSorting);
  };

  return (
    <div className={`w-full ${className}`}>
      {showResetButton && (
        <div className="mb-4 flex justify-end">
          <Button variant="outline" onClick={resetTableState}>
            {resetButtonText}
          </Button>
        </div>
      )}

      <DataGrid
        table={table}
        recordCount={totalRecordCount}
        tableLayout={tableLayout}
        emptyMessage={customEmptyMessage || emptyStateMessage}
        onRowClick={onRowClick}
        isLoading={false}
      >
        <div className="w-full space-y-2.5">
          <DataGridContainer>
            <ScrollArea className="scrollGradient">
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
          {!disablePagination && (
            <DataGridPagination
              disableRowPerPage={tableLayout?.disableRowPerPage}
            />
          )}
        </div>
      </DataGrid>
    </div>
  );
}
