<template>
  <a-modal
    v-model:visible="visible"
    :confirm-loading="loadingCreate"
    :title="type === 'add' ? 'Thêm mới voucher' : 'Cập nhật voucher'"
    width="50vw"
    @ok="onSubmit"
  >
    <a-form
      ref="formRef"
      :label-col="{ span: 8 }"
      :model="formState"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      name="formVoucher"
    >
      <a-form-item :rules="[{ required: true, message: 'Vui lòng nhập mã voucher.' }]" label="Mã voucher" name="code">
        <a-input v-model:value="formState.code" />
      </a-form-item>

      <a-form-item :rules="[{ required: true, message: 'Vui lòng nhập mô tả.' }]" label="Mô tả" name="description">
        <a-textarea v-model:value="formState.description" :rows="6" />
      </a-form-item>

      <a-form-item
        :rules="[{ required: true, message: 'Vui lòng nhập giá trị đơn hàng áp dụng' }]"
        label="Giá trị đơn hàng áp dụng"
        name="minPriceApply"
      >
        <InputNumber v-model="formState.minPriceApply" />
      </a-form-item>

      <a-form-item
        :rules="[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá' }]"
        label="Phần trăm giảm"
        name="value"
      >
        <a-input-number v-model:value="formState.value" addon-after="%"></a-input-number>
      </a-form-item>

      <a-form-item
        :rules="[{ required: true, message: 'Vui lòng nhập giới hạn số tiền giảm' }]"
        label="Giới hạn số tiền giảm"
        name="maxValue"
      >
        <InputNumber v-model="formState.maxValue" />
      </a-form-item>

      <a-form-item
        :rules="[{ type: 'number', min: 0, message: 'Vui lòng nhập số lượng vocher phát hành lớn hơn 0.' }]"
        label="Số lượng vocher phát hành"
        name="total"
      >
        <a-input-number v-model:value="formState.total" addon-after="voucher"></a-input-number>
      </a-form-item>

      <a-form-item v-if="type === 'update'" label="Trạng thái" name="status">
        <a-select v-model:value="formState.status" style="width: 100%">
          <a-select-option :value="Constants.STATUS.ACTIVE">Đang hoạt động</a-select-option>
          <a-select-option :value="Constants.STATUS.INACTIVE">Ngưng hoạt động</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :rules="[{ required: true, message: 'Vui lòng chọn image voucher' }]"
        label="Icon danh mục"
        name="file"
      >
        <UploadImage v-model="formState.file" :totalFile="1" path-upload="voucher/" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import useModal from "@/services/Modal";
import { Constants, Regex } from "@/commons";
import type { FormInstance } from "ant-design-vue";
import InputNumber from "@/components/InputNumber.vue";
import { useCreate, useUpdate } from "@/services";
import UploadImage from "@/components/UploadImage.vue";
import type { IItemTableVoucher } from "@/commons/interface/Voucher.interface";
import type { IFile } from "@/commons/Interfaces";

interface IFormState {
  id?: number;
  code?: string;
  description?: string;
  minPriceApply?: number;
  value?: number;
  maxValue?: number;
  total?: number;
  status?: number;
  imageUrl?: string;
  file?: IFile[];
}

let defaultFormState: IFormState = {
  id: undefined,
  imageUrl: undefined,
  code: undefined,
  description: undefined,
  maxValue: undefined,
  status: undefined,
  total: undefined,
  value: undefined,
  minPriceApply: undefined,
  file: [],
};

export default defineComponent({
  components: { UploadImage, InputNumber },
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

    const { loadingCreate, createRecord } = useCreate();
    const { loadingUpdate, updateRecord } = useUpdate();

    const onOpenModal = (_type: "add" | "update", data?: IItemTableVoucher) => {
      type.value = _type;
      if (data) {
        formState.status = data.status;
        formState.code = data.code;
        formState.file = [
          {
            uid: data.key as any,
            status: "done",
            name: "",
            url: data.imageUrl,
          },
        ];
        formState.imageUrl = data.imageUrl;
        formState.maxValue = data.maxValue;
        formState.description = data.description;
        formState.minPriceApply = data.minPriceApply;
        formState.total = data.total;
        formState.value = data.value;
        formState.id = data.id;
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
          const reqVoucher = { ...formState, imageUrl: formState.file[0].url };

          if (type.value === "add") {
            delete reqVoucher.file;
            delete reqVoucher.status;
            delete reqVoucher.id;

            const result = await createRecord("/voucher", reqVoucher, "Thêm mới voucher thành công");
            if (result) {
              closeModal();
              context.emit("onSubmitSuccess");
            }
          }

          if (type.value === "update") {
            delete reqVoucher.file;
            delete reqVoucher.id;

            const result = await updateRecord(`/voucher/${formState.id}`, reqVoucher, "Cập nhật voucher thành công");
            if (result) {
              closeModal();
              context.emit("onSubmitSuccess");
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
      loadingCreate,
      onSubmit,
      onOpenModal,
      closeModal,
    };
  },
});
</script>
