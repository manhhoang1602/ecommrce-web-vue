<template>
  <a-config-provider :locale="viVN">
    <RouterView />
  </a-config-provider>
</template>

<script>
import viVN from "ant-design-vue/es/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { defineComponent } from "vue";

dayjs.locale("en");

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    filters: [
      {
        text: "filter1",
        value: "filter1",
      },
    ],
  },
  {
    title: "Age",
    dataIndex: "age",
  },
];
export default defineComponent({
  setup() {
    return {
      viVN,
      dayjs,
    };
  },
});
</script>

<style scoped></style>
