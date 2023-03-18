import { ref } from "vue";
import { Baservices } from "@/commons";
import Notification from "@/components/notification/Notification";

export function useUpdate() {
  const loadingUpdate = ref<boolean>(false);

  const updateRecord = async (path: string, data: any, message: string): Promise<boolean> => {
    try {
      loadingUpdate.value = true;

      const response = await Baservices.putMethod(path, data);
      if (response) {
        loadingUpdate.value = false;
        Notification.Success(undefined, message);
        return true;
      }

      return false;
    } catch (e) {
      loadingUpdate.value = false;
      console.error(e);
      return false;
    }
  };

  return {
    loadingUpdate,
    updateRecord,
  };
}
