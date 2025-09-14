import {Authority, IRes} from "@/lib/interface/res.common.interface";

export interface IMenu {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    parentId: number;
    path: string;
    name: string;
    hidden: boolean;
    component: string;
    sort: number;
    meta: {
        activeName: string;
        keepAlive: boolean;
        defaultMenu: boolean;
        title: string;
        icon: string;
        closeTab: boolean;
        transitionType: string;
    };
    authoritys: Authority;
    menuBtn: null;
    menuId: number;
    children?: IMenu[] | null;
    parameters: any[];
    btns: null;
}

export interface IMenuRes extends IRes {
    data: {
        menus: IMenu[];
    };
}
