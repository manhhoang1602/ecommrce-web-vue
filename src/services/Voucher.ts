import { ref } from "vue";
import type { IBaseResponse, IItemTableVoucher, IResVoucher } from "@/commons/interface";
import { Baservices } from "@/commons";
import Utils from "@/commons/Utils";

export function useListVoucher() {
  const loading = ref<boolean>(false);
  const total = ref<number>(0);

  const getListVoucher = async (payload: any, page: number): Promise<IBaseResponse<IItemTableVoucher[]>> => {
    try {
      loading.value = true;
      const res = await Baservices.getMethod("/voucher/list", payload);
      if (res) {
        loading.value = false;
        total.value = res.body.payload.total;
        return {
          data: res.body.payload.data.map((item: IResVoucher, index: number) => {
            return {
              ...item,
              index: Utils.getIndex(page, index),
              key: item.id,
            };
          }),
          total: res.body.payload.total,
        };
      }

      loading.value = false;
      return {
        data: [],
      };
    } catch (e) {
      console.error(e);
      loading.value = false;
      return {
        data: [],
      };
    }
  };

  return {
    loading,
    total,
    getListVoucher,
  };
}
