import { ref } from "vue";
import type {
  IFormStateInfoProduct,
  IFormStateMedia,
  IFormStateMultiPrice,
  IFormStateSinglePrice,
  IItemTableProduct,
  IResProduct,
} from "@/commons/interface/Product.interface";
import { Baservices, Constants } from "@/commons";
import type { IPayloadProduct } from "@/pages/Product.vue";
import Utils from "@/commons/Utils";
import type { IFile } from "@/commons/Interfaces";
import type { IClass } from "@/components/product/FormDynamicPrice.vue";

export function useLoadInfoForm(productDetail?: IResProduct): IFormStateInfoProduct {
  const categorySelected = productDetail?.childCategory
    ? { parentId: productDetail?.categoryId, childId: productDetail.childCategory.id }
    : { parentId: productDetail?.categoryId };

  return {
    code: productDetail?.code,
    name: productDetail?.name,
    outOfStock: productDetail?.outOfStock,
    description: productDetail?.description,
    status: productDetail?.status,
    categorySelected: JSON.stringify(categorySelected),
    productStatus: productDetail?.productStatus,
  };
}

export function useLoadMediaForm(productDetail?: IResProduct): IFormStateMedia {
  const listImage: IFile[] = [];
  const video: IFile[] = [];

  if (productDetail) {
    productDetail.imageUrl.forEach((value) => {
      if (value.type === Constants.PRODUCT_MEDIA_TYPE.IMAGE) {
        listImage.push({
          url: value.url,
          name: "",
          status: "done",
          uid: value.id as any,
        });
      }

      if (value.type === Constants.PRODUCT_MEDIA_TYPE.VIDEO) {
        video.push({
          url: value.url,
          name: "",
          status: "done",
          uid: value.id as any,
        });
      }
    });
  }

  return {
    listImage: listImage,
    video: video,
  };
}

export function useLoadPriceForm(productDetail?: IResProduct): IFormStateMultiPrice | IFormStateSinglePrice {
  if (productDetail) {
    const firstClassName: IClass[] = [];
    productDetail.productClass.forEach((value) => {
      if (value.type === Constants.PRODUCT_TYPE_CLASS.FIRST_CLASS_NAME) {
        firstClassName.push({
          key: value.id,
          value: value.name,
        });
      }
    });

    const secondClassName: IClass[] = [];
    productDetail.productClass.map((value) => {
      if (value.type === Constants.PRODUCT_TYPE_CLASS.SECOND_CLASS_NAME) {
        secondClassName.push({
          key: value.id,
          value: value.name,
        });
      }
    });

    const firstClassValue: IClass[] = [];
    productDetail.productClass.map((value) => {
      if (value.type === Constants.PRODUCT_TYPE_CLASS.FIRST) {
        firstClassValue.push({
          key: value.id,
          value: value.name,
        });
      }
    });

    const secondClassValue: IClass[] = [];
    productDetail.productClass.map((value) => {
      if (value.type === Constants.PRODUCT_TYPE_CLASS.SECOND) {
        secondClassValue.push({
          key: value.id,
          value: value.name,
        });
      }
    });

    const isClassProduct = firstClassName.length !== 0 || secondClassName.length !== 0;

    if (!isClassProduct) {
      return {
        type: "single",
        productPrice: productDetail.price,
        discountPercent: productDetail.discountPercent,
      };
    } else {
      return {
        type: "multi",
        dataFormFirst: [...firstClassName, ...firstClassValue] as any,
        dataFormSecond: [...secondClassName, ...secondClassValue] as any,
        dataTable: productDetail.product.map((value, index) => {
          return {
            key: value.id,
            index: index + 1,
            price: value.price,
            salesPrice: productDetail.discountPercent
              ? value.price - (value.price / 100) * productDetail.discountPercent
              : value.price,
            firstClass: value.firstClassName,
            secondClass: value.secondClassName,
            status: value.isNotSale,
          } as any;
        }),
        discountPercent: productDetail.discountPercent,
      };
    }
  }

  return {
    type: "single",
    productPrice: 0,
    discountPercent: 0,
  };
}

export function useLoadFormUpdateProduct(productDetail?: IResProduct): {
  formInfoState: IFormStateInfoProduct;
  formMediaState: IFormStateMedia;
  formPriceState: IFormStateMultiPrice | IFormStateSinglePrice;
} {
  return {
    formInfoState: useLoadInfoForm(productDetail),
    formMediaState: useLoadMediaForm(productDetail),
    formPriceState: useLoadPriceForm(productDetail),
  };
}

export function useListProduct() {
  const loading = ref<boolean>(false);
  const total = ref<number>(0);
  const listProduct = ref<IItemTableProduct[]>([]);

  const getListProduct = async (payload: IPayloadProduct): Promise<IItemTableProduct[]> => {
    try {
      loading.value = true;
      const res = await Baservices.getMethod(`/product/list-product`, payload);

      const listProduct = res.body.payload.data.map((resProduct: IResProduct, index: number) => {
        return {
          ...resProduct,
          key: resProduct.id,
          index: Utils.getIndex(payload.page, index),
          categoryName: resProduct.category.name,
          image: resProduct.imageUrl.length && resProduct.imageUrl[0].url,
        };
      });

      listProduct.value = listProduct;
      total.value = res.body.payload.total;
      loading.value = false;

      return listProduct;
    } catch (e) {
      loading.value = false;
      console.error(e);
      return [];
    }
  };

  return {
    loading,
    total,
    listProduct,
    getListProduct,
  };
}

export function useDetailProduct() {
  const loading = ref<boolean>(false);
  const detailProduct = ref<IResProduct>();

  const getDetailProduct = async (id: number): Promise<IResProduct> => {
    try {
      loading.value = true;
      const res = await Baservices.getMethod(`/product/${id}`);
      detailProduct.value = res.body.payload.data;
      loading.value = false;
      return res.body.payload.data;
    } catch (e) {
      loading.value = false;
      console.error(e);
      return null as any;
    }
  };

  return {
    loading,
    detailProduct,
    getDetailProduct,
  };
}
