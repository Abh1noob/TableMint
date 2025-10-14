"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FilterOption {
  columnId: string;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

interface TableConfig {
  pagination?: {
    defaultPageSize?: number;
    pageSizeOptions?: number[];
  };
  defaultSort?: SortingState;
  columns?: {
    defaultHidden?: string[];
    pinned?: string[];
  };
  emptyState?: {
    title?: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
  };
  export?: {
    enabled?: boolean;
    formats?: string[];
    filename?: string;
  };
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filters?: FilterOption[];
  searchColumn?: string;
  searchPlaceholder?: string;
  config?: TableConfig;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filters,
  searchColumn,
  searchPlaceholder,
  config,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  
  // Initialize column visibility with hidden columns
  const initialColumnVisibility = React.useMemo(() => {
    const visibility: VisibilityState = {};
    config?.columns?.defaultHidden?.forEach(columnId => {
      visibility[columnId] = false;
    });
    return visibility;
  }, [config?.columns?.defaultHidden]);
  
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialColumnVisibility);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>(config?.defaultSort || []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: {
      pagination: {
        pageSize: config?.pagination?.defaultPageSize || 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar 
        table={table} 
        filters={filters} 
        searchColumn={searchColumn}
        searchPlaceholder={searchPlaceholder}
        config={config}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {config?.emptyState ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <h3 className="text-lg font-medium">{config.emptyState.title || "No results"}</h3>
                      {config.emptyState.description && (
                        <p className="text-sm text-muted-foreground">{config.emptyState.description}</p>
                      )}
                      {config.emptyState.actionLabel && config.emptyState.actionHref && (
                        <a 
                          href={config.emptyState.actionHref}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                          {config.emptyState.actionLabel}
                        </a>
                      )}
                    </div>
                  ) : (
                    "No results."
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination 
        table={table} 
        pageSizeOptions={config?.pagination?.pageSizeOptions}
      />
    </div>
  );
}