"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { GetSessionStorage } from "@/utils/Biz-Utils";
import { USER_STORAGE_KEY } from "@/store/constant";
import { ApiUser } from "@/lib/api/system/api-user";
import { IUser } from "@/lib/interface/user.interface";

type State = {
  user: IUser;
  expiresAt: number;
  token: string;
  Login: (user: IUser, token: string, expiresAt: number) => void;
  Logout: () => void;
  setUserInfo: (user: IUser) => void;
  IsLoggedIn: () => boolean;
  Refresh: () => void;
  getUserId: () => number;
  clear: () => void;
  initAutoRenew: () => void;
};

const emptyUserInfo: IUser = {
  CreatedAt: "",
  ID: 0,
  UpdatedAt: "",
  authorities: [],
  authority: {
    CreatedAt: "",
    DeletedAt: null,
    UpdatedAt: "",
    authorityId: 0,
    authorityName: "",
    children: null,
    dataAuthorityId: null,
    defaultRouter: "",
    menus: null,
    parentId: 0
  },
  authorityId: 0,
  email: "",
  enable: 0,
  headerImg: "",
  nickName: "",
  originSetting: null,
  phone: "",
  userName: "",
  uuid: ""

};

let renewTimer: any = null;
export const UseUserInfoStore = create<State>()(
  persist(
    (set, get) => {
      // 自动续签
      const startAutoRenew = () => {
        if (renewTimer) clearInterval(renewTimer);
        renewTimer = setInterval(async () => {
          const { token, expiresAt } = get();
          const buffer = 10 * 1000;
          const now = Date.now();
          if (token && expiresAt - now <= buffer) {
            console.log("🔁 Token nearing expiry, renewing...");
            clearInterval(renewTimer); // 防止重复调用
            try {
              const res = await ApiUser.RenewToken();
              if (res.code === 0 && res.data?.token) {
                get().Login(res.data.user, res.data.token, res.data.expiresAt);
                console.log("✅ Token renewed!");
              } else {
                console.warn("❌ Token renewal failed:", res);
                get().clear();
              }
            } catch (e) {
              console.error("❌ Token renewal exception:", e);
              get().clear();
            }
          }
        }, 1000);
      };

      return {
        initAutoRenew: () => {
          const { token, expiresAt, user } = get();
          if (token && expiresAt && Date.now() < expiresAt) {
            // 重新激活定时器
            get().Login(user, token, expiresAt);
            console.log("✅ AutoRenew re-initialized from persisted state.");
          }
        },
        user: Object.assign({}, emptyUserInfo),
        token: "",
        expiresAt: 0,
        clear: async () => {
          if (renewTimer) clearInterval(renewTimer);
          set({
            user: Object.assign({}),
            token: "",
            expiresAt: 0,
          });
        },
        getUserId: () => {
          return get().user.ID;
        },
        Login: (user: IUser, token: string, expiresAt: number) => {
          set({ user, token, expiresAt });
          startAutoRenew();
        },
        setUserInfo: (user: IUser) => {
          set({ user });
        },
        IsLoggedIn: () => {
          return !!get().token;
        },
        Logout: async () => {
          await ApiUser.Logout();
          setTimeout(async () => {
            get().clear();
          }, 100);
        },

        Refresh: () => {
          const state = get();
          set({
            user: { ...state.user },
            token: state.token,
            expiresAt: state.expiresAt,
          });
        },
      };
    },
    {
      name: USER_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export function IsLogin(): boolean {
  const data = GetSessionStorage(USER_STORAGE_KEY);
  if (!data) {
    return false;
  }
  if (!data.state) {
    return false;
  }
  const state = data.state as State;
  return state && state.token != "";
}

export function GetUserID(): number | undefined {
  if (IsLogin()) {
    const data = GetSessionStorage(USER_STORAGE_KEY);
    const state = data.state as State;
    return state && state.user.ID;
  }
}

export function GetUserInfo(): any {
  return GetSessionStorage(USER_STORAGE_KEY);
}
