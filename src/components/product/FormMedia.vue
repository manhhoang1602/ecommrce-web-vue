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
              <UploadFile v-model="formState.listImage" path-upload="products/images/" />
            </a-form-item>
          </a-col>

          <a-col span="12">
            <a-divider class="title-form-media">Video sản phẩm</a-divider>

            <a-form-item v-if="!urlVideo" name="listImage">
              <UploadFile v-model="formState.video" path-upload="products/videos/" typeMedia="video" />
            </a-form-item>

            <div v-if="urlVideo" class="wrapper-video">
              <i class="far fa-window-close" @click="onCloseVideo"></i>
              <video controls width="400">
                <source :src="urlVideo" type="video/mp4" />
              </video>
            </div>
          </a-col>
          <a-col span="12"></a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import UploadFile from "@/components/base/UploadFile.vue";
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

    const urlVideo = computed(() => {
      return formState.value.video.length > 0 && formState.value.video[0].url;
    });

    const onCloseVideo = () => {
      formState.value = { ...formState.value, video: [] };
    };

    const onSubmit = async (): Promise<IFormStateMedia | undefined> => {
      const value = await formMediaRef.value?.validateFields();
      if (value) {
        return formState.value;
      }

      return undefined;
    };

    const loadForm = (data: IFormStateMedia) => {
      formState.value = data;
    };

    return {
      formState,
      formMediaRef,
      urlVideo,
      onCloseVideo,
      onSubmit,
      loadForm,
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

  .wrapper-video {
    position: relative;
    width: 400px;
    i {
      position: absolute;
      top: 0;
      right: 0;
      color: red;
      font-size: 24px;
      cursor: pointer;
      z-index: 1;
    }
  }
}
</style>
