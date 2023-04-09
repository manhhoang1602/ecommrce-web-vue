<template>
  <div class="time-line-order-history">
    <a-timeline-item v-if="orderHistory.orderStatus === Constants.ORDER_STATUS.COMPLETE" color="blue">
      <div class="content-timeline">
        <div>
          <p>Đơn hàng hoàn thành</p>
          <div>
            {{ orderHistory.user.name }}
          </div>
        </div>
        <span class="time">
          {{ moment(orderHistory.createdAt).format("hh:mm:ss DD/MM/YYYY") }}
        </span>
      </div>
    </a-timeline-item>

    <a-timeline-item v-if="orderHistory.orderStatus === Constants.ORDER_STATUS.UNCONNECTED" color="purple">
      <div class="content-timeline">
        <div>
          <p>Không liên hệ được với khách hàng</p>
          <div class="user-process">
            {{ orderHistory.user.name || orderHistory.user.phone }}
          </div>
        </div>
        <span class="time">
          {{ moment(orderHistory.createdAt).format("hh:mm:ss DD/MM/YYYY") }}
        </span>
      </div>
    </a-timeline-item>

    <a-timeline-item v-if="orderHistory.orderStatus === Constants.ORDER_STATUS.CANCEL" color="red">
      <div class="content-timeline">
        <div>
          <p>Đơn hàng bị hủy</p>
          <div class="user-process">{{ orderHistory.user.name || orderHistory.user.phone }}</div>
        </div>
        <span class="time">
          {{ moment(orderHistory.createdAt).format("hh:mm:ss DD/MM/YYYY") }}
        </span>
      </div>
    </a-timeline-item>

    <a-timeline-item v-if="orderHistory.orderStatus === Constants.ORDER_STATUS.CONFIRM" color="green">
      <div class="content-timeline">
        <div>
          <p>Đơn hàng đã được xác nhận</p>
          <div class="user-process">
            {{ orderHistory.user.name || orderHistory.user.phone }}
          </div>
        </div>
        <span class="time">
          {{ moment(orderHistory.createdAt).format("hh:mm:ss DD/MM/YYYY") }}
        </span>
      </div>
    </a-timeline-item>

    <a-timeline-item v-if="orderHistory.orderStatus === Constants.ORDER_STATUS.PENDING" color="orange">
      <div class="content-timeline">
        <div>
          <p>Đơn hàng chờ xác nhận</p>
          <div class="user-process">{{ orderHistory.user.name || orderHistory.user.phone }}</div>
        </div>
        <span class="time">
          {{ moment(orderHistory.createdAt).format("hh:mm:ss DD/MM/YYYY") }}
        </span>
      </div>
    </a-timeline-item>

    <a-timeline-item v-if="orderHistory.orderStatus === Constants.ORDER_STATUS.DELIVERING" color="green">
      <div class="content-timeline">
        <div>
          <p>Đơn hàng đang vận chuyển</p>
          <div class="user-process">
            {{ orderHistory.user.name || orderHistory.user.phone }}
          </div>
        </div>
        <span class="time">
          {{ moment(orderHistory.createdAt).format("hh:mm:ss DD/MM/YYYY") }}
        </span>
      </div>
    </a-timeline-item>
  </div>
</template>

<script>
import { Constants } from "@/commons";
import moment from "moment";

export default {
  computed: {
    moment() {
      return moment;
    },
    Constants() {
      return Constants;
    },
  },
  props: ["orderHistory"],
};
</script>

<style lang="scss" scoped>
.time-line-order-history {
  .content-timeline {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .time {
      font-family: OpenSans-Semibold;
      font-style: italic;
    }

    p {
      margin-bottom: 1px;
    }

    .user-process {
      font-size: 12px;
      color: gray;
    }
  }
}
</style>
