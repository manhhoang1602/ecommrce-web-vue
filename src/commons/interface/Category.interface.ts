export interface IResCategory {
  id: number;
  imageUrl: string;
  name: string;
  order: number;
  status: number;
  createdAt: string;
  childCategory: IResCategory[];
  mainProduct: any[];
}

export interface IItemDataTableCategory extends IResCategory {
  index: number;
  numberCateChild: number;
}
