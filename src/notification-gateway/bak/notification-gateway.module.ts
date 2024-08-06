import { forwardRef, Module } from "@nestjs/common";
// import { NotificationGateway } from "./notification.gateway";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersEntity } from "src/entities/users.entity";
import { JobsEntity } from "src/entities/jobs.entity";
import { NotificationMessagesEntity } from "src/entities/notification-messages.entity";
import { NotificationLogsEntity } from "src/entities/notification-logs.entity";
import { RedisConfig } from "src/database/redis/redis.config";
import { AccessTokenStrategy } from "src/modules/auth/strategies/jwt-strategy";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { NotificationsService } from "src/notifications/notifications.service";
import { AuthModule } from "src/modules/auth/auth.module";
import { NotificationsModule } from "src/notifications/notifications.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      JobsEntity,
      NotificationMessagesEntity,
      NotificationLogsEntity,
    ]),
    AuthModule,
    forwardRef(() => NotificationsModule),
  ],
  providers: [
    // NotificationGateway,
    NotificationsService,
    RedisConfig,
    AccessTokenStrategy,
    JwtService,
    ConfigService,
  ],
})
export class NotificationGatewayModule {}
