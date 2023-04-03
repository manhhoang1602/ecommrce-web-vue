<template>
  <div class="product-detail">
    <a-page-header title="Chi tiết sản phẩm">
      <template #extra>
        <a-popconfirm
          cancel-text="Hủy"
          ok-text="Đồng ý"
          title="Bạn có chắc muốn xóa sản phẩm này không?"
          @confirm="onDelete"
        >
          <a-button :loading="loadingDelete" danger type="primary">Xóa sản phẩm</a-button>
        </a-popconfirm>
        <a-button v-if="detailProduct?.status === 0" :loading="loadingUpdate" type="primary" @click="onChangeStatus(1)">
          Hoạt động
        </a-button>
        <a-button
          v-if="detailProduct?.status === 1"
          :loading="loadingUpdate"
          style="background-color: gray; outline: gray; border: gray"
          type="primary"
          @click="onChangeStatus(0)"
        >
          Ngưng hoạt động
        </a-button>
        <a-button type="primary" @click="onUpdate"> Sửa sản phẩm </a-button>
      </template>
    </a-page-header>

    <div class="box-system" style="margin-top: 15px">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="Thông tin sản phẩm">
          <a-row>
            <a-col :style="{ paddingRight: 0 }" span="24">
              <a-card :loading="loading" title="Thông tin chung">
                <a-descriptions>
                  <a-descriptions-item label="Mã sản phẩm">{{ detailProduct?.code }}</a-descriptions-item>
                  <a-descriptions-item label="Tên sản phẩm">{{ detailProduct?.name }}</a-descriptions-item>
                  <a-descriptions-item label="Danh mục">
                    {{
                      detailProduct?.category.name +
                      `${detailProduct?.childCategory ? "/ " : ""}` +
                      (detailProduct?.childCategory ? detailProduct?.childCategory.name : "")
                    }}
                  </a-descriptions-item>
                  <a-descriptions-item v-if="detailProduct?.price" label="Giá niêm yết">
                    {{ Utils.formatNumber(detailProduct?.price) }} đ
                  </a-descriptions-item>
                  <a-descriptions-item label="Phần trăm giảm">
                    {{ detailProduct?.discountPercent }} %
                  </a-descriptions-item>
                  <a-descriptions-item v-if="detailProduct?.price" label="Giá bán">
                    {{
                      Utils.formatNumber(
                        detailProduct?.price - (detailProduct?.price / 100) * detailProduct?.discountPercent
                      )
                    }}
                    đ
                  </a-descriptions-item>
                  <a-descriptions-item label="Trạng thái">
                    <StatusTag :status="detailProduct?.status" />
                  </a-descriptions-item>
                  <a-descriptions-item label="Trạng thái hàng">
                    <OutOfStock :outOfStock="detailProduct?.outOfStock" />
                  </a-descriptions-item>
                  <a-descriptions-item label="Trạng thái sản phẩm">
                    <ProductStatusTag :productStatus="detailProduct?.productStatus" />
                  </a-descriptions-item>
                </a-descriptions>
                <div v-if="detailProduct?.description" style="position: relative">
                  <QuillEditor :content="detailProduct?.description" contentType="html" style="min-height: 250px" />
                  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0"></div>
                </div>
              </a-card>
            </a-col>

            <a-col span="12">
              <a-card :loading="loading" title="Hình ảnh sản phẩm">
                <a-space size="small">
                  <div v-for="image in detailProduct?.imageUrl">
                    <a-image v-if="image.type === Constants.PRODUCT_MEDIA_TYPE.IMAGE" :src="image.url" :width="120" />
                  </div>
                </a-space>
              </a-card>
            </a-col>
            <a-col span="12">
              <a-card :loading="loading" title="Video sản phẩm">
                <div v-for="video in detailProduct?.imageUrl">
                  <video v-if="video.type === Constants.PRODUCT_MEDIA_TYPE.VIDEO" controls height="300" width="400">
                    <source :src="video.url" />
                    Your browser does not support HTML video.
                  </video>
                </div>
              </a-card>
            </a-col>

            <a-col v-if="detailProduct?.product.length > 0" :style="{ paddingRight: 0 }" span="24">
              <a-card title="Thông tin phân loại sản phẩm">
                <a-table :columns="columnsPrice" :data-source="dataTablePrice" :loading="loading" bordered size="small">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'price'">
                      <div style="font-family: OpenSans-Semibold; color: red">
                        {{ Utils.formatNumber(record.price) }} đ
                      </div>
                    </template>

                    <template v-if="column.key === 'isNotSale'">
                      <a-checkbox v-model:checked="record.isNotSale" disabled />
                    </template>
                  </template>
                </a-table>
              </a-card>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" force-render tab="Thông tin bán hàng">
          <a-row>
            <a-col span="12">
              <a-card title="Khách hàng mua sản phẩm">
                <a-table
                  :columns="columnsCustomer"
                  :data-source="dataTable"
                  :loading="loading"
                  :pagination="Utils.getConfigPagination(payload?.page, total)"
                  bordered
                  size="small"
                  @change="handlePaginationChange"
                >
                </a-table>
              </a-card>
            </a-col>
            <a-col span="12">
              <a-card title="Danh sách đơn hàng">
                <a-table
                  :columns="columnsOrder"
                  :data-source="dataTable"
                  :loading="loading"
                  :pagination="Utils.getConfigPagination(payload?.page, total)"
                  bordered
                  size="small"
                  @change="handlePaginationChange"
                >
                </a-table>
              </a-card>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, ref } from "vue";
