import type { IBasePayload, IResItemVoucher } from "@/commons/interface/index";

interface IPayloadOrder extends IBasePayload {
  orderStatus?: number;
  endDate?: string;
  startDate?: string;
}

interface IResProductInOrder {
  id: number;
  total: number;
  orderId: number;
  mainProductId: number;
  discountPercent: number;
  productId: number;
  mainProduct: {
    id: number;
    name: string;
    description: string | null;
    status: number;
    createdAt: string;
    code: string;
    updatedAt: string;
    discountPercent: number;
    categoryId: number;
    outOfStock: number;
    productStatus: number;
    price: number;
    childCategoryId: number;
  };
  product?: { price: number; firstClassName?: string; secondClassName?: string };
  order: IResItemOrder;
}

interface IResItemOrderHistory {
  createdAt: string;
  id: number;
  orderId: number;
  orderStatus: number;
  updatedAt: string;
  userId: number;
}

interface IResItemOrder {
  id: number;
  code: string;
  orderStatus: number;
  reasonCancel: string | null;
  receiver: string | null;
  receivePhone: string | null;
  userId: number;
  receiveAddress: string;
  createdAt: string;
  shipPrice: number;
  updatedAt: string;
  listProduct: IResProductInOrder[];
  user: {
    name: string;
    phone: number;
  };
  voucher: IResItemVoucher;
  orderHistory: IResItemOrderHistory[];
}

interface IItemDataTableOrder extends IResItemOrder {
  countProduct: number;
  totalPrice: number;
}

export type { IPayloadOrder, IResProductInOrder, IResItemOrder, IItemDataTableOrder };
