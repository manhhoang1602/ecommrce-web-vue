<script lang="ts">
export default {
  props: ["modelValue"],
  defineEmits: ["update:modelValue"],
  setup(props: any, { emit }: any) {
    const handleChange = (value: any) => {
      const parser = (value: any) => value.replace(/\đ\s?|(,*)/g, "");
      emit("update:modelValue", parser(value));
    };
    return { handleChange };
  },
};
</script>

<template>
  <a-input-number
    :controls="false"
    :formatter="(value) => `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
    :style="{ width: '100%' }"
    :value="modelValue"
    @input="handleChange"
  />
  <!--  <input :value="modelValue" @input="handleChange" />-->
</template>
