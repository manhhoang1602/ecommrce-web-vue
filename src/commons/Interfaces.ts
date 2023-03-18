export * from "./interface/User.interface";
export * from "./interface/Category.interface";
export * from "./interface/Product.interface";

export interface IColumn {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  fixed?: boolean;
}

export interface IBasePayload {
  page: number;
  limit?: number;
  search?: string;
  status?: number;
}

export interface IBaseResponse<T> {
  data: T;
  page?: number;
  limit?: number;
  total?: number;
}

export interface IDataEventPagination {
  current: number;
}

export interface IFile {
  uid: string;
  name: string;
  status: "done" | "error" | "uploading";
  url: string;
}
