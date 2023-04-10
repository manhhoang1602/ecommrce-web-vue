import type { IBasePayload, IResMainProduct, IResProduct, IResUser, IResVoucher } from "@/commons/interface/index";
import type { EOrderStatus } from "@/commons/enums";

interface IPayloadOrder extends IBasePayload {
  orderStatus?: number;
  endDate?: string;
  startDate?: string;
}

interface IResOrderAndProduct {
  id: number;
  total: number;
  discountPercent: number;
  orderId: number;
  mainProductId: number;
  productId?: number;
  mainProduct: IResMainProduct;
  order: IResOrder;
  product?: IResProduct;
  createdAt: string;
  updatedAt: string;
}

interface IResOrderHistory {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  orderId: number;
  orderStatus: EOrderStatus;
  order: IResOrder;
  user: IResUser;
}

interface IResOrder {
  id: number;
  code: string;
  orderStatus: EOrderStatus;
  reasonCancel: string | null;
  receiver: string | null;
  receivePhone: string | null;
  userId: number;
  shipPrice: number;
  receiveAddress: string;
  user: IResUser;
  listProduct: IResOrderAndProduct[];
  orderHistory: IResOrderHistory[];
  createdAt: string;
  updatedAt: string;
  voucher?: IResVoucher;
  voucherId?: number;
}

interface IItemTableOrder extends IResOrder {
  countProduct: number;
  totalPrice: number;
}

export type { IPayloadOrder, IResOrderAndProduct, IResOrder, IItemTableOrder };
