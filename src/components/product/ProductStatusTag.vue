<template>
  <a-tag v-if="productStatus === Constants.PRODUCT_STATUS.NORMAL" color="blue"> Mặc định </a-tag>
  <a-tag v-if="productStatus === Constants.PRODUCT_STATUS.BEST_SELLER" color="red"> Bán chạy </a-tag>
  <a-tag v-if="productStatus === Constants.PRODUCT_STATUS.COMING_SOON" color="orange"> Sắp về </a-tag>
  <a-tag v-if="productStatus === Constants.PRODUCT_STATUS.HOT" color="green"> Hot </a-tag>
  <a-tag v-if="productStatus === Constants.PRODUCT_STATUS.VIP" color="purple"> Vip </a-tag>
</template>

<script lang="ts">
import { Constants } from "@/commons";

export default {
  name: "ProductStatusTag",
  computed: {
    Constants() {
      return Constants;
    },
  },
  props: ["productStatus"],
  setup(props: any) {},
};
</script>

<style scoped></style>
