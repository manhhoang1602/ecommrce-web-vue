<template>
  <a-tag v-if="outOfStock === Constants.OUT_OF_STOCK.AVAILABLE" color="green"> Còn hàng </a-tag>
  <a-tag v-if="outOfStock === Constants.OUT_OF_STOCK.UNAVAILABLE" color="gray"> Hết hàng </a-tag>
</template>

<script>
import { Constants } from "@/commons";

export default {
  name: "OutOfStock",
  computed: {
    Constants() {
      return Constants;
    },
  },
  props: ["outOfStock"],
};
</script>

<style scoped></style>
