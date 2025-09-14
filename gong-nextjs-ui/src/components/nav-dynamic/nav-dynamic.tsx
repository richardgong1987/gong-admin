"use client"

import {ChevronRight, type LucideIcon} from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {MenuStore} from "@/store/menu-store";
import {UiNode} from "@/components/nav-dynamic/menu-types";
import {getIcon} from "@/lib/icon-map";
import Link from "next/link";

function isExternal(url: string) {
    return /^https?:\/\//i.test(url);
}

type TreeProps = {
    nodes: UiNode[];
    level?: number;
};
function Tree({ nodes, level = 0 }: TreeProps) {
    const onlyVisible = nodes.filter((n) => !n.hidden);

    if (level === 0) {
        return (
            <SidebarMenu>
                {onlyVisible.map((n) => {
                    const Icon = getIcon(n.iconName);
                    const hasChildren = n.children.length > 0;

                    if (!hasChildren) {
                        return (
                            <SidebarMenuItem key={n.id}>
                                <SidebarMenuButton asChild>
                                    <Link
                                        href={n.url}
                                        target={isExternal(n.url) ? "_blank" : undefined}
                                        rel={isExternal(n.url) ? "noreferrer" : undefined}
                                    >
                                        <Icon />
                                        <span>{n.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <Collapsible key={n.id} asChild className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton>
                                        <Icon />
                                        <span>{n.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <Tree nodes={n.children} level={level + 1} />
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        );
    }

    // sub-levels
    return (
        <>
            {onlyVisible.map((n) => {
                const Icon = getIcon(n.iconName);
                const hasChildren = n.children.length > 0;

                if (!hasChildren) {
                    return (
                        <SidebarMenuSubItem key={n.id}>
                            <SidebarMenuSubButton asChild>
                                <Link
                                    href={n.url}
                                    target={isExternal(n.url) ? "_blank" : undefined}
                                    rel={isExternal(n.url) ? "noreferrer" : undefined}
                                >
                                    <Icon />
                                    <span>{n.title}</span>
                                </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    );
                }

                // nested collapsible in sub-levels
                return (
                    <SidebarMenuSubItem key={n.id}>
                        <Collapsible asChild className="group/collapsible">
                            <div>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuSubButton>
                                        <Icon />
                                        <span>{n.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuSubButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub className="ml-2">
                                        <Tree nodes={n.children} level={level + 1} />
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </div>
                        </Collapsible>
                    </SidebarMenuSubItem>
                );
            })}
        </>
    );
}
export function NavDynamic({
                               title = "Platform",
                               menus,
                           }: {
    title?: string;
    menus: UiNode[];
}) {
    return (
        <SidebarGroup>
            <Tree nodes={menus} />
        </SidebarGroup>
    );
}
