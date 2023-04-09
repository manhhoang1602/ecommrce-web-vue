import { ref } from "vue";
import { Baservices } from "@/commons";

const useGetShipFees = () => {
  const loading = ref<boolean>(false);
  const shipPrice = ref<{ shipPrice: number }>();
  const id = ref<number>();

  const getShipFees = async () => {
    try {
      loading.value = true;
      const resShipPrice = await Baservices.getMethod(`/shipfees`);
      shipPrice.value = { shipPrice: resShipPrice.body.payload.data[0].shipPrice };
      id.value = resShipPrice.body.payload.data[0].id;
      loading.value = false;
    } catch (e) {
      console.error(e);
      loading.value = false;
    }
  };

  return {
    loading,
    shipPrice,
    id,
    getShipFees,
  };
};

export { useGetShipFees };
