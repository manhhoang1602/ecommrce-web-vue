<template>
  <a-page-header title="Sản Phẩm">
    <template #extra>
      <a-popconfirm
        cancel-text="Hủy"
        ok-text="Đồng ý"
        title="Bạn có chắc muốn xóa sản phẩm này không?"
        @confirm="onDelete"
      >
        <a-button :loading="loadingDelete" danger type="primary">Xóa</a-button>
      </a-popconfirm>
      <a-button type="primary" @click="onExport">Export</a-button>
      <a-button type="primary">Sửa</a-button>
      <a-button type="primary" @click="onNavigateAddScreen">Thêm</a-button>
    </template>
  </a-page-header>

  <div class="search-box">
    <a-row>
      <a-col :span="4">
        <InputSearch placeholder="Tên hoặc mã sản phẩm" @onChange="(value) => (payload.search = value)" />
      </a-col>

      <a-col :span="4">
        <CategorySelect v-model="payload.category" placeholder="Danh mục sản phẩm" />
      </a-col>

      <a-col :span="4">
        <OutOfStockSelect v-model="payload.outOfStock" placeholder="Trạng thái hàng" />
      </a-col>

      <a-col :span="4">
        <ProductStatusSelect v-model="payload.productStatus" placeholder="Trạng thái sản phẩm" />
      </a-col>

      <a-col :span="4">
        <StatusSelect v-model="payload.status" placeholder="Trạng thái" />
      </a-col>

      <a-col :span="4">
        <div class="total-row">Kết quả lọc {{ total }}</div>
      </a-col>
    </a-row>
  </div>

  <div class="table-box">
    <a-table
      :columns="columns"
      :customRow="
        (record: IItemTableProduct) => {
          return {
            onDblclick: () => {
              handleOnRowClick(record);
            },
          };
        }
      "
      :data-source="data"
      :loading="loading"
      :pagination="Utils.getConfigPagination(payload.page, total)"
      :row-selection="rowSelection"
      :scroll="{ x: 700 }"
      bordered
      @change="onPaginationChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'code'">
          <div style="font-family: OpenSans-Semibold; color: #2148c0">
            {{ record.code }}
          </div>
        </template>

        <template v-if="column.key === 'name'">
          <div style="font-family: OpenSans-Semibold; color: gray">
            {{ record.name }}
          </div>
        </template>

        <template v-if="column.key === 'image'">
          <a-image :src="record.image" alt="image-pro" height="60px" />
        </template>

        <template v-if="column.key === 'productStatus'">
          <ProductStatusTag :productStatus="record.productStatus" />
        </template>

        <template v-if="column.key === 'status'">
          <StatusTag :status="record.status" />
        </template>

        <template v-if="column.key === 'outOfStock'">
          <OutOfStock :outOfStock="record.outOfStock" />
        </template>

        <template v-if="column.key === 'totalSalesProduct'">
          {{
            usePricePerOrderByOrderStatus(
              getOrderByProduct(record),
              Constants.ORDER_STATUS.COMPLETE
            ).totalProduct || "0"
          }}
        </template>

        <template v-if="column.key === 'revenue'">
          {{
            usePricePerOrderByOrderStatus(
              getOrderByProduct(record),
              Constants.ORDER_STATUS.COMPLETE
            ).totalPriceFormat || "0 đ"

          }}
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import type { IBasePayload, IColumn, IDataEventPagination, IItemDataTableCategory, IResItemOrder, IResProductInOrder } from "@/commons/interface";
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import router from "@/router";
import { Constants } from "@/commons";
import { useDelete, useListProduct, usePricePerOrderByOrderStatus } from "@/services";
import ProductStatusTag from "@/components/product/ProductStatusTag.vue";
import OutOfStock from "@/components/product/OutOfStock.vue";
import type { IItemTableProduct } from "@/commons/interface/Product.interface";
import StatusTag from "@/components/base/StatusTag.vue";
import CategorySelect from "@/components/category/CategorySelect.vue";
import ProductStatusSelect from "@/components/product/ProductStatusSelect.vue";
import OutOfStockSelect from "@/components/product/OutOfStockSelect.vue";
import StatusSelect from "@/components/base/StatusSelect.vue";
import Notification from "@/components/notification/Notification";
import InputSearch from "@/components/base/InputSearch.vue";
import Utils from "@/commons/Utils";
import type { TableProps } from "ant-design-vue";

