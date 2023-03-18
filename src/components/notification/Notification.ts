import { notification } from "ant-design-vue";

export default class Notification {
  public static Info(message: string = "Thông báo", description: string) {
    notification.info({
      message: message,
      description: description,
    });
  }

  public static Success(message: string = "Thành công", description: string) {
    notification.success({
      message: message,
      description: description,
    });
  }

  public static Error(message: string = "Thông báo lỗi", description: string) {
    notification.error({
      message: message,
      description: description,
    });
  }
}
