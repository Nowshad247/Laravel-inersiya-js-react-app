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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { downloadTablePdf } from './tablePdf';

interface DataTableProps<TData> {
    columns: ColumnDef<TData, any>[];
    data: TData[];
    tableKey?: string;
}

function getRecordId<TData>(record: TData, index: number): string {
    const id = (record as TData & { id?: string | number }).id;
    return String(id ?? index);
}

export function DataTable<TData>({
    columns,
    data,
    tableKey,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const preferenceKey = `table-page-size:${tableKey ?? window.location.pathname}`;
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: Number(window.localStorage.getItem(preferenceKey)) || 10,
    });
    const [rowSelection, setRowSelection] = React.useState<
        Record<string, boolean>
    >({});
    const [isDownloading, setIsDownloading] = React.useState(false);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            pagination,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        getRowId: getRecordId,
        autoResetPageIndex: false,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    React.useEffect(() => {
        window.localStorage.setItem(preferenceKey, String(pagination.pageSize));
    }, [pagination.pageSize, preferenceKey]);

    const availableRows = table.getPrePaginationRowModel().rows;
    const selectedData = data.filter(
        (record, index) => rowSelection[getRecordId(record, index)],
    );
    const allAvailableRowsSelected =
        availableRows.length > 0 &&
        availableRows.every((row) => row.getIsSelected());
    const someAvailableRowsSelected =
        availableRows.some((row) => row.getIsSelected()) &&
        !allAvailableRowsSelected;

    const handleDownloadPdf = async () => {
        if (selectedData.length === 0) {
            toast.info('Select at least one record before downloading a PDF.');
            return;
        }

        setIsDownloading(true);
        await new Promise((resolve) => setTimeout(resolve, 0));
        downloadTablePdf({
            columns,
            data: selectedData,
            filename: `${(tableKey ?? 'table').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.pdf`,
        });
        setIsDownloading(false);
        toast.success(`${selectedData.length} record(s) exported.`);
    };

    return (
        <div className="w-full space-y-4">
            {/* Top Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-2">
                <div className="text-sm text-muted-foreground">
                    Total Records:{' '}
                    {table.getPrePaginationRowModel().rows.length}
                </div>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadPdf}
                    disabled={selectedData.length === 0 || isDownloading}
                >
                    {isDownloading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="mr-2 h-4 w-4" />
                    )}
                    {isDownloading
                        ? 'Preparing PDF...'
                        : `Download PDF${selectedData.length ? ` (${selectedData.length})` : ''}`}
                </Button>

                <div className="flex gap-2">
                    {/* Global Search */}
                    <Input
                        placeholder="Search everything..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-xs"
                    />

                    {/* Status Dropdown Filter (example) */}
                    {table.getColumn('status') && (
                        <select
                            className="rounded border px-2 py-1 text-sm"
                            value={
                                (table
                                    .getColumn('status')
                                    ?.getFilterValue() as string) ?? ''
                            }
                            onChange={(e) =>
                                table
                                    .getColumn('status')
                                    ?.setFilterValue(
                                        e.target.value || undefined,
                                    )
                            }
                        >
                            <option value="">All Status</option>
                            <option value="new">New</option>
                            <option value="called">Called</option>
                            <option value="converted">Converted</option>
                        </select>
                    )}

                    {/* Reset */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setGlobalFilter('');
                            setColumnFilters([]);
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                <TableHead className="w-10">
                                    <Checkbox
                                        aria-label="Select all records"
                                        checked={
                                            someAvailableRowsSelected
                                                ? 'indeterminate'
                                                : allAvailableRowsSelected
                                        }
                                        onCheckedChange={(checked) =>
                                            availableRows.forEach((row) =>
                                                row.toggleSelected(
                                                    checked === true,
                                                ),
                                            )
                                        }
                                    />
                                </TableHead>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <div className="space-y-1">
                                                {/* Header */}
                                                <div
                                                    className="cursor-pointer select-none"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext(),
                                                    )}
                                                    {{
                                                        asc: ' ↑',
                                                        desc: ' ↓',
                                                    }[
                                                        header.column.getIsSorted() as string
                                                    ] ?? null}
                                                </div>

                                                {/* Column Filter */}
                                                {header.column.getCanFilter() && (
                                                    <Input
                                                        value={
                                                            (header.column.getFilterValue() as string) ??
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            header.column.setFilterValue(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Filter..."
                                                        className="h-8"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="w-10">
                                        <Checkbox
                                            aria-label={`Select record ${row.id}`}
                                            checked={row.getIsSelected()}
                                            onCheckedChange={(checked) =>
                                                row.toggleSelected(
                                                    checked === true,
                                                )
                                            }
                                        />
                                    </TableCell>
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
                                    colSpan={columns.length + 1}
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
            <div className="flex flex-wrap items-center justify-end gap-2">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    Rows per page
                    <select
                        className="h-9 rounded-md border bg-background px-2 text-sm text-foreground"
                        value={pagination.pageSize}
                        onChange={(event) =>
                            setPagination({
                                pageIndex: 0,
                                pageSize: Number(event.target.value),
                            })
                        }
                    >
                        {[10, 20, 30, 40].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </label>
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
