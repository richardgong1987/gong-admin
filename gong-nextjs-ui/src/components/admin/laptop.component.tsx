"use client";

import * as React from "react";
import {z} from "zod";
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
    VisibilityState,
} from "@tanstack/react-table";
import {zodResolver} from "@hookform/resolvers/zod";
import {type Resolver, useForm} from "react-hook-form";
import {toast} from "sonner";
import {IconDotsVertical, IconInfoCircle, IconPencil, IconPlus, IconTrash,} from "@tabler/icons-react";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,} from "@/components/ui/sheet";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {BizService} from "@/lib/service/interface";

/***** Schema *****/
export const laptopSchema = z.object({
    id: z.number().int().nonnegative().default(0),
    laptopCode: z.string().default(""),
    officeLicense: z.string().default(""),
    microsoftAccount: z.string().default(""),
    productId: z.string().default(""),
    skuId: z.string().default(""),
    licenseName: z.string().default(""),
    licenseDescription: z.string().default(""),
    betaExpiration: z.string().default(""),
    licenseStatus: z.string().default(""),
    status: z.string().default(""),
    remark: z.string().default(""),
});
export type Laptop = z.infer<typeof laptopSchema>;
type FormValues = z.output<typeof laptopSchema>;

/***** Service interface mapping your Vue service *****/
export interface BizLaptopService extends BizService<typeof laptopSchema>{
}

/** defaultService uses the same endpoints you posted (method + path) */
const defaultService: BizLaptopService = {
    async create(payload) {
        const r = await fetch(`/api/bizLaptopManagement/createBizLaptopManagement`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error("创建失败");
        return r.json();
    },
    async delete(id) {
        const r = await fetch(`/api/bizLaptopManagement/deleteBizLaptopManagement?id=${id}`, {method: "DELETE"});
        if (!r.ok) throw new Error("删除失败");
        return r.json();
    },
    async deleteByIds(ids) {
        const url = `/api/bizLaptopManagement/deleteBizLaptopManagementByIds?${new URLSearchParams(ids.map((v, i) => ["ids[" + i + "]", String(v)]) as any).toString()}`;
        const r = await fetch(url, {method: "DELETE"});
        if (!r.ok) throw new Error("批量删除失败");
        return r.json();
    },
    async update(payload) {
        const r = await fetch(`/api/bizLaptopManagement/updateBizLaptopManagement`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error("更新失败");
        return r.json();
    },
    async find(id) {
        const r = await fetch(`/api/bizLaptopManagement/findBizLaptopManagement?id=${id}`);
        if (!r.ok) throw new Error("查询失败");
        const j = await r.json();
        return j?.data ?? j; // support either {data} or raw
    },
    async list(params) {
        const usp = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== "") usp.append(k, String(v));
        });
        const r = await fetch(`/api/bizLaptopManagement/getBizLaptopManagementList?${usp.toString()}`);
        if (!r.ok) throw new Error("获取失败");
        const j = await r.json();
        return j;
    },
};

