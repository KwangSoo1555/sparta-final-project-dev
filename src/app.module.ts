import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "./database/typeorm/typeorm.module";
import { RedisModule } from "./database/redis/redis.module";

import { EmailModule } from "./modules/auth/common/email/email.module";
import { UserLocalModule } from "./modules/auth/local/local.module";
import { JwtModule } from "./modules/auth/common/jwt/jwt.module";
import { UserSignOutModule } from "./modules/auth/common/sign-out/sign-out.module";
import { FindPwModule } from "./modules/auth/common/find-pw/find-pw.module";
import { UsersModule } from "./modules/users/users.module";
import { JobsModule } from "./modules/jobs/jobs.module";
import { JobMatchingModule } from "./modules/job-matching/job-matching.module";
import { ChatModule } from "./modules/chat/chat.module";
import { NoticesModule } from "./modules/notices/notices.module";
import { ReportsModule } from "./modules/reports/reports.module";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { ChatGateway } from "./modules/chat-gateway/chat.gateway";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule,
    RedisModule,
    EmailModule,
    UserLocalModule,
    JwtModule,
    UserSignOutModule,
    FindPwModule,
    UsersModule,
    JobsModule,
    ChatModule,
    NoticesModule,
    ReportsModule,
    JobMatchingModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
