<template>
  <div class="banner-item-component">
    <a-card :title="title">
      <template #extra>
        <a-button type="text" @click="onFinish">Lưu</a-button>
      </template>
      <a-form ref="formRef" :model="dynamicValidateForm" @finish="onFinish">
        <div v-for="(banner, index) in dynamicValidateForm.banners" :key="banner.id" class="item-form-dynamic">
          <a-form-item
            :name="['banners', index, 'order']"
            :rules="{
              required: true,
              message: 'Vui lòng nhập thứ tự hiển thị',
            }"
          >
            <a-input-number
              v-model:value="banner.order"
              :style="{ width: '100%' }"
              min="0"
              placeholder="Thứ tự hiển thị."
            />
          </a-form-item>

          <a-form-item
            :name="['banners', index, 'url']"
            :rules="{
              required: true,
              message: 'Vui lòng nhập đường dẫn.',
            }"
          >
            <a-textarea v-model:value="banner.url" placeholder="Đường dẫn" rows="3" />
          </a-form-item>

          <a-form-item
            :name="['banners', index, 'file']"
            :rules="{
              required: true,
              message: 'Vui lòng chọn ảnh banner.',
            }"
          >
            <UploadImage v-model="banner.file" :totalFile="1" path-upload="list-banner/" />
          </a-form-item>
          <i v-if="index !== 0" class="fas fa-trash" @click="removeBanner(banner)"></i>
        </div>

        <a-form-item v-if="dynamicValidateForm.banners.length < total" style="margin-top: 8px">
          <a-button block type="dashed" @click="addBanner">
            <PlusOutlined />
            Thêm banner
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
<script lang="ts">
import { PlusOutlined } from "@ant-design/icons-vue";
import { defineComponent, reactive, ref } from "vue";
import type { FormInstance } from "ant-design-vue";
import UploadImage from "@/components/base/UploadImage.vue";

interface Banner {
  id: number;
  file: File[];
  order: number | undefined;
  url: string;
}
export default defineComponent({
  components: {
    UploadImage,
    PlusOutlined,
  },
  props: ["title", "total"],
  setup() {
    const formRef = ref<FormInstance>();
    const dynamicValidateForm = reactive<{ banners: Banner[] }>({
      banners: [
        {
          id: Date.now(),
          file: [],
          order: undefined,
          url: "",
        },
      ],
    });
    const removeBanner = (item: Banner) => {
      let index = dynamicValidateForm.banners.indexOf(item);
      if (index !== -1) {
        dynamicValidateForm.banners.splice(index, 1);
      }
    };
    const addBanner = () => {
      dynamicValidateForm.banners.push({
        id: Date.now(),
        file: [],
        order: undefined,
        url: "",
      });
    };
    const onFinish = async () => {
      const result = await formRef.value?.validateFields();
      if (result) {
        console.log(result);
      }
    };
    return {
      formRef,
      dynamicValidateForm,
      onFinish,
      removeBanner,
      addBanner,
    };
  },
});
</script>

<style lang="scss" scoped>
.banner-item-component {
  margin-top: 0px;
  ::v-deep .ant-card-head-title {
    font-family: OpenSans-Semibold;
    color: red;
    font-style: italic;
  }

  ::v-deep .ant-btn-text {
    span {
      font-family: OpenSans-Semibold;
      font-style: italic;
      color: #2148c0 !important;
    }
  }

  ::v-deep .item-form-dynamic {
    position: relative;
    border-bottom: 1px solid rgba(128, 128, 128, 0.3);
    padding: 10px;

    i {
      position: absolute;
      top: 0;
      right: 0;
      color: red;
      cursor: pointer;
      font-size: 18px;

      transform: translate(100%, 10%) rotate(10deg);
    }
  }

  ::v-deep .ant-upload {
    margin: 0px !important;
  }
}
</style>
