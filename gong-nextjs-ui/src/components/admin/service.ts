"use client";

import {laptopSchema} from "./schema";
import {BizService} from "@/lib/service/interface";

export type BizLaptopService = BizService<typeof laptopSchema>;
/** Default service (fetch). Swap with your axios layer if you prefer. */
export const defaultService: BizLaptopService = {
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
        const url = `/api/bizLaptopManagement/deleteBizLaptopManagementByIds?${new URLSearchParams(
            ids.map((v, i) => [`ids[${i}]`, String(v)]) as any
        ).toString()}`;
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
        return j?.data ?? j;
    },
    async list(params) {
        const usp = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== "") usp.append(k, String(v));
        });
        const r = await fetch(`/api/bizLaptopManagement/getBizLaptopManagementList?${usp.toString()}`);
        if (!r.ok) throw new Error("获取失败");
        return r.json();
    },
};
