import { Controller, Get, HttpStatus, UseGuards } from "@nestjs/common";
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
}
