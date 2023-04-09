<template>
  <div class="search-box feeship-component">
    <a-card :loading="loading" title="Cấu hình phí ship">
      <template #extra>
        <a-button :loading="loadingUpdate" type="text" @click="onFinish">Lưu</a-button>
      </template>
      <a-form ref="formRef" :label-col="{ span: 4 }" :model="formState" :wrapper-col="{ span: 20 }" autocomplete="off">
        <a-form-item :rules="[{ required: true, message: 'Vui lòng giá ship' }]" label="Phí ship" name="shipPrice">
          <InputNumber v-model="formState.shipPrice" />
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import InputNumber from "@/components/base/InputNumber.vue";
import type { FormInstance } from "ant-design-vue";
import { useGetShipFees, useUpdate } from "@/services";

export default defineComponent({
  components: { InputNumber },
  setup() {
    const formRef = ref<FormInstance>();
    let formState = reactive<{ shipPrice: number }>({ shipPrice: 0 });

    const { loading, shipPrice, id, getShipFees } = useGetShipFees();
    const { loadingUpdate, updateRecord } = useUpdate();
    const onFinish = async () => {
      try {
        const result = await formRef.value?.validateFields();
        if (result) {
          updateRecord(`/shipfees/${id.value}`, formState, "Cập nhật giá ship thành công.");
        }
      } catch (e) {
        console.error(e);
      }
    };

    onMounted(async () => {
      await getShipFees();
      formState.shipPrice = shipPrice.value?.shipPrice as number;
    });

    return {
      formRef,
      formState,
      loading,
      shipPrice,
      loadingUpdate,
      onFinish,
    };
  },
});
</script>

<style lang="scss" scoped>
.feeship-component {
  margin-top: 0px;
  ::v-deep .ant-card-head-title {
    font-family: OpenSans-Semibold;
    color: red;
    font-style: italic;
  }

  ::v-deep .ant-btn-text {
    span {
      font-family: OpenSans-Semibold;
      font-style: italic;
      color: #2148c0 !important;
    }
  }
}
</style>
