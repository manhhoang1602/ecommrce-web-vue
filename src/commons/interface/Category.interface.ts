interface IResCategory {
  id: number;
  imageUrl: string;
  name: string;
  order: number;
  status: number;
  createdAt: string;
  childCategory: IResCategory[];
  mainProduct: any[];
}

interface IItemDataTableCategory extends IResCategory {
  index: number;
  numberCateChild: number;
}

export type { IResCategory, IItemDataTableCategory };
