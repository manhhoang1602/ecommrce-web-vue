import type { IResItemOrder } from "@/commons/interface/Order.interface";

interface IResItemVoucher {
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

interface IItemTableVoucher extends IResItemVoucher {
  index: number;
  key: number;
}

export type { IResItemVoucher, IItemTableVoucher };
