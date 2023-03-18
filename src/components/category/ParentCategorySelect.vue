<template>
  <a-select
    v-model:value="selectedValue"
    :disabled="disabled"
    :filter-option="filterOption"
    :loading="loading"
    :options="data"
    show-search
    style="width: 100%"
  ></a-select>
</template>

<script lang="ts">
import { useListCategory } from "@/services";
import { onMounted, ref, watch } from "vue";
import type { SelectProps } from "ant-design-vue";

export default {
  name: "ParentCategorySelect",
  props: ["defaultValue", "disabled"],
  emits: ["onChange"],
  setup(props: any, context: any) {
    const { loading, getListCategory } = useListCategory();
    const data = ref<SelectProps["options"]>([]);
    const selectedValue = ref();

    const loadListCategory = async () => {
      const result = await getListCategory({ page: 0 } as any);
      if (result) {
        data.value = result.map((value) => {
          return {
            value: value.id,
            label: value.name,
          };
        });
      }
    };

    const filterOption = (input: string, option: any) => {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    watch(selectedValue, () => {
      context.emit("onChange", selectedValue);
    });

    onMounted(() => {
      loadListCategory();
      selectedValue.value = props.defaultValue;
    });

    return {
      loading,
      data,
      selectedValue,
      filterOption,
    };
  },
};
</script>

<style scoped></style>
