import { ref } from "vue";
import { Baservices } from "@/commons";
import type { IPayloadCustomers, IResUser } from "@/commons/interface/Customer";

interface IResProvince {
  key: string;
  province: string;
}

export function useListProvince() {
  const loading = ref<boolean>(false);
  const listProvince = ref<IResProvince[]>([]);

  const getListProvince = async (): Promise<IResProvince[]> => {
    try {
      loading.value = true;
      const res = await Baservices.getMethod(`/addressdb/provinces`);

      if (res) {
        loading.value = false;
        listProvince.value = res.body.payload.data;

        return res.body.payload.data;
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
    listProvince,
    getListProvince,
  };
}

export function useListCustomer() {
  const loading = ref<boolean>(false);
  const listCustomer = ref<IResUser[]>([]);
  const total = ref<number>();

  const getListCustomer = async (payload: IPayloadCustomers): Promise<IResUser[]> => {
    try {
      loading.value = true;
      const res = await Baservices.getMethod(`/customer/list`, payload);

      if (res) {
        loading.value = false;
        listCustomer.value = res.body.payload.data;
        total.value = res.body.payload.total;

        return res.body.payload.data;
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
    listCustomer,
    total,
    getListCustomer,
  };
}
