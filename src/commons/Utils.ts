import { Regex } from "@/commons/Regex";
import { Constants } from "@/commons/Constants";
import type { UploadProps } from "ant-design-vue";
import type { IFile } from "@/commons/Interfaces";

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

  public static formatFileList(listFile: UploadProps["fileList"] | any): IFile[] {
    return listFile.map((file: any) => {
      if (!file.response) {
        return { ...file };
      } else {
        if (file.response) {
          return {
            uid: new Date().toDateString(),
            name: file.response.data.filename,
            status: "done",
            url: file.response.data.url,
          };
        }
      }
    });
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
}
