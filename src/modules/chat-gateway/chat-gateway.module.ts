import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "../chat/chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatsEntity } from "src/entities/chats.entity";
import { UsersEntity } from "src/entities/users.entity";
import { ChatRoomsEntity } from "src/entities/chat-rooms.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ChatsEntity, UsersEntity, ChatRoomsEntity])],
  providers: [ChatGateway, ChatService],
})
export class ChatGatewayModule {}
