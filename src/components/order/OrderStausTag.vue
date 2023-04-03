<template>
  <a-tag v-if="orderStatus === Constants.ORDER_STATUS.PENDING" color="orange"> Chờ xác nhận </a-tag>
  <a-tag v-if="orderStatus === Constants.ORDER_STATUS.UNCONNECTED" color="purple">
    Không liên hệ được với khách hàng
  </a-tag>
  <a-tag v-if="orderStatus === Constants.ORDER_STATUS.DELIVERING" color="yellow"> Đang vận chuyển </a-tag>
  <a-tag v-if="orderStatus === Constants.ORDER_STATUS.CONFIRM" color="blue"> Xác nhận </a-tag>
  <a-tag v-if="orderStatus === Constants.ORDER_STATUS.COMPLETE" color="green"> Hoàn thành </a-tag>
  <a-tag v-if="orderStatus === Constants.ORDER_STATUS.CANCEL" color="red"> Hủy </a-tag>
</template>

<script lang="ts">
import { Constants } from "@/commons";

export default {
  name: "OrderStatusTag",
  computed: {
    Constants() {
      return Constants;
    },
  },
  props: ["orderStatus"],
  setup(props: any) {},
};
</script>

<style scoped></style>
