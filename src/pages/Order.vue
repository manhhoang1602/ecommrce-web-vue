<template>
  <div class="order-page">
    <a-page-header title="Đơn Hàng">
      <template #extra>
        <a-button :loading="loadingCancel" danger type="primary" @click="onShowModal">
          <template #icon><i class="fas fa-ban"></i></template>
          Từ chối
        </a-button>
        <a-button :loading="loadingUnconnected" danger type="primary" @click="onUnconnected">
          <template #icon><i class="fas fa-ban"></i></template>
          Không liên hệ được với khách
        </a-button>
        <a-button :loading="loadingConfirm" type="primary" @click="onConfirm">
          <template #icon><i class="far fa-check"></i></template>
          Xác nhận
        </a-button>
        <a-button :loading="loadingDelivery" type="primary" @click="onDelivery">
          <i class="fas fa-truck"></i>
          Đang giao
        </a-button>
        <a-button :loading="loadingComplete" style="margin-right: 30px" type="primary" @click="onComplete">
          <template #icon><i class="far fa-check-double"></i></template>
          Hoàn thành
        </a-button>
        <a-button danger type="primary" @click="onExport">Export</a-button>
      </template>
      <a-modal
        v-model:visible="visible"
        :confirm-loading="loadingCancel"
        :destroy-on-close="true"
        title="Lý do hủy đơn hàng"
        @ok="onCancel"
      >
        <a-form
          ref="formRef"
          :label-col="{ span: 8 }"
          :model="formState"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          name="formCancel"
          validate-trigger="submit"
        >
          <a-form-item
            :rules="[{ required: true, message: 'Vui lòng nhập Lý do hủy đơn' }]"
            label="Lý do hủy đơn hàng"
            name="reasonCancel"
          >
            <a-input v-model:value="formState.reasonCancel" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-page-header>

    <div class="search-box">
      <a-row>
        <a-col :span="6">
          <InputSearch placeholder="Mã đơn, tên khách, SĐT khách" @onChange="(value) => (payload.search = value)" />
        </a-col>
        <a-col :span="6">
          <OrderStatusSelect v-model="payload.orderStatus" placeholder="Trạng thái đơn hàng" />
        </a-col>
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
        :customRow="
          (record) => {
            return {
              onClick: () => {
                handleOnRowClick(record);
              },
            };
          }
        "
        :data-source="dataTable"
        :loading="loading"
        :pagination="Utils.getConfigPagination(payload.page, total)"
        :row-selection="rowSelection"
        :scroll="{ x: 700 }"
        bordered
        @change="handlePaginationChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'orderStatus'">
            <OrderStatusTag :orderStatus="record.orderStatus" />
          </template>

          <template v-if="column.key === 'receiver'">
            <div>
              <div style="font-family: OpenSans-Semibold; font-size: 13px; color: #2148c0">{{ record.receiver }}</div>
              <div style="color: gray; font-size: 13px">{{ record.receivePhone }}</div>
            </div>
          </template>

          <template v-if="column.key === 'user'">
            <div>
              <div style="font-family: OpenSans-Semibold; font-size: 13px; color: #2148c0">
                {{ record.user.name || "___" }}
              </div>
              <div style="color: gray; font-size: 13px">{{ record.user.phone }}</div>
            </div>
          </template>

          <template v-if="column.key === 'totalPrice'">
            <div>
              <span style="font-family: OpenSans-Semibold; color: red">
                {{ record.totalPrice }}
              </span>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import OrderStatusSelect from "@/components/order/OrderStatusSelect.vue";
import type { IColumn, IDataEventPagination, IItemDataTableOrder, IPayloadOrder } from "@/commons/Interfaces";
import Utils from "@/commons/Utils";
import { onMounted, reactive, ref, watch } from "vue";
import { Constants } from "@/commons";
import { useListOrder, useUpdate } from "@/services";
import dayjs from "dayjs";
import InputSearch from "@/components/InputSearch.vue";
import OrderStatusTag from "@/components/order/OrderStausTag.vue";
import Notification from "@/components/notification/Notification";
import type { FormInstance, TableProps } from "ant-design-vue";
import useModal from "@/services/Modal";
import router from "@/router";

