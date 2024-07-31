import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "../chat/chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatsEntity } from "src/entities/chats.entity";
import { UsersEntity } from "src/entities/users.entity";
import { ChatRoomsEntity } from "src/entities/chat-rooms.entity";
import { AuthModule } from "../auth/auth.module";
import { RedisConfig } from "src/database/redis/redis.config";
import { AccessTokenStrategy } from "../auth/strategies/jwt-strategy";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [TypeOrmModule.forFeature([ChatsEntity, UsersEntity, ChatRoomsEntity]), AuthModule],
  providers: [
    ChatGateway,
    ChatService,
    RedisConfig,
    AccessTokenStrategy,
    JwtService,
    ConfigService,
  ],
})
export class ChatGatewayModule {}
