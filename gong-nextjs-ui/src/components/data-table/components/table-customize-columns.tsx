import {RowData, Table} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {IconChevronDown, IconLayoutColumns} from "@tabler/icons-react";
import * as React from "react";

export function TableCustomizeColumns<TData extends RowData>({
                                                                 table,
                                                             }: { table: Table<TData> }) {

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <IconLayoutColumns/>
                        <span className="hidden lg:inline">Customize Columns</span>
                        <span className="lg:hidden">Columns</span>
                        <IconChevronDown/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    {table
                        .getAllColumns()
                        .filter(
                            (column) =>
                                typeof column.accessorFn !== "undefined" &&
                                column.getCanHide()
                        )
                        .map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            )
                        })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )

}