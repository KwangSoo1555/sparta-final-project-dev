import { Controller, Get, HttpStatus } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}


  //알림 생성 api
  @Get("notification/:notification_id")
  async createNotification{
    @Param("notification_id")
    notificationId : number,
  } {
    const createNotification = await this.notificationsService.createNotification(notificationId)

    return {
        statusCode : HttpStatus.OK,
        message : "알림이 생성되었습니다.",
        data : createNotification
    }
  }
}
