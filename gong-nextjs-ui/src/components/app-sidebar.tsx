"use client"

import * as React from "react"
import {AudioWaveform, Command, GalleryVerticalEnd,} from "lucide-react"

import {NavUser} from "@/components/nav-user"
import {TeamSwitcher} from "@/components/team-switcher"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar"
import {MenuStore} from "@/store/menu-store";
import {NavDynamic} from "@/components/nav-dynamic/nav-dynamic";
import {normalizeMenus} from "@/components/nav-dynamic/menu-types";

const defaultUser = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
}
// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const apiMenus = MenuStore(s => s.menu);
    const menus = normalizeMenus(apiMenus, "");
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams}/>
            </SidebarHeader>
            <SidebarContent>
                <NavDynamic title="Platform" menus={menus} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={defaultUser}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
