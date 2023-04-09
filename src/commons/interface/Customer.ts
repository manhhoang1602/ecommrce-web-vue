import type { IBasePayload, IResItemOrder } from "@/commons/interface/index";

interface IResCustomer {
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

interface IPayloadCustomers extends IBasePayload {
  startDate?: string;
  endDate?: string;
  province?: string;
}

interface IItemTableCustomer extends IResCustomer {
  index: number;
  key: number;
  salesPerOrder: number;
  salesPerOrderComplete: number;
}

export type { IResCustomer, IPayloadCustomers, IItemTableCustomer };
