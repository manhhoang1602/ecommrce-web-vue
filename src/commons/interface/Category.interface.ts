import type { IResMainProduct } from "@/commons/interface/Product.interface";

interface IResCategory {
  id: number;
  name: string;
  status: number;
  imageUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  childCategory: IResCategory[];
  mainProduct: IResMainProduct[];
}

interface IItemTableCategory extends IResCategory {
  index: number;
  numberCateChild: number;
}

export type { IResCategory, IItemTableCategory };
