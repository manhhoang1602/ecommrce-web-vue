<template>
  <a-upload
    :before-upload="beforeUpload"
    :file-list="modelValue"
    action="https://apidev.tpmart.winds.vn/api/v1/files/uploadFile/1"
    list-type="picture"
    name="image"
    @change="handleChange"
    @preview="handlePreview"
  >
    <a-button>
      <upload-outlined></upload-outlined>
      Tải file
    </a-button>
  </a-upload>
</template>

<script lang="ts">
import { UploadOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
import type { UploadProps } from "ant-design-vue";
import { message } from "ant-design-vue";

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
    UploadOutlined,
  },
  props: ["modelValue"],
  defineEmits: ["update:modelValue"],
  setup(props: any, { emit }: any) {
    const previewImage = ref("");
    const previewVisible = ref(false);
    const previewTitle = ref("");

    const beforeUpload = (file: UploadProps["fileList"][number]) => {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("Định dạng ảnh phải là JPEG hoặc PNG");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Dung lượng ảnh quá lớn vui lòng chọn ảnh dung lượng dưới 2MB");
      }
      return isJpgOrPng && isLt2M;
    };

    const handlePreview = async (file: UploadProps["fileList"][number]) => {
      if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
      previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf("/") + 1);
    };

    const handleChange = (data: any) => {
      emit("update:modelValue", data.fileList);
    };
    return {
      handleChange,
      beforeUpload,
      handlePreview,
    };
  },
});
</script>
