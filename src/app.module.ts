import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "./database/typeorm/typeorm.module";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { ChatModule } from "./chat/chat.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
