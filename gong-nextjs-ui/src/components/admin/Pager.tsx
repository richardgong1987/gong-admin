"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function Pager({
                          total,
                          pageIndex,
                          pageSize,
                          setPageSize,
                          setPageIndex,
                      }: {
    total: number;
    pageIndex: number; // zero-based
    pageSize: number;
    setPageSize: (n: number) => void;
    setPageIndex: (n: number) => void;
}) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = pageIndex + 1;

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                {total.toLocaleString()} 条 · 第 {page} / {totalPages} 页
            </div>
            <div className="flex items-center gap-2">
                <Label htmlFor="ps">Page size</Label>
                <select
                    id="ps"
                    className="h-9 rounded-md border bg-background px-2"
                    value={pageSize}
                    onChange={(e) => {
                        setPageIndex(0);
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 30, 50, 100].map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
                <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={() => setPageIndex(0)} disabled={page === 1}>
                        « First
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
                        disabled={page === 1}
                    >
                        ‹ Prev
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageIndex(Math.min(totalPages - 1, pageIndex + 1))}
                        disabled={page >= totalPages}
                    >
                        Next ›
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageIndex(totalPages - 1)}
                        disabled={page >= totalPages}
                    >
                        Last »
                    </Button>
                </div>
            </div>
        </div>
    );
}