export interface IPayloadProduct extends IBasePayload {
  category?: any;
  parentId?: number;
  childId?: number;
  outOfStock?: number;
  productStatus?: number;
}

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: IColumn[] = [
  { title: "STT", dataIndex: "index", key: "index", width: 60, fixed: true },
  {
    title: "Ảnh",
    dataIndex: "image",
    key: "image",
    width: 100,
    fixed: true,
  },
  { title: "Mã SP", dataIndex: "code", key: "code", fixed: true, width: 150 },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    key: "name",
    width: 300,
    fixed: true,
  },
  {
    title: "Danh mục",
    dataIndex: "categoryName",
    key: "categoryName",
    width: 250,
  },
  {
    title: "Trạng thái hàng",
    dataIndex: "outOfStock",
    width: 150,
    key: "outOfStock",
  },
  {
    title: "Trạng thái sản phẩm",
    dataIndex: "productStatus",
    width: 150,
    key: "productStatus",
  },
  {
    title: "Trạng thái",
    key: "status",
    dataIndex: "status",
    width: 150,
  },
  { title: "Đã bán", dataIndex: "totalSalesProduct", width: 150, key: "totalSalesProduct" },
  { title: "Doanh số", dataIndex: "revenue", width: 150, key: "revenue" },
];

export default defineComponent({
  methods: { usePricePerOrderByOrderStatus },
  components: {
    InputSearch,
    StatusSelect,
    OutOfStockSelect,
    ProductStatusSelect,
    CategorySelect,
    OutOfStock,
    ProductStatusTag,
    StatusTag,
  },
  computed: {
    Utils() {
      return Utils;
    },
    Constants() {
      return Constants;
    },
  },
  setup() {
    const data = ref<IItemTableProduct[]>([]);
    const payload = reactive<IPayloadProduct>({
      page: Constants.PAYLOAD.PAGE,
      status: undefined,
      search: undefined,
      category: undefined,
      childId: undefined,
      parentId: undefined,
      outOfStock: undefined,
      productStatus: undefined,
    });
    const selectedRowKeys = ref<string[]>([]);
    const onNavigateAddScreen = () => {
      router.push(`/product/add`);
    };

    const { loading, total, listProduct, getListProduct } = useListProduct();
    const { loadingDelete, deleteRecord } = useDelete();

    const standardizePayload = () => {
      if (payload.category) {
        const { childId, parentId } = Utils.getIdCategorySelectComponent(payload.category);

        const standardPayload = { ...payload };
        standardPayload.childId = childId;
        standardPayload.parentId = parentId;
        delete standardPayload.category;

        return standardPayload;
      } else {
        return payload;
      }
    };

    const loadTable = async () => {
      const result = await getListProduct(standardizePayload());
      data.value = result;
    };

    const onPaginationChange = (data: IDataEventPagination) => {
      payload.page = data.current;
    };

    const onSelectChange = (data: IItemDataTableCategory) => {};

    const onExport = () => {
      Notification.Info(undefined, "Chức năng này đang phát triển sẽ hoàn thiện trong thời gian tới");
    };

    const onDelete = async () => {
      try {
        await deleteRecord(
          `/product`,
          "Xóa sản phẩm thành công",
          selectedRowKeys.value.map((value) => Number(value))
        );

        loadTable();
      } catch (e) {
        console.error(e);
      }
    };

    const rowSelection: TableProps["rowSelection"] = {
      onChange: (_selectedRowKeys: string[]) => {
        selectedRowKeys.value = _selectedRowKeys;
      },
    };

    const handleOnRowClick = (record: IItemTableProduct) => {
      router.push(`/product/detail/${record.id}`);
    };

    const getOrderByProduct = (product: IItemTableProduct): IResItemOrder => {
      const listProduct = product.orderAndProduct.reduce((result: any[], order: any) => {
        if(order.order.orderStatus !== Constants.ORDER_STATUS.CANCEL) {
          result.push({...order, orderStatus: order.order.orderStatus})
          return result
        }
        return result
      }, [])

      return {
        listProduct: listProduct,
      } as any
    }

    onMounted(() => {
      loadTable();
    });

    watch(
      payload,
      () => {
        loadTable();
      },
      { deep: true }
    );

    return {
      columns,
      listProduct,
      loading,
      total,
      data,
      payload,
      rowSelection,
      loadingDelete,
      getOrderByProduct,
      handleOnRowClick,
      onNavigateAddScreen,
      onExport,
      onPaginationChange,
      onSelectChange,
      onDelete,
    };
  },
});
</script>
