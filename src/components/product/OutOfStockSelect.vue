<template>
  <a-select
    :allow-clear="allowClear"
    :placeholder="placeholder"
    :value="modelValue"
    style="width: 100%"
    @change="handleChange"
  >
    <a-select-option :value="Constants.OUT_OF_STOCK.AVAILABLE"> Còn hàng </a-select-option>
    <a-select-option :value="Constants.OUT_OF_STOCK.UNAVAILABLE"> Hết hàng </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { Constants } from "@/commons";

export default {
  name: "OutOfStockSelect",
  computed: {
    Constants() {
      return Constants;
    },
  },
  emits: ["update:modelValue"],
  props: ["modelValue", "placeholder", "allowClear"],
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
