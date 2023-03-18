import { ref } from "vue";
import { Baservices } from "@/commons";
import type { IItemDataTableCategory, IResCategory } from "@/commons/interface/Category.interface";
import Utils from "@/commons/Utils";
import type { IPayload } from "@/pages/Category.vue";
import moment from "moment";

export function useListCategory() {
  const loading = ref<boolean>(false);
  const total = ref<number>(0);

  const getListCategory = async (payload: IPayload): Promise<IItemDataTableCategory[]> => {
    try {
      loading.value = true;
      const res = await Baservices.getMethod(`/category/list-category`, payload);

      if (res) {
        loading.value = false;
        total.value = res.body.payload.total;

        return res.body.payload.data.map((value: IResCategory, index: number) => {
          return {
            ...value,
            index: Utils.getIndex(payload.page, index),
            numberCateChild: value.childCategory.length,
            createdAt: moment(value.createdAt).format("DD/MM/YYYY"),
            key: value.id,
          };
        });
      }

      return [];
    } catch (e) {
      loading.value = false;
      console.error(e);
      return [];
    }
  };

  return {
    loading,
    total,
    getListCategory,
  };
}

export function useListChildCategory() {
  const loading = ref<boolean>(false);
  const total = ref<number>(0);

  const getListCategory = async (payload: IPayload): Promise<IItemDataTableCategory[]> => {
    try {
      loading.value = true;
      const res = await Baservices.getMethod(`/category/list-child-cate`, payload);

      if (res) {
        loading.value = false;
        total.value = res.body.payload.total;

        return res.body.payload.data.map((value: IResCategory, index: number) => {
          return {
            ...value,
            index: Utils.getIndex(payload.page, index),
            createdAt: moment(value.createdAt).format("DD/MM/YYYY"),
            key: value.id,
          };
        });
      }

      return [];
    } catch (e) {
      loading.value = false;
      console.error(e);
      return [];
    }
  };

  return {
    loading,
    total,
    getListCategory,
  };
}
