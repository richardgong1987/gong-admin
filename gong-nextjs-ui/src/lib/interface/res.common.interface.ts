
export interface IRes {
  code: number;
  data: any;
  msg: string;
}
export interface Authority {
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null;
  authorityId: number;
  authorityName: string;
  parentId: number;
  dataAuthorityId: null;
  children: null;
  menus: null;
  defaultRouter: string;
}
