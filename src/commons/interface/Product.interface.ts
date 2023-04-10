import type { IClass } from "@/components/product/FormDynamicPrice.vue";
import type { IResOrderAndProduct } from "./Order.interface";
import type {
  EDelete,
  EOutOfStock,
  EProductClassType,
  EProductMediaType,
  EProductStatus,
  ESale,
  EStatus,
} from "@/commons/enums";
import type { IResCategory } from "@/commons/interface/Category.interface";

interface IResProduct {
  id: number;
  price: number;
  productId: number;
  firstClassName?: string;
  secondClassName?: string;
  isNotSale: ESale;
  orderAndProduct: IResOrderAndProduct[];
  product: IResMainProduct;
  createdAt: string;
  updatedAt: string;
}

interface IResProductClass {
  id: number;
  type: EProductClassType;
  name: string;
  productId: number;
  product: IResMainProduct;
  createdAt: string;
  updatedAt: string;
}

interface IResProductImage {
  id: number;
  url: string;
  type: EProductMediaType;
  order: number;
  productId: number;
  product: IResMainProduct;
  createdAt: string;
  updatedAt: string;
}

interface IResMainProduct {
  id: number;
  name: string;
  description: string;
  status: EStatus;
  createdAt: string;
  code: string;
  updatedAt: string;
  categoryId: number;
  outOfStock: EOutOfStock;
  productStatus: EProductStatus;
  price: number;
  isDelete: EDelete;
  childCategoryId?: number;
  discountPercent: number;
  category: IResCategory;
  childCategory?: IResCategory;
  orderAndProduct: IResOrderAndProduct;
  product: IResProduct[];
  imageUrl: IResProductImage[];
  productClass: IResProductClass[];
}

interface IItemTableProduct extends IResMainProduct {
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
  IResMainProduct,
  IItemTableProduct,
  IFormStateInfoProduct,
  IReqProduct,
  IFormStateSinglePrice,
  IItemTablePrice,
  IFormStateMultiPrice,
  IFormStateMedia,
  IResProduct,
};
