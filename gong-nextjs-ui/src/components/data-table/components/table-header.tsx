import {TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {flexRender, RowData, Table} from "@tanstack/react-table";
import * as React from "react";

export function TableHeaderGroup<TData extends RowData>({
                                                                      table,
                                                                  }: { table: Table<TData> }) {
    return (
        <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                            <TableHead key={header.id} colSpan={header.colSpan}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </TableHead>
                        )
                    })}
                </TableRow>
            ))}
        </TableHeader>

    )
}