<template>
  <a-form ref="formRef" :model="dynamicValidateForm" name="dynamic_form_item" v-bind="formItemLayoutWithOutLabel">
    <a-form-item
      v-for="(classData, index) in dynamicValidateForm.dataClass"
      :key="classData.key"
      :label="getTitleClass(index)"
      :name="['dataClass', index, 'value']"
      :rules="{
        required: true,
        message: 'Vui lòng nhập tên.',
        trigger: 'change',
      }"
      v-bind="index === 0 || index === 1 ? formItemLayout : {}"
    >
      <a-input v-model:value="classData.value" :disabled="disabled" style="width: 90%; margin-right: 8px" />
      <i
        v-if="index !== 1 && index !== 0 && !disabled"
        class="fal fa-trash-alt"
        style="color: red"
        @click="removeDomain(classData)"
      ></i>
    </a-form-item>

    <a-form-item v-if="dynamicValidateForm.dataClass.length <= 15 && !disabled" v-bind="formItemLayoutWithOutLabel">
      <a-button style="width: 60%" type="dashed" @click="addDomain">
        <i class="fal fa-plus-circle" style="margin-right: 8px"></i>
        Thêm phân loại hàng
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, reactive, ref, watch } from "vue";
import type { FormInstance } from "ant-design-vue";

export interface IClass {
  value: string;
  key: number | string;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};
export default defineComponent({
  emits: ["onChange"],
  setup(props, context) {
    const formRef = ref<FormInstance>();
    const dynamicValidateForm = reactive<{ dataClass: IClass[] }>({
      dataClass: [
        { value: "", key: 0 },
        { value: "", key: 1 },
      ],
    });

    const disabled = ref<boolean>(false);

    const loadForm = (data: IClass[]) => {
      disabled.value = true;
      dynamicValidateForm.dataClass = data;
    };

    const getTitleClass = (index: number): string => {
      if (index === 0) {
        return "Tên nhóm";
      }
      if (index === 1) {
        return "Tên PL";
      }
      return "";
    };
    const submitForm = async () => {
      const result = await formRef.value?.validate();
      return result;
    };
    const resetForm = () => {
      dynamicValidateForm.dataClass = [];
    };
    const remove = (item: IClass) => {
      let index = dynamicValidateForm.dataClass.indexOf(item);
      if (index !== -1) {
        dynamicValidateForm.dataClass.splice(index, 1);
      }
    };
    const add = () => {
      dynamicValidateForm.dataClass.push({
        value: "",
        key: Date.now(),
      });
    };

    watch(
      dynamicValidateForm,
      () => {
        context.emit("onChange", dynamicValidateForm.dataClass);
      },
      { deep: true }
    );

    onUnmounted(() => {
      resetForm();
      context.emit("onChange", []);
    });

    return {
      formRef,
      formItemLayout,
      formItemLayoutWithOutLabel,
      dynamicValidateForm,
      disabled,
      loadForm,
      getTitleClass,
      submitForm,
      resetForm,
      removeDomain: remove,
      addDomain: add,
    };
  },
});
</script>
