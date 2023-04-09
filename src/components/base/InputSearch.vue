<template>
  <a-input-search :placeholder="placeholder" @change="debouncedValue" />
</template>

<script lang="ts">
import { Constants } from "@/commons";
import { debounce } from "lodash";

export default {
  name: "InputSearch",
  computed: {
    Constants() {
      return Constants;
    },
  },
  emits: ["onChange"],
  props: ["defaultValue", "placeholder"],
  setup(props: any, { emit }: any) {
    const debouncedValue = debounce((e: any) => {
      emit("onChange", e.target.value);
    }, 500);

    return {
      debouncedValue,
    };
  },
};
</script>

<style scoped></style>
