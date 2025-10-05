"use client";

import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    type RowSelectionState,
    type Updater,
    type ColumnDef,
} from "@tanstack/react-table";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { Laptop } from "./schema";

interface TableStateProps {
    sorting: SortingState;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
    columnVisibility: VisibilityState;
    setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
    rowSelection: RowSelectionState;
    setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
    columnFilters: ColumnFiltersState;
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
    pagination: { pageIndex: number; pageSize: number };
    setPagination: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>;
}

export function LaptopTable({
                                data,
                                columns,
                                state,
                            }: {
    data: Laptop[];
    columns: ColumnDef<Laptop, any>[];
    state: TableStateProps;
}) {
    const handleRowSelectionChange = (u: Updater<RowSelectionState>) =>
        state.setRowSelection((old) => (typeof u === "function" ? u(old) : u));
    const handleSortingChange = (u: Updater<SortingState>) =>
        state.setSorting((old) => (typeof u === "function" ? u(old) : u));
    const handleColumnFiltersChange = (u: Updater<ColumnFiltersState>) =>
        state.setColumnFilters((old) => (typeof u === "function" ? u(old) : u));
    const handleColumnVisibilityChange = (u: Updater<VisibilityState>) =>
        state.setColumnVisibility((old) => (typeof u === "function" ? u(old) : u));
    const handlePaginationChange = (u: Updater<{ pageIndex: number; pageSize: number }>) =>
        state.setPagination((old) => (typeof u === "function" ? u(old) : u));

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting: state.sorting,
            columnVisibility: state.columnVisibility,
            rowSelection: state.rowSelection,
            columnFilters: state.columnFilters,
            pagination: state.pagination,
        },
        getRowId: (row) => String(row.id),
        enableRowSelection: true,
        onRowSelectionChange: handleRowSelectionChange,
        onSortingChange: handleSortingChange,
        onColumnFiltersChange: handleColumnFiltersChange,
        onColumnVisibilityChange: handleColumnVisibilityChange,
        onPaginationChange: handlePaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="rounded-xl border bg-background">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((hg) => (
                        <TableRow key={hg.id}>
                            {hg.headers.map((header) => (
                                <TableHead key={header.id} style={{ width: header.getSize() }}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center text-muted-foreground">
                                数据为空
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
