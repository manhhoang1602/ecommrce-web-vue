<template>
  <a-select
    :allow-clear="true"
    :filter-option="filterOption"
    :loading="loading"
    :options="data"
    :placeholder="placeholder"
    :value="modelValue"
    show-search
    style="width: 100%"
    @change="handleChange"
  >
  </a-select>
</template>

<script lang="ts">
import { Constants } from "@/commons";
import { useListProvince } from "@/services";
import { computed, onMounted } from "vue";

export default {
  name: "ProvincesSelect",
  computed: {
    Constants() {
      return Constants;
    },
  },
  emits: ["update:modelValue"],
  props: ["modelValue", "placeholder"],
  setup(props: any, { emit }: any) {
    const { loading, listProvince, getListProvince } = useListProvince();

    const data = computed(() => {
      return listProvince.value.map((value) => {
        return {
          key: value.key,
          value: value.province,
          label: value.province,
        };
      });
    });

    const filterOption = (input: string, option: any) => {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };
    const handleChange = (value: any) => {
      emit("update:modelValue", value);
    };

    onMounted(() => {
      getListProvince();
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
