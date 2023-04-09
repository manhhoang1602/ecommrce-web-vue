<template>
  <a-menu v-model:selectedKeys="getSelectedKey" mode="inline" @click="handleClick">
    <!--    <a-menu-item :key="PATH.DASHBOARD.value">-->
    <!--      <i class="far fa-tachometer-alt ant-menu-item-icon"></i>-->
    <!--      <span class="nav-text">Tổng Quan</span>-->
    <!--    </a-menu-item>-->
    <a-menu-item :key="PATH.CATEGORY.value">
      <i class="fas fa-bars ant-menu-item-icon"></i>
      <span class="nav-text">Danh Mục Sản Phẩm</span>
    </a-menu-item>
    <a-menu-item :key="PATH.PRODUCT.value">
      <i class="fas fa-box-open ant-menu-item-icon"></i>
      <span class="nav-text">Sản Phẩm</span>
    </a-menu-item>
    <a-menu-item v-if="isAdminRole" :key="PATH.CUSTOMER.value">
      <i class="fas fa-users ant-menu-item-icon"></i>
      <span class="nav-text">Khách Hàng</span>
    </a-menu-item>
    <a-menu-item :key="PATH.ORDER.value">
      <i class="fas fa-cart-arrow-down ant-menu-item-icon"></i>
      <span class="nav-text">Đơn Hàng</span>
    </a-menu-item>
    <a-menu-item :key="PATH.VOUCHER.value">
      <i class="fad fa-user-tag" style="margin-right: 9px"></i>
      <span class="nav-text">Voucher</span>
    </a-menu-item>
    <a-menu-item :key="PATH.SETTING.value">
      <i class="fas fa-cogs" style="margin-right: 9px"></i>
      <span class="nav-text">Setting</span>
    </a-menu-item>
    <!--    <a-menu-item :key="PATH.NOTIFICATION.value">-->
    <!--      <i class="fas fa-bell ant-menu-item-icon"></i>-->
    <!--      <span class="nav-text">Thêm Thông báo</span>-->
    <!--    </a-menu-item>-->
    <!--    <a-menu-item :key="PATH.REPORT.value">-->
    <!--      <i class="fas fa-chart-area ant-menu-item-icon"></i>-->
    <!--      <span class="nav-text">Báo Cáo</span>-->
    <!--    </a-menu-item>-->
    <a-menu-item v-if="isAdminRole" :key="PATH.ACCOUNT.value">
      <i class="fas fa-user-circle ant-menu-item-icon"></i>
      <span class="nav-text">Tài Khoản</span>
    </a-menu-item>
  </a-menu>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { PATH } from "@/config";
import router from "@/router";
import { useUserInfo } from "@/services";

export default defineComponent({
  setup() {
    const { isAdminRole } = useUserInfo();
    const handleClick = (e: any) => {
      router.push(e.key);
    };

    const getSelectedKey = computed((): [string] => {
      return [router.currentRoute.value.fullPath];
    });

    return {
      handleClick,
      isAdminRole,
      getSelectedKey,
      PATH,
    };
  },
});
</script>

<style lang="scss">
.ant-menu-item {
  i {
    color: rgba(0, 0, 0, 0.7);
  }
}
.nav-text {
  font-family: OpenSans-Semibold;
  color: rgba(0, 0, 0, 0.7);
}
</style>
