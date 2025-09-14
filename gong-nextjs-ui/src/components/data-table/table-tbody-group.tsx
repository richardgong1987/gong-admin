import {ColumnDef, RowData, Table} from "@tanstack/react-table";
import {TableEmpty} from "@/components/data-table/table-empty";
import {TableBody} from "@/components/ui/table";
import * as React from "react";
import {schema} from "@/components/data-table/data-table";
import {z} from "zod";
import {TableRowGroup} from "@/components/data-table/table-row-group";

export function TableTbodyGroup<TData extends RowData>({
                                                           table,
                                                           columns,
                                                       }: {
    table: Table<TData>,
    columns: ColumnDef<z.infer<typeof schema>>[]
}) {
    return (
        <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRowGroup key={row.id} row={row}/>
                    ))
                ) :
                <TableEmpty columns={columns}/>
            }
        </TableBody>
    )

}