import { ref } from "vue";
import { Baservices } from "@/commons";
import Notification from "@/components/notification/Notification";

export function useDelete() {
  const loadingDelete = ref<boolean>(false);

  const deleteRecord = async (path: string, message: string, ids?: number[]): Promise<boolean> => {
    try {
      loadingDelete.value = true;
      const response = await Baservices.deleteMethod(`${path}`, ids);

      if (response) {
        loadingDelete.value = false;
        Notification.Success(undefined, message);
        return true;
      }

      return false;
    } catch (e) {
      console.error(e);
      loadingDelete.value = false;
      return false;
    }
  };

  return {
    loadingDelete,
    deleteRecord,
  };
}
