import { IUser } from "@/lib/interface/user.interface";
import { IRes } from "@/lib/interface/res.common.interface";

export interface ILoginRes extends IRes {
  data: {
    user: IUser;
    token: string;
    expiresAt: number;
  };
}
