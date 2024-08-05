import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { NotificationsController } from "./notifications.controller";
import { NotificationGateway } from "src/notification-gateway/notification.gateway";

@Module({
  providers: [NotificationsService, NotificationGateway],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
