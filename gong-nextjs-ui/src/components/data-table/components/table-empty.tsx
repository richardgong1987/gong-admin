import {TableCell, TableRow} from "@/components/ui/table";
import * as React from "react";
import {ColumnDef} from "@tanstack/react-table";
import {schema} from "@/components/data-table/data-table";
import {z} from "zod";

export const TableEmpty = ({columns}: { columns: ColumnDef<z.infer<typeof schema>>[] }) => <TableRow>
        <TableCell
            colSpan={columns.length}
            className="h-24 text-center"
        >
            No results.
        </TableCell>
    </TableRow>
;