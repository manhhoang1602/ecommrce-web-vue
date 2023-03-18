<template>
  <div class="clearfix">
    <a-upload
      v-model:file-list="fileList"
      :before-upload="beforeUpload"
      action="https://apidev.tpmart.winds.vn/api/v1/files/uploadFile/1"
      list-type="picture-card"
      name="image"
      @preview="handlePreview"
    >
      <div v-if="fileList.length < totalFile">
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
import { defineComponent, onMounted, onUnmounted, ref, watch } from "vue";
import type { UploadProps } from "ant-design-vue";
import { message } from "ant-design-vue";
import Utils from "@/commons/Utils";

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
  emits: ["uploadImageSuccess"],
  props: ["defaultFileList", "totalFile"],
  setup(props, context) {
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

    onMounted(() => {
      if (props.defaultFileList) {
        fileList.value = props.defaultFileList;
      }
    });

    onUnmounted(() => {
      fileList.value = [];
      previewImage.value = "";
      previewTitle.value = "";
      context.emit("uploadImageSuccess", undefined);
    });

    watch(fileList, () => {
      context.emit("uploadImageSuccess", Utils.formatFileList(fileList.value));
    });

    return {
      previewVisible,
      previewImage,
      fileList,
      previewTitle,

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
