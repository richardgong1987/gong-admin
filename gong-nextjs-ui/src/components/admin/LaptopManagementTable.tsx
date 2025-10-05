"use client";

import * as React from "react";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {IconPlus, IconTrash} from "@tabler/icons-react";
import type {ColumnFiltersState, SortingState, VisibilityState} from "@tanstack/react-table";

import {LaptopForm} from "./LaptopForm";
import {LaptopDetails} from "./LaptopDetails";
import {LaptopSearch} from "./LaptopSearch";
import {LaptopTable} from "./LaptopTable";
import {Pager} from "./Pager";
import {useLaptopColumns} from "./useLaptopColumns";
import {type BizLaptopService, defaultService} from "./service";
import type {FormValues, Laptop} from "./schema";

export function LaptopManagementTable({service = defaultService}: { service?: BizLaptopService }) {
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
        load().catch((e) => toast.error(String(e?.message || e)));
    }, [load]);

    // actions
    const handleDelete = async (row: Laptop) => {
        await toast.promise(service.delete(row.id), {loading: "删除中…", success: "删除成功", error: "删除失败"});
        if (data.length === 1 && page > 1) setPagination((p) => ({...p, pageIndex: p.pageIndex - 1}));
        await load();
    };

    const handleBulkDelete = async () => {
        const ids = Object.entries(rowSelection)
            .filter(([, v]) => v)
            .map(([k]) => Number(k));
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

    const tableColumns = useLaptopColumns({
        onView: async (row) => {
            const found: any = await service.find(row.id);
            const d: Laptop = (found?.data ?? found) as Laptop;
            setDetail(d);
            setOpenDetail(true);
        },
        onEdit: (row) => {
            setEditing(row);
            setOpenForm(true);
        },
        onCopy: handleCopyFrom,
        onDelete: handleDelete,
    });

    // search handlers
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
            <LaptopSearch
                value={search}
                onChange={setSearch}
                onSubmit={submitSearch}
                onReset={resetSearch}
                showAll={showAll}
                setShowAll={setShowAll}
            />

            {/* Toolbar */}
            <div className="flex items-center gap-2">
                <Button
                    onClick={() => {
                        setEditing({id: 0});
                        setOpenForm(true);
                    }}
                >
                    <IconPlus className="mr-2 h-4 w-4"/> 新增
                </Button>
                <Button variant="destructive" disabled={Object.values(rowSelection).every((v) => !v)}
                        onClick={handleBulkDelete}>
                    <IconTrash className="mr-2 h-4 w-4"/> 删除
                </Button>
            </div>

            <LaptopTable
                data={data}
                columns={tableColumns}
                state={{
                    sorting,
                    setSorting,
                    columnVisibility,
                    setColumnVisibility,
                    rowSelection,
                    setRowSelection,
                    columnFilters,
                    setColumnFilters,
                    pagination,
                    setPagination,
                }}
            />

            <Pager
                total={total}
                pageIndex={pagination.pageIndex}
                pageSize={pagination.pageSize}
                setPageSize={(n) => setPagination((p) => ({...p, pageSize: n}))}
                setPageIndex={(n) => setPagination((p) => ({...p, pageIndex: n}))}
            />

            <LaptopForm open={openForm} onOpenChange={setOpenForm} defaults={editing} onSubmit={submitForm}/>
            <LaptopDetails open={openDetail} onOpenChange={setOpenDetail} data={detail}/>
        </div>
    );
}

export default LaptopManagementTable;
