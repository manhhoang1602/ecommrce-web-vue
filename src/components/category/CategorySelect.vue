<template>
  <a-select
    :allow-clear="true"
    :filter-option="filterOption"
    :loading="loading"
    :options="data"
    :placeholder="placeholder"
    show-search
    style="width: 100%"
    @change="handleChange"
  ></a-select>
</template>

<script lang="ts">
import { useListCategory } from "@/services";
import { onMounted, ref } from "vue";
import type { SelectProps } from "ant-design-vue";

export default {
  name: "CategorySelect",
  emits: ["update:modelValue"],
  props: ["placeholder"],
  setup(props: any, { emit }: any) {
    const { loading, getListCategory } = useListCategory();
    const data = ref<SelectProps["options"]>([]);

    const loadListCategory = async () => {
      const result = await getListCategory({ page: 0 } as any);
      if (result) {
        data.value = result.map((value) => {
          if (value.childCategory.length) {
            return {
              key: value.id,
              value: JSON.stringify({ parentId: value.id }),
              label: value.name,
              options: value.childCategory.map((value1) => {
                return {
                  key: value.id + value1.id,
                  value: JSON.stringify({ parentId: value.id, childId: value1.id }),
                  label: value1.name,
                };
              }),
            };
          }
          return {
            value: JSON.stringify(value),
            label: value.name,
          };
        });
      }
    };

    const filterOption = (input: string, option: any) => {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    const handleChange = (value: any) => {
      emit("update:modelValue", value);
    };

    onMounted(() => {
      loadListCategory();
    });

    return {
      loading,
      data,
      filterOption,
      handleChange,
    };
  },
};
</script>

<style scoped></style>
