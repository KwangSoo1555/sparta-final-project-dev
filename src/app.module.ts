import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "./database/typeorm/typeorm.module";
import { RedisModule } from "./database/redis/redis.module";

import { AuthCommonModule } from "./modules/auth/common/common.module";
import { UserLocalModule } from "./modules/auth/local/local.module";
import { SocialPassportModule } from "./modules/auth/social/social-passport.module";
import { UsersModule } from "./modules/users/users.module";
import { JobsModule } from "./modules/jobs/jobs.module";
import { JobMatchingModule } from "./modules/job-matching/job-matching.module";
import { ChatModule } from "./modules/chat/chat.module";
import { NoticesModule } from "./modules/notices/notices.module";
import { ReportsModule } from "./modules/reports/reports.module";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule,
    RedisModule,
    AuthCommonModule,
    UserLocalModule,
    SocialPassportModule,
    UsersModule,
    JobsModule,
    ChatModule,
    NoticesModule,
    ReportsModule,
    JobMatchingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
