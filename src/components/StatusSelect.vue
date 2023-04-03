<template>
  <a-select
    :allow-clear="true"
    :placeholder="placeholder"
    :value="modelValue"
    style="width: 100%"
    @change="handleChange"
  >
    <a-select-option :value="Constants.STATUS.ACTIVE"> Đang hoạt động </a-select-option>
    <a-select-option :value="Constants.STATUS.INACTIVE"> Ngưng hoạt động </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { Constants } from "@/commons";

export default {
  name: "StatusSelect",
  computed: {
    Constants() {
      return Constants;
    },
  },
  emits: ["update:modelValue"],
  props: ["modelValue", "placeholder"],
  setup(props: any, { emit }: any) {
    const handleChange = (value: any) => {
      emit("update:modelValue", value);
    };

    return {
      handleChange,
    };
  },
};
</script>

<style scoped></style>
