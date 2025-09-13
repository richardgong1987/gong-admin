import { create } from "zustand";
import { ApiMenu } from "@/lib/api/system/api-menu";
import { IMenu } from "@/lib/interface/res.menu.interface";

type State = {
  getMenu: () => any;
  menu: IMenu[];
};

export const MenuStore = create<State>((set) => ({
  menu: [],
  getMenu: async () => {
    const menu = await ApiMenu.getMenu();
    if (!menu.data) return;
    set({ menu: menu.data.menus });
  },
}));
