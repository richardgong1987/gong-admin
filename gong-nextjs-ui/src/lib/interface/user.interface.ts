import { Authority } from "@/lib/interface/res.common.interface";

export interface IUser {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  uuid: string;
  userName: string;
  nickName: string;
  headerImg: string;
  authorityId: number;
  authority: Authority;
  authorities: Authority[];
  phone: string;
  email: string;
  enable: number;
  originSetting: null;
}


export interface LoginBody {
  password: string;
  username: string;
}
