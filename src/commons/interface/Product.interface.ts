import type { IClass } from "@/components/product/FormDynamicPrice.vue";
import type { IResProductInOrder } from "./Order.interface";

interface IResProduct {
  id: number;
  name: string;
  code: string;
  price: number;
  description: string;
  status: number;
  productStatus: number;
  outOfStock: number;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  discountPercent: number;
  product: {
    id: number;
    price: number;
    productId: number;
    firstClassName: string;
    isNotSale: number;
    secondClassName: string;
  }[];
  category: {
    id: number;
    name: string;
    status: number;
    imageUrl: string;
    order: number;
    createdAt: string;
    updatedAt: string;
  };
  childCategory: {
    id: number;
    name: string;
    status: number;
    imageUrl: string;
    order: number;
    createdAt: string;
    updatedAt: string;
  };
  imageUrl: {
    id: number;
    url: string;
    order: number;
    type: number;
    productId: number;
  }[];
  productClass: {
    id: number;
    type: number;
    name: string;
    productId: number;
  }[];
  orderAndProduct: IResProductInOrder[];
}

interface IItemTableProduct extends IResProduct {
  index: number;
  key: string | number;
  categoryName: string;
  image: string;
}

interface IFormStateInfoProduct {
  code?: string;
  name?: string;
  productStatus?: number;
  description?: string;
  categorySelected?: string;
  status?: number;

  outOfStock?: number;
}

interface IReqProduct extends IFormStateInfoProduct {
  price?: number;
  discountPercent?: number;
  productClass: {
    create: { type: number; name: string }[];
  };
  imageUrl: {
    create: { url: string; order: number; type: number }[];
  };
  category: {
    connect: { id: number };
  };

  product: {
    create: { price: number; firstClassName: string; secondClassName: string }[];
  };

  childCategory?: {
    connect: { id: number };
  };
}

interface IFormStateSinglePrice {
  type: "single";
  productPrice: number | undefined;
  discountPercent: number | undefined;
}

interface IItemTablePrice {
  key: any;
  index: number;
  firstClass?: string;
  secondClass?: string;
  price: number;
  salesPrice: number;
  status: 0 | 1;
}

interface IFormStateMultiPrice {
  type: "multi";
  dataFormFirst: IClass[];
  dataFormSecond: IClass[];
  dataTable: IItemTablePrice[];
  discountPercent: number;
}

interface IFormStateMedia {
  listImage: any;
  video: any;
}

export type {
  IResProduct,
  IItemTableProduct,
  IFormStateInfoProduct,
  IReqProduct,
  IFormStateSinglePrice,
  IItemTablePrice,
  IFormStateMultiPrice,
  IFormStateMedia,
};
