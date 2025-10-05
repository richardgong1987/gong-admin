"use client";

import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Label} from "@/components/ui/label";
import type {Laptop} from "./schema";

export function LaptopDetails({
                                  open,
                                  onOpenChange,
                                  data,
                              }: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    data?: Partial<Laptop>;
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
