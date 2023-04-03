import type { IResItemOrder } from "@/commons/interface/Order.interface";

export interface IResItemVoucher {
  id: number;
  code: string;
  description: string;
  minPriceApply: number;
  value: number;
  maxValue: number;
  total: number;
  status: number;
  imageUrl: string;
  Order: IResItemOrder[];
}

export interface IItemTableVoucher extends IResItemVoucher {
  index: number;
  key: number;
}
