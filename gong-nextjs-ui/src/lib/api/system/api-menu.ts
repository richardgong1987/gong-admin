import { httpService } from "@/lib/http";
import { IMenuRes } from "@/lib/interface/res.menu.interface";

export class ApiMenu {
  static async getMenu() {
    return (await httpService.POST("/api/menu/getMenu",{})) as IMenuRes;
  }
}
