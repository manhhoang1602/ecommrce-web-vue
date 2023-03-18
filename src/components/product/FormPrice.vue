<template>
  <div class="table-box form-price">
    <div>
      <div class="title">Thông tin giá</div>
      <div style="padding: 0px 16px">
        <a-row v-if="isShowFormPricePublic">
          <a-col span="10">
            <a-form
              ref="formSinglePriceRef"
              :label-col="{ span: 10 }"
              :model="formStateSinglePrice"
              :wrapper-col="{ span: 14 }"
              autocomplete="off"
              label-align="left"
              name="formUser"
              validate-trigger="submit"
            >
              <a-form-item
                :rules="[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]"
                label="Giá bán"
                name="productPrice"
              >
                <InputNumber v-model="formStateSinglePrice.productPrice" />
              </a-form-item>

              <a-form-item label="Thiết lập phân loại hàng">
                <a-button ghost style="width: 100%" type="primary" @click="onAddClass"> Thêm phân loại hàng </a-button>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>

        <div v-if="!isShowFormPricePublic">
          <div>
            <a-row>
              <a-col v-if="isHasClassFirst" span="12">
                <div class="wrapper-dynamic-form">
                  <div class="title-dynamic-form">Nhóm phân loại 1</div>
                  <i class="fal fa-times" @click="onRemoveClass('first')"></i>
                  <FormDynamicPrice ref="formFirstRef" @on-change="handleFormFirstChange" />
                </div>
              </a-col>
              <a-col v-if="isHasClassSecond" span="12">
                <div class="wrapper-dynamic-form">
                  <div class="title-dynamic-form">Nhóm phân loại 2</div>
                  <i class="fal fa-times" @click="onRemoveClass('second')"></i>
                  <FormDynamicPrice ref="formSecondRef" @on-change="handleFormSecondChange" />
                </div>
              </a-col>
            </a-row>

            <a-button
              v-if="isShowBtnAddClass"
              ghost
              style="width: 250px; margin-left: 8px; margin-top: 15px"
              type="primary"
              @click="onAddClass"
            >
              Thêm phân loại hàng
            </a-button>
          </div>

          <div class="wrapper-table-price">
            <a-divider>
              <span style="font-family: OpenSans-Semibold; font-size: 16px; font-style: italic">Thông tin giá</span>
            </a-divider>

            <div class="control-price-box">
              <a-form-item
                :label-col="{ span: 10 }"
                :wrapper-col="{ span: 14 }"
                label="Thiết lập giá"
                label-align="left"
              >
                <a-input-number
                  :controls="false"
                  :formatter="(value) => `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                  :style="{ width: '100%' }"
                />
              </a-form-item>

              <a-button type="primary"> Áp dụng cho tất cả </a-button>
            </div>
            <a-table
              :columns="columns"
              :data-source="dataTable"
              :scroll="{ x: 700 }"
              bordered
              @change="onPaginationChange"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'price'">
                  <InputNumber v-model="record.price" />
                </template>

                <template v-if="column.key === 'status'">
                  <a-checkbox v-model:checked="record.status" />
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import type { IClass } from "@/components/product/FormDynamicPrice.vue";
import FormDynamicPrice from "@/components/product/FormDynamicPrice.vue";
import type { IColumn, IFormStateMultiPrice, IFormStateSinglePrice, IItemTablePrice } from "@/commons/Interfaces";
import InputNumber from "@/components/InputNumber.vue";
import type { FormInstance } from "ant-design-vue";

const defaultColumns: IColumn[] = [{ title: "STT", dataIndex: "index", key: "index", width: 60, fixed: true }];

