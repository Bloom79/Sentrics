import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

export type Column<T> = {
  id: string;
  header: string;
  accessorKey?: string;
  cell?: ({ row }: { row: { original: T } }) => React.ReactNode;
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  onPageIndexChange?: (index: number) => void;
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
  onRowClick?: (record: T) => void;
};

export function DataTable<T>({
  columns,
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageIndexChange,
  onPageSizeChange,
  isLoading,
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            data.map((record, i) => (
              <TableRow
                key={i}
                onClick={() => onRowClick?.(record)}
                className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : undefined}
              >
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.cell
                      ? column.cell({ row: { original: record } })
                      : column.accessorKey
                      ? String((record as any)[column.accessorKey])
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 