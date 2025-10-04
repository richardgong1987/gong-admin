import {flexRender, Row} from "@tanstack/react-table";
import {schema} from "@/components/data-table/data-table";
import {useSortable} from "@dnd-kit/sortable";
import {TableCell, TableRow} from "@/components/ui/table";
import * as React from "react";
import {z} from "zod";

export function TableRowGroup({row}: { row: Row<z.infer<typeof schema>> }) {
    const {setNodeRef} = useSortable({
        id: row.original.id,
    })
    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}