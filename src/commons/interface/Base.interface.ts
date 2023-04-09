interface IColumn {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  fixed?: boolean;
}

interface IBasePayload {
  page: number;
  limit?: number;
  search?: string;
  status?: number;
}

interface IBaseResponse<T> {
  data: T;
  page?: number;
  limit?: number;
  total?: number;
}

interface IDataEventPagination {
  current: number;
}

interface IFile {
  uid: string;
  name: string;
  status: "done" | "error" | "uploading";
  url: string;
}

export type { IColumn, IBasePayload, IBaseResponse, IDataEventPagination, IFile };
