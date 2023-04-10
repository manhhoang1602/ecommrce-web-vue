import { ref } from "vue";
import { Baservices, Constants } from "@/commons";
import Utils from "@/commons/Utils";
import moment from "moment";
import type { IItemTableOrder, IPayloadOrder, IResOrder } from "@/commons/interface/Order.interface";

function useTableProductOrderDetailData(orderDetail?: IResOrder): any {
  if (orderDetail) {
    return orderDetail.listProduct.map((value, index) => {
      const price: number = Number(value.mainProduct.price ? value.mainProduct.price : value.product?.price);
      const salesPrice = price - (price / 100) * value.discountPercent;

      const firstClassName: any = value.product?.firstClassName;
      const secondClassName: any = value.product?.secondClassName;

      const productClass =
        "(" + (firstClassName || "") + (secondClassName ? " - " : "") + (secondClassName || "") + ")";
      return {
        index: index + 1,
        name: value.mainProduct.name + (firstClassName ? productClass : ""),
        total: value.total,
        price: Utils.formatNumber(salesPrice),
        totalPrice: Utils.formatNumber(salesPrice * value.total),
      };
    });
  }

  return [];
}

function usePricePerOrderByOrderStatus(
  order?: IResOrder,
  orderStatus?: number,
  isGetCancelOrder?: boolean
): {
  totalPrice: number;
  totalProduct: number;
  totalPriceFormat: string;
} {
  if (order) {
    return order.listProduct.reduce(
      (previousValue, currentValue) => {
        const price = Number(currentValue.mainProduct.price || currentValue.product?.price);
        const totalProduct = currentValue.total;
        const salePrice = price - (price / 100) * currentValue.discountPercent;
        const totalPrice = totalProduct * salePrice;

        if (orderStatus !== undefined && orderStatus === order.orderStatus) {
          return {
            totalPrice: previousValue.totalPrice + totalPrice,
            totalProduct: previousValue.totalProduct + totalProduct,
            totalPriceFormat: Utils.formatNumber(previousValue.totalPrice + totalPrice) + " đ",
          };
        }

        if (order.orderStatus !== Constants.ORDER_STATUS.CANCEL) {
          return {
            totalPrice: previousValue.totalPrice + totalPrice,
            totalProduct: previousValue.totalProduct + totalProduct,
            totalPriceFormat: Utils.formatNumber(previousValue.totalPrice + totalPrice) + " đ",
          };
        }

        if (isGetCancelOrder) {
          return {
            totalPrice: previousValue.totalPrice + totalPrice,
            totalProduct: previousValue.totalProduct + totalProduct,
            totalPriceFormat: Utils.formatNumber(previousValue.totalPrice + totalPrice) + " đ",
          };
        }

        return previousValue;
      },
      {
        totalPrice: -useDiscountVoucherPrice(order),
        totalProduct: 0,
        totalPriceFormat: "",
      }
    );
  }

  return {
    totalPrice: 0,
    totalPriceFormat: "0 đ",
    totalProduct: 0,
  };
}

function usePricePerOrder(order?: IResOrder): {
  totalPrice: number;
  totalProduct: number;
  totalPriceFormat: string;
} {
  if (order && order.orderStatus !== Constants.ORDER_STATUS.CANCEL) {
    return order.listProduct.reduce(
      (previousValue, currentValue) => {
        const price = Number(currentValue.mainProduct.price || currentValue.product?.price);
        const totalProduct = currentValue.total;
        const salePrice = price - (price / 100) * currentValue.discountPercent;
        const totalPrice = totalProduct * salePrice;

        return {
          totalPrice: previousValue.totalPrice + totalPrice,
          totalProduct: previousValue.totalProduct + totalProduct,
          totalPriceFormat: Utils.formatNumber(previousValue.totalPrice + totalPrice) + " đ",
        };
      },
      {
        totalPrice: 0,
        totalProduct: 0,
        totalPriceFormat: "",
      }
    );
  }

  return {
    totalPrice: 0,
    totalPriceFormat: "0 đ",
    totalProduct: 0,
  };
}

function useDiscountVoucherPrice(order?: IResOrder): number {
  if (order) {
    if (!order.voucher) {
      return 0;
    }
    const { totalPrice } = usePricePerOrder(order);
    const voucher = order.voucher;
    const discountPercent = voucher.value;
    const { minPriceApply, maxValue } = voucher;

    if (totalPrice < minPriceApply) {
      return 0;
    }

    const priceDiscount = (totalPrice / 100) * discountPercent;

    if (priceDiscount > maxValue) {
      return maxValue;
    }

    return priceDiscount;
  }

  return 0;
}

function useListOrder() {
  const loading = ref<boolean>(false);
  const total = ref<number>(0);

  const getListOrder = async (payload: IPayloadOrder): Promise<IItemTableOrder[]> => {
    try {
      loading.value = true;
      const res = await Baservices.getMethod(`/order/list`, payload);

      total.value = res.body.payload.total;
      loading.value = false;

      return res.body.payload.data.map((value: IResOrder, index: number) => {
        const { totalPriceFormat, totalProduct } = usePricePerOrderByOrderStatus(value, undefined, true);
        return {
          ...value,
          index: Utils.getIndex(payload.page, index),
          createdAt: moment(value.createdAt).format("DD/MM/YYYY"),
          key: value.id,
          countProduct: totalProduct,
          totalPrice: totalPriceFormat,
        };
      });
    } catch (e) {
      loading.value = false;
      console.error(e);
      return [];
    }
  };

  return {
    loading,
    total,
    getListOrder,
  };
}

function useDetailOrder() {
  const loading = ref<boolean>(false);

  const getDetailOrder = async (id: number): Promise<IResOrder | null> => {
    try {
      loading.value = true;
      const res = await Baservices.getMethod(`/order/${id}`);

      loading.value = false;

      return res.body.payload.data;
    } catch (e) {
      loading.value = false;
      console.error(e);
      return null;
    }
  };

  return {
    loading,
    getDetailOrder,
  };
}

export {
  useTableProductOrderDetailData,
  usePricePerOrderByOrderStatus,
  useDiscountVoucherPrice,
  useListOrder,
  usePricePerOrder,
  useDetailOrder,
};
