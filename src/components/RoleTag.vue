<template>
  <a-tag v-if="role === Constants.ROLE.ADMIN" color="blue">Quản trị viên</a-tag>
  <a-tag v-if="role === Constants.ROLE.EMPLOYEE" color="orange">Nhân viên</a-tag>
  <a-tag v-if="role === Constants.ROLE.USER" color="purple">Khách hàng</a-tag>
</template>

<script lang="ts" setup>
import { Constants } from "@/commons";

interface IProps {
  role: 0 | 1 | 2;
}

defineProps<IProps>();
</script>
