<template>
  <a-select :allow-clear="true" :placeholder="placeholder" style="width: 100%" @change="handleChange">
    <a-select-option :value="Constants.ORDER_STATUS.CANCEL"> Hủy </a-select-option>
    <a-select-option :value="Constants.ORDER_STATUS.COMPLETE"> Hoàn thành </a-select-option>
    <a-select-option :value="Constants.ORDER_STATUS.CONFIRM"> Xác nhận </a-select-option>
    <a-select-option :value="Constants.ORDER_STATUS.DELIVERING"> Đang vận chuyển </a-select-option>
    <a-select-option :value="Constants.ORDER_STATUS.PENDING"> Chờ xác nhận </a-select-option>
    <a-select-option :value="Constants.ORDER_STATUS.UNCONNECTED"> Không liên hệ được với khách hàng </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { Constants } from "@/commons";

export default {
  name: "OrderStatusSelect",
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