/***** Drawer Form *****/
function LaptopForm({open, onOpenChange, defaults, onSubmit}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    defaults: Partial<FormValues>;
    onSubmit: (v: FormValues) => Promise<void>;
}) {
    const form = useForm<FormValues, any, FormValues>({
        resolver: zodResolver(laptopSchema) as Resolver<FormValues>,
        defaultValues: {
            id: 0,
            laptopCode: "",
            officeLicense: "",
            microsoftAccount: "",
            productId: "",
            skuId: "",
            licenseName: "",
            licenseDescription: "",
            betaExpiration: "",
            licenseStatus: "",
            status: "",
            remark: "",
            ...defaults,
        },
        mode: "onChange",
    });

    React.useEffect(() => {
        form.reset({
            id: 0,
            laptopCode: "",
            officeLicense: "",
            microsoftAccount: "",
            productId: "",
            skuId: "",
            licenseName: "",
            licenseDescription: "",
            betaExpiration: "",
            licenseStatus: "",
            status: "",
            remark: "",
            ...defaults,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaults, open]);

    const submit = form.handleSubmit(async (values) => {
        await onSubmit(values);
        onOpenChange(false);
    });

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{(defaults?.id ?? 0) > 0 ? "编辑" : "新增"}</SheetTitle>
                    <SheetDescription>请输入笔记本授权信息。</SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    <Form {...form}>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(Object.keys(laptopSchema.shape) as (keyof FormValues)[]).filter(k => k !== "id").map((key) => (
                                <FormField key={String(key)} control={form.control} name={key as any}
                                           render={({field}) => (
                                               <FormItem>
                                                   <FormLabel>{String(key)}</FormLabel>
                                                   <FormControl>
                                                       {key === "remark" || key === "licenseDescription" ? (
                                                           <Textarea rows={4} {...field} />
                                                       ) : (
                                                           <Input {...field} />
                                                       )}
                                                   </FormControl>
                                                   <FormMessage/>
                                               </FormItem>
                                           )}
                                />
                            ))}
                            <SheetFooter className="col-span-full mt-2">
                                <div className="flex gap-2">
                                    <Button type="submit">确 定</Button>
                                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取
                                        消</Button>
                                </div>
                            </SheetFooter>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}

/***** Details Drawer *****/
function LaptopDetails({open, onOpenChange, data}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    data?: Partial<Laptop>
}) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>查看</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-3">
                    {Object.entries(data ?? {}).map(([k, v]) => (
                        <div key={k} className="grid grid-cols-3 gap-2 items-start">
                            <Label className="text-muted-foreground">{k}</Label>
                            <div className="col-span-2 break-words">{String(v ?? "")}</div>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}

/***** Main Component *****/
export default function LaptopManagementTable({service = defaultService}: { service?: BizLaptopService }) {
    // table state
    const [data, setData] = React.useState<Laptop[]>([]);
    const [total, setTotal] = React.useState(0);
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({pageIndex: 0, pageSize: 10});

    // search
    const [showAll, setShowAll] = React.useState(true);
    const [search, setSearch] = React.useState<Partial<Laptop>>({});

    const page = pagination.pageIndex + 1;
    const pageSize = pagination.pageSize;

    // drawers
    const [openForm, setOpenForm] = React.useState(false);
    const [editing, setEditing] = React.useState<Partial<FormValues>>({});
    const [openDetail, setOpenDetail] = React.useState(false);
    const [detail, setDetail] = React.useState<Partial<Laptop>>({});

    const load = React.useCallback(async () => {
        const res = await service.list({page, pageSize, ...search});
        const payload = res?.data ?? res;
        const list = (payload?.list ?? []) as Laptop[];
        const total = Number(payload?.total ?? list.length);
        setData(list);
        setTotal(total);
    }, [service, page, pageSize, search]);

    React.useEffect(() => {
        load().catch(e => toast.error(String(e?.message || e)));
    }, [load]);

    // Actions
    const handleDelete = async (row: Laptop) => {
        await toast.promise(service.delete(row.id), {loading: "删除中…", success: "删除成功", error: "删除失败"});
        if (data.length === 1 && page > 1) setPagination((p) => ({...p, pageIndex: p.pageIndex - 1}));
        await load();
    };

    const handleBulkDelete = async () => {
        const ids = Object.entries(rowSelection).filter(([, v]) => v).map(([k]) => Number(k));
        if (ids.length === 0) return toast.warning("请选择要删除的数据");
        await toast.promise(service.deleteByIds(ids), {loading: "删除中…", success: "删除成功", error: "删除失败"});
        if (data.length === ids.length && page > 1) setPagination((p) => ({...p, pageIndex: p.pageIndex - 1}));
        setRowSelection({});
        await load();
    };

    const handleCopyFrom = async (row: Laptop) => {
        const found: any = await service.find(row.id);
        const src: Laptop = (found?.data ?? found) as Laptop;
        const {id, ...rest} = src;
        await toast.promise(service.create(rest), {loading: "复制中…", success: "复制成功", error: "复制失败"});
        await load();
    };

    const submitForm = async (values: FormValues) => {
        const isUpdate = (values?.id ?? 0) > 0;
        await toast.promise(isUpdate ? service.update(values) : service.create(values as any), {
            loading: isUpdate ? "更新中…" : "创建中…",
            success: "创建/更改成功",
            error: "请求失败",
        });
        await load();
    };

    const columns = React.useMemo<ColumnDef<Laptop>[]>(() => [
        {
            id: "select",
            header: ({table}) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                    />
                </div>
            ),
            cell: ({row}) => (
                <div className="flex items-center justify-center">
                    <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)}/>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
            size: 36,
        },
        {accessorKey: "id", header: "id"},
        {accessorKey: "laptopCode", header: "番号"},
        {accessorKey: "officeLicense", header: "ライセンスキー"},
        {accessorKey: "microsoftAccount", header: "Microsoft Account"},
        {accessorKey: "productId", header: "PRODUCT_ID"},
        {accessorKey: "skuId", header: "SKU_ID"},
        {accessorKey: "licenseName", header: "LICENSE_NAME"},
        {accessorKey: "licenseDescription", header: "LICENSE_DESCRIPTION"},
        {accessorKey: "betaExpiration", header: "BETA_EXPIRATION"},
        {accessorKey: "licenseStatus", header: "LICENSE_STATUS"},
        {accessorKey: "status", header: "status"},
        {accessorKey: "remark", header: "remark"},
        {
            id: "actions",
            header: "操作",
            cell: ({row}) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"
                                className="data-[state=open]:bg-muted text-muted-foreground">
                            <IconDotsVertical/>
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={async () => {
                            const found: any = await service.find(row.original.id);
                            const d: Laptop = (found?.data ?? found) as Laptop;
                            setDetail(d);
                            setOpenDetail(true);
                        }}>
                            <IconInfoCircle className="mr-2 h-4 w-4"/> 查看
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            setEditing(row.original);
                            setOpenForm(true);
                        }}>
                            <IconPencil className="mr-2 h-4 w-4"/> 编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyFrom(row.original)}>
                            复制
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => handleDelete(row.original)}>
                            <IconTrash className="mr-2 h-4 w-4"/> 删除
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ], [service]);

    const table = useReactTable({
        data,
        columns,
        state: {sorting, columnVisibility, rowSelection, columnFilters, pagination},
        getRowId: (row) => String(row.id),
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

    const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize));

    // search submit
    const submitSearch = React.useCallback(async () => {
        setPagination((p) => ({...p, pageIndex: 0}));
        await load();
    }, [load]);

    const resetSearch = () => {
        setSearch({});
        setPagination((p) => ({...p, pageIndex: 0}));
        load();
    };

    return (
        <div className="space-y-4">
            {/* Search box */}
            <div className="rounded-xl border p-4 bg-background">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <Label>id</Label>
                        <Input value={String(search.id ?? "")} onChange={(e) => setSearch(s => ({
                            ...s,
                            id: e.target.value ? Number(e.target.value) : undefined
                        }))} onKeyDown={(e) => e.key === 'Enter' && submitSearch()}/>
                    </div>
                    <div>
                        <Label>番号</Label>
                        <Input value={search.laptopCode ?? ""}
                               onChange={(e) => setSearch(s => ({...s, laptopCode: e.target.value}))}
                               onKeyDown={(e) => e.key === 'Enter' && submitSearch()}/>
                    </div>
                    <div>
                        <Label>ライセンスキー</Label>
                        <Input value={search.officeLicense ?? ""}
                               onChange={(e) => setSearch(s => ({...s, officeLicense: e.target.value}))}
                               onKeyDown={(e) => e.key === 'Enter' && submitSearch()}/>
                    </div>
                    <div>
                        <Label>Microsoft Account</Label>
                        <Input value={search.microsoftAccount ?? ""}
                               onChange={(e) => setSearch(s => ({...s, microsoftAccount: e.target.value}))}
                               onKeyDown={(e) => e.key === 'Enter' && submitSearch()}/>
                    </div>
                    <div>
                        <Label>PRODUCT_ID</Label>
                        <Input value={search.productId ?? ""}
                               onChange={(e) => setSearch(s => ({...s, productId: e.target.value}))}
                               onKeyDown={(e) => e.key === 'Enter' && submitSearch()}/>
                    </div>
                    <div>
                        <Label>SKU_ID</Label>
                        <Input value={search.skuId ?? ""}
                               onChange={(e) => setSearch(s => ({...s, skuId: e.target.value}))}
                               onKeyDown={(e) => e.key === 'Enter' && submitSearch()}/>
                    </div>
                    <div>
                        <Label>LICENSE_NAME</Label>
                        <Input value={search.licenseName ?? ""}
                               onChange={(e) => setSearch(s => ({...s, licenseName: e.target.value}))}
                               onKeyDown={(e) => e.key === 'Enter' && submitSearch()}/>
                    </div>
                    <div>
                        <Label>LICENSE_DESCRIPTION</Label>
                        <Input value={search.licenseDescription ?? ""}
                               onChange={(e) => setSearch(s => ({...s, licenseDescription: e.target.value}))}
                               onKeyDown={(e) => e.key === 'Enter' && submitSearch()}/>
                    </div>
                    <div>
                        <Label>BETA_EXPIRATION</Label>
                        <Input value={search.betaExpiration ?? ""}
                               onChange={(e) => setSearch(s => ({...s, betaExpiration: e.target.value}))}
                               onKeyDown={(e) => e.key === 'Enter' && submitSearch()}/>
                    </div>
                    <div>
                        <Label>LICENSE_STATUS</Label>
                        <Input value={search.licenseStatus ?? ""}
                               onChange={(e) => setSearch(s => ({...s, licenseStatus: e.target.value}))}
                               onKeyDown={(e) => e.key === 'Enter' && submitSearch()}/>
                    </div>
                    <div>
                        <Label>status</Label>
                        <Input value={search.status ?? ""}
                               onChange={(e) => setSearch(s => ({...s, status: e.target.value}))}
                               onKeyDown={(e) => e.key === 'Enter' && submitSearch()}/>
                    </div>
                    <div>
                        <Label>remark</Label>
                        <Input value={search.remark ?? ""}
                               onChange={(e) => setSearch(s => ({...s, remark: e.target.value}))}
                               onKeyDown={(e) => e.key === 'Enter' && submitSearch()}/>
                    </div>
                </div>
                <div className="mt-3 flex gap-2">
                    <Button onClick={submitSearch}>查询</Button>
                    <Button variant="outline" onClick={resetSearch}>重置</Button>
                    <Button variant="link" onClick={() => setShowAll(v => !v)}>
                        {showAll ? "收起" : "展开"}
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2">
                <Button onClick={() => {
                    setEditing({id: 0});
                    setOpenForm(true);
                }}>
                    <IconPlus className="mr-2 h-4 w-4"/> 新增
                </Button>
                <Button variant="destructive" disabled={Object.values(rowSelection).every(v => !v)}
                        onClick={handleBulkDelete}>
                    <IconTrash className="mr-2 h-4 w-4"/> 删除
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-xl border bg-background">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id} style={{width: header.getSize()}}>
                                        {header.isPlaceholder ? null : header.column.columnDef.header as React.ReactNode}
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
                                <TableCell colSpan={table.getAllColumns().length}
                                           className="h-24 text-center text-muted-foreground">
                                    数据为空
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    {total.toLocaleString()} 条 ·
                    第 {(pagination.pageIndex + 1)} / {Math.max(1, Math.ceil(total / pagination.pageSize))} 页
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="ps">Page size</Label>
                    <select id="ps" className="h-9 rounded-md border bg-background px-2" value={pagination.pageSize}
                            onChange={(e) => setPagination(p => ({
                                ...p,
                                pageSize: Number(e.target.value),
                                pageIndex: 0
                            }))}>
                        {[10, 30, 50, 100].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => setPagination(p => ({...p, pageIndex: 0}))}
                                disabled={pagination.pageIndex === 0}>« First</Button>
                        <Button variant="outline" size="sm"
                                onClick={() => setPagination(p => ({...p, pageIndex: Math.max(0, p.pageIndex - 1)}))}
                                disabled={pagination.pageIndex === 0}>‹ Prev</Button>
                        <Button variant="outline" size="sm" onClick={() => setPagination(p => ({
                            ...p,
                            pageIndex: Math.min(Math.max(1, Math.ceil(total / p.pageSize)) - 1, p.pageIndex + 1)
                        }))}
                                disabled={(pagination.pageIndex + 1) >= Math.max(1, Math.ceil(total / pagination.pageSize))}>Next
                            ›</Button>
                        <Button variant="outline" size="sm" onClick={() => setPagination(p => ({
                            ...p,
                            pageIndex: Math.max(1, Math.ceil(total / p.pageSize)) - 1
                        }))}
                                disabled={(pagination.pageIndex + 1) >= Math.max(1, Math.ceil(total / pagination.pageSize))}>Last
                            »</Button>
                    </div>
                </div>
            </div>

            {/* Drawers */}
            <LaptopForm open={openForm} onOpenChange={setOpenForm} defaults={editing} onSubmit={submitForm}/>
            <LaptopDetails open={openDetail} onOpenChange={setOpenDetail} data={detail}/>
        </div>
    );
}
