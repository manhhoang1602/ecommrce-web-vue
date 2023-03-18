<template>
  <div class="table-box form-media">
    <div>
      <div class="title">Thông tin hình ảnh</div>

      <a-form
        ref="formMediaRef"
        :label-col="{ span: 10 }"
        :model="formState"
        :wrapper-col="{ span: 14 }"
        autocomplete="off"
        label-align="left"
        name="formUser"
        validate-trigger="submit"
      >
        <a-row>
          <a-col span="12">
            <a-divider class="title-form-media">Hình ảnh sản phẩm</a-divider>
            <a-form-item :rules="[{ required: true, message: 'Vui lòng tải ảnh sản phẩm' }]" name="listImage">
              <UploadFile v-model="formState.listImage" />
            </a-form-item>
          </a-col>

          <a-col span="12">
            <a-divider class="title-form-media">Video sản phẩm</a-divider>

            <a-form-item name="listImage">
              <UploadFile v-model="formState.video" />
            </a-form-item>
          </a-col>
          <a-col span="12"></a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import UploadFile from "@/components/UploadFile.vue";
import type { FormInstance } from "ant-design-vue";
import type { IFormStateMedia } from "@/commons/interface/Product.interface";

export default defineComponent({
  components: { UploadFile },
  setup() {
    const formMediaRef = ref<FormInstance>();
    const formState = ref<IFormStateMedia>({
      listImage: [],
      video: [],
    });
    const onSubmit = async (): Promise<IFormStateMedia | undefined> => {
      const value = await formMediaRef.value?.validateFields();
      if (value) {
        return formState.value;
      }

      return undefined;
    };

    return {
      formState,
      formMediaRef,
      onSubmit,
    };
  },
});
</script>

<style lang="scss">
.form-media {
  .ant-col {
    padding: 8px;
  }

  .ant-divider-inner-text {
    font-family: OpenSans-Semibold;
    font-size: 15px;
    font-style: italic;
  }
}
</style>
