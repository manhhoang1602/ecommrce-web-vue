<template>
  <a-page-header title="Sản Phẩm">
    <template #extra>
      <a-button danger type="primary" @click="onDelete">Xóa</a-button>
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
            {{ record.code }}
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
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import type { IBasePayload, IColumn, IDataEventPagination, IItemDataTableCategory } from "@/commons/Interfaces";
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import router from "@/router";
import { Constants } from "@/commons";
import { useDelete, useListProduct } from "@/services";
import ProductStatusTag from "@/components/product/ProductStatusTag.vue";
import OutOfStock from "@/components/product/OutOfStock.vue";
import type { IItemTableProduct } from "@/commons/interface/Product.interface";
import StatusTag from "@/components/StatusTag.vue";
import CategorySelect from "@/components/category/CategorySelect.vue";
import ProductStatusSelect from "@/components/product/ProductStatusSelect.vue";
import OutOfStockSelect from "@/components/product/OutOfStockSelect.vue";
import StatusSelect from "@/components/StatusSelect.vue";
import Notification from "@/components/notification/Notification";
import InputSearch from "@/components/InputSearch.vue";
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
  { title: "Đã bán", dataIndex: "", width: 150, key: "" },
  { title: "Doanh số", dataIndex: "", width: 150, key: "" },
];

export default defineComponent({
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
      getCheckboxProps: (record: DataType) => ({
        disabled: record.name === "Disabled User", // Column configuration not to be checked
        name: record.name,
      }),
    };

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
      onNavigateAddScreen,
      onExport,
      onPaginationChange,
      onSelectChange,
      onDelete,
    };
  },
});
</script>