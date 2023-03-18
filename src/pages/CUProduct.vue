<template>
  <div class="cu-product-page">
    <a-page-header title="Thêm mới sản phẩm">
      <template #extra>
        <a-button danger type="primary" @click="onCancel">Hủy</a-button>
        <a-button :loading="loadingCreate" type="primary" @click="onSubmit"> Lưu </a-button>
      </template>
    </a-page-header>

    <FormInfo ref="formInfoRef" />
    <FormPrice ref="formPriceRef" />
    <FormMedia ref="formMediaRef" />

    <div class="wrapper-list-btn">
      <a-button danger style="margin-right: 10px" type="primary" @click="onCancel"> Hủy </a-button>
      <a-button type="primary" @click="onSubmit">Lưu</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import FormPrice from "@/components/product/FormPrice.vue";
import FormInfo from "@/components/product/FormInfo.vue";
import FormMedia from "@/components/product/FormMedia.vue";
import type {
  IFormStateInfoProduct,
  IFormStateMedia,
  IFormStateMultiPrice,
  IFormStateSinglePrice,
  IReqProduct,
} from "@/commons/interface/Product.interface";
import Utils from "@/commons/Utils";
import { useCreate } from "@/services";
import router from "@/router";
import { Constants } from "@/commons";

export default defineComponent({
  components: { FormMedia, FormInfo, FormPrice },
  setup() {
    const formInfoRef = ref<{ onSubmit: () => any }>();
    const formPriceRef = ref<{ onSubmit: () => any }>();
    const formMediaRef = ref<{ onSubmit: () => any }>();

    const { loadingCreate, createRecord } = useCreate();

    const goToListPage = () => {
      router.push("/product");
    };

    const onSubmit = async () => {
      const promises = [
        new Promise((resolve) => resolve(formInfoRef.value?.onSubmit())),
        new Promise((resolve) => resolve(formPriceRef.value?.onSubmit())),
        new Promise((resolve) => resolve(formMediaRef.value?.onSubmit())),
      ];

      try {
        const results = await Promise.all(promises);
        const formStateInfo: IFormStateInfoProduct = results[0] as any;
        const formStatePrice: IFormStateSinglePrice | IFormStateMultiPrice = results[1] as any;
        const formStateMedia: IFormStateMedia = results[2] as any;

        const categoryId = Utils.getIdCategorySelectComponent(formStateInfo.categorySelected as string);

        const parentCategoryId: number = categoryId.parentId;
        const childCategoryId: number = categoryId.childId as number;

        const reqProduct: IReqProduct = {
          ...formStateInfo,
          productClass: {
            create: [],
          },
          imageUrl: {
            create: Utils.formatFileList(formStateMedia.listImage).map((value, index) => {
              return { url: value.url, order: index };
            }),
          },
          category: {
            connect: { id: parentCategoryId },
          },
          childCategory: {
            connect: {
              id: Utils.getIdCategorySelectComponent(formStateInfo.categorySelected as string).childId as number,
            },
          },
        };

        if (formStatePrice.type === "single") {
          reqProduct.price = (formStatePrice as IFormStateSinglePrice).productPrice;
        }

        if (formStatePrice.type === "multi") {
          const product = (formStatePrice as IFormStateMultiPrice).dataTable.map((value, index) => {
            return {
              price: Number(value.price),
              firstClassName: value.firstClass,
              secondClassName: value.secondClass,
            };
          });

          const firstProductClass = (formStatePrice as IFormStateMultiPrice).dataFormFirst.map((value) => {
            return {
              type: Constants.PRODUCT_TYPE_CLASS.FIRST,
              name: value.value,
            };
          });

          const secondProductClass = (formStatePrice as IFormStateMultiPrice).dataFormFirst.map((value) => {
            return {
              type: Constants.PRODUCT_TYPE_CLASS.SECOND,
              name: value.value,
            };
          });

          reqProduct.product = {
            create: product,
          };

          reqProduct.productClass = {
            create: [...firstProductClass, ...secondProductClass],
          };
        }

        const deleteKeyBeforeSubmit = () => {
          delete reqProduct.categorySelected;
          if (!childCategoryId) {
            delete reqProduct.childCategory;
          }
        };

        deleteKeyBeforeSubmit();

        await createRecord("/product", reqProduct, "Tạo mới sản phẩm thành công");
        goToListPage();
      } catch (error) {
        console.error(error);
      }
    };

    const onCancel = () => {
      goToListPage();
    };

    return {
      formInfoRef,
      formPriceRef,
      formMediaRef,
      loadingCreate,
      onSubmit,
      onCancel,
    };
  },
});
</script>

<style lang="scss">
.cu-product-page {
  .table-box {
    .block-box {
      .wrapper-form-box {
        padding: 8px;

        .ant-col {
          padding: 0px 8px;
        }

        .ant-form-item-control-input-content {
          .ql-container {
            .ql-editor {
              height: 100% !important;
              min-height: 250px !important;
            }
          }
        }
      }
    }

    .title {
      background-color: #0ab1fc;
      color: white;

      font-size: 16px;
      font-family: OpenSans-Semibold;
      padding: 10px 15px;
      border-radius: 3px;
      margin-bottom: 15px;
    }
  }

  .wrapper-list-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 3px;
    padding: 8px;
    margin-top: 15px;
  }
}
</style>
