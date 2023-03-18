import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import { PATH } from "@/config";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: PATH.LOGIN.value,
      name: PATH.LOGIN.name,
      component: Login,
    },
    {
      path: PATH.HOME.value,
      name: PATH.HOME.name,
      component: () => import("../views/Home.vue"),
      children: [
        {
          path: PATH.DASHBOARD.value,
          name: PATH.DASHBOARD.name,
          component: () => import("../pages/Dashboard.vue"),
        },
        {
          path: PATH.CATEGORY.value,
          name: PATH.CATEGORY.name,
          component: () => import("../pages/Category.vue"),
        },
        {
          path: PATH.PRODUCT.value,
          name: PATH.PRODUCT.name,
          component: () => import("../pages/Product.vue"),
        },
        {
          path: PATH.ADD_PRODUCT.value,
          name: PATH.ADD_PRODUCT.name,
          component: () => import("../pages/CUProduct.vue"),
        },
        {
          path: PATH.CUSTOMER.value,
          name: PATH.CUSTOMER.name,
          component: () => import("../pages/Customer.vue"),
        },
        {
          path: PATH.ORDER.value,
          name: PATH.ORDER.name,
          component: () => import("../pages/Order.vue"),
        },
        {
          path: PATH.NOTIFICATION.value,
          name: PATH.NOTIFICATION.name,
          component: () => import("../pages/Notification.vue"),
        },
        {
          path: PATH.REPORT.value,
          name: PATH.REPORT.name,
          component: () => import("../pages/Report.vue"),
        },
        {
          path: PATH.ACCOUNT.value,
          name: PATH.ACCOUNT.name,
          component: () => import("../pages/Account.vue"),
        },
      ],
    },
  ],
});

export default router;
