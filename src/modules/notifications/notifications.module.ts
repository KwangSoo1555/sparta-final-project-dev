import { forwardRef, Module } from "@nestjs/common";
// import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";

import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/modules/auth/auth.module";
import { ChatGateway } from "src/modules/chat-gateway/chat.gateway";

import { NotificationMessagesEntity } from "src/entities/notification-messages.entity";
import { NotificationLogsEntity } from "src/entities/notification-logs.entity";
import { UsersEntity } from "src/entities/users.entity";
import { JobsEntity } from "src/entities/jobs.entity";
import { ChatModule } from "src/modules/chats/chat.module";
import { ChatGatewayModule } from "src/modules/chat-gateway/chat-gateway.module";
import { NotificationsController } from "./notifications.controller";
import { RedisModule } from "src/database/redis/redis.module";
import { RedisPubsubService } from "src/database/redis/redis-pubsub.service";
// import { NotificationGatewayModule } from "src/notification-gateway/notification-gateway.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationMessagesEntity,
      NotificationLogsEntity,
      UsersEntity,
      JobsEntity,
    ]),
    AuthModule,
    JwtModule,
    ChatGatewayModule,
    RedisModule,
  ],
  providers: [NotificationsService, RedisPubsubService],
  exports: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
