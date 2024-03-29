<template>
  <a-modal
    v-model:visible="visible"
    :confirm-loading="loadingCreate || loadingUpdate"
    :destroy-on-close="true"
    :title="type === 'add' ? 'Thêm mới danh mục' : 'Cập nhật danh mục'"
    @ok="onSubmit"
  >
    <a-form
      ref="formRef"
      :label-col="{ span: 8 }"
      :model="formState"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      name="formCategory"
      validate-trigger="submit"
    >
      <a-form-item v-if="isChildForm" label="Danh mục cha" name="categoryId">
        <ParentCategorySelect :defaultValue="parentCategoryId" :disabled="true" />
      </a-form-item>

      <a-form-item
        :rules="[{ required: true, message: 'Vui lòng nhập tên danh mục' }]"
        label="Tên danh mục"
        name="name"
      >
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item
        :rules="[{ required: true, message: 'Vui lòng nhập số thứ tự hiển thị' }]"
        label="STT hiển thị"
        name="order"
      >
        <a-input-number v-model:value="formState.order" :style="{ width: '100%' }" min="0" />
      </a-form-item>

      <a-form-item v-if="type === 'update'" label="Trạng thái" name="status">
        <a-select v-model:value="formState.status" style="width: 100%">
          <a-select-option :value="Constants.STATUS.ACTIVE">Đang hoạt động</a-select-option>
          <a-select-option :value="Constants.STATUS.INACTIVE">Ngưng hoạt động</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        v-model="formState.imageUrl"
        :rules="[{ required: true, message: 'Vui lòng chọn icon danh mục' }]"
        label="Icon danh mục"
        name="file"
      >
        <UploadImage v-model="formState.file" :totalFile="1" path-upload="list-category/" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import useModal from "@/services/Modal";
import { Constants } from "@/commons";
import type { FormInstance } from "ant-design-vue";
import UploadImage from "@/components/base/UploadImage.vue";
import { useCreate, useUpdate } from "@/services";
import ParentCategorySelect from "@/components/category/ParentCategorySelect.vue";

interface IFormState {
  id: number | undefined;
  name: string;
  order: number | undefined;
  imageUrl: string | undefined;
  categoryId: number | undefined;
  status: 0 | 1 | undefined;
  file: any;
}

let defaultFormState: IFormState = {
  name: "",
  status: undefined as any,
  categoryId: undefined,
  imageUrl: undefined,
  order: undefined,
  id: undefined,
  file: [],
};

export default defineComponent({
  components: { ParentCategorySelect, UploadImage },
  computed: {
    Constants() {
      return Constants;
    },
  },
  props: ["parentCategoryId"],
  emits: ["onSubmitSuccess"],
  setup(props, context) {
    const { showModal, closeModal, visible } = useModal();
    const formRef = ref<FormInstance>();
    const type = ref<"add" | "update">("add");

    let formState = reactive<IFormState>(defaultFormState);

    const { loadingCreate, createRecord } = useCreate();
    const { loadingUpdate, updateRecord } = useUpdate();

    const isChildForm = computed((): boolean => {
      if (props.parentCategoryId) {
        return true;
      }

      return false;
    });

    const resetForm = () => {
      formState.name = "";
      formState.status = undefined;
      formState.imageUrl = undefined;
      formState.order = undefined;
      formState.id = undefined;
      formState.categoryId = undefined;
    };

    const onOpenModal = (_type: "add" | "update", data?: any) => {
      type.value = _type;
      if (data) {
        formState.name = data.name;
        formState.status = data.status;
        formState.categoryId = data.categoryId;
        formState.imageUrl = data.imageUrl;
        formState.order = data.order;
        formState.id = data.id;
        formState.file = [
          {
            uid: "default-file-list",
            name: "image.png",
            status: "done",
            url: formState.imageUrl,
          },
        ];
      } else {
        resetForm();
        formState.file = [];
      }

      showModal();
    };

    const onCreate = async () => {
      if (type.value === "add") {
        delete formState.id;
        const reqCategory = { ...formState };
        delete reqCategory.file;

        if (!isChildForm.value) {
          delete formState.categoryId;

          const result = await createRecord("/category/", reqCategory, "Tạo danh mục sản phẩm thành công");

          if (result) {
            formRef.value?.resetFields();
            context.emit("onSubmitSuccess");
            closeModal();
          }
        } else {
          reqCategory.categoryId = props.parentCategoryId;
          const result = await createRecord("/category/child-cate", reqCategory, "Tạo danh mục con thành công");

          if (result) {
            formRef.value?.resetFields();
            context.emit("onSubmitSuccess");
            closeModal();
          }
        }
      }
    };

    const onUpdate = async () => {
      if (type.value === "update") {
        const reqCategory = { ...formState };

        if (!isChildForm.value) {
          delete reqCategory.categoryId;
          delete reqCategory.file;

          const result = await updateRecord(`/category/${reqCategory.id}`, reqCategory, "Cập nhật danh mục thành công");

          if (result) {
            context.emit("onSubmitSuccess");
            formRef.value?.resetFields();
            closeModal();
          }
        } else {
          reqCategory.categoryId = props.parentCategoryId;

          const result = await updateRecord(
            `/category/child-cate/${reqCategory.id}`,
            reqCategory,
            "Cập nhật danh mục con thành công"
          );

          if (result) {
            context.emit("onSubmitSuccess");
            formRef.value?.resetFields();
            closeModal();
          }
        }
      }
    };

    const onSubmit = async () => {
      try {
        const value = await formRef.value?.validateFields();
        if (value) {
          formState.imageUrl = formState.file[0].url;
          onCreate();
          onUpdate();
        }
      } catch (e) {
        console.error(e);
      }
    };

    return {
      visible,
      formState,
      formRef,
      type,
      loadingCreate,
      loadingUpdate,
      isChildForm,
      onSubmit,
      onOpenModal,
      closeModal,
    };
  },
});
</script>
