import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";

import { UsersEntity } from "src/entities/users.entity";
import { ChatsEntity } from "src/entities/chats.entity";
import { ChatRoomsEntity } from "src/entities/chat-rooms.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ChatsEntity, UsersEntity, ChatRoomsEntity]), AuthModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
