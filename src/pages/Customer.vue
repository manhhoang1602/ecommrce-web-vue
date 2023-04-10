<template>
  <div class="category-page">
    <a-page-header title="Khách hàng">
      <template #extra>
        <a-button type="primary" @click="onExport">Export</a-button>
      </template>
    </a-page-header>

    <div class="search-box">
      <a-row>
        <a-col :span="6">
          <InputSearch placeholder="Tên hoặc SĐT" @onChange="(value) => (payload.search = value)" />
        </a-col>
        <a-col :span="6"> <ProvincesSelect v-model:value="payload.province" placeholder="Tỉnh/ Thành phố" /> </a-col>
        <a-col :span="6">
          <a-range-picker :format="[`DD/MM/YYYY`, `DD/MM/YYYY`]" @change="onFilterTime" />
        </a-col>
        <a-col :span="6">
          <div class="total-row">Kết quả lọc {{ total }}</div>
        </a-col>
      </a-row>
    </div>

    <div class="table-box">
      <a-table
        :columns="columns"
        :data-source="dataTable"
        :loading="loading"
        :pagination="Utils.getConfigPagination(payload.page, total)"
        :scroll="{ x: 700 }"
        bordered
        @change="handlePaginationChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'province'">
            {{ record.province ? record.province : "_ _ _" }}
          </template>

          <template v-if="column.key === 'name'">
            {{ record.name ? record.name : "_ _ _" }}
          </template>

          <templates v-if="column.key === 'salesPerOrder'">
            <div style="font-family: OpenSans-Semibold; color: red">
              {{ Utils.formatNumber(record.salesPerOrder) }} đ
            </div>
          </templates>

          <template v-if="column.key === 'salesPerOrderComplete'">
            <div style="font-family: OpenSans-Semibold; color: red">
              {{ Utils.formatNumber(record.salesPerOrderComplete) }} đ
            </div>
          </template>
        </template>

        <!--        <template #expandedRowRender="{ record }">-->
        <!--          <ListBtnAction-->
        <!--            :loadingActive="loadingStatus"-->
        <!--            :loadingDelete="loadingDelete"-->
        <!--            :record="record"-->
        <!--            @onChangeStatus="onChangeStatusCategory"-->
        <!--            @onDelete="onDeleteCategory(record.id)"-->
        <!--            @onEdit="onShowModalCU('update', record)"-->
        <!--          />-->
        <!--        </template>-->
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Constants } from "@/commons";
import { computed, defineComponent, onMounted, reactive, watch } from "vue";
import type {
  IColumn,
  IDataEventPagination,
  IItemTableCustomer,
  IPayloadCustomers,
  IResUser,
} from "@/commons/interface";
import dayjs from "dayjs";
import Utils from "@/commons/Utils";
import ProvincesSelect from "@/components/customer/ProvincesSelect.vue";
import { useListCustomer, usePricePerOrderByOrderStatus } from "@/services";
import moment from "moment";
import Notification from "@/components/notification/Notification";
import InputSearch from "@/components/base/InputSearch.vue";

const columns: IColumn[] = [
  { title: "STT", dataIndex: "index", key: "index", width: 60, fixed: true },
  { title: "Tên khách hàng", dataIndex: "name", key: "name", fixed: true, width: 200 },
  { title: "Số điện thoại", dataIndex: "phone", key: "phone", width: 200 },
  {
    title: "Tỉnh thành phố",
    dataIndex: "province",
    width: 150,
    key: "province",
  },
  { title: "Doanh số trên đơn hàng", dataIndex: "salesPerOrder", key: "salesPerOrder", width: 200 },
  { title: "Doanh số thực tế", dataIndex: "salesPerOrderComplete", key: "salesPerOrderComplete", width: 150 },
  { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt", width: 200 },
];

export default defineComponent({
  components: { InputSearch, ProvincesSelect },
  computed: {
    Utils() {
      return Utils;
    },
    Constants() {
      return Constants;
    },
  },
  setup() {
    const payload = reactive<IPayloadCustomers>({
      search: undefined,
      page: Constants.PAYLOAD.PAGE,
      endDate: undefined,
      startDate: undefined,
    });

    const { loading, total, listCustomer, getListCustomer } = useListCustomer();

    const dataTable = computed((): IItemTableCustomer[] => {
      const getSales = (customer: IResUser, type: "perOrderSuccess" | "perAllOrder"): number => {
        return customer.order.reduce((previousValue, currentValue) => {
          const { totalPrice } = usePricePerOrderByOrderStatus(currentValue);

          if (type === "perAllOrder") {
            return previousValue + totalPrice;
          } else {
            if (currentValue.orderStatus === Constants.ORDER_STATUS.COMPLETE) {
              return previousValue + totalPrice;
            } else {
              return previousValue;
            }
          }
        }, 0);
      };

      return listCustomer.value.map((value, index) => {
        return {
          ...value,
          index: Utils.getIndex(payload.page, index),
          key: value.id,
          salesPerOrder: getSales(value, "perAllOrder"),
          salesPerOrderComplete: getSales(value, "perOrderSuccess"),
          createdAt: moment(value.createdAt).format("DD/MM/YYYY "),
        };
      });
    });

    const onFilterTime = (dates: [any, any]) => {
      if (dates) {
        payload.startDate = dayjs(dates[0]).toISOString();
        payload.endDate = dayjs(dates[1]).toISOString();
      } else {
        payload.startDate = undefined;
        payload.endDate = undefined;
      }
    };

    const handlePaginationChange = (data: IDataEventPagination) => {
      payload.page = data.current;
    };

    const onExport = () => {
      Notification.Info(undefined, "Chức năng đăng phát triển");
    };

    onMounted(() => {
      getListCustomer(payload);
    });

    watch(
      payload,
      () => {
        getListCustomer(payload);
      },
      { deep: true }
    );

    return {
      columns,
      dataTable,
      payload,
      loading,
      total,
      onExport,
      onFilterTime,
      handlePaginationChange,
    };
  },
});
</script>

<style lang="scss"></style>
