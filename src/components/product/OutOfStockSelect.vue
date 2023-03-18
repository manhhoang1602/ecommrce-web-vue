<template>
  <a-select :allow-clear="true" :placeholder="placeholder" style="width: 100%" @change="handleChange">
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
