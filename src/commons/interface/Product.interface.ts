import type { IClass } from "@/components/product/FormDynamicPrice.vue";

export interface IResProduct {
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
  product: any[];
  category: {
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
    productId: number;
  }[];
}

export interface IItemTableProduct extends IResProduct {
  index: number;
  key: string | number;
  categoryName: string;
  image: string;
}

export interface IFormStateInfoProduct {
  code?: string;
  name?: string;
  productStatus?: number;
  description?: string;
  categorySelected?: string;
  status?: number;

  outOfStock?: number;
}

export interface IReqProduct extends IFormStateInfoProduct {
  price?: number;
  productClass: {
    create: { type: number; name: string }[];
  };
  imageUrl: {
    create: { url: string; order: number }[];
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

export interface IFormStateSinglePrice {
  type: "single";
  productPrice: number | undefined;
}

export interface IItemTablePrice {
  key: any;
  index: number;
  firstClass: string;
  secondClass: string;
  price: number;
  status: 0 | 1;
}

export interface IFormStateMultiPrice {
  type: "multi";
  dataFormFirst: IClass[];
  dataFormSecond: IClass[];
  dataTable: IItemTablePrice[];
}

export interface IFormStateMedia {
  listImage: any;
  video: any;
}
