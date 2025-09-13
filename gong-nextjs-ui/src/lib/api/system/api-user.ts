import { CommonResponse, httpService } from "@/lib/http";
import { RESPONSE_CODE } from "@/lib/constant";
import { ILoginRes } from "@/lib/interface/res.login.interface";
import { LoginBody } from "@/lib/interface/user.interface";

export class ApiUser {
  static async profiles() {
    const res = (await httpService.GET("/api/base/profile")) as CommonResponse;
    if (res.code == RESPONSE_CODE.SUCCESS) {
      return res.data;
    }
  }

  static async RenewToken() {
    return (await httpService.GET("/api/base/renew-token")) as ILoginRes;
  }
  static async Logout() {
    // return await httpService.GET("/api/base/logout");
  }

  static async Login(body: LoginBody) {
    return (await httpService.POST("/api/base/login", body)) as ILoginRes;
  }
}
