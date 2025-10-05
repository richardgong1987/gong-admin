"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Laptop } from "./schema";

export function LaptopSearch({
                                 value,
                                 onChange,
                                 onSubmit,
                                 onReset,
                                 showAll,
                                 setShowAll,
                             }: {
    value: Partial<Laptop>;
    onChange: (v: Partial<Laptop>) => void;
    onSubmit: () => void | Promise<void>;
    onReset: () => void | Promise<void>;
    showAll: boolean;
    setShowAll: (v: boolean) => void;
}) {
    return (
        <div className="rounded-xl border p-4 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {([
                    ["id", "id"],
                    ["laptopCode", "番号"],
                    ["officeLicense", "ライセンスキー"],
                    ["microsoftAccount", "Microsoft Account"],
                    ["productId", "PRODUCT_ID"],
                    ["skuId", "SKU_ID"],
                    ["licenseName", "LICENSE_NAME"],
                    ["licenseDescription", "LICENSE_DESCRIPTION"],
                    ["betaExpiration", "BETA_EXPIRATION"],
                    ["licenseStatus", "LICENSE_STATUS"],
                    ["status", "status"],
                    ["remark", "remark"],
                ] as const).map(([key, label]) => (
                    <div key={key}>
                        <Label>{label}</Label>
                        <Input
                            value={key === "id" ? String((value as any)[key] ?? "") : ((value as any)[key] ?? "")}
                            onChange={(e) =>
                                onChange({
                                    ...value,
                                    [key]: key === "id" ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value,
                                })
                            }
                            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-3 flex gap-2">
                <Button onClick={onSubmit}>查询</Button>
                <Button variant="outline" onClick={onReset}>
                    重置
                </Button>
                <Button variant="link" onClick={() => setShowAll(!showAll)}>
                    {showAll ? "收起" : "展开"}
                </Button>
            </div>
        </div>
    );
}
