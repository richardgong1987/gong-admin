// lib/menu-types.ts


import {IMenu} from "@/lib/interface/res.menu.interface";

export type UiNode = {
    id: number;
    title: string;
    url: string;
    iconName?: string;
    hidden: boolean;
    children: UiNode[];
};

export function normalizeMenus(api: IMenu[], base = ""): UiNode[] {
    const norm = (items: IMenu[], prefix: string): UiNode[] =>
        items
            .slice() // don’t mutate input
            .sort((a, b) => a.sort - b.sort)
            .map((m) => {
                const isExternal = /^https?:\/\//i.test(m.path);
                const url = isExternal ? m.path : `${prefix}/${m.path}`.replace(/\/+/g, "/");

                return {
                    id: m.ID,
                    title: m.meta?.title || m.name || m.path,
                    url,
                    iconName: m.meta?.icon,
                    hidden: m.hidden,
                    children: m.children ? norm(m.children, url) : [],
                };
            });

    return norm(api, base);
}
