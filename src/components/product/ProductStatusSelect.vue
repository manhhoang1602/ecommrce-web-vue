<template>
  <a-select :allow-clear="true" :placeholder="placeholder" style="width: 100%" @change="handleChange">
    <a-select-option :value="Constants.PRODUCT_STATUS.NORMAL"> Mặc định </a-select-option>
    <a-select-option :value="Constants.PRODUCT_STATUS.BEST_SELLER"> Bán chạy </a-select-option>
    <a-select-option :value="Constants.PRODUCT_STATUS.COMING_SOON"> Sắp về </a-select-option>
    <a-select-option :value="Constants.PRODUCT_STATUS.HOT"> Hot </a-select-option>
    <a-select-option :value="Constants.PRODUCT_STATUS.VIP"> Vip </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { Constants } from "@/commons";

export default {
  name: "ProductStatusSelect",
  computed: {
    Constants() {
      return Constants;
    },
  },
  emits: ["update:modelValue"],
  props: ["placeholder"],
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
