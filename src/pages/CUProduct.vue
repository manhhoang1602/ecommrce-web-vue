<template>
  <div class="cu-product-page">
    <a-page-header :title="isUpdateMode ? `Cập nhật sản phẩm` : `Thêm mới sản phẩm`">
      <template #extra>
        <a-button danger type="primary" @click="onCancel">Hủy</a-button>
        <a-button :loading="loadingCreate || loadingUpdate" type="primary" @click="onSubmit"> Lưu </a-button>
      </template>
    </a-page-header>

    <a-spin :spinning="loading">
      <FormInfo ref="formInfoRef" />
      <FormPrice ref="formPriceRef" />
      <FormMedia ref="formMediaRef" />
    </a-spin>

    <div class="wrapper-list-btn">
      <a-button danger style="margin-right: 10px" type="primary" @click="onCancel"> Hủy </a-button>
      <a-button :loading="loadingUpdate || loadingCreate" type="primary" @click="onSubmit">Lưu</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
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
import { useCreate, useDetailProduct, useLoadFormUpdateProduct, useUpdate } from "@/services";
import router from "@/router";
import { Constants } from "@/commons";
import type { IFile } from "@/commons/interface";

export default defineComponent({
  components: { FormMedia, FormInfo, FormPrice },
  setup() {
    const formInfoRef = ref<{ onSubmit: () => any; loadForm: (data: IFormStateInfoProduct) => any }>();
    const formPriceRef = ref<{
      onSubmit: () => any;
      loadForm: (data: IFormStateSinglePrice | IFormStateMultiPrice) => any;
    }>();
    const formMediaRef = ref<{ onSubmit: () => any; loadForm: (data: IFormStateMedia) => any }>();

    const { loadingCreate, createRecord } = useCreate();
    const { loadingUpdate, updateRecord } = useUpdate();
    const { loading, getDetailProduct } = useDetailProduct();

    const id: any = router.currentRoute.value.params.id;
    const isUpdateMode = computed(() => id);

    const loadForm = async () => {
      const productDetail = await getDetailProduct(id);

      const { formPriceState, formMediaState, formInfoState } = useLoadFormUpdateProduct(productDetail);
      formInfoRef.value?.loadForm(formInfoState);
      formMediaRef.value?.loadForm(formMediaState);
      formPriceRef.value?.loadForm(formPriceState);
    };

    const goToListPage = () => {
      router.push("/product");
    };

    const goToDetailPage = () => {
      router.push(`/product/detail/${id}`);
    };

    const onCancel = () => {
      goToListPage();
    };

    onMounted(() => {
      if (id) {
        loadForm();
      }
    });

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

        const reqImage = formStateMedia.listImage.map((value: IFile, index: number) => {
          return {
            url: value.url,
            order: index,
            type: Constants.PRODUCT_MEDIA_TYPE.IMAGE,
          };
        });

        const reqVideo = formStateMedia.video.map((value: IFile, index: number) => {
          return {
            url: value.url,
            order: index,
            type: Constants.PRODUCT_MEDIA_TYPE.VIDEO,
          };
        });

        const reqProduct: IReqProduct = {
          ...formStateInfo,
          productClass: {
            create: [],
          },
          imageUrl: {
            create: [...reqImage, ...reqVideo],
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
          reqProduct.discountPercent = (formStatePrice as IFormStateSinglePrice).discountPercent;
        }

        if (formStatePrice.type === "multi") {
          const product = (formStatePrice as IFormStateMultiPrice).dataTable.map((value, index) => {
            if (id) {
              return {
                id: value.key,
                price: Number(value.price),
                firstClassName: value.firstClass,
                secondClassName: value.secondClass,
                isNotSale: value.status ? 1 : 0,
              };
            }

            return {
              price: Number(value.price),
              firstClassName: value.firstClass,
              secondClassName: value.secondClass,
              isNotSale: value.status ? 1 : 0,
            };
          });

          const firstProductClass = (formStatePrice as IFormStateMultiPrice).dataFormFirst.map((value, index) => {
            if (index === 0) {
              return {
                type: Constants.PRODUCT_TYPE_CLASS.FIRST_CLASS_NAME,
                name: value.value,
              };
            }
            return {
              type: Constants.PRODUCT_TYPE_CLASS.FIRST,
              name: value.value,
            };
          });

          const secondProductClass = (formStatePrice as IFormStateMultiPrice).dataFormSecond.map((value, index) => {
            if (index === 0) {
              return {
                type: Constants.PRODUCT_TYPE_CLASS.SECOND_CLASS_NAME,
                name: value.value,
              };
            }
            return {
              type: Constants.PRODUCT_TYPE_CLASS.SECOND,
              name: value.value,
            };
          });

          reqProduct.product = {
            create: product as any,
          };

          reqProduct.productClass = {
            create: [...firstProductClass, ...secondProductClass],
          };

          reqProduct.discountPercent = (formStatePrice as IFormStateMultiPrice).discountPercent;
        }

        const deleteKeyBeforeSubmit = () => {
          delete reqProduct.categorySelected;
          if (!childCategoryId) {
            delete reqProduct.childCategory;
          }
        };

        deleteKeyBeforeSubmit();

        if (id) {
          const result = await updateRecord(`/product/${id}`, reqProduct, "Cập nhật sản phẩm thành công");
          result && goToDetailPage();
        } else {
          const result = await createRecord("/product", reqProduct, "Tạo mới sản phẩm thành công");
          if (result) {
            goToListPage();
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    return {
      formInfoRef,
      formPriceRef,
      formMediaRef,
      loadingCreate,
      id,
      loading,
      loadingUpdate,
      isUpdateMode,
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