const columns: IColumn[] = [
  { title: "STT", dataIndex: "index", key: "index", width: 60, fixed: true },
  { title: "Mã đơn", dataIndex: "code", key: "code", fixed: true, width: 120 },
  { title: "Khách hàng", dataIndex: "user", key: "user", width: 200 },
  {
    title: "Người nhận",
    dataIndex: "receiver",
    width: 200,
    key: "receiver",
  },
  { title: "Số SP", dataIndex: "countProduct", key: "countProduct", width: 120 },
  { title: "Tổng tiền", dataIndex: "totalPrice", key: "totalPrice", width: 150 },
  { title: "Trạng thái đơn hàng", dataIndex: "orderStatus", key: "orderStatus", width: 150 },
  { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt", width: 170 },
];

export default {
  methods: {
    router() {
      return router;
    },
  },
  computed: {
    Utils() {
      return Utils;
    },
  },
  components: { OrderStatusTag, InputSearch, OrderStatusSelect },
  setup() {
    const dataTable = ref<IItemDataTableOrder[]>([]);
    const payload = reactive<IPayloadOrder>({
      search: undefined,
      page: Constants.PAYLOAD.PAGE,
      endDate: undefined,
      startDate: undefined,
      orderStatus: undefined,
    });
    const selectedRows = ref<IItemDataTableOrder[]>([]);
    const formRef = ref<FormInstance>();
    let formState = reactive<{ reasonCancel: string }>({ reasonCancel: "" });

    const { loading, total, getListOrder } = useListOrder();
    const { showModal, closeModal, visible } = useModal();

    const loadTable = async () => {
      const result = await getListOrder(payload);
      if (result) {
        dataTable.value = result;
      }
    };

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

    const rowSelection: TableProps["rowSelection"] = {
      onChange: (_selectedRowKeys: string[], _selectedRows: IItemDataTableOrder[]) => {
        selectedRows.value = _selectedRows as any;
      },
    };

    const onShowModal = () => {
      formRef.value?.resetFields();
      formState.reasonCancel = "";
      showModal();
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

    const { loadingUpdate: loadingCancel, updateRecord: cancelOrder } = useUpdate();
    const { loadingUpdate: loadingConfirm, updateRecord: confirmOrder } = useUpdate();
    const { loadingUpdate: loadingDelivery, updateRecord: deliveryOrder } = useUpdate();
    const { loadingUpdate: loadingComplete, updateRecord: completeOrder } = useUpdate();
    const { loadingUpdate: loadingUnconnected, updateRecord: unconnectedOrder } = useUpdate();

    const path: string = `/order`;

    const validateSelected = () => {
      if (selectedRows.value.length > 0) {
        return true;
      }
      Notification.Error(undefined, "Vui lòng chọn đơn hàng");
      return false;
    };

    const getIds = (): number[] => {
      return selectedRows.value.map((value) => {
        console.log(value);
        return value.id;
      });
    };

    const onExport = () => {
      Notification.Info(undefined, "Chức năng này đang xây dựng.");
    };

    const onCancel = async () => {
      const validateOnCancel = (): boolean => {
        let result: boolean = true;
        selectedRows.value.forEach((value) => {
          if (value.orderStatus === Constants.ORDER_STATUS.COMPLETE) {
            result = false;
            return false;
          }
        });

        return result;
      };

      if (!validateSelected()) {
        return false;
      }

      if (validateOnCancel()) {
        await formRef.value?.validateFields();

        const result = await cancelOrder(
          path,
          { orderStatus: Constants.ORDER_STATUS.CANCEL, reasonCancel: formState.reasonCancel, ids: getIds() },
          "Xác nhận hủy đơn hàng thành công"
        );
        if (result) {
          loadTable();
          closeModal();
        }
      } else {
        Notification.Error(
          undefined,
          "Vui lòng kiểm tra lai danh sách đơn hàng. Những đơn đã hoàn thành không thể hủy"
        );
      }
    };

    const onConfirm = async () => {
      const validateOnConfirm = (): boolean => {
        let result: boolean = true;
        selectedRows.value.forEach((value) => {
          if (value.orderStatus !== Constants.ORDER_STATUS.PENDING) {
            result = false;
            return false;
          }
        });

        return result;
      };

      if (!validateSelected()) {
        return false;
      }

      if (validateOnConfirm()) {
        const result = await confirmOrder(
          path,
          { orderStatus: Constants.ORDER_STATUS.CONFIRM, ids: getIds() },
          "Đã xác nhận đơn hàng"
        );
        if (result) {
          loadTable();
        }
      } else {
        Notification.Error(
          undefined,
          "Vui lòng kiểm tra lai danh sách đơn hàng. chỉ có những đơn chờ xác nhận bạn mới có thể xác nhận"
        );
      }
    };

    const onDelivery = async () => {
      const validateOnDelivering = (): boolean => {
        let result: boolean = true;
        selectedRows.value.forEach((value) => {
          if (value.orderStatus !== Constants.ORDER_STATUS.CONFIRM) {
            result = false;
            return false;
          }
        });

        return result;
      };

      if (!validateSelected()) {
        return false;
      }

      if (validateOnDelivering()) {
        const result = await deliveryOrder(
          path,
          { orderStatus: Constants.ORDER_STATUS.DELIVERING, ids: getIds() },
          "Đơn hàng đã được giao"
        );

        if (result) {
          loadTable();
        }
      } else {
        Notification.Error(
          undefined,
          "Vui lòng kiểm tra lai danh sách đơn hàng. chỉ có những đơn đã xác nhận bạn mới có thể chuyển trạng thái vận đang giao"
        );
      }
    };

    const onComplete = async () => {
      const validateOncomplete = (): boolean => {
        let result: boolean = true;
        selectedRows.value.forEach((value) => {
          if (value.orderStatus === Constants.ORDER_STATUS.CANCEL) {
            result = false;
            return false;
          }
        });

        return result;
      };

      if (!validateSelected()) {
        return false;
      }

      if (validateOncomplete()) {
        const result = await completeOrder(
          path,
          { orderStatus: Constants.ORDER_STATUS.COMPLETE, ids: getIds() },
          "Chúc mừng bạn đơn hàng đã được hoàn thành"
        );

        if (result) {
          loadTable();
        }
      } else {
        Notification.Error(
          undefined,
          "Vui lòng kiểm tra lai danh sách đơn hàng. Đơn hàng hủy không chuyển trạng thái hoàn thành được"
        );
      }
    };

    const onUnconnected = async () => {
      const validateOnUnconnected = (): boolean => {
        let result: boolean = true;
        selectedRows.value.forEach((value) => {
          if (
            value.orderStatus === Constants.ORDER_STATUS.COMPLETE ||
            value.orderStatus === Constants.ORDER_STATUS.CANCEL
          ) {
            result = false;
            return false;
          }
        });

        return result;
      };

      if (!validateSelected()) {
        return false;
      }

      if (validateOnUnconnected()) {
        const result = await unconnectedOrder(
          path,
          { orderStatus: Constants.ORDER_STATUS.UNCONNECTED, ids: getIds() },
          "Đơn hàng chuyển trạng thái không liên lạc được với khách"
        );

        if (result) {
          loadTable();
        }
      } else {
        Notification.Error(
          undefined,
          "Vui lòng kiểm tra lai danh sách đơn hàng. Đơn hàng đã hoàn thành và đơn hàng đã hủy không chuyển trạng thái được"
        );
      }
    };

    const handleOnRowClick = (record: IItemDataTableOrder) => {
      router.push(`/order/detail/${record.id}`);
    };

    return {
      columns,
      dataTable,
      loading,
      payload,
      total,
      rowSelection,
      loadingCancel,
      loadingConfirm,
      loadingDelivery,
      loadingComplete,
      loadingUnconnected,
      visible,
      formState,
      formRef,
      handleOnRowClick,
      onShowModal,
      onUnconnected,
      onComplete,
      onDelivery,
      onConfirm,
      onExport,
      onCancel,
      loadTable,
      onFilterTime,
      handlePaginationChange,
    };
  },
};
</script>

<style lang="scss">
.order-page {
  i {
    color: white;
    margin-right: 5px;
  }
}
</style>
