import { ref } from "vue";
import { Baservices } from "@/commons";
import Notification from "@/components/notification/Notification";

export function useCreate() {
  const loadingCreate = ref<boolean>(false);

  const createRecord = async (path: string, data: any, message: string): Promise<boolean> => {
    try {
      loadingCreate.value = true;

      const response = await Baservices.postMethod(path, data);
      if (response) {
        loadingCreate.value = false;
        Notification.Success(undefined, message);
        return true;
      }

      return false;
    } catch (e) {
      loadingCreate.value = false;
      console.error(e);
      return false;
    }
  };

  return {
    loadingCreate,
    createRecord,
  };
}
