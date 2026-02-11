import { ReactNode, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { Gear } from "@phosphor-icons/react";

interface DataGridColumnVisibilityStandaloneProps<TData> {
  table: Table<TData>;
  columnVisibility?: Record<string, boolean>;
  trigger?: ReactNode;
  className?: string;
}

function DataGridColumnVisibilityStandalone<TData>({
  table,
  columnVisibility,
  trigger,
}: DataGridColumnVisibilityStandaloneProps<TData>) {
  const columns = useMemo(() => {
    return table
      .getAllColumns()
      .filter(
        (column) =>
          typeof column.accessorFn !== "undefined" && column.getCanHide(),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, columnVisibility]);

  const defaultTrigger = (
    <Button
      variant="secondary"
      size="sm"
      iconPlacement="left"
      icon={<Gear className="h-4 w-4" />}
      className="flex items-center gap-2"
    >
      <span>Edit Columns</span>
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[200px]">
        <DropdownMenuLabel className="font-medium font-display ">
          Toggle Columns
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.columnDef.meta?.headerTitle || column.id}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { DataGridColumnVisibilityStandalone };
