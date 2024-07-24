import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "./database/typeorm/typeorm.module";
import { RedisModule } from "./database/redis/redis.module";

import { UserLocalModule } from "./modules/auth/local/local.module";
import { EmailModule } from "./modules/auth/common/email/email.module";
import { JwtModule } from "./modules/auth/common/jwt/jwt.module";
import { UsersModule } from "./modules/users/users.module";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { ChatModule } from "./modules/chat/chat.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule,
    RedisModule,
    EmailModule,
    JwtModule,
    UserLocalModule,
    UsersModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
