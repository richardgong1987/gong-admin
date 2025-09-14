import {create} from "zustand";
import {ApiMenu} from "@/lib/api/system/api-menu";
import {IMenu} from "@/lib/interface/res.menu.interface";

type State = {
    status: "idle" | "loading" | "ready" | "error";
    getMenu: () => any;
    menu: IMenu[];
};

export const MenuStore = create<State>((set, get) => ({
    menu: [],
    status: "idle",
    getMenu: async () => {
        const {status} = get();
        if (status === "loading" || status === "ready") return; // idempotent
        set({status: "loading"});
        const menu = await ApiMenu.getMenu();
        if (!menu.data) return;
        set({menu: menu.data.menus, status: "ready"});
    },
}));
