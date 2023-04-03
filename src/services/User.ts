import { Baservices, Constants } from "@/commons";
import { computed, onMounted, ref } from "vue";
import type { IAccount } from "@/commons/interface/User.interface";
import Utils from "@/commons/Utils";
import type { IBaseResponse } from "@/commons/Interfaces";
import Notification from "@/components/notification/Notification";

export function useListUser() {
  const loading = ref<boolean>(false);
  const total = ref<number>(0);

  const getListUser = async (payload: any, page: number): Promise<IBaseResponse<IAccount[]>> => {
    try {
      loading.value = true;
      const res = await Baservices.getMethod("/users/list-user", payload);
      if (res) {
        loading.value = false;
        total.value = res.body.payload.total;
        return {
          data: res.body.payload.data.map((item: IAccount, index: number) => {
            return {
              ...item,
              index: Utils.getIndex(page, index),
              key: item.id,
            };
          }),
          page: res.body.payload.page,
          total: res.body.payload.total,
          limit: res.body.payload.limit,
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
    getListUser,
  };
}

export function useResetPassword() {
  const loadingResetPassword = ref<boolean>(false);

  const resetPassword = async (id: number, password: string): Promise<boolean> => {
    try {
      loadingResetPassword.value = true;
      const response = await Baservices.putMethod(`/users/${id}`, {
        password: password,
      });

      if (response) {
        loadingResetPassword.value = false;
        Notification.Success(undefined, "Reset mật khẩu thành công.");
        return true;
      }

      return false;
    } catch (e) {
      console.error(e);
      loadingResetPassword.value = false;
      return false;
    }
  };

  return {
    loadingResetPassword,
    resetPassword,
  };
}

export function useUserInfo() {
  const userInfo = ref<IAccount>();
  const isAdminRole = computed((): boolean => {
    if (userInfo.value) {
      return userInfo.value?.role === Constants.ROLE.ADMIN;
    }

    return false;
  });

  onMounted(() => {
    const user = localStorage.getItem("userInfo");
    if (user) {
      userInfo.value = JSON.parse(user);
    }
  });

  return {
    userInfo,
    isAdminRole,
  };
}
