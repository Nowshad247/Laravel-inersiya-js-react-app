'use client';

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { router } from '@inertiajs/react';

interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    searchKey?: string;
    btnlink?: string;
}

export function DataTable<TData>({
    btnlink = '',
    columns,
    data,
    searchKey,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: 'updated_at', desc: true },
    ]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="w-full space-y-4">
            <div className="flex w-12/12 justify-between">
                <div className="px-6">
                    {btnlink && (
                        <Button
                            className="btn btn"
                            onClick={() => {
                                router.get('' + btnlink);
                            }}
                        >
                            Add New
                        </Button>
                    )}
                </div>
                <div className="px-6">
                    Total Records:{' '}
                    {table.getPrePaginationRowModel().rows.length}
                </div>
                <div className="px-6">
                    {searchKey && (
                        <Input
                            placeholder={`Search ${searchKey}...`}
                            value={
                                (table
                                    .getColumn(searchKey)
                                    ?.getFilterValue() as string) ?? ''
                            }
                            onChange={(e) =>
                                table
                                    .getColumn(searchKey)
                                    ?.setFilterValue(e.target.value)
                            }
                            className="max-w-sm"
                        />
                    )}
                </div>
            </div>

            {/* Search */}

            {/* Table */}
            <div className="rounded-md border">
                <Table className="">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </div>
                                            {header.column.getCanFilter() &&
                                                header.column.columnDef
                                                    .enableColumnFilter !==
                                                    false && (
                                                    <Input
                                                        placeholder="Filter..."
                                                        value={
                                                            (header.column.getFilterValue() as string) ??
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            header.column.setFilterValue(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-8 w-full text-xs"
                                                    />
                                                )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
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
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
