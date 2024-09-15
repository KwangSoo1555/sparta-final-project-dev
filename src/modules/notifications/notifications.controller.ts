import { Controller, Delete, Get, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { RequestJwtByHttp } from "src/common/customs/decorators/jwt-http-request";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAccessGuards } from "../auth/strategies/jwt-strategy";

@ApiTags("notifications")
@ApiBearerAuth()
@UseGuards(JwtAccessGuards)
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * notificationsData 조회
   * @param receiverId
   * @returns
   */
  @Get() //내가 받은 모든 알림 목록 조회
  async findAllNotifications(@RequestJwtByHttp() { user: { id: receiverId } }) {
    const findAllNotifications = await this.notificationsService.findAllNotifications(+receiverId);

    return {
      statusCode: HttpStatus.OK,
      message: "알림 목록 조회 완료",
      data: findAllNotifications,
    };
  }

  /**
  유저가 받은 notifications 전체 삭제
  * @param receiverId
  * @returns
   */
  @Delete()
  async deleteAllNotifications(@RequestJwtByHttp() { user: { id: receiverId } }) {
    await this.notificationsService.deleteAllNotifications(+receiverId);

    return {
      statusCode: HttpStatus.OK,
      message: "받은 알림 전체 삭제 완료",
    };
  }

  /**
  유저가 받은 notifications 하나 삭제
  * @param receiverId
  * @param notificationLogId
  * @returns
   */
  @Delete("/:notificationLogId")
  async deleteNotificationByLogId(
    @Param("notificationLogId") notificationLogId: number,
    @RequestJwtByHttp() { user: { id: receiverId } },
  ) {
    await this.notificationsService.deleteSpecificNotifications(receiverId, notificationLogId);

    return {
      statusCode: HttpStatus.OK,
      message: "받은 알림 삭제 완료",
    };
  }
}
