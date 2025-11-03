import { HTMLAttributes, ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDataGrid } from "@/components/ui/data-grid";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Column } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowLeft,
  ArrowLineLeft,
  ArrowRight,
  ArrowLineRight,
  ArrowUp,
  Check,
  PushPinSlash,
  Gear,
  DotsThree,
} from "@phosphor-icons/react";

interface DataGridColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title?: string;
  icon?: ReactNode;
  pinnable?: boolean;
  filter?: ReactNode;
  visibility?: boolean;
}

function DataGridColumnHeader<TData, TValue>({
  column,
  title = "",
  icon,
  className,
  filter,
  visibility = false,
}: DataGridColumnHeaderProps<TData, TValue>) {
  const { isLoading, table, props, recordCount } = useDataGrid();

  // Ensure column visibility menus use a human-readable title
  useEffect(() => {
    if (!title) return;
    const currentMeta = column.columnDef.meta ?? {};
    if (currentMeta.headerTitle !== title) {
      column.columnDef.meta = {
        ...currentMeta,
        headerTitle: title,
      } as typeof column.columnDef.meta;
    }
  }, [column, title]);

  const moveColumn = (direction: "left" | "right") => {
    const currentOrder = [...table.getState().columnOrder]; // Get current column order
    const currentIndex = currentOrder.indexOf(column.id); // Get current index of the column

    if (direction === "left" && currentIndex > 0) {
      // Move column left
      const newOrder = [...currentOrder];
      const [movedColumn] = newOrder.splice(currentIndex, 1);
      newOrder.splice(currentIndex - 1, 0, movedColumn);
      table.setColumnOrder(newOrder); // Update column order
    }

    if (direction === "right" && currentIndex < currentOrder.length - 1) {
      // Move column right
      const newOrder = [...currentOrder];
      const [movedColumn] = newOrder.splice(currentIndex, 1);
      newOrder.splice(currentIndex + 1, 0, movedColumn);
      table.setColumnOrder(newOrder); // Update column order
    }
  };

  const canMove = (direction: "left" | "right"): boolean => {
    const currentOrder = table.getState().columnOrder;
    const currentIndex = currentOrder.indexOf(column.id);
    if (direction === "left") {
      return currentIndex > 0;
    } else {
      return currentIndex < currentOrder.length - 1;
    }
  };

  const headerLabel = () => {
    return (
      <div
        className={cn(
          "text-text-secondary font-normal inline-flex h-full items-center gap-1.5 text-[0.8125rem] leading-[calc(1.125/0.8125)] [&_svg]:size-3.5 [&_svg]:opacity-60",
          className,
        )}
      >
        {icon && icon}
        {title}
      </div>
    );
  };

  const headerButton = () => {
    return (
      <div className="flex w-full items-center gap-2 justify-between">
        <div className="flex items-center gap-1">
          <span>{icon && icon}</span>
          <span>{title}</span>
        </div>
        <Button
          variant="ghost"
          className={cn(
            "text-text-secondary rounded-md font-[400] -ms-2 px-2 h-7 flex items-center justify-between hover:bg-bg-primary data-[state=open]:bg-bg-primary hover:text-text-primary data-[state=open]:text-text-primary",
            className,
          )}
          disabled={isLoading || recordCount === 0}
          onClick={() => {
            const isSorted = column.getIsSorted();
            if (isSorted === "asc") {
              column.toggleSorting(true);
            } else if (isSorted === "desc") {
              column.clearSorting();
            } else {
              column.toggleSorting(false);
            }
          }}
        >
          {column.getCanSort() &&
            (column.getIsSorted() === "desc" ? (
              <ArrowDown className="size-[0.7rem]! mt-px" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="size-[0.7rem]! mt-px" />
            ) : (
              <DotsThree className="size-[0.7rem]! mt-px" />
            ))}
        </Button>
      </div>
    );
  };

  const headerPin = () => {
    return (
      <Button
        size="icon"
        variant="ghost"
        className="-me-1 size-7 rounded-md"
        onClick={() => column.pin(false)}
        aria-label={`Unpin ${title} column`}
        title={`Unpin ${title} column`}
      >
        <PushPinSlash className="size-3.5! opacity-50!" aria-hidden="true" />
      </Button>
    );
  };

  const headerControls = () => {
    return (
      <div className="flex items-center h-full gap-1.5 justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{headerButton()}</DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            {filter && <DropdownMenuLabel>{filter}</DropdownMenuLabel>}

            {filter &&
              (column.getCanSort() || column.getCanPin() || visibility) && (
                <DropdownMenuSeparator />
              )}

            {column.getCanSort() && (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    if (column.getIsSorted() === "asc") {
                      column.clearSorting();
                    } else {
                      column.toggleSorting(false);
                    }
                  }}
                  disabled={!column.getCanSort()}
                >
                  <ArrowUp className="shrink-0 w-4 h-4 mr-1" />
                  <span className="grow">Asc</span>
                  {column.getIsSorted() === "asc" && (
                    <Check className="size-4 opacity-100! text-primary" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (column.getIsSorted() === "desc") {
                      column.clearSorting();
                    } else {
                      column.toggleSorting(true);
                    }
                  }}
                  disabled={!column.getCanSort()}
                >
                  <ArrowDown className="shrink-0 w-4 h-4 mr-1" />
                  <span className="grow">Desc</span>
                  {column.getIsSorted() === "desc" && (
                    <Check className="size-4 opacity-100! text-primary" />
                  )}
                </DropdownMenuItem>
              </>
            )}

            {(filter || column.getCanSort()) &&
              (column.getCanSort() || column.getCanPin() || visibility) && (
                <DropdownMenuSeparator />
              )}

            {props.tableLayout?.columnsPinnable && column.getCanPin() && (
              <>
                <DropdownMenuItem
                  onClick={() =>
                    column.pin(column.getIsPinned() === "left" ? false : "left")
                  }
                >
                  <ArrowLineLeft
                    className="shrink-0 w-4 h-4 mr-1"
                    aria-hidden="true"
                  />
                  <span className="grow">Pin to left</span>
                  {column.getIsPinned() === "left" && (
                    <Check className="size-4 opacity-100! text-primary" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    column.pin(
                      column.getIsPinned() === "right" ? false : "right",
                    )
                  }
                >
                  <ArrowLineRight
                    className="shrink-0 w-4 h-4 mr-1"
                    aria-hidden="true"
                  />
                  <span className="grow">Pin to right</span>
                  {column.getIsPinned() === "right" && (
                    <Check className="size-4 opacity-100! text-primary" />
                  )}
                </DropdownMenuItem>
              </>
            )}

            {props.tableLayout?.columnsMovable && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => moveColumn("left")}
                  disabled={!canMove("left") || column.getIsPinned() !== false}
                >
                  <ArrowLeft
                    className="shrink-0 w-4 h-4 mr-1"
                    aria-hidden="true"
                  />
                  <span>Move to Left</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => moveColumn("right")}
                  disabled={!canMove("right") || column.getIsPinned() !== false}
                >
                  <ArrowRight
                    className="shrink-0 w-4 h-4 mr-1"
                    aria-hidden="true"
                  />
                  <span>Move to Right</span>
                </DropdownMenuItem>
              </>
            )}

            {props.tableLayout?.columnsVisibility &&
              visibility &&
              (column.getCanSort() || column.getCanPin() || filter) && (
                <DropdownMenuSeparator />
              )}

            {props.tableLayout?.columnsVisibility && visibility && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Gear className="shrink-0 w-4 h-4 mr-1" />
                  <span>Columns</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {table
                      .getAllColumns()
                      .filter(
                        (col) =>
                          typeof col.accessorFn !== "undefined" &&
                          col.getCanHide(),
                      )
                      .map((col) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={col.id}
                            checked={col.getIsVisible()}
                            onSelect={(event) => event.preventDefault()}
                            onCheckedChange={(value) =>
                              col.toggleVisibility(!!value)
                            }
                            className="capitalize"
                          >
                            {col.columnDef.meta?.headerTitle || col.id}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          column.getIsPinned() &&
          headerPin()}
      </div>
    );
  };

  if (
    props.tableLayout?.columnsMovable ||
    (props.tableLayout?.columnsVisibility && visibility) ||
    (props.tableLayout?.columnsPinnable && column.getCanPin()) ||
    filter
  ) {
    return headerControls();
  }

  if (
    column.getCanSort() ||
    (props.tableLayout?.columnsResizable && column.getCanResize())
  ) {
    return <div className="flex items-center h-full">{headerButton()}</div>;
  }

  return headerLabel();
}

export { DataGridColumnHeader, type DataGridColumnHeaderProps };
