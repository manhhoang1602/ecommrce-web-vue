import type { IResOrder } from "@/commons/interface/Order.interface";
import type { EStatus } from "@/commons/enums";

interface IResVoucher {
  id: number;
  code: string;
  description: string;
  minPriceApply: number;
  value: number;
  maxValue: number;
  total: number;
  status: EStatus;
  imageUrl: string;
  Order: IResOrder[];
}

interface IItemTableVoucher extends IResVoucher {
  index: number;
  key: number;
}

export type { IResVoucher, IItemTableVoucher };