import Utils from "@/commons/Utils";
import type { IColumn } from "@/commons/Interfaces";
import { useDelete, useDetailProduct, useUpdate } from "@/services";
import router from "@/router";
import StatusTag from "@/components/StatusTag.vue";
import OutOfStock from "@/components/product/OutOfStock.vue";
import ProductStatusTag from "@/components/product/ProductStatusTag.vue";
import { Constants } from "@/commons";

const columnsCustomer: IColumn[] = [
  { title: "STT", dataIndex: "index", key: "index", width: 60, fixed: true },
  { title: "Tên khách hàng", dataIndex: "code", key: "code", fixed: true, width: 200 },
  {
    title: "Số lượng",
    dataIndex: "receiver",
    width: 120,
    key: "receiver",
  },
  { title: "Doanh thu", dataIndex: "countProduct", key: "countProduct", width: 120 },
];

const columnsOrder: IColumn[] = [
  { title: "STT", dataIndex: "index", key: "index", width: 60, fixed: true },
  { title: "Mã đơn", dataIndex: "code", key: "code", fixed: true, width: 120 },
  {
    title: "Tên khách hàng",
    dataIndex: "receiver",
    width: 200,
    key: "receiver",
  },
  { title: "Số lượng", dataIndex: "countProduct", key: "countProduct", width: 120 },
  { title: "Tổng cộng", dataIndex: "countProduct", key: "countProduct", width: 120 },
];

export default {
  name: "ProductDetail",
  components: { ProductStatusTag, OutOfStock, StatusTag },
  computed: {
    Utils() {
      return Utils;
    },
  },
  setup() {
    const { loading, detailProduct, getDetailProduct } = useDetailProduct();
    const id: any = router.currentRoute.value.params.id;
    const { loadingDelete, deleteRecord } = useDelete();
    const { loadingUpdate, updateRecord } = useUpdate();

    const columnsPrice = computed((): IColumn[] => {
      const columns: IColumn[] = [{ title: "STT", dataIndex: "index", key: "index", width: 60 }];
      if (detailProduct.value?.productClass) {
        detailProduct.value.productClass.forEach((value) => {
          if (value.type === Constants.PRODUCT_TYPE_CLASS.FIRST_CLASS_NAME) {
            columns.push({ title: value.name, dataIndex: "firstClass", key: "firstClass" });
          }

          if (value.type === Constants.PRODUCT_TYPE_CLASS.SECOND_CLASS_NAME) {
            columns.push({ title: value.name, dataIndex: "secondClass", key: "secondClass" });
          }
        });

        columns.push({ title: "Giá niêm yết", dataIndex: "price", key: "price", width: 220 });
        columns.push({ title: "Giá bán", dataIndex: "salesPrice", key: "salesPrice", width: 220 });
        columns.push({ title: "Ngừng bán", dataIndex: "isNotSale", key: "isNotSale", width: 220 });

        return columns;
      }

      return columns;
    });

    const dataTablePrice = computed(() => {
      if (detailProduct.value?.product) {
        return detailProduct.value?.product.map((value, index) => {
          return {
            index: index + 1,
            firstClass: value.firstClassName,
            secondClass: value.secondClassName,
            price: value.price,
            salesPrice:
              Utils.formatNumber(value.price - (value.price / 100) * detailProduct.value!.discountPercent) + " đ",
            isNotSale: value.isNotSale,
          };
        });
      }
      return [];
    });

    const onDelete = async () => {
      try {
        await deleteRecord(`/product`, "Xóa sản phẩm thành công", [Number(id)]);

        router.push("/product?page=1");
      } catch (e) {
        console.error(e);
      }
    };

    const onChangeStatus = async (status: number) => {
      try {
        await updateRecord(`/product/${id}`, { status: status }, "Thay đổi trạng thái thành công");

        getDetailProduct(id);
      } catch (e) {
        console.error(e);
      }
    };

    const onUpdate = () => {
      router.push(`/product/update/${id}`);
    };

    onMounted(() => {
      getDetailProduct(id);
    });

    return {
      activeKey: ref("1"),
      columnsCustomer,
      columnsOrder,
      loading,
      detailProduct,
      loadingDelete,
      loadingUpdate,
      columnsPrice,
      dataTablePrice,
      Constants,
      onUpdate,
      onChangeStatus,
      onDelete,
    };
  },
};
</script>

<style lang="scss">
.product-detail {
  .ant-row {
    .ant-col {
      padding-right: 16px;
      padding-bottom: 16px;

      &:last-child {
        padding-right: 0px;
        padding-bottom: 0px;
      }
    }
  }

  .ant-card-head {
    .ant-card-head-wrapper {
      .ant-card-head-title {
        font-family: OpenSans-Semibold;
        color: red;
        font-style: italic;
      }
    }
  }

  .ant-descriptions-item-content {
    font-family: OpenSans-Semibold;
    color: rgba(0, 0, 0, 0.7);
  }
}
</style>
