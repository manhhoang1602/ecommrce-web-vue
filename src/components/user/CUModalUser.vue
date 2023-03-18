<template>
  <a-modal
    v-model:visible="visible"
    :title="type === 'add' ? 'Thêm mới tài khoản' : 'Cập nhật tài khoản'"
    @ok="onSubmit"
  >
    <a-form
      ref="formRef"
      :label-col="{ span: 8 }"
      :model="formState"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      name="formUser"
    >
      <a-form-item :rules="[{ required: true, message: 'Vui lòng nhập họ tên' }]" label="Họ tên" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item
        :rules="[
          { required: true, message: 'Vui lòng nhập số điện thoại' },
          {
            pattern: Regex.Phone,
            message: 'Số điện thoại không đúng định dạng.',
          },
        ]"
        label="SĐT"
        name="phone"
      >
        <a-input v-model:value="formState.phone" :disabled="type === 'update' ? true : false" />
      </a-form-item>

      <a-form-item
        :rules="[
          { required: true, message: 'Vui lòng nhập email' },
          { pattern: Regex.Mail, message: 'Email không đúng định dạng.' },
        ]"
        label="Email"
        name="email"
      >
        <a-input v-model:value="formState.email" />
      </a-form-item>

      <a-form-item
        v-if="type === 'add'"
        :rules="[
          { required: true, message: 'Vui lòng nhập mật khẩu' },
          { type: 'string', min: 6, message: 'Mật khẩu ít nhất 6 ký tự' },
        ]"
        label="Mật khẩu"
        name="password"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item
        v-if="type === 'add'"
        :rules="[
          { required: true, message: 'Vui lòng nhập mật khẩu' },
          { type: 'string', min: 6, message: 'Mật khẩu ít nhất 6 ký tự' },
        ]"
        label="Xác nhận mật khẩu"
        name="repassword"
      >
        <a-input-password v-model:value="formState.repassword" />
      </a-form-item>

      <a-form-item
        :rules="[{ required: true, message: 'Vui lòng chọn loại tài khoản' }]"
        label="Loai tài khoản"
        name="role"
      >
        <a-select v-model:value="formState.role" style="width: 100%">
          <a-select-option :value="Constants.ROLE.EMPLOYEE">Nhân viên</a-select-option>
          <a-select-option :value="Constants.ROLE.ADMIN">Quản trị</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item v-if="type === 'update'" label="Trạng thái" name="status">
        <a-select v-model:value="formState.status" style="width: 100%">
          <a-select-option :value="Constants.STATUS.ACTIVE">Đang hoạt động</a-select-option>
          <a-select-option :value="Constants.STATUS.INACTIVE">Ngưng hoạt động</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import type { IAccount } from "@/commons/interface/User.interface";
import useModal from "@/services/Modal";
import { Baservices, Constants, Regex } from "@/commons";
import type { FormInstance } from "ant-design-vue";
import Notification from "@/components/notification/Notification";

interface IFormState extends IAccount {
  repassword?: string;
  status?: number;
}

let defaultFormState: IFormState = {
  name: "",
  phone: "",
  email: "",
  password: "",
  repassword: "",
  role: undefined as any,
  status: undefined as any,
};

export default defineComponent({
  computed: {
    Regex() {
      return Regex;
    },
    Constants() {
      return Constants;
    },
  },
  emits: ["onSubmitSuccess"],
  setup(props, context) {
    const { showModal, closeModal, visible } = useModal();
    const formRef = ref<FormInstance>();
    const loading = ref<boolean>(false);
    const type = ref<"add" | "update">("add");

    let formState = reactive<IFormState>(defaultFormState);

    const onOpenModal = (_type: "add" | "update", data?: IAccount) => {
      type.value = _type;
      if (data) {
        formState.name = data.name;
        formState.status = data.status;
        formState.id = data.id;
        formState.role = data.role;
        formState.email = data.email;
        formState.phone = data.phone;
      }

      if (_type === "add") {
        formRef.value?.resetFields();
      }

      showModal();
    };

    const onSubmit = async () => {
      try {
        loading.value = true;
        const value = await formRef.value?.validateFields();
        if (value) {
          if (formState.password !== formState.repassword) {
            Notification.Error(undefined, "Mật khẩu không khớp.");
            return false;
          }

          const newUser = { ...formState };

          if (type.value === "add") {
            delete newUser.repassword;
            delete newUser.status;

            const res = await Baservices.postMethod("/users", newUser);

            if (res) {
              Notification.Success(undefined, "Thêm mới tài khoản thành công");
              loading.value = false;
              context.emit("onSubmitSuccess");
              closeModal();
              formRef.value?.resetFields();
            }
          }

          if (type.value === "update") {
            delete newUser.repassword;
            delete newUser.password;

            const res = await Baservices.putMethod(`/users/${formState.id}`, newUser);

            if (res) {
              Notification.Success(undefined, "Cập nhật tài khoản thành công");
              loading.value = false;
              context.emit("onSubmitSuccess");
              closeModal();
              formRef.value?.resetFields();
            }
          }
        }
      } catch (e) {
        loading.value = false;
        console.error(e);
      }
    };

    return {
      visible,
      formState,
      formRef,
      type,
      onSubmit,
      onOpenModal,
      closeModal,
    };
  },
});
</script>
