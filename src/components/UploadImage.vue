<template>
  <div class="clearfix">
    <a-upload
      :before-upload="beforeUpload"
      :custom-request="dummyRequest"
      :file-list="modelValue"
      list-type="picture-card"
      @change="handleChange"
      @preview="handlePreview"
    >
      <div v-if="modelValue?.length < totalFile || modelValue === undefined">
        <plus-outlined />
        <div style="margin-top: 8px">Tải file</div>
      </div>
    </a-upload>
    <a-modal :footer="null" :title="previewTitle" :visible="previewVisible" @cancel="handleCancel">
      <img :src="previewImage" alt="example" style="width: 100%" />
    </a-modal>
  </div>
</template>
<script lang="ts">
import { PlusOutlined } from "@ant-design/icons-vue";
import { defineComponent, onMounted, ref } from "vue";
import type { UploadProps } from "ant-design-vue";
import { message } from "ant-design-vue";
import { upload } from "@/FireBaseConfig";

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default defineComponent({
  components: {
    PlusOutlined,
  },
  defineEmits: ["update:modelValue"],
  props: ["modelValue", "defaultFileList", "totalFile", "pathUpload"],
  setup(props, { emit }: any) {
    const previewVisible = ref(false);
    const previewImage = ref("");
    const previewTitle = ref("");

    const fileList = ref<UploadProps["fileList"]>([]);

    const handleCancel = () => {
      previewVisible.value = false;
      previewTitle.value = "";
    };
    const handlePreview = async (file: UploadProps["fileList"][number]) => {
      if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
      previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf("/") + 1);
    };

    const beforeUpload = (file: UploadProps["fileList"][number]) => {
      const isImage = file.type.includes("image");
      if (!isImage) {
        message.error("Không phải định dạng ảnh");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Dung lượng ảnh quá lớn vui lòng chọn ảnh dung lượng dưới 2MB");
      }
      return isLt2M;
    };

    const dummyRequest = async ({ file, onSuccess }: any) => {
      upload(file, props.pathUpload, (url) => {
        file.url = url;
        file.filename = file.name;
        onSuccess(url, file);
      });
    };

    const handleChange = async (data: any) => {
      emit("update:modelValue", data.fileList);
    };

    onMounted(() => {
      console.log(props.modelValue);
      fileList.value = props.modelValue;
    });

    return {
      previewVisible,
      previewImage,
      fileList,
      previewTitle,
      handleChange,
      dummyRequest,
      handleCancel,
      handlePreview,
      beforeUpload,
    };
  },
});
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
