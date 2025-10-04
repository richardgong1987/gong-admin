"use client";

import * as React from "react";
import { z } from "zod";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";
import {
    IconCircleCheckFilled,
    IconDotsVertical,
    IconLoader,
    IconPlus,
    IconTrash,
    IconStar,
    IconStarOff,
    IconCopy,
    IconPencil,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

/*****
 * Types & Schema
 *****/
export const categorySchema = z.object({
    ID: z.number().int().nonnegative().default(0),
    pid: z.number().int().nonnegative().default(0),
    name: z.string().min(1, "Required"),
    info: z.string().optional().default(""),
    img: z.string().optional().default(""),
    linkname: z.string().optional().default(""),
    linkvalue: z.string().url("Must be a URL").optional().or(z.literal("")).default(""),
    sort: z.number().int().nonnegative().default(0),
    hot: z.boolean().default(false),
});
export type Category = z.infer<typeof categorySchema>;

/*****
 * Service interface — plug in your real API here
 *****/
export interface BizCategoryService {
    list: (params: { page?: number; pageSize?: number; keyword?: string }) => Promise<{ list: Category[]; total: number }>;
    find: (ID: number) => Promise<Category>;
    create: (payload: Omit<Category, "ID">) => Promise<void>;
    update: (payload: Category) => Promise<void>;
    delete: (ID: number) => Promise<void>;
    deleteByIds: (IDs: number[]) => Promise<void>;
    popular: (ID: number) => Promise<void>; // toggle hot
}

/*****
 * Example defaultService using fetch — replace endpoints to match your backend
 * (This keeps the component drop-in; you can also pass a custom `service` prop)
 *****/
const defaultService: BizCategoryService = {
    async list({ page = 1, pageSize = 10, keyword = "" }) {
        const res = await fetch(`/api/bizCategory/tree?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`);
        if (!res.ok) throw new Error("Failed to load categories");
        const json = await res.json();
        // Expecting { code:0, data:{ list, total } }
        const list = (json?.data?.list ?? []) as Category[];
        const total = Number(json?.data?.total ?? list.length);
        return { list, total };
    },
    async find(ID: number) {
        const res = await fetch(`/api/bizCategory/find?ID=${ID}`);
        if (!res.ok) throw new Error("Failed to find category");
        const json = await res.json();
        return json?.data?.rebizCategory as Category;
    },
    async create(payload) {
        const res = await fetch(`/api/bizCategory/create`, { method: "POST", body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Failed to create");
    },
    async update(payload) {
        const res = await fetch(`/api/bizCategory/update`, { method: "POST", body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Failed to update");
    },
    async delete(ID: number) {
        const res = await fetch(`/api/bizCategory/delete`, { method: "POST", body: JSON.stringify({ ID }) });
        if (!res.ok) throw new Error("Failed to delete");
    },
    async deleteByIds(IDs: number[]) {
        const res = await fetch(`/api/bizCategory/deleteByIds`, { method: "POST", body: JSON.stringify({ IDs }) });
        if (!res.ok) throw new Error("Failed to bulk delete");
    },
    async popular(ID: number) {
        const res = await fetch(`/api/bizCategory/popular`, { method: "POST", body: JSON.stringify({ ID }) });
        if (!res.ok) throw new Error("Failed to toggle popular");
    },
};

/*****
 * Image helper (URL → preview). Replace with your own <SelectImage/> if you have one.
 *****/
function ImagePreview({ src }: { src?: string }) {
    if (!src) return null;
    return (
        <img
            src={src}
            alt="preview"
            className="h-10 w-10 rounded-md object-cover border"
        />
    );
}

/*****
 * CRUD Drawer (Sheet) Form
 *****/
function CategoryForm({
                          open,
                          onOpenChange,
                          defaultValues,
                          onSubmit,
                      }: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    defaultValues: Partial<Category> & { pid?: number };
    onSubmit: (values: Category) => Promise<void>;
}) {
    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            ID: 0,
            pid: 0,
            name: "",
            info: "",
            img: "",
            linkname: "",
            linkvalue: "",
            sort: 0,
            hot: false,
            ...defaultValues,
        },
        mode: "onChange",
    });

    React.useEffect(() => {
        form.reset({
            ID: 0,
            pid: 0,
            name: "",
            info: "",
            img: "",
            linkname: "",
            linkvalue: "",
            sort: 0,
            hot: false,
            ...defaultValues,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValues, open]);

    const handleSubmit = form.handleSubmit(async (values) => {
        await onSubmit(values as Category);
        onOpenChange(false);
    });

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{(defaultValues?.ID ?? 0) > 0 ? "修正" : "追加"}</SheetTitle>
                    <SheetDescription>カテゴリー情報を入力してください。</SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    <Form {...form}>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>カテゴリー名</FormLabel>
                                            <FormControl>
                                                <Input placeholder="カテゴリー名" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sort"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ソート</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="info"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>カテゴリーINFO</FormLabel>
                                        <FormControl>
                                            <Textarea rows={6} placeholder="説明…" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="linkname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Link名</FormLabel>
                                            <FormControl>
                                                <Input placeholder="リンクの表示名" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="linkvalue"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Link先(URL)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://…" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                <FormField
                                    control={form.control}
                                    name="img"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>写真(画像URL)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://…/image.jpg" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div>
                                    <Label className="mb-2 block">プレビュー</Label>
                                    <ImagePreview src={form.watch("img") || undefined} />
                                </div>
                            </div>

                            <SheetFooter>
                                <div className="flex gap-2">
                                    <Button type="submit">確 定</Button>
                                    <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                                        取 消
                                    </Button>
                                </div>
                            </SheetFooter>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}

/*****
 * Main CRUD Table Component
 *****/
export function DataTableCrud({ service = defaultService }: { service?: BizCategoryService }) {
    // table state
    const [data, setData] = React.useState<Category[]>([]);
    const [total, setTotal] = React.useState(0);
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
    const [keyword, setKeyword] = React.useState("");

    const page = pagination.pageIndex + 1;
    const pageSize = pagination.pageSize;

    // drawer dialog state
    const [open, setOpen] = React.useState(false);
    const [editing, setEditing] = React.useState<Partial<Category>>({});

    const load = React.useCallback(async () => {
        const { list, total } = await service.list({ page, pageSize, keyword });
        setData(list);
        setTotal(total);
    }, [service, page, pageSize, keyword]);

    React.useEffect(() => {
        load().catch((e) => toast.error(String(e?.message || e)));
    }, [load]);

    // inline sort update (debounced)
    const updateSortDebounced = useDebouncedCallback(async (row: Category, value: number) => {
        try {
            await service.update({ ...row, sort: value });
            toast.success("设置成功");
            await load();
        } catch (e: any) {
            toast.error(e?.message || "Failed to update sort");
        }
    }, 400);

    // toggle hot
    const toggleHot = async (row: Category) => {
        try {
            await service.popular(row.ID);
            toast.success("设置成功");
            await load();
        } catch (e: any) {
            toast.error(e?.message || "Failed to toggle");
        }
    };

    // actions
    const handleDeleteRow = async (row: Category) => {
        try {
            await service.delete(row.ID);
            toast.success("删除成功");
            if (data.length === 1 && page > 1) {
                setPagination((p) => ({ ...p, pageIndex: p.pageIndex - 1 }));
            }
            await load();
        } catch (e: any) {
            toast.error(e?.message || "Failed to delete");
        }
    };

    const handleBulkDelete = async () => {
        const IDs = Object.entries(rowSelection)
            .filter(([, v]) => v)
            .map(([k]) => Number(k));
        if (IDs.length === 0) {
            toast.warning("请选择要删除的数据");
            return;
        }
        try {
            await service.deleteByIds(IDs);
            toast.success("删除成功");
            if (data.length === IDs.length && page > 1) {
                setPagination((p) => ({ ...p, pageIndex: p.pageIndex - 1 }));
            }
            setRowSelection({});
            await load();
        } catch (e: any) {
            toast.error(e?.message || "Failed to bulk delete");
        }
    };

    const handleCopy = async (row: Category) => {
        try {
            const fresh = await service.find(row.ID);
            const { ID, ...rest } = fresh;
            await service.create(rest as Omit<Category, "ID">);
            toast.success("复制成功");
            await load();
        } catch (e: any) {
            toast.error(e?.message || "Failed to copy");
        }
    };

    // submit from drawer
    const submitForm = async (values: Category) => {
        const isUpdate = (values?.ID ?? 0) > 0;
        await toast.promise(isUpdate ? service.update(values) : service.create(values), {
            loading: isUpdate ? "更新中…" : "作成中…",
            success: "创建/更改成功",
            error: (e) => e?.message || "请求失败",
        });
        await load();
    };

    // columns
    const columns = React.useMemo<ColumnDef<Category>[]>(() => [
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(v) => row.toggleSelected(!!v)}
                        aria-label="Select row"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
            size: 36,
        },
        {
            accessorKey: "name",
            header: "カテゴリー名",
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
            accessorKey: "sort",
            header: "ソート",
            cell: ({ row }) => (
                <Input
                    type="number"
                    defaultValue={row.original.sort}
                    className="h-8 w-24"
                    onChange={(e) => updateSortDebounced(row.original, Number(e.target.value))}
                />
            ),
        },
        {
            accessorKey: "hot",
            header: "人気",
            cell: ({ row }) => (
                <Button variant={row.original.hot ? "secondary" : "ghost"} size="icon" onClick={() => toggleHot(row.original)}>
                    {row.original.hot ? <IconStar className="h-4 w-4" /> : <IconStarOff className="h-4 w-4" />}
                </Button>
            ),
        },
        {
            accessorKey: "info",
            header: "カテゴリーINFO",
            cell: ({ row }) => (
                <div className="max-w-[26rem] truncate text-muted-foreground" title={row.original.info || ""}>
                    {row.original.info || "—"}
                </div>
            ),
        },
        {
            accessorKey: "linkname",
            header: "カテゴリーlink",
            cell: ({ row }) => {
                const { linkname, linkvalue } = row.original;
                return linkvalue ? (
                    <a className="text-primary hover:underline" href={linkvalue} target="_blank" rel="noreferrer">
                        {linkname || linkvalue}
                    </a>
                ) : (
                    <span className="text-muted-foreground">—</span>
                );
            },
        },
        {
            id: "img",
            header: "写真",
            cell: ({ row }) => <ImagePreview src={row.original.img} />,
            size: 80,
        },
        {
            id: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant="outline" className="text-muted-foreground px-1.5">
                    {true ? (
                        <IconCircleCheckFilled className="mr-1 h-4 w-4 fill-green-500 dark:fill-green-400" />
                    ) : (
                        <IconLoader className="mr-1 h-4 w-4" />
                    )}
                    Done
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "操作",
            enableHiding: false,
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted text-muted-foreground">
                            <IconDotsVertical />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => { setEditing({ pid: row.original.ID }); setOpen(true); }}>
                            <IconPlus className="mr-2 h-4 w-4" /> サブカテゴリ
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditing(row.original); setOpen(true); }}>
                            <IconPencil className="mr-2 h-4 w-4" /> 变更
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopy(row.original)}>
                            <IconCopy className="mr-2 h-4 w-4" /> 复制
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteRow(row.original)}>
                            <IconTrash className="mr-2 h-4 w-4" /> 删除
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ], [toggleHot, handleCopy, updateSortDebounced]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
        getRowId: (row) => String(row.ID),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
                <Button onClick={() => { setEditing({ ID: 0, pid: 0 }); setOpen(true); }}>
                    <IconPlus className="mr-2 h-4 w-4" /> ルート分類の追加
                </Button>
                <Button variant="destructive" onClick={handleBulkDelete} disabled={Object.values(rowSelection).every((v) => !v)}>
                    <IconTrash className="mr-2 h-4 w-4" /> 删除
                </Button>
                <div className="ml-auto flex items-center gap-2">
                    <Input
                        placeholder="検索…"
                        className="w-56"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") load(); }}
                    />
                    <Button variant="outline" onClick={load}>検索</Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border bg-background">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id} style={{ width: header.getSize() }}>
                                        {header.isPlaceholder ? null : header.column.columnDef.header as React.ReactNode}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="**:data-[slot=table-cell]:first:w-8">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{cell.renderCell()}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                    データがありません
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    {total.toLocaleString()} 件中 {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} を表示
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="ps">Page size</Label>
                    <select
                        id="ps"
                        className="h-9 rounded-md border bg-background px-2"
                        value={pageSize}
                        onChange={(e) => setPagination((p) => ({ ...p, pageSize: Number(e.target.value), pageIndex: 0 }))}
                    >
                        {[10, 20, 50].map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPagination((p) => ({ ...p, pageIndex: 0 }))}
                            disabled={page === 1}
                        >
                            « First
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPagination((p) => ({ ...p, pageIndex: Math.max(0, p.pageIndex - 1) }))}
                            disabled={page === 1}
                        >
                            ‹ Prev
                        </Button>
                        <span className="px-2 text-sm text-muted-foreground">{page} / {totalPages}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPagination((p) => ({ ...p, pageIndex: Math.min(totalPages - 1, p.pageIndex + 1) }))}
                            disabled={page >= totalPages}
                        >
                            Next ›
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPagination((p) => ({ ...p, pageIndex: totalPages - 1 }))}
                            disabled={page >= totalPages}
                        >
                            Last »
                        </Button>
                    </div>
                </div>
            </div>

            {/* Drawer */}
            <CategoryForm
                open={open}
                onOpenChange={setOpen}
                defaultValues={editing}
                onSubmit={submitForm}
            />
        </div>
    );
}

/*****
 * Minimal named export matching your original component name for drop-in adoption
 *****/
export default DataTableCrud;