export default defineComponent({
  components: { InputNumber, FormDynamicPrice },
  setup() {
    const isHasClassFirst = ref<boolean>(false);
    const isHasClassSecond = ref<boolean>(false);

    const dataFormFirst = ref<IClass[]>([]);
    const dataFormSecond = ref<IClass[]>([]);

    const columns = ref<IColumn[]>([]);
    const dataTable = ref<IItemTablePrice[]>([]);

    const formFirstRef = ref<{
      submitForm: () => any;
      resetFields: () => any;
    }>();
    const formSecondRef = ref<{
      submitForm: () => any;
      resetFields: () => any;
    }>();
    const formSinglePriceRef = ref<FormInstance>();

    const isShowFormPricePublic = computed((): boolean => {
      if (isHasClassFirst.value === false && isHasClassSecond.value === false) {
        return true;
      } else if (isHasClassFirst.value === true && isHasClassSecond.value === true) {
        return false;
      } else {
        return isHasClassFirst.value && isHasClassSecond.value;
      }
    });
    const isShowBtnAddClass = computed((): boolean => {
      return !(isHasClassFirst.value && isHasClassSecond.value);
    });

    const formStateSinglePrice = ref<IFormStateSinglePrice>({
      type: "single",
      productPrice: undefined,
    });

    const onAddClass = () => {
      formStateSinglePrice.value.productPrice = undefined;

      if (!isHasClassFirst.value) {
        isHasClassFirst.value = true;
      } else {
        isHasClassSecond.value = true;
      }
    };
    const onRemoveClass = (_class: "first" | "second") => {
      if (_class === "first") {
        isHasClassFirst.value = false;
        formFirstRef.value?.resetFields();
      } else {
        isHasClassSecond.value = false;
        formSecondRef.value?.resetFields();
      }
    };

    const handleFormFirstChange = (data: IClass[]) => {
      dataFormFirst.value = data;
    };

    const handleFormSecondChange = (data: IClass[]) => {
      dataFormSecond.value = data;
    };

    const onFormChange = () => {
      const setTHeadTable = () => {
        const newColumns = [...defaultColumns];
        dataFormFirst.value.length >= 1 &&
          newColumns.push({
            title: dataFormFirst.value[0].value,
            dataIndex: "firstClass",
            key: "firstClass",
          });
        dataFormSecond.value.length >= 1 &&
          newColumns.push({
            title: dataFormSecond.value[0].value,
            dataIndex: "secondClass",
            key: "secondClass",
          });
        newColumns.push({ title: "Giá", dataIndex: "price", key: "price" });
        newColumns.push({
          title: "Ngưng bán",
          dataIndex: "status",
          width: 200,
          key: "status",
        });

        columns.value = newColumns;
      };

      const setTBodyTable = (): IItemTablePrice[] => {
        const dataTBodyFirst: IClass[] = [...dataFormFirst.value].splice(1) as any;
        const dataTBodySecond: IClass[] = [...dataFormSecond.value].slice(1) as any;

        const dataTBody: IItemTablePrice[] = [];

        dataTBodyFirst.forEach((value: IClass, index) => {
          dataTBodySecond.forEach((value1: IClass, index1) => {
            dataTBody.push({
              key: (value.key as any) + value1.key,
              index: index * dataFormFirst.value.length + index1 + 1,
              firstClass: value.value,
              secondClass: value1.value,
              price: 0,
              status: 1,
            });
          });
        });

        dataTable.value = dataTBody;

        return dataTBody;
      };

      setTHeadTable();
      setTBodyTable();
    };

    watch(
      [dataFormFirst, dataFormSecond],
      () => {
        onFormChange();
      },
      { deep: true }
    );

    const onSubmit = async (): Promise<IFormStateSinglePrice | IFormStateMultiPrice | undefined> => {
      const submitFormSinglePrice = async (): Promise<IFormStateSinglePrice | undefined> => {
        const value = await formSinglePriceRef.value?.validateFields();
        if (value) {
          return formStateSinglePrice.value;
        }
      };

      const submitFormMultiPrice = async (): Promise<IFormStateMultiPrice> => {
        const promises = [
          new Promise((resolve) => resolve(formFirstRef.value?.submitForm())),
          new Promise((resolve) => resolve(formSecondRef.value?.submitForm())),
        ];

        if (!isHasClassSecond.value) {
          promises.splice(1);
        }

        await Promise.all(promises);

        return {
          type: "multi",
          dataFormFirst: dataFormFirst.value,
          dataFormSecond: dataFormSecond.value,
          dataTable: dataTable.value,
        };
      };

      const isHasClassProduct: boolean = isHasClassFirst.value || isHasClassSecond.value;

      if (isHasClassProduct) {
        return submitFormMultiPrice();
      } else {
        return submitFormSinglePrice();
      }
    };

    return {
      isShowFormPricePublic,
      isShowBtnAddClass,
      isHasClassFirst,
      isHasClassSecond,
      columns,
      dataTable,
      formFirstRef,
      formSecondRef,
      formStateSinglePrice,
      formSinglePriceRef,

      onAddClass,
      onRemoveClass,
      handleFormFirstChange,
      handleFormSecondChange,
      onSubmit,
    };
  },
});
</script>

<style lang="scss">
.form-price {
  .control-price-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    border-radius: 3px;
    border: 1px solid rgba(128, 128, 128, 0.2);

    margin-bottom: 15px;

    .ant-form-item {
      margin: 0px;
    }
  }

  .wrapper-dynamic-form {
    background-color: #f0f0f0;
    margin: 15px;
    padding: 15px;
    border-radius: 4px;
    position: relative;

    .title-dynamic-form {
      font-family: OpenSans-Semibold;
      font-size: 15px;
      margin-bottom: 20px;
    }

    .fa-times {
      position: absolute;
      top: 15px;
      right: 15px;

      font-size: 18px;
      color: red;
      cursor: pointer;
    }

    i {
      cursor: pointer;
    }
  }
}
</style>
