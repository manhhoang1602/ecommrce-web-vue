import { ref } from "vue";
import type { IItemTableProduct, IResProduct } from "@/commons/interface/Product.interface";
import { Baservices } from "@/commons";
import type { IPayloadProduct } from "@/pages/Product.vue";
import Utils from "@/commons/Utils";

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
          image: resProduct.imageUrl[0].url,
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
