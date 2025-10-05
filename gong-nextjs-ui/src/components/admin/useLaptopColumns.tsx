"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical, IconInfoCircle, IconPencil, IconTrash } from "@tabler/icons-react";
import type { Laptop } from "./schema";

export function useLaptopColumns({
                                     onView,
                                     onEdit,
                                     onCopy,
                                     onDelete,
                                 }: {
    onView: (row: Laptop) => void | Promise<void>;
    onEdit: (row: Laptop) => void;
    onCopy: (row: Laptop) => void | Promise<void>;
    onDelete: (row: Laptop) => void | Promise<void>;
}) {
    return React.useMemo<ColumnDef<Laptop>[]>(() => {
        return [
            {
                id: "select",
                header: ({ table }) => (
                    <div className="flex items-center justify-center">
                        <Checkbox
                            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                        />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} />
                    </div>
                ),
                enableSorting: false,
                enableHiding: false,
                size: 36,
            },
            { accessorKey: "id", header: "id" },
            { accessorKey: "laptopCode", header: "番号" },
            { accessorKey: "officeLicense", header: "ライセンスキー" },
            { accessorKey: "microsoftAccount", header: "Microsoft Account" },
            { accessorKey: "productId", header: "PRODUCT_ID" },
            { accessorKey: "skuId", header: "SKU_ID" },
            { accessorKey: "licenseName", header: "LICENSE_NAME" },
            { accessorKey: "licenseDescription", header: "LICENSE_DESCRIPTION" },
            { accessorKey: "betaExpiration", header: "BETA_EXPIRATION" },
            { accessorKey: "licenseStatus", header: "LICENSE_STATUS" },
            { accessorKey: "status", header: "status" },
            { accessorKey: "remark", header: "remark" },
            {
                id: "actions",
                header: "操作",
                cell: ({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted text-muted-foreground">
                                <IconDotsVertical />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => onView(row.original)}>
                                <IconInfoCircle className="mr-2 h-4 w-4" /> 查看
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(row.original)}>
                                <IconPencil className="mr-2 h-4 w-4" /> 编辑
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onCopy(row.original)}>复制</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onDelete(row.original)}>
                                <IconTrash className="mr-2 h-4 w-4" /> 删除
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ];
    }, [onView, onEdit, onCopy, onDelete]);
}
