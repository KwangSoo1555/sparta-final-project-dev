import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "./database/typeorm/typeorm.module";
import { RedisModule } from "./database/redis/redis.module";


import { JobsModule } from './jobs/jobs.module';
import { UserLocalModule } from "./modules/auth/local/local.module";
import { EmailModule } from "./modules/auth/common/email/email.module";
import { JwtModule } from "./modules/auth/common/jwt/jwt.module";
import { UserSignOutModule } from "./modules/auth/common/sign-out/sign-out.module";
import { UsersModule } from "./modules/users/users.module";
import { FindAccountModule } from './modules/auth/common/find-account/find-account.module';

import { AppService } from "./app.service";
import { AppController } from "./app.controller";


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule,
    JobsModule,
    RedisModule,
    EmailModule,
    UserLocalModule,
    JwtModule,
    UserSignOutModule,
    UsersModule,
    FindAccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
