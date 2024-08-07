import { forwardRef, Module } from "@nestjs/common";
// import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { NotificationGateway } from "src/modules/notifications/notification.gateway";

import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "src/database/redis/redis.module";
import { AuthModule } from "src/modules/auth/auth.module";
import { ChatGateway } from "src/modules/chat-gateway/chat.gateway";

import { NotificationMessagesEntity } from "src/entities/notification-messages.entity";
import { NotificationLogsEntity } from "src/entities/notification-logs.entity";
import { UsersEntity } from "src/entities/users.entity";
import { JobsEntity } from "src/entities/jobs.entity";
import { ChatModule } from "src/modules/chat/chat.module";
import { ChatGatewayModule } from "src/modules/chat-gateway/chat-gateway.module";
import { NotificationsController } from "./notifications.controller";
// import { NotificationGatewayModule } from "src/notification-gateway/notification-gateway.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationMessagesEntity,
      NotificationLogsEntity,
      UsersEntity,
      JobsEntity,
    ]),
    RedisModule,
    AuthModule,
    JwtModule,
    ChatGatewayModule,
  ],
  providers: [NotificationsService, NotificationGateway],
  exports: [NotificationsService, NotificationGateway],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
