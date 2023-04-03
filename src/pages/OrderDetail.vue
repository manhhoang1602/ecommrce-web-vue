<template>
  <div class="order-detail-page">
    <a-page-header :title="`Đơn Hàng ${orderDetail?.code}`">
      <template #extra>
        <a-button v-if="validateOnCancel" :loading="loadingCancel" danger type="primary" @click="onShowModal">
          <template #icon><i class="fas fa-ban"></i></template>
          Từ chối
        </a-button>
        <a-button
          v-if="validateOnUnconnected"
          :loading="loadingUnconnected"
          danger
          type="primary"
          @click="onUnconnected"
        >
          <template #icon><i class="fas fa-ban"></i></template>
          Không liên hệ được với khách
        </a-button>
        <a-button v-if="validateOnConfirm" :loading="loadingConfirm" type="primary" @click="onConfirm">
          <template #icon><i class="far fa-check"></i></template>
          Xác nhận
        </a-button>
        <a-button v-if="validateOnDelivering" :loading="loadingDelivery" type="primary" @click="onDelivery">
          <i class="fas fa-truck"></i>
          Đang giao
        </a-button>
        <a-button v-if="validateOncomplete" :loading="loadingComplete" type="primary" @click="onComplete">
          <template #icon><i class="far fa-check-double"></i></template>
          Hoàn thành
        </a-button>
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

    <div style="margin-top: 15px">
      <a-row>
        <a-col span="8">
          <a-card :bordered="false" :loading="loading" title="Thông tin khách hàng">
            <template #extra><a href="#">Xem chi tiết</a></template>
            <p class="name">
              <i class="fas fa-user"></i>
              {{ orderDetail?.user.name || "___" }}
            </p>
            <p class="phone">
              <i class="fas fa-phone-alt"></i>
              {{ orderDetail?.user.phone }}
            </p>
            <p>
              <i class="fas fa-map-marker-alt"></i>
              {{ "___" }}
            </p>
          </a-card>
        </a-col>
        <a-col span="8">
          <a-card :bordered="false" :loading="loading" title="Thông tin nhận hàng">
            <p class="name">
              <i class="fas fa-user"></i>
              {{ orderDetail?.receiver }}
            </p>
            <p class="phone">
              <i class="fas fa-phone-alt"></i>
              {{ orderDetail?.receivePhone }}
            </p>
            <p>
              <i class="fas fa-map-marker-alt"></i>
              {{ "___" }}
            </p>
          </a-card>
        </a-col>
        <a-col span="8">
          <a-card :bordered="false" :loading="loading" title="Lịch sử đặt hàng">
            <a-timeline>
              <a-timeline-item color="green">Create a services site 2015-09-01</a-timeline-item>
              <a-timeline-item color="green">Create a services site 2015-09-01</a-timeline-item>
              <a-timeline-item color="red">
                <p>Solve initial network problems 1</p>
                <p>Solve initial network problems 2</p>
              </a-timeline-item>
            </a-timeline>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <div style="margin-top: 15px">
      <a-row>
        <a-col span="16">
          <a-card :bordered="false" :loading="loading" title="Danh sách sản phẩm">
            <a-table :columns="columns" :data-source="dataTable" bordered size="small"> </a-table>
          </a-card>
        </a-col>

        <a-col span="8">
          <a-card :bordered="false" :loading="loading" title="Thông tin đơn hàng">
            <template #extra
              ><a href="#"><OrderStatusTag :orderStatus="orderDetail?.orderStatus" /></a
            ></template>
            <p class="item-order-info">
              <span class="label">Mã đơn hàng</span>
              <span class="value">
                {{ orderDetail?.code }}
              </span>
            </p>
            <p class="item-order-info">
              <span class="label">Sản phẩm</span>
              <span class="value" style="color: red">
                {{ totalProduct }}
                <span>sản phẩm</span>
              </span>
            </p>
            <p class="item-order-info">
              <span class="label">Phí ship</span>
              <span class="value">
                {{ Utils.formatNumber(orderDetail?.shipPrice || 0) }}
                <span>đ</span>
              </span>
            </p>
            <p class="item-order-info">
              <span class="label">Mã giảm giá</span>
              <span class="value">
                {{ Utils.formatNumber(useDiscountVoucherPrice(orderDetail)) }}
                <span>đ</span>
              </span>
            </p>
            <p class="item-order-info">
              <span class="label">Tổng tiền</span>
              <span class="value" style="color: red">
                {{ Utils.formatNumber(totalPrice) }}
                đ
              </span>
            </p>
            <p v-if="orderDetail?.reasonCancel" class="item-order-info">
              <span class="label">Lý do hủy đơn</span>
              <span class="value">{{ orderDetail.reasonCancel }}</span>
            </p>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts">
