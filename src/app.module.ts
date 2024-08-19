import { Module, NestModule, MiddlewareConsumer, Logger } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "./database/typeorm/typeorm.module";
import { RedisModule } from "./database/redis/redis.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { JobsModule } from "./modules/jobs/jobs.module";
import { JobMatchingModule } from "./modules/job-matching/job-matching.module";
import { ChatModule } from "./modules/chats/chat.module";
import { ChatGatewayModule } from "./modules/chat-gateway/chat-gateway.module";
import { NoticesModule } from "./modules/notices/notices.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { BlacklistModule } from "./modules/blacklists/blacklist.module";
// import { NotificationGatewayModule } from "./notification-gateway/notification-gateway.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";

import { LoggerMiddleware } from "./common/middleware/logger.middleware";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule,
    RedisModule,
    AuthModule,
    UsersModule,
    JobsModule,
    JobMatchingModule,
    ChatModule,
    ChatGatewayModule,
    ReportsModule,
    BlacklistModule,
    NoticesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger, LoggerMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
