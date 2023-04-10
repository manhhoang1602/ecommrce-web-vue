import type { IBasePayload, IResOrder } from "@/commons/interface/index";
import type { EDelete, ERole, EStatus } from "@/commons/enums";

interface IResUser {
  id: number;
  email?: string;
  name?: string;
  phone: string;
  password?: string;
  province?: string;
  district?: string;
  ward?: string;
  isDelete: EDelete;
  role: ERole;
  createdAt: string;
  status: EStatus;
  updatedAt: string;
  order: IResOrder[];
}

interface IPayloadCustomers extends IBasePayload {
  startDate?: string;
  endDate?: string;
  province?: string;
}

interface IItemTableCustomer extends IResUser {
  index: number;
  key: number;
  salesPerOrder: number;
  salesPerOrderComplete: number;
}

export type { IResUser, IPayloadCustomers, IItemTableCustomer };