import Utils from "@/commons/Utils";
import OrderStatusTag from "@/components/order/OrderStausTag.vue";
import { computed, onMounted, reactive, ref } from "vue";
import { Constants } from "@/commons";
import type { FormInstance } from "ant-design-vue";
import {
  useDataTablePriceOrderDetail,
  useDetailOrder,
  useDiscountVoucherPrice,
  useInfoPricePerOrder,
  useUpdate,
} from "@/services";
import useModal from "@/services/Modal";
import router from "@/router";
import type { IResItemOrder } from "@/commons/interface/Order.interface";
import type { IColumn } from "@/commons/Interfaces";

const columns: IColumn[] = [
  { title: "STT", dataIndex: "index", key: "index", width: 60, fixed: true },
  { title: "Tên sản phẩm", dataIndex: "name", key: "name", fixed: true },
  { title: "Số lượng", dataIndex: "total", key: "total" },
  { title: "Giá bán", dataIndex: "price", key: "price" },
  { title: "Thành tiền", dataIndex: "totalPrice", width: 120, key: "totalPrice" },
];

export default {
  methods: { useDiscountVoucherPrice },
  computed: {
    Utils() {
      return Utils;
    },
  },
  components: { OrderStatusTag },
  setup() {
    const formRef = ref<FormInstance>();
    let formState = reactive<{ reasonCancel: string }>({ reasonCancel: "" });
    const id: any = router.currentRoute.value.params.id;
    const getIds = (): number[] => {
      return [Number(id)];
    };

    const orderDetail = ref<IResItemOrder>();

    const { showModal, closeModal, visible } = useModal();
    const { loading, getDetailOrder } = useDetailOrder();

    const totalPrice = computed(() => useInfoPricePerOrder(orderDetail.value as IResItemOrder).totalPrice);
    const totalProduct = computed(() => useInfoPricePerOrder(orderDetail.value as IResItemOrder).totalProduct);

    const dataTable = computed(() => useDataTablePriceOrderDetail(orderDetail.value));

    const onShowModal = () => {
      formRef.value?.resetFields();
      formState.reasonCancel = "";
      showModal();
    };

    const onLoadDetail = async () => {
      const resOrder = await getDetailOrder(id as number);
      orderDetail.value = resOrder as any;
    };

    onMounted(() => {
      onLoadDetail();
    });

    const { loadingUpdate: loadingCancel, updateRecord: cancelOrder } = useUpdate();
    const { loadingUpdate: loadingConfirm, updateRecord: confirmOrder } = useUpdate();
    const { loadingUpdate: loadingDelivery, updateRecord: deliveryOrder } = useUpdate();
    const { loadingUpdate: loadingComplete, updateRecord: completeOrder } = useUpdate();
    const { loadingUpdate: loadingUnconnected, updateRecord: unconnectedOrder } = useUpdate();

    const path: string = `/order`;

    /*CANCEL*/
    const validateOnCancel = computed((): boolean => {
      let result: boolean = true;
      if (
        orderDetail.value?.orderStatus === Constants.ORDER_STATUS.COMPLETE ||
        orderDetail.value?.orderStatus === Constants.ORDER_STATUS.CANCEL
      ) {
        result = false;
      }
      return result;
    });

    const onCancel = async () => {
      await formRef.value?.validateFields();

      const result = await cancelOrder(
        path,
        { orderStatus: Constants.ORDER_STATUS.CANCEL, reasonCancel: formState.reasonCancel, ids: getIds() },
        "Xác nhận hủy đơn hàng thành công"
      );
      if (result) {
        onLoadDetail();
        closeModal();
      }
    };
    /*END CANCEL*/

    /*CONFIRM*/
    const validateOnConfirm = computed((): boolean => {
      let result: boolean = true;
      if (orderDetail.value?.orderStatus !== Constants.ORDER_STATUS.PENDING) {
        result = false;
      }

      return result;
    });

    const onConfirm = async () => {
      const result = await confirmOrder(
        path,
        { orderStatus: Constants.ORDER_STATUS.CONFIRM, ids: getIds() },
        "Đã xác nhận đơn hàng"
      );
      if (result) {
        onLoadDetail();
      }
    };
    /*END CONFIRM*/

    /*DELIVERY*/
    const validateOnDelivering = computed((): boolean => {
      let result: boolean = true;
      if (orderDetail.value?.orderStatus !== Constants.ORDER_STATUS.CONFIRM) {
        result = false;
      }

      return result;
    });

    const onDelivery = async () => {
      const result = await deliveryOrder(
        path,
        { orderStatus: Constants.ORDER_STATUS.DELIVERING, ids: getIds() },
        "Đơn hàng đã được giao"
      );

      if (result) {
        onLoadDetail();
      }
    };
    /*END DELIVERY*/

    /*ON COMPLETE*/
    const validateOncomplete = computed((): boolean => {
      let result: boolean = true;
      if (
        orderDetail.value?.orderStatus === Constants.ORDER_STATUS.CANCEL ||
        orderDetail.value?.orderStatus === Constants.ORDER_STATUS.COMPLETE
      ) {
        result = false;
      }

      return result;
    });

    const onComplete = async () => {
      const result = await completeOrder(
        path,
        { orderStatus: Constants.ORDER_STATUS.COMPLETE, ids: getIds() },
        "Chúc mừng bạn đơn hàng đã được hoàn thành"
      );

      if (result) {
        onLoadDetail();
      }
    };
    /*END COMPLETE*/

    /*UNCONNECTED*/
    const validateOnUnconnected = computed((): boolean => {
      let result: boolean = true;
      if (
        orderDetail.value?.orderStatus === Constants.ORDER_STATUS.COMPLETE ||
        orderDetail.value?.orderStatus === Constants.ORDER_STATUS.CANCEL
      ) {
        result = false;
      }

      return result;
    });

    const onUnconnected = async () => {
      const result = await unconnectedOrder(
        path,
        { orderStatus: Constants.ORDER_STATUS.UNCONNECTED, ids: getIds() },
        "Đơn hàng chuyển trạng thái không liên lạc được với khách"
      );

      if (result) {
        onLoadDetail();
      }
    };
    /*END_UNCONNECTED*/

    return {
      loadingCancel,
      loadingConfirm,
      loadingDelivery,
      loadingComplete,
      loadingUnconnected,
      visible,
      formState,
      formRef,
      loading,
      orderDetail,
      totalProduct,
      totalPrice,
      columns,
      dataTable,
      validateOnCancel,
      validateOncomplete,
      validateOnConfirm,
      validateOnUnconnected,
      validateOnDelivering,
      onShowModal,
      onUnconnected,
      onComplete,
      onDelivery,
      onConfirm,
      onCancel,
    };
  },
};
</script>

<style lang="scss">
.order-detail-page {
  .ant-btn {
    i {
      color: white;
      margin-right: 5px;
    }
  }

  .ant-row {
    .ant-col {
      padding-right: 16px;
      &:last-child {
        padding-right: 0px;
      }
    }
  }

  .ant-card-head {
    .ant-card-head-wrapper {
      .ant-card-head-title {
        font-family: OpenSans-Semibold;
      }
      .ant-card-extra {
        a {
          font-size: 13px;
          text-decoration: underline;
          font-style: italic;
        }
      }
    }
  }

  .ant-card-body {
    i {
      margin-right: 5px;
      color: gray;
    }

    p {
      font-family: OpenSans-Semibold;
      font-size: 13px;
    }

    .name {
      color: #2148c0;
      text-transform: uppercase;

      i {
        margin-right: 5px;
        color: #2148c0;
      }
    }

    .phone {
      color: red;
      text-transform: uppercase;

      i {
        margin-right: 5px;
        color: red;
      }
    }

    .item-order-info {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .label,
      .value {
        font-family: OpenSans-Semibold;
        font-size: 13px;
      }
    }
  }
}
</style>
