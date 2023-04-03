import { Regex } from "@/commons/Regex";
import { Constants } from "@/commons/Constants";

export default class Utils {
  public static checkPhoneNumber(phone: string): boolean {
    return Regex.Phone.test(phone);
  }

  public static getIndex(page: number, index: number, limit: number = Constants.PAYLOAD.LIMIT): number {
    return (page - 1) * limit + index + 1;
  }

  public static getConfigPagination(page: number, total: number) {
    return {
      current: page,
      defaultPageSize: Constants.PAYLOAD.LIMIT,
      total: total,
    };
  }

  public static getIdCategorySelectComponent(valueCategorySelected: string): {
    parentId: number;
    childId: number | undefined;
  } {
    const value: { parentId: number; childId: number } = JSON.parse(valueCategorySelected);
    return {
      parentId: value.parentId,
      childId: value.childId,
    };
  }

  public static formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}
