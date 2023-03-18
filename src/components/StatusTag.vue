<template>
  <a-tag v-if="status === Constants.STATUS.ACTIVE" color="green"> Đang hoạt động </a-tag>
  <a-tag v-if="status === Constants.STATUS.INACTIVE" color="gray"> Ngưng hoạt động </a-tag>
</template>

<script lang="ts">
import { Constants } from "@/commons";

export default {
  name: "StatusTag",
  computed: {
    Constants() {
      return Constants;
    },
  },
  props: ["status"],
  setup(props: any) {},
};
</script>

<style scoped></style>
