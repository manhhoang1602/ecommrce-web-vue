import type { IBasePayload, IResItemOrder } from "@/commons/Interfaces";

export interface IResCustomer {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: number;
  createdAt: string;
  status: number;
  updatedAt: string;
  order: IResItemOrder[];
}

export interface IPayloadCustomers extends IBasePayload {
  startDate?: string;
  endDate?: string;
  province?: string;
}

export interface IItemTableCustomer extends IResCustomer {
  index: number;
  key: number;
  salesPerOrder: number;
  salesPerOrderComplete: number;
}
