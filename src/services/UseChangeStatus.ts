import { ref } from "vue";
import { Baservices } from "@/commons";
import Notification from "@/components/notification/Notification";

export function useChangeStatus() {
  const loadingStatus = ref<boolean>(false);

  const changeStatus = async (path: string, id: number, status: 0 | 1): Promise<boolean> => {
    try {
      loadingStatus.value = true;
      const response = await Baservices.putMethod(`${path}${id}`, {
        status: status,
      });

      if (response) {
        loadingStatus.value = false;
        Notification.Success(undefined, "Thay đổi trạng thái thành công.");
        return true;
      }

      return false;
    } catch (e) {
      console.error(e);
      loadingStatus.value = false;
      return false;
    }
  };

  return {
    loadingStatus,
    changeStatus,
  };
}
