"use client"

import { type Table } from "@tanstack/react-table"
import { X, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "./data-table-view-options"

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
  export?: {
    enabled?: boolean;
    formats?: string[];
    filename?: string;
  };
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters?: FilterOption[];
  searchColumn?: string;
  searchPlaceholder?: string;
  config?: TableConfig;
}

export function DataTableToolbar<TData>({
  table,
  filters = [],
  searchColumn = "title",
  searchPlaceholder = "Search...",
  config,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={searchPlaceholder}
          value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchColumn)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {filters.map((filter) =>
          table.getColumn(filter.columnId) ? (
            <DataTableFacetedFilter
              key={filter.columnId}
              column={table.getColumn(filter.columnId)}
              title={filter.title}
              options={filter.options}
            />
          ) : null
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {config?.export?.enabled && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const data = table.getFilteredRowModel().rows.map(row => row.original);
              const csv = convertToCSV(data);
              downloadCSV(csv, config.export?.filename || 'export');
            }}
            className="h-8"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}

function convertToCSV(data: any[]): string {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
}

function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}