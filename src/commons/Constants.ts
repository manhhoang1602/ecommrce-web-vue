import {
  EOrderStatus,
  EOutOfStock,
  EProductClassType,
  EProductMediaType,
  EProductStatus,
  ERole,
  ESale,
  EStatus,
} from "@/commons/enums";

const Constants = {
  STATUS: {
    INACTIVE: EStatus.inactive,
    ACTIVE: EStatus.active,
  },
  ROLE: {
    ADMIN: ERole.Admin,
    EMPLOYEE: ERole.Employee,
    USER: ERole.User,
  },
  PAYLOAD: {
    PAGE: 1,
    LIMIT: 12,
  },
  OUT_OF_STOCK: {
    UNAVAILABLE: EOutOfStock.unavailable,
    AVAILABLE: EOutOfStock.available,
  },
  PRODUCT_STATUS: {
    NORMAL: EProductStatus.normal,
    BEST_SELLER: EProductStatus.bestSeller,
    COMING_SOON: EProductStatus.comingSoon,
    HOT: EProductStatus.hot,
    VIP: EProductStatus.vip,
  },
  PRODUCT_TYPE_CLASS: {
    FIRST: EProductClassType.first,
    SECOND: EProductClassType.second,
    FIRST_CLASS_NAME: EProductClassType.firstClassName,
    SECOND_CLASS_NAME: EProductClassType.secondClassName,
  },
  ORDER_STATUS: {
    PENDING: EOrderStatus.pending,
    CONFIRM: EOrderStatus.confirm,
    DELIVERING: EOrderStatus.delivery,
    COMPLETE: EOrderStatus.complete,
    CANCEL: EOrderStatus.cancel,
    UNCONNECTED: EOrderStatus.unconnected,
  },
  SALES_PRODUCT_STATUS: {
    SALES: ESale.sale,
    NOT_SALES: ESale.notSale,
  },
  PRODUCT_MEDIA_TYPE: {
    IMAGE: EProductMediaType.image,
    VIDEO: EProductMediaType.video,
  },
};

export { Constants };
