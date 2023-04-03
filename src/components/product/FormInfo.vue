<template>
  <div class="table-box">
    <div class="block-box">
      <div class="title">Thông tin chung</div>
      <div class="wrapper-form-box">
        <div class="form-box">
          <a-form
            ref="formRef"
            :label-col="{ span: 8 }"
            :model="formState"
            :scroll-to-first-error="true"
            :wrapper-col="{ span: 16 }"
            autocomplete="off"
            label-align="left"
            name="formUser"
            validate-trigger="submit"
          >
            <a-row>
              <a-col :span="12">
                <a-form-item
                  :rules="[{ required: true, message: 'Vui lòng nhập mã sản phẩm' }]"
                  label="Mã sản phẩm"
                  name="code"
                >
                  <a-input v-model:value="formState.code" />
                </a-form-item>

                <a-form-item
                  :rules="[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]"
                  label="Tên sản phẩm"
                  name="name"
                >
                  <a-textarea v-model:value="formState.name" :row="6" />
                </a-form-item>

                <a-form-item
                  :rules="[
                    {
                      required: true,
                      message: 'Vui lòng chọn trạng thái sản phẩm',
                    },
                  ]"
                  label="Trạng thái sản phẩm"
                  name="productStatus"
                >
                  <ProductStatusSelect v-model="formState.productStatus" />
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item
                  :rules="[
                    {
                      required: true,
                      message: 'Vui lòng chọn danh mục sản phẩm',
                    },
                  ]"
                  label="Danh mục"
                  name="categorySelected"
                >
                  <CategorySelect id="category-select" v-model="formState.categorySelected" />
                </a-form-item>

                <a-form-item v-if="type === 'update'" label="Trạng thái hàng" name="outOfStock">
                  <OutOfStockSelect id="outOfStock" v-model="formState.outOfStock" :allowClear="false" />
                </a-form-item>

                <a-form-item v-if="type === 'update'" label="Trạng thái" name="status">
                  <StatusSelect id="status" v-model="formState.status" :allowClear="false" />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  :label-col="{ span: 4 }"
                  :wrapper-col="{ span: 20 }"
                  label="Mô tả sản phẩm"
                  name="description"
                >
                  <QuillEditor v-model:content="formState.description" contentType="html" style="min-height: 250px" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import CategorySelect from "@/components/category/CategorySelect.vue";
import { ref } from "vue";
import { Constants } from "@/commons";
import ProductStatusSelect from "@/components/product/ProductStatusSelect.vue";
import type { FormInstance } from "ant-design-vue";
import type { IFormStateInfoProduct } from "@/commons/interface/Product.interface";
import OutOfStockSelect from "@/components/product/OutOfStockSelect.vue";
import StatusSelect from "@/components/StatusSelect.vue";

export default {
  name: "FormInfo",
  computed: {
    Constants() {
      return Constants;
    },
  },
  components: { StatusSelect, OutOfStockSelect, ProductStatusSelect, CategorySelect },
  emits: ["onValidateSuccess"],
  setup(props: any, { emit }: any) {
    const formRef = ref<FormInstance>();
    const formState = ref<IFormStateInfoProduct>({
      categorySelected: undefined,
      code: undefined,
      description: undefined,
      name: undefined,
      productStatus: undefined,
    });
    const type = ref<"add" | "update">("add");

    const loadForm = (formData: IFormStateInfoProduct) => {
      formState.value = formData;
      type.value = "update";
    };

    const onSubmit = async (): Promise<boolean | IFormStateInfoProduct> => {
      const value = await formRef.value?.validateFields();
      if (value) {
        return formState.value;
      }
      return false;
    };

    return {
      formState,
      formRef,
      type,
      onSubmit,
      loadForm,
    };
  },
};
</script>
