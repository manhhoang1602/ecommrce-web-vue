<template>
  <a-upload
    :before-upload="beforeUpload"
    :custom-request="dummyRequest"
    :file-list="modelValue"
    :multiple="typeMedia === 'video' ? false : true"
    list-type="picture"
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
    UploadOutlined,
  },
  props: ["modelValue", "pathUpload", "typeMedia"],
  defineEmits: ["update:modelValue"],
  setup(props: any, { emit }: any) {
    const previewImage = ref("");
    const previewVisible = ref(false);
    const previewTitle = ref("");

    const beforeUpload = (file: UploadProps["fileList"][number]) => {
      if (props.typeMedia === "video") {
        const isVideo = file.type.includes("video");
        if (!isVideo) {
          message.error("Không phải định dạng video");
          return false;
        }
      } else {
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
      }
    };

    const handlePreview = async (file: UploadProps["fileList"][number]) => {
      if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
      previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf("/") + 1);
    };

    const handleChange = async (data: any) => {
      emit("update:modelValue", data.fileList);
    };

    const dummyRequest = async ({ file, onSuccess }: any) => {
      upload(file, props.pathUpload, (url) => {
        file.url = url;
        file.filename = file.name;
        onSuccess(url, file);
      });
    };
    return {
      handleChange,
      beforeUpload,
      handlePreview,
      dummyRequest,
    };
  },
});
</script>
